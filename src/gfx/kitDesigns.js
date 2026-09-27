// Hand-authored Kit designs (v2). Every design has its own draw function: no shared body templates.
// Design space is 64x64 with the ground at y = 62; the back view is the same design drawn larger with d.back set.
(function () {
  'use strict';
  var PK = window.PK;
  var C = function () { return PK.color; };

  var FLAME = ['#b8321a', '#ec6a28', '#f8a43a', '#ffd860', '#fff6c8'];
  var STD = {
    ink: '=#1c1424', white: '=#ffffff', shine: '=#ffffff', mouth: '=#5a1a26', cheek: '=#f48aa0',
    tongue: '=#e86a7a', flame: FLAME
  };

  // Drawing context for one design render.
  function D(pal, view, opts) {
    opts = opts || {};
    this.back = view === 'back';
    this.icon = view === 'icon';
    this.cw = this.back ? 84 : this.icon ? 32 : 64;
    this.s = this.back ? 1.3 : this.icon ? 0.5 : 1;
    this.g = new PK.PG(this.cw, this.cw);
    this.g.lx = -0.4; this.g.ly = -0.65;
    this.names = {};
    this.pal = [];
    this.float = false;
    var all = Object.assign({}, STD, pal);
    for (var k in all) this.addMat(k, all[k], opts);
    this.rnd = PK.seeded(PK.hash(opts.seed || 'kit'));
  }
  var P = D.prototype;
  P.addMat = function (name, v, opts) {
    var col = v;
    if (typeof v === 'string' && v[0] === '=') col = v.slice(1);
    else if (typeof v === 'string') {
      var base = v;
      if (opts.prism && opts.keep.indexOf(name) < 0) base = C().hueRotate(base, opts.prismHue || 150, 1.05, 0.03);
      if (opts.tint) base = PK.kitArt.tintColor(base, opts.tint, 0);
      col = C().ramp(base);
    }
    this.names[name] = this.pal.length;
    this.pal.push(col);
  };
  P.m = function (name) {
    var i = this.names[name];
    if (i == null) throw new Error('Unknown design material: ' + name);
    return i;
  };
  P.X = function (x) { return this.cw / 2 + (x - 32) * this.s; };
  P.Y = function (y) { return (this.cw - 2) - (62 - y) * this.s; };
  P.L = function (v) { return v * this.s; };
  P.o = function (o) {
    if (!o || !o.clip) return o;
    var self = this, f = o.clip;
    return Object.assign({}, o, { clip: function (x, y) { return f((x + 0.5 - self.cw / 2) / self.s + 32, 62 - ((self.cw - 2) - (y + 0.5)) / self.s); } });
  };
  P.el = function (x, y, rx, ry, m, o) { this.g.ellipse(this.X(x), this.Y(y), this.L(rx), this.L(ry), this.m(m), this.o(o)); };
  P.ln = function (x0, y0, x1, y1, m, r0, r1, o) { this.g.line(this.X(x0), this.Y(y0), this.X(x1), this.Y(y1), this.m(m), this.L(r0), this.L(r1 == null ? r0 : r1), this.o(o)); };
  P.cv = function (x0, y0, cx, cy, x1, y1, m, r0, r1, o) { this.g.curve(this.X(x0), this.Y(y0), this.X(cx), this.Y(cy), this.X(x1), this.Y(y1), this.m(m), this.L(r0), this.L(r1 == null ? r0 : r1), this.o(o)); };
  P.po = function (pts, m, o) {
    var self = this;
    this.g.poly(pts.map(function (p) { return [self.X(p[0]), self.Y(p[1])]; }), this.m(m), this.o(o));
  };
  P.rc = function (x, y, w, h, m, o) { this.po([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], m, o); };
  // Single design-space pixel (scaled to a block on the back view)
  P.px = function (x, y, m, l) {
    var mi = this.m(m), n = Math.max(1, Math.round(this.s));
    for (var a = 0; a < n; a++) for (var b = 0; b < n; b++) this.g.put(Math.round(this.X(x)) + a, Math.round(this.Y(y)) + b, mi, l == null ? 0.62 : l);
  };
  // Erase everything inside an ellipse (for rings, holes)
  P.cut = function (x, y, rx, ry) {
    var X = this.X(x), Y = this.Y(y), RX = this.L(rx), RY = this.L(ry);
    for (var yy = Math.floor(Y - RY); yy <= Math.ceil(Y + RY); yy++)
      for (var xx = Math.floor(X - RX); xx <= Math.ceil(X + RX); xx++) {
        var dx = (xx + 0.5 - X) / RX, dy = (yy + 0.5 - Y) / RY;
        if (dx * dx + dy * dy <= 1) this.g.clear(xx, yy);
      }
  };
  // Scatter texture pixels of `m` over existing pixels of material `on`
  P.speckle = function (on, m, n, x0, y0, x1, y1, l) {
    var mo = this.m(on), mi = this.m(m);
    for (var k = 0; k < n; k++) {
      var x = Math.round(this.X(x0 + this.rnd() * (x1 - x0))), y = Math.round(this.Y(y0 + this.rnd() * (y1 - y0)));
      var i = y * this.g.w + x;
      if (x >= 0 && y >= 0 && x < this.g.w && y < this.g.h && this.g.mat[i] === mo) { this.g.mat[i] = mi; if (l != null) this.g.lit[i] = l; }
    }
  };
  // Eye: dark rim, white, shaded iris, pupil, shine. o: {iris, look:[dx,dy], slit, lid (0..1 covers top), small}
  P.eye = function (x, y, rx, ry, o) {
    o = o || {};
    if (this.back) return;
    var lk = o.look || [-0.25, 0];
    if (o.small || this.L(rx) < 2) {
      this.el(x, y, rx, ry, 'ink');
      this.px(x - rx * 0.35, y - ry * 0.4, 'shine');
      return;
    }
    this.el(x, y, rx + 0.7, ry + 0.7, 'ink');
    this.el(x, y, rx, ry, 'white');
    var ix = x + lk[0] * rx * 0.35, iy = y + lk[1] * ry * 0.3 + ry * 0.08;
    this.el(ix, iy, rx * 0.72, ry * 0.8, o.iris || 'iris', { bias: 0.05 });
    if (o.slit) this.el(ix, iy, Math.max(0.6, rx * 0.2), ry * 0.66, 'ink');
    else this.el(ix, iy + ry * 0.05, rx * 0.4, ry * 0.46, 'ink');
    this.px(ix - rx * 0.32, iy - ry * 0.38, 'shine');
    if (rx >= 3) this.px(ix + rx * 0.22, iy + ry * 0.3, 'shine');
    if (o.lid) this.el(x, y - ry * (1 - o.lid), rx + 0.8, ry * o.lid, o.lidMat || 'ink');
  };
  // Teardrop flame pointing along (dx, dy) from its base at (x, y)
  P.flame = function (x, y, len, w, dx, dy) {
    var n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
    var px = -dy, py = dx, tx = x + dx * len, ty = y + dy * len;
    this.po([[x + px * w, y + py * w], [x + dx * len * 0.45 + px * w * 0.8, y + dy * len * 0.45 + py * w * 0.8], [tx, ty], [x + dx * len * 0.45 - px * w * 0.8, y + dy * len * 0.45 - py * w * 0.8], [x - px * w, y - py * w], [x - dx * w * 0.7, y - dy * w * 0.7]], 'flame', { light: 0.42 });
    this.el(x + dx * len * 0.22, y + dy * len * 0.22, w * 0.62, w * 0.62, 'flame', { light: 0.9 });
    this.el(x + dx * len * 0.12, y + dy * len * 0.12, w * 0.32, w * 0.32, 'flame', { light: 1.1 });
  };
  P.render = function () {
    return this.g.render(this.pal, { dither: 0.45 });
  };

  // ------------------------------------------------------------------ designs
  var DESIGNS = {};

  // ===== Blaze starter line: eggshell hatchling -> shell-armored drakeling -> sun dragon =====
  DESIGNS.emberlet = {
    pal: { body: '#e85a36', belly: '#f8d6a0', shell: '#f2e8d2', speck: '#c8b48a', horn: '#f6e4b8', iris: '#e8a020' },
    draw: function (d) {
      // tail curling out of the shell
      d.cv(42, 54, 54, 54, 52, 44, 'body', 2.6, 1.2);
      d.po([[50, 45], [52, 40], [55, 44]], 'horn');
      // body and head
      d.el(32, 46, 11, 9, 'body');
      d.el(32, 31, 12.5, 11, 'body');
      d.el(32, 36, 8, 5, 'belly', { clip: function (x, y) { return y > 33; } });
      // nub horns and head flame
      d.po([[25, 23], [22, 16], [29, 21]], 'horn', { edge: true });
      d.po([[36, 21], [41, 15], [40, 23]], 'horn', { edge: true });
      if (!d.back) {
        d.eye(27, 30, 3.4, 4, { look: [-0.3, 0.1] });
        d.eye(37, 30, 3.4, 4, { look: [-0.3, 0.1] });
        d.px(24, 35, 'cheek'); d.px(25, 35, 'cheek'); d.px(40, 35, 'cheek'); d.px(39, 35, 'cheek');
        d.px(30, 36, 'mouth'); d.px(31, 37, 'mouth'); d.px(32, 37, 'mouth'); d.px(33, 36, 'mouth');
        d.px(31, 38, 'tongue');
      } else {
        d.el(32, 28, 6, 4, 'body', { bias: 0.15 });
      }
      d.flame(32, 21, 9, 3.2, 0.15, -1);
      // cracked eggshell with a zigzag rim
      d.po([[18, 49], [21, 44], [24, 48], [27, 43], [30, 47], [33, 42], [36, 47], [39, 43], [42, 48], [45, 44], [46.5, 49],
        [46, 53], [44, 57.5], [40, 61], [32, 62.5], [24, 61], [20, 57.5], [18, 53]], 'shell', { edge: true });
      d.speckle('shell', 'speck', 14, 19, 48, 45, 61, 0.55);
      // little arms resting on the rim
      d.el(21.5, 46.5, 3, 2.6, 'body', { edge: true });
      d.el(42.5, 46.5, 3, 2.6, 'body', { edge: true });
      d.px(19.5, 47, 'horn'); d.px(20.5, 48, 'horn'); d.px(44.5, 47, 'horn'); d.px(43.5, 48, 'horn');
    }
  };

  DESIGNS.shardrake = {
    pal: { body: '#d2402c', belly: '#f4c688', shell: '#efe4cc', speck: '#c4b088', wing: '#f29a3c', horn: '#f4e0b0', iris: '#f0b428' },
    draw: function (d) {
      // wing buds and tail behind
      d.po([[38, 29], [45, 13], [49, 15], [48.5, 20], [53, 21], [49.5, 25], [51.5, 29], [44, 32]], 'wing');
      d.ln(38, 29, 45, 13, 'body', 1.1, 0.5); d.ln(40, 29, 53, 21, 'body', 0.8, 0.4);
      d.cv(40, 50, 55, 56, 58, 42, 'body', 4, 1.5);
      d.po([[56, 44], [58, 35], [61, 40], [59.5, 45]], 'shell', { edge: true });
      // legs
      d.el(38.5, 50, 5.5, 7, 'body', { bias: -0.08 });
      d.el(40, 59.5, 5.5, 2.6, 'body', { bias: -0.12 });
      d.el(26, 50, 6, 7.5, 'body');
      d.el(24, 59.5, 6, 2.8, 'body');
      d.px(19, 60, 'horn'); d.px(21.5, 61, 'horn'); d.px(35, 60, 'horn');
      // torso and belly plates
      d.el(32, 40, 11, 13, 'body');
      d.el(30, 43, 7, 10, 'belly', { clip: function (x, y) { return y > 34; } });
      for (var i = 0; i < 4; i++) d.ln(24.5, 37 + i * 3.6, 35.5, 37 + i * 3.6, 'belly', 0.35, 0.35, { light: 0.3 });
      // shell pauldron on the far shoulder
      d.po([[35, 26], [45, 27], [47, 33], [44.5, 35], [42.5, 33], [40.5, 36], [38, 33], [35, 34]], 'shell', { edge: true });
      // arms
      d.ln(24, 33, 19.5, 40, 'body', 2.8, 2.2, { edge: true });
      d.el(19, 41, 2.8, 2.6, 'body', { edge: true });
      d.px(16.5, 42, 'horn'); d.px(17.5, 43.5, 'horn');
      // neck, head, snout
      d.ln(31, 30, 29, 22, 'body', 5.5, 5);
      d.el(29, 20, 9, 8, 'body');
      d.el(20.5, 23.5, 7.5, 4.8, 'body');
      d.el(20, 26, 6, 2.3, 'belly', { clip: function (x, y) { return y > 25; } });
      d.po([[34, 17], [44, 11], [37, 21]], 'horn', { edge: true });
      if (!d.back) {
        d.eye(25.5, 20.5, 2.5, 2.9, { look: [-0.5, 0], lid: 0.2, lidMat: 'body' });
        d.eye(31.5, 20, 2.2, 2.7, { look: [-0.5, 0], lid: 0.2, lidMat: 'body' });
        d.px(14.5, 23, 'ink'); d.px(16.5, 23, 'ink');
        d.ln(14, 26, 21, 26.5, 'mouth', 0.4);
        d.px(18, 27, 'white');
      }
      // eggshell helmet with a cracked rim, flame crest streaming back
      d.flame(32, 11, 13, 3.2, 0.75, -0.6);
      d.el(30, 14, 8.5, 5.5, 'shell', { clip: function (x, y) { return y < 15; }, edge: true });
      [[23, 14.5, 1.4], [26.5, 15, 2.2], [30, 14.8, 1.2], [33.5, 15, 2.4], [37, 14.2, 1.3]].forEach(function (p) { d.po([[p[0] - 1.5, p[1] - 0.6], [p[0], p[1] + p[2]], [p[0] + 1.5, p[1] - 0.6]], 'shell'); });
      d.ln(27, 10, 29, 13, 'speck', 0.35); d.ln(29, 13, 28, 14.5, 'speck', 0.35);
      d.speckle('shell', 'speck', 8, 22, 9, 38, 15, 0.55);
    }
  };

  DESIGNS.halorax = {
    pal: { body: '#b22c2a', belly: '#f0ae66', gold: '#e8b43a', halo: '#ffd24a', wing: '#ee7a2c', horn: '#f4e2b4', iris: '#ffcc30' },
    draw: function (d) {
      // sun halo with rays behind the head
      for (var r = 0; r < 12; r++) {
        var a = r * Math.PI / 6 + 0.26, cx = 20, cy = 19;
        d.po([[cx + Math.cos(a - 0.12) * 12, cy + Math.sin(a - 0.12) * 12], [cx + Math.cos(a) * (r % 2 ? 16 : 18), cy + Math.sin(a) * (r % 2 ? 16 : 18)], [cx + Math.cos(a + 0.12) * 12, cy + Math.sin(a + 0.12) * 12]], 'halo', { light: 0.95 });
      }
      d.el(20, 19, 13, 13, 'halo', { light: 0.85 });
      d.cut(20, 19, 10.5, 10.5);
      // far wing, then near wing
      d.po([[38, 30], [44, 6], [52, 2], [62, 4], [58, 12], [63, 16], [56, 22], [48, 30]], 'wing', { bias: -0.1 });
      d.ln(38, 30, 52, 2, 'body', 1.3, 0.7); d.ln(44, 26, 62, 4, 'body', 0.9, 0.5); d.ln(46, 28, 63, 16, 'body', 0.9, 0.5);
      // tail ending in a small sun disc
      d.cv(52, 46, 63, 50, 58, 58, 'body', 4.5, 1.8);
      d.el(56.5, 58, 3.2, 3.2, 'halo', { light: 0.9, edge: true });
      // hind legs
      d.el(48, 50, 7.5, 8.5, 'body', { bias: -0.05 });
      d.ln(49, 55, 47, 60.5, 'body', 3.2, 2.6);
      d.el(45.5, 61, 5, 2, 'body');
      // body with belly and gold chest plates
      d.el(39, 44, 15, 11, 'body');
      d.el(38, 50, 12, 4.5, 'belly', { clip: function (x, y) { return y > 48; } });
      // near wing over the shoulder
      d.po([[34, 32], [36, 12], [42, 8], [48, 10], [46, 18], [52, 20], [46, 28], [40, 34]], 'wing', { edge: true });
      d.ln(34, 32, 42, 8, 'body', 1.2, 0.6); d.ln(38, 30, 48, 10, 'body', 0.9, 0.5); d.ln(40, 32, 52, 20, 'body', 0.9, 0.5);
      // front legs
      d.ln(31, 49, 32, 60, 'body', 3.4, 2.8, { bias: -0.12 });
      d.el(31, 61, 4.5, 1.8, 'body', { bias: -0.12 });
      d.ln(25, 47, 23, 60, 'body', 4, 3.2, { edge: true });
      d.el(21.5, 61, 5.2, 2, 'body');
      d.px(17.5, 61, 'horn'); d.px(19.5, 62, 'horn'); d.px(27.5, 61, 'horn');
      // flame mane along the back of the neck, then neck and gold breastplate
      [[25, 19, 11], [28, 24, 12], [31, 29, 11], [34, 34, 9]].forEach(function (p) { d.flame(p[0], p[1], p[2], 2.4, 0.55, -0.85); });
      d.ln(31, 40, 22, 26, 'body', 7.5, 5);
      d.po([[17, 30], [24, 31], [29, 37], [31, 45], [27, 50], [21.5, 46], [19, 38]], 'gold', { edge: true });
      d.ln(20, 34, 26, 35.5, 'gold', 0.4, 0.4, { light: 0.95 });
      d.ln(21, 39.5, 28.5, 41, 'gold', 0.4, 0.4, { light: 0.95 });
      d.ln(23, 44.5, 29, 45.5, 'gold', 0.4, 0.4, { light: 0.95 });
      d.el(22.5, 37, 1.3, 1.3, 'halo', { light: 1.05 });
      // head, long snout, horns
      d.el(19, 23, 8, 6.5, 'body');
      d.el(10.5, 26, 7.5, 4, 'body');
      d.el(10, 28.5, 6, 1.8, 'belly', { clip: function (x, y) { return y > 27.5; } });
      d.ln(22, 18, 34, 9, 'horn', 2.1, 0.5, { edge: true });
      d.ln(19, 18, 27, 7, 'horn', 1.7, 0.4, { edge: true });
      if (!d.back) {
        d.eye(17, 21.5, 2.4, 1.9, { slit: true, look: [-0.6, 0], lid: 0.35, lidMat: 'body' });
        d.ln(13.5, 19.5, 20, 19, 'ink', 0.5);
        d.px(4.5, 25, 'ink'); d.px(6.5, 24.5, 'ink');
        d.ln(4, 28.5, 16, 28.5, 'mouth', 0.4);
        d.px(9, 29.5, 'white'); d.px(13, 29.5, 'white');
      }
    }
  };

  // ===== Tide starter line: shell-hat ink sprite -> rune reef squid -> shipwreck kraken =====
  DESIGNS.conchi = {
    pal: { body: '#5a68d6', belly: '#b6c2ff', shell: '#f4c4a8', shelld: '#c8846a', shellin: '#ff9eb4', glow: '=#8ef4ff', iris: '#3a2a6a' },
    draw: function (d) {
      // short tentacles
      [[24, 50, 20, 59, 23, 61], [28, 51, 27, 58, 24, 60.5], [32, 51, 33, 58, 30, 61], [36, 51, 38, 58, 40, 60.5], [40, 50, 44, 57, 42, 61]].forEach(function (t, i) {
        d.cv(t[0], t[1], t[2], t[3], t[4], t[5], 'body', 2.3, 1, { bias: i % 2 ? -0.06 : 0 });
      });
      d.el(32, 43, 11.5, 9.5, 'body');
      d.el(32, 48, 8, 4, 'belly', { clip: function (x, y) { return y > 46; } });
      if (!d.back) {
        d.eye(27, 43, 3.6, 4.2, { iris: 'iris', look: [-0.2, 0.1] });
        d.eye(37.5, 43, 3.6, 4.2, { iris: 'iris', look: [-0.2, 0.1] });
        d.px(31, 48, 'mouth'); d.px(32, 49, 'mouth'); d.px(33, 48, 'mouth');
        d.px(22, 47, 'cheek'); d.px(42, 47, 'cheek');
      }
      d.px(21.5, 41, 'glow'); d.px(22.5, 44, 'glow'); d.px(42.5, 41, 'glow'); d.px(41.5, 44, 'glow');
      // conch shell worn as a hat
      d.po([[20, 36], [26, 26], [36, 20], [45, 12], [47.5, 16], [45, 26], [44, 36]], 'shell', { edge: true });
      d.cv(24, 34, 33, 25, 42, 30, 'shelld', 0.6, 0.6, { light: 0.45 });
      d.cv(30, 26, 38, 20, 44, 22, 'shelld', 0.55, 0.55, { light: 0.45 });
      d.cv(38, 18, 42, 15, 46, 16, 'shelld', 0.5, 0.5, { light: 0.45 });
      d.po([[44, 13], [48, 7], [48, 15]], 'shell', { edge: true });
      [[25, 31], [31, 26.5], [37, 23], [42, 19], [45.5, 15.5]].forEach(function (p, i) { d.el(p[0], p[1], 1.6 - i * 0.2, 1.4 - i * 0.2, 'shell', { edge: true, bias: 0.1 }); });
      d.el(32, 36, 12.5, 2.4, 'shellin', { edge: true });
    }
  };

  DESIGNS.glyphsquid = {
    float: true,
    pal: { body: '#3a48b4', belly: '#8aa0f0', fin: '#4ac0d4', glow: '=#7af6ff', iris: '#f8c83a', sucker: '#c4ccff' },
    draw: function (d) {
      // long arms with club tips
      d.cv(25, 46, 12, 54, 8, 44, 'body', 2.2, 1.2, { bias: -0.05 });
      d.el(8, 43, 2.8, 2.4, 'body', { bias: -0.05 });
      d.cv(39, 46, 52, 54, 56, 44, 'body', 2.2, 1.2, { bias: -0.05 });
      d.el(56, 43, 2.8, 2.4, 'body', { bias: -0.05 });
      [[24, 47, 19, 55, 22, 61], [28, 48, 29, 55, 25, 60], [32, 48, 34, 56, 31, 61.5], [36, 48, 36, 55, 40, 60], [40, 47, 45, 54, 42, 61]].forEach(function (t) {
        d.cv(t[0], t[1], t[2], t[3], t[4], t[5], 'body', 2.4, 0.9);
      });
      [[21, 57], [25.5, 56], [33, 57], [37, 56], [43.5, 57]].forEach(function (p) { d.px(p[0], p[1], 'sucker'); });
      // fins, mantle, head
      d.po([[24, 20], [11, 10], [15, 22], [23, 30]], 'fin', { edge: true });
      d.po([[40, 20], [53, 10], [49, 22], [41, 30]], 'fin', { edge: true });
      d.po([[23, 22], [32, 2], [41, 22], [41, 34], [23, 34]], 'body');
      d.el(32, 26, 9.5, 10, 'body');
      d.el(32, 40, 11, 7.5, 'body');
      d.el(32, 44, 7, 3, 'belly', { clip: function (x, y) { return y > 43; } });
      // rune markings
      d.ln(32, 9, 32, 17, 'glow', 0.5); d.ln(29.5, 12, 34.5, 12, 'glow', 0.5);
      d.ln(27, 22, 27, 29, 'glow', 0.5); d.ln(27, 25, 29.5, 27, 'glow', 0.5);
      d.ln(37, 22, 37, 29, 'glow', 0.5); d.ln(37, 25, 34.5, 27, 'glow', 0.5);
      d.px(32, 31, 'glow'); d.px(31, 32, 'glow'); d.px(33, 32, 'glow');
      if (!d.back) {
        d.eye(27, 39.5, 3, 3.2, { look: [-0.3, 0.1], lid: 0.3, lidMat: 'body' });
        d.eye(37, 39.5, 3, 3.2, { look: [-0.3, 0.1], lid: 0.3, lidMat: 'body' });
      }
    }
  };

  DESIGNS.galleoth = {
    pal: { body: '#4a4494', under: '#cc9ce0', glow: '=#58f0dc', wood: '#94603a', woodd: '#5e3a22', cloth: '#e8dcc2', metal: '#9aa2b0', lamp: '=#ffe27a' },
    draw: function (d) {
      // raised background tentacles, one gripping an old anchor
      d.cv(14, 40, 1, 28, 8, 14, 'body', 4, 1.4, { bias: -0.12 });
      d.cv(50, 40, 63, 28, 57, 14, 'body', 4, 1.4, { bias: -0.12 });
      d.ln(8, 4, 8, 18, 'metal', 0.9);
      d.el(8, 3, 1.8, 1.8, 'metal'); d.cut(8, 3, 0.7, 0.7);
      d.ln(5, 7, 11, 7, 'metal', 0.6);
      d.cv(3, 15, 8, 21, 13, 15, 'metal', 0.8, 0.8);
      d.po([[2, 13], [4.5, 15.5], [2, 16.5]], 'metal'); d.po([[14, 13], [11.5, 15.5], [14, 16.5]], 'metal');
      // mast, yard and tattered sail rising from the crown
      d.ln(33, 16, 34, 0, 'woodd', 1.3, 1);
      d.ln(25, 3.5, 43, 2.5, 'woodd', 0.8);
      d.po([[26, 4], [42, 3.3], [41, 10], [38.5, 8.5], [36, 12], [33, 9.5], [30, 12], [27.5, 9]], 'cloth', { edge: true });
      d.cut(36.5, 6, 0.9, 0.9); d.cut(29.5, 7, 0.7, 0.7);
      d.px(43, 4, 'wood'); d.px(43, 5, 'lamp'); d.px(43, 6, 'lamp'); d.px(44, 5, 'lamp');
      // mantle
      d.el(32, 30, 16.5, 15, 'body');
      // crown of broken planks
      [[17, 22, 3.6, 10], [21.5, 19, 3.8, 13], [26, 17.5, 3.8, 9], [37, 17.5, 3.8, 11], [41.5, 19, 3.8, 8], [46, 22, 3.6, 12]].forEach(function (p, i) {
        var x = p[0], y = p[1], w = p[2], h = p[3];
        d.po([[x, y], [x, y - h + 2], [x + w * 0.35, y - h + (i % 2 ? 0 : 1.5)], [x + w * 0.65, y - h + 2.5], [x + w, y - h + (i % 2 ? 1.2 : 0)], [x + w, y]], i % 2 ? 'wood' : 'woodd', { edge: true });
        d.px(x + w / 2, y - 2, 'woodd', 0.2);
      });
      d.cv(16, 21, 32, 17, 48, 21, 'woodd', 0.9, 0.9, { edge: true });
      // rune band
      d.cv(19, 29, 32, 24, 45, 29, 'glow', 0.5, 0.5);
      d.px(24, 26, 'glow'); d.px(32, 23.5, 'glow'); d.px(40, 26, 'glow');
      // foreground tentacles sprawling on the ground, suckers showing
      [[20, 40, 6, 44, 4, 58], [26, 43, 20, 58, 12, 61], [38, 43, 44, 58, 52, 61], [44, 40, 58, 44, 60, 58]].forEach(function (t, i) {
        d.cv(t[0], t[1], t[2], t[3], t[4], t[5], 'body', 5.2, 1.2, { edge: true, bias: i % 3 ? 0 : -0.06 });
      });
      d.cv(30, 44, 30, 54, 26, 61, 'body', 4.5, 1.4, { edge: true });
      d.cv(34, 44, 35, 54, 39, 61, 'body', 4.5, 1.4, { edge: true });
      [[7, 49], [6, 53], [8, 57], [15, 55], [20, 57.5], [48, 57], [55, 49], [57, 53], [56, 57], [28, 55], [36, 55], [27, 58], [37, 58]].forEach(function (p) { d.el(p[0], p[1], 1, 0.9, 'under', { light: 0.85 }); });
      [[11, 46], [53, 46], [30, 50], [35, 50]].forEach(function (p) { d.px(p[0], p[1], 'glow'); });
      if (!d.back) {
        [[24.5, 35], [39.5, 35]].forEach(function (e) {
          d.el(e[0], e[1], 4.4, 3.4, 'ink');
          d.el(e[0], e[1], 3.6, 2.6, 'glow');
          d.el(e[0], e[1], 0.8, 2.2, 'ink');
        });
        d.ln(19, 31, 28, 32.5, 'ink', 0.6); d.ln(36, 32.5, 45, 31, 'ink', 0.6);
      }
    }
  };

  // ===== Leaf starter line: moss blob -> mossy stone -> ancient ruin golem =====
  DESIGNS.mossip = {
    pal: { moss: '#6aae48', mossd: '#3e7a32', stem: '#4c9a3a', petal: '#f8a6c6', pollen: '#f8d848', iris: '#2a3a1a' },
    draw: function (d) {
      d.el(26, 60, 3.2, 2, 'mossd'); d.el(38, 60, 3.2, 2, 'mossd');
      d.el(32, 50, 13.5, 11, 'moss');
      d.el(23.5, 43, 5.5, 4.5, 'moss'); d.el(32, 40, 6.5, 4.5, 'moss'); d.el(40.5, 43, 5.5, 4.5, 'moss');
      d.speckle('moss', 'mossd', 40, 19, 38, 45, 60, 0.35);
      if (!d.back) {
        d.eye(27, 49, 2.8, 3.2, { iris: 'iris', look: [-0.2, 0.1] });
        d.eye(37, 49, 2.8, 3.2, { iris: 'iris', look: [-0.2, 0.1] });
        d.px(23, 53, 'cheek'); d.px(24, 53, 'cheek'); d.px(40, 53, 'cheek'); d.px(41, 53, 'cheek');
        d.px(30.5, 54, 'mouth'); d.px(31.5, 55, 'mouth'); d.px(32.5, 54, 'mouth'); d.px(33.5, 55, 'mouth'); d.px(34.5, 54, 'mouth');
      }
      // sprouted flower
      d.cv(33, 40, 34, 35, 36, 31, 'stem', 0.8, 0.7);
      d.el(31.5, 36, 2.6, 1.3, 'stem', { edge: true });
      for (var i = 0; i < 5; i++) {
        var a = i * Math.PI * 2 / 5 - Math.PI / 2;
        d.el(36 + Math.cos(a) * 2.6, 29.5 + Math.sin(a) * 2.6, 2, 2, 'petal', { edge: true });
      }
      d.el(36, 29.5, 1.4, 1.4, 'pollen');
    }
  };

  DESIGNS.pebblom = {
    pal: { stone: '#9c968a', moss: '#62a444', mossd: '#3a7030', petal: '#f49ac0', pollen: '#f8d848', leaf: '#4aa048', iris: '=#b8f070' },
    draw: function (d) {
      d.el(25, 58.5, 5.5, 4, 'stone', { bias: -0.1 }); d.el(40, 58.5, 5.5, 4, 'stone', { bias: -0.1 });
      d.el(32, 44, 15.5, 14.5, 'stone');
      // moss cap and drips
      d.el(32, 35, 16, 8.5, 'moss', { clip: function (x, y) { return y < 38; } });
      [[19, 37, 4], [24, 38, 6], [31, 38, 3.5], [37, 38, 5.5], [44, 37, 4]].forEach(function (p) { d.el(p[0], p[1], 2.2, p[2] * 0.6, 'moss'); });
      d.speckle('moss', 'mossd', 24, 17, 27, 47, 41, 0.35);
      // cracks
      d.ln(20, 45, 23, 50, 'ink', 0.4); d.ln(23, 50, 21, 54, 'ink', 0.4); d.ln(42, 47, 45, 52, 'ink', 0.4);
      // stubby arms
      d.el(14.5, 47, 5, 6, 'stone', { edge: true }); d.el(49.5, 47, 5, 6, 'stone', { edge: true });
      d.el(49.5, 42.5, 3.5, 2, 'moss');
      if (!d.back) {
        d.el(26, 45, 3, 3, 'ink'); d.el(26, 45, 2, 2, 'iris'); d.px(25, 44, 'shine');
        d.el(38, 45, 3, 3, 'ink'); d.el(38, 45, 2, 2, 'iris'); d.px(37, 44, 'shine');
        d.ln(29, 51, 35, 51, 'ink', 0.45);
      }
      // bigger bloom and leaves on top
      d.el(28, 28, 4, 1.8, 'leaf', { edge: true }); d.el(40, 27, 4, 1.8, 'leaf', { edge: true });
      d.ln(34, 30, 35, 24, 'leaf', 0.8);
      for (var i = 0; i < 6; i++) {
        var a = i * Math.PI / 3;
        d.el(35 + Math.cos(a) * 3.6, 20.5 + Math.sin(a) * 3, 2.6, 2.3, 'petal', { edge: true });
      }
      d.el(35, 20.5, 2, 1.8, 'pollen');
    }
  };

  DESIGNS.templith = {
    pal: { stone: '#908a78', stoned: '#6c6758', moss: '#5c9c40', vine: '#3f8a3a', wood: '#7a5230', leaf: '#4caa46', petal: '#f39ac0', glow: '=#9cf46a' },
    draw: function (d) {
      // pillar legs with capitals and bases
      d.rc(18, 49, 10, 12, 'stoned'); d.rc(36, 49, 10, 12, 'stoned');
      d.ln(21, 50, 21, 60, 'stone', 0.4); d.ln(25, 50, 25, 60, 'stone', 0.4); d.ln(39, 50, 39, 60, 'stone', 0.4); d.ln(43, 50, 43, 60, 'stone', 0.4);
      d.rc(16.5, 59.5, 13, 3, 'stone', { edge: true }); d.rc(34.5, 59.5, 13, 3, 'stone', { edge: true });
      d.cv(19, 51, 17, 56, 19, 60, 'vine', 0.7, 0.5);
      // tapered torso
      d.po([[12, 24], [52, 24], [48, 50], [16, 50]], 'stone');
      d.ln(15, 37, 49, 37, 'stoned', 0.4);
      d.ln(20, 28, 23, 33, 'ink', 0.35); d.ln(23, 33, 21, 35, 'ink', 0.35); d.ln(44, 41, 41, 46, 'ink', 0.35);
      // glowing spiral glyphs and heart core
      [[20, 30], [44, 30]].forEach(function (g) {
        d.el(g[0], g[1], 3.2, 3.2, 'glow'); d.cut(g[0], g[1], 2.1, 2.1);
        d.px(g[0], g[1], 'glow');
      });
      d.el(32, 33, 4.8, 4.8, 'ink'); d.el(32, 33, 3.8, 3.8, 'glow');
      d.ln(25, 44, 39, 44, 'glow', 0.4); d.px(22, 44, 'glow'); d.px(42, 44, 'glow');
      // boulder shoulders and broken fluted-pillar arms with boulder fists
      d.el(11, 26, 8, 6.5, 'stone', { edge: true }); d.el(53, 26, 8, 6.5, 'stone', { edge: true });
      d.po([[4, 30], [15, 30], [15, 43], [12, 42], [10, 44], [7, 42], [4, 43]], 'stone', { edge: true });
      d.po([[49, 30], [60, 30], [60, 43], [57, 42], [55, 44], [52, 42], [49, 43]], 'stone', { edge: true });
      [7, 10, 13, 52, 55, 58].forEach(function (x) { d.ln(x, 31, x, 41, 'stoned', 0.35); });
      d.el(9.5, 50, 7, 6, 'stoned', { edge: true }); d.el(54.5, 50, 7, 6, 'stoned', { edge: true });
      // head: carved mask under a temple roof
      d.rc(23, 10, 18, 14, 'stone', { edge: true });
      d.po([[19, 11], [32, 2], [45, 11]], 'stoned', { edge: true });
      d.ln(22, 11, 42, 11, 'stone', 0.5);
      if (!d.back) {
        d.rc(25.5, 14, 5, 3, 'ink'); d.rc(26.5, 15, 3, 1.4, 'glow');
        d.rc(33.5, 14, 5, 3, 'ink'); d.rc(34.5, 15, 3, 1.4, 'glow');
        d.rc(29, 20, 6, 1.2, 'ink');
      }
      // overgrowth: moss on top edges, hanging vines, a shoulder tree and flowers
      d.el(32, 24.5, 20, 1.8, 'moss', { clip: function (x, y) { return y < 25.5; } });
      d.el(11, 20.5, 6.5, 2.2, 'moss'); d.el(28, 3.5, 5, 1.6, 'moss');
      d.speckle('stone', 'moss', 55, 3, 3, 61, 50, 0.45);
      d.cv(12, 23, 9, 31, 12, 38, 'vine', 0.7, 0.5); d.cv(24, 25, 26, 31, 23, 36, 'vine', 0.7, 0.5);
      d.cv(42, 25, 40, 32, 43, 40, 'vine', 0.7, 0.5); d.cv(5, 30, 3, 36, 5, 42, 'vine', 0.6, 0.4);
      d.ln(55, 21, 55, 10, 'wood', 1.3, 0.9);
      d.ln(55, 14, 51, 11.5, 'wood', 0.6);
      d.el(55, 7.5, 6, 4.5, 'leaf'); d.el(50, 10.5, 3.5, 2.6, 'leaf'); d.el(59.5, 11, 2.8, 2.2, 'leaf');
      [[10, 33], [25, 31], [41, 38], [6, 36], [30, 3], [53, 44]].forEach(function (p) { d.px(p[0], p[1], 'petal', 0.8); d.px(p[0] + 1, p[1], 'petal', 0.6); });
    }
  };

  // ===== Reed mouse line (Brookhollow reeds): cattail-tailed harvest mouse -> reed-hooded marsh brawler =====
  DESIGNS.rushkin = {
    pal: { body: '#d49456', belly: '#f6e2c0', ear: '#f0a0a8', cat: '#7a4a26', stem: '#6aa040', seed: '#f0c860', iris: '#2a1a14' },
    draw: function (d) {
      d.cv(38, 55, 48, 52, 47, 38, 'body', 1, 0.7);
      d.ln(47, 38, 47, 33, 'stem', 0.6);
      d.el(47, 29, 2.2, 4.2, 'cat', { edge: true });
      d.px(47, 24, 'stem');
      d.el(27, 60, 3.2, 1.8, 'body', { bias: -0.1 }); d.el(36, 60, 3.2, 1.8, 'body', { bias: -0.1 });
      d.el(32, 53, 7.5, 7, 'body');
      d.el(31, 55, 4.5, 5, 'belly', { clip: function (x, y) { return y > 50; } });
      d.el(23.5, 38.5, 4.2, 4.2, 'body'); d.el(23.5, 38.5, 2.4, 2.4, 'ear', { light: 0.7 });
      d.el(35, 37.5, 4.2, 4.2, 'body'); d.el(35, 37.5, 2.4, 2.4, 'ear', { light: 0.7 });
      d.el(29.5, 45, 7, 6.2, 'body');
      d.el(27, 48, 3.5, 2.4, 'belly');
      if (!d.back) {
        d.eye(26.5, 44, 1.9, 2.3, { look: [-0.3, 0] });
        d.eye(32.5, 44, 1.9, 2.3, { look: [-0.3, 0] });
        d.px(24, 47, 'ear'); d.px(25, 47, 'ear');
        d.px(26, 49, 'white');
      }
      d.el(27, 52.5, 2.6, 2, 'seed', { edge: true });
      d.el(24.5, 52.5, 1.6, 1.6, 'body', { edge: true }); d.el(29.5, 52.5, 1.6, 1.6, 'body', { edge: true });
    }
  };

  DESIGNS.bulrusher = {
    pal: { body: '#b8763e', belly: '#f0d8b0', ear: '#e89aa0', reed: '#6a9a40', reedd: '#48762c', cat: '#6a3e20', iris: '#e8a020' },
    draw: function (d) {
      // reed staff behind, with a cattail tip
      d.ln(17, 60, 23, 14, 'reed', 1, 0.8);
      d.el(23.5, 10, 2.2, 4.5, 'cat', { edge: true });
      // tail ending in a big cattail club
      d.cv(40, 50, 54, 52, 52, 36, 'body', 2.2, 1.3);
      d.el(52, 30, 3.6, 7, 'cat', { edge: true });
      d.px(51, 27, 'belly', 0.9); d.px(53, 32, 'belly', 0.9);
      // legs and body
      d.el(26.5, 55, 4.8, 6, 'body', { bias: -0.05 }); d.el(37.5, 55, 4.8, 6, 'body', { bias: -0.05 });
      d.el(25, 60.5, 5, 2, 'body', { bias: -0.12 }); d.el(39, 60.5, 5, 2, 'body', { bias: -0.12 });
      d.el(32, 44, 10.5, 11, 'body');
      d.el(31, 47, 6.5, 7.5, 'belly', { clip: function (x, y) { return y > 40; } });
      // woven reed cape over the shoulders
      d.po([[20, 34], [44, 34], [46, 44], [40, 42], [36, 45], [32, 42], [28, 45], [24, 42], [18, 44]], 'reed', { edge: true });
      for (var i = 0; i < 5; i++) d.ln(22 + i * 5, 35, 21 + i * 5.2, 43, 'reedd', 0.35);
      // arm gripping the staff
      d.ln(24, 40, 20, 46, 'body', 2.6, 2.2, { edge: true });
      d.el(19.5, 47, 2.6, 2.6, 'body', { edge: true });
      // head inside a woven hood, ears poking out
      d.el(31, 26, 10, 8.5, 'reed');
      d.ln(22, 26, 40, 26, 'reedd', 0.35); d.ln(23, 22, 39, 22, 'reedd', 0.35);
      d.el(24, 18, 3.2, 3.2, 'body'); d.el(24, 18, 1.8, 1.8, 'ear', { light: 0.7 });
      d.el(38, 17, 3.2, 3.2, 'body'); d.el(38, 17, 1.8, 1.8, 'ear', { light: 0.7 });
      d.el(30, 29, 7, 6, 'body');
      d.el(27.5, 32, 3.8, 2.4, 'belly');
      if (!d.back) {
        d.eye(27, 28, 1.9, 2, { look: [-0.4, 0], lid: 0.3, lidMat: 'body' });
        d.eye(33, 28, 1.9, 2, { look: [-0.4, 0], lid: 0.3, lidMat: 'body' });
        d.px(24.5, 31, 'ear');
        d.px(26, 34, 'white'); d.px(27, 34, 'white');
      }
    }
  };

  var cache = {};
  function render(key, view, prism, tint) {
    var ck = key + '|' + view + '|' + (prism ? 1 : 0) + '|' + (tint || 0);
    if (cache[ck]) return cache[ck];
    var ds = DESIGNS[key];
    var d = new D(ds.pal, view, { seed: key, prism: prism, keep: ds.keepPrism || [], tint: tint && PK.kitArt.TINTS[tint] });
    ds.draw(d);
    var c = d.render();
    // The player's Kit stands on the left, so its back view faces right toward the foe.
    if (d.back) c = PK.flipCanvas(c);
    c.float = !!(ds.float || d.float);
    cache[ck] = c;
    return c;
  }

  PK.DESIGNS = DESIGNS;
  PK.kitDesigns = { render: render, D: D };
})();
