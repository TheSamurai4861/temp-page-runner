(() => {
  const C = { K:'#202a32', W:'#e9ece8', S:'#899ba0', T:'#67d5b5', A:'#e7b562', H:'#fff6d8' };
  const frames = { idle:[3,180], run:[4,90], jump:[2,140], fall:[2,160], land:[3,90], spring:[3,80], bonus:[3,130], win:[4,150] };
  const r = (c,x,y,w,h,color) => { c.fillStyle=C[color]||color; c.fillRect(x,y,w,h); };
  function draw(c,x,y,state='idle',time=0,facingLeft=false) {
    const [count,ms] = frames[state] || frames.idle;
    const f = Math.floor(time/ms)%count;
    c.save();
    c.translate(Math.round(x),Math.round(y));
    if (facingLeft) { c.translate(18,0); c.scale(-1,1); }
    const bob = state==='idle' ? [0,0,1][f] : state==='run' ? [0,1,1,0][f] : state==='land' && f===2 ? 1 : 0;
    const squash = (state==='land' || state==='spring') && f===0;
    const stretch = state==='spring' && f===1;
    const headY = squash ? 4 : stretch ? 0 : state==='jump' ? 1 : 2+bob;
    const bodyY = squash ? 13 : stretch ? 10 : 12+bob;
    const bodyH = squash ? 5 : stretch ? 9 : 7;
    const crestX = state==='idle' ? [8,9,7][f] : state==='run' && f%2 ? 7 : 8;
    r(c,crestX,headY-2,3,4,'K'); r(c,crestX+1,headY-2,2,3,'T');
    r(c,crestX+3,headY-1,2,1,'T');
    r(c,3,headY+1,12,9,'K'); r(c,4,headY,10,2,'K');
    r(c,4,headY+2,10,4,'W'); r(c,3,headY+5,12,3,'S');
    r(c,9,headY+2,1,3,'S'); r(c,4,headY+3,1,2,'H');
    r(c,13,headY+3,1,1,'A'); r(c,4,headY+6,1,1,'A');
    r(c,5,headY+6,8,2,'K'); r(c,7,headY+6,3,1,'A');
    r(c,11,headY+6,1,1,'H');
    r(c,5,headY+8,8,2,'K'); r(c,6,headY+8,6,1,'S');
    r(c,5,bodyY,8,bodyH,'K'); r(c,6,bodyY+1,6,Math.max(3,bodyH-2),'W');
    r(c,5,bodyY,7,2,'A'); r(c,11,bodyY+1,3,2,'A');
    r(c,15,bodyY+2+(state==='run'?f%2:0),2,1,'A');
    r(c,8,bodyY+3,2,2,'T'); r(c,7,bodyY+4,4,1,'T');
    r(c,8,bodyY+5,2,1,'A');
    r(c,6,bodyY+bodyH-2,6,2,'S');
    let leftArm = {x:2,y:bodyY+1,h:5}, rightArm={x:13,y:bodyY+1,h:5};
    if (state==='run') { leftArm.y+=f%2?2:-1; rightArm.y+=f%2?-1:2; }
    if (state==='jump' || (state==='spring' && f>0)) { leftArm={x:state==='jump'&&f?0:1,y:bodyY-2,h:5}; rightArm={x:state==='jump'&&f?15:14,y:bodyY-2,h:5}; }
    if (state==='fall') { leftArm={x:f?1:0,y:bodyY+1,h:3}; rightArm={x:f?14:15,y:bodyY+1,h:3}; }
    if (state==='bonus' || state==='win') { rightArm={x:13,y:bodyY-3,h:6}; }
    r(c,leftArm.x,leftArm.y,3,leftArm.h,'K'); r(c,leftArm.x+1,leftArm.y+1,2,Math.max(1,leftArm.h-2),'S');
    r(c,rightArm.x,rightArm.y,3,rightArm.h,'K'); r(c,rightArm.x,rightArm.y+1,2,Math.max(1,rightArm.h-2),'S');
    r(c,rightArm.x,rightArm.y+Math.max(1,rightArm.h-2),2,2,'W');
    const shieldX=Math.max(0,leftArm.x-1), shieldY=leftArm.y+2;
    r(c,shieldX,shieldY,4,5,'K'); r(c,shieldX+1,shieldY+1,2,3,'S');
    r(c,shieldX+1,shieldY+2,1,1,'T'); r(c,shieldX+2,shieldY+3,1,1,'A');
    r(c,shieldX+1,shieldY+5,2,1,'K');
    if (state==='jump') {
      r(c,4,19+f,4,3,'K'); r(c,10,19+f,4,3,'K'); r(c,3,21+f,5,2,'S'); r(c,10,21+f,5,2,'S');
    } else if (state==='run') {
      const wide = f%2===0;
      r(c,wide?3:6,19,3,4,'K'); r(c,wide?11:9,19,3,4,'K');
      r(c,wide?2:5,22,5,2,'S'); r(c,wide?11:8,22,5,2,'S');
    } else if (squash) {
      r(c,3,19,5,3,'K'); r(c,10,19,5,3,'K'); r(c,2,22,6,2,'S'); r(c,10,22,6,2,'S');
    } else {
      const legY=state==='fall'?19+f:18+bob;
      r(c,5,legY,3,5,'K'); r(c,10,legY,3,5,'K');
      r(c,4,22,4,2,'S'); r(c,10,22,4,2,'S');
      r(c,4,22,1,1,'W'); r(c,13,22,1,1,'W');
    }
    if (state==='bonus') { r(c,15-f,5-f%2,2,2,'A'); r(c,13+f%2,3+f,2,2,'H'); }
    if (state==='win') {
      const swordX=f>=2?14:15;
      r(c,swordX,1,2,11,'K'); r(c,swordX,2,2,7,'W');
      r(c,swordX-1,10,4,2,'A'); r(c,swordX+1,12,1,3,'K');
      if (f%2) { r(c,1,3+f,2,2,'T'); r(c,0,5,2,2,'A'); }
    }
    c.restore();
  }
  globalThis.__pageRunnerKnight = { draw, width:18, height:24 };
})();
