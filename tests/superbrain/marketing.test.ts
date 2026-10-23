import {it,expect} from 'vitest';
import {marketingBriefing,campaignFromProposal,type MarketingListing} from '../../lib/superbrain/marketing';
const now=Date.parse('2026-10-24T00:00:00Z');
const listing:MarketingListing={id:'real',title:'Family activity',provider:'Partner',category:'play',area:'East',price_cents:1000,source_url:'https://gobela.sg/activities',verified_at:'2026-10-23T00:00:00Z',active:true};
it('recommends a concrete first move without a questionnaire or invented performance',()=>{
 const data=marketingBriefing({listings:[listing],campaigns:[],outcomes:[],now});
 expect(data.agencies).toHaveLength(20);expect(data.creators).toHaveLength(20);
 expect(data.proposals[0].id).toBe('weekend-discovery');expect(data.proposals[0].listings).toEqual([listing]);
 expect(data.proposals.every(p=>p.proposed_spend_cents===0)).toBe(true);
 expect(data.proposals[0].measurement.coverage).toContain('No linked completed booking');
 expect(data.production_rules.join(' ')).toContain('No family health records');
});
it('holds stale, future, inactive and synthetic catalogue claims out of campaign copy',()=>{
 const variants=[{...listing,verified_at:'2026-08-01'},{...listing,verified_at:'2027-01-01'},{...listing,active:false},{...listing,source_url:'https://example.com'},{...listing,source_url:'http://gobela.sg'},{...listing,price_cents:-1}];
 const data=marketingBriefing({listings:variants,campaigns:[],outcomes:[],now});
 expect(data.proposals.every(p=>!p.listings.length)).toBe(true);
 expect(data.proposals[0].blockers[0]).toContain('No suitable listing');
});
it('prepares stable drafts without channel execution, approval or overwriting founder choices',()=>{
 const data=marketingBriefing({listings:[listing],outcomes:[{campaign_id:'a',linked_completed_bookings:2}],campaigns:[],now});
 const draft=campaignFromProposal(data.proposals[0]);
 expect(draft.id).toBe(campaignFromProposal(data.proposals[0]).id);
 expect(draft.draft.status).toBe('draft');expect(draft.draft.source_urls.length).toBeGreaterThan(0);
 expect(draft.draft).not.toHaveProperty('approved');expect(draft).not.toHaveProperty('payload');
 expect(marketingBriefing({listings:[],outcomes:[],campaigns:[draft],now}).proposals[0].existing_campaign_id).toBe(draft.id);
 expect(data.proposals[0].measurement.coverage).toContain('no causal');
});

it('uses linked campaign evidence to reorder recommendations without claiming causation',()=>{
 const baseline=marketingBriefing({listings:[listing],campaigns:[],outcomes:[],now});
 const saved=campaignFromProposal(baseline.proposals[1]);
 const data=marketingBriefing({listings:[listing],campaigns:[saved],outcomes:[{campaign_id:saved.id,linked_completed_bookings:3}],now});
 expect(data.proposals[0].id).toBe('experience-proof');
 expect(data.recommendation).toContain('strongest recorded');
 expect(data.proposals[0].measurement.coverage).toContain('no causal');
});
