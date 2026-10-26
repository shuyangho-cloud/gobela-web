export class Problem extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export const categories = ['cook', 'eat', 'play', 'learn', 'shop'] as const;
export type Category = typeof categories[number];
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Problem(400, 'Expected an object');
  return value as Record<string, unknown>;
}
export function text(value: unknown, name: string, max = 2000): string {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Problem(400, `Invalid ${name}`);
  return value.trim();
}
export function integer(value: unknown, name: string, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value) || Number(value) < min || Number(value) > max) throw new Problem(400, `Invalid ${name}`);
  return Number(value);
}
export function choice<T extends string>(value: unknown, options: readonly T[], name: string): T {
  if (!options.includes(value as T)) throw new Problem(400, `Invalid ${name}`);
  return value as T;
}
export function uuid(value: unknown): string {
  const result = text(value, 'identifier', 36);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(result)) throw new Problem(400, 'Invalid identifier');
  return result;
}
export function timestamp(value: unknown, name: string): string {
  const result = text(value, name, 40);
  if (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(result) || !Number.isFinite(Date.parse(result))) throw new Problem(400, `Invalid ${name}`);
  return new Date(result).toISOString();
}
export function httpsUrl(value: unknown): string {
  const result = text(value, 'source URL', 1000);
  try { if (new URL(result).protocol !== 'https:') throw new Error(); } catch { throw new Problem(400, 'An HTTPS URL is required'); }
  return result;
}
export interface Listing {
  id: string; title: string; provider: string; category: Category; area: string;
  min_age: number; max_age: number; price_cents: number; source_url: string;
  verified_at: string; active: boolean; legacy_id?: string; min_age_months?: number; max_age_months?: number;
}
export interface Filters { age: number; age_months?: number; budget_cents: number; area?: string; category?: Category }
export function recommend(rows: Listing[], filters: Filters, now = Date.now()) {
  return rows.filter(row => row.active && (row.min_age_months ?? row.min_age*12) <= (filters.age_months ?? filters.age*12) && (row.max_age_months ?? row.max_age*12+11) >= (filters.age_months ?? filters.age*12)
    && row.price_cents <= filters.budget_cents && (!filters.category || row.category === filters.category)
    && (!filters.area || row.area.toLowerCase().includes(filters.area.toLowerCase()))
    && Number.isFinite(Date.parse(row.verified_at)) && Date.parse(row.verified_at) <= now
    && now - Date.parse(row.verified_at) <= 30 * 86400000)
    .sort((a, b) => a.price_cents - b.price_cents || a.id.localeCompare(b.id)).slice(0, 5)
    .map(row => ({ ...row, reason: `Fits age ${filters.age}, your budget${filters.area ? ' and area' : ''}.`, availability: 'Not confirmed; check with the provider before booking.' }));
}
export function campaignDraft(input: { title: string; audience: string; category: Category; objective: string }) {
  return {
    headline: `${input.title}: a little more family time`,
    caption: `Looking for ${input.category} ideas? GoBela helps ${input.audience} explore options and spend more time together. ${input.objective} Open GoBela to discover what fits your family.`,
    checklist: ['Confirm the offer and linked listings', 'Use the approved family cast and original GoBela logo', 'Check asset rights and any parent reuse consent', 'Review platform format and campaign tracking'],
    status: 'draft', generated_by: 'GoBela brand template; founder review required',
  };
}
export function actionPayload(value: unknown) {
  const data = object(value);
  const channel = choice(data.channel, ['instagram', 'facebook', 'email', 'push'] as const, 'channel');
  const content = text(data.content, 'content', 5000);
  const audience = text(data.audience, 'audience', 500);
  let media;
  if(data.media!==undefined){
    if(channel!=='instagram')throw new Problem(400,'Media attachment is supported only for Instagram Reels');
    const item=object(data.media),sha256=text(item.sha256,'media checksum',64);
    if(!/^[0-9a-f]{64}$/.test(sha256)||typeof item.reuse_approved!=='boolean')throw new Problem(400,'Explicit media reuse review required');
    media={asset_id:choice(item.asset_id,['backpack-reel-audio48k'] as const,'approved video asset'),sha256,reuse_approved:item.reuse_approved};
  }
  return { channel, content, audience, campaign_id: uuid(data.campaign_id),...(media?{media}:{}) };
}
export function safeError(error: unknown) {
  return error instanceof Problem ? { status: error.status, message: error.message } : { status: 500, message: 'Request failed. Try again or contact GoBela support.' };
}
