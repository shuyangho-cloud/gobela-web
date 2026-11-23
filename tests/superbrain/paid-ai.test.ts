import {afterEach, expect, it, vi} from 'vitest';
import {parseAiCostContract, runBudgetedAi, budgetedAiText, type AiCostContract, type PaidAiDependencies} from '../../lib/superbrain/paid-ai';
const contract=():AiCostContract=>({version:1,model:'provider/model',provider:'provider',evidence:'Reviewed fixture pricing/routing/FX evidence; not live configuration',reviewedAt:new Date(Date.now()-1000).toISOString(),expiresAt:new Date(Date.now()+3600000).toISOString(),maximumUsdMicros:10000,sgdCentsPerUsdCeiling:150,maximumInputBytes:1000,maximumOutputTokens:600});
const input={system:'Guide',prompt:'Find an activity',maxOutputTokens:250};
function dependencies(){
 const calls:string[]=[];
 const deps:PaidAiDependencies={reserve:vi.fn(async()=>{calls.push('reserve');return true;}),noteReceipt:vi.fn(async()=>{calls.push('note');}),settle:vi.fn(async()=>{calls.push('settle');}),generate:vi.fn(async()=>{calls.push('generate');return {text:'Verified summary',generationId:'gen_test'};}),billing:vi.fn(async()=>{calls.push('billing');return {id:'gen_test',model:'provider/model',providerName:'provider',totalCost:0.002,isByok:false,createdAt:new Date().toISOString()};})};
 return {deps,calls};
}
afterEach(()=>{vi.unstubAllEnvs();vi.restoreAllMocks();});
it('reserves before calling, saves billing identifier before lookup and settles rounded-up SGD cost',async()=>{
 const {deps,calls}=dependencies();
 expect(await runBudgetedAi(input,contract(),deps)).toBe('Verified summary');
 expect(calls).toEqual(['reserve','generate','note','billing','settle']);
 expect(deps.reserve).toHaveBeenCalledWith(expect.any(String),2,expect.objectContaining({model:'provider/model'}));
 expect(deps.settle).toHaveBeenCalledWith(expect.any(String),2000,'gateway:gen_test',expect.any(String));
});
it('never contacts provider for a denied, duplicate or ambiguous reservation',async()=>{
 for(const response of [false,new Error('DB timeout')]){
  const {deps}=dependencies();deps.reserve=vi.fn(async()=>{if(response instanceof Error)throw response;return response;});
  expect(await runBudgetedAi(input,contract(),deps)).toBeUndefined();
  expect(deps.generate).not.toHaveBeenCalled();expect(deps.settle).not.toHaveBeenCalled();
 }
});
it('keeps unknown provider outcomes held, without retry or zero-cost settlement',async()=>{
 const {deps}=dependencies();deps.generate=vi.fn(async()=>{throw new Error('Network timeout after charge');});
 expect(await runBudgetedAi(input,contract(),deps)).toBeUndefined();
 expect(deps.generate).toHaveBeenCalledTimes(1);expect(deps.settle).not.toHaveBeenCalled();
});
it('keeps missing, delayed, mismatched and malformed billing evidence held',async()=>{
 const variants=[{}, {id:'gen_other'}, {model:'other/model'}, {providerName:'unexpected'}, {totalCost:NaN}, {totalCost:-1}, {isByok:true}, {createdAt:'bad'}, {createdAt:new Date(Date.now()+100000).toISOString()}];
 for(const change of variants){
  const {deps}=dependencies();const real=deps.billing;
  deps.billing=vi.fn(async(id)=>{if(!Object.keys(change).length)throw new Error('Billing not ingested');return {...await real(id),...change};});
  expect(await runBudgetedAi(input,contract(),deps)).toBeUndefined();expect(deps.noteReceipt).toHaveBeenCalled();expect(deps.settle).not.toHaveBeenCalled();
 }
});
it('does not free holds if receipt recording or settlement fails',async()=>{
 for(const stage of ['noteReceipt','settle'] as const){
  const {deps}=dependencies();deps[stage]=vi.fn(async()=>{throw new Error('DB unavailable');});
  expect(await runBudgetedAi(input,contract(),deps)).toBeUndefined();
  expect(deps.generate).toHaveBeenCalledTimes(1);
 }
});
it('records true overrun before discarding generated output',async()=>{
 const {deps}=dependencies();deps.billing=vi.fn(async()=>({id:'gen_test',model:'provider/model',providerName:'provider',totalCost:0.05,isByok:false,createdAt:new Date().toISOString()}));
 expect(await runBudgetedAi(input,contract(),deps)).toBeUndefined();
 expect(deps.settle).toHaveBeenCalledWith(expect.any(String),50000,'gateway:gen_test',expect.any(String));
});
it('blocks stale, wrong-model, oversized, future-reviewed and malformed contracts',()=>{
 const c=contract();
 for(const change of [{model:'other/model'},{maximumUsdMicros:0},{maximumUsdMicros:Infinity},{maximumInputBytes:32001},{maximumOutputTokens:601},{sgdCentsPerUsdCeiling:0},{expiresAt:new Date(Date.now()-1).toISOString()},{reviewedAt:new Date(Date.now()+10000).toISOString()},{expiresAt:new Date(Date.now()+172800000).toISOString()},{evidence:''}])expect(parseAiCostContract(JSON.stringify({...c,...change}),c.model)).toBeUndefined();
 expect(parseAiCostContract(JSON.stringify(c),c.model)).toEqual(c);
});
it('rejects oversized UTF8 input and excessive output before reserving',async()=>{
 const {deps}=dependencies();
 expect(await runBudgetedAi({...input,prompt:'家'.repeat(334)},contract(),deps)).toBeUndefined();
 expect(await runBudgetedAi({...input,maxOutputTokens:601},contract(),deps)).toBeUndefined();
 expect(deps.reserve).not.toHaveBeenCalled();
});
it('cannot activate from the legacy AI environment flag alone',async()=>{
 vi.stubEnv('SUPERBRAIN_AI_ENABLED','true');vi.stubEnv('SUPERBRAIN_AI_MODEL','provider/model');vi.stubEnv('SUPERBRAIN_AI_COST_CONTRACT','');
 expect(await budgetedAiText(input)).toBeUndefined();
});

it('does not spend if the quote expires while waiting for the database permit',async()=>{
 const {deps}=dependencies(),c=contract();
 deps.reserve=vi.fn(async()=>{vi.spyOn(Date,'now').mockReturnValue(Date.parse(c.expiresAt)+1);return true;});
 expect(await runBudgetedAi(input,c,deps)).toBeUndefined();
 expect(deps.generate).not.toHaveBeenCalled();
});
