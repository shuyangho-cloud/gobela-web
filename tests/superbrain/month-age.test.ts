import {it,expect} from 'vitest';
import {recommend, type Listing} from '../../lib/superbrain/domain';
it('infant eligibility uses explicit months',()=>{
 const row:Listing={id:'x',title:'Baby session',provider:'Provider',category:'play',area:'East',min_age:0,max_age:1,min_age_months:6,max_age_months:18,price_cents:0,source_url:'https://example.com',verified_at:new Date().toISOString(),active:true};
 expect(recommend([row],{age:0,age_months:5,budget_cents:0})).toHaveLength(0);
 expect(recommend([row],{age:0,age_months:6,budget_cents:0})).toHaveLength(1);
});
