import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { createGateway, generateText } from 'ai';

/** Server-owned pricing/routing/FX evidence. No default prices or inferred approval. */
export type AiCostContract = {
  version: 1; model: string; provider: string; evidence: string;
  reviewedAt: string; expiresAt: string;
  maximumUsdMicros: number; sgdCentsPerUsdCeiling: number;
  maximumInputBytes: number; maximumOutputTokens: number;
};
type Input = { system: string; prompt: string; maxOutputTokens: number };
type Billing = { id: string; model: string; providerName: string; totalCost: number; isByok: boolean; createdAt: string };
export type PaidAiDependencies = {
  reserve(id: string, cents: number, contract: AiCostContract): Promise<boolean>;
  noteReceipt(id: string, receipt: string): Promise<void>;
  settle(id: string, usdMicros: number, receipt: string, billedAt: string): Promise<void>;
  generate(input: Input, contract: AiCostContract): Promise<{text: string; generationId?: string}>;
  billing(generationId: string): Promise<Billing>;
};
function positiveInt(value: unknown, maximum: number): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 && value <= maximum;
}
export function parseAiCostContract(raw: string | undefined, model: string | undefined, now = Date.now()): AiCostContract | undefined {
  try {
    const c = JSON.parse(raw || '') as AiCostContract;
    const reviewed = Date.parse(c.reviewedAt), expires = Date.parse(c.expiresAt);
    if (c.version !== 1 || !model || c.model !== model || !/^[\w.-]+\/[\w.-]+$/.test(c.model) ||
      typeof c.provider !== 'string' || !/^[a-z0-9-]{1,80}$/.test(c.provider) ||
      typeof c.evidence !== 'string' || !c.evidence.trim() || c.evidence.length > 500 ||
      !Number.isFinite(reviewed) || !Number.isFinite(expires) || reviewed > now || expires <= now ||
      expires - reviewed > 86400000 || !positiveInt(c.maximumUsdMicros, 1000000000) ||
      !positiveInt(c.sgdCentsPerUsdCeiling, 100000) || !positiveInt(c.maximumInputBytes, 32000) ||
      !positiveInt(c.maximumOutputTokens, 600)) return;
    if (Math.ceil(c.maximumUsdMicros * c.sgdCentsPerUsdCeiling / 1000000) > 1000) return;
    return c;
  } catch { return; }
}

/** No provider retry, no retry of an ambiguous reservation, no timeout-as-free. */
export async function runBudgetedAi(input: Input, contract: AiCostContract, deps: PaidAiDependencies, id = randomUUID()): Promise<string | undefined> {
  // Revalidate at the actual spending boundary, even when a caller retained an old contract.
  if (!parseAiCostContract(JSON.stringify(contract), contract.model) ||
    Buffer.byteLength(input.system, 'utf8') + Buffer.byteLength(input.prompt, 'utf8') > contract.maximumInputBytes ||
    !positiveInt(input.maxOutputTokens, contract.maximumOutputTokens)) return;
  const reserved = Math.ceil(contract.maximumUsdMicros * contract.sgdCentsPerUsdCeiling / 1000000);
  try {
    if (!await deps.reserve(id, reserved, contract)) return;
    // Reservation may have waited on another transaction until evidence expired.
    if (!parseAiCostContract(JSON.stringify(contract), contract.model)) return;
    const generated = await deps.generate(input, contract);
    const generationId = generated.generationId;
    if (!generationId || !/^gen_[A-Za-z0-9_-]{1,120}$/.test(generationId)) return;
    const receipt = `gateway:${generationId}`;
    // Persist the lookup identifier first: billing lookup may fail or lag ingestion.
    await deps.noteReceipt(id, receipt);
    const bill = await deps.billing(generationId);
    if (bill.id !== generationId || bill.model !== contract.model || bill.providerName !== contract.provider ||
      bill.isByok !== false || !Number.isFinite(bill.totalCost) || bill.totalCost < 0 || !Number.isFinite(Date.parse(bill.createdAt)) || Date.parse(bill.createdAt) > Date.now()) return;
    // Ceil both USD micros and SGD cents; fractional cents never become free calls.
    // FX/fee ceiling is a conservative accounting charge, not a final bank-settlement claim.
    const micros = Math.ceil(bill.totalCost * 1000000);
    const cost = Math.ceil(micros * contract.sgdCentsPerUsdCeiling / 1000000);
    if (!Number.isSafeInteger(micros * contract.sgdCentsPerUsdCeiling) || !Number.isSafeInteger(cost) || cost > 2147483647) return;
    await deps.settle(id, micros, receipt, bill.createdAt); // DB preserves actual overruns and halts further permits.
    if (cost > reserved) return;
    return generated.text.trim() || undefined;
  } catch {
    // A provider/network/DB error does not prove no charge. Keep the reservation.
    return;
  }
}

type PendingAi = { id:string; pending_receipt:string; created_at:string; cost_contract:AiCostContract };
type PendingBatch = { rows:PendingAi[]; pending:number; manual_review:number; has_more:boolean };
type ReconciliationDependencies = Pick<PaidAiDependencies,'billing'|'settle'> & { pending(cursor?:string):Promise<PendingBatch> };

