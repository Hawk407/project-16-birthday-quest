const KEY='project16-yashitae-v3';
if(new URLSearchParams(location.search).get('reset')==='1')localStorage.removeItem(KEY);
const PREVIEW=new URLSearchParams(location.search).get('preview')==='1';
const chapters={court:{title:'The Enchanted Court',icon:'🏀',time:'8:30 AM',hour:8,min:30},ocean:{title:'The Sunken Kingdom',icon:'🐚',time:'11:30 AM',hour:11,min:30},archives:{title:'The Lost Archives',icon:'📜',time:'2:30 PM',hour:14,min:30},carnival:{title:'The Carnival of Curiosities',icon:'🎪',time:'3:30 PM',hour:15,min:30},vault:{title:'The Birthday Vault',icon:'🏰',time:'8:00 PM',hour:20,min:0}};
const ids=Object.keys(chapters);let done=load(),active=null,gameState={},raf=null;
function load(){try{return JSON.parse(localStorage.getItem(KEY))||[]}catch(e){return []}}
function save(){localStorage.setItem(KEY,JSON.stringify(done))}
function nowIndia(){let p=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),v=k=>+p.find(x=>x.type===k).value;return{y:v('year'),m:v('month'),d:v('day'),h:v('hour'),min:v('minute')}}
function birthday(){let n=nowIndia();return n.y===2026&&n.m===11&&n.d===16}
function timeOpen(id){if(PREVIEW)return true;if(!birthday())return false;let n=nowIndia(),c=chapters[id];return n.h*60+n.min>=c.hour*60+c.min}
function openable(id){return timeOpen(id)&&(id!=='vault'||ids.slice(0,4).every(x=>done.includes(x)))}
function update(){document.getElementById('progressText').textContent=done.length+' / 5 treasures';document.getElementById('progressFill').style.width=done.length/5*100+'%';ids.forEach(id=>{let b=document.querySelector(`[data-id="${id}"]`),s=document.getElementById('status-'+id),t=document.getElementById('token-'+id),d=done.includes(id),r=openable(id);b.className='realm '+(d?'done':r?'ready':'locked');s.textContent=d?'Treasure collected ✓':r?'Ready to explore':id==='vault'&&timeOpen(id)?'Find the four fragments':'Waiting to open';t.classList.toggle('found',d)})}
function sayToast(t){let e=document.getElementById('toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2100)}
function modal(id){stopGame();active=id;gameState={};let c=chapters[id],a=document.getElementById('gameArea');document.getElementById('modalKicker').textContent='PROJECT 16 · '+id.toUpperCase();document.getElementById('modalEmoji').textContent=c.icon;document.getElementById('modalTitle').textContent=c.title;document.getElementById('modalSub').textContent='OPENS '+c.time+' IST';document.getElementById('feedback').textContent='';document.getElementById('continue').hidden=true;a.innerHTML='';if(!birthday()&&!PREVIEW)a.innerHTML='<p class="game-copy">The map is sealed until 16 November 2026. Come back on your birthday to begin the adventure.</p>';else if(!timeOpen(id))a.innerHTML=`<p class="game-copy">This realm opens at ${c.time} IST on 16 November. Your map will remember your place.</p>`;else if(id==='vault'&&!openable(id))a.innerHTML='<p class="game-copy">The vault needs the four fragments from the earlier realms. Finish those chapters first.</p>';else if(done.includes(id)){a.innerHTML='<p class="game-copy">You have already conquered this realm. Its treasure is safe in your satchel.</p>';if(id==='vault')vaultGame(a,true);else document.getElementById('feedback').textContent='Fragment already collected.'}else{document.getElementById('modalSub').textContent=c.time+' IST · YOUR MISSION';if(id==='court')courtGame(a);if(id==='ocean')oceanGame(a);if(id==='archives')archivesGame(a);if(id==='carnival')carnivalGame(a);if(id==='vault')vaultGame(a)}document.getElementById('modal').classList.add('open');document.getElementById('modal').setAttribute('aria-hidden','false')}
function close(){stopGame();document.getElementById('modal').classList.remove('open');document.getElementById('modal').setAttribute('aria-hidden','true')}
function stopGame(){if(raf)cancelAnimationFrame(raf);raf=null}
function finish(m){document.getElementById('feedback').textContent=m;document.getElementById('continue').hidden=false}
function courtGame(area){
area.innerHTML=`
<p class="game-copy">Three baskets will make you the legend of the Enchanted Court. You have five attempts. Drag the ball backwards to aim and set your power, then release!</p>
<canvas id="courtCanvas" class="play-canvas" width="340" height="300"></canvas>
<div class="score" id="courtScore">Shots: 0/5 · Baskets: 0</div>
<p class="feedback" id="courtHint">Drag the basketball backwards and release to shoot.</p>
<button class="game-btn" id="resetShot">Reset ball</button>`;
let canvas=document.getElementById('courtCanvas'),ctx=canvas.getContext('2d');
let ball={x:65,y:245,vx:0,vy:0,r:13},shots=0,baskets=0,drag=false,aim=null,moving=false;
let hoop={x:270,y:105,w:43},scored=false;
function draw(){
ctx.clearRect(0,0,340,300);
let sky=ctx.createLinearGradient(0,0,0,300);sky.addColorStop(0,'#dce9e8');sky.addColorStop(1,'#f5e7ce');ctx.fillStyle=sky;ctx.fillRect(0,0,340,300);
ctx.fillStyle='#d3b18a';ctx.fillRect(0,260,340,40);
ctx.strokeStyle='#fff8e8';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,260);ctx.lineTo(340,260);ctx.stroke();
ctx.fillStyle='#9d7856';ctx.fillRect(290,65,8,110);ctx.fillStyle='#fff3dc';ctx.fillRect(254,65,42,5);
ctx.strokeStyle='#a55d45';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(270,105);ctx.lineTo(310,105);ctx.stroke();
ctx.strokeStyle='#b47c5c';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(273,106);ctx.lineTo(278,135);ctx.lineTo(302,135);ctx.lineTo(307,106);ctx.stroke();
ctx.fillStyle='#d87932';ctx.beginPath();ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#633c2b';ctx.lineWidth=1.5;ctx.stroke();ctx.beginPath();ctx.moveTo(ball.x-12,ball.y);ctx.lineTo(ball.x+12,ball.y);ctx.moveTo(ball.x,ball.y-12);ctx.lineTo(ball.x,ball.y+12);ctx.stroke();
if(aim&&!moving){ctx.strokeStyle='#8c6950';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(ball.x,ball.y);ctx.lineTo(ball.x+(ball.x-aim.x)*.5,ball.y+(ball.y-aim.y)*.5);ctx.stroke();ctx.setLineDash([])}
}
function pointer(e){let r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*340/r.width,y:(e.clientY-r.top)*300/r.height}}
function start(e){if(moving||shots>=5)return;let p=pointer(e);if(Math.hypot(p.x-ball.x,p.y-ball.y)<35){drag=true;aim=p;canvas.setPointerCapture(e.pointerId)}}
function move(e){if(drag){aim=pointer(e);draw()}}
function release(e){if(!drag)return;drag=false;let p=pointer(e),dx=ball.x-p.x,dy=ball.y-p.y;let power=Math.min(18,Math.hypot(dx,dy)*.13);if(power<2){aim=null;draw();return}shots++;scored=false;moving=true;ball.vx=Math.max(3,Math.min(15,dx*.12));ball.vy=Math.max(-17,Math.min(-4,dy*.12));document.getElementById('courtScore').textContent=`Shots: ${shots}/5 · Baskets: ${baskets}`;aim=null;animate()}
function animate(){if(!moving)return;ball.x+=ball.vx;ball.y+=ball.vy;ball.vy+=.38;
if(!scored&&ball.vx>0&&ball.x>hoop.x&&ball.x<hoop.x+hoop.w&&ball.y>hoop.y-7&&ball.y<hoop.y+15){baskets++;scored=true}
if(ball.y>247||ball.x>335||ball.x<5){moving=false;document.getElementById('courtScore').textContent=`Shots: ${shots}/5 · Baskets: ${baskets}`;if(baskets>=3){finish('🏀 Swish! You conquered the Enchanted Court!');return}if(shots>=5){finish('A valiant effort! You gave it your best shot.');return}ball={x:65,y:245,vx:0,vy:0,r:13};document.getElementById('courtHint').textContent='Next shot! Adjust your aim and try again.';draw();return}
draw();raf=requestAnimationFrame(animate)}
canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
document.getElementById('resetShot').onclick=()=>{if(!moving){ball={x:65,y:245,vx:0,vy:0,r:13};draw()}};
draw();
}
function oceanGame(area){
area.innerHTML=`
<p class="game-copy">Dive into the Sunken Kingdom. Collect five pearls and find the treasure chest before your oxygen runs out. Use the arrows to swim!</p>
<canvas id="oceanCanvas" class="play-canvas ocean-canvas" width="300" height="340"></canvas>
<div class="score" id="oceanScore">Pearls: 0/5 · Oxygen: 100%</div>
<div class="dpad">
<div><button data-move="up">↑</button></div>
<div><button data-move="left">←</button><button data-move="down">↓</button><button data-move="right">→</button></div>
</div>
<p class="feedback" id="oceanHint">Find all five pearls!</p>`;
let canvas=document.getElementById('oceanCanvas'),ctx=canvas.getContext('2d');
let player={x:40,y:45},pearls=[{x:90,y:75},{x:240,y:110},{x:80,y:190},{x:220,y:245},{x:150,y:300}],found=0,oxygen=100,keys={},ended=false;
function draw(){
ctx.clearRect(0,0,300,340);
let g=ctx.createLinearGradient(0,0,0,340);g.addColorStop(0,'#b9d9d9');g.addColorStop(1,'#326d83');ctx.fillStyle=g;ctx.fillRect(0,0,300,340);
for(let i=0;i<18;i++){ctx.beginPath();ctx.arc((i*53)%300,(i*79+20)%330,2+(i%3),0,Math.PI*2);ctx.fillStyle='#e5f4e8aa';ctx.fill()}
ctx.fillStyle='#8bb7a1';ctx.fillRect(0,325,300,15);
pearls.forEach((p,i)=>{if(!p.taken){ctx.beginPath();ctx.arc(p.x,p.y,9,0,Math.PI*2);ctx.fillStyle='#fff1d1';ctx.fill();ctx.strokeStyle='#c4a86c';ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(p.x-2,p.y-5,3,3)}});
ctx.font='26px serif';ctx.fillText('🧰',260,315);
ctx.font='28px serif';ctx.fillText('🐠',player.x-13,player.y+10);
}
function move(){if(ended)return;let speed=3;if(keys.up)player.y-=speed;if(keys.down)player.y+=speed;if(keys.left)player.x-=speed;if(keys.right)player.x+=speed;player.x=Math.max(15,Math.min(285,player.x));player.y=Math.max(20,Math.min(320,player.y));
pearls.forEach(p=>{if(!p.taken&&Math.hypot(player.x-p.x,player.y-p.y)<22){p.taken=true;found++}});
oxygen-=.12;document.getElementById('oceanScore').textContent=`Pearls: ${found}/5 · Oxygen: ${Math.ceil(oxygen)}%`;
if(found===5&&Math.hypot(player.x-260,player.y-305)<35){ended=true;finish('🐚 You found the treasure of the Sunken Kingdom!');return}
if(oxygen<=0){ended=true;document.getElementById('oceanHint').textContent='You ran out of oxygen. Try again!';let b=document.createElement('button');b.className='game-btn';b.textContent='Dive again';b.onclick=()=>oceanGame(area);area.appendChild(b);return}
draw();raf=requestAnimationFrame(move)}
document.querySelectorAll('[data-move]').forEach(b=>{let k=b.dataset.move;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true});['pointerup','pointerleave','pointercancel'].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false))});
draw();move();
}
const memories=[
{q:'When you mentioned that your home was far from college, what did I cheekily offer?',a:['A lift every day','You could crash at my place','A place in the college library','To move closer to college'],c:1,why:'That was quite an offer, wasn’t it?'},
{q:'What were you doing when I found myself looking at you in absolute awe?',a:['Reading a book','Looking out of the window','Searching for something in your bag','Talking to a friend'],c:2,why:'You were looking for something in your bag. I was simply lost in the moment.'},
{q:'What did you feed me in the middle of class?',a:['Samosas and chai','Khakhra and chhole','Chocolate and biscuits','Sandwiches'],c:1,why:'Khakhra and chhole. A classroom snack I certainly remember.'},
{q:'What did the pendant you gave me say?',a:['Forever','Always','Love','Yours'],c:2,why:'It said Love. And I thought about it all weekend.'},
{q:'What was I supposed to do during the Christmas vacations?',a:['Travel','Study','Sleep all day','Attend college events'],c:1,why:'We were supposed to study. We ended up spending so much time together online that we grew unbelievably close.'},
{q:'What happened after your Annual Day win?',a:['We went for dinner','We had our first photo session together','We watched a movie','We went shopping'],c:1,why:'Our first photo session, after your Annual Day win.'},
{q:'What did you say after we snuggled in the auto rickshaw?',a:['Let’s do this again','This is wrong, we should only be friends','Don’t tell anyone','I’m sleepy'],c:1,why:'“This is wrong, we should only be friends.” Quite a plot twist.'},
{q:'What was the birthday surprise you gave me?',a:['A cake','A handwritten letter','Bursting a balloon on my face','A surprise phone call'],c:2,why:'A balloon to the face, and a moment I’ll never forget.'},
{q:'What made that birthday surprise especially memorable?',a:['The first hug you initiated','The cake flavour','The music','The decorations'],c:0,why:'It was the first hug you initiated, and you recorded my reaction.'}
];
function quiz(area,list,title){
let i=0,score=0;

area.innerHTML=`
<p class="game-copy">${title}</p>
<div class="game-box">
<div class="score" id="quizCount"></div>
<div class="question" id="quizQuestion"></div>
<div id="quizOptions"></div>
<p class="feedback" id="quizFeedback"></p>
</div>`;

function show(){
let q=list[i];
document.getElementById('quizCount').textContent=`MEMORY ${i+1} OF ${list.length}`;
document.getElementById('quizQuestion').textContent=q.q;
document.getElementById('quizFeedback').textContent='';

let box=document.getElementById('quizOptions');
box.innerHTML='';
box.dataset.answered='';

q.a.forEach((v,n)=>{
let b=document.createElement('button');
b.className='game-btn';
b.textContent=v;

b.onclick=()=>{
if(box.dataset.answered)return;
box.dataset.answered='1';

if(n===q.c){
score++;
document.getElementById('quizFeedback').textContent='✓ '+q.why;
}else{
document.getElementById('quizFeedback').textContent='Not quite! '+q.why;
}

let next=document.createElement('button');
next.className='primary';
next.textContent=i===list.length-1?'Finish':'Next memory';

next.onclick=()=>{
i++;
if(i<list.length){
show();
}else{
area.innerHTML=`<h3>Memory keeper</h3>
<p class="game-copy">You remembered ${score} out of ${list.length} moments. The best part is that we got to live them.</p>`;
finish('📜 The Lost Archives have opened!');
}
};

box.appendChild(next);
};

box.appendChild(b);
});
}

show();
}
function archivesGame(area){quiz(area,memories,'Some moments are written in books. Ours are written in memory. How many do you remember?')}
// ORIGINAL ARCHIVE QUESTIONS — PRESERVED
memories.push(
{q:'Where did our first little forehead kiss happen?',a:['When you rested your head on my shoulder','At the bus stop','In the rain','In the classroom'],c:0,why:'A quiet moment, your head on my shoulder, and our first forehead kiss.',photo:'first-kiss.jpg'},
{q:'Where did we spend those legendary three minutes almost kissing?',a:['The library','The Hanging Gardens','The basketball court','The canteen'],c:1,why:'The Hanging Gardens. Three minutes of being ridiculously close—and still no kiss.',photo:'hanging-gardens.jpg'},
{q:'What was our first journey together?',a:['A train ride','A night bus trip','A flight','A college bus'],c:1,why:'Our first bus trip, riding through the night and making our own little adventure.',photo:'night-bus.jpg'},
{q:'Which date belongs in the archives as the day of your first confession?',a:['6 September 2025','16 November 2025','6 October 2025','6 August 2025'],c:0,why:'6 September 2025. A date worth keeping.',photo:'confession.jpg'},
{q:'What is the officially approved replacement for "I know"?',a:['Obviously',"That's interesting, thank you",'Noted, boss','Fair enough'],c:1,why:"That's interesting, thank you. The only acceptable response, apparently."},
{q:'In the mapmaker’s extremely accurate dream, who was CEO?',a:['Yashitae','The bricklayer','The bus conductor','The professor'],c:0,why:'CEO Yashitae, surveying her empire from the top floor while her favourite bricklayer got to work.',photo:'new-home.jpg'}
);

