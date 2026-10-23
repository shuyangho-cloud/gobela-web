import { describe,it,expect } from 'vitest';
import { recommend,actionPayload,timestamp,campaignDraft,safeError,type Listing } from '../../lib/superbrain/domain';
const now=Date.parse('2026-10-23T00:00:00Z');
const base:Listing={id:'a',title:'Swimming',provider:'School',category:'play',area:'Tampines',min_age:4,max_age:8,price_cents:3000,source_url:'https://example.com',verified_at:'2026-10-20T00:00:00Z',active:true};
describe('Parent recommendations',()=>{
 it('enforces age, budget, category, area and freshness',()=>{
  const rows=[base,{...base,id:'old',verified_at:'2026-01-01T00:00:00Z'},{...base,id:'future',verified_at:'2027-01-01T00:00:00Z'},{...base,id:'price',price_cents:9999},{...base,id:'age',min_age:9},{...base,id:'inactive',active:false},{...base,id:'area',area:'Jurong'}];
  expect(recommend(rows,{age:6,budget_cents:4000,area:'tampines',category:'play'},now).map(x=>x.id)).toEqual(['a']);
 });
 it('does not claim availability',()=>expect(recommend([base],{age:6,budget_cents:4000},now)[0].availability).toContain('Not confirmed'));
});
it('rejects client-supplied arbitrary channels and URLs',()=>{
 expect(()=>actionPayload({channel:'shell',content:'x',audience:'all',campaign_id:'x'})).toThrow();
 expect(()=>timestamp('2026-10-23T10:00:00','time')).toThrow();
});
it('creates drafts with review checks across all categories',()=>{
 for(const category of ['cook','eat','play','learn','shop'] as const) expect(campaignDraft({title:'Weekend',audience:'parents',category,objective:'Explore'}).checklist).toContain('Check asset rights and any parent reuse consent');
});
it('does not leak internal error text',()=>expect(safeError(new Error('secret')).message).not.toContain('secret'));
