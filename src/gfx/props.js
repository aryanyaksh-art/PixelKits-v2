// Furniture and decor ("props"): each kind has its own draw code. Registered into PK.BUILDINGS like buildings.
// Placed from map data as props: [[kind, x, y, {w, h, color, icon, art, variant, text, talk, use, deco, walk}]].
// A prop's footprint is w x h tiles (solid unless walk); its art can be taller (dh) and extends upward, so
// furniture stands against the back wall. deco props hang on wall tiles and are drawn first.
(function () {
  'use strict';
  var PK = window.PK;
  var sh = function (c, a) { return PK.color.shade(c, a); };
  var OUT = '#1e1a28';
  var WOOD = '#a8743e', WOODL = '#c8925a', WOODD = '#6a4424';
  var KINDS = {};

  function A(w, h) { return new PK.buildings2.Art(w, h); }
  // Solid shaded block with outline: top face lighter, front darker
  function block(a, x, y, w, h, col, top) {
    a.f(OUT, x - 1, y - 1, w + 2, h + 2);
    a.f(col, x, y, w, h);
    if (top) { a.f(sh(col, 0.22), x, y, w, top); a.f(sh(col, 0.4), x, y, w, 1); }
    a.f(sh(col, -0.25), x, y + h - 1, w, 1);
  }
  function def(name, o) { o.custom = true; o.prop = true; if (o.door === undefined) o.door = null; KINDS[name] = o; PK.BUILDINGS[name] = o; }
  function canvas(o, dh) { return A(o.w * 16, Math.max(dh || 0, o.h * 16)); }
  // y of the footprint's top inside a canvas taller than the footprint
  function base(a, o) { return a.H - o.h * 16; }

  // ================= Interior: walls and wall decor =================
  def('window', { w: 1, h: 1, deco: true, walk: true, text: 'You can see the sky outside.', draw: function (o) {
    var a = canvas(o, 16), W = o.w * 16;
    a.f(OUT, 2, 1, W - 4, 13); a.f('#fcfcfc', 3, 2, W - 6, 11);
    a.f(o.variant === 'night' ? '#2a3a6a' : '#8ad0f6', 4, 3, W - 8, 9); a.f('#c8ecff', 4, 3, W - 8, 3);
    a.f('#fcfcfc', W / 2 - 0.5, 3, 1, 9); a.f('#fcfcfc', 4, 7, W - 8, 1);
    var c = o.color || '#d8584a';
    a.f(sh(c, -0.3), 1, 1, 3, 14); a.f(c, 1, 1, 2, 13); a.f(sh(c, -0.3), W - 4, 1, 3, 14); a.f(c, W - 3, 1, 2, 13);
    a.f(WOODD, 0, 0, W, 2);
    return a.c;
  } });
  def('painting', { w: 1, h: 1, deco: true, walk: true, text: 'A painting of the Willow valley at sunset.', draw: function (o) {
    var a = canvas(o, 16), W = o.w * 16, art = o.art || 'hills';
    a.f(OUT, 1, 2, W - 2, 12); a.f('#c89a4a', 2, 3, W - 4, 10); a.f(sh('#c89a4a', 0.3), 2, 3, W - 4, 1);
    var ix = 4, iy = 5, iw = W - 8, ih = 6;
    if (art === 'hills') { a.f('#f8c878', ix, iy, iw, 3); a.f('#6aaa58', ix, iy + 3, iw, 3); a.f('#4a8a48', ix + 2, iy + 2, 4, 2); a.p('#f8f0a0', ix + iw - 3, iy + 1); }
    else if (art === 'sea') { a.f('#9ad0f6', ix, iy, iw, 3); a.f('#3a78c8', ix, iy + 3, iw, 3); a.f('#fcfcfc', ix + 2, iy + 3, 3, 1); }
    else if (art === 'kit') { a.f('#e8d8b0', ix, iy, iw, ih); PK.kitArt && a.x.drawImage(PK.kitArt.icon(o.icon || 4), 0, 0, 32, 32, ix, iy - 1, ih + 1, ih + 1); }
    else if (art === 'family') { a.f('#e8e0d0', ix, iy, iw, ih); [[ix + 1, '#6a4020'], [ix + 4, '#e8e4f0'], [ix + 7, '#2a1a14']].forEach(function (p) { if (p[0] < ix + iw - 1) { a.f(p[1], p[0], iy + 1, 2, 2); a.f('#5a8a5a', p[0], iy + 3, 2, 3); } }); }
    else if (art === 'map') { a.f('#e8d8a8', ix, iy, iw, ih); a.f('#6aaa58', ix + 1, iy + 1, 4, 3); a.f('#4a8ae0', ix + 5, iy + 2, 2, 4); a.p('#d83a3a', ix + 3, iy + 2); }
    return a.c;
  } });
  def('clock', { w: 1, h: 1, deco: true, walk: true, anim: true, text: 'Tick... tock... tick...', draw: function (o) {
    var a = canvas(o, 16);
    a.ring(OUT, 8, 7, 6.5); a.ring('#8a5a30', 8, 7, 5.5); a.ring('#fcf8e8', 8, 7, 4.5);
    a.f(OUT, 7.5, 4, 1, 3); a.f(OUT, 8, 7, 3, 1);
    var sw = [-2, 0, 2][o.frame % 3];
    a.line(WOODD, 8, 12, 8 + sw, 15, 1); a.ring('#e8b840', 8 + sw, 15, 1.4);
    return a.c;
  } });
  def('photos', { w: 2, h: 1, deco: true, walk: true, text: 'Old family photos. Grandpa, young and grinning, holding up a Kit capsule.', draw: function (o) {
    var a = canvas(o, 16);
    [[2, 3, 9, 8], [13, 2, 7, 10], [22, 4, 8, 7]].forEach(function (r, i) {
      a.f(OUT, r[0] - 1, r[1] - 1, r[2] + 2, r[3] + 2); a.f(i === 1 ? '#6a4424' : '#c89a4a', r[0], r[1], r[2], r[3]);
      a.f('#e8e0cc', r[0] + 1, r[1] + 1, r[2] - 2, r[3] - 2);
      a.f(['#3a2a22', '#e8e4f0', '#6a4020'][i], r[0] + r[2] / 2 - 1, r[1] + 2, 2, 2); a.f('#5a7a9a', r[0] + r[2] / 2 - 1.5, r[1] + 4, 3, r[3] - 5);
    });
    return a.c;
  } });
  def('herbs', { w: 2, h: 1, deco: true, walk: true, text: 'Bundles of drying herbs hang from a rail. The whole room smells like mint and sage.', draw: function (o) {
    var a = canvas(o, 16);
    a.f(WOODD, 0, 1, 32, 2);
    var cols = ['#5a9a44', '#7aaa58', '#8a7a4a', '#4a8a6a', '#9aaa5a'];
    for (var i = 0; i < 5; i++) {
      var x = 2 + i * 6;
      a.line('#b89060', x + 2, 3, x + 2, 5, 1);
      a.f(OUT, x, 5, 5, 9); a.f(cols[i], x + 1, 5, 3, 8); a.f(sh(cols[i], 0.3), x + 1, 5, 1, 7); a.p(i % 2 ? '#c070e0' : '#f8f0a0', x + 2, 12);
    }
    return a.c;
  } });
  def('board', { w: 2, h: 1, deco: true, walk: true, text: 'A board covered in sketches of Kits and arrows labeled "flow rate?"', draw: function (o) {
    var a = canvas(o, 16), W = o.w * 16, chalk = o.variant === 'chalk';
    a.f(OUT, 0, 1, W, 14); a.f(chalk ? '#8a6a3a' : '#b0b6c4', 1, 2, W - 2, 12); a.f(chalk ? '#2a4a3a' : '#fcfcfc', 2, 3, W - 4, 10);
    var ink = chalk ? '#e8f0e0' : '#3a5aa0';
    if (chalk) {
      var ty = ['Leaf', 'Tide', 'Blaze'];
      for (var i = 0; i < 3; i++) { var x = 5 + i * ((W - 10) / 3); a.f(PK.TYPES[ty[i]].color, x, 5, 5, 3); a.f(ink, x + 6, 6, 3, 1); a.p(ink, x + 8, 5); a.p(ink, x + 8, 7); }
      a.f(ink, 5, 10, W - 14, 1);
    } else {
      a.ring(ink, 8, 7, 3, 2); a.line(ink, 12, 7, 20, 6, 1); a.f('#d83a3a', 22, 4, 5, 5); a.f(ink, 4, 11, 20, 1);
    }
    a.f('#e8e0d0', W - 8, 13, 5, 1);
    return a.c;
  } });
  def('gearwall', { w: 2, h: 2, deco: true, walk: true, anim: true, text: 'A huge gear, turned by the waterwheel outside. It never stops.', draw: function (o) {
    var a = canvas(o, 32), ang = o.frame * Math.PI / 12;
    function gear(cx, cy, r, n, col, rot) {
      a.ring(OUT, cx, cy, r + 3); a.ring(col, cx, cy, r + 2);
      for (var i = 0; i < n; i++) { var t = rot + i * 2 * Math.PI / n; a.line(OUT, cx + Math.cos(t) * r, cy + Math.sin(t) * r, cx + Math.cos(t) * (r + 4.5), cy + Math.sin(t) * (r + 4.5), 3); a.line(col, cx + Math.cos(t) * r, cy + Math.sin(t) * r, cx + Math.cos(t) * (r + 4), cy + Math.sin(t) * (r + 4), 2); }
      a.ring(sh(col, -0.3), cx, cy, r - 1); a.ring(col, cx, cy, r - 3);
      for (var j = 0; j < 4; j++) { var u = rot + j * Math.PI / 2; a.line(sh(col, -0.3), cx, cy, cx + Math.cos(u) * (r - 2), cy + Math.sin(u) * (r - 2), 1); }
      a.ring(OUT, cx, cy, 2.2); a.ring('#c8c8d0', cx, cy, 1.4);
    }
    gear(12, 13, 7, 10, '#8a8a94', ang);
    gear(24, 24, 4, 8, '#a87a44', -ang * 1.7 + 0.2);
    return a.c;
  } });
  def('pipes', { w: 2, h: 1, deco: true, walk: true, anim: true, text: 'Pressure gauges. The needles are finally back in the green.', draw: function (o) {
    var a = canvas(o, 16);
    a.f(OUT, 0, 3, 32, 5); a.f('#8a94a4', 0, 4, 32, 3); a.f('#b0b8c8', 0, 4, 32, 1);
    a.f(OUT, 6, 0, 5, 16); a.f('#8a94a4', 7, 0, 3, 16);
    [[20, 9], [28, 9]].forEach(function (g, i) { a.ring(OUT, g[0], g[1], 4.5); a.ring('#f4f0e0', g[0], g[1], 3.6); var t = -2.4 + (o.frame + i) % 3 * 0.5; a.line('#d83a3a', g[0], g[1], g[0] + Math.cos(t) * 3, g[1] + Math.sin(t) * 3, 1); });
    return a.c;
  } });
  def('rodrack', { w: 2, h: 1, deco: true, walk: true, text: 'Fishing rods of every size. One is labeled "NOT FOR SALE - Fenwick\'s lucky rod".', draw: function (o) {
    var a = canvas(o, 16);
    a.f(WOODD, 1, 2, 30, 2); a.f(WOODD, 1, 12, 30, 2);
    for (var i = 0; i < 5; i++) { var x = 4 + i * 6; a.line(OUT, x, 1, x + 1, 15, 2); a.line(['#c8925a', '#3a3a44', '#d83a3a', '#6a8a4a', '#c8925a'][i], x, 1, x + 1, 15, 1); a.ring('#b0b8c8', x + 1, 11, 1.2); }
    return a.c;
  } });
  def('lockeddoor', { w: 1, h: 1, deco: true, walk: true, draw: function (o) {
    var a = canvas(o, 28);
    a.f(OUT, 1, 3, 14, 25); a.f('#5a3a22', 2, 4, 12, 24); a.f('#6a4a2a', 3, 5, 10, 10); a.f('#6a4a2a', 3, 17, 10, 10);
    a.f(OUT, 9, 14, 5, 6); a.f('#c8a040', 10, 15, 3, 4); a.p(OUT, 11, 17);
    return a.c;
  } });
  def('beads', { w: 1, h: 1, deco: true, walk: true, text: 'A curtain of glass beads. They chime softly.', draw: function (o) {
    var a = canvas(o, 24);
    a.f(WOODD, 0, 0, 16, 2);
    var cs = ['#a060d0', '#f0c040', '#40a0d0', '#e05a8a'];
    for (var i = 0; i < 6; i++) for (var j = 0; j < 9; j++) a.p(cs[(i + j) % 4], 1 + i * 3, 3 + j * 2 + (i % 2));
    return a.c;
  } });

  // ================= Interior: furniture =================
  def('bookcase', { w: 2, h: 1, dh: 32, text: 'Books about Kits, rivers and old legends.', draw: function (o) {
    var a = canvas(o, 32), W = o.w * 16, rnd = PK.seeded(PK.hash('books' + (o.variant || '') + W));
    block(a, 1, 1, W - 2, 30, o.color || '#7a4a26', 0);
    a.f(sh(o.color || '#7a4a26', 0.25), 1, 1, W - 2, 2);
    var cols = ['#c84848', '#4868c8', '#48a860', '#e0b040', '#9058b8', '#e07838', '#3a8a8a', '#e8e0d0'];
    for (var s = 0; s < 3; s++) {
      var y0 = 4 + s * 9;
      a.f('#3a2414', 3, y0, W - 6, 8);
      for (var x = 4; x < W - 4;) {
        var bw = 1 + rnd.int(2), bh = 5 + rnd.int(3), c = cols[rnd.int(cols.length)];
        if (rnd() < 0.12 && x < W - 8) { a.line(c, x, y0 + 7, x + 3, y0 + 3, 2); x += 4; continue; }
        a.f(c, x, y0 + 8 - bh, bw, bh); a.p(sh(c, 0.35), x, y0 + 8 - bh);
        x += bw + (rnd() < 0.2 ? 1 : 0);
      }
      a.f(sh(o.color || '#7a4a26', 0.1), 2, y0 + 8, W - 4, 1);
    }
    return a.c;
  } });
  def('shelfjars', { w: 1, h: 1, dh: 32, text: 'Jars of preserves, spices and dried berries.', draw: function (o) {
    var a = canvas(o, 32);
    block(a, 1, 1, 14, 30, '#8a5a30', 0);
    for (var s = 0; s < 3; s++) {
      var y0 = 4 + s * 9; a.f('#4a2c18', 2, y0, 12, 8);
      [[3, '#e8a040'], [7, '#c84848'], [11, '#6aaa58']].forEach(function (j, i) { var c = s === 1 ? ['#d8d0e8', '#f0c040', '#a060d0'][i] : j[1]; a.f(OUT, j[0] - 1, y0 + 2, 4, 6); a.f(c, j[0], y0 + 3, 2, 4); a.f('#e8e0d0', j[0], y0 + 2, 2, 1); });
    }
    return a.c;
  } });
  def('counter', { w: 2, h: 1, dh: 22, text: 'A tidy kitchen counter.', draw: function (o) {
    var a = canvas(o, 22), W = o.w * 16, top = o.color || '#d8d0c0';
    block(a, 0, 6, W, 15, '#b07a44', 0);
    a.f(OUT, 0, 2, W, 5); a.f(top, 0, 3, W, 3); a.f(sh(top, 0.3), 0, 3, W, 1);
    for (var x = 2; x < W - 4; x += 8) { a.f(sh('#b07a44', -0.3), x, 8, 6, 11); a.f('#c8925a', x + 1, 9, 4, 9); a.p('#e8c060', x + 4, 13); }
    return a.c;
  } });
  def('stove', { w: 1, h: 1, dh: 24, anim: true, text: 'Something is simmering. It smells wonderful.', draw: function (o) {
    var a = canvas(o, 24);
    block(a, 1, 6, 14, 17, '#e8e8ec', 0); a.f('#3a3a44', 1, 4, 14, 3);
    a.ring('#8a8a94', 5, 5, 2); a.ring('#8a8a94', 11, 5, 2);
    var fl = ['#f8a43a', '#f86a2a', '#ffd860'][o.frame];
    a.p(fl, 4, 4); a.p(fl, 6, 4); a.p('#ffd860', 5, 3);
    a.f(OUT, 3, 11, 10, 8); a.f('#3a3a44', 4, 12, 8, 6); a.f(o.frame === 1 ? '#f86a2a' : '#c84a1a', 5, 16, 6, 1);
    a.f('#b0b0b8', 3, 9, 10, 1);
    return a.c;
  } });
  def('sink', { w: 1, h: 1, dh: 24, text: 'A sink with a dripping tap. Drip. Drip.', draw: function (o) {
    var a = canvas(o, 24);
    block(a, 0, 8, 16, 15, '#b07a44', 0); a.f(OUT, 0, 5, 16, 4); a.f('#d8d0c0', 0, 6, 16, 2);
    a.f(OUT, 3, 6, 10, 3); a.f('#8ab0c8', 4, 6, 8, 2);
    a.f(OUT, 7, 1, 2, 6); a.f('#b0b8c8', 8, 1, 1, 5); a.f('#b0b8c8', 8, 1, 3, 1);
    a.f(sh('#b07a44', -0.3), 3, 11, 10, 9); a.p('#e8c060', 12, 15);
    return a.c;
  } });
  def('fridge', { w: 1, h: 1, dh: 32, text: 'The fridge. A drawing of a Kit is stuck to the door with a magnet.', draw: function (o) {
    var a = canvas(o, 32);
    block(a, 1, 1, 14, 30, '#e8eef4', 0); a.f(OUT, 1, 12, 14, 1);
    a.f('#b0b8c8', 12, 4, 1, 6); a.f('#b0b8c8', 12, 15, 1, 8);
    a.f('#fcfcfc', 3, 16, 6, 6); a.f('#e8703a', 4, 18, 3, 3); a.p('#d83a3a', 6, 15);
    return a.c;
  } });
  def('table', { w: 2, h: 1, dh: 20, draw: function (o) {
    var a = canvas(o, 20), W = o.w * 16, c = o.color || WOOD;
    a.f(OUT, 2, 10, 3, 10); a.f(sh(c, -0.3), 3, 10, 1, 9); a.f(OUT, W - 5, 10, 3, 10); a.f(sh(c, -0.3), W - 4, 10, 1, 9);
    block(a, 0, 4, W, 7, c, 3);
    if (o.variant === 'cloth') { a.f('#f4f0e8', 2, 4, W - 4, 3); a.f('#d84a4a', 2, 6, W - 4, 1); for (var x = 3; x < W - 3; x += 4) a.p('#d84a4a', x, 4); }
    var ic = o.icon;
    if (ic === 'tea') { a.f(OUT, 5, 0, 6, 5); a.f('#f4f4f8', 6, 1, 4, 3); a.f('#fcfcfc', W - 10, 2, 4, 3); a.p('#8a5a30', W - 9, 3); }
    else if (ic === 'bread') { a.f('#8a4a1a', 5, 2, 8, 3); a.f('#d88a3a', 5, 1, 8, 3); a.f('#f0c070', 6, 1, 4, 1); }
    else if (ic === 'books') { a.f('#4868c8', 4, 1, 7, 3); a.f('#c84848', 5, -1, 6, 3); a.f('#fcfcfc', W - 12, 2, 8, 2); }
    else if (ic === 'flowers') { a.f(OUT, 6, 0, 4, 5); a.f('#8ab0c8', 7, 1, 2, 3); a.p('#f070b0', 6, -1); a.p('#f8e060', 8, -1); a.p('#f070b0', 9, 0); }
    else if (ic === 'cards') { for (var k = 0; k < 4; k++) { a.f(OUT, 4 + k * 5, 1, 4, 4); a.f(k % 2 ? '#d83a3a' : '#fcfcfc', 5 + k * 5, 2, 2, 2); } }
    else if (ic === 'map') { a.f('#e8d8a8', 3, 1, W - 6, 4); a.f('#6aaa58', 5, 2, 5, 2); a.p('#d83a3a', 12, 2); a.f('#4a8ae0', W - 10, 2, 2, 3); }
    return a.c;
  } });
  def('dining', { w: 3, h: 2, dh: 36, text: 'The family dining table. Mom always sets a plate for {RIVAL}, just in case.', draw: function (o) {
    var a = canvas(o, 36);
    function chair(x, y, back) { a.f(OUT, x, y, 10, back ? 14 : 8); a.f('#8a5a30', x + 1, y + 1, 8, back ? 12 : 6); if (back) a.f('#a8743e', x + 2, y + 2, 6, 4); }
    chair(6, 2, true); chair(32, 2, true);
    a.f(OUT, 4, 22, 3, 11); a.f(OUT, 41, 22, 3, 11);
    block(a, 1, 12, 46, 12, WOOD, 4);
    a.f('#f4f0e8', 3, 13, 42, 3);
    [[10, '#f4f4f8'], [24, '#f4f4f8'], [37, '#f4f4f8']].forEach(function (p) { a.ring(OUT, p[0], 15, 3.2); a.ring(p[1], p[0], 15, 2.4); });
    a.f('#d88a3a', 22, 13, 5, 2);
    chair(6, 26, false); chair(32, 26, false);
    return a.c;
  } });
  def('couch', { w: 2, h: 1, dh: 24, text: 'A squashy old couch. There are cookie crumbs between the cushions.', draw: function (o) {
    var a = canvas(o, 24), c = o.color || '#5a78b8';
    block(a, 1, 3, 30, 12, sh(c, -0.1), 0); a.f(sh(c, 0.2), 2, 4, 28, 2);
    block(a, 0, 11, 6, 11, c, 2); block(a, 26, 11, 6, 11, c, 2);
    block(a, 6, 13, 20, 8, c, 3); a.f(sh(c, -0.25), 16, 13, 1, 7);
    a.f(OUT, 2, 22, 2, 2); a.f(OUT, 28, 22, 2, 2);
    return a.c;
  } });
  def('tv', { w: 1, h: 1, dh: 28, anim: true, draw: function (o) {
    var a = canvas(o, 28);
    block(a, 1, 16, 14, 11, WOODD, 2);
    block(a, 1, 3, 14, 13, '#3a3a44', 0);
    var sc = [['#6ab0e8', '#e8e070'], ['#e87a5a', '#6ae0a0'], ['#b08ae8', '#f8f8f8']][o.frame];
    a.f(sc[0], 3, 5, 10, 8); a.f(sc[1], 4, 9, 4, 3); a.f('#fcfcfc', 3, 5, 3, 1);
    a.line('#8a8a94', 6, 3, 3, 0, 1); a.line('#8a8a94', 10, 3, 13, 0, 1);
    return a.c;
  } });
  def('fireplace', { w: 2, h: 1, dh: 32, anim: true, text: 'A crackling fire. It makes the whole room glow.', draw: function (o) {
    var a = canvas(o, 32);
    block(a, 0, 4, 32, 27, '#9a8a7a', 0);
    for (var y = 6; y < 30; y += 4) for (var x = (y / 4) % 2 ? 1 : 3; x < 31; x += 6) a.f(sh('#9a8a7a', 0.12), x, y, 4, 3);
    a.f(OUT, -1, 2, 34, 4); a.f(WOODD, 0, 3, 32, 2);
    a.f(OUT, 7, 13, 18, 18); a.f('#1e1418', 8, 14, 16, 17);
    a.f('#6a4424', 10, 27, 12, 2);
    var f = o.frame;
    [[11, 26, 5], [16, 26, 7], [20, 26, 5]].forEach(function (p, i) { var hgt = p[2] + ((f + i) % 3); a.f('#e8582a', p[0] - 1, p[1] - hgt, 3, hgt); a.f('#f8a43a', p[0], p[1] - hgt + 2, 1, hgt - 2); a.p('#ffe070', p[0], p[1] - 2); });
    a.f('#f4e8c8', 3, 0, 2, 3); a.p('#ffd860', 3, -1); a.f('#c8a060', 26, 0, 3, 3);
    return a.c;
  } });
  def('bed', { w: 1, h: 2, dh: 34, use: 'bed', text: 'A cozy bed.', draw: function (o) {
    var a = canvas(o, 34), c = o.color || '#4a78c8';
    block(a, 0, 1, 16, 7, WOODD, 2);
    block(a, 1, 6, 14, 26, '#f4f0e8', 0);
    a.f(OUT, 3, 8, 10, 6); a.f('#fcfcfc', 4, 9, 8, 4); a.f('#e0e0e8', 4, 12, 8, 1);
    a.f(OUT, 1, 15, 14, 17); a.f(c, 2, 16, 12, 15); a.f(sh(c, 0.3), 2, 16, 12, 2);
    for (var y = 19; y < 30; y += 4) a.f(sh(c, -0.2), 3, y, 10, 1);
    a.f(WOODD, 0, 31, 16, 3);
    if (o.variant === 'messy') { a.f(c, 9, 12, 6, 5); a.f('#e8c040', 3, 22, 4, 3); a.f('#c84848', 10, 26, 3, 2); }
    return a.c;
  } });
  def('bunk', { w: 1, h: 2, dh: 40, use: 'bed', text: 'A narrow bunk bed.', draw: function (o) {
    var a = canvas(o, 40);
    a.f(OUT, 0, 0, 2, 40); a.f(OUT, 14, 0, 2, 40); a.f(WOODD, 0, 0, 1, 40); a.f(WOODD, 15, 0, 1, 40);
    [[4, '#6a8a4a'], [22, '#8a5a8a']].forEach(function (b) { a.f(OUT, 1, b[0], 14, 12); a.f(b[1], 2, b[0] + 3, 12, 8); a.f('#fcfcfc', 3, b[0] + 1, 5, 3); a.f(WOODD, 1, b[0] + 11, 14, 2); });
    return a.c;
  } });
  def('desk', { w: 2, h: 1, dh: 26, draw: function (o) {
    var a = canvas(o, 26), c = o.color || '#8a5a30';
    a.f(OUT, 2, 16, 3, 10); a.f(OUT, 27, 16, 3, 10);
    block(a, 18, 16, 12, 9, sh(c, -0.1), 0); a.p('#e8c060', 23, 20);
    block(a, 0, 10, 32, 6, c, 2);
    a.f(OUT, 3, 3, 3, 8); a.f('#3a8a5a', 4, 4, 1, 6); a.f(OUT, 1, 2, 8, 3); a.f('#6ab04a', 2, 3, 6, 1); a.p('#ffe070', 4, 5);
    a.f('#fcfcfc', 12, 8, 8, 3); a.f('#e8e0d0', 13, 7, 7, 3); a.f('#3a5aa0', 14, 8, 4, 1);
    if (o.icon === 'ledger') { a.f(OUT, 21, 6, 8, 5); a.f('#6a2a2a', 22, 7, 6, 3); a.f('#e8c060', 24, 8, 2, 1); }
    return a.c;
  } });
  def('pc', { w: 1, h: 1, dh: 28, anim: true, use: 'storage', draw: function (o) {
    var a = canvas(o, 28);
    block(a, 0, 15, 16, 12, '#8a5a30', 2);
    block(a, 2, 3, 12, 11, '#c8ccd8', 0); a.f(OUT, 7, 13, 2, 3);
    a.f(o.frame % 2 ? '#88f0f8' : '#58c8e8', 4, 5, 8, 6); a.f('#e8ffff', 5, 6, 3, 1); a.f('#2a8aa8', 5, 9, 5, 1);
    a.f('#3a3a44', 4, 16, 8, 2);
    return a.c;
  } });
  def('rug', { w: 2, h: 1, walk: true, draw: function (o) {
    var a = canvas(o), W = o.w * 16, H = o.h * 16, c = o.color || '#b8484e';
    a.f(sh(c, -0.35), 1, 1, W - 2, H - 2); a.f(c, 2, 2, W - 4, H - 4); a.f(sh(c, 0.3), 4, 4, W - 8, H - 8); a.f(c, 5, 5, W - 10, H - 10);
    if (o.variant === 'round') { a.f(sh(c, 0.3), W / 2 - 3, H / 2 - 3, 6, 6); } else for (var x = 6; x < W - 6; x += 5) a.p(sh(c, 0.45), x, H / 2);
    for (var t = 3; t < W - 3; t += 3) { a.p(sh(c, 0.4), t, 0); a.p(sh(c, 0.4), t, H - 1); }
    return a.c;
  } });
  def('plant', { w: 1, h: 1, dh: 28, text: 'A big leafy plant. Someone waters it every day.', draw: function (o) {
    var a = canvas(o, 28), g = PK.PG, pg = new g(16, 28), R = PK.color.ramp;
    pg.rect(4, 20, 8, 7, 1, { hgrad: 1 });
    if (o.variant === 'flowers') { pg.ellipse(8, 15, 6, 5, 0); pg.ellipse(4, 13, 3, 3, 0); pg.ellipse(12, 13, 3, 3, 0); }
    else { pg.ellipse(8, 12, 6.5, 8, 0); pg.ellipse(3.5, 16, 3, 4, 0, { bias: -0.1 }); pg.ellipse(12.5, 15, 3, 4, 0, { bias: -0.1 }); pg.ellipse(8, 5, 3, 4, 0, { bias: 0.1 }); }
    a.x.drawImage(pg.render([R('#3e9e48'), R(o.color || '#c06a3a')]), 0, 0);
    if (o.variant === 'flowers') [[5, 13, '#f070b0'], [9, 11, '#f8e060'], [11, 15, '#f070b0'], [6, 17, '#a070e0']].forEach(function (p) { a.p(p[2], p[0], p[1]); a.p(sh(p[2], 0.4), p[0] + 1, p[1]); });
    return a.c;
  } });
  def('wardrobe', { w: 1, h: 1, dh: 32, text: 'A wardrobe full of clothes.', draw: function (o) {
    var a = canvas(o, 32), c = o.color || '#8a5a30';
    block(a, 0, 1, 16, 30, c, 0); a.f(sh(c, 0.25), 0, 1, 16, 2);
    a.f(sh(c, -0.3), 7, 4, 1, 25); a.f(sh(c, 0.12), 2, 5, 4, 22); a.f(sh(c, 0.12), 9, 5, 5, 22);
    a.p('#e8c060', 5, 16); a.p('#e8c060', 9, 16);
    return a.c;
  } });
  def('trophycase', { w: 2, h: 1, dh: 30, text: 'Dusty trophies from Keeper tournaments.', draw: function (o) {
    var a = canvas(o, 30);
    block(a, 0, 1, 32, 28, '#5a3a22', 0);
    a.f('#c8e4f0', 2, 3, 28, 22); a.f('#e8f6ff', 3, 4, 6, 20);
    a.f('#3a2414', 2, 14, 28, 1);
    [[6, 6], [14, 5], [22, 7]].forEach(function (t) { a.f('#e8b840', t[0], t[1], 5, 4); a.f('#e8b840', t[0] + 2, t[1] + 4, 1, 3); a.f('#c89020', t[0] + 1, t[1] + 7, 3, 1); });
    a.ring('#e8b840', 10, 20, 3); a.ring('#c83a3a', 10, 20, 1.6); a.f('#b0b8c8', 18, 18, 8, 5);
    return a.c;
  } });
  def('chest', { w: 1, h: 1, dh: 18, text: 'A heavy old chest.', draw: function (o) {
    var a = canvas(o, 18);
    block(a, 1, 5, 14, 12, '#8a5a30', 0); a.f(OUT, 1, 3, 14, 5); a.f('#a8743e', 2, 4, 12, 3); a.f(sh('#a8743e', 0.3), 2, 4, 12, 1);
    a.f('#5a5a64', 1, 8, 14, 1); a.f(OUT, 6, 8, 4, 5); a.f('#e8c060', 7, 9, 2, 3);
    return a.c;
  } });
  def('sacks', { w: 1, h: 1, dh: 20, text: 'Sacks of flour, stamped with the mill\'s wheat mark.', draw: function (o) {
    var a = canvas(o, 20);
    [[5, 12], [11, 13], [8, 6]].forEach(function (s) { a.ring(OUT, s[0], s[1] + 1, 5.5); a.ring('#e8dcc0', s[0], s[1] + 1, 4.6); a.f('#c8b890', s[0] - 1, s[1] - 4, 3, 2); a.p('#b89040', s[0], s[1] + 1); a.p('#b89040', s[0] - 1, s[1] + 2); });
    return a.c;
  } });
  def('breadrack', { w: 1, h: 1, dh: 32, text: 'Racks of fresh bread. Still warm!', draw: function (o) {
    var a = canvas(o, 32);
    block(a, 0, 1, 16, 30, '#8a5a30', 0);
    for (var s = 0; s < 3; s++) {
      var y = 4 + s * 9; a.f('#3a2414', 1, y, 14, 8);
      a.f('#8a4a1a', 2, y + 4, 5, 3); a.f('#d88a3a', 2, y + 3, 5, 3); a.f('#f0c070', 3, y + 3, 2, 1);
      a.f('#8a4a1a', 9, y + 4, 5, 3); a.f(s === 1 ? '#c86a2a' : '#e8a050', 9, y + 3, 5, 3);
    }
    return a.c;
  } });
  def('cakecase', { w: 2, h: 1, dh: 24, text: 'A glass case of cakes and pastries. Your stomach growls.', draw: function (o) {
    var a = canvas(o, 24);
    block(a, 0, 13, 32, 10, '#b07a44', 0);
    a.f(OUT, 0, 2, 32, 12); a.f('#d8f0fc', 1, 3, 30, 10); a.f('#fcfcfc', 2, 3, 2, 9);
    [[5, '#f4c8d8', '#e8586a'], [13, '#f0e0b0', '#8a4a1a'], [22, '#fcfcfc', '#6aaa58']].forEach(function (c) { a.f(OUT, c[0] - 1, 7, 7, 6); a.f(c[1], c[0], 8, 5, 4); a.f(c[2], c[0], 8, 5, 1); a.p('#d83a3a', c[0] + 2, 7); });
    return a.c;
  } });
  def('oven', { w: 2, h: 1, dh: 34, anim: true, text: 'The big brick oven. It\'s so hot your eyebrows tingle.', draw: function (o) {
    var a = canvas(o, 34);
    a.f(OUT, 1, 3, 30, 30); a.f('#b85a48', 2, 4, 28, 28);
    for (var y = 5; y < 31; y += 3) for (var x = (y / 3) % 2 ? 2 : 5; x < 29; x += 6) a.f(sh('#b85a48', 0.15), x, y, 5, 2);
    a.f(OUT, 9, 0, 6, 5); a.f('#8a4a3a', 10, 0, 4, 4);
    a.ring(OUT, 16, 20, 9, 0); a.f(OUT, 7, 20, 19, 10); a.ring('#1e1418', 16, 20, 8); a.f('#1e1418', 8, 20, 17, 9);
    var f = o.frame; a.f('#e8582a', 10, 25 - f, 12, 4 + f); a.f('#f8a43a', 12, 26 - f, 8, 2 + f); a.f('#ffe070', 14, 27, 4, 1);
    a.f('#d88a3a', 12, 21, 8, 2);
    return a.c;
  } });
  def('mixtable', { w: 2, h: 1, dh: 22, text: 'Mixing bowls, a rolling pin and a LOT of flour.', draw: function (o) {
    var a = canvas(o, 22);
    a.f(OUT, 2, 12, 3, 10); a.f(OUT, 27, 12, 3, 10);
    block(a, 0, 7, 32, 6, WOODL, 2);
    a.ring(OUT, 8, 6, 5); a.ring('#e8e0d0', 8, 6, 4); a.f('#fcfcfc', 5, 4, 7, 2);
    a.f(OUT, 16, 5, 12, 3); a.f('#c8925a', 17, 6, 10, 1);
    a.f('#fcfcfc', 20, 9, 8, 2);
    return a.c;
  } });
  def('millstone', { w: 2, h: 2, dh: 40, anim: true, text: 'Two huge millstones grind grain into flour. The floor hums under your feet.', draw: function (o) {
    var a = canvas(o, 40);
    a.f(OUT, 3, 0, 26, 8); a.f('#a8743e', 4, 1, 24, 6); a.f('#c8925a', 4, 1, 24, 2);
    a.f(OUT, 12, 7, 8, 8); a.f('#8a5a30', 13, 7, 6, 8);
    block(a, 1, 14, 30, 24, '#8a5a30', 0);
    a.ring(OUT, 16, 25, 12); a.ring('#a8a098', 16, 25, 11); a.ring('#c8c0b8', 16, 25, 8); a.ring('#8a8078', 16, 25, 2);
    for (var i = 0; i < 6; i++) { var t = o.frame * 0.35 + i * Math.PI / 3; a.line('#8a8078', 16 + Math.cos(t) * 3, 25 + Math.sin(t) * 3, 16 + Math.cos(t) * 10, 25 + Math.sin(t) * 10, 1); }
    a.f('#fcfcfc', 27, 34, 3, 2); a.p('#fcfcfc', 25, 36);
    return a.c;
  } });
  def('chute', { w: 1, h: 1, dh: 32, text: 'A wooden chute. Grain rattles down it from the loft.', draw: function (o) {
    var a = canvas(o, 32);
    a.f(OUT, 4, 0, 8, 24); a.f('#a8743e', 5, 0, 6, 24); a.f('#c8925a', 5, 0, 2, 24);
    a.f(OUT, 1, 22, 14, 9); a.f('#8a5a30', 2, 23, 12, 7); a.f('#e8d8a0', 3, 24, 10, 3);
    return a.c;
  } });
  def('tank', { w: 2, h: 1, dh: 32, anim: true, text: 'A tank of river water. Little Kits dart between the stones.', draw: function (o) {
    var a = canvas(o, 32), W = o.w * 16, wc = o.color || '#4aa0d8';
    block(a, 0, 22, W, 9, '#5a6a80', 0);
    a.f(OUT, 0, 1, W, 22); a.f(wc, 1, 4, W - 2, 18); a.f(sh(wc, 0.35), 1, 2, W - 2, 3); a.f('#e8f8ff', 2, 5, 2, 15);
    a.f('#c8b890', 1, 19, W - 2, 3); a.f('#6aaa58', 6, 13, 2, 7); a.f('#6aaa58', W - 9, 11, 2, 9); a.ring('#8a8a94', W / 2, 19, 3);
    var f = o.frame;
    [[6 + f * 5, 9, '#f08a3a'], [W - 10 - f * 3, 14, '#e8e060']].forEach(function (fi) { a.f(fi[2], fi[0], fi[1], 4, 2); a.p(fi[2], fi[0] + 4, fi[1] - 1); a.p(fi[2], fi[0] + 4, fi[1] + 2); a.p(OUT, fi[0] + 1, fi[1]); });
    for (var b = 0; b < 3; b++) a.p('#e8f8ff', 12 + b * 6, 17 - ((f * 4 + b * 5) % 12));
    return a.c;
  } });
  def('microscope', { w: 1, h: 1, dh: 26, text: 'A microscope. On the slide: a single scale from a Kit. It shimmers.', draw: function (o) {
    var a = canvas(o, 26);
    a.f(OUT, 1, 16, 3, 10); a.f(OUT, 12, 16, 3, 10); block(a, 0, 13, 16, 4, '#e8e8ec', 2);
    a.f(OUT, 5, 10, 7, 3); a.f('#3a3a44', 6, 10, 5, 2);
    a.line(OUT, 8, 10, 5, 2, 3); a.line('#e8e8ec', 8, 10, 5, 2, 1); a.f(OUT, 3, 0, 5, 3); a.f('#3a3a44', 4, 0, 3, 2);
    return a.c;
  } });
  def('computer', { w: 2, h: 1, dh: 28, anim: true, text: 'Screens full of charts. One says "RIVER KIT MIGRATION - WHY SO EARLY?"', draw: function (o) {
    var a = canvas(o, 28);
    a.f(OUT, 2, 18, 3, 10); a.f(OUT, 27, 18, 3, 10); block(a, 0, 14, 32, 5, '#e8e8ec', 2);
    [[2, 1], [17, 0]].forEach(function (m, i) { block(a, m[0], 2, 13, 11, '#3a3a44', 0); var on = (o.frame + i) % 3; a.f(['#58c8e8', '#6ae0a0', '#e8e070'][on], m[0] + 2, 4, 9, 7); for (var l = 0; l < 3; l++) a.f('#2a4a5a', m[0] + 3, 5 + l * 2, 3 + ((l + on) % 3) * 2, 1); });
    a.f('#c8ccd8', 10, 15, 12, 2);
    return a.c;
  } });
  def('planter', { w: 2, h: 1, dh: 24, text: 'River plants in neat rows, each with a little label.', draw: function (o) {
    var a = canvas(o, 24), W = o.w * 16;
    block(a, 0, 14, W, 9, '#8a5a30', 0); a.f('#5a3a22', 1, 14, W - 2, 3);
    var R = PK.seeded(PK.hash('pl' + W + (o.variant || '')));
    for (var x = 2; x < W - 3; x += 5) {
      var hgt = 6 + R.int(7), c = ['#4caa46', '#6ac05a', '#3a8a3a'][R.int(3)];
      a.f(OUT, x, 15 - hgt, 4, hgt); a.f(c, x + 1, 15 - hgt, 2, hgt - 1); a.p(sh(c, 0.4), x + 1, 15 - hgt);
      if (R() < 0.5) { a.p(['#f070b0', '#f8e060', '#a070e0', '#fcfcfc'][R.int(4)], x + 1, 14 - hgt); a.p('#fcfcfc', x + 2, 14 - hgt); }
    }
    return a.c;
  } });
  def('telescope', { w: 1, h: 1, dh: 30, text: 'A brass telescope pointed at the hills.', draw: function (o) {
    var a = canvas(o, 30);
    a.line(OUT, 8, 16, 2, 29, 2); a.line(OUT, 8, 16, 14, 29, 2); a.line(OUT, 8, 16, 8, 29, 2);
    a.line('#6a4424', 8, 16, 3, 28, 1); a.line('#6a4424', 8, 16, 13, 28, 1);
    a.line(OUT, 1, 12, 15, 4, 5); a.line('#c89a3a', 1, 12, 15, 4, 3); a.line('#e8c060', 2, 11, 14, 4, 1);
    a.ring(OUT, 15, 4, 2.5); a.ring('#8ad0f6', 15, 4, 1.5);
    return a.c;
  } });
  def('schooldesk', { w: 1, h: 1, dh: 20, draw: function (o) {
    var a = canvas(o, 20);
    a.f(OUT, 2, 12, 2, 8); a.f(OUT, 12, 12, 2, 8);
    block(a, 0, 7, 16, 6, WOODL, 2); a.f('#fcfcfc', 3, 7, 6, 2); a.p('#3a5aa0', 10, 8);
    a.f(OUT, 4, 15, 8, 3); a.f('#6a8ac8', 5, 16, 6, 1);
    return a.c;
  } });
  def('globe', { w: 1, h: 1, dh: 24, text: 'A globe of the world. Lumora is a tiny green blob near the top.', draw: function (o) {
    var a = canvas(o, 24);
    a.f(OUT, 5, 19, 6, 4); a.f(WOODD, 6, 20, 4, 2); a.f(OUT, 7, 15, 2, 5);
    a.ring(OUT, 8, 9, 7); a.ring('#4a8ae0', 8, 9, 6); a.f('#6aaa58', 5, 6, 4, 3); a.f('#6aaa58', 9, 10, 3, 3); a.p('#fcfcfc', 5, 5);
    a.ring(OUT, 8, 9, 7.5, 7);
    return a.c;
  } });
  def('mat', { w: 3, h: 2, walk: true, draw: function (o) {
    var a = canvas(o), W = o.w * 16, H = o.h * 16, c = o.color || '#3a78c8';
    a.f(sh(c, -0.35), 0, 0, W, H); a.f(c, 1, 1, W - 2, H - 2);
    a.f('#fcfcfc', 3, 3, W - 6, 1); a.f('#fcfcfc', 3, H - 4, W - 6, 1); a.ring('#fcfcfc', W / 2, H / 2, 5, 4);
    return a.c;
  } });
  def('dummy', { w: 1, h: 1, dh: 28, text: 'A straw training dummy. It has seen better days.', draw: function (o) {
    var a = canvas(o, 28);
    a.f(OUT, 7, 12, 2, 16); a.f(WOODD, 7, 12, 1, 15); a.f(OUT, 3, 26, 10, 2);
    a.ring(OUT, 8, 13, 5.5); a.ring('#d8b870', 8, 13, 4.6); a.f('#b89050', 5, 12, 6, 1); a.f('#d83a3a', 4, 15, 8, 1);
    a.ring(OUT, 8, 5, 4); a.ring('#d8b870', 8, 5, 3.2); a.p(OUT, 7, 4); a.p(OUT, 9, 4); a.f(OUT, 1, 12, 14, 2); a.f('#d8b870', 2, 12, 12, 1);
    return a.c;
  } });
  def('bell', { w: 2, h: 2, dh: 36, text: 'The school bell. Its brass shines.', draw: function (o) {
    var a = canvas(o, 36);
    a.f(OUT, 2, 2, 3, 34); a.f(OUT, 27, 2, 3, 34); a.f(WOODD, 3, 2, 1, 33); a.f(WOODD, 28, 2, 1, 33); a.f(OUT, 1, 1, 30, 4); a.f(WOOD, 2, 2, 28, 2);
    a.f(OUT, 15, 5, 2, 4);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(9, 26); a.x.quadraticCurveTo(10, 8, 16, 8); a.x.quadraticCurveTo(22, 8, 23, 26); a.x.closePath(); a.x.fill();
    a.x.fillStyle = '#d8a040'; a.x.beginPath(); a.x.moveTo(10, 25); a.x.quadraticCurveTo(11, 9, 16, 9); a.x.quadraticCurveTo(21, 9, 22, 25); a.x.closePath(); a.x.fill();
    a.f('#f0c860', 12, 12, 2, 10); a.f(OUT, 7, 25, 18, 3); a.f('#c89030', 8, 25, 16, 2); a.ring(OUT, 16, 29, 2.2); a.ring('#8a8a94', 16, 29, 1.4);
    return a.c;
  } });
  def('boat', { w: 3, h: 2, draw: function (o) {
    var a = canvas(o, 32);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(2, 10); a.x.lineTo(46, 10); a.x.lineTo(40, 26); a.x.lineTo(8, 26); a.x.closePath(); a.x.fill();
    a.x.fillStyle = '#b8864e'; a.x.beginPath(); a.x.moveTo(4, 11); a.x.lineTo(44, 11); a.x.lineTo(39, 25); a.x.lineTo(9, 25); a.x.closePath(); a.x.fill();
    a.f('#d83a3a', 5, 13, 38, 2); a.f('#8a5a30', 8, 17, 32, 6); a.f(WOODD, 16, 15, 3, 8); a.f(WOODD, 30, 15, 3, 8);
    a.line(OUT, 20, 12, 36, 4, 2); a.f('#c8925a', 34, 2, 5, 3);
    a.f('#84c2f8', 6, 27, 36, 1); a.f('#e4f4ff', 12, 28, 10, 1);
    return a.c;
  } });
  def('workbench', { w: 2, h: 1, dh: 24, text: 'A workbench covered in wood shavings and half-carved oars.', draw: function (o) {
    var a = canvas(o, 24);
    a.f(OUT, 2, 14, 3, 10); a.f(OUT, 27, 14, 3, 10);
    block(a, 0, 9, 32, 6, WOOD, 2);
    a.f(OUT, 4, 5, 10, 4); a.f('#8a8a94', 5, 6, 6, 2); a.f(WOODD, 11, 6, 3, 2);
    a.line(OUT, 18, 8, 28, 3, 3); a.line('#c8925a', 18, 8, 28, 3, 1); a.f('#e8d8a0', 22, 16, 3, 1); a.p('#e8d8a0', 8, 17);
    return a.c;
  } });
  def('rope', { w: 1, h: 1, dh: 16, text: 'A coil of thick rope.', draw: function (o) {
    var a = canvas(o, 16);
    a.ring(OUT, 8, 10, 6.5); a.ring('#c8a060', 8, 10, 5.6); a.ring('#a8803a', 8, 10, 4, 3); a.ring('#a8803a', 8, 10, 2, 1); a.ring(OUT, 8, 10, 1);
    return a.c;
  } });
  def('lever', { w: 1, h: 1, dh: 28, text: 'The control lever.', draw: function (o) {
    var a = canvas(o, 28);
    block(a, 1, 16, 14, 11, '#6a7080', 2);
    a.line(OUT, 8, 18, o.variant === 'down' ? 13 : 4, 4, 3); a.line('#9aa0b0', 8, 18, o.variant === 'down' ? 13 : 4, 4, 1);
    a.ring(OUT, o.variant === 'down' ? 13 : 4, 4, 2.5); a.ring('#d83a3a', o.variant === 'down' ? 13 : 4, 4, 1.7);
    a.f('#e8c040', 3, 21, 10, 2);
    return a.c;
  } });
  def('kettle', { w: 1, h: 1, dh: 26, anim: true, text: 'Grandma\'s kettle, always on the boil.', draw: function (o) {
    var a = canvas(o, 26);
    block(a, 0, 13, 16, 12, '#3a3a44', 2); a.f('#f86a2a', 4, 22, 8, 1);
    a.ring(OUT, 8, 10, 5); a.ring('#b0b8c8', 8, 10, 4); a.f('#d8e0e8', 5, 8, 3, 1); a.line(OUT, 12, 9, 15, 6, 2); a.f(OUT, 6, 4, 4, 2);
    var f = o.frame; a.ring('rgba(240,244,250,0.8)', 15 - f, 3 - f, 1.8); a.ring('rgba(240,244,250,0.6)', 13 + f, 0, 1.4);
    return a.c;
  } });
  def('basket', { w: 1, h: 1, walk: false, dh: 16, text: 'A wicker basket with a soft cushion.', draw: function (o) {
    var a = canvas(o, 16);
    a.f(OUT, 0, 7, 16, 9); a.f('#c89a4a', 1, 8, 14, 7);
    for (var x = 2; x < 15; x += 3) a.f('#a87a3a', x, 8, 1, 7);
    a.f('#d85a6a', 2, 7, 12, 3); a.f(sh('#d85a6a', 0.3), 3, 7, 10, 1);
    return a.c;
  } });
  def('crystalball', { w: 1, h: 1, dh: 26, anim: true, text: 'A crystal ball. Mist swirls inside it... or is that your reflection?', draw: function (o) {
    var a = canvas(o, 26);
    a.f(OUT, 2, 16, 3, 10); a.f(OUT, 11, 16, 3, 10);
    block(a, 0, 13, 16, 5, '#5a2a6a', 2); a.f('#e8c060', 1, 16, 14, 1);
    a.f(OUT, 5, 11, 6, 3); a.f('#c89a3a', 6, 11, 4, 2);
    var glow = ['#c8a0f8', '#a0c8f8', '#e8b0f0'][o.frame];
    a.ring(OUT, 8, 7, 5.5); a.ring(glow, 8, 7, 4.6); a.ring('#fcfcfc', 6, 5, 1.2); a.ring(sh(glow, 0.3), 9, 8, 2);
    return a.c;
  } });
  def('candles', { w: 1, h: 1, dh: 20, anim: true, text: 'Candles, flickering in no breeze at all.', draw: function (o) {
    var a = canvas(o, 20);
    [[3, 10, 8], [8, 12, 6], [12, 9, 9]].forEach(function (c, i) {
      a.f(OUT, c[0] - 1, c[1] - 1, 4, 20 - c[1]); a.f('#f4ecd8', c[0], c[1], 2, 19 - c[1]);
      var fy = c[1] - 3 - ((o.frame + i) % 2); a.f('#f8a43a', c[0], fy, 2, 3); a.p('#ffe070', c[0], fy + 1);
    });
    return a.c;
  } });
  def('toybox', { w: 1, h: 1, dh: 22, text: 'A toy box: a squeaky ball, a rope toy and a chewed-up plush Kit.', draw: function (o) {
    var a = canvas(o, 22);
    a.ring(OUT, 5, 8, 3.5); a.ring('#e84848', 5, 8, 2.6); a.f(OUT, 9, 4, 4, 7); a.f('#6ab0e8', 10, 5, 2, 5);
    block(a, 0, 9, 16, 12, '#4a8ae0', 0); a.f('#f8d040', 2, 12, 12, 2); a.f('#f070a8', 5, 15, 6, 3);
    return a.c;
  } });
  def('playpen', { w: 3, h: 2, walk: false, dh: 34, text: 'A Kit play pen full of chew toys.', draw: function (o) {
    var a = canvas(o, 34), W = o.w * 16, H = 34;
    a.f('#e8d8b0', 2, 6, W - 4, H - 8);
    a.ring('#e84848', 12, 22, 2.5); a.f('#f8d040', 30, 14, 4, 3); a.f('#6ab0e8', 22, 26, 5, 2);
    for (var x = 1; x < W - 1; x += 5) { a.f(OUT, x, 2, 3, 10); a.f('#fcfcfc', x + 1, 3, 1, 8); a.f(OUT, x, H - 10, 3, 10); a.f('#fcfcfc', x + 1, H - 9, 1, 8); }
    a.f(OUT, 0, 4, W, 3); a.f('#fcfcfc', 1, 5, W - 2, 1); a.f(OUT, 0, H - 8, W, 3); a.f('#fcfcfc', 1, H - 7, W - 2, 1);
    a.f(OUT, 0, 4, 3, H - 4); a.f(OUT, W - 3, 4, 3, H - 4);
    return a.c;
  } });
  def('cushion', { w: 1, h: 1, walk: true, draw: function (o) {
    var a = canvas(o), c = o.color || '#e8a040';
    a.ring(OUT, 8, 9, 7); a.ring(c, 8, 9, 6); a.ring(sh(c, 0.25), 8, 9, 3.5); a.ring(sh(c, -0.1), 8, 9, 2);
    return a.c;
  } });

  // ================= Outdoor props =================
  def('laundry', { w: 3, h: 1, dh: 30, anim: true, text: 'Laundry flapping on the line. Somebody\'s socks don\'t match.', draw: function (o) {
    var a = canvas(o, 30), f = o.frame;
    a.f(OUT, 1, 4, 3, 26); a.f(WOODD, 2, 4, 1, 25); a.f(OUT, 44, 4, 3, 26); a.f(WOODD, 45, 4, 1, 25);
    a.line('#e8e0d0', 3, 6, 45, 6, 1);
    [[7, 8, 10, '#e84848'], [18, 7, 12, '#fcfcfc'], [28, 8, 9, '#4a78c8'], [37, 5, 7, '#f8d040']].forEach(function (c, i) {
      var sw = ((f + i) % 3) - 1;
      a.f(OUT, c[0] - 1 + sw, 6, c[1] + 2, c[2] + 1); a.f(c[3], c[0] + sw, 7, c[1], c[2] - 1); a.f(sh(c[3], -0.2), c[0] + sw, 7 + c[2] - 3, c[1], 2);
      a.p('#8a5a30', c[0] + 1, 6); a.p('#8a5a30', c[0] + c[1] - 2, 6);
    });
    return a.c;
  } });
  def('cart', { w: 2, h: 1, dh: 26, text: 'A hay cart. The hay is still a bit damp from the storm.', draw: function (o) {
    var a = canvas(o, 26);
    a.f(OUT, 1, 6, 28, 12); a.f(WOOD, 2, 7, 26, 10); for (var x = 4; x < 27; x += 5) a.f(sh(WOOD, -0.25), x, 7, 1, 10);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.ellipse(15, 6, 14, 6, 0, Math.PI, 0); a.x.fill();
    a.x.fillStyle = '#e8c860'; a.x.beginPath(); a.x.ellipse(15, 7, 13, 5, 0, Math.PI, 0); a.x.fill();
    for (var h = 4; h < 28; h += 3) a.p('#c8a040', h, 5 + (h % 2));
    a.ring(OUT, 8, 19, 6); a.ring(WOODD, 8, 19, 5, 3); a.ring('#8a8a94', 8, 19, 1.3); a.line(WOODD, 8, 14, 8, 24, 1); a.line(WOODD, 3, 19, 13, 19, 1);
    a.ring(OUT, 24, 19, 6); a.ring(WOODD, 24, 19, 5, 3); a.ring('#8a8a94', 24, 19, 1.3); a.line(WOODD, 24, 14, 24, 24, 1); a.line(WOODD, 19, 19, 29, 19, 1);
    a.f(OUT, 28, 10, 4, 2);
    return a.c;
  } });
  def('wheelbarrow', { w: 1, h: 1, dh: 18, text: 'A wheelbarrow full of river mud. Clean-up duty.', draw: function (o) {
    var a = canvas(o, 18);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(1, 5); a.x.lineTo(13, 5); a.x.lineTo(11, 12); a.x.lineTo(3, 12); a.x.fill();
    a.x.fillStyle = '#4a8a5a'; a.x.beginPath(); a.x.moveTo(2, 6); a.x.lineTo(12, 6); a.x.lineTo(10, 11); a.x.lineTo(4, 11); a.x.fill();
    a.f('#6a4a2a', 3, 5, 9, 2); a.ring(OUT, 12, 14, 3); a.ring('#5a5a64', 12, 14, 2); a.line(OUT, 1, 11, 0, 17, 1);
    return a.c;
  } });
  def('lantern', { w: 1, h: 1, dh: 32, anim: true, glow: true, draw: function (o) {
    var a = canvas(o, 32);
    a.f(OUT, 7, 8, 3, 23); a.f('#3a3a44', 8, 8, 1, 22); a.f(OUT, 4, 29, 9, 3);
    a.f(OUT, 3, 0, 11, 10); a.f('#3a3a44', 4, 1, 9, 8);
    a.f(['#f8d870', '#ffe890', '#f0c050'][o.frame], 5, 2, 7, 6); a.f('#fff8d0', 6, 3, 2, 3);
    a.f(OUT, 2, 0, 13, 2);
    return a.c;
  } });
  def('kithouse', { w: 1, h: 1, dh: 24, text: 'A little house for a Kit. A name is painted over the door: "BISCUIT".', draw: function (o) {
    var a = canvas(o, 24), c = o.color || '#c85a3a';
    a.f(OUT, 1, 11, 14, 13); a.f('#e8d8b0', 2, 12, 12, 11);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(-1, 13); a.x.lineTo(8, 3); a.x.lineTo(17, 13); a.x.fill();
    a.x.fillStyle = c; a.x.beginPath(); a.x.moveTo(1, 12); a.x.lineTo(8, 5); a.x.lineTo(15, 12); a.x.fill();
    a.ring(OUT, 8, 19, 4); a.f(OUT, 4, 19, 9, 5); a.ring('#2a1e1a', 8, 19, 3); a.f('#2a1e1a', 5, 19, 7, 4);
    return a.c;
  } });
  def('vegpatch', { w: 3, h: 2, walk: false, draw: function (o) {
    var a = canvas(o), W = o.w * 16, H = o.h * 16;
    a.f('#6a4428', 0, 0, W, H); a.f('#7a5230', 1, 1, W - 2, H - 2);
    var R = PK.seeded(PK.hash('veg' + W + H));
    for (var y = 3; y < H - 2; y += 6) {
      a.f('#5a3a22', 1, y + 3, W - 2, 1);
      for (var x = 3; x < W - 3; x += 5) {
        var kind = R.int(4);
        if (kind === 0) { a.f('#4caa46', x, y, 3, 3); a.f('#e8702a', x + 1, y + 3, 1, 1); }
        else if (kind === 1) { a.ring('#4caa46', x + 1.5, y + 1.5, 2); a.ring('#8acc6a', x + 1.5, y + 1.5, 1); }
        else if (kind === 2) { a.f('#3a8a3a', x + 1, y - 1, 1, 4); a.ring('#d83a3a', x + 1.5, y + 2, 1.4); }
        else { a.f('#6ac05a', x, y + 1, 4, 2); a.p('#f8e060', x + 2, y); }
      }
    }
    return a.c;
  } });
  def('flowerpots', { w: 1, h: 1, dh: 18, text: 'A cluster of flowerpots.', draw: function (o) {
    var a = canvas(o, 18);
    [[4, 10, '#f070b0'], [11, 11, '#f8e060'], [8, 5, '#a070e0']].forEach(function (p) {
      a.f(OUT, p[0] - 3, p[1] + 2, 7, 6); a.f('#c06a3a', p[0] - 2, p[1] + 3, 5, 4);
      a.ring('#3e9e48', p[0], p[1], 3); a.p(p[2], p[0] - 1, p[1] - 1); a.p(p[2], p[0] + 1, p[1]); a.p(p[2], p[0], p[1] - 2);
    });
    return a.c;
  } });
  // Hanging picture sign on a post, used instead of words on buildings
  function icon(a, name, x, y) {
    var f = function (c, i, j, w, h) { a.f(c, x + i, y + j, w || 1, h || 1); };
    switch (name) {
      case 'bread': f('#8a4a1a', 1, 3, 10, 4); f('#d88a3a', 1, 2, 10, 4); f('#f0c070', 3, 2, 5, 1); f('#8a4a1a', 4, 3, 1, 2); f('#8a4a1a', 7, 3, 1, 2); break;
      case 'bell': f('#c89030', 2, 1, 8, 7); f('#e8b840', 3, 1, 6, 6); f('#f8d870', 4, 2, 1, 4); f('#c89030', 1, 7, 10, 1); f('#5a5a64', 5, 8, 2, 1); break;
      case 'capsule': f(OUT, 3, 0, 6, 10); f('#2fb3a0', 4, 1, 4, 4); f('#6ad8c8', 4, 1, 1, 3); f('#f4f4f0', 4, 6, 4, 3); f('#5a6070', 3, 4, 6, 2); f('#9aa0b0', 5, 4, 2, 2); break;
      case 'wheat': f('#b89040', 5, 1, 1, 8); f('#e8c860', 3, 1, 2, 2); f('#e8c860', 6, 2, 2, 2); f('#e8c860', 3, 4, 2, 2); f('#e8c860', 6, 5, 2, 2); f('#e8c860', 4, 0, 3, 1); break;
      case 'fish': f('#5a8ab0', 2, 3, 7, 3); f('#5a8ab0', 9, 2, 2, 5); f('#fcfcfc', 3, 3, 1, 1); f('#8ab0d0', 3, 5, 5, 1); break;
      case 'fruit': a.ring('#d83a3a', x + 4, y + 5, 2.5); a.ring('#f8c030', x + 8, y + 5, 2.5); f('#3a8a3a', 4, 1, 1, 2); f('#3a8a3a', 8, 1, 1, 2); break;
      case 'crystal': f('#a070e0', 4, 1, 4, 7); f('#d8b8ff', 5, 2, 1, 4); f('#a070e0', 2, 4, 2, 4); f('#a070e0', 8, 3, 2, 5); break;
      case 'anchor': f('#5a5a64', 5, 1, 2, 7); f('#5a5a64', 3, 2, 6, 1); f('#5a5a64', 2, 7, 8, 1); f('#5a5a64', 1, 6, 1, 1); f('#5a5a64', 10, 6, 1, 1); break;
      case 'gear': a.ring('#8a8a94', x + 6, y + 5, 4); a.ring('#b0b0b8', x + 6, y + 5, 2.5); a.ring(OUT, x + 6, y + 5, 1); break;
      case 'paw': a.ring('#8a5a30', x + 6, y + 6, 2.2); f('#8a5a30', 3, 2, 2, 2); f('#8a5a30', 7, 2, 2, 2); f('#8a5a30', 1, 4, 2, 2); f('#8a5a30', 9, 4, 2, 2); break;
      case 'book': f('#3a5aa0', 1, 2, 10, 6); f('#fcfcfc', 2, 2, 4, 5); f('#fcfcfc', 7, 2, 3, 5); f(OUT, 6, 2, 1, 6); break;
      case 'tea': f('#fcfcfc', 2, 3, 7, 5); f('#8a5a30', 3, 3, 5, 1); f('#fcfcfc', 9, 4, 2, 2); f('#e8e0e0', 4, 1, 1, 2); break;
      case 'star': f('#e8b840', 5, 1, 2, 7); f('#e8b840', 2, 4, 8, 2); f('#e8b840', 3, 6, 2, 2); f('#e8b840', 7, 6, 2, 2); break;
      case 'eye': f('#fcfcfc', 2, 3, 8, 4); a.ring('#8a40c8', x + 6, y + 5, 2); a.ring(OUT, x + 6, y + 5, 0.8); break;
      case 'tent': f('#6a8a4a', 3, 2, 6, 6); f('#6a8a4a', 1, 6, 10, 2); f('#2a2a2a', 5, 5, 2, 3); break;
    }
  }
  PK.drawIcon = icon;
  def('hangsign', { w: 1, h: 1, dh: 30, draw: function (o) {
    var a = canvas(o, 30);
    a.f(OUT, 1, 3, 3, 27); a.f(WOODD, 2, 3, 1, 26); a.f(OUT, 1, 2, 15, 3); a.f(WOODD, 2, 3, 13, 1);
    a.f(OUT, 7, 5, 1, 3); a.f(OUT, 14, 5, 1, 3);
    a.f(OUT, 3, 7, 13, 12); a.f('#f4ecd8', 4, 8, 11, 10);
    icon(a, o.icon || 'star', 4, 8);
    return a.c;
  } });
  def('banner', { w: 1, h: 1, dh: 36, anim: true, text: 'A banner flutters in the breeze.', draw: function (o) {
    var a = canvas(o, 36), c = o.color || '#d83a3a', f = o.frame;
    a.f(OUT, 1, 0, 3, 36); a.f('#8a8a94', 2, 0, 1, 35); a.ring('#e8c060', 2.5, 1, 1.5);
    for (var i = 0; i < 12; i++) { var yy = 3 + Math.round(Math.sin((i + f * 2) / 2.2) * 1.2); a.f(OUT, 4 + i, yy - 1, 1, 12); a.f(i % 4 === 3 ? sh(c, -0.2) : c, 4 + i, yy, 1, 10); }
    if (o.icon) icon(a, o.icon, 4, 3);
    return a.c;
  } });
  def('haybale', { w: 1, h: 1, dh: 18, text: 'A bale of hay.', draw: function (o) {
    var a = canvas(o, 18);
    block(a, 1, 5, 14, 12, '#e8c860', 3); for (var x = 3; x < 14; x += 3) a.f('#c8a040', x, 7, 1, 9); a.f('#a87a3a', 1, 10, 14, 1);
    return a.c;
  } });
  def('tent', { w: 2, h: 2, dh: 32, text: 'A grey tent with an ember stitched on the flap. Someone camped here.', draw: function (o) {
    var a = canvas(o, 32), c = o.color || '#7a7880';
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(0, 30); a.x.lineTo(16, 2); a.x.lineTo(32, 30); a.x.fill();
    a.x.fillStyle = c; a.x.beginPath(); a.x.moveTo(2, 29); a.x.lineTo(16, 4); a.x.lineTo(30, 29); a.x.fill();
    a.x.fillStyle = sh(c, 0.2); a.x.beginPath(); a.x.moveTo(3, 29); a.x.lineTo(16, 5); a.x.lineTo(14, 29); a.x.fill();
    a.x.fillStyle = '#2a2628'; a.x.beginPath(); a.x.moveTo(12, 29); a.x.lineTo(16, 16); a.x.lineTo(20, 29); a.x.fill();
    a.f('#f07a2a', 21, 18, 3, 3); a.p('#ffd860', 22, 18);
    return a.c;
  } });
  def('campfire', { w: 1, h: 1, dh: 18, anim: true, text: 'The ashes are still warm.', draw: function (o) {
    var a = canvas(o, 18);
    [[3, 14], [8, 16], [13, 14], [5, 11], [11, 11]].forEach(function (s) { a.ring(OUT, s[0], s[1], 2.2); a.ring('#8a8078', s[0], s[1], 1.5); });
    a.line(OUT, 3, 15, 13, 11, 3); a.line(WOODD, 3, 15, 13, 11, 1); a.line(OUT, 3, 11, 13, 15, 3); a.line(WOODD, 3, 11, 13, 15, 1);
    var f = o.frame; a.f('#e8582a', 6, 8 - f, 4, 5 + f); a.f('#f8a43a', 7, 9 - f, 2, 3 + f); a.p('#ffe070', 7, 11);
    return a.c;
  } });
  def('bedroll', { w: 2, h: 1, walk: true, draw: function (o) {
    var a = canvas(o);
    a.f(OUT, 1, 4, 30, 10); a.f('#5a6a4a', 2, 5, 28, 8); a.f('#7a8a6a', 2, 5, 28, 2); a.f('#e8e0d0', 3, 6, 6, 5);
    return a.c;
  } });
  def('crate', { w: 1, h: 1, dh: 18, text: 'A wooden crate.', draw: function (o) {
    var a = canvas(o, 18);
    block(a, 1, 4, 14, 13, '#b8864e', 3); for (var i = 0; i < 10; i++) { a.p('#7a5230', 3 + i, 7 + i * 0.9); a.p('#7a5230', 12 - i, 7 + i * 0.9); }
    if (o.icon) { a.f('#f4ecd8', 3, 7, 10, 8); icon(a, o.icon, 3, 6); }
    return a.c;
  } });

  PK.props = { KINDS: KINDS };
})();
