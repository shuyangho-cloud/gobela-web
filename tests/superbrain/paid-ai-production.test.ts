import {afterEach, expect, it, vi} from 'vitest';
const mocks=vi.hoisted(()=>({rpc:vi.fn(),generate:vi.fn(),billing:vi.fn(),gateway:vi.fn()}));
vi.mock('@supabase/supabase-js',()=>({createClient:()=>({rpc:mocks.rpc})}));
vi.mock('ai',()=>({generateText:mocks.generate,createGateway:()=>Object.assign(mocks.gateway,{getGenerationInfo:mocks.billing})}));
import {budgetedAiText} from '../../lib/superbrain/paid-ai';
afterEach(()=>{vi.unstubAllEnvs();vi.clearAllMocks();});
it('uses the actual server adapter for reservation, fixed routing, no SDK retries and receipt settlement',async()=>{
 const c={version:1,model:'provider/model',provider:'provider',evidence:'Test-only reviewed quote',reviewedAt:new Date(Date.now()-1000).toISOString(),expiresAt:new Date(Date.now()+100000).toISOString(),maximumUsdMicros:10000,sgdCentsPerUsdCeiling:150,maximumInputBytes:1000,maximumOutputTokens:600};
 vi.stubEnv('SUPERBRAIN_AI_ENABLED','true');vi.stubEnv('SUPERBRAIN_AI_MODEL',c.model);vi.stubEnv('SUPERBRAIN_AI_COST_CONTRACT',JSON.stringify(c));vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://fixture.supabase.co');vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY','fixture-only');
 mocks.rpc.mockImplementation(()=>({abortSignal:async()=>({data:{acquired:true,recorded:true,settled:true},error:null})}));
 mocks.gateway.mockReturnValue('pinned-model-object');
 mocks.generate.mockResolvedValue({text:'Evidence-based answer',providerMetadata:{gateway:{generationId:'gen_fixture'}}});
 mocks.billing.mockResolvedValue({id:'gen_fixture',model:c.model,providerName:c.provider,totalCost:0.001,isByok:false});
 expect(await budgetedAiText({system:'System',prompt:'Question',maxOutputTokens:250})).toBe('Evidence-based answer');
 expect(mocks.generate).toHaveBeenCalledWith(expect.objectContaining({model:'pinned-model-object',maxRetries:0,maxOutputTokens:250,providerOptions:{gateway:{only:['provider'],models:[]}}}));
 expect(mocks.rpc.mock.calls.map(c=>c[0])).toEqual(['gb_budget_reserve','gb_budget_note_receipt','gb_budget_settle']);
 expect(mocks.billing).toHaveBeenCalledWith({id:'gen_fixture'});
 expect(mocks.rpc.mock.calls[2][1]).toEqual(expect.objectContaining({cost_cents:1,provider_receipt:'gateway:gen_fixture'}));
});
