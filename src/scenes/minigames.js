// Gym minigames: minecart switch puzzle and pickaxe timing. Each returns a promise that resolves true on success.
(function () {
  'use strict';
  var PK = window.PK;
  var OPP = { n: 's', s: 'n', e: 'w', w: 'e' };
  var DV = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] };
  var CELL = { '-': 'we', '|': 'ns', r: 'se', '7': 'sw', L: 'ne', J: 'nw' };
  var CS = 20;
  function sfx(n) { if (PK.audio) PK.audio.sfx(n); }

  // ---------------- minecart switches ----------------
  // rows: track letters (see CELL), capital letters are switches (p.sw[letter] = two connection options),
  // 'E' is the exit and 'x' a buffer stop. The cart enters p.start = [col, row, side].
  function Minecart(p, done) {
    this.opaque = true; this.p = p; this.done = done;
    this.keys = Object.keys(p.sw);
    this.state = {};
    for (var i = 0; i < this.keys.length; i++) this.state[this.keys[i]] = 0;
    this.cur = 0; this.run = null; this.t = 0; this.end = null;
  }
  Minecart.prototype.conn = function (c) {
    if (CELL[c]) return CELL[c];
    if (this.p.sw[c]) return this.p.sw[c][this.state[c]];
    return null;
  };
  // Follow the track from the start. Returns {pts, result: 'win'|'crash'}.
  Minecart.prototype.trace = function () {
    var p = this.p, x = p.start[0], y = p.start[1], from = p.start[2], pts = [[x + 0.5 + DV[from][0] * 0.5, y + 0.5 + DV[from][1] * 0.5]];
    for (var guard = 0; guard < 80; guard++) {
      var c = (p.rows[y] || '')[x];
      if (!c || c === '.') { return { pts: pts, result: 'crash' }; }
      pts.push([x + 0.5, y + 0.5]);
      if (c === 'E') return { pts: pts, result: 'win' };
      if (c === 'x') return { pts: pts, result: 'crash' };
      var cn = this.conn(c);
      if (!cn || cn.indexOf(from) < 0) return { pts: pts, result: 'crash' };
      var out = cn[0] === from ? cn[1] : cn[0];
      x += DV[out][0]; y += DV[out][1]; from = OPP[out];
    }
    return { pts: pts, result: 'crash' };
  };
  Minecart.prototype.update = function () {
    var inp = PK.input;
    this.t++;
    if (this.run) {
      var r = this.run;
      r.u += 0.09;
      if (r.u >= r.tr.pts.length - 1) {
        r.u = r.tr.pts.length - 1;
        if (!this.end) {
          this.end = r.tr.result; this.endT = 0;
          if (this.end === 'win') { sfx('statup'); } else { sfx('smash'); PK.fx.shake(12, 3); }
        }
      }
      if (this.end && ++this.endT > 70) {
        if (this.end === 'win') { PK.pop(this); this.done(true); return; }
        this.run = null; this.end = null;
      }
      return;
    }
    var n = this.keys.length + 1;
    if (inp.rep('left') || inp.rep('up')) { this.cur = (this.cur + n - 1) % n; sfx('move'); }
    if (inp.rep('right') || inp.rep('down')) { this.cur = (this.cur + 1) % n; sfx('move'); }
    if (inp.ok()) {
      if (this.cur < this.keys.length) { var k = this.keys[this.cur]; this.state[k] = 1 - this.state[k]; sfx('select'); }
      else { this.run = { tr: this.trace(), u: 0 }; sfx('door'); }
    }
    if (inp.cancel()) { sfx('back'); PK.pop(this); this.done(false); }
  };
  Minecart.prototype.cellXY = function (x, y) {
    var ox = Math.floor((PK.W - this.p.rows[0].length * CS) / 2), oy = 26;
    return [ox + x * CS, oy + y * CS];
  };
  function seg(ctx, cx, cy, side, rail, tie) {
    var d = DV[side], ex = cx + d[0] * CS / 2, ey = cy + d[1] * CS / 2;
    ctx.fillStyle = tie;
    if (d[0]) { for (var i = 0; i < CS / 2; i += 4) ctx.fillRect(Math.min(cx, ex) + i, cy - 5, 2, 10); }
    else { for (var j = 0; j < CS / 2; j += 4) ctx.fillRect(cx - 5, Math.min(cy, ey) + j, 10, 2); }
    ctx.fillStyle = rail;
    if (d[0]) { ctx.fillRect(Math.min(cx, ex) - 2, cy - 4, CS / 2 + 4, 1); ctx.fillRect(Math.min(cx, ex) - 2, cy + 3, CS / 2 + 4, 1); }
    else { ctx.fillRect(cx - 4, Math.min(cy, ey) - 2, 1, CS / 2 + 4); ctx.fillRect(cx + 3, Math.min(cy, ey) - 2, 1, CS / 2 + 4); }
  }
  Minecart.prototype.draw = function (ctx) {
    var p = this.p, self = this;
    ctx.fillStyle = '#2a221e'; ctx.fillRect(0, 0, PK.W, PK.H);
    for (var s = 0; s < 40; s++) { ctx.fillStyle = s % 2 ? '#3a302a' : '#241c18'; ctx.fillRect((s * 53) % PK.W, (s * 29) % PK.H, 3, 2); }
    PK.font.center(ctx, 'MINECART SWITCHES', PK.W / 2, 3, '#f0d060', '#1a1410');
    PK.font.center(ctx, 'Route the cart to the exit!', PK.W / 2, 13, '#d8d0c4', '#1a1410');
    p.rows.forEach(function (row, y) {
      for (var x = 0; x < row.length; x++) {
        var c = row[x], xy = self.cellXY(x, y), cx = xy[0] + CS / 2, cy = xy[1] + CS / 2;
        if (c === '.') continue;
        if (c === 'E') {
          ctx.fillStyle = '#1e1a28'; ctx.fillRect(xy[0] + 2, xy[1] + 1, CS - 4, CS - 2);
          ctx.fillStyle = '#6ad060'; ctx.fillRect(xy[0] + 4, xy[1] + 3, CS - 8, CS - 6);
          for (var fq = 0; fq < 4; fq++) for (var fr2 = 0; fr2 < 3; fr2++) { ctx.fillStyle = (fq + fr2) & 1 ? '#1e1a28' : '#f8f8f0'; ctx.fillRect(xy[0] + 6 + fq * 2, xy[1] + 6 + fr2 * 2, 2, 2); }
          ctx.fillStyle = '#1e1a28'; ctx.fillRect(xy[0] + 5, xy[1] + 6, 1, 10); continue;
        }
        if (c === 'x') { ctx.fillStyle = '#1e1a28'; ctx.fillRect(cx - 7, cy - 6, 14, 12); ctx.fillStyle = '#d83a3a'; ctx.fillRect(cx - 6, cy - 5, 12, 10); ctx.fillStyle = '#f8f0e0'; ctx.fillRect(cx - 6, cy - 1, 12, 2); continue; }
        if (p.sw[c]) {
          var opts = p.sw[c], on = opts[self.state[c]], off = opts[1 - self.state[c]];
          off.split('').forEach(function (sd) { if (on.indexOf(sd) < 0) seg(ctx, cx, cy, sd, '#5a5048', '#3a2e24'); });
          on.split('').forEach(function (sd) { seg(ctx, cx, cy, sd, '#e8e8f0', '#8a5a30'); });
          var sel = self.keys.indexOf(c) === self.cur && !self.run;
          ctx.fillStyle = sel ? '#f0d060' : '#1e1a28'; ctx.fillRect(cx - 5, cy - 5, 10, 10);
          ctx.fillStyle = sel ? '#1e1a28' : '#f0d060'; PK.font.center(ctx, c, cx, cy - 4, ctx.fillStyle);
          if (sel && (self.t >> 4) & 1) { ctx.strokeStyle = '#f0d060'; ctx.strokeRect(xy[0] + 0.5, xy[1] + 0.5, CS - 1, CS - 1); }
          continue;
        }
        var cn = CELL[c];
        if (cn) cn.split('').forEach(function (sd) { seg(ctx, cx, cy, sd, '#c8ccd4', '#7a5230'); });
      }
    });
    // start arrow
    var st = self.cellXY(p.start[0], p.start[1]);
    ctx.fillStyle = '#f0d060'; ctx.fillRect(st[0] - 8, st[1] + CS / 2 - 1, 6, 2); ctx.fillRect(st[0] - 4, st[1] + CS / 2 - 3, 1, 6);
    // the cart
    var pos;
    if (this.run) {
      var pts = this.run.tr.pts, u = this.run.u, i0 = Math.floor(u), i1 = Math.min(pts.length - 1, i0 + 1), f = u - i0;
      pos = [pts[i0][0] + (pts[i1][0] - pts[i0][0]) * f, pts[i0][1] + (pts[i1][1] - pts[i0][1]) * f];
    } else pos = [p.start[0], p.start[1] + 0.5];
    var o = self.cellXY(0, 0), kx = o[0] + pos[0] * CS, ky = o[1] + pos[1] * CS;
    if (this.end === 'crash' && (this.endT >> 2) & 1) ky -= 2;
    ctx.fillStyle = '#1e1a28'; ctx.fillRect(kx - 7, ky - 7, 14, 11);
    ctx.fillStyle = '#6a6e7a'; ctx.fillRect(kx - 6, ky - 6, 12, 9); ctx.fillStyle = '#9aa0b0'; ctx.fillRect(kx - 6, ky - 6, 12, 2);
    ctx.fillStyle = '#e8c860'; ctx.fillRect(kx - 4, ky - 8, 3, 2); ctx.fillRect(kx + 1, ky - 9, 3, 3);
    ctx.fillStyle = '#1e1a28'; ctx.fillRect(kx - 5, ky + 3, 3, 3); ctx.fillRect(kx + 2, ky + 3, 3, 3);
    // GO button and help
    var goSel = this.cur === this.keys.length && !this.run;
    var by = 26 + p.rows.length * CS + 6;
    PK.ui.box(ctx, PK.W / 2 - 34, by, 68, 18);
    PK.font.center(ctx, goSel ? '> SEND CART <' : 'SEND CART', PK.W / 2, by + 5, goSel ? '#c83a3a' : '#383848', '#d6d4c8');
    var msg = this.end === 'win' ? 'The cart rolled through!' : this.end === 'crash' ? 'CRASH! The cart derailed.' : 'Arrows: choose   A: flip / send   B: leave';
    PK.font.center(ctx, msg, PK.W / 2, PK.H - 10, '#d8d0c4', '#1a1410');
  };

  // ---------------- pickaxe timing ----------------
  function Pickaxe(p, done) {
    this.opaque = true; this.p = p || {}; this.done = done;
    this.need = this.p.hits || 3; this.hit = 0;
    this.pos = 0; this.dir = 1; this.speed = this.p.speed || 1.8;
    this.zw = this.p.zone || 24; this.zs = 60; this.t = 0; this.flash = 0; this.msg = ''; this.win = 0;
    this.newZone();
  }
  Pickaxe.prototype.newZone = function () { this.zs = 8 + Math.floor(Math.random() * (144 - this.zw)); };
  Pickaxe.prototype.update = function () {
    var inp = PK.input;
    this.t++;
    if (this.flash > 0) this.flash--;
    if (this.win) { if (++this.win > 80) { PK.pop(this); this.done(true); } return; }
    this.pos += this.dir * this.speed;
    if (this.pos >= 160) { this.pos = 160; this.dir = -1; }
    if (this.pos <= 0) { this.pos = 0; this.dir = 1; }
    if (inp.ok()) {
      if (this.pos >= this.zs && this.pos <= this.zs + this.zw) {
        this.hit++; this.flash = 12; sfx('smash'); PK.fx.shake(8, 2);
        this.msg = ['CRACK!', 'CRAAACK!', 'SMASH!'][Math.min(2, this.hit - 1)];
        if (this.hit >= this.need) { this.win = 1; this.msg = 'The wall crumbled!'; return; }
        this.speed += 0.7; this.zw = Math.max(12, this.zw - 4); this.newZone();
      } else {
        sfx('buzz'); this.hit = Math.max(0, this.hit - 1);
        this.msg = 'CLANG! The pick bounced off.';
      }
    }
    if (inp.cancel()) { sfx('back'); PK.pop(this); this.done(false); }
  };
  Pickaxe.prototype.draw = function (ctx) {
    var cx = PK.W / 2;
    ctx.fillStyle = '#241c18'; ctx.fillRect(0, 0, PK.W, PK.H);
    PK.font.center(ctx, 'PICKAXE WALL', cx, 3, '#f0d060', '#1a1410');
    PK.font.center(ctx, 'Strike in the gold zone ' + this.need + ' times!', cx, 13, '#d8d0c4', '#1a1410');
    // the wall, cracking more with each hit
    var wx = cx - 50, wy = 26;
    ctx.fillStyle = '#1e1a28'; ctx.fillRect(wx - 1, wy - 1, 102, 72);
    ctx.fillStyle = this.flash ? '#b8aca0' : '#7a6e64'; ctx.fillRect(wx, wy, 100, 70);
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, 100, 70); ctx.clip();
    for (var r = 0; r < 7; r++) for (var c = -1; c < 6; c++) { ctx.fillStyle = (r + c) % 2 ? '#8a7e72' : '#6e6258'; ctx.fillRect(wx + c * 17 + (r % 2) * 8, wy + r * 10, 15, 8); }
    ctx.restore();
    ctx.fillStyle = '#2a2220';
    var cracks = [[[48, 10], [44, 30], [52, 42], [46, 62]], [[20, 20], [34, 32], [44, 30]], [[80, 16], [66, 36], [52, 42]], [[12, 50], [30, 46], [46, 62]]];
    for (var h = 0; h < Math.min(this.hit + (this.win ? 1 : 0), cracks.length); h++) {
      var cr = cracks[h];
      for (var k = 0; k < cr.length - 1; k++) {
        var n = 12;
        for (var s = 0; s <= n; s++) ctx.fillRect(wx + cr[k][0] + (cr[k + 1][0] - cr[k][0]) * s / n, wy + cr[k][1] + (cr[k + 1][1] - cr[k][1]) * s / n, 2, 2);
      }
    }
    if (this.win) { ctx.fillStyle = 'rgba(20,16,12,' + Math.min(0.9, this.win / 40) + ')'; ctx.fillRect(wx, wy, 100, 70); }
    // meter
    var bx = cx - 82, by = 106;
    ctx.fillStyle = '#1e1a28'; ctx.fillRect(bx - 2, by - 2, 168, 14);
    ctx.fillStyle = '#4a4038'; ctx.fillRect(bx, by, 164, 10);
    ctx.fillStyle = '#e8b840'; ctx.fillRect(bx + 2 + this.zs, by, this.zw, 10);
    ctx.fillStyle = '#fff4c0'; ctx.fillRect(bx + 2 + this.zs, by, this.zw, 2);
    var px = Math.round(bx + 2 + this.pos);
    ctx.fillStyle = '#ffffff'; ctx.fillRect(px - 1, by - 4, 3, 18); ctx.fillStyle = '#1e1a28'; ctx.fillRect(px, by - 3, 1, 16);
    for (var i = 0; i < this.need; i++) { ctx.fillStyle = i < this.hit ? '#e8b840' : '#4a4038'; ctx.fillRect(cx - this.need * 7 + i * 14 + 2, 124, 10, 6); }
    PK.font.center(ctx, this.msg || 'A: swing   B: step back', cx, 136, this.msg ? '#f8e8c0' : '#a89880', '#1a1410');
  };

  PK.minigame = {
    minecart: function (p) { return new Promise(function (res) { PK.push(new Minecart(p, res)); }); },
    pickaxe: function (p) { return new Promise(function (res) { PK.push(new Pickaxe(p, res)); }); }
  };
  PK.MINECART_GYM = {
    rows: ['.r--B-7...', '.|..|.|...', '-A--J.C--E', '......|...', '....x-J...'],
    sw: { A: ['we', 'wn'], B: ['ws', 'we'], C: ['ns', 'ne'] },
    start: [0, 2, 'w']
  };
})();
