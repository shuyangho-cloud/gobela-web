'use client';
import {useEffect,useState} from 'react';
import {call} from '../../lib/superbrain/browser';
import type {PaymentSnapshot} from '../../lib/superbrain/payments';
import {paymentAmount,paymentPriority} from '../../lib/superbrain/payment-display';
import styles from './workspace.module.css';
export default function PaymentMonitor() {
  const [snapshot,setSnapshot]=useState<PaymentSnapshot|null>(null);
  const [error,setError]=useState('');
  const [busy,setBusy]=useState(false);
  const [refresh,setRefresh]=useState(0);
  useEffect(()=>{
    const controller=new AbortController();
    setSnapshot(null);setError('');setBusy(true);
    void call('founder/payments','GET',undefined,controller.signal).then(data=>{if(!controller.signal.aborted)setSnapshot(data);}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'Payment data unavailable');}).finally(()=>{if(!controller.signal.aborted)setBusy(false);});
    return()=>controller.abort();
  },[refresh]);
  return <section aria-label="Payment monitoring"><h2>Payments needing attention</h2><p>Review unfinished attempts and Stripe account requirements. Awaiting a payment method is not a confirmed decline or lost revenue.</p><button disabled={busy} onClick={()=>setRefresh(value=>value+1)}>{busy?'Checking Stripe…':'Refresh payment check'}</button>
    {error&&<p role="alert">{error}</p>}
    {snapshot&&<><p><strong>{paymentPriority(snapshot)}</strong></p><p role="status">Checked {new Date(snapshot.checkedAt).toLocaleString('en-SG',{timeZone:'Asia/Singapore'})} (Singapore). {snapshot.complete?'All current PaymentIntents scanned.':`Partial coverage: only the newest ${snapshot.scanned} PaymentIntents scanned; older issues may exist.`}</p>
      <p>Payments: {snapshot.account.paymentsEnabled?'enabled':'disabled'}. Payouts: {snapshot.account.payoutsEnabled?'enabled':'disabled'}. Overdue requirements: {snapshot.account.overdueRequirements}. Currently due: {snapshot.account.pendingRequirements}.</p>
      <p>This check covers PaymentIntent status and account requirements. Booking fulfilment, expired Checkout sessions, webhook delivery, separate refunds and disputes are not reconciled here. No messages, charges or refunds are triggered.</p>
      <div className={styles.cards}>{snapshot.rows.map(row=><article className={styles.card} key={row.id}><h3>{row.assessment}</h3><p>{paymentAmount(row.amount,row.currency)} · {row.partner||'Partner not recorded'}</p><p>{new Date(row.created).toLocaleString('en-SG',{timeZone:'Asia/Singapore'})} (Singapore)</p>{row.founderLinked&&<p>Founder ID in payment metadata — possible test or repeated checkout; still included in this check.</p>}<a href={`https://dashboard.stripe.com/payments/${row.id}`} target="_blank" rel="noreferrer">Review in Stripe</a></article>)}</div>
      {!snapshot.rows.length&&<p>No PaymentIntents returned in this scan. This does not verify other payment or booking systems.</p>}
    </>}
  </section>;
}
