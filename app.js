const $=id=>document.getElementById(id);
const M=GuadouMath;
const lessons=[
 {given:'A 固定，P 在线段 BC 上运动，Q 始终是 AP 的中点。',steps:[
  ['看条件，猜轨迹','P 改变位置时，Q 会沿着怎样的路线运动？',''],
  ['先找一个对应点','连接 AB，取中点 B′。当 P 到达 B 时，Q 就到达 B′。','AB′ = B′B'],
  ['连接中点，构造中位线','连接 B′Q，观察 △ABP 中的两个中点。','B′Q ∥ BP\nB′Q = BP / 2'],
  ['再找另一个端点','连接 AC，取中点 C′。当 P 到达 C 时，Q 就到达 C′。','AC′ = C′C'],
  ['让 P 动起来','点击播放，或拖动滑块，观察 Q 留下的轨迹。',''],
  ['得到轨迹','Q 从 B′走到 C′，走出一条与 BC 平行的线段。','B′C′ ∥ BC\nB′C′ = BC / 2']
 ]},
 {given:'A 固定，P 在线段 BC 上运动。AP 绕 A 逆时针转 90°，得到 AQ。',steps:[
  ['看条件，猜轨迹','旋转角度不变，AP 与 AQ 等长。Q 会走出什么图形？',''],
  ['把一个端点同向旋转','连接 AB，再把 AB 绕 A 逆时针转 90°，得到 AB′。','AB = AB′'],
  ['连接对应点，构造手拉手','连接 B′Q，与 BP 对照，找出两组三角形的对应边、对应角。','△ABP ≌ △AB′Q\nBP = B′Q'],
  ['把另一个端点同向旋转','把 AC 绕 A 逆时针转 90°，得到 AC′。','AC = AC′'],
  ['让 P 动起来','保持同一旋转方向，观察 P、Q 同时移动。',''],
  ['得到轨迹','Q 的轨迹是 BC 旋转后的线段，两条轨迹互相垂直。','B′C′ = BC\nBC ⟂ B′C′']
 ]},
 {given:'A 固定，P 在半径为 r 的圆 O 上运动，Q 始终是 AP 的中点。',steps:[
  ['看条件，猜轨迹','P 沿圆运动，Q 跟着变化。先猜它会围着哪个点转。',''],
  ['连接圆心，取中点','连接 AO，取 AO 的中点 M。A、O 都固定，所以 M 也固定。','AM = MO'],
  ['连接半径，构造中位线','连接 OP、MQ。在 △AOP 中，M、Q 都是中点。','MQ = OP / 2'],
  ['找出不变的距离','OP 是原圆的半径。Q 到定点 M 的距离始终不变。','MQ = r / 2'],
  ['让 P 动起来','观察 Q 的轨迹，同时关注 MQ 的长度。',''],
  ['得到轨迹','Q 绕着 M 走出一个圆，半径是原来的一半。','圆心：AO 的中点 M\n半径：r / 2']
 ]},
 {given:'A 固定，P 在半径为 r 的圆 O 上运动。AP 绕 A 逆时针转 90°，得到 AQ。',steps:[
  ['看条件，猜轨迹','P 沿圆运动，AP 与 AQ 始终等长。Q 会走出怎样的圆？',''],
  ['把圆心同向旋转','连接 AO，把 AO 绕 A 逆时针转 90°，得到 AM。','AO = AM'],
  ['连接半径，构造手拉手','连接 OP、MQ，比较 △AOP 与 △AMQ。','△AOP ≌ △AMQ'],
  ['找出不变的距离','全等三角形的对应边相等，MQ 等于原圆的半径。','MQ = OP = r'],
  ['让 P 动起来','观察 Q 围着哪个定点运动，半径有没有改变。',''],
  ['得到轨迹','圆心 O 转到 M，圆的半径保持不变。','圆心：O 的旋转像 M\n半径：r']
 ]},
 {given:'A 固定，P 在圆 O 上运动。AP 逆时针转 60°，再缩为一半，得到 AQ。',steps:[
  ['看条件，猜轨迹','角度保持 60°，AQ 始终是 AP 的一半。Q 会走出什么轨迹？',''],
  ['圆心做同样的变换','把 AO 绕 A 逆时针转 60°，再缩为一半，得到 AM。','AM = AO / 2'],
  ['连接半径，构造手拉手','连接 OP、MQ。对应边成比例，夹角相等，两个三角形相似。','△AOP ∽ △AMQ'],
  ['找出不变的距离','对应边的比相同，MQ 也是 OP 的一半。','MQ = OP / 2 = r / 2'],
  ['让 P 动起来','观察新圆心 M 和从动点 Q 的轨迹。',''],
  ['得到轨迹','圆心做同样的旋转缩放，半径也按相同比例变化。','本图：圆心 M，半径 r / 2\n一般地：半径为 k · r']
 ]}
];
let index=0,step=0,t=.36,playing=false,lastTime=0,frame=0;
const svgNS='http://www.w3.org/2000/svg';
function element(name,attrs={},text){const el=document.createElementNS(svgNS,name);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el;}
function render(animate=false){
 const g=M.geometry(index,t),scene=$('scene');scene.replaceChildren();
 // Use the same frame at every step, so the construction stays in place.
 const bounds=g.kind==='line'?[g.a,g.b,g.c,g.bq,g.cq]:[g.a,[g.o[0]-g.r,g.o[1]-g.r],[g.o[0]+g.r,g.o[1]+g.r],[g.m[0]-g.rq,g.m[1]-g.rq],[g.m[0]+g.rq,g.m[1]+g.rq]];
 const xs=bounds.map(p=>p[0]),ys=bounds.map(p=>p[1]);const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const s=Math.min(530/(maxX-minX||1),310/(maxY-minY||1)),cx=(minX+maxX)/2,cy=(minY+maxY)/2;
 const xy=p=>[330+(p[0]-cx)*s,218-(p[1]-cy)*s];
 const colors={blue:'#137daf',orange:'#ce552f',green:'#27714d',ink:'#233b31'};
 let group=scene;
 function layer(n){group=element('g',{'data-layer':n,class:animate&&n===step?'new-step':''});scene.append(group);}
 function line(a,b,color,cls='moving'){const [x1,y1]=xy(a),[x2,y2]=xy(b);group.append(element('line',{x1,y1,x2,y2,stroke:colors[color],class:cls}));}
 function circle(p,r,color,cls){const [cx,cy]=xy(p);group.append(element('circle',{cx,cy,r:r*s,stroke:colors[color],class:'track '+cls}));}
 function label(p,text,color,dx=12,dy=-13,cls='point-label'){const [x,y]=xy(p);group.append(element('text',{x:x+dx,y:y+dy,fill:colors[color],class:cls},text));}
 function point(p,text,color,dx=12,dy=-13){const [cx,cy]=xy(p);group.append(element('circle',{cx,cy,r:5.5,fill:colors[color],class:'point','data-point':text}));label(p,text,color,dx,dy);}
 function path(points,color,cls='trace'){group.append(element('path',{d:points.map((p,i)=>`${i?'L':'M'}${xy(p).join(',')}`).join(' '),stroke:colors[color],class:cls}));}
 function triangle(points,color){group.append(element('polygon',{points:points.map(xy).map(p=>p.join(',')).join(' '),fill:colors[color],opacity:.065}));}
 function midpointMarks(a,b,color){const [x1,y1]=xy(a),[x2,y2]=xy(b),dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);if(len<1)return;for(const r of [.25,.75]){const x=x1+dx*r,y=y1+dy*r;group.append(element('line',{x1:x-dy/len*6,y1:y+dx/len*6,x2:x+dy/len*6,y2:y-dx/len*6,stroke:colors[color],class:'mark'}));}}
 const atStart=g.kind==='line'&&t<.001,atEnd=g.kind==='line'&&t>.999;
 layer(0);
 if(g.kind==='line')line(g.b,g.c,'blue','track original-track');else circle(g.o,g.r,'blue','original-track');
 if(step>=1){
  layer(1);
  if(g.kind==='line'){
   line(g.a,g.b,'green','helper');
   if(index===0)midpointMarks(g.a,g.b,'green');else line(g.a,g.bq,'green','helper');
   if(!atStart)point(g.bq,'B′','green',-30,-14);
  }else{
   line(g.a,g.o,'green','helper');
   if(index===2)midpointMarks(g.a,g.o,'green');else line(g.a,g.m,'green','helper');
   point(g.m,'M','green',-25,27);
  }
 }
 if(step>=2){
  layer(2);
  if(g.kind==='line'){
   triangle([g.a,g.b,g.p],'blue');triangle([g.a,g.bq,g.q],'green');line(g.bq,g.q,'green','helper');
  }else{
   triangle([g.a,g.o,g.p],'blue');triangle([g.a,g.m,g.q],'green');line(g.o,g.p,'blue');line(g.m,g.q,'green');
  }
 }
 if(step>=3){
  layer(3);
  if(g.kind==='line'){
   line(g.a,g.c,'green','helper');
   if(index===0)midpointMarks(g.a,g.c,'green');else line(g.a,g.cq,'green','helper');
   if(!atEnd)point(g.cq,'C′','green',12,-14);
  }else{
   line(g.m,g.q,'orange');
  }
 }
 if(step>=4){
  layer(4);
  if(t>0){const count=Math.max(2,Math.ceil(t*150)+1),positions=Array.from({length:count},(_,i)=>M.geometry(index,t*i/(count-1)));path(positions.map(p=>p.q),'orange','trace follower-trace');}
 }
 if(step===5){
  layer(5);
  if(g.kind==='line')line(g.bq,g.cq,'orange','track final-track');else circle(g.m,g.rq,'orange','final-track');
 }
 // Given points and connecting segments stay visible above each new construction.
 layer(0);line(g.a,g.p,'blue');line(g.a,g.q,'orange');
 if(index===0||index===2)midpointMarks(g.a,g.p,'orange');
 if(g.angle>0){const angle=Math.atan2(g.p[1]-g.a[1],g.p[0]-g.a[0]),rad=Math.min(.48,M.distance(g.a,g.p)*.25);const arc=Array.from({length:25},(_,i)=>M.add(g.a,[rad*Math.cos(angle+g.angle*i/24),rad*Math.sin(angle+g.angle*i/24)]));path(arc,'green','moving');label(M.add(g.a,[rad*1.9*Math.cos(angle+g.angle/2),rad*1.9*Math.sin(angle+g.angle/2)]),`${Math.round(g.angle*180/Math.PI)}°`,'green',0,0,'small-label');}
 if(g.kind==='line'){if(!atStart)point(g.b,'B','blue',-23,27);if(!atEnd)point(g.c,'C','blue',12,27);}else point(g.o,'O','blue',12,27);
 point(g.a,'A','ink',-25,-15);
 point(g.p,atStart?'P = B':atEnd?'P = C':'P','blue',12,atStart?-15:27);
 point(g.q,atStart&&step>=1?'Q = B′':atEnd&&step>=3?'Q = C′':'Q','orange',12,atEnd?-35:-14);
 $('progress').value=Math.round(t*1000);
 $('diagram-desc').textContent=`${$('tab-'+index).textContent}，第 ${step+1} 步：${lessons[index].steps[step][0]}。${lessons[index].steps[step][1]}`;
}
function stop(){playing=false;cancelAnimationFrame(frame);$('play').textContent='播放描迹';$('play').setAttribute('aria-pressed','false');}
function tick(now){if(!playing)return;const dt=lastTime?Math.min((now-lastTime)/1000,.1):0;lastTime=now;t=Math.min(1,t+dt/10);render();if(t>=1){stop();return;}frame=requestAnimationFrame(tick);}
function start(){if(t>=1)t=0;playing=true;lastTime=0;$('play').textContent='暂停';$('play').setAttribute('aria-pressed','true');frame=requestAnimationFrame(tick);}
function updateStep(n){
 const old=step;stop();step=n;
 if(step===4&&old!==4)t=0;else if(step<4)t=.36;else if(step===5)t=.36;
 const [title,text,formula]=lessons[index].steps[step];
 $('step-count').textContent=`第 ${step+1} / 6 步`;$('step-title').textContent=title;$('step-text').textContent=text;$('step-formula').textContent=formula;$('step-formula').hidden=!formula;
 $('motion').hidden=step<4;$('helper-legend').hidden=step===0;$('previous').disabled=step===0;$('next').disabled=step===5;$('next').textContent=step===5?'已完成':'下一步';
 $('step-dots').replaceChildren(...Array.from({length:6},(_,i)=>{const dot=document.createElement('span');dot.className=i===step?'current':i<step?'done':'';return dot;}));
 const active=step===0?[0,1]:step>=4?[0]:(index===0||index===2)?[2]:[3];
 document.querySelectorAll('[data-verse]').forEach((el,i)=>el.classList.toggle('active',active.includes(i)));
 render(n>old);
}
function selectModel(n){
 stop();index=n;step=0;t=.36;
 document.querySelectorAll('[role=tab]').forEach((tab,i)=>{tab.setAttribute('aria-selected',i===n);tab.tabIndex=i===n?0:-1;});
 $('model-panel').setAttribute('aria-labelledby',`tab-${n}`);$('given').textContent=lessons[n].given;updateStep(0);
}
$('previous').addEventListener('click',()=>{if(step>0)updateStep(step-1);});
$('next').addEventListener('click',()=>{if(step<5)updateStep(step+1);});
$('restart').addEventListener('click',()=>updateStep(0));
$('progress').addEventListener('input',e=>{stop();t=Number(e.target.value)/1000;render();});
$('play').addEventListener('click',()=>playing?stop():start());
$('replay').addEventListener('click',()=>{stop();t=0;render();start();});
const tabs=[...document.querySelectorAll('[role=tab]')];
for(const [i,tab]of tabs.entries()){
 tab.addEventListener('click',()=>selectModel(i));
 tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%5;else if(e.key==='ArrowLeft')n=(i+4)%5;else if(e.key==='Home')n=0;else if(e.key==='End')n=4;else return;e.preventDefault();selectModel(n);tabs[n].focus();});
}
// Left/right keys advance the board; focused sliders and model tabs retain their own keys.
 document.addEventListener('keydown',e=>{if(e.target.closest('input,[role=tab],button'))return;if(e.key==='ArrowRight'&&step<5){e.preventDefault();updateStep(step+1);}else if(e.key==='ArrowLeft'&&step>0){e.preventDefault();updateStep(step-1);}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
selectModel(0);
