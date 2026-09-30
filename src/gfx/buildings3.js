// Saltmarsh buildings: each kind has its own hand-drawn exterior (no shared template). Registered like buildings2.js.
// Footprint is w x h tiles; the door is on the bottom row at column `door`; anim kinds get o.frame 0..2.
(function () {
  'use strict';
  var PK = window.PK;
  var B2 = PK.buildings2, Art = B2.Art, OUT = B2.OUT;
  var sh = function (c, a) { return PK.color.shade(c, a); };
  var KINDS = {};

  // ---------- shared bits ----------
  // Sagging string of triangular flags between two points; the flags flutter with the frame.
  function bunting(a, x0, x1, y, fr, seed) {
    var cols = ['#e8483a', '#f8d040', '#3a8ae0', '#fcfcfc', '#4ab890', '#e870b0'];
    a.f(OUT, x0, y, x1 - x0, 1);
    for (var x = x0 + 2, i = 0; x < x1 - 2; x += 5, i++) {
      var sag = Math.round(Math.sin((x - x0) / (x1 - x0) * Math.PI) * 3), fy = y + 1 + sag, w = ((i + fr + (seed || 0)) % 3 === 0) ? 3 : 4;
      var c = cols[(i + (seed || 0)) % cols.length];
      a.f(OUT, x - 1, fy, w + 2, 1); a.f(c, x, fy, w, 1); a.f(c, x + 1, fy + 1, w - 2, 1); a.f(c, x + 1, fy + 2, Math.max(1, w - 3), 1);
    }
  }
  function lantern(a, x, y, col) {
    a.f(OUT, x, y - 3, 1, 3); a.f(OUT, x - 2, y, 5, 6); a.f(col || '#f0c848', x - 1, y + 1, 3, 4); a.f('#fff8c0', x, y + 2, 1, 2); a.f(OUT, x - 2, y - 1, 5, 1);
  }
  function stripes(a, x, y, w, h, c1, c2, step) {
    for (var i = 0; i < w; i += step) a.f(((i / step) | 0) % 2 ? c2 : c1, x + i, y, Math.min(step, w - i), h);
  }
  function lifebuoy(a, cx, cy, r) {
    a.ring(OUT, cx, cy, r + 1); a.ring('#e8483a', cx, cy, r, r * 0.5);
    [0, 1.57, 3.14, 4.71].forEach(function (t) { a.ring('#fcfcfc', cx + Math.cos(t) * r * 0.75, cy + Math.sin(t) * r * 0.75, 1.5); });
  }
  function posts(a, xs, y, h, col) { xs.forEach(function (x) { a.f(OUT, x - 1, y, 5, h); a.f(col || '#6a4a2c', x, y, 3, h - 1); a.f(sh(col || '#6a4a2c', 0.3), x, y, 1, h - 1); }); }
  function fish(a, x, y, col, dir) {
    a.f(OUT, x - 1, y - 1, 8, 5); a.f(col, x, y, 6, 3); a.f(sh(col, 0.3), x, y, 6, 1);
    a.f(col, dir > 0 ? x + 6 : x - 2, y, 2, 3); a.p('#1a1a22', dir > 0 ? x + 1 : x + 4, y + 1);
  }
  function icon(a, name, x, y) { a.iconSign(name, x, y); }

  // ---------- painted stilt house (the town's homes) ----------
  KINDS.stilthouse = { w: 3, h: 3, door: 1, anim: true, draw: function (o) {
    var a = new Art(48, 48), wall = o.color || '#e8806a', roof = o.roof || '#3a78b8', fr = o.frame || 0;
    posts(a, [5, 39], 43, 5, '#6a4a2c'); a.f('#5a7a70', 5, 45, 3, 1); a.f('#5a7a70', 39, 45, 3, 1);
    a.planks(wall, 4, 21, 40, 23);
    a.f(sh(wall, 0.3), 4, 21, 40, 1);
    a.roof(1, 3, 46, 19, roof, 'shingle', { inset: 12 });
    a.roundWin(24, 13, 3);
    a.win(8, 27, 9, 8, { frame: '#fcf8ec', box: true });
    a.win(31, 27, 9, 8, { frame: '#fcf8ec', box: true });
    a.door(18, 29, o.doorStyle || 'blue');
    a.f('#a8743e', 16, 44, 16, 2); a.f(OUT, 16, 46, 16, 1);
    lifebuoy(a, 41, 26, 3);
    lantern(a, 14, 27, '#f0c848');
    if (o.bunting) bunting(a, 2, 46, 22, fr, o.seed || 0);
    if (o.icon) icon(a, o.icon, 33, 6);
    return a.c;
  } };

  // ---------- fish market: an open hall of striped awnings, crates and hanging fish ----------
  KINDS.fishmarket = { w: 7, h: 4, door: 3, anim: true, draw: function (o) {
    var a = new Art(112, 64), fr = o.frame || 0;
    a.stone('#8a8a94', 3, 24, 106, 38);
    a.roof(0, 3, 112, 22, '#3a8a9a', 'tile', { inset: 14 });
    a.f(OUT, 46, 30, 20, 32); a.f('#3a2a20', 47, 31, 18, 31);                   // dark central passage
    a.f('#c8323a', 44, 26, 24, 5); a.f(OUT, 44, 25, 24, 1); a.f('#fcfcfc', 50, 27, 2, 3); a.f('#fcfcfc', 60, 27, 2, 3);
    icon(a, 'fish', 51, 12);
    // striped awnings over the two stall bays
    [[6, 40], [68, 40]].forEach(function (b) {
      a.f(OUT, b[0] - 1, 29, 40, 12); stripes(a, b[0], 30, 38, 8, '#fcfcfc', '#3a78d0', 4);
      for (var s = 0; s < 38; s += 4) a.f(((s / 4) | 0) % 2 ? '#3a78d0' : '#fcfcfc', b[0] + s, 38, 4, 2);
      a.f(sh('#3a78d0', -0.4), b[0], 38, 38, 1);
      a.f(OUT, b[0] + 2, 40, 2, 20); a.f(OUT, b[0] + 34, 40, 2, 20);
      a.f(OUT, b[0] + 1, 50, 38, 12); a.f('#c8925a', b[0] + 2, 51, 36, 9); a.f(sh('#c8925a', 0.3), b[0] + 2, 51, 36, 1);
    });
    // crates of fish on the counters
    [[10, '#8ab4d8'], [20, '#f0a060'], [30, '#a8c8a0'], [72, '#f0a060'], [82, '#8ab4d8'], [92, '#d0d8e0']].forEach(function (c, i) {
      a.f(OUT, c[0] - 1, 47, 9, 8); a.f('#a8743e', c[0], 48, 7, 6); a.f(c[1], c[0] + 1, 46, 5, 3); a.p('#1a1a22', c[0] + 2, 47);
    });
    // fish hanging from the eave, swaying
    [[10, '#f0a060'], [28, '#8ab4d8'], [76, '#d8d0b0'], [94, '#f07a7a']].forEach(function (h, i) {
      var sway = ((fr + i) % 3) - 1;
      a.f(OUT, h[0] + sway, 40, 1, 3); fish(a, h[0] - 3 + sway, 43, h[1], 1);
    });
    a.f('#e8e0c8', 4, 60, 106, 2);
    bunting(a, 2, 110, 24, fr, o.seed || 1);
    return a.c;
  } };

  // ---------- cannery: brick works with a smoking stack and a covered conveyor to the dock ----------
  KINDS.cannery = { w: 5, h: 5, door: 2, anim: true, draw: function (o) {
    var a = new Art(80, 80), fr = o.frame || 0;
    // smokestack
    a.f(OUT, 60, 0, 11, 46); a.brick('#b8523a', 61, 1, 9, 45); a.f('#2a2a30', 60, 0, 11, 3); stripes(a, 61, 8, 9, 3, '#f0e8d0', '#b8523a', 3);
    for (var i = 0; i < 3; i++) a.ring('rgba(210,214,224,' + (0.8 - i * 0.2) + ')', 66 + ((fr + i) % 3) * 2, -1 - i * 5, 3 + i * 0.6);
    // sawtooth roof
    for (var s = 0; s < 3; s++) { var x0 = 3 + s * 19; a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(x0, 36); a.x.lineTo(x0 + 1, 22); a.x.lineTo(x0 + 19, 36); a.x.fill();
      a.x.fillStyle = '#5a6a7a'; a.x.beginPath(); a.x.moveTo(x0 + 1, 35); a.x.lineTo(x0 + 2, 24); a.x.lineTo(x0 + 17, 35); a.x.fill();
      a.f('#8ab8d8', x0 + 3, 25, 1, 9); a.f('#8ab8d8', x0 + 5, 26, 1, 8); }
    a.brick('#c0553c', 3, 36, 58, 44);
    a.f(sh('#c0553c', -0.5), 3, 36, 58, 2);
    // big loading door and a small one, windows, a can sign
    a.f(OUT, 9, 52, 22, 28); a.f('#5a4a3a', 10, 53, 20, 27); for (var k = 10; k < 30; k += 4) a.f('#6a5a4a', k, 53, 2, 27);
    a.door(34, 62, 'blue');
    [[8, 41], [22, 41], [40, 41]].forEach(function (w) { a.win(w[0], w[1], 9, 7, { dark: true, cross: true }); });
    a.f(OUT, 44, 49, 16, 15); a.f('#fbfbf4', 45, 50, 14, 13); icon(a, 'fish', 46, 51);
    // conveyor gantry to the water on the right
    a.f(OUT, 62, 58, 18, 6); a.f('#7a7a86', 63, 59, 17, 4); for (var c = 0; c < 4; c++) a.f('#4a4a56', 64 + ((c * 4 + fr) % 16), 59, 2, 4);
    posts(a, [64, 76], 64, 16, '#5a4a3a');
    a.foundation(3, 77, 58);
    return a.c;
  } };

  // ---------- aquarium: a glass dome over a curved hall, with fish gliding behind the windows ----------
  KINDS.aquarium = { w: 6, h: 5, door: 2, anim: true, draw: function (o) {
    var a = new Art(96, 80), fr = o.frame || 0;
    // dome
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.ellipse(48, 30, 33, 26, 0, Math.PI, 0); a.x.lineTo(81, 36); a.x.lineTo(15, 36); a.x.fill();
    a.x.fillStyle = '#7ad0e8'; a.x.beginPath(); a.x.ellipse(48, 30, 31, 24, 0, Math.PI, 0); a.x.lineTo(79, 35); a.x.lineTo(17, 35); a.x.fill();
    a.x.fillStyle = '#b8ecf8'; a.x.beginPath(); a.x.ellipse(48, 28, 28, 20, 0, Math.PI * 1.05, Math.PI * 1.55); a.x.lineTo(48, 28); a.x.fill();
    for (var r = 0; r < 5; r++) a.f('#e8f8ff', 22 + r * 13, 9 + Math.abs(2 - r) * 4, 1, 26 - Math.abs(2 - r) * 4);
    a.f('#e8f8ff', 17, 24, 62, 1);
    // a whale silhouette drifting inside the dome, with bubbles
    var wx = 30 + fr * 6;
    a.x.fillStyle = '#2a5a90'; a.x.beginPath(); a.x.ellipse(wx + 8, 26, 9, 4, 0, 0, Math.PI * 2); a.x.fill(); a.f('#2a5a90', wx - 2, 22, 3, 3); a.f('#2a5a90', wx - 3, 21, 2, 2);
    a.f('#dff4ff', wx + 6, 27, 6, 1);
    for (var b = 0; b < 4; b++) a.ring('#e8f8ff', 34 + b * 9 + ((fr + b) % 3), 16 + ((b * 5 + fr * 3) % 12), 1.2);
    // curved hall
    a.f(OUT, 5, 36, 86, 44); a.f('#f0f4f0', 6, 37, 84, 42);
    a.f('#3a9ab8', 6, 37, 84, 4); stripes(a, 6, 41, 84, 2, '#5ab8d0', '#3a9ab8', 3);
    // three big tank windows with fish behind the glass
    [[10, 46], [36, 46], [62, 46]].forEach(function (w, i) {
      a.f(OUT, w[0] - 1, w[1] - 1, 22, 16); a.f('#2a86b8', w[0], w[1], 20, 14); a.f('#5ab8e0', w[0], w[1], 20, 4);
      fish(a, w[0] + ((fr * 5 + i * 7) % 12) + 1, w[1] + 6, ['#f0a040', '#e86a8a', '#f0d848'][i], 1);
      fish(a, w[0] + 14 - ((fr * 4 + i * 5) % 10), w[1] + 10, '#c8e0f0', -1);
      a.f('#e8f8ff', w[0] + 1, w[1] + 1, 2, 2);
    });
    a.door(38, 65, 'glass');
    icon(a, 'fish', 43, 51);
    // wave-crest cornice
    for (var w2 = 0; w2 < 84; w2 += 6) { a.f('#fcfcfc', 6 + w2, 35, 4, 2); a.f('#fcfcfc', 8 + w2, 34, 2, 1); }
    a.foundation(5, 77, 86);
    return a.c;
  } };

  // ---------- shipyard: workshop shed, a ship's ribs on the slip, and a swinging crane ----------
  KINDS.shipyard = { w: 7, h: 5, door: 1, anim: true, draw: function (o) {
    var a = new Art(112, 80), fr = o.frame || 0;
    // workshop shed on the left
    a.roof(0, 24, 44, 16, '#8a5a3a', 'shingle', { inset: 8 });
    a.planks('#b8864e', 2, 39, 40, 41);
    a.win(6, 48, 9, 8, { dark: true }); a.win(30, 48, 9, 8, { dark: true });
    a.door(18, 62, 'arch');
    a.f(OUT, 8, 62, 5, 16); a.f('#8a8a94', 9, 63, 3, 14);     // stacked saw
    icon(a, 'gear', 32, 26);
    // slip with the ship's ribs and planking half-finished
    a.f('#7a5a3a', 48, 68, 62, 6); a.f(OUT, 48, 67, 62, 1);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(50, 62); a.x.lineTo(56, 72); a.x.lineTo(104, 72); a.x.lineTo(110, 58); a.x.lineTo(50, 62); a.x.fill();
    a.x.fillStyle = '#a8743e'; a.x.beginPath(); a.x.moveTo(52, 63); a.x.lineTo(57, 71); a.x.lineTo(103, 71); a.x.lineTo(108, 60); a.x.fill();
    for (var r = 0; r < 8; r++) { var rx = 58 + r * 6; a.f(OUT, rx, 40 + r % 2, 3, 30); a.f('#c8925a', rx, 41 + r % 2, 2, 29); }
    for (var pl = 0; pl < 4; pl++) a.f('#8a5a30', 58, 64 + pl * 2, 44 - pl * 2, 1);
    a.line(OUT, 56, 70, 52, 36, 3); a.line('#c8925a', 56, 70, 52, 37, 1);   // bow post
    // crane arm
    var sway = [0, 3, 6][fr % 3];
    a.f(OUT, 92, 20, 4, 48); a.f('#d8b03a', 93, 21, 2, 46);
    a.line(OUT, 94, 22, 70 + sway, 26, 3); a.line('#d8b03a', 94, 22, 70 + sway, 26, 1);
    a.line(OUT, 72 + sway, 27, 72 + sway, 40, 1);
    a.f(OUT, 69 + sway, 40, 7, 5); a.f('#8a8a94', 70 + sway, 41, 5, 3);
    // planks and barrels
    a.f(OUT, 4, 74, 24, 5); a.f('#c8925a', 5, 75, 22, 3);
    [[36, 68], [42, 70]].forEach(function (b) { a.f(OUT, b[0] - 1, b[1] - 1, 8, 10); a.f('#8a5a30', b[0], b[1], 6, 8); a.f('#5a5a66', b[0], b[1] + 2, 6, 1); a.f('#5a5a66', b[0], b[1] + 5, 6, 1); });
    bunting(a, 4, 44, 36, fr, 3);
    return a.c;
  } };

  // ---------- the old lighthouse: red and white spiral bands, gallery rail, a lamp room with a beam ----------
  KINDS.lighthouse = { w: 3, h: 8, door: 1, anim: true, draw: function (o) {
    var a = new Art(48, 128), fr = o.frame || 0;
    // lamp room and roof
    a.f(OUT, 15, 14, 18, 20); a.f('#2a3a5a', 16, 15, 16, 18);
    var glow = ['#fff8b0', '#ffe870', '#fff0a0'][fr % 3];
    a.f(glow, 18, 17, 12, 14); a.f('#ffffff', 22, 21, 4, 6);
    a.f('#a8b0c0', 23, 15, 2, 18); a.f('#a8b0c0', 16, 24, 16, 1);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(12, 15); a.x.lineTo(24, 2); a.x.lineTo(36, 15); a.x.fill();
    a.x.fillStyle = '#c8323a'; a.x.beginPath(); a.x.moveTo(14, 14); a.x.lineTo(24, 4); a.x.lineTo(34, 14); a.x.fill();
    a.f(OUT, 23, 0, 2, 5); a.f('#e8c050', 22, 0, 4, 2);
    // beam flares alternate sides
    if (fr % 3 !== 1) { a.f('rgba(255,248,176,0.8)', fr % 3 === 0 ? 0 : 33, 22, 15, 4); a.f('rgba(255,248,176,0.5)', fr % 3 === 0 ? 2 : 33, 20, 13, 8); }
    // gallery
    a.f(OUT, 10, 33, 28, 4); a.f('#e8e0d0', 11, 34, 26, 2);
    for (var g = 12; g < 37; g += 4) { a.f(OUT, g, 28, 1, 6); }
    a.f(OUT, 11, 27, 26, 1);
    // tower shaft tapering, spiral bands
    for (var y = 37; y < 118; y++) {
      var t = (y - 37) / 81, half = Math.round(9 + t * 4), band = ((y + Math.round((y - 37) * 0.28)) >> 4) % 2;
      a.f(OUT, 24 - half - 1, y, half * 2 + 2, 1);
      a.f(band ? '#c8323a' : '#f4f0e4', 24 - half, y, half * 2, 1);
      a.p(sh(band ? '#c8323a' : '#f4f0e4', 0.25), 24 - half, y); a.f(sh(band ? '#c8323a' : '#f4f0e4', -0.22), 24 + half - 3, y, 3, 1);
    }
    [[54, 6], [72, 6], [90, 7]].forEach(function (w) { a.f(OUT, 21, w[0] - 1, w[1] + 2, 8); a.f('#2a3a5a', 22, w[0], w[1], 6); a.f('#8ac8f0', 22, w[0], w[1], 2); });
    // stone base with a door and steps
    a.stone('#8a8a98', 6, 112, 36, 14);
    a.door(18, 111, 'arch');
    a.f('#c8c0b0', 14, 126, 20, 2);
    lantern(a, 12, 116, '#f0c848'); lantern(a, 36, 116, '#f0c848');
    return a.c;
  } };

  // ---------- Beacon Playhouse (gym): a retired lighthouse turned theatre, marquee lights and crossing spotlights ----------
  KINDS.playhouse = { w: 6, h: 6, door: 2, anim: true, draw: function (o) {
    var a = new Art(96, 96), fr = o.frame || 0;
    // squat old lantern tower in the middle
    a.x.save(); a.x.translate(0, 12);
    a.f(OUT, 30, 4, 36, 40); a.f('#b83a5a', 31, 5, 34, 38);
    stripes(a, 31, 5, 34, 38, '#b83a5a', '#f4e8d0', 5);
    a.f(OUT, 34, 0, 28, 14); a.f('#2a3050', 35, 1, 26, 12);
    var lit = ['#fff0a0', '#ff9ad8', '#9ae8ff'][fr % 3];
    a.f(lit, 38, 3, 20, 8); a.f('#ffffff', 46, 4, 4, 5);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(32, 1); a.x.lineTo(48, -6); a.x.lineTo(64, 1); a.x.fill();
    // spotlight beams crossing the sky
    var ang = [-1, 0, 1][fr % 3];
    a.line('rgba(255,240,170,0.55)', 40, 6, 14 + ang * 4, -4, 3); a.line('rgba(255,170,220,0.55)', 56, 6, 82 - ang * 4, -4, 3);
    a.x.restore();
    // theatre hall wrapped around the base
    a.roof(2, 34, 92, 16, '#3a3a6a', 'slate', { inset: 12 });
    a.stone('#c8b8a0', 4, 48, 88, 44);
    a.f('#a83a3a', 4, 48, 88, 3); stripes(a, 4, 51, 88, 4, '#f8d040', '#a83a3a', 4);
    // marquee sign with chasing bulbs
    a.f(OUT, 26, 56, 44, 14); a.f('#28284a', 27, 57, 42, 12);
    for (var i = 0; i < 12; i++) a.f(((i + fr) % 3 === 0) ? '#fff0a0' : '#c88a30', 28 + i * 3.4, 57, 2, 2), a.f(((i + fr) % 3 === 1) ? '#fff0a0' : '#c88a30', 28 + i * 3.4, 67, 2, 2);
    a.p('#f8d040', 42, 60); a.f('#f8d040', 46, 60, 4, 4); a.f('#f8d040', 44, 62, 8, 1); a.f('#f8d040', 47, 58, 2, 8);   // a star
    a.door(41, 76, 'arch');
    // red carpet and steps, masks on the pillars
    a.f('#a8203a', 40, 80, 16, 14); a.f('#c8384e', 42, 80, 12, 14); a.f(OUT, 40, 92, 16, 1);
    [[10, 60], [78, 60]].forEach(function (m) { a.ring(OUT, m[0] + 4, m[1] + 4, 6); a.ring('#f4ecd8', m[0] + 4, m[1] + 4, 5); a.f('#1a1a22', m[0] + 2, m[1] + 3, 2, 2); a.f('#1a1a22', m[0] + 6, m[1] + 3, 2, 2); a.f('#c83a4a', m[0] + 2, m[1] + 7, 5, 1); });
    a.win(12, 76, 9, 10, { dark: true }); a.win(75, 76, 9, 10, { dark: true });
    bunting(a, 4, 92, 50, fr, 5);
    a.foundation(4, 92, 88);
    return a.c;
  } };

  // ---------- storm lab: a stilted weather station with a spinning anemometer, dish and sparking rod ----------
  KINDS.stormlab = { w: 4, h: 5, door: 1, anim: true, draw: function (o) {
    var a = new Art(64, 80), fr = o.frame || 0;
    // rod and anemometer
    a.f(OUT, 30, 0, 3, 16); a.f('#a8b0c0', 31, 1, 1, 15);
    if (fr === 1) { a.f('#fff8a0', 29, 0, 5, 1); a.f('#fff8a0', 31, -1, 1, 1); }
    var cup = [[24, 6], [38, 6], [31, 2]]; for (var i = 0; i < 3; i++) { var c = cup[(i + fr) % 3]; a.ring(OUT, c[0] + 1, c[1] + 4, 3); a.ring('#e8483a', c[0] + 1, c[1] + 4, 2); }
    a.line(OUT, 24, 10, 38, 10, 2);
    // dome and dish on the roof
    a.f(OUT, 14, 12, 26, 12); a.x.fillStyle = '#dfe8f0'; a.x.beginPath(); a.x.ellipse(27, 24, 12, 11, 0, Math.PI, 0); a.x.fill(); a.f('#8ac8f0', 20, 16, 6, 3);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.ellipse(50, 20, 9, 7, -0.5, 0, Math.PI * 2); a.x.fill(); a.x.fillStyle = '#c8d0dc'; a.x.beginPath(); a.x.ellipse(50, 20, 7, 5, -0.5, 0, Math.PI * 2); a.x.fill(); a.line(OUT, 46, 24, 44, 32, 2);
    // steel-frame body with big glass and instrument shelter
    a.f(OUT, 4, 30, 56, 42); a.f('#5a6a84', 5, 31, 54, 40);
    for (var x = 5; x < 58; x += 12) a.f('#8a9ab4', x, 31, 2, 40);
    a.f('#3a4a64', 5, 31, 54, 3);
    a.win(10, 38, 14, 10, {}); a.win(36, 38, 14, 10, {});
    a.f(OUT, 8, 52, 10, 14); a.f('#fcfcfc', 9, 53, 8, 12); for (var v = 0; v < 4; v++) a.f('#c8d0dc', 10, 54 + v * 3, 6, 1);  // Stevenson screen
    a.f('#e8483a', 40, 28, 3, 1); a.f('#fcfcfc', 43, 28, 3, 1);
    a.door(18, 56, 'blue');
    icon(a, 'eye', 46, 54);
    posts(a, [6, 54], 68, 12, '#4a5a74');
    a.f(OUT, 4, 72, 56, 3); a.f('#a8743e', 5, 73, 54, 1);
    return a.c;
  } };

  // ---------- pier arcade: barrel-vault roof, chasing neon border, a big claw sign ----------
  KINDS.arcade = { w: 5, h: 4, door: 2, anim: true, draw: function (o) {
    var a = new Art(80, 64), fr = o.frame || 0;
    // striped vault roof
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.ellipse(40, 26, 39, 24, 0, Math.PI, 0); a.x.lineTo(79, 28); a.x.lineTo(1, 28); a.x.fill();
    a.x.fillStyle = '#e85a8a'; a.x.beginPath(); a.x.ellipse(40, 26, 37, 22, 0, Math.PI, 0); a.x.lineTo(77, 28); a.x.lineTo(3, 28); a.x.fill();
    for (var s = 0; s < 6; s++) { a.x.fillStyle = s % 2 ? '#f8d040' : '#e85a8a'; a.x.beginPath(); a.x.ellipse(40, 26, 37, 22, 0, Math.PI + s * 0.52, Math.PI + (s + 1) * 0.52); a.x.lineTo(40, 28); a.x.fill(); }
    a.f('#fcfcfc', 3, 26, 74, 2);
    // wall with neon border
    a.f(OUT, 3, 28, 74, 36); a.f('#3a2a5a', 4, 29, 72, 34);
    for (var i = 0; i < 24; i++) { a.f(((i + fr) % 3 === 0) ? '#fff0a0' : '#8a5ac0', 5 + i * 3, 30, 2, 2); a.f(((i + fr + 1) % 3 === 0) ? '#fff0a0' : '#8a5ac0', 5 + i * 3, 60, 2, 2); }
    // claw-machine sign
    a.f(OUT, 26, 32, 28, 15); a.f('#28304a', 27, 33, 26, 13);
    a.line('#c8d0dc', 40, 33, 40, 39, 1); a.f('#c8d0dc', 36, 39, 8, 1); a.line('#c8d0dc', 36, 40, 34, 44, 1); a.line('#c8d0dc', 44, 40, 46, 44, 1);
    a.ring('#e85a8a', 48, 43, 2); a.ring('#4ab8e8', 31, 43, 2);
    // prize windows with plush lumps
    [[8, 40], [58, 40]].forEach(function (w, i) { a.f(OUT, w[0] - 1, w[1] - 1, 15, 13); a.f('#1a2a4a', w[0], w[1], 13, 11); a.ring(['#f08a4a', '#4ab8e8'][i], w[0] + 4, w[1] + 8, 3); a.ring(['#f8d040', '#e85a8a'][i], w[0] + 9, w[1] + 8, 2.5); a.p('#1a1a22', w[0] + 3, w[1] + 7); a.p('#1a1a22', w[0] + 5, w[1] + 7); });
    a.door(34, 48, 'glass');
    a.f('#fbfbf4', 43, 51, 8, 6); icon(a, 'star', 42, 50);
    a.foundation(3, 61, 74);
    return a.c;
  } };

  // ---------- The Salted Gull: a tavern built from an upturned hull, portholes, lanterns and a gull sign ----------
  KINDS.tavern = { w: 5, h: 4, door: 2, anim: true, draw: function (o) {
    var a = new Art(80, 64), fr = o.frame || 0;
    a.chimney(60, 4, 22, '#8a6a58', true, fr);
    // upturned hull roof
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(0, 34); a.x.quadraticCurveTo(40, -8, 80, 34); a.x.lineTo(0, 34); a.x.fill();
    a.x.fillStyle = '#5a3a24'; a.x.beginPath(); a.x.moveTo(3, 33); a.x.quadraticCurveTo(40, -4, 77, 33); a.x.fill();
    for (var p = 0; p < 6; p++) { a.x.strokeStyle = p % 2 ? '#7a4e30' : '#3a2416'; a.x.lineWidth = 1; a.x.beginPath(); a.x.moveTo(8 + p * 3, 33); a.x.quadraticCurveTo(40, 2 + p * 4, 72 - p * 3, 33); a.x.stroke(); }
    a.f('#c8323a', 3, 30, 74, 3); a.f(OUT, 3, 29, 74, 1);
    // planked lower storey with portholes
    a.planks('#8a5a3a', 4, 33, 72, 31);
    [[10, 40], [56, 40], [66, 40]].forEach(function (w) { a.ring(OUT, w[0] + 3, w[1] + 3, 5); a.ring('#c8a850', w[0] + 3, w[1] + 3, 4); a.ring('#2a3a58', w[0] + 3, w[1] + 3, 3); a.p('#ffe870', w[0] + 2, w[1] + 2); });
    a.win(22, 40, 8, 7, { dark: true }); a.win(50, 40, 0, 0, { dark: true });
    a.door(34, 48, 'arch');
    // hanging gull sign and lanterns
    a.f(OUT, 46, 36, 8, 1); a.f(OUT, 52, 36, 1, 4); a.f(OUT, 46, 40, 14, 14); a.f('#f4ecd8', 47, 41, 12, 12); icon(a, 'anchor', 47, 41);
    lantern(a, 30, 36, '#f0c848'); lantern(a, 28, 30, '#f08a3a');
    // barrels by the door
    [[8, 52], [15, 54]].forEach(function (b) { a.f(OUT, b[0] - 1, b[1] - 1, 9, 11); a.f('#a8743e', b[0], b[1], 7, 9); a.f('#5a5a66', b[0], b[1] + 2, 7, 1); a.f('#5a5a66', b[0], b[1] + 6, 7, 1); a.f('#c8925a', b[0], b[1], 7, 1); });
    a.foundation(4, 61, 72);
    return a.c;
  } };

  // ---------- harbor inn: a two-storey stilt house with a long verandah and rooms over the water ----------
  KINDS.harborinn = { w: 6, h: 5, door: 2, anim: true, draw: function (o) {
    var a = new Art(96, 80), fr = o.frame || 0;
    a.roof(2, 2, 92, 22, '#c86a4a', 'tile', { inset: 18 });
    a.f(OUT, 4, 24, 88, 3); a.f('#fcf8ec', 5, 25, 86, 2);
    // upper floor with shuttered rooms
    a.planks('#f0d8a8', 5, 26, 86, 18);
    [[10, '#3a78b8'], [30, '#4ab890'], [56, '#e870a0'], [76, '#f0b040']].forEach(function (w) { a.win(w[0], 29, 9, 9, { frame: '#fcf8ec', shutters: w[1] }); });
    // verandah rail and posts
    a.f(OUT, 3, 44, 90, 3); a.f('#fcf8ec', 4, 45, 88, 1);
    for (var r = 6; r < 90; r += 5) { a.f(OUT, r, 44, 3, 12); a.f('#fcf8ec', r + 1, 46, 1, 9); }
    a.f(OUT, 3, 42, 90, 2); a.f('#3a78b8', 4, 43, 88, 1);
    // ground floor: pale blue planks, bay window, door
    a.planks('#8ac8d8', 5, 47, 86, 27);
    a.win(10, 53, 14, 10, { frame: '#fcf8ec', box: true });
    a.win(68, 53, 14, 10, { frame: '#fcf8ec', box: true });
    a.door(34, 58, 'arch');
    a.f('#fbfbf4', 46, 50, 9, 9); icon(a, 'star', 45, 50);
    a.f('#a8743e', 30, 73, 24, 2);
    // lantern rows and stilts
    [[16, 30], [44, 30], [72, 30]].forEach(function (l) { lantern(a, l[0], 47, '#f0c848'); });
    posts(a, [8, 30, 60, 84], 74, 6, '#6a4a2c');
    bunting(a, 4, 92, 25, fr, 2);
    return a.c;
  } };

  // ---------- costume workshop: bolts of cloth, feathered mannequins in the windows, a giant needle ----------
  KINDS.costume = { w: 4, h: 4, door: 1, anim: true, draw: function (o) {
    var a = new Art(64, 64), fr = o.frame || 0;
    a.roof(0, 4, 64, 20, '#8a4ac0', 'shingle', { inset: 14 });
    a.f('#f8d040', 30, 6, 4, 4); a.f(OUT, 29, 5, 6, 1);
    a.plaster('#f4d8e8', 3, 24, 58, 38);
    // needle-and-thread sign
    a.f(OUT, 42, 12, 16, 12); a.f('#f4ecd8', 43, 13, 14, 10); a.line('#8a8a94', 45, 21, 55, 15, 1); a.ring('#e8483a', 56, 14, 2, 1); a.cv = 0;
    for (var t = 0; t < 8; t++) a.p('#e8483a', 46 + t, 21 - Math.round(Math.sin(t * 0.8) * 2 + 1));
    // two display windows with dressed mannequins
    [[8, '#e83a8a', '#4ab8e8'], [40, '#f8d040', '#8a4ac0']].forEach(function (w) {
      a.f(OUT, w[0] - 1, 30, 18, 20); a.f('#3a2a4a', w[0], 31, 16, 18);
      a.ring('#f0d0b0', w[0] + 8, 36, 2.5); a.f(w[1], w[0] + 4, 39, 9, 9); a.f(sh(w[1], 0.3), w[0] + 4, 39, 9, 2);
      a.f(w[2], w[0] + 1, 33, 3, 12); a.f(w[2], w[0] + 12, 33, 3, 12);      // hanging fabric bolts
      a.f('#fcfcfc', w[0] + 5, 33 + ((fr + w[0]) % 3), 1, 2);               // a feather twirling
    });
    a.door(26, 48, 'blue');
    // fabric streamers hanging from the eaves
    [8, 18, 46, 56].forEach(function (x, i) { var sw = ((fr + i) % 3) - 1; a.f(['#e83a8a', '#4ab8e8', '#f8d040', '#4ab890'][i], x + sw, 24, 3, 8); });
    bunting(a, 2, 62, 25, fr, 4);
    a.foundation(3, 61, 58);
    return a.c;
  } };

  // ---------- Lighthouse Trading Co.: the polished front, navy and white with a golden beacon-and-anchor crest ----------
  KINDS.tradingco = { w: 5, h: 4, door: 2, anim: false, draw: function (o) {
    var a = new Art(80, 64);
    a.f(OUT, 22, 0, 4, 10); a.f('#f8f0d0', 23, 1, 2, 8); a.f('#e8c050', 22, 0, 4, 2);
    a.roof(2, 6, 76, 18, '#243a5c', 'slate', { inset: 16 });
    a.brick('#d8c8a8', 4, 24, 72, 38);
    a.f('#243a5c', 4, 24, 72, 3);
    // crest: lighthouse over an anchor in gold
    a.f(OUT, 28, 8, 24, 17); a.f('#1a2a48', 29, 9, 22, 15);
    a.f('#e8c050', 39, 10, 3, 9); a.f('#fff0a0', 39, 10, 3, 2); a.f('#e8c050', 37, 19, 7, 1);
    a.line('#e8c050', 40, 19, 40, 22, 1); a.f('#e8c050', 36, 21, 9, 1); a.f('#e8c050', 35, 20, 1, 2); a.f('#e8c050', 45, 20, 1, 2);
    // glass storefront with navy and white awning
    a.f(OUT, 6, 34, 26, 20); a.f('#8ac8e8', 7, 35, 24, 18); a.f('#c8ecf8', 7, 35, 24, 5);
    a.f(OUT, 50, 34, 24, 20); a.f('#8ac8e8', 51, 35, 22, 18); a.f('#c8ecf8', 51, 35, 22, 5);
    stripes(a, 4, 29, 72, 5, '#243a5c', '#fcfcfc', 6);
    a.f(sh('#243a5c', -0.4), 4, 33, 72, 1);
    a.f('#8a5a30', 12, 44, 12, 9); a.f('#c8925a', 12, 44, 12, 2);           // sample crates behind the glass
    a.f('#8a5a30', 56, 46, 10, 7); a.f('#e8c050', 58, 43, 4, 3);
    a.door(34, 46, 'glass');
    a.f('#e8c050', 36, 52, 8, 1);
    a.foundation(4, 61, 72);
    return a.c;
  } };

  // ---------- harbor master's office: a watch-house with signal flags, a brass bell and a radio mast ----------
  KINDS.harbormaster = { w: 4, h: 4, door: 1, anim: true, draw: function (o) {
    var a = new Art(64, 64), fr = o.frame || 0;
    // mast with signal flags
    a.f(OUT, 44, 0, 3, 24); a.f('#c8d0dc', 45, 1, 1, 23);
    ['#e8483a', '#f8d040', '#3a8ae0', '#fcfcfc'].forEach(function (c, i) { var w = 6 + ((fr + i) % 2) * 2; a.f(OUT, 47, 2 + i * 4, w + 1, 4); a.f(c, 47, 3 + i * 4, w, 2); });
    a.roof(2, 14, 60, 16, '#4a6a8a', 'slate', { inset: 10 });
    a.planks('#e8e0d0', 4, 29, 56, 33);
    a.f('#3a78b8', 4, 29, 56, 3);
    a.win(8, 37, 12, 9, { frame: '#3a78b8' }); a.win(42, 37, 12, 9, { frame: '#3a78b8' });
    a.door(26, 47, 'blue');
    // brass bell on a bracket
    a.f(OUT, 22, 26, 12, 2); a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(24, 34); a.x.lineTo(26, 28); a.x.lineTo(32, 28); a.x.lineTo(34, 34); a.x.fill(); a.x.fillStyle = '#e8c050'; a.x.beginPath(); a.x.moveTo(25, 33); a.x.lineTo(27, 29); a.x.lineTo(31, 29); a.x.lineTo(33, 33); a.x.fill();
    lifebuoy(a, 12, 52, 3);
    a.foundation(4, 60, 56);
    return a.c;
  } };

  // ---------- harbor food stalls: chowder pot, grill skewers, shaved ice, fishcakes and sweets ----------
  KINDS.harborstall = { w: 2, h: 2, door: null, anim: true, draw: function (o) {
    var a = new Art(32, 32), fr = o.frame || 0, col = o.roof || '#e85a3a', goods = o.goods || 'chowder';
    a.f(OUT, 2, 8, 3, 24); a.f('#8a5a30', 3, 8, 1, 24); a.f(OUT, 27, 8, 3, 24); a.f('#8a5a30', 28, 8, 1, 24);
    a.f(OUT, 0, 3, 32, 9);
    for (var i = 0; i < 30; i++) a.f(((i / 5) | 0) % 2 ? '#fcfcfc' : col, 1 + i, 4, 1, 6);
    for (var s = 0; s < 30; s += 5) a.f(((s / 5) | 0) % 2 ? '#fcfcfc' : col, 1 + s + 1, 10, 3, 1);
    a.f(sh(col, 0.3), 1, 4, 30, 1);
    a.f(OUT, 3, 21, 26, 9); a.f('#c8925a', 4, 22, 24, 7); a.f(sh('#c8925a', 0.3), 4, 22, 24, 1); a.f(sh('#c8925a', -0.3), 4, 28, 24, 1);
    if (goods === 'chowder') { a.f(OUT, 8, 14, 16, 9); a.f('#5a5a66', 9, 15, 14, 7); a.f('#f4e8c0', 10, 15, 12, 2); for (var b = 0; b < 3; b++) a.ring('rgba(240,240,248,0.85)', 11 + b * 5 + ((fr + b) % 2), 12 - b - ((fr + b) % 3), 1.5); }
    else if (goods === 'skewers') { a.f(OUT, 6, 15, 20, 7); a.f('#3a3a44', 7, 16, 18, 5); for (var k = 0; k < 5; k++) { a.f('#e0a060', 8 + k * 4, 17, 2, 3); a.f('#f0c890', 8 + k * 4, 17, 2, 1); } for (var sm = 0; sm < 2; sm++) a.ring('rgba(210,214,224,0.8)', 12 + sm * 8 + ((fr + sm) % 3), 12 - sm * 2 - fr % 2, 2); }
    else if (goods === 'shavedice') { ['#e85a8a', '#4ab8e8', '#f8d040', '#7ad890'].forEach(function (c, i) { a.f(OUT, 6 + i * 6, 12, 5, 10); a.x.fillStyle = c; a.x.beginPath(); a.x.moveTo(6.5 + i * 6, 16); a.x.lineTo(10.5 + i * 6, 16); a.x.lineTo(8.5 + i * 6, 22); a.x.fill(); a.ring(c, 8.5 + i * 6, 14, 2.4); }); }
    else if (goods === 'fishcakes') { for (var f = 0; f < 4; f++) { a.f(OUT, 6 + f * 6, 16, 6, 6); a.f('#e8b060', 7 + f * 6, 17, 4, 4); a.f('#c88a3a', 7 + f * 6, 19, 4, 1); a.f('#fff0b0', 8 + f * 6, 17, 1, 1); } }
    else { for (var c2 = 0; c2 < 4; c2++) { a.ring(OUT, 8 + c2 * 5.4, 18, 3.4); a.ring(['#e85a8a', '#f8d040', '#4ab8e8', '#7ad890'][c2], 8 + c2 * 5.4, 18, 2.6); a.p('#fcfcfc', 7 + c2 * 5.4, 17); } }
    return a.c;
  } };

  // ---------- big set pieces (no door) ----------
  // A ship in drydock: hull on blocks with scaffolding
  KINDS.dryship = { w: 7, h: 3, door: null, anim: false, draw: function (o) {
    var a = new Art(112, 48);
    a.f(OUT, 4, 40, 104, 6); a.f('#6a5a4a', 5, 41, 102, 4); [[16, 34], [46, 34], [76, 34]].forEach(function (b) { a.f(OUT, b[0], b[1], 8, 8); a.f('#8a6a44', b[0] + 1, b[1] + 1, 6, 7); });
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(2, 12); a.x.lineTo(110, 12); a.x.lineTo(96, 40); a.x.lineTo(14, 40); a.x.fill();
    a.x.fillStyle = '#3a4a7a'; a.x.beginPath(); a.x.moveTo(5, 13); a.x.lineTo(107, 13); a.x.lineTo(94, 38); a.x.lineTo(16, 38); a.x.fill();
    a.f('#c8323a', 6, 14, 100, 3); a.f('#f4ecd8', 8, 24, 96, 1); a.f(OUT, 8, 28, 96, 1);
    for (var i = 0; i < 12; i++) a.ring('#c8a850', 14 + i * 8, 20, 2), a.ring('#2a3a58', 14 + i * 8, 20, 1.3);
    a.f('#e8c050', 92, 26, 6, 3);
    // mast stump and scaffolding
    a.f(OUT, 54, 0, 4, 14); a.f('#8a5a30', 55, 0, 2, 14); a.f('#f4ecd8', 46, 3, 10, 6);
    a.f(OUT, 100, 4, 3, 40); a.f('#c8925a', 101, 5, 1, 38); a.f(OUT, 8, 4, 3, 40); a.f('#c8925a', 9, 5, 1, 38);
    for (var p = 0; p < 4; p++) { a.f(OUT, 8, 10 + p * 10, 95, 2); a.f('#a8743e', 9, 10 + p * 10, 93, 1); }
    return a.c;
  } };

  // The festival stage on the green: a curtained stage with a shell, banners and lights
  KINDS.festivalstage = { w: 6, h: 3, door: null, anim: true, draw: function (o) {
    var a = new Art(96, 48), fr = o.frame || 0;
    a.f(OUT, 3, 34, 90, 12); a.f('#a8743e', 4, 35, 88, 10); for (var p = 5; p < 90; p += 8) a.f('#8a5a30', p, 35, 1, 10);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.ellipse(48, 30, 42, 26, 0, Math.PI, 0); a.x.lineTo(90, 34); a.x.lineTo(6, 34); a.x.fill();
    a.x.fillStyle = '#e8483a'; a.x.beginPath(); a.x.ellipse(48, 30, 40, 24, 0, Math.PI, 0); a.x.lineTo(88, 33); a.x.lineTo(8, 33); a.x.fill();
    for (var c = 0; c < 8; c++) { a.x.fillStyle = c % 2 ? '#f8d040' : '#e8483a'; a.x.beginPath(); a.x.ellipse(48, 30, 40, 24, 0, Math.PI + c * 0.39, Math.PI + (c + 1) * 0.39); a.x.lineTo(48, 33); a.x.fill(); }
    a.f('#2a1a3a', 22, 14, 52, 20); a.f('#c8323a', 22, 14, 6, 20); a.f('#c8323a', 68, 14, 6, 20);
    for (var l = 0; l < 6; l++) a.f(((l + fr) % 3 === 0) ? '#fff0a0' : '#f0a030', 26 + l * 8, 12, 3, 3);
    a.f('#f8d040', 42, 20, 12, 4); a.p('#1a1a22', 45, 21); a.p('#1a1a22', 50, 21);
    bunting(a, 4, 92, 6, fr, 1);
    return a.c;
  } };

  // ---------- the wreck on the Old Docks flats: a listing hull with a broken mast and a lantern that never goes out ----------
  KINDS.wreckship = { w: 5, h: 3, door: 2, anim: true, draw: function (o) {
    var a = new Art(80, 48), fr = o.frame || 0;
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(2, 30); a.x.lineTo(20, 12); a.x.lineTo(78, 20); a.x.lineTo(70, 44); a.x.lineTo(10, 46); a.x.fill();
    a.x.fillStyle = '#4a5a58'; a.x.beginPath(); a.x.moveTo(5, 30); a.x.lineTo(21, 14); a.x.lineTo(75, 21); a.x.lineTo(68, 42); a.x.lineTo(12, 44); a.x.fill();
    for (var p = 0; p < 5; p++) { a.f('#2e3c3a', 8 + p * 3, 20 + p * 5, 62 - p * 3, 1); }
    a.f('#6a7a78', 22, 15, 52, 2);
    // broken mast and torn sail
    a.line(OUT, 46, 2, 44, 20, 4); a.line('#5a4a3a', 46, 2, 44, 20, 2); a.line(OUT, 44, 8, 60, 14, 2);
    a.x.fillStyle = 'rgba(200,214,220,0.75)'; a.x.beginPath(); a.x.moveTo(45, 6); a.x.lineTo(58, 10); a.x.lineTo(53, 20); a.x.lineTo(44, 18); a.x.fill();
    // portholes with pale light and the never-out lantern
    [[16, 30], [30, 30], [44, 30]].forEach(function (w, i) { a.ring(OUT, w[0], w[1], 4); a.ring('#2a3a3a', w[0], w[1], 3); if ((fr + i) % 3 !== 0) a.ring('#8af0e8', w[0], w[1], 2); });
    a.f(OUT, 63, 9, 1, 5); a.f(OUT, 60, 14, 7, 7); a.f('#8ad4e8', 61, 15, 5, 5); a.f((fr % 2) ? '#ffffff' : '#c8f8ff', 62, 16, 3, 3);
    // the door: a hatch in the hull
    a.f(OUT, 30, 34, 20, 14); a.f('#1a2222', 31, 35, 18, 13); a.f('#3a4a48', 31, 35, 18, 2);
    // seaweed and barnacles
    a.line('#3a6a58', 6, 44, 2, 34, 2); a.line('#3a6a58', 74, 40, 78, 30, 2); a.line('#5a9a7a', 20, 46, 16, 40, 1);
    [[10, 38], [26, 42], [60, 40]].forEach(function (b) { a.ring('#c8c4b8', b[0], b[1], 1.6); });
    return a.c;
  } };

  Object.keys(KINDS).forEach(function (k) { KINDS[k].custom = true; PK.BUILDINGS[k] = KINDS[k]; });
})();
