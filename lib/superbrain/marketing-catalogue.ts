// Human-reviewed public sources. These attest only the fields listed below.
// Runtime canonical catalogue identity/active state remains authoritative.
export type CanonicalMarketingRow={id:string;name:string;provider:string;is_active:boolean;trial_price:number;location:string};
export const partnerEvidence=[
 {legacy_id:'minisport-explorers-1',provider:'MiniSport Singapore',source_url:'https://www.minisport.sg/programs',checked_at:'2026-10-23T18:09:03Z',category:'play',verified_claim:'MiniSport offers its Explorers multi-sport programme for ages 4–6.',fields:['programme','age'],offer_check:{source_url:'https://optin.minisport.sg/landing',checked_at:'2026-10-26T17:53:00Z',price_cents:0,applies_to_gobela:false,conditions:'The provider advertises a free trial through its own signup and emailed promo-code checkout. GoBela-route eligibility is not verified; do not describe the GoBela booking as free.'},price_public_cents:null,price_note:'GoBela lists a zero trial price, but this reviewed page does not verify a free offer. Omit price claims.'},
 {legacy_id:'bubbles-preschool-1',provider:'Bubbles Gym (Eastwood)',source_url:'https://bubblesgym.com.sg/',checked_at:'2026-10-23T18:09:03Z',category:'play',verified_claim:'Bubbles Gym lists KinderGym for ages 3–5 and a Bedok Eastwood branch.',fields:['programme','age','branch'],offer_check:null,price_public_cents:null,price_note:'GoBela lists S$33. The reviewed provider page does not confirm this price. Omit it from release copy.'},
 {legacy_id:'elevate-ballet-1',provider:'Elevate Dance Academie',source_url:'https://elevatedance.com.sg/foundations/',checked_at:'2026-10-23T18:09:03Z',category:'play',verified_claim:'Elevate offers Foundation in Dance I for ages 3–4 and II for ages 4–5.',fields:['programme','age'],offer_check:null,price_public_cents:null,price_note:'GoBela lists S$45. The reviewed provider page does not confirm the trial price. Omit it from release copy.'},
 {legacy_id:'codeninja-scratch-1',provider:'Code Ninja',source_url:'https://www.codeninja.com.sg/ages-9-to-12',checked_at:'2026-10-23T18:09:03Z',category:'learn',verified_claim:'Code Ninja describes a Scratch-to-Python programme for ages 9–12.',fields:['programme','age','public_trial_price'],offer_check:{source_url:'https://www.codeninja.com.sg/trial-class-page',checked_at:'2026-10-26T17:53:00Z',price_cents:6500,applies_to_gobela:false,conditions:'Current provider trial and linked Punchpass pages both show S$65. The GoBela S$57 agreement has not been corroborated; keep it on hold and preserve the canonical value.'},price_public_cents:6500,price_note:'Provider advertises a S$65 trial; the GoBela catalogue currently lists S$57. Hold this listing from campaign selection until the difference is reconciled.'}
] as const;
export function reviewedPartnerCandidates(rows:CanonicalMarketingRow[],now=Date.now()){
 return partnerEvidence.flatMap(evidence=>{
  const row=rows.find(r=>r.id===evidence.legacy_id&&r.provider===evidence.provider&&r.is_active);
  if(!row)return [];
  const elapsed=now-Date.parse(evidence.checked_at);
  const fresh=elapsed>=0&&elapsed<=30*86400000;
  const conflict=evidence.price_public_cents!==null&&Math.round(row.trial_price*100)!==evidence.price_public_cents;
  const price_note=evidence.price_public_cents!==null?(conflict?`Provider advertises S$${(evidence.price_public_cents/100).toFixed(2)}; GoBela currently lists S$${row.trial_price}. Hold this listing until reconciled.`:'Catalogue and reviewed provider trial prices agree; reconfirm before using a price claim.'):`GoBela currently lists S$${row.trial_price}; the reviewed provider page does not verify this price. Omit price claims.`;
  const offerNote=evidence.offer_check?` ${evidence.offer_check.conditions}`:'';
  return [{...evidence,price_note:price_note+offerNote,title:row.name,area:row.location,internal_price_cents:Math.round(row.trial_price*100),eligible:fresh&&!conflict,status:!fresh?'Source review expired':conflict?'Price conflict — hold':'Activity details checked; omit unverified price',price_conflict:conflict}];
 });
}
