(function(){
  'use strict';
  const JSI=window.JSI=window.JSI||{};
  function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}
  function slug(art){return `js-illustration-${art.seed}-${art.settings.style}`}
  function canvasBlob(canvas,type,quality){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Unable to encode image.')),type,quality))}
  function strBytes(s){return new TextEncoder().encode(s)}
  function concat(parts){let len=0;for(const p of parts)len+=p.length;const out=new Uint8Array(len);let o=0;for(const p of parts){out.set(p,o);o+=p.length}return out}
  function jpgBytesFromCanvas(canvas){const data=canvas.toDataURL('image/jpeg',.94).split(',')[1];const raw=atob(data),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out}
  function makePdfFromJpeg(jpg,w,h){
    const pageW=842,pageH=595;const scale=Math.min(pageW/w,pageH/h);const dw=w*scale,dh=h*scale,dx=(pageW-dw)/2,dy=(pageH-dh)/2;
    const content=`q\n${dw.toFixed(2)} 0 0 ${dh.toFixed(2)} ${dx.toFixed(2)} ${dy.toFixed(2)} cm\n/Im0 Do\nQ\n`;
    const objs=[];
    objs[1]=strBytes('<< /Type /Catalog /Pages 2 0 R >>');
    objs[2]=strBytes('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    objs[3]=strBytes(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`);
    objs[4]=strBytes(`<< /Length ${content.length} >>\nstream\n${content}endstream`);
    objs[5]=concat([strBytes(`<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`),jpg,strBytes('\nendstream')]);
    const header=strBytes('%PDF-1.4\n%âãÏÓ\n');const parts=[header];const offsets=[0];let offset=header.length;
    for(let i=1;i<=5;i++){offsets[i]=offset;const pre=strBytes(`${i} 0 obj\n`),post=strBytes('\nendobj\n');parts.push(pre,objs[i],post);offset+=pre.length+objs[i].length+post.length}
    const xrefOffset=offset;let xref=`xref\n0 6\n0000000000 65535 f \n`;for(let i=1;i<=5;i++)xref+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';xref+=`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    parts.push(strBytes(xref));return new Blob([concat(parts)],{type:'application/pdf'});
  }
  async function exportArt(art,format,longEdge){const size=Math.max(800,Math.min(5000,Number(longEdge)||2400));if(format==='svg'){download(new Blob([JSI.renderer.toSVG(art,size)],{type:'image/svg+xml'}),slug(art)+'.svg');return}
    const canvas=JSI.renderer.offscreen(art,size);
    if(format==='png'){download(await canvasBlob(canvas,'image/png'),slug(art)+'.png');return}
    if(format==='jpg'){download(await canvasBlob(canvas,'image/jpeg',.94),slug(art)+'.jpg');return}
    if(format==='pdf'){const jpg=jpgBytesFromCanvas(canvas);download(makePdfFromJpeg(jpg,canvas.width,canvas.height),slug(art)+'.pdf')}
  }
  JSI.exporter={exportArt};
}());
