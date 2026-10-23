import {it,expect} from 'vitest';
import {reviewedPartnerCandidates} from '../../lib/superbrain/marketing-catalogue';
import {marketingBriefing,campaignFromProposal} from '../../lib/superbrain/marketing';
import {productionPacket} from '../../lib/superbrain/marketing-production';
import {marketingAssetResponse} from '../../lib/superbrain/marketing-assets';
const now=Date.parse('2026-10-24T00:00:00Z');
const rows=[{id:'minisport-explorers-1',name:'Explorers',provider:'MiniSport Singapore',is_active:true,trial_price:0,location:'Singapore'},{id:'codeninja-scratch-1',name:'Scratch',provider:'Code Ninja',is_active:true,trial_price:57,location:'Havelock'}];
it('uses checked fields without upgrading internal price claims; holds conflicts and stale reviews',()=>{
 const evidence=reviewedPartnerCandidates(rows,now);expect(evidence[0].eligible).toBe(true);expect(evidence[0].price_public_cents).toBeNull();expect(evidence[1].eligible).toBe(false);expect(evidence[1].price_conflict).toBe(true);
 expect(reviewedPartnerCandidates(rows,now+40*86400000).every(p=>!p.eligible)).toBe(true);
 expect(reviewedPartnerCandidates([{...rows[0],provider:'Impersonated provider'}],now)).toEqual([]);
});
it('produces a concrete native vertical packet from approved assets and checked partner details',()=>{
 const brief=marketingBriefing({listings:[],outcomes:[],campaigns:[],canonical:rows,now});
 const proposal=brief.proposals[0];const campaign={...campaignFromProposal(proposal),tracking_code:'a&b'};
 const packet=productionPacket(proposal,campaign);expect(packet.claims).toHaveLength(1);expect(packet.claims[0].provider).toBe('MiniSport Singapore');
 expect(packet.channels[0].caption).not.toMatch(/free|S\$0|S\$57|S\$65/i);expect(packet.channels[0].caption).toContain('Explorers');
 expect(packet.attribution.destination).toBe('/bela?campaign=a%26b');expect(packet.assets.map(a=>a.id)).toEqual(['benchmark','logo','mother','father','daughter']);
 expect(packet.delivery_checks[0]).toContain('1080×1080');expect(packet.spend_cents).toBe(0);expect(packet.revision).toBe(productionPacket(proposal,campaign).revision);
 expect(()=>productionPacket(brief.proposals[1],campaign)).toThrow('currently prepared');
});
it('asset lookup is allowlisted and fails closed without private media provisioning',async()=>{
 await expect(marketingAssetResponse('../../.env.local')).rejects.toThrow('Asset not found');
 const previous=process.env.SUPERBRAIN_MARKETING_ASSET_ROOT;delete process.env.SUPERBRAIN_MARKETING_ASSET_ROOT;
 try{await expect(marketingAssetResponse('mother')).rejects.toThrow('not provisioned');}finally{if(previous)process.env.SUPERBRAIN_MARKETING_ASSET_ROOT=previous;}
});
