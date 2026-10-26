'use client';
import {useEffect,useRef,useState} from 'react';
import {browserClient,call} from '../../lib/superbrain/browser';
export default function PhotoUpload({value,onUploaded}:{value:string;onUploaded:(path:string)=>void}) {
 const [status,setStatus]=useState(''),[busy,setBusy]=useState(false);
 const active=useRef(true),pending=useRef<AbortController|null>(null);
 useEffect(()=>{active.current=true;return()=>{active.current=false;pending.current?.abort();};},[]);
 async function remove(){
  setBusy(true);setStatus('Removing private upload…');
  try{await call('circle/upload','DELETE',{path:value});if(active.current){onUploaded('');setStatus('Private upload removed.');}}
  catch{if(active.current)setStatus('Unable to remove the upload. Try again before leaving.');}
  finally{if(active.current)setBusy(false);}
 }
 return <div><p>Unsubmitted uploads stay private and become eligible for cleanup after 24 hours. Submitted photos are available to reviewers; publishing does not grant marketing reuse permission.</p><label>Photo (optional, maximum 5 MB)<input key={value||'empty'} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy||!!value} onChange={async event=>{
  const file=event.target.files?.[0];if(!file)return;
  const extension=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'} as Record<string,string>)[file.type];
  if(!extension||file.size>5242880){setStatus('Choose a JPEG, PNG or WebP image under 5 MB.');return;}
  const controller=new AbortController();pending.current=controller;setBusy(true);setStatus('Uploading privately…');
  let uploadedPath='';
  try{
   const signed=await call('circle/upload','POST',{extension},controller.signal);
   if(!active.current)return;
   uploadedPath=signed.path;
   const bucket=browserClient().storage.from('gb-circle');
   const {error}=signed.authenticated?await bucket.upload(signed.path,file,{contentType:file.type,upsert:false}):await bucket.uploadToSignedUrl(signed.path,signed.token,file,{contentType:file.type});
   if(error)throw error;
   if(active.current){onUploaded(signed.path);setStatus('Uploaded privately. Submit the review to attach it, or remove it before leaving.');}
  }catch{if(active.current){if(uploadedPath)onUploaded(uploadedPath);setStatus(uploadedPath?'Upload could not be confirmed. Remove this private upload before retrying.':'Upload failed. Check sign-in and storage setup.');}}
  finally{if(active.current)setBusy(false);}
 }}/></label>{value&&<button type="button" disabled={busy} onClick={()=>void remove()}>Remove unsubmitted photo</button>}<span role="status">{status}</span></div>;
}
