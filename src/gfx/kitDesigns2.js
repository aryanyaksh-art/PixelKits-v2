// Kit designs for the Way Down (Far Slope, Windswept Trail, Gullshore): sky/storm, dune/scrub and shore Kits (ids 49-61).
// Same rules as kitDesigns.js: every Kit has its own draw function. Loaded after kitDesigns.js.
(function () {
  'use strict';
  var DESIGNS = window.PK.DESIGNS;
  function lower(y0) { return function (x, y) { return y > y0; }; }

  // ===== coil hedgehog -> arc ferret (Electric) =====
  DESIGNS.zipwick = {
    pal: { fur: '#56648a', belly: '#e8dcc0', coil: '#c8783a', spark: '#ffe650', snout: '#d8b898', iris: '#e8a020' },
    draw: function (d) {
      d.el(22, 61, 4, 1.7, 'fur'); d.el(38, 61, 4, 1.7, 'fur');
      d.el(35, 49, 17, 13.5, 'fur');
      // copper coil spines fanning over the back
      [[30, 38, 28, 26], [36, 36, 37, 22], [42, 38, 47, 26], [47, 43, 57, 34], [50, 50, 60, 46], [50, 57, 59, 58]].forEach(function (c) {
        d.cv(c[0], c[1], (c[0] + c[2]) / 2 + 3, (c[1] + c[3]) / 2 - 2, c[2], c[3], 'coil', 2.1, 0.8, { edge: true });
        d.px(c[2], c[3] - 1, 'spark'); d.px(c[2] + 1, c[3] - 2, 'spark');
      });
      d.el(24, 52, 9, 8.5, 'belly', { clip: lower(48) });
      d.el(18, 46, 8.6, 7.6, 'fur', { edge: true });
      d.el(13, 49, 4.4, 3.4, 'snout');
      d.el(21, 38, 3, 3.4, 'fur', { edge: true });
      if (!d.back) {
        d.eye(17, 44, 2.1, 2.4, { look: [-0.4, 0.1] }); d.eye(23.6, 44.4, 1.9, 2.2, { look: [-0.4, 0.1] });
        d.px(10.5, 47.5, 'ink'); d.px(11.5, 47.5, 'ink'); d.ln(12, 51.4, 16, 51.4, 'mouth', 0.35);
      }
      d.ln(20, 58, 18, 61, 'snout', 1.2, 1);
    }
  };
  DESIGNS.arcwhisk = {
    pal: { fur: '#e8ecf6', shade: '#8a98be', stripe: '#3a4470', coil: '#c8783a', spark: '#ffe650', spark2: '=#ffffff', iris: '#3ac8e8' },
    draw: function (d) {
      // spring coil tail
      d.cv(46, 50, 60, 52, 60, 36, 'shade', 3.4, 1.4);
      [[52, 50], [57, 46], [58, 40]].forEach(function (p) { d.el(p[0], p[1], 3.2, 1.4, 'coil', { edge: true }); });
      d.px(59, 33, 'spark'); d.px(60, 32, 'spark');
      // long weasel body
      d.el(36, 48, 15, 8.5, 'fur');
      d.el(35, 52, 10, 4.2, 'shade', { clip: lower(50) });
      d.ln(20, 45, 13, 42, 'fur', 5.8, 5);
      [[27, 57, 27, 62], [42, 57, 42, 62]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'fur', 2.2, 2.6, { edge: true }); d.el(l[2] - 1, l[3], 3.2, 1.3, 'fur'); });
      [[30, 42], [36, 40.5], [42, 42.5]].forEach(function (s) { d.ln(s[0], s[1], s[0] - 1, s[1] + 5, 'stripe', 0.9, 0.6); });
      // arcs jumping over the back
      d.cv(28, 38, 34, 26, 44, 36, 'spark', 0.6, 0.35); d.cv(33, 38, 39, 30, 47, 40, 'spark', 0.5, 0.3);
      d.px(36, 28, 'spark2'); d.px(43, 33, 'spark2');
      d.el(14, 40, 8.4, 7.4, 'fur', { edge: true });
      d.el(8.5, 43.5, 4, 3, 'shade');
      d.po([[14, 34], [16, 25], [20, 33]], 'fur', { edge: true }); d.po([[8, 35], [8, 27], [13, 34]], 'fur', { edge: true });
      d.cv(9, 45, 5, 47, 1, 45, 'spark', 0.5, 0.3); d.cv(9, 47, 5, 51, 2, 50, 'spark', 0.45, 0.3);
      if (!d.back) {
        d.eye(12.5, 38.5, 2.3, 2.6, { look: [-0.5, 0], lid: 0.25, lidMat: 'fur' }); d.eye(18.4, 39, 2, 2.4, { look: [-0.5, 0], lid: 0.25, lidMat: 'fur' });
        d.px(6.5, 42.5, 'ink'); d.ln(8, 47, 12, 46.5, 'mouth', 0.35);
      }
    }
  };

  // ===== cliff swift: puffball -> forked-tail glider -> storm crest (Flying -> Flying/Electric) =====
  DESIGNS.windlet = {
    pal: { fur: '#c4e4f6', wing: '#78b4de', beak: '#f2b84a', tuft: '#ffffff', iris: '#2a6ab8' },
    draw: function (d) {
      d.el(28, 61, 2.4, 1.1, 'beak'); d.el(36, 61, 2.4, 1.1, 'beak');
      d.el(32, 49, 12, 11.5, 'fur');
      d.el(21, 50, 3.6, 7, 'wing', { edge: true }); d.el(43, 50, 3.6, 7, 'wing', { edge: true });
      d.po([[22, 39], [18, 31], [27, 37]], 'tuft'); d.po([[27, 37], [26, 28], [33, 36]], 'tuft'); d.po([[33, 37], [37, 29], [38, 38]], 'tuft');
      d.el(32, 55, 7, 4, 'tuft', { clip: lower(53) });
      d.cv(26, 47, 30, 44, 34, 47, 'wing', 0.5, 0.3); d.cv(30, 51, 34, 48, 38, 51, 'wing', 0.5, 0.3);
      if (!d.back) {
        d.eye(27, 44, 2.8, 3, { look: [0, 0] }); d.eye(37, 44, 2.8, 3, { look: [0, 0] });
        d.po([[30.4, 47], [33.6, 47], [32, 50.5]], 'beak');
      }
    }
  };
  DESIGNS.cliffswift = {
    pal: { fur: '#a8d0ec', belly: '#f4fbff', wing: '#4c88c0', beak: '#f0b040', iris: '#e8a020' },
    draw: function (d) {
      d.el(28, 61.3, 2.4, 1.1, 'beak'); d.el(36, 61.3, 2.4, 1.1, 'beak');
      // forked tail
      d.po([[29, 50], [22, 62], [28, 55], [32, 63], [36, 55], [42, 62], [35, 50]], 'wing', { edge: true });
      d.el(32, 42, 9, 14, 'fur');
      d.el(32, 46, 5.5, 10, 'belly', { clip: lower(38) });
      // swept-back wings
      d.po([[24, 32], [8, 26], [3, 40], [11, 37], [9, 46], [16, 41], [24, 44]], 'wing', { edge: true });
      d.po([[40, 32], [56, 26], [61, 40], [53, 37], [55, 46], [48, 41], [40, 44]], 'wing', { edge: true });
      d.el(32, 26, 7.5, 7.5, 'fur');
      d.po([[27, 20], [32, 13], [37, 20]], 'wing');
      if (!d.back) {
        d.eye(28, 26, 2.3, 2.5, { look: [0, 0] }); d.eye(36, 26, 2.3, 2.5, { look: [0, 0] });
        d.po([[30.3, 28.5], [33.7, 28.5], [32, 32.5]], 'beak');
      }
    }
  };
  DESIGNS.squallcrest = {
    pal: { fur: '#7a98c0', belly: '#e4ecf8', cloud: '#c8d4e4', bolt: '#ffe23a', wing: '#40608a', beak: '#f0c040', iris: '#ffe23a' },
    draw: function (d) {
      d.el(26, 61.5, 3, 1.3, 'beak'); d.el(38, 61.5, 3, 1.3, 'beak');
      d.po([[27, 48], [18, 63], [26, 57], [32, 64], [38, 57], [46, 63], [37, 48]], 'wing', { edge: true });
      d.po([[43, 52], [50, 63], [46, 62]], 'bolt');
      d.el(32, 40, 11, 16, 'fur');
      d.el(32, 44, 6.5, 12, 'belly', { clip: lower(35) });
      d.po([[22, 28], [5, 22], [0, 38], [8, 35], [4, 46], [14, 40], [21, 44]], 'wing', { edge: true });
      d.po([[42, 28], [59, 22], [64, 38], [56, 35], [60, 46], [50, 40], [43, 44]], 'wing', { edge: true });
      d.ln(9, 27, 5, 37, 'bolt', 0.7, 0.4); d.ln(55, 27, 59, 37, 'bolt', 0.7, 0.4);
      d.el(32, 22, 8.5, 8, 'fur');
      // storm-cloud crest with a bolt
      [[24, 14, 5], [30, 10, 6.5], [37, 11, 6], [42, 15, 4.5]].forEach(function (c) { d.el(c[0], c[1], c[2], c[2] * 0.8, 'cloud', { edge: true }); });
      d.po([[31, 12], [36, 7], [34, 12], [39, 12], [33, 20], [34.5, 14]], 'bolt', { edge: true, light: 0.9 });
      if (!d.back) {
        d.eye(28, 23, 2.2, 2.3, { look: [0, 0], slit: true }); d.eye(36, 23, 2.2, 2.3, { look: [0, 0], slit: true });
        d.po([[30, 26], [34, 26], [32, 32]], 'beak');
      }
    }
  };

  // ===== dune armadillo -> veiled sand fox (Ground -> Ground/Psychic) =====
  DESIGNS.dunelet = {
    pal: { shell: '#d8b070', band: '#b88a48', skin: '#e8cfa0', horn: '#f4e4bc', iris: '#6a4a20' },
    draw: function (d) {
      d.el(24, 61, 4, 1.7, 'skin'); d.el(40, 61, 4, 1.7, 'skin');
      d.cv(46, 54, 58, 56, 60, 48, 'skin', 2.4, 1);
      d.el(35, 47, 15, 13.5, 'shell');
      [[26, 38], [31, 36], [37, 36], [43, 39]].forEach(function (b) { d.ln(b[0], b[1], b[0] - 2, b[1] + 16, 'band', 0.9, 0.7, { light: 0.35 }); });
      d.speckle('shell', 'horn', 10, 22, 36, 48, 58, 0.7);
      d.el(19, 46, 8, 7.5, 'skin', { edge: true });
      d.po([[14, 40], [11, 32], [18, 38]], 'shell', { edge: true }); d.po([[19, 38.5], [21, 31], [24, 39]], 'shell', { edge: true });
      d.ln(16, 53, 13, 60, 'skin', 2.2, 1.8);
      if (!d.back) {
        d.eye(15.6, 44.6, 1.6, 1.9, { look: [-0.4, 0], small: true }); d.eye(21.6, 44.8, 1.6, 1.9, { look: [-0.4, 0], small: true });
        d.el(14, 49.5, 2, 1.6, 'horn'); d.px(13, 49, 'ink');
      }
    }
  };
  DESIGNS.sandveil = {
    pal: { fur: '#d6a860', belly: '#f6e2b0', veil: '#e8c8f0', gem: '#ee4f96', gem2: '=#ffd0e8', iris: '#b83a86' },
    draw: function (d) {
      d.cv(44, 52, 56, 56, 60, 40, 'fur', 4, 1.6); d.cv(44, 50, 52, 48, 58, 36, 'veil', 3, 0.8, { light: 0.8 });
      d.el(31, 47, 12.5, 12, 'fur');
      d.el(30, 51, 8, 8, 'belly', { clip: lower(46) });
      d.el(20, 61, 4.4, 1.8, 'fur'); d.el(38, 61, 4.4, 1.8, 'fur');
      d.ln(22, 50, 20, 60, 'fur', 2.6, 2.2);
      // drifting sand veil draped over the back
      d.po([[24, 36], [42, 36], [52, 46], [48, 60], [43, 55], [40, 62], [34, 56], [28, 60], [26, 50]], 'veil', { light: 0.85 });
      d.speckle('veil', 'gem2', 8, 25, 38, 50, 60, 0.9);
      d.el(26, 33, 9.5, 8.5, 'fur', { edge: true });
      d.po([[19, 30], [15, 19], [25, 27]], 'fur', { edge: true }); d.po([[30, 25], [37, 17], [35, 30]], 'fur', { edge: true });
      d.el(26, 26.5, 2, 2.3, 'gem', { edge: true }); d.px(25.4, 25.4, 'gem2');
      if (!d.back) {
        d.eye(22, 34, 2.1, 2.4, { look: [-0.4, 0], lid: 0.3, lidMat: 'fur' }); d.eye(29.5, 34, 2.1, 2.4, { look: [-0.4, 0], lid: 0.3, lidMat: 'fur' });
        d.px(25.5, 37.5, 'ink'); d.ln(24, 39.5, 27.5, 39.5, 'mouth', 0.35);
      }
    }
  };

  // ===== scrub meerkat -> thorn-maned sentry (Normal -> Normal/Grass) =====
  DESIGNS.tumblet = {
    pal: { fur: '#c8a470', belly: '#f0dcb0', weed: '#a8874a', dark: '#5a3e1c', iris: '#3a2a10' },
    draw: function (d) {
      d.el(40, 50, 9.5, 9, 'weed', { edge: true });
      [[35, 46], [42, 44], [46, 52], [38, 55], [43, 58]].forEach(function (p) { d.ln(p[0], p[1], p[0] + 5, p[1] - 3, 'dark', 0.4); });
      d.el(28, 60.5, 3.2, 1.5, 'fur'); d.el(22, 61, 3, 1.4, 'fur');
      d.el(27, 49, 8, 12, 'fur');
      d.el(27, 51, 5, 8.5, 'belly', { clip: lower(44) });
      d.ln(21, 45, 17, 51, 'fur', 1.8, 1.4); d.el(16.5, 52, 1.7, 1.5, 'dark');
      d.ln(33, 45, 36, 50, 'fur', 1.8, 1.4);
      d.el(27, 31, 8, 7.8, 'fur');
      d.el(23.5, 24.5, 2.3, 2.8, 'dark', { edge: true }); d.el(31.5, 24.5, 2.3, 2.8, 'dark', { edge: true });
      d.el(22.6, 34, 3.6, 3.2, 'dark'); d.el(31.4, 34, 3.6, 3.2, 'dark');
      if (!d.back) {
        d.eye(23.6, 32.6, 2, 2.3, { look: [-0.4, 0] }); d.eye(30.4, 32.6, 2, 2.3, { look: [-0.4, 0] });
        d.px(26.5, 36.6, 'dark'); d.ln(25.4, 38.4, 27.6, 38.4, 'mouth', 0.3);
      }
    }
  };
  DESIGNS.sentrybrush = {
    pal: { fur: '#b89258', belly: '#e6cf9c', thorn: '#5e8a3a', thorn2: '#8aae4e', dark: '#4a3218', flower: '#e85a8a', iris: '#2a5a1a' },
    draw: function (d) {
      d.cv(42, 58, 56, 60, 60, 46, 'fur', 3, 1);
      d.el(26, 61, 4.2, 1.8, 'fur'); d.el(38, 61, 4.2, 1.8, 'fur');
      d.el(32, 45, 10.5, 16, 'fur');
      d.el(32, 48, 6.5, 12, 'belly', { clip: lower(38) });
      // thorn brush mane down the back
      [[40, 34, 12], [43, 40, 12], [45, 47, 11], [44, 54, 10]].forEach(function (b) { d.po([[b[0] - 3, b[1] + 3], [b[0] + b[2] * 0.5, b[1] - 3], [b[0] + 2, b[1] + 8]], 'thorn', { edge: true }); });
      d.px(45, 38, 'flower'); d.px(47, 44, 'flower'); d.px(48, 51, 'flower');
      d.ln(24, 40, 17, 47, 'fur', 2.4, 2, { edge: true }); d.el(16.5, 48.5, 2.3, 2, 'dark', { edge: true });
      d.ln(40, 41, 44, 46, 'fur', 2.4, 2, { edge: true });
      d.el(30, 24, 9.5, 9.2, 'fur');
      d.el(24.5, 16.5, 2.6, 3.2, 'dark', { edge: true }); d.el(34, 16, 2.6, 3.2, 'dark', { edge: true });
      d.el(26, 26.4, 4.2, 3.6, 'dark'); d.el(35, 26.4, 4.2, 3.6, 'dark');
      d.po([[22, 12], [24, 5], [27, 11]], 'thorn2', { edge: true }); d.po([[30, 10], [32, 3], [35, 10]], 'thorn2', { edge: true });
      if (!d.back) {
        d.eye(26.4, 25, 2.2, 2.5, { look: [-0.4, 0], lid: 0.3, lidMat: 'fur' }); d.eye(34, 25, 2.2, 2.5, { look: [-0.4, 0], lid: 0.3, lidMat: 'fur' });
        d.px(30, 29.5, 'dark'); d.ln(28.5, 31.5, 31.5, 31.5, 'mouth', 0.4);
      }
    }
  };

  // ===== shore crab -> pincer champion (Water -> Water/Fighting) =====
  DESIGNS.cranklet = {
    pal: { shell: '#3a9aa8', belly: '#e8f0d8', claw: '#f08a4a', iris: '#2a3a6a' },
    draw: function (d) {
      [[14, 60, 9, 52], [20, 61, 15, 54], [44, 61, 49, 54], [50, 60, 55, 52]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'shell', 1.3, 1, { edge: true }); });
      d.el(32, 50, 17, 11, 'shell');
      d.el(32, 56, 11, 4, 'belly', { clip: lower(54) });
      // mismatched claws: one big, one small
      d.ln(17, 44, 11, 32, 'shell', 2.6, 2, { edge: true });
      d.el(9, 26, 6.2, 6.8, 'claw', { edge: true }); d.po([[7, 25], [9, 33], [11.4, 24]], 'shell'); d.cut(9, 30, 1.4, 2.4);
      d.ln(47, 45, 53, 40, 'shell', 1.8, 1.4, { edge: true }); d.el(55, 37, 3.2, 3.4, 'claw', { edge: true });
      d.ln(26, 40, 25, 33, 'shell', 0.9, 0.8); d.ln(38, 40, 39, 33, 'shell', 0.9, 0.8);
      if (!d.back) {
        d.eye(25, 31.5, 2.3, 2.6, { look: [-0.3, 0] }); d.eye(39, 31.5, 2.3, 2.6, { look: [-0.3, 0] });
        d.ln(28, 51, 36, 51, 'mouth', 0.4);
      }
    }
  };
  DESIGNS.pincerlord = {
    pal: { shell: '#2a7a98', plate: '#1a4a68', belly: '#e0ecd0', claw: '#ee7a3a', gold: '#f2c04a', iris: '#f0c040' },
    draw: function (d) {
      [[10, 60, 5, 50], [17, 62, 11, 54], [47, 62, 53, 54], [54, 60, 59, 50]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'shell', 1.8, 1.3, { edge: true }); });
      d.el(32, 46, 16, 14, 'shell');
      d.el(32, 54, 10, 6, 'belly', { clip: lower(52) });
      [[24, 40], [32, 37], [40, 40]].forEach(function (p) { d.el(p[0], p[1], 3.5, 2.6, 'plate', { edge: true }); });
      // champion claws raised
      d.ln(17, 42, 9, 26, 'shell', 3.4, 2.6, { edge: true }); d.el(7, 18, 8, 9, 'claw', { edge: true }); d.po([[4.5, 16], [7, 27], [10.5, 15]], 'shell'); d.cut(7, 23, 1.6, 3);
      d.ln(47, 42, 55, 26, 'shell', 3.4, 2.6, { edge: true }); d.el(57, 18, 8, 9, 'claw', { edge: true }); d.po([[53.5, 15], [57, 27], [60.5, 16]], 'shell'); d.cut(57, 23, 1.6, 3);
      d.ln(23, 34, 21, 25, 'shell', 1.1, 0.9); d.ln(41, 34, 43, 25, 'shell', 1.1, 0.9);
      d.ln(24, 33, 40, 33, 'gold', 0.7, 0.7);
      if (!d.back) {
        d.eye(21, 23.5, 2.6, 2.9, { look: [0, 0.2], lid: 0.35, lidMat: 'shell' }); d.eye(43, 23.5, 2.6, 2.9, { look: [0, 0.2], lid: 0.35, lidMat: 'shell' });
        d.ln(27, 50, 37, 50, 'mouth', 0.5);
      }
    }
  };

  // ===== moon jelly -> bloom jelly (Poison -> Poison/Water) =====
  DESIGNS.jellyp = {
    float: true,
    pal: { bell: '#d8b0f0', rim: '#a870d0', tent: '#c090e0', glow: '=#ffe8ff', iris: '#6a2a98' },
    draw: function (d) {
      [[24, 44, 20, 60], [29, 45, 30, 62], [35, 45, 34, 60], [40, 44, 44, 58]].forEach(function (t) { d.cv(t[0], t[1], t[0] - 3, (t[1] + t[3]) / 2, t[2], t[3], 'tent', 1.4, 0.5); });
      d.el(32, 34, 15, 13, 'bell', { clip: function (x, y) { return y < 44; } });
      d.el(32, 43, 15.5, 2.6, 'rim', { edge: true });
      d.el(32, 30, 9, 6, 'glow', { light: 1 });
      d.px(26, 36, 'glow'); d.px(39, 33, 'glow'); d.px(35, 27, 'glow');
      if (!d.back) {
        d.eye(27, 39, 2.2, 2.4, { look: [0, 0.1] }); d.eye(37, 39, 2.2, 2.4, { look: [0, 0.1] });
        d.ln(30.5, 42, 33.5, 42, 'mouth', 0.35);
      }
    }
  };
  DESIGNS.stingbloom = {
    float: true,
    pal: { bell: '#b8e0f4', petal: '#e8a0d8', petal2: '#a86ac8', tent: '#d090e0', glow: '=#f0ffff', iris: '#7a2aa8' },
    draw: function (d) {
      [[19, 42, 12, 60], [25, 45, 22, 63], [32, 46, 32, 64], [39, 45, 42, 63], [45, 42, 52, 60]].forEach(function (t) { d.cv(t[0], t[1], t[0] - 5, (t[1] + t[3]) / 2, t[2], t[3], 'tent', 1.7, 0.5); });
      // petal frill around the bell
      [[13, 34, -0.5], [19, 25, -0.25], [45, 25, 0.25], [51, 34, 0.5]].forEach(function (p) { d.el(p[0], p[1], 6, 9, 'petal', { edge: true }); d.el(p[0], p[1] + 1, 3, 5, 'petal2'); });
      d.el(32, 30, 17, 15, 'bell', { clip: function (x, y) { return y < 44; } });
      d.el(32, 44, 17.5, 3, 'petal2', { edge: true });
      d.po([[24, 24], [32, 14], [40, 24], [32, 20]], 'petal', { edge: true });
      d.el(32, 26, 9, 5, 'glow', { light: 1 });
      if (!d.back) {
        d.eye(26, 36, 2.5, 2.7, { look: [0, 0.1], lid: 0.2, lidMat: 'bell' }); d.eye(38, 36, 2.5, 2.7, { look: [0, 0.1], lid: 0.2, lidMat: 'bell' });
        d.ln(30, 40, 34, 40, 'mouth', 0.4);
      }
    }
  };
})();
