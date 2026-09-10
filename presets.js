(function(){
  'use strict';
  const JSI=window.JSI=window.JSI||{};
  const PALETTES={
    meadow:{label:'Meadow',bg:'#eef1e8',colors:['#183b36','#4f8b76','#d4a95a','#d7644e','#2d5a54']},
    editorial:{label:'Editorial',bg:'#f4efe7',colors:['#12151a','#d85b42','#e0b247','#7b97bb','#8c6c9b']},
    ocean:{label:'Ocean',bg:'#eaf3f1',colors:['#0b3c49','#177e89','#5ab1bb','#f2cf73','#d26a5c']},
    dusk:{label:'Dusk',bg:'#171421',colors:['#f4c8ff','#9d8cff','#5fe0d0','#ffc968','#ff7f7f']},
    mono:{label:'Ink',bg:'#f5f3ee',colors:['#111318','#2c3038','#626874','#a6abb2','#d4d7da']},
    citrus:{label:'Citrus',bg:'#fff6dc',colors:['#213547','#f35b37','#ffa51f','#ffd447','#6ecb63']},
    clay:{label:'Clay',bg:'#f0e7dc',colors:['#5b2b2b','#9a4f3d','#d38963','#385b52','#c0a36e']},
    night:{label:'Night Signal',bg:'#0c1220',colors:['#6df2cf','#7ea8ff','#ff8bc7','#ffd26e','#cba6ff']}
  };
  const DEFAULTS={style:'flow-garden',palette:'editorial',seed:'',complexity:56,density:54,motion:58,balance:45,stroke:100,detail:55,mirror:false,ratio:'4:3',quality:'balanced'};
  const QUALITY={eco:{dpr:1,max:260},balanced:{dpr:1.5,max:420},high:{dpr:2,max:650}};
  function sanitize(s){const o=Object.assign({},DEFAULTS,s||{});const clamp=(v,a,b,d)=>Number.isFinite(+v)?Math.min(b,Math.max(a,+v)):d;o.complexity=clamp(o.complexity,10,100,56);o.density=clamp(o.density,10,100,54);o.motion=clamp(o.motion,0,100,58);o.balance=clamp(o.balance,0,100,45);o.stroke=clamp(o.stroke,50,180,100);o.detail=clamp(o.detail,0,100,55);o.mirror=!!o.mirror;if(!PALETTES[o.palette])o.palette='editorial';if(!QUALITY[o.quality])o.quality='balanced';if(!['4:3','1:1','16:9','4:5'].includes(o.ratio))o.ratio='4:3';return o}
  JSI.presets={PALETTES,DEFAULTS,QUALITY,sanitize};
}());
