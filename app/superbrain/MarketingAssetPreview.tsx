'use client';
import {useEffect,useRef,useState} from 'react';
import {downloadPrivateReference} from '../../lib/superbrain/asset-download';
import {browserClient} from '../../lib/superbrain/browser';
export default function MarketingAssetPreview({asset,resource='marketing-assets'}:{resource?:'marketing-assets'|'publishing-media';asset:{id:string;label:string;mime:string;available:boolean;usage:string;width:number;height:number;bytes:number}}){
 const alive=useRef(true);
 const [url,setUrl]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const objectUrl=useRef('');const controller=useRef<AbortController|null>(null);
 useEffect(()=>{alive.current=true;return()=>{alive.current=false;controller.current?.abort();if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);};},[]);
 async function preview(){
  setBusy(true);setError('');controller.current=new AbortController();
  try{const {data}=await browserClient().auth.getSession();if(!data.session)throw new Error('Please sign in again.');
   const blob=await downloadPrivateReference(asset,data.session.access_token,controller.current.signal,fetch,resource);
   const current=await browserClient().auth.getSession();
   if(!alive.current||controller.current.signal.aborted||current.data.session?.user.id!==data.session.user.id)return;
   const next=URL.createObjectURL(blob);if(objectUrl.current)URL.revokeObjectURL(objectUrl.current);objectUrl.current=next;setUrl(next);
  }catch(e){if(alive.current&&!controller.current?.signal.aborted)setError(e instanceof Error?e.message:'Unable to preview');}finally{if(alive.current)setBusy(false);}
 }
 return <article><h4>{asset.label}</h4><p>{asset.usage} · {asset.width}×{asset.height}</p>{url?(asset.mime.startsWith('video/')?<video controls preload="metadata" src={url} style={{width:'100%',maxWidth:400}} aria-label={asset.label}/>:<img src={url} alt={asset.label} style={{maxWidth:'100%',maxHeight:280,objectFit:'contain'}}/>):<button disabled={!asset.available||busy} onClick={()=>void preview()}>{busy?'Loading…':asset.available?'Preview private reference':'Asset not provisioned'}</button>}{error&&<p role="alert">{error}</p>}</article>;
}
