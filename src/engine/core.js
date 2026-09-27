// PixelKits engine core: fixed-timestep loop, scene stack, frame timers.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  // BASE_W is the classic layout width; FW is the real canvas width (wider on widescreens).
  // Scenes flagged `wide` draw across the full canvas; others draw in a centered BASE_W stage.
  PK.BASE_W = 240;
  PK.W = 240;
  PK.H = 160;
  PK.FW = 240;
  PK.OX = 0;
  PK.frame = 0;
  PK.scenes = [];
  PK.speed = 1; // debug turbo multiplier
  var timers = [];

  function baseScene() {
    for (var i = PK.scenes.length - 1; i >= 0; i--) if (PK.scenes[i].opaque) return PK.scenes[i];
    return PK.scenes[0];
  }
  // Overlays (text boxes, menus) take the width of the opaque scene beneath them.
  PK.layout = function () {
    var b = baseScene();
    var wide = !b || b.wide;
    PK.W = wide ? PK.FW : PK.BASE_W;
    PK.OX = wide ? 0 : Math.floor((PK.FW - PK.BASE_W) / 2);
  };

  PK.push = function (s) {
    PK.scenes.push(s);
    PK.layout();
    if (s.enter) s.enter();
    return s;
  };
  PK.pop = function (s) {
    var i = s ? PK.scenes.lastIndexOf(s) : PK.scenes.length - 1;
    if (i < 0) return null;
    var r = PK.scenes.splice(i, 1)[0];
    PK.layout();
    if (r.exit) r.exit();
    return r;
  };
  PK.top = function () { return PK.scenes[PK.scenes.length - 1]; };
  PK.clearScenes = function () { while (PK.scenes.length) PK.pop(); };

  // Resolve after n frames of game time.
  PK.wait = function (n) {
    return new Promise(function (res) { timers.push({ n: Math.max(1, n | 0), res: res }); });
  };

  // Run an async function and log (not swallow silently) any error.
  PK.run = function (fn) {
    return Promise.resolve().then(fn).catch(function (e) {
      console.error(e);
      PK.lastError = e;
    });
  };

  PK.step = function () {
    PK.input.update();
    var top = PK.top();
    if (top && top.update) top.update();
    for (var i = 0; i < PK.scenes.length; i++) {
      var s = PK.scenes[i];
      if (s !== top && s.bgUpdate) s.bgUpdate();
    }
    for (var j = timers.length - 1; j >= 0; j--) {
      if (--timers[j].n <= 0) timers.splice(j, 1)[0].res();
    }
    if (PK.fx) PK.fx.update();
    if (PK.audio && PK.audio.update) PK.audio.update();
    if (PK.game && PK.game.tick) PK.game.tick();
    PK.frame++;
  };

  PK.draw = function () {
    var ctx = PK.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, PK.FW, PK.H);
    var start = 0;
    for (var i = PK.scenes.length - 1; i >= 0; i--) {
      if (PK.scenes[i].opaque) { start = i; break; }
    }
    if (PK.OX > 0) drawBackdrop(ctx, PK.scenes[start]);
    var sh = PK.fx ? PK.fx.shakeOffset() : [0, 0];
    ctx.save();
    ctx.translate(sh[0] + PK.OX, sh[1]);
    if (PK.OX > 0) { ctx.beginPath(); ctx.rect(0, 0, PK.BASE_W, PK.H); ctx.clip(); }
    for (var k = start; k < PK.scenes.length; k++) {
      var s = PK.scenes[k];
      if (s.draw) s.draw(ctx);
    }
    ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (PK.fx) PK.fx.draw(ctx);
  };

  // Fills the side margins around a centered stage scene.
  function drawBackdrop(ctx, scene) {
    if (scene && scene.drawBackdrop) { scene.drawBackdrop(ctx); return; }
    ctx.fillStyle = '#161a28';
    ctx.fillRect(0, 0, PK.FW, PK.H);
    ctx.fillStyle = '#1d2233';
    for (var y = 0; y < PK.H; y += 4) ctx.fillRect(0, y, PK.FW, 1);
    ctx.fillStyle = '#3a4260';
    ctx.fillRect(PK.OX - 2, 0, 1, PK.H);
    ctx.fillRect(PK.OX + PK.BASE_W + 1, 0, 1, PK.H);
  }

  PK.start = function () {
    var last = performance.now(), acc = 0, STEP = 1000 / 60, lastRaf = performance.now();
    // Fallback ticker when requestAnimationFrame is paused (hidden/embedded views)
    setInterval(function () {
      if (performance.now() - lastRaf > 120) tick(performance.now(), true);
    }, 33);
    function loop(now) {
      lastRaf = performance.now();
      tick(now, false);
      requestAnimationFrame(loop);
    }
    function tick(now, fallback) {
      now = fallback ? now : performance.now();
      acc += Math.min(now - last, 250);
      last = now;
      var n = 0;
      while (acc >= STEP && n < 6) {
        for (var t = 0; t < PK.speed; t++) {
          try { PK.step(); } catch (e) { console.error(e); PK.lastError = e; }
        }
        acc -= STEP;
        n++;
      }
      if (n >= 6) acc = 0;
      try { PK.draw(); } catch (e) { console.error(e); PK.lastError = e; }
    }
    requestAnimationFrame(loop);
  };

  // Debug/test helper: advance n frames synchronously
  PK.stepN = function (n) { for (var i = 0; i < n; i++) PK.step(); PK.draw(); return PK.frame; };

  PK.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
})();
