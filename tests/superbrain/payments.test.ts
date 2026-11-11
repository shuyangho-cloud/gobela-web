import {afterEach,it,expect,vi} from 'vitest';
import {assessPayment,paymentSnapshot} from '../../lib/superbrain/payments';
import {paymentAmount,paymentPriority} from '../../lib/superbrain/payment-display';
const founder='verified-founder';
const base=()=>({id:'pi_abc',amount:4500,currency:'sgd',created:1,status:'requires_payment_method',livemode:true,metadata:{user_id:founder,partner_name:'Partner'},latest_charge:null,last_payment_error:null,client_secret:'must-not-leak',receipt_email:'must-not-leak@example.test'});
const account={id:'acct_test',charges_enabled:true,payouts_enabled:false,requirements:{past_due:['representative'],currently_due:['representative']},email:'must-not-leak@example.test'};
function config(){vi.stubEnv('SUPERBRAIN_PAYMENTS_READ_ENABLED','true');vi.stubEnv('SUPERBRAIN_STRIPE_READ_KEY','rk_live_fixture');vi.stubEnv('SUPERBRAIN_STRIPE_ACCOUNT_ID','acct_test');}
function responses(...data:unknown[]){return vi.fn(async()=>Response.json(data.shift())) as unknown as typeof fetch;}
afterEach(()=>vi.unstubAllEnvs());
it('awaiting payment method is not a decline; founder metadata never hides it',()=>{
 const row=assessPayment(base(),founder,Date.now());
 expect(row.assessment).toContain('not a confirmed decline');expect(row.founderLinked).toBe(true);
 expect(JSON.stringify(row)).not.toMatch(/must-not-leak|client_secret|receipt_email|user_id/);
 expect(assessPayment({...base(),last_payment_error:{code:'card_declined'}},founder,Date.now()).assessment).toContain('Declined');
 expect(assessPayment({...base(),latest_charge:{outcome:{type:'blocked'}}},founder,Date.now()).assessment).toContain('Blocked');
});
it('preserves pending authentication/capture and never equates paid to fulfilled',()=>{
 expect(assessPayment({...base(),status:'requires_action'},founder,Date.now()).assessment).toContain('authentication');
 expect(assessPayment({...base(),status:'requires_capture'},founder,Date.now()).assessment).toContain('capture pending');
 expect(assessPayment({...base(),status:'succeeded'},founder,Date.now()).assessment).toContain('not checked');
 expect(()=>assessPayment({...base(),amount:NaN},founder,Date.now())).toThrow();
 expect(()=>assessPayment({...base(),livemode:false},founder,Date.now())).toThrow();
 expect(()=>assessPayment({...base(),latest_charge:'ch_unexpanded'},founder,Date.now())).toThrow();
});
it('disabled monitoring performs zero network reads',async()=>{
 const fetcher=vi.fn();vi.stubEnv('SUPERBRAIN_PAYMENTS_READ_ENABLED','false');
 await expect(paymentSnapshot(founder,fetcher)).rejects.toThrow('not enabled');expect(fetcher).not.toHaveBeenCalled();
});
it('checks account binding before listing payments and only GETs the fixed Stripe host',async()=>{
 config();const fetcher=responses(account,{object:'list',data:[base()],has_more:false});
 const result=await paymentSnapshot(founder,fetcher);expect(result.complete).toBe(true);expect(result.account.payoutsEnabled).toBe(false);expect(result.account.overdueRequirements).toBe(1);
 expect(JSON.stringify(result)).not.toContain('must-not-leak');
 for(const [url,options] of vi.mocked(fetcher).mock.calls){expect(String(url)).toMatch(/^https:\/\/api.stripe.com\/v1\//);expect(options?.method).toBe('GET');expect(options?.cache).toBe('no-store');expect(options?.redirect).toBe('error');}
 const mismatch=responses({...account,id:'acct_wrong'});await expect(paymentSnapshot(founder,mismatch)).rejects.toThrow();expect(mismatch).toHaveBeenCalledTimes(1);
});
it('bounds pagination and makes partial coverage explicit',async()=>{
 config();const fetcher=responses(account,{object:'list',data:[base()],has_more:true},{object:'list',data:[{...base(),id:'pi_second'}],has_more:true});
 const result=await paymentSnapshot(founder,fetcher);expect(result.complete).toBe(false);expect(result.scanned).toBe(2);
 expect(String(vi.mocked(fetcher).mock.calls[2][0])).toContain('starting_after=pi_abc');
});
it('errors, duplicate cursors and malformed responses never become empty healthy results',async()=>{
 config();await expect(paymentSnapshot(founder,vi.fn(async()=>{throw new Error('secret');}))).rejects.toThrow('could not be verified');
 await expect(paymentSnapshot(founder,responses(account,{object:'list',data:[],has_more:true}))).rejects.toThrow();
 await expect(paymentSnapshot(founder,responses(account,{object:'list',data:[base()],has_more:true},{object:'list',data:[base()],has_more:false}))).rejects.toThrow();
});
it('formats SGD, zero-decimal and three-decimal currencies without aggregating currencies',()=>{
 expect(paymentAmount(4500,'sgd')).toContain('45.00');expect(paymentAmount(4500,'jpy')).toContain('4,500');expect(paymentAmount(4500,'bhd')).toContain('4.500');
});

it('requires a dedicated restricted live key; never falls back to a general secret',async()=>{
 config();vi.stubEnv('SUPERBRAIN_STRIPE_READ_KEY','sk_live_do_not_use');const fetcher=vi.fn();
 await expect(paymentSnapshot(founder,fetcher)).rejects.toThrow('dedicated');expect(fetcher).not.toHaveBeenCalled();
});

it('prioritizes account restrictions and genuine errors above founder-origin hints',async()=>{
 config();const snapshot=await paymentSnapshot(founder,responses({...account,payouts_enabled:true,requirements:{past_due:[],currently_due:[]}},{object:'list',data:[base()],has_more:false}));
 expect(paymentPriority(snapshot)).toContain('founder-linked');
 snapshot.rows[0].assessment='Declined — review in Stripe';expect(paymentPriority(snapshot)).toContain('payment errors');
 snapshot.account.payoutsEnabled=false;expect(paymentPriority(snapshot)).toContain('account requirements');
});
