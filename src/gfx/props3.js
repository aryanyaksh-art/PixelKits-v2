// Saltmarsh furniture and props: aquarium tanks, arcade cabinets, a lighthouse lens, ship models, canning machinery,
// festival gear, costume-shop stock and the gym's mirror-and-beam pieces. Same format as props.js.
(function () {
  'use strict';
  var PK = window.PK;
  var Art = PK.buildings2.Art, OUT = PK.buildings2.OUT;
  var sh = function (c, a) { return PK.color.shade(c, a); };
  var WOOD = '#a8743e', WOODL = '#c8925a', WOODD = '#6a4424';
  function def(name, o) { o.custom = true; o.prop = true; if (o.door === undefined) o.door = null; PK.BUILDINGS[name] = o; }
  function canvas(o, dh) { return new Art(o.w * 16, Math.max(dh || 0, o.h * 16)); }
  function block(a, x, y, w, h, col, top) {
    a.f(OUT, x - 1, y - 1, w + 2, h + 2); a.f(col, x, y, w, h);
    if (top) { a.f(sh(col, 0.22), x, y, w, top); a.f(sh(col, 0.4), x, y, w, 1); }
    a.f(sh(col, -0.25), x, y + h - 1, w, 1);
  }
  function fishAt(a, x, y, col, dir) {
    a.f(col, x, y, 5, 2); a.f(sh(col, 0.35), x, y, 5, 1); a.f(col, dir > 0 ? x - 2 : x + 5, y - 1, 2, 4); a.p('#1a1a22', dir > 0 ? x + 4 : x, y);
  }

  // ================= aquarium =================
  // Big wall tank. variant: reef (default), deep, jelly, kelp
  def('bigtank', { w: 4, h: 2, dh: 48, anim: true, text: 'Water shimmers behind thick glass. Something enormous drifts past, then turns to look at you.', draw: function (o) {
    var W = o.w * 16, a = canvas(o, 48), f = o.frame || 0, v = o.variant || 'reef';
    var water = { reef: '#3aa0d0', deep: '#1c4a8a', jelly: '#2a3a8a', kelp: '#2a8a9a' }[v] || '#3aa0d0';
    block(a, 0, 34, W, 13, '#4a5a72', 0); a.f('#7a8aa4', 2, 36, W - 4, 2);
    a.f(OUT, 0, 0, W, 36); a.f('#dfe8f4', 1, 1, W - 2, 3); a.f(water, 2, 4, W - 4, 30); a.f(sh(water, 0.3), 2, 4, W - 4, 6); a.f(sh(water, -0.3), 2, 22, W - 4, 12);
    a.f('#e8f8ff', 3, 5, 2, 24); a.f('#e8f8ff', 7, 6, 1, 8);
    a.f('#c8b890', 2, 29, W - 4, 5); a.f('#a89870', 2, 32, W - 4, 2);
    if (v === 'reef') {
      a.f('#e8486a', 8, 24, 5, 6); a.f('#f0808a', 9, 22, 2, 3); a.f('#f0a848', 20, 26, 6, 4); a.f('#e870b0', W - 14, 22, 4, 8);
      fishAt(a, 10 + (f * 7) % 30, 12, '#f0a040', 1); fishAt(a, W - 16 - (f * 5) % 26, 17, '#e8e060', -1); fishAt(a, 22 + (f * 4) % 20, 20, '#f07a7a', 1);
    } else if (v === 'deep') {
      a.f('#0e1a3a', 2, 26, W - 4, 8); a.x.fillStyle = '#3a6ab0'; a.x.beginPath(); a.x.ellipse(W / 2 + f * 5 - 5, 15, 13, 4.4, 0, 0, Math.PI * 2); a.x.fill(); a.f('#3a6ab0', W / 2 + 11 + f * 5 - 5, 12, 4, 3);
      a.f('#8aa8d0', W / 2 - 4 + f * 5 - 5, 16, 8, 1); a.ring('#8ae8ff', 10, 26 - f * 2, 1.4); a.ring('#8ae8ff', W - 12, 20 + f, 1.2);
      a.f('#8ae8ff', 6, 30, 1, 3); a.f('#8ae8ff', W - 8, 31, 1, 2);
    } else if (v === 'jelly') {
      [[10, 12], [24, 18], [40, 10], [50, 20]].forEach(function (j, i) { var y = j[1] + ((f + i) % 3) - 1; a.x.fillStyle = ['#f0a0e0', '#a0e0f0', '#f0e0a0', '#c0a0f0'][i]; a.x.beginPath(); a.x.ellipse(j[0], y, 5, 4, 0, Math.PI, 0); a.x.fill(); for (var t = -3; t <= 3; t += 2) a.f(['#f0a0e0', '#a0e0f0', '#f0e0a0', '#c0a0f0'][i], j[0] + t, y, 1, 5 + (t & 1)); a.p('#ffffff', j[0] - 2, y - 2); });
    } else {
      for (var k = 0; k < 5; k++) { var kx = 6 + k * 12; for (var s = 0; s < 22; s += 2) a.f('#3aa050', kx + Math.round(Math.sin((s + f * 2) * 0.5 + k) * 2), 32 - s, 3, 2); }
      fishAt(a, 12 + (f * 6) % 34, 14, '#a8c8e8', 1);
    }
    a.f(OUT, 0, 0, 2, 36); a.f(OUT, W - 2, 0, 2, 36);
    return a.c;
  } });
  def('touchpool', { w: 3, h: 2, anim: true, text: 'A shallow touch pool. Tiny crabs and a sleepy starfish. The sign says: GENTLE FINGERS ONLY.', draw: function (o) {
    var a = canvas(o), W = o.w * 16, H = o.h * 16, f = o.frame || 0;
    a.f(OUT, 0, 0, W, H); a.f('#8a8a94', 1, 1, W - 2, H - 2); a.f('#3aa0c8', 4, 4, W - 8, H - 8); a.f('#7ad0e8', 4, 4, W - 8, 3);
    a.f('#c8b890', 6, H - 12, W - 12, 5); a.ring('#e8784a', 10, H - 11, 2); a.ring('#5a5ec0', W - 14, H - 12, 3, 1); a.p('#ffe8a0', W - 14, H - 12);
    a.f('#e8f8ff', 8 + f * 6, 10, 5, 1); a.f('#e8f8ff', W - 18 - f * 4, 15, 4, 1);
    a.f(OUT, W / 2 - 1, 2, 3, 3); a.p('#f8f4e8', W / 2, 3);
    return a.c;
  } });
  def('shipmodel', { w: 2, h: 1, dh: 30, text: 'A ship model in a glass case. The plaque: "The Gull and Sun, first vessel of the Saltmarsh fleet."', draw: function (o) {
    var a = canvas(o, 30), W = o.w * 16;
    block(a, 0, 20, W, 10, '#5a3a24', 2);
    a.f(OUT, 2, 3, W - 4, 19); a.f('rgba(200,236,255,0.55)', 3, 4, W - 6, 17); a.f('#e8f8ff', 4, 5, 2, 8);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(5, 17); a.x.lineTo(W - 5, 17); a.x.lineTo(W - 8, 21); a.x.lineTo(8, 21); a.x.fill();
    a.f('#8a5a30', 6, 17, W - 12, 3); a.f('#c8323a', 6, 17, W - 12, 1);
    a.f(OUT, 15, 5, 2, 12); a.f(OUT, 24, 7, 2, 10);
    a.f('#f4ecd8', 8, 6, 7, 10); a.f('#f4ecd8', 17, 8, 7, 8); a.f('#e8483a', 26, 8, 4, 3);
    return a.c;
  } });
  def('starmap', { w: 2, h: 1, deco: true, walk: true, text: 'A chart of the night sky with lines between the stars. Someone has added little sailing ships in the margins.', draw: function (o) {
    var a = canvas(o), W = o.w * 16;
    a.f(OUT, 0, 1, W, 14); a.f('#1a2a4a', 1, 2, W - 2, 12);
    [[4, 5], [10, 9], [17, 4], [24, 8], [W - 5, 5]].forEach(function (s) { a.p('#fff2a0', s[0], s[1]); });
    a.line('#7a90c8', 4, 5, 10, 9, 1); a.line('#7a90c8', 10, 9, 17, 4, 1); a.line('#7a90c8', 17, 4, 24, 8, 1);
    return a.c;
  } });

  // ================= dockside odds and ends =================
  def('barrel', { w: 1, h: 1, dh: 20, text: 'A barrel, sealed and sticky with tar. It smells strongly of fish.', draw: function (o) {
    var a = canvas(o, 20);
    a.f(OUT, 1, 6, 14, 14); a.f(WOOD, 2, 7, 12, 12); a.f(WOODL, 2, 7, 3, 12); a.f(sh(WOOD, -0.3), 11, 7, 3, 12);
    a.f('#5a5a66', 2, 9, 12, 1); a.f('#5a5a66', 2, 16, 12, 1); a.f(WOODL, 2, 7, 12, 1);
    return a.c;
  } });
  def('ropecoil', { w: 1, h: 1, dh: 16, text: 'A neat coil of mooring rope, thick as your arm.', draw: function (o) {
    var a = canvas(o, 16);
    a.ring(OUT, 8, 10, 7); a.ring('#c8a868', 8, 10, 6, 2); a.ring(sh('#c8a868', -0.3), 8, 10, 3.5, 2.2); a.ring('#e8d090', 8, 8, 4.4, 4);
    return a.c;
  } });
  def('netpile', { w: 1, h: 1, dh: 16, text: 'A heap of fishing nets with cork floats. Something small is tangled in it, but it is only a sock.', draw: function (o) {
    var a = canvas(o, 16);
    a.f(OUT, 1, 6, 14, 10); a.f('#7aa08a', 2, 7, 12, 8);
    for (var i = 2; i < 14; i += 3) { a.f('#4a7060', i, 7, 1, 8); } for (var j = 8; j < 15; j += 3) a.f('#4a7060', 2, j, 12, 1);
    a.ring('#f0d040', 4, 8, 1.6); a.ring('#e8483a', 11, 10, 1.6); a.ring('#f0d040', 8, 13, 1.6);
    return a.c;
  } });
  def('anchor', { w: 1, h: 2, dh: 32, text: 'A rusted anchor as tall as a person, propped against the wall like a trophy.', draw: function (o) {
    var a = canvas(o, 32);
    a.line(OUT, 8, 3, 8, 26, 4); a.line('#7a8290', 8, 3, 8, 26, 2); a.line(OUT, 3, 9, 13, 9, 4); a.line('#7a8290', 3, 9, 13, 9, 2);
    a.ring(OUT, 8, 3, 3); a.ring('#7a8290', 8, 3, 2, 1); a.line(OUT, 2, 21, 8, 27, 3); a.line(OUT, 14, 21, 8, 27, 3); a.line('#7a8290', 2, 21, 8, 27, 1); a.line('#7a8290', 14, 21, 8, 27, 1);
    a.f('#a86a3a', 5, 6, 6, 1); a.f('#a86a3a', 6, 15, 4, 1);
    return a.c;
  } });
  def('buoy', { w: 1, h: 1, dh: 24, text: 'A big channel buoy waiting for a fresh coat of paint.', draw: function (o) {
    var a = canvas(o, 24);
    a.f(OUT, 7, 1, 2, 5); a.ring(OUT, 8, 6, 5); a.f(OUT, 3, 8, 10, 14);
    a.x.fillStyle = '#e8483a'; a.x.beginPath(); a.x.moveTo(4, 21); a.x.lineTo(12, 21); a.x.lineTo(11, 9); a.x.lineTo(5, 9); a.x.fill();
    a.f('#fcfcfc', 4, 14, 8, 3); a.ring('#e8483a', 8, 6, 4); a.p('#f8d040', 8, 3);
    return a.c;
  } });
  def('lifering', { w: 1, h: 1, deco: true, walk: true, text: 'A lifebuoy on a hook, ready for anything.', draw: function (o) {
    var a = canvas(o);
    a.ring(OUT, 8, 8, 6.5); a.ring('#e8483a', 8, 8, 5.6, 2.8);
    [0, 1.57, 3.14, 4.71].forEach(function (t) { a.ring('#fcfcfc', 8 + Math.cos(t) * 4.2, 8 + Math.sin(t) * 4.2, 1.7); });
    return a.c;
  } });

  // ================= signal station, radio, lens =================
  def('signalpanel', { w: 2, h: 1, dh: 28, anim: true, text: 'A panel of signal lamps and a brass Morse key. It clicks out the same message over and over: "ALL WELL".', draw: function (o) {
    var a = canvas(o, 28), W = o.w * 16, f = o.frame || 0;
    block(a, 0, 14, W, 14, '#4a5a74', 3);
    a.f('#1a2a3a', 3, 17, W - 6, 6);
    ['#e8483a', '#f8d040', '#4ab890', '#3a8ae0', '#e870b0'].forEach(function (c, i) { a.ring(OUT, 6 + i * 5, 20, 2); a.ring((i + f) % 3 === 0 ? c : sh(c, -0.5), 6 + i * 5, 20, 1.5); });
    a.f(OUT, 10, 25, 12, 3); a.f('#e8c050', 12, 24, 8, 2);
    a.f(OUT, 4, 2, 24, 12); a.f('#fcfcfc', 5, 3, 22, 10); a.f('#e8483a', 5, 3, 7, 5); a.f('#3a8ae0', 12, 3, 7, 5); a.f('#f8d040', 19, 3, 8, 5); a.f('#1a1a22', 5, 8, 22, 1);
    return a.c;
  } });
  def('radio', { w: 1, h: 1, dh: 24, anim: true, text: 'A big radio set. It hisses, then a cheerful voice says something about herring prices.', draw: function (o) {
    var a = canvas(o, 24), f = o.frame || 0;
    block(a, 1, 8, 14, 13, '#6a5a44', 2);
    a.f('#1a2a3a', 3, 11, 6, 6); a.f((f % 2) ? '#8aff8a' : '#4aa04a', 4, 12, 4, 1); a.ring('#c8b890', 12, 13, 2); a.ring('#c8b890', 12, 18, 1.4);
    a.line(OUT, 12, 8, 14, 0, 1); a.line('#c8d0dc', 12, 8, 14, 1, 1);
    return a.c;
  } });
  // The big rotating lens of the lighthouse: nested glass rings that glint as the frame changes
  def('lens', { w: 2, h: 2, dh: 48, anim: true, text: 'The great lens: hundreds of glass prisms in brass rings. One lamp inside becomes a beam you can see for twenty miles.', draw: function (o) {
    var a = canvas(o, 48), f = o.frame || 0;
    block(a, 2, 36, 28, 11, '#a88a4a', 2); a.f('#e8c060', 4, 38, 24, 1);
    a.ring(OUT, 16, 20, 15); a.ring('#8ac8e8', 16, 20, 14); a.ring('#c8ecf8', 16, 20, 11, 9); a.ring('#8ac8e8', 16, 20, 9, 7); a.ring('#c8ecf8', 16, 20, 6, 4);
    var glow = ['#fff8b0', '#ffe870', '#fff0a0'][f % 3]; a.ring(glow, 16, 20, 3.4);
    for (var i = 0; i < 8; i++) { var ang = i * Math.PI / 4 + f * 0.26; a.line('#e8f8ff', 16 + Math.cos(ang) * 4, 20 + Math.sin(ang) * 4, 16 + Math.cos(ang) * 13, 20 + Math.sin(ang) * 13, 1); }
    a.ring('#a88a4a', 16, 20, 15, 14);
    return a.c;
  } });

  // ================= arcade =================
  def('cabinet', { w: 1, h: 1, dh: 30, anim: true, text: 'An arcade cabinet. The attract screen says "INSERT SHELL".', draw: function (o) {
    var a = canvas(o, 30), f = o.frame || 0, col = o.color || '#5a3aa0';
    a.f(OUT, 1, 2, 14, 28); a.f(col, 2, 3, 12, 26); a.f(sh(col, 0.3), 2, 3, 12, 2);
    a.f('#0a0a18', 3, 6, 10, 9); a.f(['#4aff8a', '#ff4a8a', '#4ab8ff'][f % 3], 4, 7 + (f % 3), 3, 2); a.f(['#ffe870', '#ff9a4a', '#ffe870'][f % 3], 8, 10, 4, 2); a.p('#ffffff', 6 + f, 8);
    a.f('#2a2a3a', 3, 18, 10, 3); a.ring('#e8483a', 5, 19, 1.4); a.ring('#f8d040', 9, 19, 1.4); a.ring('#4ab8ff', 12, 19, 1);
    a.f('#f8d040', 4, 24, 8, 1);
    return a.c;
  } });
  def('clawmachine', { w: 2, h: 1, dh: 40, anim: true, text: 'A claw machine full of plush Kits. You are one good drop away from a Buoypup. You are always one good drop away.', draw: function (o) {
    var a = canvas(o, 40), f = o.frame || 0;
    a.f(OUT, 0, 2, 32, 38); a.f('#e85a8a', 1, 3, 30, 36); a.f(sh('#e85a8a', 0.3), 1, 3, 30, 2);
    a.f(OUT, 3, 6, 26, 20); a.f('#1a2a4a', 4, 7, 24, 18); a.f('rgba(200,236,255,0.25)', 4, 7, 24, 5);
    a.line('#c8d0dc', 16 + (f - 1) * 4, 7, 16 + (f - 1) * 4, 13, 1); a.f('#c8d0dc', 13 + (f - 1) * 4, 13, 7, 1); a.line('#c8d0dc', 13 + (f - 1) * 4, 14, 12 + (f - 1) * 4, 17, 1); a.line('#c8d0dc', 19 + (f - 1) * 4, 14, 20 + (f - 1) * 4, 17, 1);
    [[7, '#f0a040'], [13, '#4ab8e8'], [19, '#e8e060'], [25, '#c88ae0']].forEach(function (p, i) { a.ring(p[1], p[0], 21, 3.2); a.p('#1a1a22', p[0] - 1, 20); a.p('#1a1a22', p[0] + 1, 20); });
    a.f('#2a2a3a', 4, 28, 24, 6); a.ring('#f8d040', 9, 31, 2); a.f('#4a4a5a', 18, 30, 8, 3);
    return a.c;
  } });
  def('strengthtest', { w: 1, h: 2, dh: 40, anim: true, text: 'Test Your Might! Whack the pad and send the puck up the tower to ring the bell. You are not strong enough. Nobody is.', draw: function (o) {
    var a = canvas(o, 40), f = o.frame || 0;
    a.f(OUT, 6, 4, 4, 26); a.f('#e8483a', 7, 5, 2, 24); for (var i = 0; i < 6; i++) a.f('#fcfcfc', 6, 8 + i * 4, 4, 1);
    a.ring(OUT, 8, 3, 4.5); a.ring('#e8c050', 8, 3, 3.6); a.p('#fff8b0', 7, 2 + (f % 2));
    a.f(OUT, 1, 30, 14, 9); a.f('#6a4a2c', 2, 31, 12, 7); a.f('#c8323a', 4, 33, 8, 3);
    a.line(OUT, 12, 24, 15, 32, 3); a.line('#a8743e', 12, 24, 15, 32, 1); a.f(OUT, 9, 21, 7, 5); a.f('#8a8a94', 10, 22, 5, 3);
    return a.c;
  } });
  def('ringtoss', { w: 2, h: 1, dh: 26, text: 'Toss the ring over a bottle and win a prize. The bottles are slightly wider than the rings. Nobody mentions this.', draw: function (o) {
    var a = canvas(o, 26);
    block(a, 0, 14, 32, 12, '#c8323a', 3); a.f('#fcfcfc', 0, 20, 32, 2);
    [4, 11, 18, 25].forEach(function (x, i) { a.f(OUT, x, 5, 4, 10); a.f(['#4ab890', '#3a78d0', '#f0b030', '#e870b0'][i], x + 1, 6, 2, 8); a.f(OUT, x + 1, 3, 2, 3); });
    a.ring('#f8d040', 14, 12, 3, 2);
    return a.c;
  } });
  def('shellgame', { w: 2, h: 1, dh: 22, text: 'Three cups and a tiny Kit under one of them. The man is very fast, and also very friendly.', draw: function (o) {
    var a = canvas(o, 22);
    block(a, 0, 12, 32, 10, '#6a4a2c', 3); a.f('#3a8a5a', 2, 13, 28, 3);
    [5, 13, 21].forEach(function (x) { a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(x, 13); a.x.lineTo(x + 8, 13); a.x.lineTo(x + 6, 3); a.x.lineTo(x + 2, 3); a.x.fill(); a.x.fillStyle = '#e8483a'; a.x.beginPath(); a.x.moveTo(x + 1, 12); a.x.lineTo(x + 7, 12); a.x.lineTo(x + 5.5, 4); a.x.lineTo(x + 2.5, 4); a.x.fill(); a.f('#f8d040', x + 2, 8, 4, 1); });
    return a.c;
  } });

  // ================= festival and stage gear =================
  def('drumkit', { w: 2, h: 1, dh: 26, text: 'A drum kit painted with waves. The bass drum has a gull on it.', draw: function (o) {
    var a = canvas(o, 26);
    a.ring(OUT, 16, 18, 8); a.ring('#3a78d0', 16, 18, 7); a.ring('#f4ecd8', 16, 18, 5); a.ring('#e8c050', 16, 18, 8, 7);
    [[4, 12], [28, 12]].forEach(function (d) { a.ring(OUT, d[0], d[1] + 3, 5); a.ring('#e8483a', d[0], d[1] + 3, 4); a.ring('#f4ecd8', d[0], d[1] + 2, 3); a.line(OUT, d[0], d[1] + 8, d[0], 22, 1); });
    a.ring(OUT, 16, 5, 5); a.ring('#e8c050', 16, 5, 4); a.f(OUT, 15, 8, 2, 8);
    return a.c;
  } });
  def('festivaldrum', { w: 1, h: 1, dh: 22, text: 'A big festival drum. It goes BOOM.', draw: function (o) {
    var a = canvas(o, 22);
    a.f(OUT, 1, 6, 14, 14); a.f('#e8483a', 2, 7, 12, 12); a.f('#f8d040', 2, 12, 12, 2); a.f('#f4ecd8', 2, 7, 12, 3); a.f(sh('#e8483a', -0.3), 11, 7, 3, 12);
    a.f(OUT, 3, 1, 2, 7); a.f(OUT, 11, 2, 2, 6);
    return a.c;
  } });
  def('spotlight', { w: 1, h: 1, dh: 30, anim: true, text: 'A theatre spotlight on a stand. Its beam sweeps the ceiling.', draw: function (o) {
    var a = canvas(o, 30), f = o.frame || 0;
    a.line(OUT, 8, 14, 2, 29, 2); a.line(OUT, 8, 14, 14, 29, 2); a.line('#4a4a56', 8, 14, 3, 28, 1); a.line('#4a4a56', 8, 14, 13, 28, 1);
    a.f(OUT, 3, 5, 10, 10); a.f('#3a3a4a', 4, 6, 8, 8); a.ring(['#fff0a0', '#ff9ad8', '#9ae8ff'][f % 3], 8, 10, 3);
    return a.c;
  } });
  def('stagecurtain', { w: 3, h: 1, deco: true, walk: true, text: 'Heavy velvet curtains with gold tassels.', draw: function (o) {
    var a = canvas(o), W = o.w * 16;
    a.f(OUT, 0, 0, W, 16); a.f('#a8203a', 1, 1, W - 2, 15); for (var x = 2; x < W - 2; x += 4) { a.f('#c8384e', x, 1, 2, 15); a.f('#7a1428', x + 2, 1, 1, 15); }
    a.f('#e8c050', 0, 0, W, 2); a.f('#e8c050', 4, 12, 3, 4); a.f('#e8c050', W - 7, 12, 3, 4);
    return a.c;
  } });
  def('float', { w: 3, h: 2, dh: 48, anim: true, text: 'A festival float, hand-painted and glued together with more enthusiasm than skill.', draw: function (o) {
    var a = canvas(o, 48), f = o.frame || 0, v = o.variant || 'fish';
    block(a, 0, 30, 48, 12, '#a8743e', 2); a.f('#e8483a', 0, 34, 48, 3); stripes3(a, 0, 37, 48, 3);
    a.ring(OUT, 8, 43, 4); a.ring('#6a4a2c', 8, 43, 3); a.ring(OUT, 40, 43, 4); a.ring('#6a4a2c', 40, 43, 3);
    if (v === 'fish') { a.x.fillStyle = OUT; a.x.beginPath(); a.x.ellipse(24, 16, 17, 12, 0, 0, Math.PI * 2); a.x.fill(); a.x.fillStyle = '#f0a040'; a.x.beginPath(); a.x.ellipse(24, 16, 15, 10, 0, 0, Math.PI * 2); a.x.fill(); a.f('#f8c878', 12, 10, 20, 3); a.f(OUT, 38, 12 - f, 8, 3); a.f('#f08a3a', 38, 13 - f, 7, 2); a.ring('#fcfcfc', 14, 13, 3); a.ring('#1a1a22', 13.4, 13, 1.6); }
    else if (v === 'lighthouse') { a.f(OUT, 18, 0, 12, 32); stripes3v(a, 19, 1, 10, 30); a.f('#fff8b0', 20, 2, 8, 5); a.f(OUT, 16, 0, 16, 1); a.f('#c8323a', 17, 1, 14, 2); }
    else { a.ring(OUT, 24, 14, 13); a.ring('#f8d040', 24, 14, 12); for (var r = 0; r < 12; r++) { var ang = r * Math.PI / 6 + f * 0.1; a.line('#f8d040', 24 + Math.cos(ang) * 12, 14 + Math.sin(ang) * 12, 24 + Math.cos(ang) * 17, 14 + Math.sin(ang) * 17, 1); } a.ring('#1a1a22', 20, 12, 1.4); a.ring('#1a1a22', 28, 12, 1.4); a.f('#c8323a', 21, 18, 6, 1); }
    ['#e8483a', '#f8d040', '#3a8ae0', '#4ab890'].forEach(function (c, i) { a.f(c, 4 + i * 12 + (f % 2), 27, 2, 5); });
    return a.c;
  } });
  function stripes3(a, x, y, w, h) { for (var i = 0; i < w; i += 6) a.f('#fcfcfc', x + i, y, 3, h); }
  function stripes3v(a, x, y, w, h) { for (var i = 0; i < h; i += 8) { a.f('#f4f0e4', x, y + i, w, 4); a.f('#c8323a', x, y + i + 4, w, 4); } }

  // ================= costume workshop =================
  def('mannequin', { w: 1, h: 1, dh: 34, text: 'A dressmaker mannequin in a half-finished festival costume. The pins are staying in.', draw: function (o) {
    var a = canvas(o, 34), c = o.color || '#e83a8a';
    a.f(OUT, 7, 25, 2, 9); a.f(OUT, 3, 32, 10, 2);
    a.ring(OUT, 8, 6, 4.5); a.ring('#e8d0b0', 8, 6, 3.6);
    a.x.fillStyle = OUT; a.x.beginPath(); a.x.moveTo(3, 12); a.x.lineTo(13, 12); a.x.lineTo(14, 26); a.x.lineTo(2, 26); a.x.fill();
    a.x.fillStyle = c; a.x.beginPath(); a.x.moveTo(4, 13); a.x.lineTo(12, 13); a.x.lineTo(13, 25); a.x.lineTo(3, 25); a.x.fill(); a.f(sh(c, 0.3), 4, 13, 8, 2);
    a.p('#fcfcfc', 6, 17); a.p('#f8d040', 10, 20); a.p('#fcfcfc', 5, 22);
    return a.c;
  } });
  def('costumerack', { w: 2, h: 1, dh: 34, text: 'A rack of festival costumes: gull wings, crab claws, a full lighthouse suit, and something that is maybe a sardine.', draw: function (o) {
    var a = canvas(o, 34);
    a.f(OUT, 1, 4, 30, 2); a.f('#8a8a94', 1, 4, 30, 1); a.f(OUT, 2, 6, 2, 26); a.f(OUT, 28, 6, 2, 26);
    [[4, '#e83a8a'], [10, '#3a8ae0'], [16, '#f8d040'], [22, '#4ab890']].forEach(function (g, i) { a.f(OUT, g[0], 6, 6, 22); a.f(g[1], g[0] + 1, 7, 4, 20); a.f(sh(g[1], 0.3), g[0] + 1, 7, 1, 20); a.p('#fcfcfc', g[0] + 2, 12 + i); a.p('#fcfcfc', g[0] + 3, 18 - i); });
    return a.c;
  } });
  def('sewingmachine', { w: 1, h: 1, dh: 24, anim: true, text: 'A sewing machine stitching bunting all by itself. Ghosts, or a very good treadle.', draw: function (o) {
    var a = canvas(o, 24), f = o.frame || 0;
    block(a, 1, 14, 14, 8, '#6a4a2c', 2); a.f(OUT, 3, 5, 10, 10); a.f('#e8e0d0', 4, 6, 8, 8); a.f('#e83a8a', 5, 8, 6, 2);
    a.f(OUT, 11, 3, 2, 10); a.f('#c8d0dc', 11, 4 + f, 1, 6); a.f('#f8d040', 3, 15, 10, 1); a.p('#e83a8a', 5 + f * 2, 14);
    return a.c;
  } });
  def('fabricbolts', { w: 1, h: 1, dh: 30, text: 'Bolts of cloth in every color of the festival.', draw: function (o) {
    var a = canvas(o, 30);
    [[1, '#e83a8a'], [6, '#3a8ae0'], [11, '#f8d040']].forEach(function (b, i) { a.f(OUT, b[0], 6 + i * 2, 5, 22 - i * 2); a.f(b[1], b[0] + 1, 7 + i * 2, 3, 20 - i * 2); a.f(sh(b[1], 0.35), b[0] + 1, 7 + i * 2, 1, 20 - i * 2); });
    return a.c;
  } });

  // ================= cannery and trading company =================
  def('cannerybelt', { w: 4, h: 1, dh: 26, anim: true, text: 'A conveyor belt of tins rattling toward the labeling press. Every tin has a small lighthouse stamped on the lid.', draw: function (o) {
    var a = canvas(o, 26), W = o.w * 16, f = o.frame || 0;
    block(a, 0, 14, W, 8, '#5a5a66', 2); a.f('#2a2a30', 2, 16, W - 4, 4);
    for (var x = 2; x < W - 4; x += 4) a.f('#4a4a56', x + (f * 2) % 4, 16, 1, 4);
    for (var t = 0; t < 4; t++) { var tx = 4 + t * 15 + (f * 5) % 15; if (tx < W - 8) { a.f(OUT, tx, 8, 8, 9); a.f('#c8ccd8', tx + 1, 9, 6, 7); a.f('#e8483a', tx + 1, 11, 6, 2); a.f('#e8c050', tx + 3, 9, 2, 1); } }
    a.f(OUT, 1, 22, 3, 4); a.f(OUT, W - 4, 22, 3, 4);
    return a.c;
  } });
  def('cannerypress', { w: 2, h: 2, dh: 46, anim: true, text: 'A labeling press that hammers down again and again. It has the rhythm of a very grumpy drum.', draw: function (o) {
    var a = canvas(o, 46), f = o.frame || 0;
    block(a, 1, 32, 30, 13, '#5a5a66', 2); a.f('#8a8a94', 3, 34, 26, 2);
    a.f(OUT, 5, 2, 22, 12); a.f('#c8323a', 6, 3, 20, 10); a.f(OUT, 12, 14, 8, 4 + f * 4); a.f('#8a8a94', 13, 14, 6, 3 + f * 4);
    a.f(OUT, 3, 2, 3, 32); a.f('#7a7a86', 4, 3, 1, 30); a.f(OUT, 26, 2, 3, 32); a.f('#7a7a86', 27, 3, 1, 30);
    a.f('#fbfbf4', 9, 6, 14, 5); a.f('#e8c050', 14, 7, 4, 3);
    return a.c;
  } });
  def('fishcrate', { w: 1, h: 1, dh: 18, text: 'A crate stamped with a small lighthouse. Fish on top. Smells normal.', draw: function (o) {
    var a = canvas(o, 18);
    a.f(OUT, 1, 6, 14, 12); a.f(WOOD, 2, 7, 12, 10); a.f(WOODL, 2, 7, 12, 2); a.f(WOODD, 2, 12, 12, 1); a.f(WOODD, 7, 7, 2, 10);
    a.f('#8ab4d8', 3, 4, 4, 3); a.f('#f0a060', 8, 3, 5, 3); a.p('#1a1a22', 4, 5); a.p('#1a1a22', 12, 4);
    a.f('#e8c050', 10, 12, 3, 3);
    return a.c;
  } });
  def('ledgerdesk', { w: 2, h: 1, dh: 28, text: 'A tall clerk\'s desk with a big open ledger. Every line reads: "Festival supplies: assorted."', draw: function (o) {
    var a = canvas(o, 28);
    block(a, 0, 12, 32, 16, '#6a4a2c', 3); a.f(OUT, 4, 6, 24, 7); a.f('#fbfbf4', 5, 7, 11, 5); a.f('#fbfbf4', 16, 7, 11, 5); a.f('#8a8a94', 8, 9, 6, 1); a.f('#8a8a94', 19, 9, 6, 1);
    a.f('#243a5c', 24, 2, 4, 5);
    return a.c;
  } });

  // ================= gym: mirror and beam pieces =================
  // A beam mirror on a stand; variant '0'..'3' picks its facing (drawn as a slanted mirror)
  def('mirror', { w: 1, h: 1, dh: 26, text: 'A tall mirror on a swivel stand. Push it to turn it.', draw: function (o) {
    var a = canvas(o, 26), v = +(o.variant || 0) % 4;
    a.f(OUT, 4, 22, 8, 4); a.f('#8a8a94', 5, 22, 6, 3); a.f(OUT, 7, 12, 2, 11);
    var ang = [[-1, -1], [1, -1], [1, 1], [-1, 1]][v];
    a.line(OUT, 8 - 6 * ang[0], 12 - 6 * ang[1], 8 + 6 * ang[0], 12 + 6 * ang[1], 5); a.line('#c8ecf8', 8 - 6 * ang[0], 12 - 6 * ang[1], 8 + 6 * ang[0], 12 + 6 * ang[1], 3); a.line('#ffffff', 8 - 5 * ang[0], 12 - 5 * ang[1], 8 + 1 * ang[0], 12 + 1 * ang[1], 1);
    return a.c;
  } });
  def('beamlamp', { w: 1, h: 1, dh: 26, anim: true, text: 'A lamp that fires a thin beam of light. Bounce it with mirrors to reach the sun-dial targets.', draw: function (o) {
    var a = canvas(o, 26), f = o.frame || 0;
    block(a, 2, 14, 12, 10, '#4a4a56', 2); a.f(OUT, 4, 6, 8, 9); a.f('#2a2a34', 5, 7, 6, 7); a.ring(['#fff8b0', '#ffe870', '#fff0a0'][f % 3], 8, 10, 2.6);
    a.f('#ffffff', 7, 9, 2, 2);
    return a.c;
  } });
  def('suntarget', { w: 1, h: 1, dh: 26, anim: true, text: 'A sun-dial target. It lights up when a beam of light lands on it.', draw: function (o) {
    var a = canvas(o, 26), f = o.frame || 0, lit = !!o.lit;
    a.f(OUT, 5, 18, 6, 8); a.f('#8a8a94', 6, 18, 4, 6);
    a.ring(OUT, 8, 10, 8); a.ring(lit ? '#ffe870' : '#6a6a7a', 8, 10, 7); a.ring(lit ? '#fff8c8' : '#8a8a9a', 8, 10, 4.5);
    if (lit) for (var r = 0; r < 8; r++) { var t = r * Math.PI / 4 + f * 0.2; a.line('#ffe870', 8 + Math.cos(t) * 8, 10 + Math.sin(t) * 8, 8 + Math.cos(t) * 11, 10 + Math.sin(t) * 11, 1); }
    return a.c;
  } });
  def('winch', { w: 1, h: 1, dh: 26, text: 'A crank winch with a rope. Turn it and the crate on the other end moves.', draw: function (o) {
    var a = canvas(o, 26);
    block(a, 1, 14, 14, 10, '#6a4a2c', 2); a.f(OUT, 3, 5, 10, 10); a.ring('#8a8a94', 8, 10, 4); a.ring('#c8a868', 8, 10, 3, 1.5);
    a.line(OUT, 8, 10, 14, 4, 2); a.line('#a8743e', 8, 10, 13, 5, 1); a.ring('#8a8a94', 14, 4, 1.4);
    return a.c;
  } });
  def('cueboard', { w: 2, h: 1, dh: 28, anim: true, text: 'A stage cue board of coloured buttons. When a cue lights up, hit the matching colour.', draw: function (o) {
    var a = canvas(o, 28), f = o.frame || 0;
    block(a, 0, 14, 32, 14, '#2a2a4a', 3);
    ['#e8483a', '#f8d040', '#4ab890', '#3a8ae0'].forEach(function (c, i) { a.ring(OUT, 6 + i * 7, 22, 3); a.ring((f % 4) === i ? c : sh(c, -0.4), 6 + i * 7, 22, 2.4); });
    a.f(OUT, 3, 4, 26, 9); a.f('#0a0a18', 4, 5, 24, 7); a.f('#4aff8a', 5 + (f * 6) % 20, 8, 3, 2);
    return a.c;
  } });
  def('crank', { w: 1, h: 1, dh: 22, text: 'A brass crank. Turning it opens a flood gate somewhere in the walls.', draw: function (o) {
    var a = canvas(o, 22);
    block(a, 2, 14, 12, 8, '#8a6a34', 2); a.f(OUT, 7, 6, 2, 9); a.ring(OUT, 8, 5, 4); a.ring('#e8c060', 8, 5, 3, 1.5); a.line(OUT, 8, 5, 13, 1, 2); a.line('#e8c060', 8, 5, 12, 2, 1);
    return a.c;
  } });
})();
