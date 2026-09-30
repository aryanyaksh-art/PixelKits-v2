// Saltmarsh minigames: timing bar (fishing, strength test, ring toss), memory buoys, rhythm stage cues and the claw machine.
// Each returns a promise that resolves with a result when the game ends. Adds to PK.minigame.
(function () {
  'use strict';
  var PK = window.PK;
  function sfx(n) { if (PK.audio) PK.audio.sfx(n); }
  function F() { return PK.font; }
  function bg(ctx, top, bottom) {
    var g = ctx.createLinearGradient(0, 0, 0, PK.H); g.addColorStop(0, top); g.addColorStop(1, bottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, PK.W, PK.H);
  }

  // ---------------- timing bar ----------------
  // cfg: {title, hint, hits, speed, zone, theme:'fish'|'strength'|'ring', label:[...]}. Resolves {win, hits}.
  function Timing(cfg, done) {
    this.opaque = true; this.c = cfg || {}; this.done = done;
    this.need = this.c.hits || 3; this.hit = 0; this.miss = 0; this.maxMiss = this.c.misses || 3;
    this.pos = 0; this.dir = 1; this.speed = this.c.speed || 1.8; this.zw = this.c.zone || 26; this.t = 0; this.flash = 0; this.msg = ''; this.end = 0;
    this.newZone();
  }
  Timing.prototype.newZone = function () { this.zs = 8 + Math.floor(Math.random() * (144 - this.zw)); };
  Timing.prototype.update = function () {
    var inp = PK.input;
    this.t++;
    if (this.flash > 0) this.flash--;
    if (this.end) { if (++this.end > 70) { PK.pop(this); this.done({ win: this.hit >= this.need, hits: this.hit }); } return; }
    this.pos += this.dir * this.speed;
    if (this.pos >= 160) { this.pos = 160; this.dir = -1; }
    if (this.pos <= 0) { this.pos = 0; this.dir = 1; }
    if (inp.ok()) {
      if (this.pos >= this.zs && this.pos <= this.zs + this.zw) {
        this.hit++; this.flash = 12; sfx('statup'); this.msg = (this.c.good || ['Nice!', 'Great!', 'Perfect!'])[Math.min(2, this.hit - 1)];
        if (this.hit >= this.need) { this.end = 1; this.msg = this.c.winMsg || 'You did it!'; return; }
        this.speed += 0.5; this.zw = Math.max(12, this.zw - 3); this.newZone();
      } else {
        sfx('buzz'); this.miss++; this.msg = this.c.badMsg || 'Missed!';
        if (this.miss >= this.maxMiss) { this.end = 1; this.msg = this.c.loseMsg || 'Out of tries!'; }
      }
    }
    if (inp.cancel()) { sfx('back'); PK.pop(this); this.done({ win: false, hits: this.hit, quit: true }); }
  };
  Timing.prototype.draw = function (ctx) {
    var c = this.c, cx = PK.W / 2, th = c.theme || 'fish';
    var pal = { fish: ['#1c4a8a', '#2a86b8', '#8ae8ff'], strength: ['#3a1a1a', '#6a2a2a', '#f0a040'], ring: ['#2a1a4a', '#5a2a8a', '#f8d040'] }[th] || ['#1c4a8a', '#2a86b8', '#8ae8ff'];
    bg(ctx, pal[0], pal[1]);
    F().center(ctx, c.title || 'TIMING', cx, 3, '#f8e8a0', '#1a1410');
    F().center(ctx, c.hint || 'Stop the marker in the gold zone', cx, 13, '#e8e0d0', '#1a1410');
    if (th === 'fish') {
      // water, a line and a bobbing fish on the hook
      for (var i = 0; i < 8; i++) { ctx.fillStyle = 'rgba(200,240,255,0.25)'; ctx.fillRect((i * 37 + this.t) % 240, 40 + (i * 13) % 50, 12, 1); }
      var fy = 70 + Math.sin(this.t / 8) * 3 - this.hit * 6;
      ctx.fillStyle = '#e8f8ff'; ctx.fillRect(cx, 24, 1, fy - 24); ctx.fillStyle = '#f0a040'; ctx.fillRect(cx - 8, fy, 14, 6); ctx.fillRect(cx + 6, fy + 1, 4, 4); ctx.fillStyle = '#1a1a22'; ctx.fillRect(cx - 5, fy + 2, 1, 1);
    } else if (th === 'strength') {
      var h = Math.min(4, this.hit) / this.need;
      ctx.fillStyle = '#e8483a'; ctx.fillRect(cx - 4, 34, 8, 70); ctx.fillStyle = '#fcfcfc'; for (var k = 0; k < 7; k++) ctx.fillRect(cx - 4, 38 + k * 10, 8, 1);
      ctx.fillStyle = '#e8c050'; ctx.beginPath(); ctx.arc(cx, 28, 8, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(cx - 5, 96 - Math.round(h * 62), 10, 6);
    } else {
      ctx.fillStyle = '#8a4ac0'; ctx.fillRect(cx - 40, 96, 80, 6);
      [-24, -8, 8, 24].forEach(function (x, i) { ctx.fillStyle = ['#4ab890', '#3a78d0', '#f0b030', '#e870b0'][i]; ctx.fillRect(cx + x - 3, 74, 6, 22); });
      ctx.fillStyle = '#f8d040'; ctx.beginPath(); ctx.arc(cx - 32 + this.hit * 22, 60 + Math.sin(this.t / 5) * 4, 5, 0, 6.3); ctx.fill();
    }
    var bx = cx - 82, by = 110;
    ctx.fillStyle = '#1e1a28'; ctx.fillRect(bx - 2, by - 2, 168, 14); ctx.fillStyle = '#3a3a50'; ctx.fillRect(bx, by, 164, 10);
    ctx.fillStyle = '#e8b840'; ctx.fillRect(bx + 2 + this.zs, by, this.zw, 10); ctx.fillStyle = '#fff4c0'; ctx.fillRect(bx + 2 + this.zs, by, this.zw, 2);
    var px = Math.round(bx + 2 + this.pos);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(px - 1, by - 4, 3, 18); ctx.fillStyle = '#1e1a28'; ctx.fillRect(px, by - 3, 1, 16);
    for (var n = 0; n < this.need; n++) { ctx.fillStyle = n < this.hit ? '#e8b840' : '#4a4a60'; ctx.fillRect(cx - this.need * 7 + n * 14 + 2, 128, 10, 5); }
    for (var m = 0; m < this.maxMiss; m++) { ctx.fillStyle = m < this.miss ? '#e8483a' : '#4a4a60'; ctx.fillRect(cx + 60 + m * 8, 128, 6, 5); }
    F().center(ctx, this.msg || 'A: stop   B: give up', cx, 140, this.msg ? '#f8e8c0' : '#a8b0c0', '#1a1410');
  };

  // ---------------- memory buoys ----------------
  // cfg: {rounds, start}. Four buoys light in a sequence; repeat it with the arrow keys. Resolves {win}.
  function Memory(cfg, done) {
    this.opaque = true; this.c = cfg || {}; this.done = done;
    this.rounds = this.c.rounds || 4; this.round = 0; this.seq = []; this.phase = 'show'; this.i = 0; this.timer = 40; this.lit = -1; this.in = 0; this.msg = ''; this.t = 0; this.end = 0;
    this.next();
  }
  Memory.prototype.next = function () {
    var len = (this.c.start || 3) + this.round;
    this.seq = []; for (var i = 0; i < len; i++) this.seq.push(Math.floor(Math.random() * 4));
    this.phase = 'show'; this.i = 0; this.timer = 44; this.lit = -1; this.in = 0; this.msg = 'Watch the buoys...';
  };
  Memory.prototype.update = function () {
    var inp = PK.input; this.t++;
    if (this.end) { if (++this.end > 60) { PK.pop(this); this.done({ win: this.win }); } return; }
    if (this.phase === 'show') {
      if (--this.timer > 0) return;
      if (this.lit >= 0) { this.lit = -1; this.timer = 10; return; }
      if (this.i >= this.seq.length) { this.phase = 'input'; this.msg = 'Now you! Arrow keys.'; return; }
      this.lit = this.seq[this.i++]; sfx('select'); this.timer = 24;
      return;
    }
    var dirs = ['up', 'right', 'down', 'left'];
    for (var d = 0; d < 4; d++) if (inp.p(dirs[d])) {
      this.lit = d; this.flashT = 10;
      if (d === this.seq[this.in]) { sfx('select'); this.in++; if (this.in >= this.seq.length) { this.round++; if (this.round >= this.rounds) { this.win = true; this.end = 1; this.msg = 'Every buoy in order!'; sfx('statup'); } else { this.msg = 'Good! One more...'; this.phase = 'wait'; this.timer = 40; } } }
      else { sfx('buzz'); this.win = false; this.end = 1; this.msg = 'Wrong buoy!'; }
    }
    if (this.flashT > 0 && --this.flashT === 0) this.lit = -1;
    if (this.phase === 'wait' && --this.timer <= 0) this.next();
    if (inp.cancel()) { sfx('back'); PK.pop(this); this.done({ win: false, quit: true }); }
  };
  Memory.prototype.draw = function (ctx) {
    var cx = PK.W / 2;
    bg(ctx, '#0e2a5a', '#2a6ab0');
    for (var i = 0; i < 10; i++) { ctx.fillStyle = 'rgba(200,240,255,0.2)'; ctx.fillRect((i * 29 + this.t / 2) % 240, 30 + (i * 17) % 100, 10, 1); }
    F().center(ctx, this.c.title || 'BUOY MEMORY', cx, 3, '#f8e8a0', '#1a1410');
    F().center(ctx, 'Round ' + Math.min(this.rounds, this.round + 1) + ' of ' + this.rounds, cx, 13, '#e8e0d0', '#1a1410');
    var pos = [[cx, 44], [cx + 44, 76], [cx, 108], [cx - 44, 76]], col = ['#e8483a', '#f8d040', '#3ab890', '#3a8ae0'];
    for (var b = 0; b < 4; b++) {
      var on = this.lit === b, x = pos[b][0], y = pos[b][1] + Math.round(Math.sin(this.t / 10 + b) * 2);
      ctx.fillStyle = '#10182a'; ctx.beginPath(); ctx.arc(x, y, 15, 0, 6.3); ctx.fill();
      ctx.fillStyle = on ? col[b] : this.shade(col[b]); ctx.beginPath(); ctx.arc(x, y, 12, 0, 6.3); ctx.fill();
      ctx.fillStyle = on ? '#ffffff' : 'rgba(255,255,255,0.25)'; ctx.fillRect(x - 6, y - 8, 4, 3);
      if (on) { ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.beginPath(); ctx.arc(x, y, 19, 0, 6.3); ctx.fill(); }
    }
    F().center(ctx, this.msg || '', cx, 136, '#f8e8c0', '#1a1410');
  };
  Memory.prototype.shade = function (c) { var n = parseInt(c.slice(1), 16); return 'rgb(' + ((n >> 16) * 0.4 | 0) + ',' + (((n >> 8) & 255) * 0.4 | 0) + ',' + ((n & 255) * 0.4 | 0) + ')'; };

  // ---------------- stage cues (rhythm) ----------------
  // cfg: {cues, speed}. Arrows fall toward a hit line; press the matching arrow as they cross it. Resolves {win, score}.
  function Cues(cfg, done) {
    this.opaque = true; this.c = cfg || {}; this.done = done;
    this.n = this.c.cues || 16; this.speed = this.c.speed || 1.4; this.t = 0; this.notes = []; this.score = 0; this.miss = 0; this.msg = ''; this.end = 0;
    var gap = this.c.gap || 34;
    for (var i = 0; i < this.n; i++) this.notes.push({ lane: Math.floor(Math.random() * 4), y: -30 - i * gap, hit: false, gone: false });
    this.need = Math.ceil(this.n * (this.c.pass || 0.7));
  }
  Cues.prototype.update = function () {
    var inp = PK.input; this.t++;
    if (this.end) { if (++this.end > 70) { PK.pop(this); this.done({ win: this.score >= this.need, score: this.score }); } return; }
    var lane = -1, dirs = ['left', 'up', 'down', 'right'];
    for (var d = 0; d < 4; d++) if (inp.p(dirs[d])) lane = d;
    var line = 116, self = this;
    this.notes.forEach(function (n) { if (!n.gone) n.y += self.speed; });
    if (lane >= 0) {
      var best = null;
      this.notes.forEach(function (n) { if (!n.gone && n.lane === lane && Math.abs(n.y - line) < 14 && (!best || Math.abs(n.y - line) < Math.abs(best.y - line))) best = n; });
      if (best) { best.gone = true; best.hit = true; this.score++; this.msg = Math.abs(best.y - line) < 5 ? 'PERFECT!' : 'Good'; sfx('select'); }
      else { this.miss++; this.msg = 'Off the beat'; sfx('buzz'); }
    }
    this.notes.forEach(function (n) { if (!n.gone && n.y > line + 16) { n.gone = true; self.miss++; self.msg = 'Missed a cue'; } });
    if (this.notes.every(function (n) { return n.gone; })) { this.end = 1; this.msg = this.score >= this.need ? 'The crowd goes wild!' : 'The lights flicker out...'; sfx(this.score >= this.need ? 'statup' : 'buzz'); }
    if (inp.cancel()) { sfx('back'); PK.pop(this); this.done({ win: false, quit: true }); }
  };
  Cues.prototype.draw = function (ctx) {
    var cx = PK.W / 2;
    bg(ctx, '#2a0a2a', '#6a1a4a');
    for (var s = 0; s < 4; s++) { ctx.fillStyle = 'rgba(255,240,170,' + (0.06 + 0.04 * ((this.t / 20 + s) % 2)) + ')'; ctx.beginPath(); ctx.moveTo(30 + s * 60, 0); ctx.lineTo(10 + s * 60, PK.H); ctx.lineTo(50 + s * 60, PK.H); ctx.fill(); }
    F().center(ctx, this.c.title || 'STAGE CUES', cx, 3, '#f8e8a0', '#1a1410');
    F().center(ctx, 'Hit ' + this.need + ' of ' + this.n + '   Score ' + this.score, cx, 13, '#e8e0d0', '#1a1410');
    var lx = [cx - 54, cx - 18, cx + 18, cx + 54], col = ['#e8483a', '#f8d040', '#3ab890', '#3a8ae0'], sym = ['<', '^', 'v', '>'];
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(cx - 74, 108, 148, 16);
    for (var l = 0; l < 4; l++) { ctx.fillStyle = col[l]; ctx.globalAlpha = 0.35; ctx.fillRect(lx[l] - 12, 108, 24, 16); ctx.globalAlpha = 1; F().center(ctx, sym[l], lx[l], 112, '#ffffff', '#1a1410'); }
    this.notes.forEach(function (n) { if (n.gone || n.y < 20) return; ctx.fillStyle = '#1a1410'; ctx.fillRect(lx[n.lane] - 11, n.y - 7, 22, 14); ctx.fillStyle = col[n.lane]; ctx.fillRect(lx[n.lane] - 10, n.y - 6, 20, 12); ctx.fillStyle = '#ffffff'; ctx.fillRect(lx[n.lane] - 10, n.y - 6, 20, 2); F().center(ctx, sym[n.lane], lx[n.lane], n.y - 3, '#ffffff', '#1a1410'); });
    F().center(ctx, this.msg || 'Arrow keys on the beat   B: quit', cx, 138, '#f8e8c0', '#1a1410');
  };

  // ---------------- claw machine ----------------
  // Move the claw with left/right, drop with A. Resolves {win, prize}.
  function Claw(cfg, done) {
    this.opaque = true; this.c = cfg || {}; this.done = done;
    this.x = 40; this.dir = 1; this.phase = 'move'; this.dropY = 0; this.t = 0; this.tries = this.c.tries || 2; this.prize = null; this.msg = '';
    this.plush = [[40, '#f0a040'], [76, '#4ab8e8'], [112, '#e8e060'], [148, '#c88ae0'], [184, '#e870b0']];
    this.end = 0;
  }
  Claw.prototype.update = function () {
    var inp = PK.input; this.t++;
    if (this.end) { if (++this.end > 60) { PK.pop(this); this.done({ win: !!this.prize, prize: this.prize }); } return; }
    if (this.phase === 'move') {
      this.x += this.dir * 1.2; if (this.x > 190) this.dir = -1; if (this.x < 30) this.dir = 1;
      if (inp.ok()) { this.phase = 'drop'; this.dropY = 0; sfx('select'); }
      if (inp.cancel()) { sfx('back'); PK.pop(this); this.done({ win: false, quit: true }); }
    } else if (this.phase === 'drop') {
      this.dropY += 2; if (this.dropY >= 60) { this.phase = 'grab'; this.gt = 0; }
    } else if (this.phase === 'grab') {
      var self = this, hit = this.plush.filter(function (p) { return Math.abs(p[0] - self.x) < 13; })[0];
      if (++this.gt === 16) { if (hit && Math.random() < (this.c.grip || 0.7)) { this.prize = hit[1]; this.msg = 'Got one!'; sfx('statup'); } else { this.msg = 'It slipped...'; sfx('buzz'); } }
      if (this.gt > 30) { this.phase = 'rise'; }
    } else if (this.phase === 'rise') {
      this.dropY -= 2; if (this.dropY <= 0) { this.dropY = 0; if (this.prize) this.end = 1; else { this.tries--; if (this.tries <= 0) { this.end = 1; this.msg = 'Out of tries!'; } else { this.phase = 'move'; this.msg = ''; } } }
    }
  };
  Claw.prototype.draw = function (ctx) {
    var cx = PK.W / 2;
    bg(ctx, '#3a0a3a', '#a02a6a');
    F().center(ctx, this.c.title || 'CLAW MACHINE', cx, 3, '#f8e8a0', '#1a1410');
    F().center(ctx, 'Tries left: ' + this.tries, cx, 13, '#e8e0d0', '#1a1410');
    ctx.fillStyle = '#1a2a4a'; ctx.fillRect(16, 26, 208, 104); ctx.fillStyle = 'rgba(200,236,255,0.12)'; ctx.fillRect(16, 26, 208, 20);
    this.plush.forEach(function (p) { ctx.fillStyle = '#10182a'; ctx.beginPath(); ctx.arc(p[0], 116, 13, 0, 6.3); ctx.fill(); ctx.fillStyle = p[1]; ctx.beginPath(); ctx.arc(p[0], 116, 11, 0, 6.3); ctx.fill(); ctx.fillStyle = '#1a1a22'; ctx.fillRect(p[0] - 4, 113, 2, 3); ctx.fillRect(p[0] + 2, 113, 2, 3); });
    var x = Math.round(this.x), y = 34 + this.dropY;
    ctx.fillStyle = '#c8d0dc'; ctx.fillRect(x, 28, 1, y - 28); ctx.fillRect(x - 6, y, 13, 2);
    var open = this.phase === 'drop' || this.phase === 'move' ? 6 : 2;
    ctx.fillRect(x - open, y + 2, 2, 10); ctx.fillRect(x + open - 1, y + 2, 2, 10);
    if (this.prize && (this.phase === 'rise' || this.end)) { ctx.fillStyle = this.prize; ctx.beginPath(); ctx.arc(x, y + 14, 8, 0, 6.3); ctx.fill(); }
    F().center(ctx, this.msg || 'A: drop the claw   B: walk away', cx, 138, '#f8e8c0', '#1a1410');
  };

  PK.minigame = PK.minigame || {};
  PK.minigame.timing = function (cfg) { return new Promise(function (res) { PK.push(new Timing(cfg, res)); }); };
  PK.minigame.memory = function (cfg) { return new Promise(function (res) { PK.push(new Memory(cfg, res)); }); };
  PK.minigame.cues = function (cfg) { return new Promise(function (res) { PK.push(new Cues(cfg, res)); }); };
  PK.minigame.claw = function (cfg) { return new Promise(function (res) { PK.push(new Claw(cfg, res)); }); };
})();
