import {expect,it} from 'vitest';
import {reviewedPartnerCandidates} from '../../lib/superbrain/marketing-catalogue';
const rows=[{id:'minisport-explorers-1',name:'Explorers',provider:'MiniSport Singapore',is_active:true,trial_price:0,location:'Singapore'},{id:'codeninja-scratch-1',name:'Scratch',provider:'Code Ninja',is_active:true,trial_price:57,location:'Havelock'}];
it('keeps provider-only free-trial conditions distinct from a verified GoBela price and holds negotiated-price conflict',()=>{
 const [sport,code]=reviewedPartnerCandidates(rows,Date.parse('2026-10-27T00:00:00Z'));
 expect(sport.offer_check?.applies_to_gobela).toBe(false);
 expect(sport.price_note).toContain('emailed promo-code');
 expect(sport.price_note).toContain('do not describe the GoBela booking as free');
 expect(code.eligible).toBe(false);expect(code.price_conflict).toBe(true);
 expect(code.internal_price_cents).toBe(5700);expect(code.offer_check?.price_cents).toBe(6500);
});
it('a later price check never refreshes expired programme or age evidence',()=>{
 const reviewed=reviewedPartnerCandidates(rows,Date.parse('2026-11-24T00:00:00Z'));
 expect(reviewed.every(row=>!row.eligible&&row.status==='Source review expired')).toBe(true);
});
