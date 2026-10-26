import {afterEach,beforeEach,expect,it,vi} from 'vitest';
import {advanceInstagramReel,type InstagramJob} from '../../lib/superbrain/instagram';
const id='11111111-1111-4111-8111-111111111111';
const now=Date.parse('2026-10-27T00:00:00Z');
const action={id,status:'executing',reserved_cents:0,payload:{channel:'instagram',content:'Exact approved copy',audience:'instagram:456:public',campaign_id:id,media:{asset_id:'backpack-reel-audio48k',sha256:'cf8fbd6b90522a251ec407fa8d724b31859240e15d0e1c2cf288e3c87041ce7d',reuse_approved:true}}};
const job=(phase:InstagramJob['phase']):InstagramJob=>({action_id:id,instagram_id:'456',phase,container_id:'789',media_id:null,lease:id,lease_until:new Date(now-1000).toISOString(),next_check_at:null,checks:0,created_at:new Date(now-30000).toISOString()});
const identity={id:'123',instagram_business_account:{id:'456',username:'gobelaapp'}};
beforeEach(()=>{for(const [name,value]of Object.entries({SUPERBRAIN_INSTAGRAM_ADAPTER_ENABLED:'true',SUPERBRAIN_META_ENABLED:'true',SUPERBRAIN_EXECUTION_ENABLED:'true',SUPERBRAIN_ADAPTER_MODE:'meta',SUPERBRAIN_META_PAGE_ID:'123',SUPERBRAIN_META_INSTAGRAM_ID:'456',SUPERBRAIN_META_INSTAGRAM_USERNAME:'gobelaapp',SUPERBRAIN_META_API_VERSION:'v25.0',SUPERBRAIN_META_PAGE_TOKEN:'synthetic-unit-token'}))vi.stubEnv(name,value);});
afterEach(()=>vi.unstubAllEnvs());
it('disabled or unapproved reuse never touches Meta or obtains a signed capability',async()=>{
 const cp=vi.fn(),sign=vi.fn(),transport=vi.fn();vi.stubEnv('SUPERBRAIN_INSTAGRAM_ADAPTER_ENABLED','false');
 await expect(advanceInstagramReel(action,true,cp,sign,transport,now)).rejects.toThrow('disabled');
 vi.stubEnv('SUPERBRAIN_INSTAGRAM_ADAPTER_ENABLED','true');
 await expect(advanceInstagramReel({...action,payload:{...action.payload,media:{...action.payload.media,reuse_approved:false}}},true,cp,sign,transport,now)).rejects.toThrow('approved media');
 expect(transport).not.toHaveBeenCalled();expect(sign).not.toHaveBeenCalled();expect(cp).not.toHaveBeenCalled();
});
it('wrong linked Instagram identity cannot upload or publish',async()=>{
 const transport=vi.fn().mockResolvedValue(Response.json({...identity,instagram_business_account:{id:'999',username:'other'}}));const cp=vi.fn(),sign=vi.fn();
 await expect(advanceInstagramReel(action,true,cp,sign,transport,now)).rejects.toThrow('differs');expect(cp).not.toHaveBeenCalled();expect(sign).not.toHaveBeenCalled();
});
it('container creation is checkpointed before the POST and never returned as success',async()=>{
 const events:string[]=[];const cp=vi.fn(async(op:string)=>{events.push(op);return job(op==='created'?'processing':'creating');});
 const transport=vi.fn(async(url:RequestInfo|URL,init?:RequestInit)=>{events.push(init?.method==='POST'?'POST':'identity');return Response.json(String(url).includes('/media')?{id:'789'}:identity);});
 const result=await advanceInstagramReel(action,true,cp,async()=> 'https://approved.test/short-lived',transport,now);
 expect(events).toEqual(['identity','start','POST','created']);expect(result).toMatchObject({pending:true,phase:'processing'});expect(result).not.toHaveProperty('receipt_id');
 const request=transport.mock.calls[1][1]!;expect(String(request.body)).toContain('media_type=REELS');expect(String(request.body)).toContain('share_to_feed=false');expect(String(transport.mock.calls[1][0])).not.toContain('synthetic-unit-token');
});
it('a timeout after mutation checkpoint marks uncertain and does not retry a POST',async()=>{
 const cp=vi.fn(async(_op:string)=>job('creating'));
 const transport=vi.fn().mockResolvedValueOnce(Response.json(identity)).mockRejectedValueOnce(new Error('timeout'));
 await expect(advanceInstagramReel(action,true,cp,async()=> 'https://approved.test/video',transport,now)).rejects.toThrow('Upload outcome uncertain');
 expect(cp.mock.calls.map(c=>c[0])).toContain('uncertain');expect(transport).toHaveBeenCalledTimes(2);
});
it('an interrupted creating/publishing checkpoint causes no second POST',async()=>{
 for(const phase of ['creating','publishing'] as const){
 const cp=vi.fn(async(_op:string)=>job(phase)),transport=vi.fn().mockResolvedValue(Response.json(identity));
 await expect(advanceInstagramReel(action,false,cp,vi.fn(),transport,now)).rejects.toThrow('interrupted');
 expect(transport).toHaveBeenCalledTimes(1);expect(cp.mock.calls.map(c=>c[0])).toContain('uncertain');
 }
});
it('IN_PROGRESS only polls, and an expired/error/published container is never republished',async()=>{
 for(const status of ['IN_PROGRESS','ERROR','EXPIRED','PUBLISHED']){
 const cp=vi.fn(async(op:string)=>job(op==='polled'?'processing':'processing'));
 const transport=vi.fn().mockResolvedValueOnce(Response.json(identity)).mockResolvedValueOnce(Response.json({id:'789',status_code:status}));
 if(status==='IN_PROGRESS')expect(await advanceInstagramReel(action,false,cp,vi.fn(),transport,now)).toMatchObject({pending:true,phase:'processing'});
 else await expect(advanceInstagramReel(action,false,cp,vi.fn(),transport,now)).rejects.toThrow('reconciliation');
 expect(transport.mock.calls.every(c=>!c[1]||c[1].method==='GET')).toBe(true);
 }
});
it('ready container publishes once and requires another step to verify actual media',async()=>{
 const cp=vi.fn(async(op:string)=>({...job(op==='published'?'verifying':'ready'),media_id:op==='published'?'901':null}));
 const transport=vi.fn().mockResolvedValueOnce(Response.json(identity)).mockResolvedValueOnce(Response.json({id:'901'}));
 expect(await advanceInstagramReel(action,false,cp,vi.fn(),transport,now)).toMatchObject({pending:true,phase:'verifying'});
 expect(cp.mock.calls.map(c=>c[0])).toEqual(['read','publish','published']);
 expect(String(transport.mock.calls[1][0])).toContain('/456/media_publish');
});
it('success requires exact account, caption, Reel type, valid timestamp and actual permalink',async()=>{
 const receipt={id:'901',owner:{id:'456'},caption:action.payload.content,media_type:'VIDEO',media_product_type:'REELS',permalink:'https://www.instagram.com/reel/Exact_Receipt/',timestamp:new Date(now).toISOString()};
 for(const mismatch of [{owner:{id:'999'}},{caption:'Changed copy'},{media_product_type:'FEED'},{permalink:'https://instagram.com.evil.test/reel/x/'},{timestamp:'invalid'}]){
  const cp=vi.fn(async(_op:string)=>({...job('verifying'),media_id:'901'}));
  const transport=vi.fn().mockResolvedValueOnce(Response.json(identity)).mockResolvedValueOnce(Response.json({...receipt,...mismatch}));
  await expect(advanceInstagramReel(action,false,cp,vi.fn(),transport,now)).rejects.toThrow('cannot yet be verified');expect(cp.mock.calls.map(c=>c[0])).not.toContain('confirmed');
 }
 const cp=vi.fn(async(_op:string)=>({...job('verifying'),media_id:'901'}));
 const transport=vi.fn().mockResolvedValueOnce(Response.json(identity)).mockResolvedValueOnce(Response.json(receipt));
 expect(await advanceInstagramReel(action,false,cp,vi.fn(),transport,now)).toEqual({receipt_id:'instagram:901',actual_cost_cents:0});
});
