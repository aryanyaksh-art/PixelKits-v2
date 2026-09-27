// v2 hand-drawn buildings: each kind has its own draw function (no shared template).
// Registered into PK.BUILDINGS with {w, h, door (column of the door on the bottom row, null = no door), draw, anim}.
(function () {
  'use strict';
  var PK = window.PK;
  var sh = function (c, a) { return PK.color.shade(c, a); };
  var OUT = '#1e1a28';

  // ---------- pixel helpers ----------
  function Art(W, H) {
    this.c = PK.makeCanvas(W, H);
    this.x = this.c.getContext('2d');
    this.W = W; this.H = H;
  }
  var A = Art.prototype;
  A.f = function (col, a, b, w, h) { this.x.fillStyle = col; this.x.fillRect(Math.round(a), Math.round(b), Math.round(w), Math.round(h)); };
  A.p = function (col, a, b) { this.f(col, a, b, 1, 1); };
  // Filled pixel disc/ring (r0 inner radius, 0 for a disc)
  A.ring = function (col, cx, cy, r1, r0) {
    this.x.fillStyle = col;
    for (var y = Math.floor(cy - r1); y <= Math.ceil(cy + r1); y++)
      for (var x = Math.floor(cx - r1); x <= Math.ceil(cx + r1); x++) {
        var d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
        if (d <= r1 && d >= (r0 || 0)) this.x.fillRect(x, y, 1, 1);
      }
  };
  // Thick pixel line
  A.line = function (col, x0, y0, x1, y1, t) {
    var n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2) + 1;
    for (var i = 0; i <= n; i++) {
      var u = i / n, x = x0 + (x1 - x0) * u, y = y0 + (y1 - y0) * u;
      this.f(col, Math.floor(x - (t - 1) / 2), Math.floor(y - (t - 1) / 2), t, t);
    }
  };
  // Outlined box
  A.box = function (col, a, b, w, h) { this.f(OUT, a - 1, b - 1, w + 2, h + 2); this.f(col, a, b, w, h); };

  // Gable roof: trapezoid from (x0..x0+w) at the eave up to a ridge, with shingle style.
  A.roof = function (x0, y0, w, h, col, style, o) {
    o = o || {};
    var inset = o.inset == null ? 5 : o.inset;
    for (var r = 0; r < h; r++) {
      var t = r / Math.max(1, h - 1), ins = Math.round(inset * (1 - t));
      this.f(OUT, x0 + ins - 1, y0 + r, w - ins * 2 + 2, 1);
    }
    for (var r2 = 1; r2 < h - 1; r2++) {
      var t2 = r2 / Math.max(1, h - 1), in2 = Math.round(inset * (1 - t2));
      var xa = x0 + in2, ww = w - in2 * 2, light = 0.16 * (1 - t2);
      if (style === 'thatch') {
        for (var sx = xa; sx < xa + ww; sx++) {
          var k = (sx * 7 + r2 * 3) % 5;
          this.p(sh(col, light + (k === 0 ? -0.28 : k === 1 ? 0.12 : k === 2 ? -0.1 : 0)), sx, y0 + r2);
        }
      } else if (style === 'tile') {
        var band = (r2 - 1) % 5;
        this.f(sh(col, light + (band === 4 ? -0.3 : band === 0 ? 0.1 : 0)), xa, y0 + r2, ww, 1);
        for (var tx = xa + ((r2 / 5 | 0) % 2) * 2; tx < xa + ww; tx += 4) this.p(sh(col, -0.25), tx, y0 + r2);
      } else {
        var bnd = (r2 - 1) % 4;
        this.f(sh(col, light + (bnd === 3 ? -0.3 : bnd === 0 ? 0.12 : 0)), xa, y0 + r2, ww, 1);
        if (bnd === 1) for (var bx = xa + (((r2 - 1) / 4 | 0) % 2 ? 3 : 0); bx < xa + ww; bx += 6) this.f(sh(col, -0.25), bx, y0 + r2, 1, 2);
      }
    }
    this.f(sh(col, 0.45), x0 + inset + 1, y0 + 1, w - inset * 2 - 2, 1);
    this.f(sh(col, -0.45), x0 + 1, y0 + h - 3, w - 2, 2);
    this.f(sh(col, 0.15), x0 + 1, y0 + h - 3, w - 2, 1);
    this.f(OUT, x0, y0 + h - 1, w, 1);
    if (style === 'thatch') for (var q = x0 + 2; q < x0 + w - 2; q += 3) this.f(sh(col, -0.35), q, y0 + h - 1, 1, 2);
  };
  // Wall surfaces
  A.plaster = function (col, a, b, w, h) {
    this.f(OUT, a - 1, b, w + 2, h);
    this.f(col, a, b, w, h - 1);
    this.f(sh(col, 0.2), a, b, 1, h - 1);
    this.f(sh(col, -0.16), a + w - 2, b, 2, h - 1);
    this.f(sh(col, -0.32), a, b, w, 2);
  };
  A.timber = function (col, beam, a, b, w, h) {
    this.plaster(col, a, b, w, h);
    var bm = sh(beam, 0), bl = sh(beam, 0.25);
    this.f(bm, a, b + 2, w, 2); this.f(bl, a, b + 2, w, 1);
    for (var x = a; x <= a + w - 3; x += 16) { this.f(bm, x, b + 2, 3, h - 3); this.f(bl, x, b + 2, 1, h - 3); }
    this.f(bm, a + w - 3, b + 2, 3, h - 3);
  };
  A.stone = function (col, a, b, w, h) {
    this.f(OUT, a - 1, b, w + 2, h);
    this.f(sh(col, -0.35), a, b, w, h - 1);
    for (var y = b + 1, row = 0; y < b + h - 2; y += 5, row++) {
      for (var x = a + (row % 2 ? -3 : 0); x < a + w; x += 7 + ((x * 3 + row) % 3)) {
        var x0 = Math.max(a, x), x1 = Math.min(a + w, x + 6);
        if (x1 - x0 < 2) continue;
        this.f(sh(col, ((x + row) % 3) * 0.05), x0, y, x1 - x0, 4);
        this.f(sh(col, 0.25), x0, y, x1 - x0, 1);
      }
    }
  };
  A.planks = function (col, a, b, w, h) {
    this.f(OUT, a - 1, b, w + 2, h);
    this.f(col, a, b, w, h - 1);
    for (var x = a; x < a + w; x += 4) { this.f(sh(col, -0.3), x + 3, b, 1, h - 1); this.f(sh(col, 0.15), x, b, 1, h - 1); }
    this.f(sh(col, -0.4), a, b, w, 2);
  };
  A.brick = function (col, a, b, w, h) {
    this.f(OUT, a - 1, b, w + 2, h);
    this.f(sh(col, -0.3), a, b, w, h - 1);
    for (var y = b + 1, row = 0; y < b + h - 1; y += 3, row++)
      for (var x = a + (row % 2) * 3; x < a + w; x += 6) this.f(sh(col, (x + y) % 4 ? 0 : 0.08), Math.max(a, x), y, Math.min(5, a + w - Math.max(a, x)), 2);
  };
  A.win = function (a, b, w, h, o) {
    o = o || {};
    this.f(OUT, a - 1, b - 1, w + 2, h + 2);
    this.f(o.frame || '#fcfcfc', a, b, w, h);
    this.f(o.dark ? '#2a3448' : '#6cb4ea', a + 1, b + 1, w - 2, h - 2);
    if (!o.dark) { this.f('#9ad0f6', a + 1, b + 1, w - 2, Math.ceil((h - 2) / 2.5)); this.f('#d8f0ff', a + 1, b + 1, 2, 2); }
    if (o.cross !== false) { this.f(o.frame || '#fcfcfc', a + (w >> 1), b + 1, 1, h - 2); this.f(o.frame || '#fcfcfc', a + 1, b + (h >> 1), w - 2, 1); }
    if (o.box) {
      this.f(OUT, a - 1, b + h, w + 2, 3);
      this.f('#a86a3a', a, b + h, w, 2);
      var fc = ['#e84848', '#f8d040', '#f070b0', '#ffffff'];
      for (var i = 0; i < w - 1; i += 3) this.f(fc[(i / 3 + a) % 4 | 0], a + i + 1, b + h - 1, 2, 1);
    }
    if (o.shutters) { this.f(o.shutters, a - 4, b, 3, h); this.f(o.shutters, a + w + 1, b, 3, h); this.f(sh(o.shutters, -0.3), a - 4, b + (h >> 1), 3, 1); this.f(sh(o.shutters, -0.3), a + w + 1, b + (h >> 1), 3, 1); }
  };
  A.roundWin = function (cx, cy, r) {
    this.ring(OUT, cx, cy, r + 1); this.ring('#fcfcfc', cx, cy, r); this.ring('#6cb4ea', cx, cy, r - 1);
    this.f('#fcfcfc', cx - 0.5, cy - r + 1, 1, r * 2 - 2); this.f('#fcfcfc', cx - r + 1, cy - 0.5, r * 2 - 2, 1);
    this.p('#d8f0ff', cx - r / 2, cy - r / 2);
  };
  A.door = function (a, b, style) {
    this.f(OUT, a - 1, b - 1, 14, 16);
    if (style === 'glass') {
      this.f('#58606e', a, b, 12, 15); this.f('#8cd0f0', a + 1, b + 1, 4, 13); this.f('#8cd0f0', a + 7, b + 1, 4, 13);
      this.f('#d8f4ff', a + 1, b + 1, 2, 5); this.f('#d8f4ff', a + 7, b + 1, 2, 5); this.f('#3a404c', a + 5, b, 2, 15);
    } else if (style === 'arch') {
      this.f(OUT, a + 1, b - 3, 10, 3); this.f('#6a4020', a + 2, b - 2, 8, 2);
      this.f('#6a4020', a, b, 12, 15);
      for (var i = 0; i < 12; i += 3) this.f('#8a5a30', a + i, b, 2, 15);
      this.f('#2a1a10', a, b + 7, 12, 1); this.f('#e8c050', a + 9, b + 8, 1, 2);
    } else {
      this.f(style === 'green' ? '#3a6a44' : style === 'blue' ? '#3a5a8a' : '#7a4a26', a, b, 12, 15);
      var pc = style === 'green' ? '#4e8a58' : style === 'blue' ? '#5078b0' : '#a06a3a';
      this.f(pc, a + 1, b + 1, 10, 6); this.f(pc, a + 1, b + 8, 10, 6);
      this.f(sh(pc, 0.3), a + 1, b + 1, 10, 1);
      this.f('#f0d060', a + 9, b + 7, 1, 2);
    }
    this.f(sh('#a8a098', -0.2), a - 2, b + 14, 16, 2);
  };
  A.chimney = function (a, b, h, col, smoke, frame) {
    this.f(OUT, a - 1, b, 9, h);
    this.f(col || '#a85a44', a, b + 1, 7, h - 1);
    this.f(sh(col || '#a85a44', 0.25), a, b + 1, 2, h - 1);
    this.f(sh(col || '#a85a44', -0.4), a, b + 3, 7, 1);
    if (smoke) {
      var f = frame || 0;
      [[2, -4], [4, -8], [1, -12]].forEach(function (s, i) {
        var o = (f + i) % 3;
        this.ring('rgba(240,240,248,0.75)', a + 3 + s[0] + o, b + s[1] - o, 2.2 - i * 0.4);
      }, this);
    }
  };
  A.label = function (text, cx, y, col) {
    var lw = PK.font.width(text) + 8, lx = Math.round(cx - lw / 2);
    this.f(OUT, lx - 1, y - 1, lw + 2, 11);
    this.f('#fbfbf4', lx, y, lw, 9);
    this.f('#d8d8cc', lx, y + 8, lw, 1);
    PK.font.draw(this.x, text, lx + 4, y + 1, col || '#384058');
  };
  A.foundation = function (a, b, w) {
    this.f(sh('#a8a098', -0.1), a, b, w, 3);
    this.f(sh('#a8a098', -0.35), a, b, w, 1);
  };

  var KINDS = {};

  // Timber-framed family home with a dormer window
  KINDS.home = { w: 5, h: 4, door: 1, draw: function (o) {
    var a = new Art(80, 64), roof = o.roof || '#5a6a8e';
    a.chimney(60, 2, 20, '#9a5a44', true, o.frame);
    a.roof(0, 4, 80, 26, roof, 'slate');
    a.box('#f4ecd8', 44, 8, 16, 14); a.f(sh(roof, -0.1), 42, 5, 20, 3); a.f(OUT, 42, 4, 20, 1);
    a.win(47, 11, 10, 9, {});
    a.timber('#f4ecd8', '#6a4428', 3, 28, 74, 36);
    a.win(40, 37, 12, 10, { box: true });
    a.win(58, 37, 12, 10, { box: true });
    a.door(18, 49, 'green');
    if (o.icon) a.iconSign(o.icon, 5, 40);
    a.foundation(3, 60, 74);
    return a.c;
  } };

  // Stone cottage with a thatched roof and a round window
  KINDS.cottage = { w: 4, h: 3, door: 2, draw: function (o) {
    var a = new Art(64, 48), roof = o.roof || '#d4ae52';
    a.chimney(10, 0, 16, '#8a7a6a', true, o.frame);
    a.roof(0, 3, 64, 22, roof, 'thatch', { inset: 7 });
    a.stone('#c8bca8', 3, 23, 58, 25);
    a.roundWin(16, 34, 5);
    a.door(34, 33, 'arch');
    if (o.icon) a.iconSign(o.icon, 23, 28);
    a.f(OUT, 50, 38, 9, 8); a.f('#b86a3a', 51, 39, 7, 6); a.f('#4caa46', 52, 35, 5, 4); a.f('#c070e0', 54, 34, 1, 1);
    a.foundation(3, 45, 58);
    return a.c;
  } };


  // Lookout watchtower: stone shaft, wooden cabin, pointed roof and a pennant
  KINDS.tower = { w: 3, h: 6, door: 1, anim: true, draw: function (o) {
    var a = new Art(48, 96), roof = o.roof || '#6a3a5a', fr = o.frame || 0;
    a.line('#4a3a2a', 24, 0, 24, 8, 1);
    a.f('#e84848', 25, 1 + (fr % 2), 7 - fr, 3); a.f('#f87a6a', 25, 1 + (fr % 2), 5 - fr, 1);
    a.roof(3, 6, 42, 14, roof, 'slate', { inset: 18 });
    a.planks('#9a6a3a', 5, 19, 38, 15);
    a.f('#2a1a10', 10, 22, 7, 7); a.f('#2a1a10', 21, 22, 7, 7); a.f('#2a1a10', 32, 22, 7, 7);
    a.f(OUT, 3, 29, 42, 2); a.f('#c8925a', 3, 29, 42, 1);
    for (var r = 5; r < 44; r += 4) a.f('#7a5230', r, 30, 1, 4);
    a.f(OUT, 3, 34, 42, 1);
    for (var y = 35; y < 96; y++) {
      var t = (y - 35) / 61, hw = Math.round(14 + t * 4);
      a.f(OUT, 24 - hw - 1, y, hw * 2 + 2, 1);
    }
    for (var y2 = 35, row = 0; y2 < 94; y2 += 5, row++) {
      var hw2 = Math.round(14 + (y2 - 35) / 61 * 4);
      for (var x = 24 - hw2 + (row % 2 ? -2 : 1); x < 24 + hw2; x += 7) {
        var x0 = Math.max(24 - hw2, x), x1 = Math.min(24 + hw2, x + 6);
        a.f('#a8a090', x0, y2, x1 - x0, 4); a.f('#c8c0b0', x0, y2, x1 - x0, 1);
      }
    }
    a.f('#1e1a28', 23, 46, 2, 8); a.f('#1e1a28', 23, 62, 2, 7);
    a.door(18, 81, 'arch');
    a.foundation(5, 93, 38);
    return a.c;
  } };


  // Bakery with a striped awning and a bread sign
  KINDS.bakery = { w: 5, h: 3, door: 1, anim: true, draw: function (o) {
    var a = new Art(80, 48), roof = o.roof || '#b8683a';
    a.chimney(56, 0, 14, '#8a5a44', true, o.frame);
    a.roof(0, 4, 80, 18, roof, 'tile', { inset: 4 });
    a.plaster('#f8ecd0', 3, 20, 74, 28);
    a.win(38, 31, 34, 13, { cross: false });
    [[42, 38], [50, 37], [58, 38], [65, 37]].forEach(function (b) { a.f('#8a4a1a', b[0], b[1] + 2, 6, 3); a.f('#d88a3a', b[0], b[1], 6, 3); a.f('#f0c070', b[0] + 1, b[1], 3, 1); });
    for (var i = 0; i < 38; i++) a.f(((i / 4) | 0) % 2 ? '#fcfcfc' : '#d83a3a', 36 + i, 24, 1, 5);
    for (var j = 0; j < 38; j += 4) { a.f(((j / 4) | 0) % 2 ? '#fcfcfc' : '#d83a3a', 36 + j, 29, 4, 1); a.f(((j / 4) | 0) % 2 ? '#fcfcfc' : '#d83a3a', 37 + j, 30, 2, 1); }
    a.f(OUT, 36, 23, 38, 1);
    a.f(OUT, 31, 22, 1, 10); a.f(OUT, 26, 25, 8, 7); a.f('#f4dca0', 27, 26, 6, 5); a.f('#c07a30', 28, 27, 4, 3);
    a.door(18, 33, 'brown');
    a.foundation(3, 45, 74);
    return a.c;
  } };

  // Market stall: posts, a striped awning and goods on the counter (no door)
  KINDS.stall = { w: 2, h: 2, door: null, draw: function (o) {
    var a = new Art(32, 32), col = o.roof || '#e8b030', goods = o.goods || 'fruit';
    a.f(OUT, 2, 8, 3, 24); a.f('#8a5a30', 3, 8, 1, 24); a.f(OUT, 27, 8, 3, 24); a.f('#8a5a30', 28, 8, 1, 24);
    a.f(OUT, 0, 3, 32, 9);
    for (var i = 0; i < 30; i++) a.f(((i / 5) | 0) % 2 ? '#fcfcfc' : col, 1 + i, 4, 1, 6);
    for (var s = 0; s < 30; s += 5) a.f(((s / 5) | 0) % 2 ? '#fcfcfc' : col, 1 + s + 1, 10, 3, 1);
    a.f(sh(col, 0.3), 1, 4, 30, 1);
    a.box('#a8743e', 1, 20, 30, 11); a.f('#c8925a', 1, 20, 30, 2);
    var palette = { fruit: ['#e03a3a', '#f8c030', '#6ac040', '#f07a2a'], fish: ['#9ab0c8', '#c8d8e8', '#7890a8', '#b0c4d8'], bread: ['#d88a3a', '#f0c070', '#b8682a', '#e8a850'], flowers: ['#f070b0', '#f8e060', '#a070e0', '#ffffff'] }[goods] || ['#e03a3a'];
    for (var g = 0; g < 7; g++) { var gx = 3 + g * 4, gc = palette[g % palette.length]; a.f(sh(gc, -0.4), gx, 17, 4, 3); a.f(gc, gx, 16, 3, 3); a.p(sh(gc, 0.4), gx, 16); }
    return a.c;
  } };

  // Boathouse with big bay doors, a life ring and rope
  KINDS.boathouse = { w: 5, h: 3, door: 1, draw: function (o) {
    var a = new Art(80, 48), roof = o.roof || '#8a3a30';
    a.roof(0, 2, 80, 18, roof, 'slate', { inset: 3 });
    a.planks('#7a5a3e', 3, 18, 74, 30);
    a.f(OUT, 38, 23, 36, 25); a.f('#4a3424', 39, 24, 34, 24);
    for (var i = 0; i < 34; i += 4) a.f('#5e4430', 39 + i, 24, 2, 24);
    a.f('#3a2a1c', 55, 24, 2, 24);
    a.ring(OUT, 30, 29, 5.5); a.ring('#f8f8f8', 30, 29, 4.5, 2); a.f('#e03a3a', 26, 28, 2, 2); a.f('#e03a3a', 32, 28, 2, 2); a.f('#e03a3a', 29, 25, 2, 2); a.f('#e03a3a', 29, 31, 2, 2);
    a.win(8, 25, 9, 7, {});
    a.door(4, 33, 'brown');
    a.foundation(3, 45, 74);
    return a.c;
  } };


  // Floodgate house: small stone hut with a big valve wheel
  KINDS.floodhouse = { w: 3, h: 3, door: 1, draw: function (o) {
    var a = new Art(48, 48), roof = o.roof || '#5a6070';
    a.roof(0, 3, 48, 16, roof, 'slate', { inset: 4 });
    a.stone('#a8a298', 3, 17, 42, 31);
    a.ring(OUT, 40, 26, 6.5, 4); a.ring('#6a7080', 40, 26, 5.5, 4.5);
    a.line('#6a7080', 35, 26, 45, 26, 1); a.line('#6a7080', 40, 21, 40, 31, 1); a.ring('#9aa0b0', 40, 26, 1.5);
    a.door(18, 33, 'brown');
    a.foundation(3, 45, 42);
    return a.c;
  } };

  // Hanging picture sign on a bracket (instead of words)
  A.iconSign = function (name, x, y) {
    this.f(OUT, x, y - 3, 1, 3); this.f(OUT, x + 10, y - 3, 1, 3); this.f(OUT, x - 3, y - 4, 17, 2);
    this.f(OUT, x - 1, y - 1, 13, 12); this.f('#f4ecd8', x, y, 11, 10);
    if (PK.drawIcon) PK.drawIcon(this, name, x - 1, y);
  };

  // The big watermill: stone ground floor, timber loft, steep tiled roof, turning wheel on the right
  KINDS.mill = { w: 7, h: 6, door: 1, anim: true, draw: function (o) {
    var a = new Art(112, 96), roof = o.roof || '#9a4a34', fr = o.frame || 0;
    var cx = 86, cy = 64, R = 20, ang = fr * Math.PI / 12;
    a.f('#5a5650', 64, 58, 8, 36); a.f('#7a766e', 65, 58, 3, 36);
    a.ring(OUT, cx, cy, R + 1.5, R - 3.5);
    a.ring('#7a5230', cx, cy, R, R - 2.5);
    a.ring('#a8743e', cx, cy, R, R - 1);
    a.ring('#7a5230', cx, cy, R - 7, R - 9);
    for (var s = 0; s < 8; s++) {
      var t = ang + s * Math.PI / 4;
      a.line(OUT, cx + Math.cos(t) * 3, cy + Math.sin(t) * 3, cx + Math.cos(t) * (R - 1), cy + Math.sin(t) * (R - 1), 3);
      a.line('#9a6a38', cx + Math.cos(t) * 3, cy + Math.sin(t) * 3, cx + Math.cos(t) * (R - 1), cy + Math.sin(t) * (R - 1), 1);
    }
    for (var pd = 0; pd < 12; pd++) {
      var u = ang + pd * Math.PI / 6 + 0.13, px0 = cx + Math.cos(u) * (R - 1), py0 = cy + Math.sin(u) * (R - 1);
      a.line(OUT, px0, py0, cx + Math.cos(u) * (R + 3), cy + Math.sin(u) * (R + 3), 3);
      a.line('#c8925a', px0, py0, cx + Math.cos(u) * (R + 2.5), cy + Math.sin(u) * (R + 2.5), 1);
    }
    a.ring(OUT, cx, cy, 4); a.ring('#5a5a64', cx, cy, 3); a.p('#9aa0b0', cx - 1, cy - 1);
    a.f(OUT, 64, 62, 20, 4); a.f('#5a5a64', 64, 63, 20, 2);
    for (var w = 0; w < 8; w++) {
      var wx = 70 + w * 4 + (fr % 2), wy = 84 + ((w * 5 + fr * 3) % 8);
      a.f('#d8f0ff', wx, wy, 2, 1); a.f('#84c2f8', wx + 1, wy + 1, 2, 1);
    }
    // wooden flume carrying water onto the wheel
    a.f(OUT, 70, 36, 42, 6); a.f('#8a5a30', 71, 37, 40, 4); a.f('#6cb4ea', 71, 37, 40, 2);
    a.f('#d8f0ff', 72 + (fr * 5) % 30, 37, 5, 1);
    a.roof(0, 6, 64, 32, roof, 'tile', { inset: 9 });
    a.box('#6a4428', 26, 10, 12, 12); a.f('#3a2414', 28, 12, 8, 9);
    a.line('#5a3a20', 32, 8, 32, 3, 2); a.line('#5a3a20', 32, 3, 42, 3, 2); a.line('#c8b890', 41, 4, 41, 12, 1);
    a.f('#e8dcc0', 38, 12, 6, 4); a.p('#b89040', 40, 13);
    a.timber('#efe6d2', '#5e3a20', 3, 36, 58, 24);
    a.win(10, 43, 11, 9, { shutters: '#5a7a4a', box: true });
    a.win(42, 43, 11, 9, { shutters: '#5a7a4a', box: true });
    a.stone('#b0a898', 3, 59, 58, 37);
    a.win(42, 70, 12, 9, { dark: true });
    a.iconSign('wheat', 33, 67);
    a.door(18, 81, 'arch');
    a.foundation(3, 93, 58);
    return a.c;
  } };

  // Brick schoolhouse with a bell cupola and a book sign
  KINDS.school = { w: 6, h: 4, door: 2, draw: function (o) {
    var a = new Art(96, 64), roof = o.roof || '#3e6e4e';
    a.roof(0, 8, 96, 24, roof, 'slate');
    a.f(OUT, 39, 0, 18, 12); a.f('#f4f0e4', 40, 1, 16, 11);
    a.f('#3a2a2a', 43, 3, 10, 8); a.ring('#e8b840', 48, 7, 3.2); a.f('#c89020', 46, 9, 5, 1);
    a.f(OUT, 37, 0, 22, 1); a.f(sh(roof, 0.2), 37, -1, 22, 2);
    a.brick('#b85a48', 3, 30, 90, 34);
    a.f('#f4f0e4', 3, 30, 90, 3);
    a.win(8, 38, 10, 13, { box: true }); a.win(54, 38, 10, 13, { box: true }); a.win(70, 38, 10, 13, { box: true });
    a.iconSign('book', 23, 40);
    a.f(OUT, 83, 36, 8, 22); a.f('#3a2a2a', 84, 37, 6, 20); a.f('#f4f0e4', 85, 38, 4, 3);
    a.door(34, 49, 'blue');
    a.foundation(3, 61, 90);
    return a.c;
  } };

  // Riverside research station: capsule emblem, aquarium dome, dish, greenhouse wing on stilts over the water
  KINDS.rivlab = { w: 8, h: 5, door: 2, anim: true, draw: function (o) {
    var a = new Art(128, 80), trim = o.roof || '#2e9a9a', fr = o.frame || 0;
    // stilts and jetty under the greenhouse
    [84, 98, 112, 124].forEach(function (x) { a.f(OUT, x - 1, 60, 4, 20); a.f('#6a4424', x, 60, 2, 20); });
    a.f(OUT, 80, 70, 48, 5); a.f('#a8743e', 80, 71, 48, 3); a.f('#c8925a', 80, 71, 48, 1);
    a.f('#d8f0ff', 86 + fr * 6, 78, 5, 1);
    // greenhouse wing
    a.f(OUT, 79, 30, 48, 32); a.f('#a8dce0', 80, 31, 46, 30);
    for (var gx = 80; gx < 126; gx += 9) a.f('#3a6a5a', gx, 31, 1, 30);
    a.f('#3a6a5a', 80, 44, 46, 1);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(77, 32); a.x.lineTo(103, 16); a.x.lineTo(129, 32); a.x.fill();
    a.x.fillStyle = '#c0ecf0'; a.x.beginPath(); a.x.moveTo(80, 31); a.x.lineTo(103, 18); a.x.lineTo(126, 31); a.x.fill();
    a.line('#3a6a5a', 103, 18, 103, 31, 1); a.line('#3a6a5a', 91, 24, 91, 31, 1); a.line('#3a6a5a', 115, 24, 115, 31, 1);
    [[84, '#4caa46'], [93, '#6ac05a'], [102, '#3a8a3a'], [111, '#4caa46'], [120, '#6ac05a']].forEach(function (p, i) { a.f(p[1], p[0], 48 - (i % 2) * 4, 5, 12 + (i % 2) * 4); a.p('#f070b0', p[0] + 2, 47 - (i % 2) * 4); });
    a.f('#fcfcfc', 82, 33, 2, 8);
    // aquarium dome and dish on the main roof
    var dcx = 52, dcy = 21, dr = 13;
    for (var y = dcy - dr - 1; y <= dcy; y++) for (var x = dcx - dr - 1; x <= dcx + dr + 1; x++) {
      var d = Math.hypot(x + 0.5 - dcx, y + 0.5 - dcy);
      if (d > dr + 1) continue;
      a.p(d > dr ? OUT : y > dcy - 6 ? '#3a8ad0' : y === dcy - 6 ? '#b8ecff' : '#a8def4', x, y);
    }
    var fx = 46 + fr * 3; a.f('#e8a040', fx, 17, 6, 3); a.f('#e8a040', fx + 6, 18, 2, 1); a.p(OUT, fx + 1, 18);
    a.f('#ffffff', 44, 10, 2, 3);
    a.line(OUT, 18, 20, 18, 8, 2); a.ring(OUT, 16, 8, 6); a.ring('#e8e8ec', 16, 8, 5); a.ring('#b8bcc8', 17, 7, 2); a.line(OUT, 16, 8, 22, 3, 1); a.p('#d83a3a', 22, 3);
    // main block
    a.f(OUT, 1, 20, 78, 12); a.f(trim, 2, 21, 76, 10); a.f(sh(trim, 0.3), 2, 21, 76, 2); a.f(sh(trim, -0.3), 2, 29, 76, 2);
    a.plaster('#f6f8fa', 3, 31, 74, 49);
    a.win(8, 42, 20, 12, {}); a.win(52, 42, 20, 12, {});
    // capsule emblem over the door
    // Kit Capsule emblem (the game's own pill-shaped capsule, teal over white)
    a.f(OUT, 35, 15, 11, 22); a.f(OUT, 34, 16, 13, 20);
    a.f('#2fb3a0', 35, 16, 11, 9); a.f('#6ad8c8', 36, 17, 2, 6);
    a.f('#f4f4f0', 35, 27, 11, 8); a.f('#c8c8d0', 43, 27, 2, 7);
    a.f('#5a6070', 34, 24, 13, 3); a.f('#9aa0b0', 39, 24, 3, 3);
    a.door(34, 65, 'glass');
    a.foundation(3, 77, 74);
    return a.c;
  } };

  // Log cabin for the Willow Trail ranger
  KINDS.cabin = { w: 4, h: 3, door: 1, anim: true, draw: function (o) {
    var a = new Art(64, 48), roof = o.roof || '#3e6e3e';
    a.chimney(46, 0, 14, '#7a6a5a', true, o.frame);
    a.roof(0, 3, 64, 20, roof, 'slate', { inset: 4 });
    a.f(OUT, 2, 21, 60, 27);
    for (var y = 22; y < 46; y += 4) { a.f('#8a5a30', 3, y, 58, 4); a.f('#a8743e', 3, y, 58, 1); a.f('#6a4424', 3, y + 3, 58, 1); a.ring('#c8925a', 3, y + 2, 1.5); a.ring('#c8925a', 61, y + 2, 1.5); }
    a.win(38, 27, 12, 10, { shutters: '#3e6e3e' });
    a.iconSign('paw', 38, 5);
    a.door(18, 33, 'green');
    a.foundation(3, 45, 58);
    return a.c;
  } };

  // Treehouse: a hut in the branches of a huge tree, rope ladder at the bottom
  KINDS.treehouse = { w: 4, h: 5, door: 1, anim: true, draw: function (o) {
    var a = new Art(64, 80), fr = o.frame || 0;
    var R = PK.color.ramp, pg = new PK.PG(64, 80);
    pg.rect(18, 40, 16, 40, 1, { hgrad: 1 });
    pg.line(26, 44, 6, 36, 1, 3, 2); pg.line(28, 42, 56, 34, 1, 3, 2);
    pg.ellipse(32, 18, 30, 18, 0); pg.ellipse(12, 26, 12, 10, 0, { bias: -0.05 }); pg.ellipse(52, 26, 12, 10, 0, { bias: -0.05 });
    a.x.drawImage(pg.render([R('#3e9a4a'), R('#7a5230')]), 0, 0);
    a.f(OUT, 10, 34, 44, 3); a.f('#a8743e', 11, 35, 42, 1);
    a.f(OUT, 14, 18, 36, 17); a.f('#b8864e', 15, 19, 34, 15);
    for (var x = 15; x < 49; x += 4) a.f('#8a5a30', x + 3, 19, 1, 15);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(11, 20); a.x.lineTo(32, 6); a.x.lineTo(53, 20); a.x.fill();
    a.x.fillStyle = '#c85a3a'; a.x.beginPath(); a.x.moveTo(14, 19); a.x.lineTo(32, 8); a.x.lineTo(50, 19); a.x.fill();
    a.win(36, 23, 9, 8, {});
    a.f('#e84848', 52, 8 + fr, 7, 4); a.f(OUT, 51, 6, 1, 12);
    // rope ladder down to the door tile
    a.line('#c8a060', 21, 36, 21, 80, 1); a.line('#c8a060', 27, 36, 27, 80, 1);
    for (var y = 40; y < 80; y += 5) a.f('#8a5a30', 21, y, 7, 2);
    a.f(OUT, 20, 22, 10, 13); a.f('#5a3a22', 21, 23, 8, 12);
    return a.c;
  } };

  var cache = {};
  // Shared renderer for custom buildings and props (anything in PK.BUILDINGS with a draw function)
  function draw(kind, opts) {
    var K = PK.BUILDINGS[kind];
    var fr = K.anim ? (opts.frame || 0) : 0;
    var w = opts.w || K.w, h = opts.h || K.h;
    var key = [kind, opts.roof, opts.goods, w, h, opts.color, opts.icon, opts.art, opts.variant, fr].join('|');
    if (!cache[key]) cache[key] = K.draw(Object.assign({}, opts, { frame: fr, w: w, h: h }));
    return cache[key];
  }

  Object.keys(KINDS).forEach(function (k) { KINDS[k].custom = true; PK.BUILDINGS[k] = KINDS[k]; });
  PK.buildings2 = { draw: draw, KINDS: KINDS, Art: Art, OUT: OUT };
})();
