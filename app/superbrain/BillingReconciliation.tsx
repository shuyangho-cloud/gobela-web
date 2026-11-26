'use client';
import {useEffect,useRef,useState} from 'react';
import {call} from '../../lib/superbrain/browser';
export default function BillingReconciliation(){
  const active=useRef<AbortController|null>(null);
  const [cursor,setCursor]=useState<string|null>(null);
  const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
  useEffect(()=>()=>active.current?.abort(),[]);
  async function reconcile(){
    active.current?.abort();const controller=new AbortController();active.current=controller;
    setBusy(true);setMessage('');
    try{
      const result=await call('founder/billing-reconciliation','POST',cursor?{cursor}:{},controller.signal);
      if(!controller.signal.aborted){setCursor(result.nextCursor);setMessage(`${result.settled} verified charges settled. ${result.unresolved} lookups remain unresolved. ${result.manualReview} reservations need manual review. ${result.pendingAtStart} reservations were pending when this check started.${result.overruns?' An overrun was recorded; review the halted budget before new requests.':''}${result.nextCursor?' More receipts can be checked.':' End of this pass; unknown charges stay reserved.'}`);}
    }catch(e){if(!controller.signal.aborted){setCursor(null);setMessage(e instanceof Error?e.message:'Billing check unavailable; holds remain reserved.');}}
    finally{if(!controller.signal.aborted)setBusy(false);}
  }
  return <section aria-label="AI billing reconciliation"><h2>Pending AI charges</h2><p>Check up to two existing billing receipts. This does not generate responses or enable execution. Unknown charges stay reserved.</p><button disabled={busy} onClick={()=>void reconcile()}>{busy?'Checking receipts…':cursor?'Check next receipts':'Reconcile pending AI charges'}</button>{message&&<p role="status">{message}</p>}</section>;
}