/** Retry billing lookup only. Never retry generation, release unknown holds, or renew quotes. */
export async function reconcileAiBilling(deps:ReconciliationDependencies,cursor?:string) {
  const batch=await deps.pending(cursor);
  if (!Array.isArray(batch.rows) || batch.rows.length>2 || typeof batch.has_more!=='boolean' || (batch.has_more&&!batch.rows.length) || !Number.isSafeInteger(batch.pending) || batch.pending<0 ||
    !Number.isSafeInteger(batch.manual_review) || batch.manual_review<0) throw new Error('Billing reconciliation unavailable');
  let settled=0, unresolved=0, overruns=0;
  for (const row of batch.rows) {
    try {
      const created=Date.parse(row.created_at);
      // Stored evidence is checked at reservation time, not renewed at reconciliation.
      const c=Number.isFinite(created) && created<=Date.now() && parseAiCostContract(JSON.stringify(row.cost_contract),row.cost_contract?.model,created);
      if (!c || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row.id) || !/^gateway:gen_[A-Za-z0-9_-]{1,120}$/.test(row.pending_receipt)) throw new Error('Unverified reservation');
      const receipt=row.pending_receipt, id=receipt.slice('gateway:'.length);
      const bill=await deps.billing(id), billed=Date.parse(bill.createdAt);
      if (bill.id!==id || bill.model!==c.model || bill.providerName!==c.provider || bill.isByok!==false ||
        !Number.isFinite(bill.totalCost) || bill.totalCost<0 || !Number.isFinite(billed) || billed> Date.now() || billed<created-60000) throw new Error('Unverified billing');
      const micros=Math.ceil(bill.totalCost*1000000), cents=Math.ceil(micros*c.sgdCentsPerUsdCeiling/1000000);
      if (!Number.isSafeInteger(micros*c.sgdCentsPerUsdCeiling) || !Number.isSafeInteger(cents) || cents>2147483647) throw new Error('Manual reconciliation required');
      // Existing DB settlement enforces receipt/replay conflicts and halts on overruns.
      await deps.settle(row.id,micros,receipt,bill.createdAt); settled++;
      if(cents>Math.ceil(c.maximumUsdMicros*c.sgdCentsPerUsdCeiling/1000000))overruns++;
    } catch { unresolved++; }
  }
  return {settled,unresolved,overruns,pendingAtStart:batch.pending,manualReview:batch.manual_review,nextCursor:batch.has_more?batch.rows.at(-1)!.id:null};
}
export async function reconcileStoredAiBilling(cursor?:string) {
  const deps=productionDependencies();
  if(!deps)throw new Error('Billing reconciliation unavailable');
  return reconcileAiBilling(deps,cursor);
}

function productionDependencies(): (PaidAiDependencies & ReconciliationDependencies) | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || typeof window !== 'undefined') return;
  const db = createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false}});
  const rpc = async (name: string, args: Record<string, unknown>) => {
    const {data, error} = await db.rpc(name, args).abortSignal(AbortSignal.timeout(5000));
    if (error || !data) throw new Error('Budget operation unavailable');
    return data;
  };
  const boundedGateway = createGateway({fetch: (url, init) => fetch(url, {
    ...init, cache:'no-store', redirect:'error',
    signal:AbortSignal.any([...(init?.signal ? [init.signal] : []), AbortSignal.timeout(8000)]),
  })});
  return {
    pending: async(cursor)=>rpc('gb_budget_pending_ai',{after_id:cursor??null}),
    reserve: async (id, cents, contract) => {
      const result = await rpc('gb_budget_reserve_ai', {request_id:id, contract});
      return result.acquired === true && result.reserved_cents === cents;
    },
    noteReceipt: async (id, receipt) => { await rpc('gb_budget_note_receipt', {request_id:id, provider_receipt:receipt}); },
    settle: async (id, usdMicros, receipt, billedAt) => { await rpc('gb_budget_settle_ai', {request_id:id, usd_micros:usdMicros, provider_receipt:receipt, billed_at:billedAt}); },
    generate: async (input, contract) => {
      const result = await generateText({
        model: boundedGateway(contract.model), ...input,
        maxRetries: 0, abortSignal: AbortSignal.timeout(12000),
        providerOptions: {gateway: {only:[contract.provider], models:[], zeroDataRetention:true, disallowPromptTraining:true}},
      });
      const generationId = result.providerMetadata?.gateway?.generationId;
      // Missing privacy confirmation must not expose generated content. Keep the
      // receipt path intact: a billed response is still a cost, even if withheld.
      const privacyConfirmed = result.providerMetadata?.gateway?.enabledZeroDataRetention === true;
      return {text:privacyConfirmed ? result.text : '', generationId:typeof generationId === 'string' ? generationId : undefined};
    },
    billing: generationId => boundedGateway.getGenerationInfo({id:generationId}),
  };
}
export async function budgetedAiText(input: Input): Promise<string | undefined> {
  if (process.env.SUPERBRAIN_AI_ENABLED !== 'true') return;
  const contract = parseAiCostContract(process.env.SUPERBRAIN_AI_COST_CONTRACT, process.env.SUPERBRAIN_AI_MODEL);
  if (!contract) return;
  const deps = productionDependencies();
  if (!deps) return;
  return runBudgetedAi(input, contract, deps);
}
