import {it,expect,vi,afterEach} from 'vitest';
import {createHash} from 'node:crypto';
const fixture=vi.hoisted(()=>({data:Buffer.alloc(5*1024*1024,7)}));
vi.mock('node:fs/promises',()=>({readFile:vi.fn(async()=>fixture.data),stat:vi.fn(async()=>({size:fixture.data.length}))}));
vi.mock('../../lib/superbrain/marketing-assets.json',async()=>{const {createHash}=await import('node:crypto');return {default:[{id:'video',filename:'video.mp4',mime:'video/mp4',bytes:fixture.data.length,sha256:createHash('sha256').update(fixture.data).digest('hex')}]};});
import {marketingAssetResponse,assetInventory} from '../../lib/superbrain/marketing-assets';
import {downloadPrivateReference} from '../../lib/superbrain/asset-download';
const oldStorage=process.env.SUPERBRAIN_ASSET_STORAGE;
const oldRoot=process.env.SUPERBRAIN_MARKETING_ASSET_ROOT;const oldBundled=process.env.SUPERBRAIN_BUNDLED_ASSETS;
afterEach(()=>{if(oldStorage===undefined)delete process.env.SUPERBRAIN_ASSET_STORAGE;else process.env.SUPERBRAIN_ASSET_STORAGE=oldStorage;if(oldRoot===undefined)delete process.env.SUPERBRAIN_MARKETING_ASSET_ROOT;else process.env.SUPERBRAIN_MARKETING_ASSET_ROOT=oldRoot;if(oldBundled===undefined)delete process.env.SUPERBRAIN_BUNDLED_ASSETS;else process.env.SUPERBRAIN_BUNDLED_ASSETS=oldBundled;fixture.data=Buffer.alloc(5*1024*1024,7);});
it('serves private media in bounded hash-checked ranges and rejects malformed or oversized whole-file delivery',async()=>{
 process.env.SUPERBRAIN_MARKETING_ASSET_ROOT='/private-fixture';
 const response=await marketingAssetResponse('video','bytes=0-');expect(response.status).toBe(206);expect(response.headers.get('Content-Range')).toBe('bytes 0-1048575/5242880');expect(response.headers.get('Cache-Control')).toBe('private, no-store');expect((await response.arrayBuffer()).byteLength).toBe(1024*1024);
 for(const range of ['bytes=-10','bytes=9999999-','bytes=3-1','bytes=0-1,4-5'])expect((await marketingAssetResponse('video',range)).status).toBe(416);
 expect((await marketingAssetResponse('video')).status).toBe(416);
 fixture.data[0]=8;expect((await assetInventory())[0].available).toBe(false);await expect(marketingAssetResponse('video','bytes=0-10')).rejects.toThrow('changed');
});
it('can use the explicitly enabled server-only deployment bundle and reassemble authenticated chunks',async()=>{
 delete process.env.SUPERBRAIN_MARKETING_ASSET_ROOT;process.env.SUPERBRAIN_BUNDLED_ASSETS='true';
 const transport=vi.fn(async(_url:any,options:any)=>{expect(options.headers.Authorization).toBe('Bearer local-fixture');expect(options.cache).toBe('no-store');return marketingAssetResponse('video',options.headers.Range);});
 const blob=await downloadPrivateReference({id:'video',bytes:fixture.data.length,mime:'video/mp4'},'local-fixture',new AbortController().signal,transport as any);
 expect(transport).toHaveBeenCalledTimes(5);expect(blob.size).toBe(fixture.data.length);expect(createHash('sha256').update(Buffer.from(await blob.arrayBuffer())).digest('hex')).toBe(createHash('sha256').update(fixture.data).digest('hex'));
});
it('rejects incomplete or unexpected range responses instead of showing corrupt reference footage',async()=>{
 const response=()=>Promise.resolve(new Response(new Uint8Array([1]),{status:206,headers:{'Content-Range':'bytes 0-1/2'}}));
 await expect(downloadPrivateReference({id:'video',bytes:2,mime:'video/mp4'},'local-fixture',new AbortController().signal,response as any)).rejects.toThrow('Incomplete');
});

it('loads hash-checked private Storage references without local deployment files and fails closed on corruption',async()=>{
 process.env.SUPERBRAIN_ASSET_STORAGE='private-supabase';
 await expect(marketingAssetResponse('video','bytes=0-10')).rejects.toThrow('Authenticated');
 const download=vi.fn(async()=>({data:new Blob([fixture.data]),error:null}));const db={storage:{from:(bucket:string)=>{expect(bucket).toBe('gb-marketing-references');return {download};}}} as any;
 const response=await marketingAssetResponse('video','bytes=0-10',db);expect(response.status).toBe(206);expect(download).toHaveBeenCalledOnce();
 const now=Date.now;try{Date.now=()=>now()+400000;fixture.data[0]=8;await expect(marketingAssetResponse('video','bytes=0-10',db)).rejects.toThrow('changed');}finally{Date.now=now;}
});
