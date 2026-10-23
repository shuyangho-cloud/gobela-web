'use client';
import {useEffect,useState} from 'react';
import {call} from '../../lib/superbrain/browser';
import type {marketingBriefing} from '../../lib/superbrain/marketing';
import styles from './workspace.module.css';
import MarketingAssetPreview from './MarketingAssetPreview';
import type {productionPacket} from '../../lib/superbrain/marketing-production';
type Packet=ReturnType<typeof productionPacket>;
type Briefing=ReturnType<typeof marketingBriefing>&{assets:{id:string;label:string;mime:string;available:boolean;usage:string;width:number;height:number}[]};
export default function MarketingBrain({onPrepared}:{onPrepared:()=>Promise<void>}){
 const [briefing,setBriefing]=useState<Briefing|null>(null);
 const [attempt,setAttempt]=useState(0);
 const [packet,setPacket]=useState<Packet|null>(null);
 const [error,setError]=useState('');const [busy,setBusy]=useState('');const [notice,setNotice]=useState('');
 useEffect(()=>{
  const controller=new AbortController();
  call('founder/marketing','GET',undefined,controller.signal).then(data=>{setBriefing(data);setPacket(data.saved_packet??null);}).catch(e=>{if(!controller.signal.aborted)setError(e.message);});
  return()=>controller.abort();
 },[attempt]);
 async function prepareProduction(){
  setBusy('production');setError('');
  try{const saved=await call('founder/marketing-production/weekend-discovery','POST',{});setPacket(saved.draft.production_packet);setNotice('Production packet saved to the campaign. References are private; no generation or publishing occurred.');await onPrepared();}
  catch(e){setError(e instanceof Error?e.message:'Unable to prepare production packet');}finally{setBusy('');}
 }
 function download(){if(!packet)return;const url=URL.createObjectURL(new Blob([JSON.stringify(packet,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='gobela-weekend-production-packet.json';link.click();URL.revokeObjectURL(url);}
 async function prepare(strategyId:string){
  setBusy(strategyId);setError('');setNotice('');
  try{
   const campaign=await call('founder/marketing','POST',{strategy_id:strategyId});
   setBriefing(previous=>previous?{...previous,proposals:previous.proposals.map(p=>p.id===strategyId?{...p,existing_campaign_id:campaign.id}:p)}:previous);
   setNotice(`“${campaign.title}” is saved as a draft with its production brief and tracking code. No publishing or spending was requested.`);
   await onPrepared();
  }catch(e){setError(e instanceof Error?e.message:'Unable to prepare campaign');}finally{setBusy('');}
 }
 if(!briefing)return <section aria-busy={!error}><h2>Your marketing recommendation</h2><p role={error?'alert':'status'}>{error||'Reviewing source lessons, catalogue evidence and campaign outcomes…'}</p>{error&&<button onClick={()=>{setError('');setAttempt(value=>value+1);}}>Retry connection</button>}</section>;
 return <section aria-label="Marketing recommendations">
  <div className={styles.recommendation}><p className={styles.eyebrow}>SUPERBRAIN RECOMMENDS</p><h2>{briefing.recommendation}</h2><p>{briefing.rationale}</p><p>Proposed spend: <strong>S$0</strong>. Prepare the work now; approve exact content and costs before external action.</p></div>
  {error&&<p role="alert" className={styles.alert}>{error}</p>}{notice&&<p role="status">{notice}</p>}
  <div className={styles.recommendation}><h2>Prepare the first campaign for production</h2><p>Superbrain selects checked activity details, connects the approved family and logo references, and prepares shot prompts, channel copy, carousel text and an enquiry tracking link.</p><button disabled={!!busy} onClick={()=>void prepareProduction()}>{busy==='production'?'Preparing production packet…':'Prepare production packet'}</button></div>
  <h3>Activity evidence and decisions</h3><div className={styles.cards}>{briefing.partner_evidence.map(item=><article className={styles.card} key={item.legacy_id}><h4>{item.provider}</h4><p>{item.status}</p><p>{item.verified_claim}</p><p>{item.price_note}</p><a href={item.source_url} target="_blank" rel="noreferrer">Checked provider source</a></article>)}</div>
  {packet&&<section className={styles.recommendation} aria-label="Prepared production packet"><h2>{packet.title} · production packet</h2><p>{packet.decision}</p><p>{packet.status} · revision {packet.revision}</p><button onClick={download}>Download production packet</button><h3>Channel copy</h3>{packet.channels.map(channel=><article key={channel.channel}><h4>{channel.channel} · {channel.resolution} · {channel.duration_seconds}s</h4><p>{channel.caption}</p></article>)}<h3>Shots and sound</h3><ol>{packet.shots.map(shot=><li key={shot.time}><strong>{shot.time}</strong> {shot.visual}<p>Sound: {shot.audio}</p><details><summary>Prepared shot prompt</summary><p>{shot.prompt}</p></details></li>)}</ol><h3>Carousel copy</h3><ol>{packet.carousel.map(slide=><li key={slide.slide}><strong>{slide.title}</strong><p>{slide.body}</p></li>)}</ol><p>Enquiry destination: <a href={packet.attribution.destination}>{packet.attribution.destination}</a></p><p>{packet.attribution.limitation}</p><details><summary>Release checks</summary><ul>{packet.delivery_checks.map(check=><li key={check}>{check}</li>)}</ul></details></section>}
  <details><summary>Approved production references · private previews</summary><p>The square benchmark is a reference, not a completed vertical campaign. Identity photos are for continuity only.</p><div className={styles.cards}>{briefing.assets.map(asset=><MarketingAssetPreview key={asset.id} asset={asset}/>)}</div></details>
  <p>Research checked {briefing.research_checked_at}. {briefing.coverage}</p>
  <div className={styles.cards}>{briefing.proposals.map(proposal=><article className={styles.card} key={proposal.id}>
   <p className={styles.eyebrow}>{proposal.rank===1?'DO FIRST':`THEN ${proposal.rank}`}</p><h3>{proposal.title}</h3><p>{proposal.reason}</p>
   <p><strong>Audience:</strong> {proposal.audience}</p><p><strong>Format:</strong> {proposal.format}</p><p><strong>Opening:</strong> {proposal.hook}</p>
   <p><strong>Evidence:</strong> {proposal.confidence}</p>
   <button disabled={!!busy} onClick={()=>proposal.existing_campaign_id?document.getElementById(proposal.existing_campaign_id)?.scrollIntoView({behavior:'smooth',block:'start'}):void prepare(proposal.id)}>{busy===proposal.id?'Preparing…':proposal.existing_campaign_id?'View saved campaign':'Prepare this campaign'}</button>
   <details><summary>Review the prepared idea</summary><h4>Draft caption</h4><p>{proposal.caption}</p><h4>Production storyboard</h4><ol>{proposal.steps.map(step=><li key={step}>{step}</li>)}</ol>
    <h4>Checked activity candidates</h4><ul>{proposal.activity_candidates.map(item=><li key={item.legacy_id}>{item.provider}: {item.verified_claim}</li>)}</ul><h4>Catalogue evidence</h4>{proposal.listings.length?<ul>{proposal.listings.map(row=><li key={row.id}><a href={row.source_url} target="_blank" rel="noreferrer">{row.title}</a> · {row.provider} · {row.area} · S${(row.price_cents/100).toFixed(2)} · reviewed {row.verified_at.slice(0,10)}</li>)}</ul>:<p>No suitable verified listing yet. The brief remains a draft.</p>}
    <h4>Release requirements</h4><ul>{proposal.blockers.map(item=><li key={item}>{item}</li>)}</ul><h4>How we will judge it</h4><p>{proposal.measurement.primary}</p><p>{proposal.measurement.decision}</p><p>{proposal.measurement.coverage}</p><p>{proposal.measurement.secondary}</p>
   </details>
  </article>)}</div>
  <h2>What we learned and how GoBela applies it</h2><div className={styles.cards}>{briefing.playbooks.map(playbook=><article className={styles.card} key={playbook.id}><h3>{playbook.title}</h3><p>{playbook.adaptation}</p><ul>{playbook.sources.map(source=><li key={source.name}><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a> — {source.observation} <small>({source.evidence})</small></li>)}</ul></article>)}</div>
  <details><summary>Research library · 20 agencies and 20 KOL accounts</summary><p>{briefing.evidence_limits}</p>{(['agencies','creators'] as const).map(group=><div key={group}><h3>{group==='agencies'?'Agencies':'Creators'}</h3><div className={styles.cards}>{briefing[group].map(source=><article className={styles.card} key={source.name}><h4><a href={source.url} target="_blank" rel="noreferrer">{source.name}</a></h4><p>{source.observation}</p><p><strong>Lesson for GoBela:</strong> {source.lesson}</p><p>Evidence: {source.evidence}</p></article>)}</div></div>)}</details>
  <details><summary>GoBela creative standards</summary><ul>{briefing.production_rules.map(rule=><li key={rule}>{rule}</li>)}</ul></details>
 </section>;
}
