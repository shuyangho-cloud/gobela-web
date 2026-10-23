import { authenticate, checked, command, founder } from './db';
import { actionPayload, campaignDraft, categories, choice, httpsUrl, integer, object, Problem, recommend, safeError, text, timestamp, uuid, type Listing } from './domain';
import { dispatch } from './connector';
import {assetInventory,marketingAssetResponse} from './marketing-assets';
import type {CanonicalMarketingRow} from './marketing-catalogue';
import {productionPacket} from './marketing-production';
import {marketingBriefing,campaignFromProposal,type MarketingListing} from './marketing';
import { answerFounder, describeRecommendations } from './assistant';

const founderTables = ['knowledge', 'catalogue', 'partners', 'tasks', 'campaigns', 'actions', 'audit', 'enquiries', 'control', 'reports', 'consents'] as const;
const familyTables = ['children', 'health', 'reminders', 'memory'] as const;
const circleFields = 'id,owner_id,category,title,body,visited_on,photo_path,status,verification_kind,created_at';
function date(value: unknown) {
  const result = text(value, 'date', 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(result) || !Number.isFinite(Date.parse(result)) || new Date(result).toISOString().slice(0,10) !== result) throw new Problem(400, 'Invalid date');
  return result;
}
function futureDate(value: unknown) {
  const result = timestamp(value, 'due time');
  if (Date.parse(result) <= Date.now()) throw new Problem(400, 'Choose a future reminder time');
  return result;
}
export async function handle(request: Request, path: string[]) {
  try {
    const { db, user } = await authenticate(request);
    const [area, resource, id] = path;
    const method = request.method;
    if (path.length > 3) throw new Problem(404, 'Route not found');
    let body: Record<string, unknown> = {};
    if (method === 'POST' || method === 'PATCH') {
      // Check actual streamed bytes, not only the optional Content-Length header.
      const reader = request.body?.getReader();
      let size = 0; const chunks: Uint8Array[] = [];
      if (reader) while (true) {
        const chunk = await reader.read(); if (chunk.done) break;
        size += chunk.value.length;
        if (size > 24000) { await reader.cancel(); throw new Problem(413, 'Request too large'); }
        chunks.push(chunk.value);
      }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      try { body = object(JSON.parse(new TextDecoder().decode(bytes))); } catch (e) { if (e instanceof Problem) throw e; throw new Problem(400, 'Invalid JSON'); }
    }
    let result: unknown;
    if (area === 'founder') {
      await founder(db, user.id);
      if(resource==='marketing-assets' && id && method==='GET')return await marketingAssetResponse(id);
      if((resource==='marketing' && (method==='GET'||method==='POST'))||(resource==='marketing-production'&&method==='POST'&&id)) {
        const [listings,outcomes,campaigns,canonical,assets]=await Promise.all([
          db.from('gb_catalogue_retrieval').select('id,title,provider,category,area,price_cents,source_url,verified_at,active').eq('active',true).order('verified_at',{ascending:false}).limit(1000),
          db.rpc('gb_campaign_results'),
          db.from('gb_campaigns').select('id,title,draft').order('created_at',{ascending:false}).limit(100),
          db.from('enrichment_classes').select('id,name,provider,is_active,trial_price,location').in('id',['minisport-explorers-1','bubbles-preschool-1','elevate-ballet-1','codeninja-scratch-1']),
          assetInventory()
        ]);
        const briefing=marketingBriefing({listings:checked(listings) as MarketingListing[],outcomes:checked(outcomes),campaigns:checked(campaigns),canonical:checked(canonical) as CanonicalMarketingRow[]});
        if(method==='POST') {
          const proposal=briefing.proposals.find(p=>p.id===(id||body.strategy_id));
          if(!proposal)throw new Problem(400,'Unknown marketing recommendation');
          // Stable UUID + ignoreDuplicates makes repeat/concurrent preparation safe.
          // Never overwrite a founder-edited brief or create a channel action here.
          checked(await db.from('gb_campaigns').upsert(campaignFromProposal(proposal),{onConflict:'id',ignoreDuplicates:true}).select());
          const saved=checked(await db.from('gb_campaigns').select('*').eq('id',proposal.campaignId).single());
          if(resource==='marketing-production') {
            const packet=productionPacket(proposal,saved);
            result=checked(await db.rpc('gb_save_marketing_packet',{target_campaign:saved.id,production_packet:packet}));
          } else result=saved;
        } else result={...briefing,assets,saved_packet:checked(campaigns).find(c=>c.id==='af240001-2026-4024-8024-000000000001')?.draft?.production_packet??null};
      } else if(resource==='results' && method==='GET') {
        result={campaigns:checked(await db.rpc('gb_campaign_results')),coverage:'Only explicitly linked enquiries and booking outcomes. Ad impressions, clicks and unlinked bookings are not attributed.'};
      } else if(resource==='legacy-moderate' && method==='POST') {
        if(typeof body.hidden!=='boolean')throw new Problem(400,'Moderation choice required');
        result=checked(await db.rpc('gb_moderate_legacy_review',{target_review:text(body.review_id,'legacy review id',200),hide:body.hidden}));
      } else if(resource==='legacy-circle' && method==='GET') {
        result={reviews:checked(await db.from('gobela_reviews').select('id,type,tip,is_hidden,posted_at').order('posted_at',{ascending:false}).limit(100)),reports:checked(await db.from('user_reports').select('id,review_id,reason,status,created_at').limit(100)),flags:checked(await db.from('review_flags').select('review_id,reason,flagged_at').limit(100))};
      } else if (resource === 'ask' && method === 'POST') {
        await command(db,'consume',{});
        const question=text(body.question,'question',1000);
        const rows=checked(await db.from('gb_knowledge').select('id,title,content,verified_at').order('verified_at',{ascending:false}).limit(200));
        const words=question.toLowerCase().match(/[a-z0-9]{3,}/g) || [];
        const sources=rows.map(row=>({...row,score:words.filter(word=>`${row.title} ${row.content}`.toLowerCase().includes(word)).length}))
          .filter(row=>row.score>0).sort((a,b)=>b.score-a.score).slice(0,8);
        result={reply:await answerFounder(question,sources),sources,coverage:'Searches up to 200 latest knowledge records. Verify dated information before acting. No private family health records are queried.'};
      } else if (resource === 'summary' && method === 'GET') {
        const results = await Promise.all(founderTables.map(async table => [table, checked(await db.from(`gb_${table}`).select('*').limit(100))] as const));
        result = { records: Object.fromEntries(results), coverage: 'At most 100 records per collection. Enquiries are recorded interest, not paid bookings. No ad-channel or revenue totals are connected.' };
      } else if (resource === 'circle' && method === 'GET') {
        result = checked(await db.from('gb_circle').select(circleFields).order('created_at', { ascending: false }).limit(100));
      } else if (resource === 'briefing' && method === 'GET') {
        const tasks = checked(await db.from('gb_tasks').select('*').neq('status', 'done').limit(50));
        const approvals = checked(await db.from('gb_actions').select('id,status,created_at').eq('status', 'pending').limit(50));
        const partners = checked(await db.from('gb_partners').select('id,name,next_action,due_at').not('due_at','is',null).lte('due_at',new Date().toISOString()).limit(50));
        result = { tasks, approvals, overdue_partners: partners, generated_at: new Date().toISOString() };
      } else if (resource === 'controls' && method === 'POST') {
        if (typeof body.paused !== 'boolean' || typeof body.execution_enabled !== 'boolean') throw new Problem(400, 'Invalid controls');
        result = await command(db, 'controls', { paused: body.paused, execution_enabled: body.execution_enabled, daily_budget_cents: integer(body.daily_budget_cents,'budget') });
      } else if (resource === 'actions' && method === 'POST') {
        result = await command(db, 'request', { payload: actionPayload(body.payload), reserved_cents: integer(body.reserved_cents,'maximum cost') });
      } else if (resource === 'actions' && method === 'PATCH' && id) {
        const op = choice(body.operation, ['approve','reject','execute','reconcile'] as const,'operation');
        if (op === 'execute') {
          if (process.env.SUPERBRAIN_EXECUTION_ENABLED !== 'true' || (!['test','meta'].includes(process.env.SUPERBRAIN_ADAPTER_MODE || '') && (!process.env.SUPERBRAIN_DISPATCH_URL || !process.env.SUPERBRAIN_DISPATCH_SECRET))) throw new Problem(503, 'Execution disabled');
          const action = await command(db, 'claim', { id: uuid(id) });
          try {
            const receipt = await dispatch(action);
            result = await command(db, 'complete', { id, ...receipt });
          } catch {
            // An interrupted request may remain executing. Neither state is retryable.
            await command(db, 'uncertain', { id }).catch(() => undefined);
            throw new Problem(502, 'Outcome uncertain. Check the channel receipt and reconcile this action; do not resend.');
          }
        } else result = await command(db, op, { id: uuid(id), ...(op === 'reconcile' ? { receipt_id: text(body.receipt_id,'receipt',500), actual_cost_cents: integer(body.actual_cost_cents,'actual cost') } : {}) });
      } else if (resource === 'moderate' && method === 'POST') {
        result = await command(db, 'moderate', { id: uuid(body.id), status: choice(body.status,['published','hidden'] as const,'moderation status') });
      } else if (resource === 'verify-review' && method === 'POST') {
        result = await command(db, 'verify_review', { id: uuid(body.id), kind: choice(body.kind,['booking','attendance'] as const,'evidence type'), evidence: text(body.evidence,'evidence',1000) });
      } else if (resource && ['knowledge','catalogue','partners','tasks','campaigns','clinics'].includes(resource) && (method === 'POST' || (method === 'PATCH' && !!id && !['partners','tasks'].includes(resource)))) {
        let row: Record<string, unknown>;
        if (resource === 'knowledge') row = { title: text(body.title,'title',200), content: text(body.content,'content',10000), scope: choice(body.scope,['public','business'] as const,'scope'), source_url: httpsUrl(body.source_url), verified_at: timestamp(body.verified_at,'verification time') };
        else if (resource === 'catalogue') {
          const min = integer(body.min_age,'minimum age',0,100); const max = integer(body.max_age,'maximum age',min,100);
          row = { title: text(body.title,'title',200), provider: text(body.provider,'provider',200), category: choice(body.category,categories,'category'), area: text(body.area,'area',200), min_age: min,max_age: max,price_cents: integer(body.price_cents,'price'), source_url: httpsUrl(body.source_url),verified_at: timestamp(body.verified_at,'verification time'),active: true };
          if(body.legacy_id)row.legacy_id=text(body.legacy_id,'legacy listing id',200);
          if(body.min_age_months !== undefined || body.max_age_months !== undefined){
            const minMonths=integer(body.min_age_months,'minimum months',0,1200);
            row.min_age_months=minMonths;row.max_age_months=integer(body.max_age_months,'maximum months',minMonths,1200);
          }
        } else if (resource === 'partners') row = { name: text(body.name,'name',200),contact: typeof body.contact === 'string' ? body.contact.slice(0,300) : '',stage: choice(body.stage || 'prospect',['prospect','contacted','interested','onboarding','active','closed'] as const,'stage'),next_action: typeof body.next_action === 'string' ? body.next_action.slice(0,1000) : '',due_at: body.due_at ? timestamp(body.due_at,'due time') : null };
        else if (resource === 'tasks') row = { title: text(body.title,'title',300),status:'open',due_at: body.due_at ? timestamp(body.due_at,'due time') : null };
        else if (resource === 'clinics') row = { name: text(body.name,'name',200),specialty:text(body.specialty,'specialty',200),area:text(body.area,'area',200),source_url:httpsUrl(body.source_url),verified_at:timestamp(body.verified_at,'verification time') };
        else {
          const input = { title:text(body.title,'title',200),audience:text(body.audience,'audience',300),category:choice(body.category,categories,'category'),objective:text(body.objective,'objective',1000) };
          row = { ...input,draft:campaignDraft(input) };
        }
        result = checked(await (method === 'PATCH' ? db.from(`gb_${resource}`).update(row).eq('id',uuid(id)) : db.from(`gb_${resource}`).insert(row)).select().single());
      } else if (resource === 'tasks' && id && method === 'PATCH') {
        result = checked(await db.from('gb_tasks').update({ status:choice(body.status,['open','doing','done'] as const,'status') }).eq('id',uuid(id)).select().single());
      } else if (resource === 'partners' && id && method === 'PATCH') {
        result = checked(await db.from('gb_partners').update({ stage:choice(body.stage,['prospect','contacted','interested','onboarding','active','closed'] as const,'stage'),next_action:text(body.next_action,'next action',1000),due_at:body.due_at ? timestamp(body.due_at,'due time') : null }).eq('id',uuid(id)).select().single());
      } else if (resource === 'enquiries' && id && method === 'PATCH') {
        result = checked(await db.from('gb_enquiries').update({ status:choice(body.status,['new','contacted','resolved'] as const,'status') }).eq('id',uuid(id)).select().single());
      } else throw new Problem(404,'Route not found');
    } else if (area === 'parent') {
      if (resource === 'consent' && method === 'POST') {
        if(typeof body.granted!=='boolean')throw new Problem(400,'Consent choice required');
        result=checked(await db.from('gb_family_consent').upsert({owner_id:user.id,version:'2026-10-23',granted:body.granted,updated_at:new Date().toISOString()}).select().single());
      } else if (resource === 'consent' && method === 'GET') {
        result=checked(await db.from('gb_family_consent').select('*').eq('owner_id',user.id));
      } else if (resource === 'recommend' && method === 'POST') {
        await command(db,'consume',{});
        const months=body.age_months === undefined ? undefined : integer(body.age_months,'age in months',0,1200);
        if(months !== undefined && body.age !== undefined && Math.floor(months/12)!==body.age)throw new Problem(400,'Age fields disagree');
        const filters = { age: months === undefined ? integer(body.age,'age',0,100) : Math.floor(months/12),age_months:months,budget_cents: integer(body.budget_cents,'budget'),area: typeof body.area === 'string' ? body.area.slice(0,100) : undefined,category:body.category ? choice(body.category,categories,'category') : undefined };
        // Filter before limiting so an unrelated first page cannot hide eligible records.
        let query = db.from('gb_catalogue_retrieval').select('*').eq('active',true).lte('min_age_months',months ?? filters.age*12).gte('max_age_months',months ?? filters.age*12).lte('price_cents',filters.budget_cents).gte('verified_at',new Date(Date.now()-30*86400000).toISOString()).lte('verified_at',new Date().toISOString()).order('price_cents');
        if (filters.category) query = query.eq('category',filters.category);
        const rows = checked(await query.limit(1000)) as Listing[];
        const listings = recommend(rows,filters);
        result = { listings, reply:await describeRecommendations(typeof body.question === 'string' ? body.question.slice(0,1000) : 'Find family activities',listings),coverage:'Up to 1000 eligible records checked. Availability is not connected.' };
      } else if(resource==='bookings' && id && method==='PATCH') {
        await command(db,'consume',{});
        const enquiryId=uuid(body.enquiry_id);
        const enquiry=checked(await db.from('gb_enquiries').select('listing_id').eq('id',enquiryId).eq('owner_id',user.id).single());
        const listing=checked(await db.from('gb_catalogue').select('legacy_id').eq('id',enquiry.listing_id).single());
        if(!listing.legacy_id)throw new Problem(409,'This enquiry has no existing booking listing');
        result=checked(await db.from('trial_bookings').update({superbrain_enquiry_id:enquiryId}).eq('id',uuid(id)).eq('profile_id',user.id).eq('event_id',listing.legacy_id).or(`superbrain_enquiry_id.is.null,superbrain_enquiry_id.eq.${enquiryId}`).select('id,superbrain_enquiry_id').single());
      } else if (resource === 'enquiries' && method === 'POST') {
        await command(db,'consume',{});
        result = await command(db,'enquire',{ listing_id:uuid(body.listing_id),message:text(body.message,'message',2000),tracking_code:typeof body.tracking_code === 'string' ? body.tracking_code.slice(0,100) : null });
      } else if (resource === 'knowledge' && method === 'GET') result = checked(await db.from('gb_knowledge').select('id,title,content,source_url,verified_at').eq('scope','public').limit(100));
      else if (resource === 'clinics' && method === 'GET') result = checked(await db.from('gb_clinics').select('*').limit(100));
      else if (resource === 'export' && method === 'GET') {
        const data = await Promise.all(familyTables.map(async table => [table,checked(await db.from(`gb_${table}`).select('*').eq('owner_id',user.id))]));
        result = { exported_at:new Date().toISOString(),...Object.fromEntries(data),consent:checked(await db.from('gb_family_consent').select('*').eq('owner_id',user.id)) };
      } else if (resource && familyTables.includes(resource as typeof familyTables[number])) {
        const table = `gb_${resource}`;
        if (method === 'GET') result = checked(await db.from(table).select('*').eq('owner_id',user.id).limit(500));
        else if (method === 'DELETE' && id) { checked(await db.from(table).delete().eq('id',uuid(id)).eq('owner_id',user.id).select('id').single()); result={ deleted:true }; }
        else if (method === 'PATCH' && id && resource === 'reminders') {
          if (typeof body.completed !== 'boolean') throw new Problem(400,'Invalid completion');
          result=checked(await db.from(table).update({completed:body.completed}).eq('id',uuid(id)).eq('owner_id',user.id).select().single());
        } else if (method === 'POST' || (method === 'PATCH' && id && resource !== 'reminders')) {
          let row: Record<string,unknown> = {owner_id:user.id};
          if (resource === 'children') {
            const birth = date(body.birth_date); if (birth > new Date().toISOString().slice(0,10)) throw new Problem(400,'Birth date cannot be in the future');
            row={...row,name:text(body.name,'name',100),birth_date:birth};
          } else if (resource === 'memory') {
            if (body.consent !== true) throw new Problem(400,'Choose to save this preference first');
            row={...row,fact:text(body.fact,'preference',300)};
          } else if (resource === 'health') {
            const kind=choice(body.kind,['height_cm','weight_kg','milestone','note'] as const,'record type');
            const value=text(body.value,'value',1000);
            if ((kind === 'height_cm' || kind === 'weight_kg') && (!Number.isFinite(Number(value)) || Number(value)<=0 || Number(value)>500)) throw new Problem(400,'Invalid measurement');
            row={...row,child_id:uuid(body.child_id),kind,value,recorded_at:timestamp(body.recorded_at,'recorded time')};
          } else {
            const zone=text(body.timezone || 'Asia/Singapore','time zone',100);
            try { new Intl.DateTimeFormat('en',{timeZone:zone}); } catch { throw new Problem(400,'Invalid time zone'); }
            row={...row,child_id:uuid(body.child_id),title:text(body.title,'reminder',300),due_at:futureDate(body.due_at),timezone:zone,kind:choice(body.kind,['vaccination','health_check','medication','appointment'] as const,'reminder type')};
          }
          result=checked(await (method === 'PATCH' ? db.from(table).update(row).eq('id',uuid(id)).eq('owner_id',user.id) : db.from(table).insert(row)).select().single());
        } else throw new Problem(404,'Route not found');
      } else throw new Problem(404,'Route not found');
    } else if (area === 'circle') {
      if(process.env.SUPERBRAIN_CIRCLE_PREVIEW_ENABLED!=='true')throw new Problem(503,'Use the existing GoBela Circle while the new experience is under review');
      if (resource === 'upload' && method === 'POST') {
        await command(db,'consume',{});
        const extension=choice(body.extension,['jpg','png','webp'] as const,'image format');
        const path=`${user.id}/${crypto.randomUUID()}.${extension}`;
        result=checked(await db.storage.from('gb-circle').createSignedUploadUrl(path));
      } else if (resource === 'photo' && method === 'POST') {
        const path=text(body.path,'photo path',300);
        result=checked(await db.storage.from('gb-circle').createSignedUrl(path,60));
      } else if (resource === 'posts' && method === 'GET') result={posts:checked(await db.from('gb_circle').select(circleFields).order('created_at',{ascending:false}).limit(100)),votes:await command(db,'vote_counts',{})};
      else if (resource === 'posts' && method === 'POST') {
        await command(db,'consume',{});
        // Photos use the separate authenticated upload endpoint; arbitrary URLs are rejected.
        const photo = body.photo_path ? text(body.photo_path,'photo path',300) : null;
        if (photo && !new RegExp(`^${user.id}/[0-9a-f-]+\\.(jpg|png|webp)$`).test(photo)) throw new Problem(400,'Invalid photo path');
        result=checked(await db.from('gb_circle').insert({owner_id:user.id,category:choice(body.category,categories,'category'),title:text(body.title,'title',200),body:text(body.body,'review',3000),visited_on:body.visited_on ? date(body.visited_on) : null,photo_path:photo,status:'pending'}).select(circleFields).single());
      } else if (resource === 'posts' && id && method === 'DELETE') { checked(await db.from('gb_circle').delete().eq('id',uuid(id)).eq('owner_id',user.id).select('id').single()); result={deleted:true}; }
      else if (resource === 'votes' && id && method === 'POST') result=checked(await db.from('gb_votes').upsert({post_id:uuid(id),owner_id:user.id},{onConflict:'post_id,owner_id',ignoreDuplicates:true}).select());
      else if (resource === 'votes' && id && method === 'DELETE') { checked(await db.from('gb_votes').delete().eq('post_id',uuid(id)).eq('owner_id',user.id).select()); result={deleted:true}; }
      else if (resource === 'reports' && id && method === 'POST') result=checked(await db.from('gb_reports').insert({post_id:uuid(id),owner_id:user.id,reason:text(body.reason,'reason',1000)}).select().single());
      else if (resource === 'consents' && id && method === 'POST') {
        if (typeof body.granted !== 'boolean') throw new Problem(400,'Invalid consent');
        result=checked(await db.from('gb_consents').upsert({post_id:uuid(id),owner_id:user.id,purpose:text(body.purpose,'specific marketing use',300),granted:body.granted},{onConflict:'post_id,owner_id,purpose'}).select().single());
      } else throw new Problem(404,'Route not found');
    } else throw new Problem(404,'Route not found');
    return Response.json({data:result},{headers:{'Cache-Control':'no-store'}});
  } catch (error) {
    const safe=safeError(error);
    return Response.json({error:safe.message},{status:safe.status,headers:{'Cache-Control':'no-store'}});
  }
}
