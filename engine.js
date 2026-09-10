(function(){
  'use strict';
  const JSI=window.JSI=window.JSI||{};
  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const p=(x,y)=>[clamp(x,-.15,1.15),clamp(y,-.15,1.15)];
  function path(points,stroke,width=1,alpha=1,fill=null,closed=false){return{type:'path',points,stroke,width,alpha,fill,closed}}
  function circle(x,y,r,fill,alpha=1,stroke=null,width=1){return{type:'circle',x,y,r,fill,alpha,stroke,width}}
  function polygon(points,fill,alpha=1,stroke=null,width=1){return{type:'polygon',points,fill,alpha,stroke,width}}
  function arc(cx,cy,r,a0,a1,stroke,width=1,alpha=1){return{type:'arc',cx,cy,r,a0,a1,stroke,width,alpha}}
  function colorIndex(rng){return rng.int(0,4)}
  function mirrorPrimitives(list){const extra=[];for(const q of list){if(q.type==='path'||q.type==='polygon')extra.push(Object.assign({},q,{points:q.points.map(([x,y])=>[1-x,y])}));else if(q.type==='circle')extra.push(Object.assign({},q,{x:1-q.x}));else if(q.type==='arc')extra.push(Object.assign({},q,{cx:1-q.cx,a0:Math.PI-q.a1,a1:Math.PI-q.a0}))}return list.concat(extra)}

  function flowGarden(rng,s,max){
    const out=[];const strands=Math.round(5+s.complexity/8);const steps=Math.round(12+s.detail/5);const motion=.015+s.motion/1700;const centerY=.5+rng.float(-.08,.08);
    for(let i=0;i<strands&&out.length<max;i++){
      let x=rng.float(.05,.18),y=centerY+rng.float(-.26,.26);let angle=rng.float(-.25,.25);const pts=[p(x,y)];
      const c=colorIndex(rng);
      for(let j=0;j<steps;j++){angle+=Math.sin(j*.55+i)*motion+rng.float(-motion,motion);x+=rng.float(.025,.048);y+=Math.sin(j*.35+i*.7)*motion+rng.float(-motion*.7,motion*.7);pts.push(p(x,y))}
      out.push(path(pts,c,1.2+rng.float(.2,1.5),.85));
      const leafCount=Math.round((s.density/100)*steps*.6);
      for(let k=1;k<=leafCount&&out.length<max;k++){
        const idx=Math.min(pts.length-2,Math.max(1,Math.floor(k*(pts.length-2)/(leafCount+1))));const [lx,ly]=pts[idx];const size=.012+rng.float(0,.018)*(s.detail/100);const side=rng.sign();
        out.push(polygon([p(lx,ly),p(lx+size*.9,ly+side*size*.45),p(lx+size*1.65,ly),p(lx+size*.8,ly-side*size*.35)],(c+1+rng.int(0,2))%5,.62));
      }
    }
    const dots=Math.round(8+s.density*.35);for(let i=0;i<dots&&out.length<max;i++)out.push(circle(rng.float(.08,.94),rng.float(.12,.88),rng.float(.002,.006),colorIndex(rng),rng.float(.35,.8)));
    return out;
  }

  function paperCut(rng,s,max){
    const out=[];const layers=Math.round(5+s.complexity/14);const points=Math.round(14+s.detail/5);const cx=.5+rng.float(-.05,.05),cy=.5+rng.float(-.05,.05);
    for(let l=0;l<layers&&out.length<max;l++){
      const rx=.44-l*.045,ry=.34-l*.035;const pts=[];const phase=rng.float(0,TAU);
      for(let i=0;i<points;i++){const a=i/points*TAU;const wobble=1+Math.sin(a*(2+rng.int(1,3))+phase)*(.03+s.motion/1500)+rng.float(-.025,.025);pts.push(p(cx+Math.cos(a)*rx*wobble,cy+Math.sin(a)*ry*wobble))}
      out.push(path(pts,(l+1)%5,1,.98,l%5,true));
    }
    const accents=Math.round(5+s.density/12);for(let i=0;i<accents&&out.length<max;i++){const r=rng.float(.015,.055);out.push(circle(rng.float(.18,.82),rng.float(.2,.8),r,(i+2)%5,.72))}
    return out;
  }

  function topographic(rng,s,max){
    const out=[];const lines=Math.round(9+s.complexity/4);const steps=Math.round(26+s.detail/2.8);const amp=.025+s.motion/1150;const waveCount=1.2+s.balance/35;
    for(let i=0;i<lines&&out.length<max;i++){
      const base=.12+i*(.76/Math.max(1,lines-1));const pts=[];const phase=rng.float(0,TAU);
      for(let j=0;j<steps;j++){const x=.04+j*(.92/(steps-1));const y=base+Math.sin(x*TAU*waveCount+phase)*amp+Math.sin(x*TAU*3.2+phase*.4)*amp*.3+rng.float(-.004,.004);pts.push(p(x,y))}
      out.push(path(pts,i%5,.55+(s.stroke/100)*.65,.68));
    }
    const markers=Math.round(s.density/12);for(let i=0;i<markers&&out.length<max;i++)out.push(circle(rng.float(.12,.88),rng.float(.14,.86),rng.float(.003,.008),colorIndex(rng),.7));
    return out;
  }

  function geoCollage(rng,s,max){
    const out=[];const count=Math.round(12+s.complexity*.5);for(let i=0;i<count&&out.length<max;i++){
      const x=rng.float(.08,.92),y=rng.float(.1,.9),size=rng.float(.025,.11)*(0.7+s.density/160),c=colorIndex(rng),kind=rng.int(0,3);
      if(kind===0)out.push(circle(x,y,size,c,rng.float(.28,.84),rng.bool(.3)?(c+2)%5:null,.7));
      else if(kind===1){const a=rng.float(0,TAU);out.push(polygon([p(x+Math.cos(a)*size,y+Math.sin(a)*size),p(x+Math.cos(a+2.1)*size,y+Math.sin(a+2.1)*size),p(x+Math.cos(a+4.2)*size,y+Math.sin(a+4.2)*size)],c,rng.float(.35,.9)))}
      else if(kind===2){const w=size*1.7,h=size*rng.float(.45,1.3);out.push(polygon([p(x-w,y-h),p(x+w,y-h*.7),p(x+w*.8,y+h),p(x-w*.8,y+h*.6)],c,rng.float(.28,.78)))}
      else{const pts=[p(x-size*1.5,y+rng.float(-size,size)),p(x+size*1.5,y+rng.float(-size,size))];out.push(path(pts,c,rng.float(.8,2.2),.75))}
    }
    return out;
  }

  function botanical(rng,s,max){
    const out=[];const stems=Math.round(4+s.complexity/17);const segs=Math.round(7+s.detail/9);for(let i=0;i<stems&&out.length<max;i++){
      let x=.15+i*(.7/Math.max(1,stems-1))+rng.float(-.035,.035),y=.88;let angle=-Math.PI/2+rng.float(-.18,.18);const stemPts=[p(x,y)];const col=i%5;
      for(let j=0;j<segs;j++){angle+=rng.float(-.10,.10)*(s.motion/60);x+=Math.cos(angle)*rng.float(.025,.05);y+=Math.sin(angle)*rng.float(.04,.075);stemPts.push(p(x,y));if(j>1&&rng.bool(.4+s.density/220)&&out.length+2<max){const side=rng.sign(),len=rng.float(.035,.07);const la=angle+side*rng.float(.55,.95);const tip=p(x+Math.cos(la)*len,y+Math.sin(la)*len);out.push(path([p(x,y),tip],(col+1)%5,.75,.72));const [tx,ty]=tip;const sz=.014+rng.float(0,.018);out.push(polygon([p(tx,ty),p(tx+Math.cos(la+.9)*sz,ty+Math.sin(la+.9)*sz),p(tx+Math.cos(la)*sz*1.8,ty+Math.sin(la)*sz*1.8),p(tx+Math.cos(la-.9)*sz,ty+Math.sin(la-.9)*sz)],(col+2)%5,.72))}}
      out.push(path(stemPts,col,1.1,.9));
    }return out;
  }

  function orbitField(rng,s,max){
    const out=[];const centers=Math.round(3+s.complexity/20);for(let c=0;c<centers;c++){
      const cx=rng.float(.22,.78),cy=rng.float(.22,.78);const rings=Math.round(2+s.density/28);for(let r=0;r<rings&&out.length<max;r++){const rad=rng.float(.035,.12)*(1+r*.45);const start=rng.float(0,TAU),span=rng.float(1.8,5.5);out.push(arc(cx,cy,rad,start,start+span,(c+r)%5,rng.float(.7,1.8),rng.float(.35,.85)));const dots=Math.round(2+s.detail/25);for(let d=0;d<dots&&out.length<max;d++){const a=start+span*(d+1)/(dots+1)+rng.float(-.12,.12);out.push(circle(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,rng.float(.003,.009),(c+r+d+1)%5,.9))}}
    }
    const connectors=Math.round(s.motion/14);for(let i=0;i<connectors&&out.length<max;i++)out.push(path([p(rng.float(.1,.9),rng.float(.1,.9)),p(rng.float(.1,.9),rng.float(.1,.9))],colorIndex(rng),.55,.25));
    return out;
  }

  const MAKERS={'flow-garden':flowGarden,'paper-cut':paperCut,'topographic':topographic,'geo-collage':geoCollage,'botanical':botanical,'orbit-field':orbitField};
  const TITLES_A=['Quiet','Moving','Soft','Parallel','Wild','Open','Drifting','Folded','Balanced','Hidden','Wandering','Measured'];
  const TITLES_B=['Garden','Current','Terrain','Forms','Orbit','Fragments','Field','Study','Bloom','Rhythm','Atlas','Layers'];
  function generate(seed,raw){const s=JSI.presets.sanitize(raw);const clean=JSI.random.normalize(seed);const rng=JSI.random.create(clean+'|'+s.style+'|'+s.complexity+'|'+s.density+'|'+s.motion+'|'+s.balance+'|'+s.detail);const max=JSI.presets.QUALITY[s.quality].max;let primitives=(MAKERS[s.style]||flowGarden)(rng,s,max);if(s.mirror)primitives=mirrorPrimitives(primitives).slice(0,max*2);const tr=JSI.random.create(clean+'|title');const palette=JSI.presets.PALETTES[s.palette];return{version:3,seed:clean,title:tr.pick(TITLES_A)+' '+tr.pick(TITLES_B),settings:Object.assign({},s),background:palette.bg,primitives,stats:{primitives:primitives.length,style:s.style,palette:s.palette}}}
  JSI.engine={generate};
}());
