'use client';
import {useEffect,useState} from 'react';
import {call} from '../../lib/superbrain/browser';
import type {marketingBriefing} from '../../lib/superbrain/marketing';
import styles from './workspace.module.css';
type Briefing=ReturnType<typeof marketingBriefing>;
export default function MarketingBrain({onPrepared}:{onPrepared:()=>Promise<void>}){
 const [briefing,setBriefing]=useState<Briefing|null>(null);
 const [error,setError]=useState('');const [busy,setBusy]=useState('');const [notice,setNotice]=useState('');
 useEffect(()=>{
  const controller=new AbortController();
  call('founder/marketing','GET',undefined,controller.signal).then(setBriefing).catch(e=>{if(!controller.signal.aborted)setError(e.message);});
  return()=>controller.abort();
 },[]);
 async function prepare(strategyId:string){
  setBusy(strategyId);setError('');setNotice('');
  try{
   const campaign=await call('founder/marketing','POST',{strategy_id:strategyId});
   setBriefing(previous=>previous?{...previous,proposals:previous.proposals.map(p=>p.id===strategyId?{...p,existing_campaign_id:campaign.id}:p)}:previous);
   setNotice(`“${campaign.title}” is saved as a draft with its production brief and tracking code. No publishing or spending was requested.`);
   await onPrepared();
  }catch(e){setError(e instanceof Error?e.message:'Unable to prepare campaign');}finally{setBusy('');}
 }
 if(!briefing)return <section aria-busy={!error}><h2>Your marketing recommendation</h2><p role={error?'alert':'status'}>{error||'Reviewing source lessons, catalogue evidence and campaign outcomes…'}</p></section>;
 return <section aria-label="Marketing recommendations">
  <div className={styles.recommendation}><p className={styles.eyebrow}>SUPERBRAIN RECOMMENDS</p><h2>{briefing.recommendation}</h2><p>{briefing.rationale}</p><p>Proposed spend: <strong>S$0</strong>. Prepare the work now; approve exact content and costs before external action.</p></div>
  {error&&<p role="alert" className={styles.alert}>{error}</p>}{notice&&<p role="status">{notice}</p>}
  <p>Research checked {briefing.research_checked_at}. {briefing.coverage}</p>
  <div className={styles.cards}>{briefing.proposals.map(proposal=><article className={styles.card} key={proposal.id}>
   <p className={styles.eyebrow}>{proposal.rank===1?'DO FIRST':`THEN ${proposal.rank}`}</p><h3>{proposal.title}</h3><p>{proposal.reason}</p>
   <p><strong>Audience:</strong> {proposal.audience}</p><p><strong>Format:</strong> {proposal.format}</p><p><strong>Opening:</strong> {proposal.hook}</p>
   <p><strong>Evidence:</strong> {proposal.confidence}</p>
   <button disabled={!!busy} onClick={()=>proposal.existing_campaign_id?document.getElementById(proposal.existing_campaign_id)?.scrollIntoView({behavior:'smooth',block:'start'}):void prepare(proposal.id)}>{busy===proposal.id?'Preparing…':proposal.existing_campaign_id?'View saved campaign':'Prepare this campaign'}</button>
   <details><summary>Review the prepared idea</summary><h4>Draft caption</h4><p>{proposal.caption}</p><h4>Production storyboard</h4><ol>{proposal.steps.map(step=><li key={step}>{step}</li>)}</ol>
    <h4>Catalogue evidence</h4>{proposal.listings.length?<ul>{proposal.listings.map(row=><li key={row.id}><a href={row.source_url} target="_blank" rel="noreferrer">{row.title}</a> · {row.provider} · {row.area} · S${(row.price_cents/100).toFixed(2)} · reviewed {row.verified_at.slice(0,10)}</li>)}</ul>:<p>No suitable verified listing yet. The brief remains a draft.</p>}
    <h4>Release requirements</h4><ul>{proposal.blockers.map(item=><li key={item}>{item}</li>)}</ul><h4>How we will judge it</h4><p>{proposal.measurement.primary}</p><p>{proposal.measurement.decision}</p><p>{proposal.measurement.coverage}</p><p>{proposal.measurement.secondary}</p>
   </details>
  </article>)}</div>
  <h2>What we learned and how GoBela applies it</h2><div className={styles.cards}>{briefing.playbooks.map(playbook=><article className={styles.card} key={playbook.id}><h3>{playbook.title}</h3><p>{playbook.adaptation}</p><ul>{playbook.sources.map(source=><li key={source.name}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a> — {source.observation} <small>({source.evidence})</small></li>)}</ul></article>)}</div>
  <details><summary>Research library · 20 agencies and 20 KOL accounts</summary><p>{briefing.evidence_limits}</p>{(['agencies','creators'] as const).map(group=><div key={group}><h3>{group==='agencies'?'Agencies':'Creators'}</h3><div className={styles.cards}>{briefing[group].map(source=><article className={styles.card} key={source.name}><h4><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a></h4><p>{source.observation}</p><p><strong>Lesson for GoBela:</strong> {source.lesson}</p><p>Evidence: {source.evidence}</p></article>)}</div></div>)}</details>
  <details><summary>GoBela creative standards</summary><ul>{briefing.production_rules.map(rule=><li key={rule}>{rule}</li>)}</ul></details>
 </section>;
}
