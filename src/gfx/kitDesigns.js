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
    // Prism (shiny) Kits use a hand-picked palette; a design without one falls back to a hue shift
    var shiny = opts.prism && window.PK.SHINY && window.PK.SHINY[opts.seed];
    if (shiny) { Object.assign(all, shiny); opts = Object.assign({}, opts, { prism: false }); }
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

  // ===== Fire starter line: eggshell hatchling -> shell-armored drakeling -> sun dragon =====
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

  // ===== Water starter line: shell-hat ink sprite -> rune reef squid -> shipwreck kraken =====
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

  // ===== Grass starter line: moss blob -> mossy stone -> ancient ruin golem =====
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

  // ===== Willow Trail: kite bird line (Normal/Flying) =====
  DESIGNS.kitefinch = {
    pal: { body: '#5aa8e8', belly: '#f8f0e0', wing: '#f0c040', ribbon: '#e84848', beak: '#f0a030', iris: '#1c2a4a' },
    draw: function (d) {
      d.cv(38, 51, 47, 59, 55, 53, 'ribbon', 1.3, 0.7);
      d.cv(38, 49, 48, 45, 56, 45, 'ribbon', 1.3, 0.7);
      d.ln(29, 57, 28, 61, 'beak', 0.6); d.ln(34, 57, 35, 61, 'beak', 0.6);
      d.el(32, 50, 9, 8, 'body');
      d.el(29.5, 53.5, 5.5, 4.5, 'belly', { clip: function (x, y) { return y > 50; } });
      d.el(26.5, 40.5, 7, 6.5, 'body');
      d.px(27, 33, 'body'); d.px(28, 32.5, 'body');
      d.po([[18.5, 41.5], [21.5, 39], [22, 43.5]], 'beak', { edge: true });
      if (!d.back) d.eye(24.5, 39.5, 2, 2.4, { look: [-0.4, 0] });
      d.po([[33, 43], [42, 48], [35.5, 57.5], [28, 50]], 'wing', { edge: true });
      d.ln(33, 43.5, 35.5, 57, 'ribbon', 0.5); d.ln(28.5, 50, 41.5, 48, 'wing', 0.4, 0.4, { light: 0.3 });
    }
  };
  DESIGNS.streamlark = {
    pal: { body: '#3e8ad8', belly: '#f8f0e0', wing: '#f4c43a', wing2: '#ec7a3a', ribbon: '#e03a4a', beak: '#f0a030', iris: '#1c2a4a' },
    draw: function (d) {
      d.cv(40, 48, 52, 59, 61, 51, 'ribbon', 1.6, 0.8);
      d.cv(40, 46, 53, 44, 61, 37, 'ribbon', 1.6, 0.8);
      d.po([[60, 50], [63, 48], [63, 54]], 'ribbon'); d.po([[60, 37], [63, 34], [63, 40]], 'ribbon');
      d.po([[37, 26], [53, 28], [44, 41], [35, 36]], 'wing2', { bias: -0.1 });
      d.ln(28, 52, 26, 60, 'beak', 0.8); d.ln(34, 52, 35, 60, 'beak', 0.8);
      d.el(25, 60.5, 3, 1.2, 'beak'); d.el(36, 60.5, 3, 1.2, 'beak');
      d.el(32, 44, 10.5, 9, 'body');
      d.el(29, 48, 6.5, 5.5, 'belly', { clip: function (x, y) { return y > 44; } });
      d.ln(29, 38, 25, 32, 'body', 5, 4.5);
      d.el(23.5, 29.5, 7, 6, 'body');
      d.ln(26, 24, 32, 19, 'ribbon', 0.8, 0.5); d.ln(27, 24, 34, 23, 'ribbon', 0.7, 0.4);
      d.po([[14.5, 30.5], [18.5, 28], [18.5, 33]], 'beak', { edge: true });
      if (!d.back) d.eye(21.5, 28.5, 2, 2.2, { look: [-0.5, 0], lid: 0.3, lidMat: 'body' });
      d.po([[29, 33], [46, 38], [37, 53], [24, 43]], 'wing', { edge: true });
      d.po([[29, 33], [46, 38], [35.5, 43]], 'wing2', { edge: true });
      d.ln(29, 33.5, 37, 52.5, 'ribbon', 0.5); d.ln(24.5, 43, 45.5, 38, 'ribbon', 0.5);
    }
  };
  DESIGNS.festivane = {
    pal: { body: '#2a6ac0', belly: '#f4ead8', wing: '#f4c43a', wing2: '#e8583a', wing3: '#3aa88a', ribbon: '#d8304a', ribbon2: '#f0d060', beak: '#f0a030', talon: '#3a3040', iris: '#f0c030' },
    draw: function (d) {
      // long streamers trailing behind
      d.cv(44, 46, 56, 38, 63, 30, 'ribbon', 1.8, 0.8);
      d.cv(44, 48, 56, 50, 63, 46, 'ribbon2', 1.6, 0.8);
      d.cv(42, 50, 52, 60, 63, 60, 'ribbon', 1.6, 0.8);
      // far wing: a big kite
      d.po([[36, 26], [52, 2], [63, 10], [50, 34]], 'wing3', { bias: -0.12 });
      d.ln(36, 26, 63, 10, 'talon', 0.4); d.ln(52, 2.5, 50, 33.5, 'talon', 0.4);
      // tail fan, legs and body
      d.po([[40, 46], [54, 52], [50, 60], [38, 54]], 'body', { bias: -0.08 });
      d.ln(30, 50, 28, 59, 'beak', 1.3, 1); d.ln(37, 50, 38, 59, 'beak', 1.3, 1);
      [[24.5, 61], [28, 61.5], [34, 61], [38, 61.5], [41.5, 61]].forEach(function (p) { d.px(p[0], p[1], 'talon'); });
      d.el(26.5, 60, 3.4, 1.5, 'beak'); d.el(39, 60, 3.4, 1.5, 'beak');
      d.el(34, 40, 11.5, 12, 'body');
      d.el(31, 45, 7, 8, 'belly', { clip: function (x, y) { return y > 38; } });
      d.speckle('belly', 'body', 10, 25, 38, 37, 52, 0.55);
      // neck and hooked beak
      d.ln(30, 32, 25, 26, 'body', 6, 5.5);
      d.el(23, 23, 8, 7, 'body');
      d.po([[11, 24.5], [16.5, 20], [18, 27.5], [13, 27.5]], 'beak', { edge: true });
      d.px(11.5, 26.5, 'beak', 0.3);
      [[27, 17, 35, 6], [29, 18, 39, 11], [26, 16, 29, 4]].forEach(function (l, j) { d.ln(l[0], l[1], l[2], l[3], j === 1 ? 'ribbon2' : 'ribbon', 0.9, 0.5); });
      if (!d.back) {
        d.eye(20, 22, 2.3, 2.2, { look: [-0.6, 0], lid: 0.35, lidMat: 'body' });
        d.ln(16.5, 19.5, 24, 19.5, 'talon', 0.5);
      }
      // near wing: festival kite with spars
      d.po([[28, 30], [12, 4], [2, 16], [22, 42]], 'wing', { edge: true });
      d.po([[28, 30], [12, 4], [14, 22]], 'wing2', { edge: true });
      d.po([[2, 16], [14, 22], [22, 42]], 'wing3', { edge: true });
      d.ln(28, 30, 2.5, 16, 'talon', 0.45); d.ln(12, 4.5, 22, 41.5, 'talon', 0.45);
    }
  };

  // ===== Willow Trail: caddisfly line (Bug) =====
  DESIGNS.caddle = {
    pal: { case: '#9a8a78', pebble: '#bcae96', pebble2: '#7a8a8e', twig: '#7a5230', grub: '#dcecac', iris: '#1a2a14' },
    draw: function (d) {
      d.el(36, 54, 12.5, 6.5, 'case');
      [[28, 51, 2.6], [33, 50, 2.2], [38, 51, 2.8], [44, 52, 2.4], [31, 56, 2.4], [37, 57, 2.6], [43, 56.5, 2.2], [46, 55, 1.8]].forEach(function (p, i) {
        d.el(p[0], p[1], p[2], p[2] * 0.8, i % 3 ? 'pebble' : 'pebble2', { edge: true });
      });
      d.ln(30, 48.5, 44, 47.5, 'twig', 0.7); d.ln(40, 60, 49, 58, 'twig', 0.6);
      d.el(22.5, 53.5, 6.2, 5.5, 'grub');
      d.ln(18, 58, 16, 60, 'grub', 0.6); d.ln(21, 59, 20, 61, 'grub', 0.6); d.ln(24, 59, 24, 61, 'grub', 0.6);
      if (!d.back) {
        d.eye(19.5, 52, 1.9, 2.3, { look: [-0.4, 0] });
        d.eye(24.5, 52, 1.9, 2.3, { look: [-0.4, 0] });
        d.px(19, 56, 'twig'); d.px(21, 56, 'twig');
      }
    }
  };
  DESIGNS.stonesheath = {
    pal: { case: '#8a8070', pebble: '#b4a890', pebble2: '#7a8a8e', moss: '#5a9a44', twig: '#7a5230', glow: '=#f0e070' },
    draw: function (d) {
      d.ln(27, 30, 22, 20, 'twig', 0.8, 0.5); d.ln(37, 29, 42, 18, 'twig', 0.8, 0.5);
      d.el(32, 44, 11, 18, 'case');
      var r = [[27, 32, 3], [34, 30, 3.2], [38, 36, 2.8], [26, 40, 3], [33, 44, 2.6], [39, 45, 3], [28, 50, 3.2], [35, 53, 3], [30, 58, 2.8], [37, 58.5, 2.4], [24, 47, 2.2], [40, 52, 2.2]];
      r.forEach(function (p, i) { d.el(p[0], p[1], p[2], p[2] * 0.85, i % 3 ? 'pebble' : 'pebble2', { edge: true }); });
      d.el(31, 28, 8, 3, 'moss'); d.el(24, 44, 2.6, 5, 'moss'); d.el(40, 50, 2.4, 4, 'moss');
      d.speckle('moss', 'case', 6, 22, 24, 42, 54, 0.4);
      if (!d.back) {
        d.rc(26, 38, 12, 4, 'ink');
        d.px(29, 39.5, 'glow'); d.px(30, 39.5, 'glow'); d.px(34, 39.5, 'glow'); d.px(35, 39.5, 'glow');
      }
    }
  };
  DESIGNS.caddira = {
    pal: { wing: '#6aa04a', wing2: '#4a7a3a', vein: '#a8d078', body: '#8a6a4a', fluff: '#f0e6c8', eye: '#2a2a3a', pebble: '#b8a88a', leg: '#5a4030' },
    draw: function (d) {
      // antennae sweeping forward
      d.cv(20, 27, 10, 14, 4, 4, 'leg', 0.5, 0.35); d.cv(22, 26, 16, 10, 12, 2, 'leg', 0.5, 0.35);
      // far wing tent
      d.po([[22, 22], [58, 30], [60, 44], [26, 40]], 'wing2', { bias: -0.1 });
      // legs
      [[24, 44, 20, 61], [30, 45, 30, 61], [36, 45, 40, 61], [42, 45, 48, 60]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'leg', 0.6, 0.45); });
      d.el(34, 42, 12, 4.5, 'body');
      // near wing tent with leaf veins
      d.po([[20, 26], [56, 32], [58, 46], [24, 46]], 'wing', { edge: true });
      d.ln(22, 30, 56, 38, 'vein', 0.4); [26, 34, 42, 50].forEach(function (x) { d.ln(x, 33 - (x - 26) * 0.05, x + 4, 45, 'vein', 0.3); });
      // fluffy collar, head and pebble brooch
      d.el(22, 34, 5.5, 5, 'fluff');
      d.el(17, 30, 5.5, 5, 'body');
      d.el(23.5, 38.5, 2, 2, 'pebble', { edge: true });
      if (!d.back) {
        d.el(15, 29.5, 2.8, 3, 'eye', { bias: 0.1 }); d.px(14, 28.5, 'shine');
        d.px(13, 33, 'leg');
      }
    }
  };

  // ===== Willow Trail: dandelion hare (Grass -> Grass/Flying) =====
  DESIGNS.puffhop = {
    pal: { fur: '#bcd48a', belly: '#f4f0d8', puff: '#fafaf4', seed: '#8a8a70', ear: '#f0a8b0', leaf: '#4caa46', iris: '#2a3a1a' },
    draw: function (d) {
      d.el(45, 47, 9, 9, 'puff', { bias: 0.1 });
      d.speckle('puff', 'seed', 16, 37, 39, 53, 55, 0.3);
      d.el(36, 56, 5.5, 4.5, 'fur', { bias: -0.06 });
      d.el(32, 52, 9, 8, 'fur');
      d.el(29, 55, 5, 4.5, 'belly', { clip: function (x, y) { return y > 52; } });
      d.el(26, 59.5, 2.6, 1.8, 'fur'); d.el(38, 60, 3.6, 1.8, 'fur', { bias: -0.08 });
      d.el(22, 30, 2.6, 7.5, 'fur'); d.el(22, 30.5, 1.3, 5.5, 'ear', { light: 0.7 });
      d.el(29, 28.5, 2.6, 8, 'fur'); d.el(29, 29, 1.3, 6, 'ear', { light: 0.7 });
      d.el(25.5, 42, 7, 6.5, 'fur');
      d.el(23, 45, 3.5, 2.5, 'belly');
      [[22, 48.5, -0.6], [27, 49, 0.3], [32, 47.5, 0.9]].forEach(function (l) { d.el(l[0], l[1], 2.8, 1.4, 'leaf', { edge: true }); });
      if (!d.back) {
        d.eye(22.5, 41, 1.7, 2.1, { iris: 'iris', look: [-0.4, 0.1] });
        d.eye(28, 40.5, 1.6, 2, { iris: 'iris', look: [-0.4, 0.1] });
        d.px(19.5, 44, 'ear'); d.px(20.5, 45, 'mouth');
      }
    }
  };
  DESIGNS.dandeloft = {
    float: true,
    pal: { fur: '#a8c878', belly: '#f4f0d8', puff: '#fafaf4', seed: '#8a8a70', stem: '#6aa040', leaf: '#3a9a3e', ear: '#f0a8b0', iris: '#2a3a1a' },
    draw: function (d) {
      // dandelion parachute grown from its ears
      d.el(32, 15, 17, 12.5, 'puff', { bias: 0.12 });
      d.speckle('puff', 'seed', 40, 16, 4, 48, 26, 0.3);
      for (var i = 0; i < 9; i++) { var a = Math.PI + i * Math.PI / 8; d.px(32 + Math.cos(a) * 16, 15 + Math.sin(a) * 11.5, 'seed', 0.3); }
      d.ln(28, 30, 25, 22, 'stem', 0.8, 0.6); d.ln(35, 30, 38, 22, 'stem', 0.8, 0.6);
      // body hanging below
      d.ln(28, 50, 26, 58, 'fur', 1.8, 1.4); d.ln(35, 50, 37, 58, 'fur', 1.8, 1.4);
      d.el(31.5, 45, 7, 8.5, 'fur');
      d.el(30.5, 47, 4.5, 5.5, 'belly');
      d.el(40, 50, 3.2, 3.2, 'puff');
      d.ln(26, 40, 26, 32, 'fur', 1.4, 1.2); d.ln(37, 40, 37, 32, 'fur', 1.4, 1.2);
      d.el(31.5, 34, 7, 6.2, 'fur');
      d.el(29.5, 37, 3.5, 2.4, 'belly');
      d.po([[24, 39], [40, 39], [36, 42], [32, 40.5], [28, 42]], 'leaf', { edge: true });
      if (!d.back) {
        d.eye(29, 33.5, 2, 2.4, { look: [-0.3, 0.3] });
        d.eye(35, 33.5, 2, 2.4, { look: [-0.3, 0.3] });
        d.px(28, 36.5, 'ear'); d.px(29, 37.5, 'mouth');
      }
    }
  };

  // ===== Willow Trail: acorn beetle (Bug -> Bug/Steel) =====
  DESIGNS.acornet = {
    pal: { shell: '#6a8a44', cap: '#a87a44', capd: '#7a5230', head: '#3a3028', leg: '#2a2420' },
    draw: function (d) {
      [[26, 57, 24, 61], [31, 58, 31, 61], [37, 58, 39, 61], [42, 57, 45, 60]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'leg', 0.6); });
      d.el(34, 52, 11, 7.5, 'shell');
      d.ln(34, 45, 36, 59, 'shell', 0.35, 0.35, { light: 0.25 });
      d.px(30, 49, 'shine'); d.px(31, 48.5, 'shine');
      d.el(23.5, 53, 5, 4.2, 'head');
      d.el(23.5, 49, 7, 4.5, 'cap', { clip: function (x, y) { return y < 51; }, edge: true });
      for (var i = 0; i < 4; i++) d.ln(17.5 + i * 3.2, 47 + (i % 2), 18.5 + i * 3.2, 50, 'capd', 0.35);
      d.ln(23.5, 44.5, 24.5, 42, 'capd', 0.7);
      if (!d.back) { d.px(21, 53, 'shine'); d.px(25, 53, 'shine'); d.px(20.5, 54, 'ink'); d.px(24.5, 54, 'ink'); }
    }
  };
  DESIGNS.oaknight = {
    pal: { shell: '#4a6a36', plate: '#b08850', plated: '#7a5a30', metal: '#9aa2b0', twig: '#7a5230', leaf: '#4caa46', glow: '=#f0e070', leg: '#2a2420' },
    draw: function (d) {
      // twig lance with a leaf pennant
      d.ln(46, 61, 52, 6, 'twig', 1, 0.8);
      d.po([[52, 8], [60, 11], [53, 14]], 'leaf', { edge: true });
      d.po([[50.5, 26], [53, 24], [54, 28]], 'metal');
      // legs
      d.ln(28, 50, 25, 61, 'leg', 1.6, 1.2); d.ln(36, 50, 38, 61, 'leg', 1.6, 1.2);
      d.el(24, 61, 3.4, 1.4, 'leg'); d.el(39, 61, 3.4, 1.4, 'leg');
      // body with acorn-plate armor
      d.el(32, 41, 10, 12.5, 'shell');
      [[29, 34, 5], [35, 36, 4.5], [29, 42, 4.6], [35, 44, 4.2], [31, 49, 4]].forEach(function (p) { d.el(p[0], p[1], p[2], p[2] * 0.7, 'plate', { edge: true }); });
      // arm holding the lance
      d.ln(38, 34, 45, 38, 'shell', 2.2, 2); d.el(47, 38.5, 2.4, 2.4, 'shell', { edge: true });
      // acorn-cap shield
      d.el(20, 42, 6.5, 8, 'plate', { edge: true });
      d.el(20, 38.5, 6.5, 4.5, 'plated', { clip: function (x, y) { return y < 40; } });
      for (var i = 0; i < 3; i++) d.ln(15.5 + i * 3, 36, 16 + i * 3, 39.5, 'plate', 0.3);
      // helmet with visor and mandible crest
      d.cv(27, 21, 18, 16, 15, 8, 'shell', 1.4, 0.6); d.cv(33, 20, 30, 10, 36, 4, 'shell', 1.4, 0.6);
      d.el(30, 24, 7.5, 6.5, 'plate');
      d.el(30, 20, 8.5, 4.8, 'plated', { clip: function (x, y) { return y < 22; }, edge: true });
      d.ln(30, 15.5, 31, 13, 'twig', 0.8);
      if (!d.back) { d.rc(24.5, 23.5, 10, 2.4, 'ink'); d.px(26, 24.5, 'glow'); d.px(29, 24.5, 'glow'); }
    }
  };

  // ===== Willow Trail: skipping-stone fish (Water -> Water/Ground) =====
  DESIGNS.skimble = {
    float: true,
    pal: { body: '#8aa2b4', stripe: '#c8d8e0', fin: '#5a8ab0', water: '=#bfe6ff', iris: '#1a2a3a' },
    draw: function (d) {
      d.el(32, 60, 12, 2.2, 'water'); d.cut(32, 60, 9, 1.2);
      d.po([[42, 44], [50, 38], [50, 52]], 'fin', { edge: true });
      d.po([[30, 38], [36, 33], [38, 39]], 'fin');
      d.el(31, 46, 13, 8, 'body');
      d.el(31, 45, 10, 2.2, 'stripe', { light: 0.9 });
      d.po([[29, 50], [34, 55], [36, 49]], 'fin', { edge: true });
      if (!d.back) {
        d.eye(23, 44, 2.6, 2.8, { look: [-0.3, 0] });
        d.ln(18.5, 48, 21.5, 48.5, 'mouth', 0.4);
      }
      d.px(14, 40, 'water'); d.px(12, 44, 'water'); d.px(48, 58, 'water');
    }
  };
  DESIGNS.rapidfin = {
    float: true,
    pal: { body: '#4a7aa8', plate: '#9a9488', plated: '#6a6458', fin: '#2e5a8a', belly: '#d8e4ea', water: '=#bfe6ff', foam: '=#ffffff', iris: '#f0c030' },
    draw: function (d) {
      // splash below the leap
      d.el(34, 59, 16, 3, 'water'); d.cut(34, 59, 12, 1.6);
      [[18, 52], [22, 49], [48, 52], [45, 48], [30, 55]].forEach(function (p) { d.px(p[0], p[1], 'foam'); });
      // tail fork and big blade fins
      d.po([[44, 30], [58, 18], [55, 30], [60, 42]], 'fin', { edge: true });
      d.po([[26, 20], [36, 8], [42, 22]], 'fin', { edge: true });
      d.el(31, 32, 16, 10, 'body');
      d.el(28, 37, 12, 4.5, 'belly', { clip: function (x, y) { return y > 34; } });
      [[26, 27, 4.5], [33, 26, 4.2], [39, 28, 3.6], [21, 30, 3.4]].forEach(function (p) { d.el(p[0], p[1], p[2], p[2] * 0.75, 'plate', { edge: true }); });
      d.ln(20, 26, 44, 26, 'plated', 0.35);
      d.po([[27, 38], [36, 47], [38, 38]], 'fin', { edge: true });
      if (!d.back) {
        d.eye(18, 31, 2.4, 2.2, { look: [-0.5, 0], lid: 0.35, lidMat: 'body' });
        d.ln(13, 35, 18, 36, 'mouth', 0.45); d.px(14, 36, 'white');
      }
    }
  };

  // ===== Willow Trail: owl-cat (Ghost -> Ghost/Flying), night only =====
  DESIGNS.nocturr = {
    pal: { body: '#5a4a78', face: '#9a8ab8', wing: '#44385e', talon: '#e8c060', glow: '=#ffd84a', ear: '#3a2e50' },
    draw: function (d) {
      d.cv(40, 56, 50, 58, 48, 46, 'body', 2, 1.2);
      d.el(28, 61, 3, 1.4, 'talon'); d.el(36, 61, 3, 1.4, 'talon');
      d.el(32, 50, 10.5, 10.5, 'body');
      d.el(22.5, 51, 3.5, 7, 'wing', { edge: true }); d.el(41.5, 51, 3.5, 7, 'wing', { edge: true });
      d.po([[23, 38], [22, 29], [29, 36]], 'body'); d.po([[35, 36], [42, 29], [41, 38]], 'body');
      d.po([[24, 36.5], [23.5, 32], [27, 35.5]], 'ear'); d.po([[37, 35.5], [40.5, 32], [40, 36.5]], 'ear');
      d.el(32, 44, 9, 6.5, 'face');
      if (!d.back) {
        d.el(28, 43.5, 3.4, 3.4, 'ink'); d.el(28, 43.5, 2.6, 2.6, 'glow'); d.el(28, 43.5, 1, 1.8, 'ink'); d.px(27, 42.5, 'shine');
        d.el(36, 43.5, 3.4, 3.4, 'ink'); d.el(36, 43.5, 2.6, 2.6, 'glow'); d.el(36, 43.5, 1, 1.8, 'ink'); d.px(35, 42.5, 'shine');
        d.po([[31, 46.5], [33, 46.5], [32, 48.5]], 'talon');
      }
    }
  };
  DESIGNS.umbrowl = {
    pal: { body: '#463a66', face: '#8a7aa8', wing: '#2e2446', wingin: '#6a4a8a', talon: '#e8c060', glow: '=#ffd84a', moon: '=#f4f0c8', ear: '#2a2040' },
    draw: function (d) {
      // cloak-like spread wings
      d.po([[30, 24], [2, 34], [6, 46], [14, 44], [16, 54], [26, 50]], 'wing', { bias: -0.06 });
      d.po([[34, 24], [62, 34], [58, 46], [50, 44], [48, 54], [38, 50]], 'wing', { bias: -0.06 });
      d.po([[29, 28], [8, 36], [12, 42], [24, 44]], 'wingin'); d.po([[35, 28], [56, 36], [52, 42], [40, 44]], 'wingin');
      d.cv(38, 54, 52, 58, 56, 50, 'body', 2.4, 1.2);
      d.ln(28, 50, 27, 59, 'talon', 1.2); d.ln(36, 50, 37, 59, 'talon', 1.2);
      d.el(26.5, 60.5, 3, 1.3, 'talon'); d.el(37.5, 60.5, 3, 1.3, 'talon');
      d.el(32, 42, 9, 12, 'body');
      d.el(32, 44, 4, 4, 'moon'); d.cut(33.5, 43, 3.2, 3.4);
      // head with tufted cat ears
      d.po([[24, 20], [21, 6], [30, 16]], 'body'); d.po([[34, 16], [43, 6], [40, 20]], 'body');
      d.ln(21.5, 7, 19, 3, 'ear', 0.6); d.ln(42.5, 7, 45, 3, 'ear', 0.6);
      d.el(32, 24, 9, 7.5, 'face');
      if (!d.back) {
        [[28, 23], [36, 23]].forEach(function (e) { d.el(e[0], e[1], 3, 2.6, 'ink'); d.el(e[0], e[1], 2.3, 1.9, 'glow'); d.el(e[0], e[1], 0.8, 1.6, 'ink'); });
        d.ln(24, 20, 30, 21.5, 'ink', 0.5); d.ln(34, 21.5, 40, 20, 'ink', 0.5);
        d.po([[31, 26], [33, 26], [32, 28.5]], 'talon');
      }
    }
  };

  // ===== Willow Trail rare: geode snail (Ground/Fairy) =====
  DESIGNS.geodrop = {
    pal: { foot: '#d8c8e8', rock: '#8a7a6a', rockd: '#5a4e44', crys: '#a070e0', crys2: '#d8b8ff', eye: '#2a2030' },
    draw: function (d) {
      d.el(31, 58, 13, 3.8, 'foot');
      d.ln(21, 57, 18, 48, 'foot', 2.2, 2); d.el(18, 47, 3, 3, 'foot');
      d.ln(17, 46, 14, 40, 'foot', 0.7, 0.5); d.ln(19, 45, 20, 39, 'foot', 0.7, 0.5);
      if (!d.back) { d.el(14, 39.5, 1.3, 1.3, 'eye'); d.el(20, 38.5, 1.3, 1.3, 'eye'); d.px(17, 49, 'mouth'); }
      d.el(36, 47, 10.5, 10, 'rock');
      d.speckle('rock', 'rockd', 14, 26, 38, 46, 56, 0.3);
      // cracked-open window showing crystals
      d.el(38, 44.5, 5.5, 5, 'rockd', { edge: true });
      [[35, 47, 36.5, 40], [38, 48, 39, 39], [41, 47, 41.5, 41]].forEach(function (c) { d.po([[c[0] - 1.5, c[1]], [c[2], c[3]], [c[0] + 1.5, c[1]]], 'crys', { light: 0.7 }); });
      d.px(38.5, 41, 'crys2'); d.px(36, 43, 'crys2');
    }
  };
  DESIGNS.amethell = {
    pal: { foot: '#cdb8e0', rock: '#7a6a5a', rockd: '#4e443c', crys: '#9a60e0', crys2: '#e0c8ff', glow: '=#f4e8ff', eye: '=#f4e8ff' },
    draw: function (d) {
      d.el(31, 58, 16, 4.2, 'foot');
      d.ln(18, 57, 14, 44, 'foot', 3, 2.6); d.el(14, 43, 3.8, 3.6, 'foot');
      d.ln(13, 41, 8, 32, 'foot', 0.8, 0.6); d.ln(16, 40, 18, 31, 'foot', 0.8, 0.6);
      d.el(8, 31, 1.6, 1.6, 'eye'); d.el(18, 30, 1.6, 1.6, 'eye');
      if (!d.back) { d.px(13, 44, 'ink'); d.px(15, 44, 'ink'); }
      d.px(20, 52, 'crys'); d.px(24, 55, 'crys2');
      // rock base with a tall amethyst spire
      d.el(36, 50, 13, 9, 'rock');
      d.speckle('rock', 'rockd', 20, 24, 42, 48, 58, 0.3);
      var spikes = [[30, 44, 27, 20, 3], [36, 44, 37, 6, 4], [42, 44, 46, 18, 3.2], [33, 44, 31, 28, 2.4], [40, 45, 42, 30, 2.4], [46, 46, 51, 32, 2.2]];
      spikes.forEach(function (c) { d.po([[c[0] - c[4], c[1]], [c[2], c[3]], [c[0] + c[4], c[1]]], 'crys', { edge: true, light: 0.62 }); d.ln(c[0], c[1] - 2, c[2], c[3] + 3, 'crys2', 0.4); });
      d.px(37, 10, 'glow'); d.px(27.5, 23, 'glow'); d.px(46, 21, 'glow');
    }
  };

  // ================================================================ Pinecrest mountain
  // ===== cliff goat: stone-browed kid -> curl-horned ram -> peak-horned summit goat (Ground -> Ground -> Ground/Fighting) =====
  DESIGNS.crampling = {
    pal: { fur: '#c8b490', tuft: '#f2eadc', rock: '#8e8a86', hoof: '#4a3a30', iris: '#6a4a2a' },
    draw: function (d) {
      d.el(47, 42, 3, 2.4, 'tuft');
      d.ln(43, 47, 44, 59, 'fur', 2.2, 1.8); d.ln(39, 48, 39, 59, 'fur', 2.2, 1.8);
      d.el(44, 60, 2.4, 1.5, 'hoof'); d.el(39, 60, 2.4, 1.5, 'hoof');
      d.el(38, 45, 10, 7, 'fur');
      d.ln(29, 48, 28, 59, 'fur', 2.3, 1.9); d.ln(33, 49, 33, 59, 'fur', 2.3, 1.9);
      d.el(28, 60, 2.5, 1.5, 'hoof'); d.el(33, 60, 2.5, 1.5, 'hoof');
      d.el(29, 45, 5, 5.5, 'tuft');
      d.po([[28, 31], [37, 29], [31, 35]], 'fur', { edge: true });
      d.el(24, 35, 8, 7, 'fur');
      d.el(17.5, 38, 4.5, 3.5, 'tuft');
      d.po([[17, 41], [21, 41], [19, 46]], 'tuft');
      d.po([[19, 29], [20, 22], [24, 29]], 'rock', { edge: true });
      d.po([[24, 29], [27, 23], [28.5, 30]], 'rock', { edge: true });
      d.el(23.5, 30, 5.5, 2.4, 'rock', { edge: true });
      if (!d.back) {
        d.eye(22, 34, 2.4, 2.7, { look: [-0.4, 0] });
        d.px(14, 37, 'ink'); d.ln(15, 40, 18, 40.5, 'mouth', 0.4);
      }
    }
  };
  DESIGNS.ledgeram = {
    pal: { wool: '#ddd0b4', fur: '#a08868', rock: '#827c76', rockd: '#58524e', hoof: '#3e3028', iris: '#c89030' },
    draw: function (d) {
      d.ln(46, 46, 47, 59, 'fur', 3, 2.4); d.ln(41, 47, 41, 59, 'fur', 3, 2.4);
      d.el(47, 60, 3, 1.7, 'hoof'); d.el(41, 60, 3, 1.7, 'hoof');
      d.el(52, 37, 3, 2.6, 'wool');
      d.el(40, 40, 14, 10, 'wool');
      // stone shoulder plates
      d.po([[30, 31], [40, 28], [47, 31], [43, 36], [33, 37]], 'rock', { edge: true });
      d.ln(34, 33, 42, 31, 'rockd', 0.4);
      // front legs with stone knee guards
      d.ln(30, 46, 29, 59, 'fur', 3.2, 2.5); d.ln(35, 47, 35, 59, 'fur', 3.2, 2.5);
      d.el(29, 52, 2.8, 2.2, 'rock', { edge: true }); d.el(35, 53, 2.8, 2.2, 'rock', { edge: true });
      d.el(28.5, 60, 3.2, 1.7, 'hoof'); d.el(35, 60, 3.2, 1.7, 'hoof');
      // neck, head, curled stone horn
      d.ln(28, 36, 22, 30, 'fur', 5, 4.5);
      d.el(19, 28, 7.5, 7, 'fur');
      d.el(12, 32, 5, 4, 'fur');
      d.el(26, 24, 7.5, 7.5, 'rock', { edge: true });
      d.el(26, 24, 4.6, 4.6, 'rockd');
      d.el(25.5, 24.5, 2.4, 2.4, 'rock');
      d.po([[17, 21], [21, 16], [23, 22]], 'rock', { edge: true });
      if (!d.back) {
        d.eye(16.5, 27.5, 2.2, 2.4, { look: [-0.5, 0], lid: 0.3, lidMat: 'fur' });
        d.px(8, 31, 'ink'); d.ln(9, 34.5, 14, 35, 'mouth', 0.4);
      }
    }
  };
  DESIGNS.peakhorn = {
    pal: { fur: '#eeeae0', beard: '#b8b0a4', rock: '#6c6872', rockd: '#4a4650', snow: '=#ffffff', hoof: '#2e2830', iris: '#e0a030' },
    draw: function (d) {
      d.ln(48, 44, 50, 59, 'fur', 3.4, 2.6); d.ln(43, 45, 43, 59, 'fur', 3.4, 2.6);
      d.el(50, 60.5, 3.2, 1.6, 'hoof'); d.el(43, 60.5, 3.2, 1.6, 'hoof');
      d.el(53, 34, 3, 2.5, 'fur');
      d.el(41, 38, 14, 10, 'fur');
      // crags along the spine
      [[34, 28, 4], [40, 27, 5], [47, 28.5, 4]].forEach(function (p) { d.po([[p[0] - p[2], p[1] + 3], [p[0] - 1, p[1] - p[2]], [p[0] + p[2], p[1] + 3]], 'rock', { edge: true }); });
      // front legs with rock greaves
      d.ln(31, 44, 30, 59, 'fur', 3.5, 2.7); d.ln(36, 45, 36, 59, 'fur', 3.5, 2.7);
      d.po([[27, 50], [33, 50], [32.5, 57], [27.5, 57]], 'rock', { edge: true });
      d.po([[33, 51], [39, 51], [38.5, 57], [33.5, 57]], 'rock', { edge: true });
      d.el(29.5, 60.5, 3.4, 1.6, 'hoof'); d.el(36, 60.5, 3.4, 1.6, 'hoof');
      // chest mane, neck, head, beard
      d.el(29, 40, 7, 8, 'fur');
      d.ln(29, 34, 21, 22, 'fur', 6, 5);
      d.el(19, 20, 7, 6.5, 'fur');
      d.el(11.5, 24, 5.5, 3.6, 'fur');
      d.po([[10, 26], [18, 26], [14, 37]], 'beard');
      // two great horns shaped like mountain peaks, snow on the tips
      d.po([[15, 16], [17, 1], [22, 15]], 'rock', { edge: true });
      d.po([[20, 15], [27, 2], [27.5, 16]], 'rock', { edge: true });
      d.po([[16.2, 7], [17, 1], [18.8, 7]], 'snow');
      d.po([[23.8, 8], [27, 2], [27.3, 8]], 'snow');
      d.ln(17.5, 8, 19, 14, 'rockd', 0.4); d.ln(25.5, 9, 24.5, 14, 'rockd', 0.4);
      d.po([[23, 19], [30, 16], [25, 22]], 'fur', { edge: true });
      if (!d.back) {
        d.eye(16.5, 19.5, 2, 2.2, { look: [-0.5, 0], lid: 0.35, lidMat: 'fur' });
        d.px(7, 23, 'ink'); d.ln(8, 26, 13, 26.5, 'mouth', 0.4);
      }
    }
  };

  // ===== boulder beetle: pebble-backed beetle -> boulder-shelled pickaxe beetle (Bug/Ground) =====
  DESIGNS.pebbeetle = {
    pal: { shell: '#a09a90', shelld: '#6e685f', moss: '#6a9a48', body: '#3a3440', leg: '#2a2430', iris: '#e0b040' },
    draw: function (d) {
      [[24, 54, 20, 61], [32, 55, 31, 61.5], [42, 54, 46, 61]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'leg', 1.2, 0.8); });
      d.el(33, 53, 12, 5.5, 'body');
      d.el(35, 45, 13.5, 10.5, 'shell');
      d.speckle('shell', 'shelld', 16, 23, 36, 48, 54, 0.3);
      d.cv(31, 35.5, 34, 45, 31, 55, 'shelld', 0.45);
      d.el(40, 38.5, 4, 2, 'moss', { edge: true });
      d.el(20.5, 50, 5.5, 5, 'body');
      d.cv(19, 45.5, 16, 38, 11, 38, 'leg', 0.6); d.cv(22, 45.5, 22, 38, 18, 36, 'leg', 0.6);
      d.el(11, 38, 1.4, 1.4, 'shell'); d.el(18, 36, 1.4, 1.4, 'shell');
      if (!d.back) {
        d.eye(18.5, 49.5, 1.9, 2.1, { look: [-0.5, 0] });
        d.ln(15.5, 53, 18, 53.5, 'mouth', 0.4);
      }
    }
  };
  DESIGNS.bouldrone = {
    pal: { shell: '#8c8278', shelld: '#5a524a', crack: '#3a3430', body: '#2e2a36', leg: '#221e28', horn: '#c8bea8', glow: '=#ffb040', moss: '#5a8a40' },
    draw: function (d) {
      [[20, 50, 14, 61], [28, 52, 26, 61.5], [44, 52, 47, 61.5], [52, 50, 58, 61]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'leg', 2, 1.3); d.el(l[2], l[3], 2.2, 1, 'leg'); });
      d.el(36, 50, 16, 7, 'body');
      d.el(38, 37, 20, 16, 'shell');
      d.speckle('shell', 'shelld', 30, 20, 23, 56, 52, 0.28);
      d.ln(30, 22, 33, 31, 'crack', 0.5); d.ln(33, 31, 29, 38, 'crack', 0.5); d.ln(46, 24, 44, 33, 'crack', 0.5); d.ln(44, 33, 50, 40, 'crack', 0.5);
      d.el(44, 22, 6, 2.2, 'moss', { edge: true });
      // head with a pickaxe horn
      d.el(15, 46, 8, 7, 'body');
      d.cv(11, 41, 5, 31, 11, 21, 'horn', 2.6, 1.2, { edge: true });
      d.po([[3, 23], [11, 18], [22, 20], [12, 22.5]], 'horn', { edge: true });
      d.ln(8, 52, 5, 55, 'horn', 1, 0.5); d.ln(12, 53, 10, 57, 'horn', 1, 0.5);
      if (!d.back) {
        d.el(11, 45, 1.8, 1.4, 'glow'); d.el(17.5, 44, 1.8, 1.4, 'glow');
      }
    }
  };

  // ===== cave bat: fuzzy sonar pup -> big-mouthed flier -> stalactite-winged bat (Flying/Ghost) =====
  DESIGNS.echip = {
    pal: { fur: '#6e5c82', ear: '#f0a8b8', wing: '#4a3e5e', fang: '=#ffffff' },
    draw: function (d) {
      d.float = true;
      d.po([[24, 40], [8, 32], [12, 40], [6, 44], [14, 46], [12, 52], [24, 48]], 'wing', { edge: true });
      d.po([[40, 40], [56, 32], [52, 40], [58, 44], [50, 46], [52, 52], [40, 48]], 'wing', { edge: true });
      d.po([[24, 34], [17, 12], [31, 29]], 'fur', { edge: true });
      d.po([[33, 29], [47, 12], [40, 34]], 'fur', { edge: true });
      d.po([[25, 31], [19, 17], [29, 29]], 'ear'); d.po([[35, 29], [45, 17], [39, 31]], 'ear');
      d.el(32, 42, 11, 10.5, 'fur');
      d.el(27, 54, 1.8, 1.3, 'ear'); d.el(37, 54, 1.8, 1.3, 'ear');
      if (!d.back) {
        // eyes squeezed shut: it sees with sound
        d.cv(25, 40, 27, 38, 29, 40, 'ink', 0.5); d.cv(35, 40, 37, 38, 39, 40, 'ink', 0.5);
        d.el(32, 45.5, 3, 2.2, 'mouth');
        d.po([[29.8, 44], [31, 44], [30.4, 46.3]], 'fang'); d.po([[33, 44], [34.2, 44], [33.6, 46.3]], 'fang');
        d.px(24, 43, 'cheek'); d.px(40, 43, 'cheek');
      }
    }
  };
  DESIGNS.flittermaw = {
    pal: { fur: '#5a4a72', wing: '#3a2e50', memb: '#7a5a90', fang: '=#ffffff', ear: '#d890a8', iris: '#f0d040' },
    draw: function (d) {
      d.float = true;
      d.po([[26, 30], [2, 14], [4, 30], [1, 36], [8, 40], [6, 48], [18, 44], [24, 50]], 'memb', { edge: true });
      d.po([[38, 30], [62, 14], [60, 30], [63, 36], [56, 40], [58, 48], [46, 44], [40, 50]], 'memb', { edge: true });
      [[26, 30, 2, 14], [26, 32, 1, 36], [25, 36, 6, 48]].forEach(function (b) { d.ln(b[0], b[1], b[2], b[3], 'wing', 0.9, 0.5); d.ln(64 - b[0], b[1], 64 - b[2], b[3], 'wing', 0.9, 0.5); });
      d.el(32, 42, 7.5, 10, 'fur');
      d.ln(29, 51, 28, 57, 'fur', 1.2); d.ln(35, 51, 36, 57, 'fur', 1.2);
      d.po([[24, 22], [20, 6], [30, 18]], 'fur', { edge: true }); d.po([[34, 18], [44, 6], [40, 22]], 'fur', { edge: true });
      d.po([[25, 20], [22, 10], [29, 18]], 'ear'); d.po([[35, 18], [42, 10], [39, 20]], 'ear');
      d.el(32, 27, 10, 9, 'fur');
      if (!d.back) {
        d.eye(27.5, 23, 1.8, 1.8, { look: [0, 0] }); d.eye(36.5, 23, 1.8, 1.8, { look: [0, 0] });
        d.el(32, 31, 6.5, 4.5, 'mouth');
        d.el(32, 33.5, 3.5, 1.5, 'tongue');
        d.po([[27, 27.5], [29, 27.5], [28, 31]], 'fang'); d.po([[35, 27.5], [37, 27.5], [36, 31]], 'fang');
        d.po([[29.5, 35.5], [31, 35.5], [30.3, 33]], 'fang'); d.po([[33, 35.5], [34.5, 35.5], [33.8, 33]], 'fang');
      }
    }
  };
  DESIGNS.stalagwing = {
    pal: { fur: '#40364e', wing: '#2a2238', memb: '#4e3e62', stone: '#8e8898', glow: '=#8ff0ff', fang: '=#ffffff', ear: '#6a4a7a' },
    draw: function (d) {
      d.float = true;
      // wings like a cave ceiling, stalactites hanging from their lower edge
      [1, -1].forEach(function (s) {
        function X(x) { return s > 0 ? x : 64 - x; }
        d.po([[X(28), 26], [X(12), 10], [X(2), 7], [X(4), 22], [X(1), 36], [X(27), 42]], 'memb', { edge: true });
        d.ln(X(28), 27, X(2), 7, 'wing', 1.2, 0.6); d.ln(X(27), 30, X(4), 22, 'wing', 1, 0.5); d.ln(X(27), 34, X(1), 36, 'wing', 1, 0.5);
        [[3, 35.5, 6], [9, 37, 9], [15, 38.5, 6], [21, 40, 10]].forEach(function (t) { d.po([[X(t[0] - 2.2), t[1]], [X(t[0]), t[1] + t[2]], [X(t[0] + 2.2), t[1] + 0.8]], 'stone', { edge: true }); });
        d.po([[X(8), 12], [X(10), 5], [X(12), 13]], 'stone', { edge: true });
      });
      d.el(32, 40, 8, 11, 'fur');
      d.po([[28, 36], [36, 36], [32, 47]], 'stone', { edge: true });
      d.ln(29, 50, 28, 58, 'fur', 1.3); d.ln(35, 50, 36, 58, 'fur', 1.3);
      d.el(27.5, 58.5, 2, 1, 'stone'); d.el(36.5, 58.5, 2, 1, 'stone');
      d.po([[25, 22], [21, 2], [30, 17]], 'fur', { edge: true }); d.po([[34, 17], [43, 2], [39, 22]], 'fur', { edge: true });
      d.po([[26, 19], [23, 7], [29, 17]], 'ear'); d.po([[35, 17], [41, 7], [38, 19]], 'ear');
      d.el(32, 24, 9, 8, 'fur');
      if (!d.back) {
        d.el(28, 22.5, 2.3, 1.6, 'glow'); d.el(36, 22.5, 2.3, 1.6, 'glow');
        d.ln(25, 20, 30, 21.5, 'ink', 0.5); d.ln(34, 21.5, 39, 20, 'ink', 0.5);
        d.ln(28.5, 28, 35.5, 28, 'mouth', 0.5);
        d.po([[29, 28], [30.4, 28], [29.7, 31]], 'fang'); d.po([[33.6, 28], [35, 28], [34.3, 31]], 'fang');
      }
    }
  };

  // ===== blind cave salamander: wick-tailed newt -> lantern-spotted salamander (Water -> Water/Fairy) =====
  DESIGNS.palewick = {
    pal: { body: '#f2dce0', belly: '#fff4f0', spot: '#e0a8b8', glow: '=#fff2a0', halo: '=#fffbe8' },
    draw: function (d) {
      d.cv(42, 54, 56, 54, 54, 37, 'body', 4, 1.2);
      d.el(54, 34, 2.2, 3, 'glow'); d.px(54, 31, 'halo');
      d.ln(26, 56, 24, 60, 'body', 2, 1.6); d.ln(39, 57, 40, 60, 'body', 2, 1.6);
      d.el(23.5, 60.5, 2.6, 1.4, 'body'); d.el(40.5, 60.5, 2.6, 1.4, 'body');
      d.el(33, 53, 11, 6.5, 'body');
      d.el(31, 57, 8, 2.5, 'belly', { clip: function (x, y) { return y > 55; } });
      d.speckle('body', 'spot', 10, 26, 48, 44, 56, 0.5);
      d.el(19, 47, 8.5, 7, 'body');
      d.cv(16, 41, 14, 36, 10, 35, 'body', 0.7, 0.4); d.cv(21, 40.5, 22, 35, 26, 33, 'body', 0.7, 0.4);
      d.el(10, 35, 1.1, 1.1, 'glow'); d.el(26, 33, 1.1, 1.1, 'glow');
      if (!d.back) {
        // no eyes at all, just two pale spots
        d.px(15, 45, 'spot'); d.px(22, 45, 'spot');
        d.cv(13, 50, 18, 52.5, 23, 50, 'mouth', 0.45);
        d.px(12, 48, 'cheek'); d.px(25, 48, 'cheek');
      }
    }
  };
  DESIGNS.gloamander = {
    pal: { body: '#b8a8d0', belly: '#e8e0f4', spot: '=#9af0ff', glow: '=#fff2a0', frill: '#7a6a98' },
    draw: function (d) {
      d.cv(46, 50, 63, 46, 58, 27, 'body', 5, 1.6);
      d.el(58, 24, 3, 4, 'glow');
      d.ln(24, 52, 20, 60, 'body', 3, 2.4); d.el(19, 61, 3.2, 1.4, 'body');
      d.ln(44, 53, 47, 60, 'body', 3, 2.4); d.el(48, 61, 3.2, 1.4, 'body');
      d.el(34, 48, 15, 8.5, 'body');
      d.el(32, 53.5, 11, 3, 'belly', { clip: function (x, y) { return y > 52; } });
      d.ln(30, 53, 28, 60, 'body', 2.6, 2); d.el(27.5, 61, 3, 1.3, 'body');
      d.po([[20, 34], [24, 26], [27, 36]], 'frill', { edge: true }); d.po([[24, 36], [30, 30], [30, 39]], 'frill', { edge: true });
      d.el(17, 40, 10, 7.5, 'body');
      [[26, 41], [32, 40], [38, 40.5], [44, 42], [50, 44.5], [56, 40]].forEach(function (p) { d.el(p[0], p[1], 1.5, 1.3, 'spot'); });
      d.el(14, 35.5, 1.8, 1.8, 'spot');
      if (!d.back) {
        d.cv(8, 43, 14, 46, 21, 44, 'mouth', 0.45);
        d.px(10, 41, 'belly'); d.px(18, 41, 'belly');
      }
    }
  };

  // ===== glow moth: ringed glowgrub -> lantern-winged moth (Bug/Fairy) =====
  DESIGNS.glowgrub = {
    pal: { body: '#ece2b8', band: '=#c8ff7a', head: '#d8b890', iris: '#4a3a2a' },
    draw: function (d) {
      [[47, 53, 6.5], [39, 50, 8], [30, 47, 9]].forEach(function (s) { d.el(s[0], s[1], s[2], s[2] * 0.9, 'body', { edge: true }); });
      d.cv(43, 45, 44.5, 52, 43, 58, 'band', 0.7); d.cv(34.5, 40, 36, 48, 34.5, 56, 'band', 0.8);
      d.el(53, 55, 1.8, 1.8, 'band');
      [[26, 55.5], [32, 56], [38, 57], [44, 58.5]].forEach(function (p) { d.el(p[0], p[1], 1.2, 1.4, 'head'); });
      d.el(19, 47, 8, 7.5, 'head');
      d.ln(13, 52, 11, 55, 'head', 0.9, 0.5); d.ln(17, 53, 16, 56, 'head', 0.9, 0.5);
      if (!d.back) {
        d.eye(16, 46, 2, 2.2, { lid: 0.45, lidMat: 'head' }); d.eye(22, 46, 2, 2.2, { lid: 0.45, lidMat: 'head' });
        d.px(19, 50, 'mouth');
      }
    }
  };
  DESIGNS.glimmoth = {
    pal: { wing: '#5e6e92', wing2: '#8a9ab8', spot: '=#d4ff8a', fur: '#ece2c6', ant: '#b8a878', iris: '#2a2a3a' },
    draw: function (d) {
      d.float = true;
      [1, -1].forEach(function (s) {
        function X(x) { return s > 0 ? x : 64 - x; }
        d.po([[X(30), 34], [X(8), 12], [X(2), 24], [X(8), 38], [X(29), 40]], 'wing', { edge: true });
        d.po([[X(30), 40], [X(14), 43], [X(10), 55], [X(22), 57], [X(30), 46]], 'wing2', { edge: true });
        d.el(X(13), 25, 4.2, 3.8, 'spot'); d.el(X(13), 25, 1.9, 1.7, 'wing');
        d.el(X(19), 50, 2.2, 2.2, 'spot');
        d.cv(X(30), 26, X(26), 15, X(20), 11, 'ant', 0.8, 0.5);
        [[27, 18], [24, 14]].forEach(function (a) { d.ln(X(a[0]), a[1], X(a[0] - 2), a[1] - 1, 'ant', 0.35); });
      });
      d.el(32, 45, 4.5, 10, 'fur');
      d.el(32, 36, 6.5, 3, 'fur');
      d.el(32, 30, 6, 5.5, 'fur');
      if (!d.back) {
        d.eye(29.5, 30, 1.7, 1.9, { look: [0, 0] }); d.eye(34.5, 30, 1.7, 1.9, { look: [0, 0] });
      }
    }
  };

  // ===== crystal lizard: quartz-backed lizard -> crystal-spined lizard -> crystal-frilled basilisk (Ground -> Ground/Fairy) =====
  DESIGNS.quartzel = {
    pal: { skin: '#78aca0', belly: '#e2ead0', crys: '#e4eeff', crys2: '=#ffffff', iris: '#e8a030' },
    draw: function (d) {
      d.cv(42, 55, 56, 58, 60, 50, 'skin', 3, 0.8);
      d.ln(40, 55, 45, 60, 'skin', 2.2, 1.6); d.el(46, 61, 2.6, 1, 'skin');
      d.el(35, 52, 11, 6.5, 'skin');
      d.el(33, 55.5, 8, 2.5, 'belly', { clip: function (x, y) { return y > 54; } });
      d.ln(28, 55, 24, 60, 'skin', 2.2, 1.6); d.el(23, 61, 2.6, 1, 'skin');
      d.po([[30, 47], [34, 31], [38.5, 46]], 'crys', { edge: true, light: 0.7 });
      d.po([[36.5, 47], [41, 38], [43, 48]], 'crys', { edge: true, light: 0.7 });
      d.ln(33, 44, 34, 34, 'crys2', 0.4);
      d.el(20, 48, 8, 6, 'skin');
      d.el(13.5, 50, 4.5, 3.4, 'skin');
      if (!d.back) {
        d.eye(18.5, 46.5, 2.3, 2.4, { look: [-0.4, 0] });
        d.px(10, 49, 'ink'); d.ln(10, 52, 17, 52.5, 'mouth', 0.4);
      }
    }
  };
  DESIGNS.facetail = {
    pal: { skin: '#5a8c94', belly: '#d8e4d8', crys: '#a8d4ff', crys2: '=#ffffff', iris: '#f0c030' },
    draw: function (d) {
      d.cv(44, 50, 60, 54, 59, 38, 'skin', 3.6, 1.4);
      [[59, 34, 7, 2.6], [55, 37, 5, 2], [62, 38, 4, 1.6]].forEach(function (c) { d.po([[c[0] - c[3], c[1] + 2], [c[0], c[1] - c[2]], [c[0] + c[3], c[1] + 2]], 'crys', { edge: true }); });
      d.ln(46, 50, 50, 60, 'skin', 3, 2.2); d.el(51, 61, 3, 1.2, 'skin');
      d.el(34, 46, 14, 8, 'skin');
      d.el(32, 51, 10, 3, 'belly', { clip: function (x, y) { return y > 49.5; } });
      d.ln(26, 50, 22, 60, 'skin', 3, 2.2); d.el(21, 61, 3.2, 1.2, 'skin');
      d.ln(36, 51, 36, 60, 'skin', 2.6, 2); d.el(35.5, 61, 3, 1.1, 'skin');
      [[24, 40, 4, 2.4], [30, 38, 7, 3], [37, 37, 8, 3.2], [44, 39, 6, 2.6], [50, 43, 4, 2]].forEach(function (c) { d.po([[c[0] - c[3], c[1] + 2], [c[0], c[1] - c[2]], [c[0] + c[3], c[1] + 2]], 'crys', { edge: true, light: 0.66 }); d.ln(c[0] - 0.6, c[1], c[0], c[1] - c[2] + 2, 'crys2', 0.35); });
      d.el(16, 40, 8.5, 6.5, 'skin');
      d.el(9, 43, 5, 3.5, 'skin');
      d.po([[7, 40], [9, 34], [11, 40]], 'crys', { edge: true });
      if (!d.back) {
        d.eye(14.5, 38.5, 2.2, 2.3, { look: [-0.5, 0], lid: 0.25, lidMat: 'skin' });
        d.px(5, 42, 'ink'); d.ln(5, 45.5, 13, 46, 'mouth', 0.4);
      }
    }
  };
  DESIGNS.crystalisk = {
    pal: { skin: '#3a6272', belly: '#c8dce0', crys: '#9adcff', crys2: '=#eaffff', glow: '=#c8f8ff', iris: '#ff5a8a' },
    draw: function (d) {
      // crystal frill fanning out behind the head
      for (var i = 0; i < 7; i++) {
        var a = -2.75 + i * 0.36, cx = 30, cy = 20, len = i % 2 ? 15 : 19;
        d.po([[cx + Math.cos(a - 0.16) * 6, cy + Math.sin(a - 0.16) * 6], [cx + Math.cos(a) * len, cy + Math.sin(a) * len], [cx + Math.cos(a + 0.16) * 6, cy + Math.sin(a + 0.16) * 6]], 'crys', { edge: true, light: 0.7 });
      }
      d.cv(40, 54, 58, 60, 62, 44, 'skin', 5, 1.5);
      [[52, 55, 4], [58, 51, 3.5], [61, 45, 3]].forEach(function (c) { d.po([[c[0] - 1.6, c[1]], [c[0] + 1, c[1] - c[2] - 2], [c[0] + 1.8, c[1] - 0.5]], 'crys', { edge: true }); });
      d.el(40, 50, 7, 9, 'skin');
      d.el(42, 61, 5, 1.8, 'skin'); d.el(26, 61, 5, 1.8, 'skin');
      d.ln(28, 50, 27, 60, 'skin', 3.6, 3);
      d.el(32, 39, 10, 14, 'skin');
      d.el(28, 42, 5.5, 10, 'belly', { clip: function (x, y) { return x < 32; } });
      d.el(29, 32, 2.3, 2.3, 'glow', { edge: true });
      d.ln(26, 35, 19, 43, 'skin', 2.6, 2); d.po([[16, 44], [19, 42], [18, 46]], 'crys');
      d.el(26, 20, 8, 7, 'skin');
      d.el(17.5, 23, 6, 3.8, 'skin');
      if (!d.back) {
        d.eye(23.5, 18.5, 2.3, 1.8, { slit: true, look: [-0.5, 0], lid: 0.3, lidMat: 'skin' });
        d.ln(19, 16.5, 26, 16, 'ink', 0.5);
        d.px(12.5, 22, 'ink'); d.ln(12, 25, 21, 25.5, 'mouth', 0.4); d.px(15, 26, 'white');
      }
    }
  };

  // ===== fossil Kit: amber-studded jaw beast -> rune-armored titan (Ground/Dragon) =====
  DESIGNS.amberjaw = {
    pal: { skin: '#8e6c4c', skind: '#5e4630', amber: '#f0a02a', bone: '#e8dcbc', iris: '#f0d060' },
    draw: function (d) {
      d.cv(47, 50, 57, 52, 59, 45, 'skin', 4, 2);
      d.ln(46, 51, 47, 60, 'skin', 3.4, 3); d.el(47, 61, 3.8, 1.4, 'skin');
      d.el(38, 46, 13, 9, 'skin');
      d.ln(26, 42, 34, 50, 'skind', 0.4); d.ln(34, 50, 42, 42, 'skind', 0.4); d.ln(42, 42, 48, 49, 'skind', 0.4);
      d.el(36, 38, 4, 3, 'amber', { edge: true }); d.el(44, 40, 3, 2.5, 'amber', { edge: true }); d.el(29, 39.5, 2.5, 2, 'amber', { edge: true });
      d.ln(31, 51, 31, 60, 'skin', 3.6, 3.2); d.el(30.5, 61, 4, 1.4, 'skin');
      [[27, 61.5], [29.5, 62], [33.5, 61.5], [44, 61.5], [50, 61.5]].forEach(function (p) { d.px(p[0], p[1], 'bone'); });
      // big square head and jaw
      d.el(18, 43, 10, 8, 'skin');
      d.po([[7, 46], [26, 47], [24, 55], [10, 54]], 'skind', { edge: true });
      [10, 13, 16, 19, 22].forEach(function (x) { d.po([[x - 1, 47], [x, 44], [x + 1, 47]], 'bone'); });
      d.el(19, 36.5, 5.5, 2.2, 'bone', { edge: true });
      if (!d.back) {
        d.eye(16, 40.5, 2, 2.2, { look: [-0.5, 0], lid: 0.3, lidMat: 'skin' });
        d.px(8, 42, 'ink');
      }
    }
  };
  DESIGNS.runemaw = {
    pal: { skin: '#6e5236', skind: '#4a3622', amber: '#f4a824', rune: '=#ffe48a', bone: '#e4d6b4', iris: '#ffd040' },
    draw: function (d) {
      d.cv(52, 46, 62, 50, 60, 38, 'skin', 5, 2.5);
      d.el(60, 36, 3.5, 3.5, 'amber', { edge: true });
      d.ln(50, 48, 52, 60, 'skin', 4.6, 4); d.el(52, 61, 5, 1.6, 'skin');
      d.el(38, 42, 17, 12, 'skin');
      // bone plates along the back with glowing rune carvings
      [[25, 31, 5], [33, 27, 6], [42, 27, 6], [50, 31, 5]].forEach(function (p) {
        d.po([[p[0] - p[2], p[1] + 5], [p[0] - p[2] + 1.5, p[1] - 1], [p[0] + p[2] - 1.5, p[1] - 1], [p[0] + p[2], p[1] + 5]], 'bone', { edge: true });
        d.ln(p[0] - 2, p[1] + 1, p[0], p[1] + 3.5, 'rune', 0.4); d.ln(p[0], p[1] + 3.5, p[0] + 2, p[1] + 1, 'rune', 0.4);
      });
      d.el(38, 46, 6, 4, 'amber', { edge: true });
      d.ln(36, 44.5, 40, 47.5, 'rune', 0.35);
      d.ln(30, 50, 29, 60, 'skin', 4.6, 4); d.el(28, 61, 5, 1.6, 'skin');
      d.ln(40, 51, 40, 60, 'skin', 4.2, 3.6); d.el(40, 61, 4.6, 1.5, 'skin');
      [[24, 62], [27, 62], [37.5, 62], [48.5, 62], [55, 62]].forEach(function (p) { d.po([[p[0] - 1, p[1]], [p[0] - 0.5, p[1] - 2.5], [p[0] + 1, p[1]]], 'bone'); });
      // massive head, tusks and forehead amber
      d.el(15, 38, 11, 9, 'skin');
      d.po([[3, 42], [24, 44], [22, 52], [6, 51]], 'skind', { edge: true });
      d.cv(8, 44, 4, 38, 9, 32, 'bone', 1.8, 0.6, { edge: true });
      [11, 15, 19].forEach(function (x) { d.po([[x - 1, 44], [x, 41], [x + 1, 44]], 'bone'); });
      d.el(16, 31, 3.4, 3, 'amber', { edge: true });
      d.po([[12, 29], [20, 29], [19, 26], [13, 26]], 'bone', { edge: true });
      if (!d.back) {
        d.eye(12, 36, 2, 2, { look: [-0.5, 0], lid: 0.35, lidMat: 'skin' });
        d.ln(8, 34, 15, 33.5, 'ink', 0.5);
      }
    }
  };

  // ===== snow hare: icicle-eared lop -> snowdrift-maned hare (Ice -> Ice/Flying) =====
  DESIGNS.flurrip = {
    pal: { fur: '#f4f8ff', ice: '#a8dcf4', nose: '#f0a0b0', iris: '#4a90d0' },
    draw: function (d) {
      d.el(46, 48, 4.2, 4, 'fur');
      d.el(34, 50, 11, 9, 'fur');
      d.el(25, 60, 4.5, 1.8, 'fur'); d.el(40, 60, 4, 1.6, 'fur');
      d.cv(19, 33, 11, 32, 12, 46, 'fur', 2.6, 1.8, { edge: true });
      d.po([[10.3, 46], [13.8, 46], [12, 53]], 'ice', { edge: true });
      d.cv(29, 33, 37, 31, 36, 46, 'fur', 2.6, 1.8, { edge: true });
      d.po([[34.2, 46], [37.8, 46], [36, 53]], 'ice', { edge: true });
      d.el(24, 38, 8.5, 7.5, 'fur', { edge: true });
      d.px(30, 51, 'ice'); d.px(33, 47, 'ice'); d.px(40, 53, 'ice');
      if (!d.back) {
        d.eye(20.5, 38, 2.2, 2.5, { look: [-0.2, 0] }); d.eye(27.5, 38, 2.2, 2.5, { look: [-0.2, 0] });
        d.px(24, 41, 'nose'); d.ln(23, 43, 25, 43, 'mouth', 0.35);
      }
    }
  };
  DESIGNS.avalop = {
    pal: { fur: '#eef4ff', drift: '#c4d4ea', ice: '#94ccef', ice2: '=#ffffff', nose: '#e890a8', iris: '#2a70c0' },
    draw: function (d) {
      // ears streaming back with icicle tips
      d.cv(31, 18, 40, 8, 54, 8, 'fur', 2.8, 1.6, { edge: true });
      d.po([[52.5, 9], [56, 8], [55, 15]], 'ice', { edge: true });
      d.cv(28, 18, 34, 4, 46, 2, 'fur', 2.6, 1.5, { edge: true });
      d.po([[44.5, 2.5], [48, 2], [47, 9]], 'ice', { edge: true });
      d.el(38, 50, 7, 8.5, 'fur');
      d.el(42, 60, 6.5, 2.2, 'fur'); d.el(22, 60, 6, 2.2, 'fur');
      d.ln(27, 48, 23, 59, 'fur', 3, 2.4);
      d.el(31, 44, 9, 11, 'fur');
      // snowdrift mane around the neck
      [[22, 34, 5], [28, 31, 6], [35, 32, 5.5], [40, 36, 4], [25, 39, 4]].forEach(function (b) { d.el(b[0], b[1], b[2], b[2] * 0.8, 'drift', { edge: true }); });
      d.ln(23, 42, 17, 49, 'fur', 2.4, 2); d.po([[14, 50], [17, 48], [16.5, 52]], 'ice');
      d.el(27, 23, 7.5, 7, 'fur');
      if (!d.back) {
        d.eye(24, 22.5, 2, 2.3, { look: [-0.4, 0], lid: 0.2, lidMat: 'fur' }); d.eye(30, 22.5, 2, 2.3, { look: [-0.4, 0], lid: 0.2, lidMat: 'fur' });
        d.px(26.5, 26, 'nose'); d.ln(25.5, 28, 27.5, 28, 'mouth', 0.35);
      }
      d.px(33, 46, 'ice2'); d.px(29, 50, 'ice2');
    }
  };

  // ===== frost owl: snowball owlet -> icicle-crowned owl (Ice/Flying) =====
  DESIGNS.hailet = {
    pal: { fur: '#eef4fa', feather: '#b8cfe6', beak: '#e8b040', iris: '#58a8e8', ice: '=#cfeeff' },
    draw: function (d) {
      d.el(28, 61, 2.6, 1.2, 'beak'); d.el(36, 61, 2.6, 1.2, 'beak');
      d.el(32, 50, 11, 11, 'fur');
      d.el(21.5, 51, 3, 6, 'feather', { edge: true }); d.el(42.5, 51, 3, 6, 'feather', { edge: true });
      d.po([[23, 41], [22, 35], [27, 39]], 'feather'); d.po([[37, 39], [42, 35], [41, 41]], 'feather');
      d.ln(28, 56, 36, 56, 'ice', 0.4); d.ln(32, 52.5, 32, 59.5, 'ice', 0.4); d.ln(29.5, 53.5, 34.5, 58.5, 'ice', 0.35); d.ln(34.5, 53.5, 29.5, 58.5, 'ice', 0.35);
      if (!d.back) {
        d.eye(27, 46, 3.2, 3.4, { look: [0, 0] }); d.eye(37, 46, 3.2, 3.4, { look: [0, 0] });
        d.po([[30.8, 49.5], [33.2, 49.5], [32, 52.5]], 'beak');
      }
    }
  };
  DESIGNS.glacrown = {
    pal: { fur: '#f2f6fc', feather: '#a8c4e0', cape: '#6a88b0', beak: '#e0a830', iris: '#9ad8f8', ice: '#9ad8f8', ice2: '=#ffffff' },
    draw: function (d) {
      d.el(27, 61, 3, 1.3, 'beak'); d.el(37, 61, 3, 1.3, 'beak');
      d.el(32, 43, 11, 16, 'fur');
      // cape-like wings with frost patterns
      [1, -1].forEach(function (s) {
        function X(x) { return s > 0 ? x : 64 - x; }
        d.po([[X(24), 30], [X(14), 38], [X(12), 58], [X(18), 54], [X(22), 58], [X(25), 44]], 'cape', { edge: true });
        d.ln(X(19), 40, X(16), 52, 'ice', 0.35); d.ln(X(16), 46, X(20), 49, 'ice', 0.35);
      });
      [[30, 38], [34, 42], [29, 46], [35, 49], [31, 53]].forEach(function (p) { d.po([[p[0] - 1.5, p[1]], [p[0], p[1] + 2], [p[0] + 1.5, p[1]]], 'feather'); });
      d.el(32, 24, 10, 8.5, 'fur');
      // crown of icicles
      [[25, 18, 7], [29, 16, 10], [35, 16, 10], [39, 18, 7], [32, 16, 6]].forEach(function (c) { d.po([[c[0] - 2, c[1]], [c[0], c[1] - c[2]], [c[0] + 2, c[1]]], 'ice', { edge: true, light: 0.7 }); d.ln(c[0] - 0.4, c[1] - 1, c[0], c[1] - c[2] + 2, 'ice2', 0.3); });
      if (!d.back) {
        d.eye(27.5, 24, 2.6, 2.6, { look: [0, 0] }); d.eye(36.5, 24, 2.6, 2.6, { look: [0, 0] });
        d.ln(24, 20.5, 30, 22, 'ink', 0.5); d.ln(34, 22, 40, 20.5, 'ink', 0.5);
        d.po([[30.5, 27], [33.5, 27], [32, 31]], 'beak');
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
