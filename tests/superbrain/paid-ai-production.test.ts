import {afterEach, expect, it, vi} from 'vitest';
const mocks=vi.hoisted(()=>({rpc:vi.fn(),generate:vi.fn(),billing:vi.fn(),gateway:vi.fn()}));
vi.mock('@supabase/supabase-js',()=>({createClient:()=>({rpc:mocks.rpc})}));
vi.mock('ai',()=>({generateText:mocks.generate,createGateway:()=>Object.assign(mocks.gateway,{getGenerationInfo:mocks.billing})}));
import {budgetedAiText,reconcileStoredAiBilling} from '../../lib/superbrain/paid-ai';
afterEach(()=>{vi.unstubAllEnvs();vi.clearAllMocks();});
it('uses the actual server adapter for reservation, fixed routing, no SDK retries and receipt settlement',async()=>{
 const c={version:1,model:'provider/model',provider:'provider',evidence:'Test-only reviewed quote',reviewedAt:new Date(Date.now()-1000).toISOString(),expiresAt:new Date(Date.now()+100000).toISOString(),maximumUsdMicros:10000,sgdCentsPerUsdCeiling:150,maximumInputBytes:1000,maximumOutputTokens:600};
 vi.stubEnv('SUPERBRAIN_AI_ENABLED','true');vi.stubEnv('SUPERBRAIN_AI_MODEL',c.model);vi.stubEnv('SUPERBRAIN_AI_COST_CONTRACT',JSON.stringify(c));vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://fixture.supabase.co');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','fixture-only');
 mocks.rpc.mockImplementation(()=>({abortSignal:async()=>({data:{acquired:true,reserved_cents:2,recorded:true,settled:true},error:null})}));
 mocks.gateway.mockReturnValue('pinned-model-object');
 mocks.generate.mockResolvedValue({text:'Evidence-based answer',providerMetadata:{gateway:{generationId:'gen_fixture',enabledZeroDataRetention:true}}});
 mocks.billing.mockResolvedValue({id:'gen_fixture',model:c.model,providerName:c.provider,totalCost:0.001,isByok:false,createdAt:new Date().toISOString()});
 expect(await budgetedAiText({system:'System',prompt:'Question',maxOutputTokens:250})).toBe('Evidence-based answer');
 expect(mocks.generate).toHaveBeenCalledWith(expect.objectContaining({model:'pinned-model-object',maxRetries:0,maxOutputTokens:250,providerOptions:{gateway:{only:['provider'],models:[],zeroDataRetention:true,disallowPromptTraining:true}}}));
 expect(mocks.rpc.mock.calls.map(c=>c[0])).toEqual(['gb_budget_reserve_ai','gb_budget_note_receipt','gb_budget_settle_ai']);
 expect(mocks.billing).toHaveBeenCalledWith({id:'gen_fixture'});
 expect(mocks.rpc.mock.calls[2][1]).toEqual(expect.objectContaining({usd_micros:1000,provider_receipt:'gateway:gen_fixture',billed_at:expect.any(String)}));
 // A successful but unconfirmed response must be withheld without losing its charge.
 mocks.generate.mockResolvedValue({text:'Unconfirmed private answer',providerMetadata:{gateway:{generationId:'gen_unconfirmed'}}});
 mocks.billing.mockResolvedValue({id:'gen_unconfirmed',model:c.model,providerName:c.provider,totalCost:0.001,isByok:false,createdAt:new Date().toISOString()});
 expect(await budgetedAiText({system:'System',prompt:'Question',maxOutputTokens:250})).toBeUndefined();
 expect(mocks.rpc.mock.calls.at(-1)?.[0]).toBe('gb_budget_settle_ai');
 expect(mocks.rpc.mock.calls.at(-1)?.[1]).toEqual(expect.objectContaining({provider_receipt:'gateway:gen_unconfirmed',usd_micros:1000}));
});
it('reconciles stored receipts with AI off, without reserving or generating again',async()=>{
 const created=new Date(Date.now()-7200000).toISOString();
 const c={version:1,model:'provider/model',provider:'provider',evidence:'Historical test quote',reviewedAt:new Date(Date.now()-7201000).toISOString(),expiresAt:new Date(Date.now()-3600000).toISOString(),maximumUsdMicros:10000,sgdCentsPerUsdCeiling:150,maximumInputBytes:1000,maximumOutputTokens:600};
 vi.stubEnv('SUPERBRAIN_AI_ENABLED','false');vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://fixture.supabase.co');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','fixture-only');
 mocks.rpc.mockImplementation((name:string)=>({abortSignal:async()=>({data:name==='gb_budget_pending_ai'?{rows:[{id:'00000000-0000-4000-8000-000000000001',pending_receipt:'gateway:gen_delayed',created_at:created,cost_contract:c}],pending:1,manual_review:0,has_more:false}:{settled:true},error:null})}));
 mocks.billing.mockResolvedValue({id:'gen_delayed',model:c.model,providerName:c.provider,totalCost:0.001,isByok:false,createdAt:created});
 expect((await reconcileStoredAiBilling()).settled).toBe(1);
 expect(mocks.generate).not.toHaveBeenCalled();
 expect(mocks.rpc.mock.calls.map(c=>c[0])).toEqual(['gb_budget_pending_ai','gb_budget_settle_ai']);
});