// CARNIVAL
const dares=[
'Give your mapmaker a dramatic 10-second award speech.',
'Send a voice note saying: "That’s interesting, thank you." with maximum seriousness.',
'Do your best CEO wave from an imaginary top-floor office.',
'Invent a name for the bricklaying company in your dream.',
'Strike a champion pose. The imaginary paparazzi are watching.',
'Give your mapmaker your most convincing evil laugh.',
'Describe our story as if you were narrating a movie trailer.'
];

function carnivalGame(area){
area.innerHTML=`
<p class="game-copy">Welcome to the Carnival of Curiosities! Spin the wheel and complete the challenge it chooses for you.</p>
<div class="game-box">
<div style="font-size:65px" id="wheelIcon">🎡</div>
<h3 id="dare">The wheel is waiting...</h3>
<button class="game-btn" id="spin">SPIN THE WHEEL</button>
<button class="game-btn" id="doneDare" hidden>I DID IT!</button>
</div>
<p class="feedback" id="carnivalHint">No skipping the challenge, explorer!</p>`;
document.getElementById('spin').onclick=()=>{
let d=dares[Math.floor(Math.random()*dares.length)];
document.getElementById('dare').textContent=d;
document.getElementById('wheelIcon').textContent='✨';
document.getElementById('spin').disabled=true;
document.getElementById('doneDare').hidden=false;
};
document.getElementById('doneDare').onclick=()=>{
finish('🎟️ The carnival judges are impressed. Your ticket and fragment are yours!');
};
}

