import {it,expect} from 'vitest';
import {founderBrief,businessAnswer,stableWorkId} from '../../lib/superbrain/founder-brain';
const now=Date.parse('2026-10-24T00:00:00Z');
const enquiry={id:'e1',listing_id:'l1',status:'new',created_at:'2026-10-23T00:00:00Z'};
it('prioritises uncertain actions over acquisition and never recommends resending',()=>{
 const brief=founderBrief({actions:[{id:'a',status:'uncertain',created_at:'2026-10-23'}],enquiries:[enquiry]},[],now);
 expect(brief.priorities[0].kind).toBe('reconcile');expect(brief.priorities[0].prepared_work.join(' ')).toContain('do not resend');
 expect(brief.priorities.findIndex(p=>p.kind==='enquiries')).toBeLessThan(brief.priorities.findIndex(p=>p.kind==='organic-production'));
});
it('considers expiry, unresolved reports, partner dates and catalogue freshness',()=>{
 const brief=founderBrief({actions:[{id:'a',status:'approved',approved_until:'2026-10-23'}],partners:[{id:'p',name:'Partner',stage:'interested',due_at:'2026-10-23'}],reports:[{id:'r',post_id:'post',status:'open'}],catalogue:[{id:'l',title:'Old listing',active:true,verified_at:'2026-08-01'}]},[],now);
 expect(brief.priorities.map(p=>p.kind)).toEqual(['expired-approval','moderation','partner-followup','catalogue-review','organic-production']);
});
it('remembers dismissal only while the supporting evidence remains the same',()=>{
 const initial=founderBrief({enquiries:[enquiry]},[],now);const key=initial.priorities.find(p=>p.kind==='enquiries')!.key;
 expect(founderBrief({enquiries:[enquiry],decisions:[{decision_key:key,state:'dismissed'}]},[],now).priorities.some(p=>p.key===key)).toBe(false);
 expect(founderBrief({enquiries:[enquiry,{...enquiry,id:'e2'}],decisions:[{decision_key:key,state:'dismissed'}]},[],now).priorities.some(p=>p.kind==='enquiries')).toBe(true);
});
it('holds deferred work until due and generates stable task identity regardless of query ordering',()=>{
 const records={enquiries:[enquiry,{...enquiry,id:'e2'}]};const a=founderBrief(records,[],now);const b=founderBrief({enquiries:[...records.enquiries].reverse()},[],now);expect(a.priorities[0].key).toBe(b.priorities[0].key);expect(a.priorities[0].id).toBe(stableWorkId(a.priorities[0].key));
 const decisions=[{decision_key:a.priorities[0].key,state:'deferred',deferred_until:'2026-10-25T01:00:00Z'}];
 expect(founderBrief({...records,decisions},[],now).priorities.some(p=>p.kind==='enquiries')).toBe(false);
 expect(founderBrief({...records,decisions},[],Date.parse('2026-10-25T02:00:00Z')).priorities.some(p=>p.kind==='enquiries')).toBe(true);
});
it('does not pass raw enquiry messages, action payloads or private family data into the brain',()=>{
 const secret='PRIVATE-HEALTH-SECRET';const brief=founderBrief({enquiries:[{...enquiry,message:secret,owner_id:secret}],actions:[{id:'a',status:'pending',payload:{content:secret}}],health:[{value:secret}],children:[{name:secret}],memory:[{fact:secret}]},[],now);
 expect(JSON.stringify(brief)).not.toContain(secret);expect(brief.coverage).toContain('Private family health');
});
it('answers next-step questions directly and refuses to manufacture revenue or access health',()=>{
 const brief=founderBrief({enquiries:[enquiry]},[],now);
 expect(businessAnswer('What should I do next?',brief,[]).reply).toContain('Review 1 new parent enquiry');
 expect(businessAnswer('What is our ROI?',brief,[]).reply).toContain('not connected');
 expect(businessAnswer('Use child health to target ads',brief,[]).sources).toEqual([]);
});
it('catches live catalogue price conflicts without publishing the disputed offer',()=>{
 const canonical=[{id:'codeninja-scratch-1',name:'Scratch',provider:'Code Ninja',is_active:true,trial_price:57,location:'Singapore'}];
 const brief=founderBrief({},canonical,now);expect(brief.priorities[0].kind).toBe('catalogue-conflict');expect(brief.priorities[0].recommendation).toContain('Hold');
});

it('prepares response and partner drafts without asserting availability or sending',()=>{
 const brief=founderBrief({enquiries:[enquiry],partners:[{id:'p',name:'Provider',stage:'prospect',due_at:'2026-10-23'}]},[],now);
 const response=brief.priorities.find(p=>p.kind==='enquiries')!.prepared_artifacts[0];expect(response.body).toContain('a booking has not been confirmed');expect(response.status).toContain('not sent');
 const partner=brief.priorities.find(p=>p.kind==='partner-followup')!.prepared_artifacts[0];expect(partner.body).not.toContain('Following up');expect(partner.status).toContain('not sent');
});

it('explains provider trade-offs without inventing conversion performance or overwriting negotiated prices',()=>{
 const canonical=[{id:'codeninja-scratch-1',name:'Scratch',provider:'Code Ninja',is_active:true,trial_price:57,location:'Singapore'}];
 const brief=founderBrief({},canonical,now);const answer=businessAnswer('Why hold Code Ninja?',brief,[],canonical);
 expect(answer.reply).toContain('Price conflict');expect(answer.reply).toContain('not proof');expect(answer.sources).toHaveLength(1);
});
