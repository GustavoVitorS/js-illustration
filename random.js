(function(){
  'use strict';
  const JSI=window.JSI=window.JSI||{};
  function hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  function create(seed){const r=mulberry32(hash(String(seed)));return{raw:r,float:(a=0,b=1)=>a+(b-a)*r(),int:(a,b)=>Math.floor(a+r()*(b-a+1)),pick:a=>a[Math.floor(r()*a.length)],bool:(p=.5)=>r()<p,sign:()=>r()<.5?-1:1}}
  function makeSeed(){const a=new Uint32Array(2);if(window.crypto&&crypto.getRandomValues)crypto.getRandomValues(a);else{a[0]=(Date.now()>>>0);a[1]=Math.floor(Math.random()*0xffffffff)}return (a[0]^a[1]).toString(16).toUpperCase().padStart(8,'0').slice(0,8)}
  function normalize(seed){const s=String(seed||'').trim().replace(/[^a-z0-9_-]/gi,'').slice(0,24);return s||makeSeed()}
  JSI.random={create,makeSeed,normalize,hash};
}());
