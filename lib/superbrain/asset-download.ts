// Fetch bounded authenticated pieces so private video previews fit serverless response limits.
export async function downloadPrivateReference(asset:{id:string;bytes:number;mime:string},token:string,signal:AbortSignal,transport:typeof fetch=fetch,resource:'marketing-assets'|'publishing-media'='marketing-assets'){
 if(!Number.isSafeInteger(asset.bytes)||asset.bytes<1||asset.bytes>12*1024*1024)throw Error('Invalid reference size');
 const chunks:ArrayBuffer[]=[];const size=1024*1024;
 for(let start=0;start<asset.bytes;start+=size){
  const end=Math.min(asset.bytes-1,start+size-1);
  const response=await transport(`/api/superbrain/founder/${resource}/${encodeURIComponent(asset.id)}`,{headers:{Authorization:`Bearer ${token}`,Range:`bytes=${start}-${end}`},cache:'no-store',signal});
  if(response.status!==206||response.headers.get('Content-Range')!==`bytes ${start}-${end}/${asset.bytes}`)throw Error('Reference unavailable or changed; review required.');
  const bytes=await response.arrayBuffer();if(bytes.byteLength!==end-start+1)throw Error('Incomplete private reference');chunks.push(bytes);
 }
 return new Blob(chunks,{type:asset.mime});
}