// BIRTHDAY VAULT
function vaultGame(area,alreadyDone=false){
area.innerHTML=`
<p class="game-copy">The four fragments have brought you here. One last little lock stands between you and the treasure.</p>
<div class="game-box">
<div style="font-size:54px">🔐</div>
<p class="question">Complete the mapmaker's secret phrase:</p>
<p class="game-copy">Instead of saying "I know", the correct response is...</p>
<button class="game-btn" id="wrong">I knew it</button>
<button class="game-btn" id="right">That's interesting, thank you</button>
<p class="feedback" id="vaultMsg"></p>
</div>
<div class="game-box" id="finalTreasure" ${alreadyDone?'':'hidden'}>
<div style="font-size:50px">👑</div>
<h3>Yashitae, Keeper of the Five Treasures</h3>
<p class="game-copy">You conquered the Court, found the Sunken Kingdom, opened the Archives, survived the Carnival, and reached the Vault.</p>
<p class="game-copy">Happy Birthday. I hope today gave you a little adventure, a lot of laughter, and a reminder of how special you are to me.</p>
<p class="game-copy"><b>— Your favourite bricklayer</b></p>
<p class="game-copy">A little soundtrack for your final treasure:</p>
<p><a href="https://www.youtube.com/watch?v=cWMxCE2HTag" target="_blank" rel="noopener noreferrer">Listen to Softly — Karan Aujla ↗</a></p>
<div class="birthday-letter">
<p>I don't think you realise just how much you mean to me.</p>
<p>There's something about you that makes the world feel a little more alive. Sometimes I genuinely feel like nature has arranged its little details around you — the skies, the colours, the seasons, all of it. Almost as if the world belongs to you, exists for you, and somehow carries a little piece of you in everything.</p>
<p>And beyond all that, I'm just glad I get to know you. To see your curious, mischievous, wonderfully unpredictable self. To have someone whose presence can turn an ordinary day into a memory I keep coming back to.</p>
<p>I hope you never underestimate the place you hold in my life. And I hope the world gives you as much happiness, wonder and beauty as you bring into it.</p>
<p>Happy birthday, you. Keep being unapologetically you. ❤️</p>
</div>
</div>`;
document.getElementById('wrong').onclick=()=>{
document.getElementById('vaultMsg').textContent='The vault remains unimpressed. Think of the official protocol.';
};
document.getElementById('right').onclick=()=>{
document.getElementById('vaultMsg').textContent='Correct. The vault recognises its rightful owner.';
document.getElementById('finalTreasure').hidden=false;
finish('The Birthday Vault is open. Your final treasure has been revealed.');
};
}

// CONNECT ALL CONTROLS
document.querySelectorAll('.realm').forEach(b=>{
b.onclick=()=>modal(b.dataset.id);
});
document.getElementById('close').onclick=close;
document.getElementById('modal').onclick=e=>{
if(e.target.id==='modal')close();
};
document.addEventListener('keydown',e=>{
if(e.key==='Escape')close();
});
document.getElementById('continue').onclick=()=>{
if(!active||done.includes(active))return;
if(active==='vault'&&!ids.slice(0,4).every(x=>done.includes(x)))return;
done.push(active);
save();
update();
close();
sayToast('Treasure collected! Your map has been updated.');
};
document.getElementById('begin').onclick=()=>{
document.getElementById('map').scrollIntoView({behavior:'smooth'});
};
if(PREVIEW)document.getElementById('preview').style.display='block';
update();
setInterval(update,30000);
