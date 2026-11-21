/* All angles below are directed counterclockwise angles in mathematical coordinates. */
globalThis.GuadouMath = (() => {
  const add = (a,b) => [a[0]+b[0],a[1]+b[1]];
  const sub = (a,b) => [a[0]-b[0],a[1]-b[1]];
  const mul = (p,k) => [p[0]*k,p[1]*k];
  const distance = (a,b) => Math.hypot(...sub(a,b));
  const transform = (p,a,angle,k) => {
    const [x,y]=sub(p,a), c=Math.cos(angle),s=Math.sin(angle);
    return add(a,[k*(c*x-s*y),k*(s*x+c*y)]);
  };
  const configs = [
    {kind:'line',a:[0,3],b:[-3,-2],c:[5,-2],angle:0,k:.5},
    {kind:'line',a:[0,0],b:[-3,-2],c:[4,-2],angle:Math.PI/2,k:1},
    {kind:'circle',a:[-4,0],o:[2,0],r:2,angle:0,k:.5},
    {kind:'circle',a:[0,0],o:[3,0],r:1.5,angle:Math.PI/2,k:1},
    {kind:'circle',a:[-3,-1],o:[2,-1],r:1.6,angle:Math.PI/3,k:.5}
  ];
  function geometry(index,t,scale=.5){
    const g={...configs[index]};
    if(index===4)g.k=scale;
    g.p=g.kind==='line'?add(g.b,mul(sub(g.c,g.b),t)):add(g.o,[g.r*Math.cos(2*Math.PI*t),g.r*Math.sin(2*Math.PI*t)]);
    g.q=transform(g.p,g.a,g.angle,g.k);
    if(g.kind==='line'){g.bq=transform(g.b,g.a,g.angle,g.k);g.cq=transform(g.c,g.a,g.angle,g.k);}
    else {g.m=transform(g.o,g.a,g.angle,g.k);g.rq=g.k*g.r;}
    return g;
  }
  return {add,sub,mul,distance,transform,geometry};
})();
