(() => {
  const C = { K:'#202a32', W:'#e9ece8', S:'#899ba0', T:'#67d5b5', A:'#e7b562', H:'#fff6d8' };
  const r = (c,x,y,w,h,color) => { c.fillStyle=C[color]||color; c.fillRect(x,y,w,h); };
  function at(c,x,y,draw) {
    c.save();
    c.translate(Math.round(x),Math.round(y));
    draw();
    c.restore();
  }
  function tablet(c,x,y,used,time) {
    at(c,x,y,() => {
      r(c,1,1,18,18,'K'); r(c,3,3,14,14,'S'); r(c,4,4,12,12,'K');
      r(c,1,1,4,3,'W'); r(c,15,1,4,3,'W'); r(c,1,16,4,3,'S'); r(c,15,16,4,3,'S');
      if (!used) {
        const glow=Math.floor(time/220)%2?'H':'A';
        r(c,9,5,2,2,glow); r(c,7,7,6,2,glow); r(c,5,9,10,2,glow);
        r(c,7,11,6,2,glow); r(c,9,13,2,2,glow); r(c,9,8,2,4,'K');
        if (glow==='H') { r(c,0,9,2,2,'A'); r(c,18,9,2,2,'A'); }
      } else { r(c,7,7,6,6,'S'); r(c,9,9,2,2,'K'); }
    });
  }
  function pad(c,x,y,time) {
    const frame=Math.floor(time/120)%3;
    at(c,x,y,() => {
      r(c,1,12,30,4,'K'); r(c,4,14,24,2,'S');
      const top=frame===1?9:frame===2?1:5;
      r(c,4,top,24,3,'K'); r(c,6,top,20,2,'T');
      r(c,7,top+3,3,12-top,'T'); r(c,15,top+3,3,12-top,'T');
      r(c,23,top+3,3,12-top,'T');
      if (frame===2) { r(c,3,0,3,2,'A'); r(c,26,0,3,2,'A'); }
    });
  }
  function rune(c,x,y,time) {
    const frame=Math.floor(time/160)%4;
    at(c,x,y,() => {
      const shift=frame%2;
      r(c,8,3+shift,3,3,'T'); r(c,5,6+shift,3,3,'T'); r(c,11,6+shift,3,3,'T');
      r(c,3,9+shift,3,4,'T'); r(c,13,9+shift,3,4,'T');
      r(c,5,13+shift,3,3,'T'); r(c,11,13+shift,3,3,'T');
      r(c,8,16+shift,3,3,'T'); r(c,7,9+shift,5,4,'A');
      r(c,8,10+shift,3,2,'H'); r(c,2+frame,3,2,2,'A');
      r(c,14-frame,17,2,2,'A');
    });
  }
  globalThis.__pageRunnerObjects = { tablet, pad, rune };
})();
