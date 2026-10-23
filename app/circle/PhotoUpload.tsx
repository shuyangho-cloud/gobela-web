'use client';
import { useState } from 'react';
import { browserClient,call } from '../../lib/superbrain/browser';
export default function PhotoUpload({onUploaded}:{onUploaded:(path:string)=>void}) {
  const [status,setStatus]=useState('');
  return <label>Photo (optional, maximum 5 MB)<input type="file" accept="image/jpeg,image/png,image/webp" onChange={async event=>{
    const file=event.target.files?.[0];if(!file)return;
    const extension=({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'} as Record<string,string>)[file.type];
    if(!extension || file.size>5242880){setStatus('Choose a JPEG, PNG or WebP image under 5 MB.');return;}
    setStatus('Uploading…');
    try {
      const signed=await call('circle/upload','POST',{extension});
      const {error}=await browserClient().storage.from('gb-circle').uploadToSignedUrl(signed.path,signed.token,file,{contentType:file.type});
      if(error)throw error;onUploaded(signed.path);setStatus('Uploaded. Submit your review to attach this image.');
    }catch{setStatus('Upload failed. Check sign-in and storage setup.');}
  }}/><span role="status">{status}</span></label>;
}
