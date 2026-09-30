// Kit designs for Saltmarsh (ids 62-79): harbor animals, storm-sea Kits, tide-pool critters, a ghost lantern, and the two
// legendaries. Same rules as the other design files: every Kit has its own draw function. Loaded after kitDesigns.js.
(function () {
  'use strict';
  var DESIGNS = window.PK.DESIGNS;
  function lower(y0) { return function (x, y) { return y > y0; }; }
  function upper(y0) { return function (x, y) { return y < y0; }; }

  // ===== harbor seal line: buoy pup -> chain-collared sea lion -> anchor-crested lion (Water -> Water -> Water/Steel) =====
  DESIGNS.buoypup = {
    pal: { fur: '#7ea6ca', belly: '#eaf3fb', ring: '#e8483a', ringw: '#fcfcfc', nose: '#2a3a52', whisk: '=#f4f8ff', iris: '#1a2438' },
    draw: function (d) {
      d.el(32, 61, 8, 2, 'fur');                     // tail flippers
      d.el(32, 50, 15, 12, 'fur');
      d.el(32, 55, 10, 7, 'belly', { clip: lower(50) });
      // the buoy ring it wears: alternating red and white bands around its middle
      d.el(32, 51.5, 16.4, 5.2, 'ring', { edge: true });
      [[19, 24], [30, 35], [41, 46]].forEach(function (b) { d.po([[b[0], 47], [b[1], 47], [b[1] - 1.5, 57], [b[0] - 1.5, 57]], 'ringw', { clip: function (x, y) { return d.g && true; } }); });
      d.cut(32, 51.5, 9, 2.4);
      d.el(32, 51.5, 10, 3, 'belly');                 // belly shows through the ring
      d.el(19, 55, 4.4, 2.6, 'fur', { edge: true }); d.el(45, 55, 4.4, 2.6, 'fur', { edge: true });
      d.el(32, 33, 12, 11, 'fur');
      d.el(32, 38, 7, 5, 'belly');
      d.po([[21.5, 27], [19, 22.5], [24, 25]], 'fur', { edge: true }); d.po([[42.5, 27], [45, 22.5], [40, 25]], 'fur', { edge: true });
      if (!d.back) {
        d.eye(26, 32, 3, 3.4, { look: [0, 0.1] }); d.eye(38, 32, 3, 3.4, { look: [0, 0.1] });
        d.el(32, 37, 2.4, 1.7, 'nose');
        d.ln(32, 38.5, 32, 41, 'mouth', 0.3); d.ln(32, 41, 29, 42.4, 'mouth', 0.3); d.ln(32, 41, 35, 42.4, 'mouth', 0.3);
        [[23, 38], [22, 40], [41, 38], [42, 40]].forEach(function (p) { d.px(p[0], p[1], 'whisk'); });
      }
    }
  };
  DESIGNS.quaysel = {
    pal: { fur: '#5a86b2', belly: '#dfeaf4', metal: '#aab2c0', gold: '#e8c04a', nose: '#1e2c44', whisk: '=#f4f8ff', iris: '#1a2438' },
    draw: function (d) {
      d.el(28, 61, 5, 1.8, 'fur'); d.el(40, 61, 5, 1.8, 'fur');
      d.cv(38, 56, 52, 58, 56, 46, 'fur', 3.4, 1.4);   // tail
      d.el(33, 46, 12.5, 15, 'fur');
      d.el(33, 50, 8.4, 11, 'belly', { clip: lower(40) });
      // flippers held out like a performer's arms
      d.ln(22, 40, 12, 46, 'fur', 3.2, 2.2, { edge: true }); d.el(10.5, 47, 3, 2, 'fur', { edge: true });
      d.ln(44, 40, 54, 44, 'fur', 3.2, 2.2, { edge: true }); d.el(56, 44.5, 3, 2, 'fur', { edge: true });
      // neck, head
      d.ln(33, 34, 32, 28, 'fur', 6, 5.4);
      d.el(31, 22, 10.5, 9, 'fur');
      d.el(27, 26, 6, 4.4, 'belly', { clip: lower(24) });
      d.po([[21.5, 17], [20, 12], [25, 15.5]], 'fur', { edge: true });
      // mooring chain around the neck with a brass bell
      for (var i = 0; i < 9; i++) { var a = i / 8 * Math.PI; d.el(24 + i * 2.5, 32 + Math.sin(a) * 2.2, 1.5, 1.1, 'metal', { edge: true }); }
      d.el(33, 36, 2.4, 2.8, 'gold', { edge: true }); d.px(33, 39, 'ink');
      if (!d.back) {
        d.eye(27, 21, 2.5, 2.8, { look: [-0.4, 0] }); d.eye(35, 21, 2.5, 2.8, { look: [-0.4, 0] });
        d.el(29, 26, 2.2, 1.6, 'nose');
        d.ln(29, 27.4, 29, 29, 'mouth', 0.3);
        [[21, 26], [20, 28], [23, 29], [38, 26], [39, 28]].forEach(function (p) { d.px(p[0], p[1], 'whisk'); });
      }
    }
  };
  DESIGNS.anchormane = {
    pal: { fur: '#3a5a8c', belly: '#c8d8ea', mane: '#5a90c8', rope: '#d8b878', metal: '#a8b0be', metald: '#6a7488', gold: '#e8c04a', tusk: '#f0ead8', nose: '#141c30', iris: '#f0c040' },
    draw: function (d) {
      d.el(24, 61.5, 6, 2, 'fur'); d.el(42, 61.5, 6, 2, 'fur');
      d.cv(42, 56, 58, 58, 60, 42, 'fur', 4.6, 1.6);
      d.el(33, 44, 15, 17, 'fur');
      d.el(33, 48, 10, 13, 'belly', { clip: lower(38) });
      // chain-mail plates along the shoulders and chest
      [[24, 33], [30, 31], [36, 31], [42, 33]].forEach(function (p) { d.el(p[0], p[1], 4.2, 3.2, 'metald', { edge: true }); d.el(p[0], p[1] - 0.6, 3.2, 2.2, 'metal'); });
      [[27, 40], [33, 40], [39, 40]].forEach(function (p) { d.el(p[0], p[1], 3.2, 2.4, 'metal', { edge: true }); });
      d.ln(20, 38, 9, 46, 'fur', 4, 3, { edge: true }); d.el(7.5, 47.5, 3.6, 2.4, 'fur', { edge: true });
      d.ln(46, 38, 57, 46, 'fur', 4, 3, { edge: true }); d.el(58.5, 47.5, 3.6, 2.4, 'fur', { edge: true });
      // rope-wrapped mane
      for (var i = 0; i < 9; i++) { var ma = (-160 + i * 17.5) * Math.PI / 180, mx = 32 + Math.cos(ma) * 12, my = 24 + Math.sin(ma) * 10.5; d.ln(32 + Math.cos(ma) * 6, 24 + Math.sin(ma) * 5, mx + Math.cos(ma) * 3, my + Math.sin(ma) * 3, 'mane', 3.6, 2, { edge: true }); }
      d.ln(19.5, 24, 45, 24, 'rope', 0.5, 0.5, { light: 0.5 }); d.ln(20.5, 30, 44, 30, 'rope', 0.5, 0.5, { light: 0.5 });
      d.el(32, 25, 10.4, 9.4, 'fur', { edge: true });
      d.el(28, 28, 6, 4.4, 'belly', { clip: lower(26) });
      d.po([[27, 30], [25.5, 39], [29, 32]], 'tusk', { edge: true }); d.po([[38, 30], [39.5, 39], [36, 32]], 'tusk', { edge: true });
      // golden anchor crest between the eyes
      d.ln(32, 10, 32, 21, 'gold', 1.2, 1); d.ln(28, 13, 36, 13, 'gold', 0.9, 0.9); d.cv(27, 19, 32, 24, 37, 19, 'gold', 0.9, 0.9);
      d.el(32, 9.5, 1.8, 1.8, 'gold', { edge: true });
      if (!d.back) {
        d.eye(27, 23, 2.4, 2.6, { look: [0, 0], lid: 0.3, lidMat: 'fur' }); d.eye(37, 23, 2.4, 2.6, { look: [0, 0], lid: 0.3, lidMat: 'fur' });
        d.el(32, 28, 2.6, 1.8, 'nose');
      }
    }
  };

  // ===== dock cat: tin-can scavenger kitten -> cutlass-tailed corsair (Dark -> Dark/Steel) =====
  DESIGNS.scupper = {
    pal: { fur: '#585868', belly: '#dcd6cc', patch: '#2a2a36', nose: '#f0a0a8', tin: '#b8bcc8', tind: '#7a8090', iris: '#e8c030' },
    draw: function (d) {
      d.cv(40, 56, 56, 58, 54, 40, 'fur', 3, 1.4); d.cv(53, 42, 56, 38, 52, 34, 'fur', 1.6, 1);
      d.el(32, 51, 12, 10, 'fur');
      d.el(31, 55, 7, 6, 'belly', { clip: lower(50) });
      d.el(24, 61, 4, 1.8, 'fur'); d.el(38, 61, 4, 1.8, 'fur');
      // a battered tin can it drags around
      d.rc(43, 54, 8, 8, 'tin', { edge: true }); d.ln(43, 57, 51, 57, 'tind', 0.4); d.ln(43, 60, 51, 60, 'tind', 0.4); d.el(47, 54, 4, 1.2, 'tind');
      d.el(30, 34, 12.5, 11, 'fur');
      d.po([[19.5, 28], [18, 17], [26, 25]], 'fur', { edge: true }); d.po([[19.8, 25], [19.4, 20.5], [23, 24.5]], 'nose');
      d.po([[34, 25], [41, 16], [42, 29]], 'fur', { edge: true });
      d.po([[41, 16], [43.5, 19.4], [40.4, 19]], 'ink');   // torn ear tip
      // pirate-style dark patch over one eye
      d.el(35, 33, 5.4, 4.6, 'patch');
      d.el(30, 40, 6, 4.4, 'belly', { clip: lower(38) });
      if (!d.back) {
        d.eye(24.5, 33, 2.8, 3.2, { look: [-0.3, 0] });
        d.el(35, 33, 2.2, 2.6, 'iris'); d.px(34, 32, 'shine');
        d.px(29.6, 38, 'nose'); d.px(30.6, 38, 'nose'); d.px(30.2, 39, 'nose');
        d.ln(28, 41, 32, 41, 'mouth', 0.3);
      }
    }
  };
  DESIGNS.corsaircat = {
    pal: { fur: '#3e3e52', belly: '#cfc8bc', patch: '#1a1a24', blade: '#d4dae6', bladed: '#8a94a8', sash: '#c8323a', sashd: '#8a1a26', gold: '#e8c04a', nose: '#e89aa4', iris: '#f0c030' },
    draw: function (d) {
      // tail shaped like a curved cutlass blade
      d.cv(42, 50, 62, 54, 58, 26, 'fur', 3, 1.5);
      d.po([[54, 30], [60, 20], [62, 12], [59, 14], [55, 24], [52, 30]], 'blade', { edge: true });
      d.ln(56, 22, 60, 14, 'bladed', 0.4, 0.3);
      d.el(34, 44, 12, 15, 'fur');
      d.el(33, 48, 7.4, 10, 'belly', { clip: lower(38) });
      d.el(26, 61, 5, 2, 'fur'); d.el(40, 61, 5, 2, 'fur');
      d.ln(24, 40, 19, 51, 'fur', 3, 2.4, { edge: true }); d.el(18, 52.5, 2.8, 2.2, 'fur', { edge: true });
      d.ln(44, 40, 49, 49, 'fur', 3, 2.4, { edge: true }); d.el(50, 50.5, 2.8, 2.2, 'fur', { edge: true });
      // sash across the chest with a brass buckle
      d.po([[24, 38], [30, 36], [44, 52], [39, 55]], 'sash', { edge: true }); d.ln(28, 40, 41, 53, 'sashd', 0.5, 0.4);
      d.el(35, 45, 2.4, 2.4, 'gold', { edge: true });
      d.el(31, 27, 11, 9.4, 'fur');
      d.po([[21, 23], [19, 11], [28, 20]], 'fur', { edge: true }); d.po([[36, 20], [43, 11], [42, 24]], 'fur', { edge: true });
      d.po([[19, 11], [22, 15], [17.6, 16]], 'gold');   // tarnished ear ring
      d.el(35, 26, 4.6, 4, 'patch');
      d.ln(28, 19, 42, 24, 'patch', 0.7, 0.4);
      d.el(30, 32, 5.6, 3.8, 'belly', { clip: lower(30) });
      if (!d.back) {
        d.eye(26.5, 26, 2.6, 2.9, { look: [-0.3, 0], lid: 0.2, lidMat: 'fur' });
        d.el(35, 26, 2, 2.3, 'iris'); d.px(34.4, 25.4, 'shine');
        d.px(30.4, 30, 'nose'); d.px(31.4, 30, 'nose');
        d.ln(28.5, 33, 33, 33, 'mouth', 0.3); d.px(33, 32, 'mouth');
      }
    }
  };

  // ===== pelicans: cargo-stuffed pouches (Flying -> Flying/Water) =====
  DESIGNS.pouchbill = {
    pal: { down: '#e8e6e0', downd: '#b8b4ae', bill: '#f0b84a', pouch: '#f4c9a0', fish: '#8ab4d8', fishd: '#5a86ac', eye: '#1a1a22', iris: '#1a1a22' },
    draw: function (d) {
      d.el(26, 61, 3.4, 1.4, 'bill'); d.el(38, 61, 3.4, 1.4, 'bill');
      d.ln(28, 56, 27, 61, 'bill', 1, 1); d.ln(37, 56, 38, 61, 'bill', 1, 1);
      d.el(32, 47, 14, 13, 'down');
      d.el(21, 48, 3.6, 7, 'downd', { edge: true }); d.el(43, 48, 3.6, 7, 'downd', { edge: true });
      d.speckle('down', 'downd', 14, 22, 40, 42, 58, 0.5);
      d.el(32, 30, 11, 10, 'down');
      // tufty head fluff
      [[28, 20, 3], [32, 18, 3.6], [36, 20, 3]].forEach(function (p) { d.el(p[0], p[1], p[2], p[2] * 1.2, 'down', { edge: true }); });
      // outsized bill with a sagging pouch and a fish tail poking out
      d.po([[20, 30], [44, 30], [46, 34], [20, 36]], 'bill', { edge: true });
      d.po([[21, 36], [45, 35], [43, 46], [30, 49], [22, 44]], 'pouch', { edge: true });
      d.ln(24, 40, 42, 40, 'bill', 0.3, 0.3, { light: 0.4 });
      d.po([[41, 40], [49, 36], [48, 43], [41, 43]], 'fish', { edge: true }); d.ln(43, 40, 47, 39, 'fishd', 0.4, 0.3);
      if (!d.back) {
        d.eye(25.5, 26, 3, 3.2, { look: [-0.2, 0.2] }); d.eye(38.5, 26, 3, 3.2, { look: [-0.2, 0.2] });
      }
    }
  };
  DESIGNS.cargobeak = {
    pal: { down: '#f2efe8', downd: '#c8c4bc', wing: '#7a8aa0', wingd: '#56647a', bill: '#f0b040', pouch: '#f4c09a', crate: '#a8743e', crated: '#6a4424', coin: '#ffdc50', rope: '#c8a868', hat: '#2a3450', iris: '#e8b030' },
    draw: function (d) {
      d.ln(26, 56, 25, 62, 'bill', 1.3, 1.3); d.ln(40, 56, 41, 62, 'bill', 1.3, 1.3);
      d.el(23, 62, 4, 1.5, 'bill'); d.el(43, 62, 4, 1.5, 'bill');
      d.el(33, 44, 16, 15, 'down');
      d.el(18, 44, 5, 12, 'wing', { edge: true }); d.el(48, 44, 5, 12, 'wing', { edge: true });
      [[18, 38], [18, 46], [48, 38], [48, 46]].forEach(function (p) { d.ln(p[0] - 2.4, p[1], p[0] + 2.4, p[1] + 3, 'wingd', 0.5, 0.4); });
      // rope bandolier
      d.cv(22, 34, 33, 44, 44, 52, 'rope', 1.1, 1); d.cv(44, 34, 33, 44, 22, 52, 'rope', 1.1, 1);
      d.el(33, 26, 10, 9.4, 'down');
      d.po([[24, 20], [42, 20], [40, 14], [26, 14]], 'hat', { edge: true }); d.rc(24, 19, 18, 2.4, 'hat'); d.px(33, 16, 'coin');
      // huge bill; the pouch bulges with a lighthouse-stamped crate and a coin
      d.po([[15, 27], [47, 27], [50, 31], [16, 33]], 'bill', { edge: true });
      d.po([[17, 33], [49, 31], [46, 49], [28, 54], [17, 46]], 'pouch', { edge: true });
      d.rc(27, 38, 12, 9, 'crate', { edge: true }); d.ln(27, 42.5, 39, 42.5, 'crated', 0.5); d.ln(33, 38, 33, 47, 'crated', 0.5);
      d.el(45, 45, 2.4, 2.4, 'coin', { edge: true });
      if (!d.back) {
        d.eye(26, 22, 2.8, 3, { look: [-0.3, 0.1] }); d.eye(38, 22, 2.8, 3, { look: [-0.3, 0.1] });
      }
    }
  };

  // ===== storm eel -> thunder ray (Water/Electric -> Electric/Water) =====
  DESIGNS.fizzeel = {
    float: true,
    pal: { skin: '#3a9aa0', belly: '#d8f0e4', bolt: '#ffe650', spark: '=#fffbd0', fin: '#2a7078', iris: '#1a2a34' },
    draw: function (d) {
      d.cv(52, 52, 60, 42, 50, 36, 'skin', 2.4, 0.8);
      d.cv(14, 58, 26, 46, 20, 34, 'skin', 3.6, 3);
      d.cv(20, 34, 12, 22, 26, 16, 'skin', 4.2, 4.2);
      d.cv(26, 16, 40, 22, 46, 34, 'skin', 4.6, 4.2);
      d.cv(46, 34, 52, 46, 40, 54, 'skin', 4, 3.4);
      d.cv(40, 54, 30, 60, 14, 58, 'skin', 3.6, 3.4);
      // belly stripe along the front of each coil
      d.cv(24, 20, 34, 24, 42, 34, 'belly', 1.2, 1); d.cv(41, 54, 31, 58, 17, 57, 'belly', 1.1, 1);
      // lightning-bolt marks
      [[31, 20], [43, 38], [24, 55], [16, 40]].forEach(function (b) { d.po([[b[0], b[1] - 3], [b[0] + 2.5, b[1] - 3], [b[0] + 0.5, b[1] - 0.2], [b[0] + 2.6, b[1] - 0.2], [b[0] - 1.6, b[1] + 3.4], [b[0] - 0.2, b[1] + 0.4], [b[0] - 2.4, b[1] + 0.4]], 'bolt', { edge: true }); });
      d.po([[20, 18], [16, 10], [23, 14]], 'fin'); d.po([[30, 12], [30, 5], [35, 11]], 'fin');
      d.px(12, 24, 'spark'); d.px(50, 30, 'spark'); d.px(46, 58, 'spark');
      if (!d.back) {
        d.eye(30, 18, 2.4, 2.6, { look: [0.3, 0.1] }); d.eye(38, 20, 2.1, 2.4, { look: [0.3, 0.1] });
        d.ln(28, 24, 34, 25, 'ink', 0.4);
      }
    }
  };
  DESIGNS.stormray = {
    float: true,
    pal: { top: '#5a6a88', topd: '#3a4664', under: '#dfe8f4', bolt: '#ffe650', spark: '=#ffffff', cloud: '#8a98b4', iris: '#ffe650' },
    draw: function (d) {
      // long whip tail
      d.cv(32, 46, 34, 58, 48, 62, 'topd', 2, 0.5);
      // wide wings sweeping into points
      d.po([[32, 28], [12, 22], [1, 34], [10, 44], [24, 46], [32, 50]], 'top', { edge: true });
      d.po([[32, 28], [52, 22], [63, 34], [54, 44], [40, 46], [32, 50]], 'top', { edge: true });
      d.po([[32, 46], [24, 46], [10, 44], [16, 41], [28, 42]], 'under');
      d.po([[32, 46], [40, 46], [54, 44], [48, 41], [36, 42]], 'under');
      // storm-cloud mottling on the back
      [[18, 32, 4], [26, 28, 4.4], [38, 28, 4.4], [46, 32, 4], [32, 34, 5]].forEach(function (c) { d.el(c[0], c[1], c[2], c[2] * 0.7, 'cloud', { light: 0.7 }); });
      // crackling bolts along the wing edges
      [[6, 33], [14, 26], [50, 26], [58, 33]].forEach(function (b) { d.po([[b[0], b[1] - 4], [b[0] + 2.4, b[1] - 4], [b[0] + 0.6, b[1] - 0.6], [b[0] + 2.6, b[1] - 0.6], [b[0] - 1.6, b[1] + 4], [b[0] - 0.2, b[1] + 0.2], [b[0] - 2.4, b[1] + 0.2]], 'bolt', { edge: true }); });
      d.el(32, 30, 8, 7, 'top');
      d.po([[26, 22], [28, 15], [31, 22]], 'top', { edge: true }); d.po([[33, 22], [36, 15], [38, 22]], 'top', { edge: true });
      d.px(3, 41, 'spark'); d.px(60, 41, 'spark'); d.px(32, 54, 'spark');
      if (!d.back) {
        d.eye(28.4, 29, 2.3, 2.5, { look: [0, 0.1], iris: 'iris' }); d.eye(35.6, 29, 2.3, 2.5, { look: [0, 0.1], iris: 'iris' });
        d.ln(29.5, 34, 34.5, 34, 'mouth', 0.4);
      }
    }
  };

  // ===== storm nautilus (Water -> Water/Electric) =====
  DESIGNS.nimbell = {
    float: true,
    pal: { shell: '#dfe6f2', shelld: '#a4b0cc', spiral: '#7a88b0', skin: '#e8a8b8', cloud: '#c8d2e6', bolt: '#ffe650', iris: '#1a2438' },
    draw: function (d) {
      // little raincloud hovering over the shell, with two raindrops
      [[26, 9, 4.6], [33, 6.6, 5.6], [40, 9, 4.6]].forEach(function (c) { d.el(c[0], c[1], c[2], c[2] * 0.8, 'cloud', { edge: true }); });
      d.px(28, 17, 'spiral'); d.px(34, 19, 'spiral'); d.px(39, 16, 'spiral');
      // spiral shell
      d.el(36, 34, 16, 15, 'shell');
      d.cv(36, 34, 40, 30, 36, 26, 'spiral', 0.8, 0.8); d.cv(36, 26, 27, 28, 28, 37, 'spiral', 0.8, 0.8); d.cv(28, 37, 30, 47, 42, 46, 'spiral', 0.8, 0.8);
      d.el(36, 34, 3, 3, 'shelld');
      d.po([[34, 16], [37, 13], [38, 18]], 'bolt', { edge: true });
      // body and tentacles below
      d.el(23, 46, 8.6, 7, 'skin');
      [[16, 52, 12, 61], [21, 54, 20, 62], [27, 54, 28, 62], [31, 51, 36, 60]].forEach(function (t) { d.cv(t[0], t[1], t[0] - 1, (t[1] + t[3]) / 2, t[2], t[3], 'skin', 1.6, 0.6); });
      if (!d.back) {
        d.eye(19, 44, 2.6, 2.8, { look: [-0.3, 0.1] }); d.eye(27, 44, 2.6, 2.8, { look: [-0.3, 0.1] });
        d.ln(21, 49, 25, 49, 'mouth', 0.3);
      }
    }
  };
  DESIGNS.thundernaut = {
    float: true,
    pal: { shell: '#5a6a92', shelld: '#3a466a', spiral: '#9aa8d0', cloud: '#c4cee4', skin: '#d890a8', bolt: '#ffe650', spark: '=#ffffff', iris: '#ffe650' },
    draw: function (d) {
      // stormcloud swirling off the top of the shell
      [[24, 10, 6], [32, 7, 7], [41, 10, 6]].forEach(function (c) { d.el(c[0], c[1], c[2], c[2] * 0.75, 'cloud', { edge: true }); });
      d.el(38, 32, 21, 19, 'shell');
      d.el(38, 32, 15.4, 13.6, 'shelld');
      d.el(38, 32, 10, 9, 'shell');
      d.el(38, 32, 5, 4.4, 'shelld');
      d.el(38, 32, 1.8, 1.6, 'spiral');
      // lightning ring: bolts around the rim
      [[20, 26], [24, 16], [38, 12], [52, 18], [57, 30]].forEach(function (b) { d.po([[b[0], b[1] - 4], [b[0] + 2.4, b[1] - 4], [b[0] + 0.6, b[1] - 0.6], [b[0] + 2.6, b[1] - 0.6], [b[0] - 1.6, b[1] + 4], [b[0] - 0.2, b[1] + 0.2], [b[0] - 2.4, b[1] + 0.2]], 'bolt', { edge: true }); });
      d.el(22, 50, 10, 8, 'skin');
      [[12, 55, 6, 63], [17, 57, 14, 64], [23, 58, 24, 64], [30, 56, 36, 63], [33, 52, 44, 58]].forEach(function (t) { d.cv(t[0], t[1], t[0] - 2, (t[1] + t[3]) / 2, t[2], t[3], 'skin', 2, 0.7); d.px(t[2], t[3], 'spark'); });
      if (!d.back) {
        d.eye(17, 48, 2.8, 3, { look: [-0.3, 0.1], iris: 'iris' }); d.eye(27, 48, 2.8, 3, { look: [-0.3, 0.1], iris: 'iris' });
        d.ln(19.5, 54, 24.5, 54, 'mouth', 0.4);
      }
    }
  };

  // ===== tide-pool starfish (Water -> Water/Psychic) =====
  DESIGNS.twinklearm = {
    pal: { skin: '#5a5ec0', skind: '#3c3f8e', dot: '=#ffe8a0', dots: '#c8ccff', cheek: '#f08aa8', iris: '#1a1a3a' },
    draw: function (d) {
      var cx = 32, cy = 40, arms = [[-90, 17], [-18, 15], [54, 13], [126, 13], [198, 15]];
      arms.forEach(function (a) { var r = a[0] * Math.PI / 180; d.ln(cx, cy, cx + Math.cos(r) * a[1], cy + Math.sin(r) * a[1], 'skin', 6.2, 3, { edge: true }); });
      d.el(cx, cy, 10, 10, 'skin');
      // each arm carries a glowing dot; the body is speckled like a night sky
      arms.forEach(function (a) { var r = a[0] * Math.PI / 180; d.el(cx + Math.cos(r) * (a[1] - 3), cy + Math.sin(r) * (a[1] - 3), 1.1, 1.1, 'dot'); d.px(cx + Math.cos(r) * (a[1] * 0.5), cy + Math.sin(r) * (a[1] * 0.5), 'dots'); });
      d.speckle('skin', 'dots', 8, 22, 30, 42, 50, 0.7);
      if (!d.back) {
        d.eye(28, 39, 2.6, 3, { look: [0, 0.1] }); d.eye(36, 39, 2.6, 3, { look: [0, 0.1] });
        d.px(24.6, 43, 'cheek'); d.px(39.6, 43, 'cheek'); d.ln(30.5, 45, 33.5, 45, 'mouth', 0.3);
      }
    }
  };
  DESIGNS.constellarm = {
    pal: { skin: '#4a4ea8', skind: '#2e3070', star: '=#fff2b0', line: '#a8b0f0', eyeg: '#f0c0f0', iris: '#ff7ad8', orbit: '=#c8f0ff' },
    draw: function (d) {
      var cx = 32, cy = 38, arms = [[-90, 22], [-18, 20], [54, 17], [126, 17], [198, 20]];
      arms.forEach(function (a) { var r = a[0] * Math.PI / 180; d.ln(cx, cy, cx + Math.cos(r) * a[1], cy + Math.sin(r) * a[1], 'skin', 7, 2.4, { edge: true }); });
      d.el(cx, cy, 12, 12, 'skin');
      // star-chart lines tie the arm-tip stars together
      var pts = arms.map(function (a) { var r = a[0] * Math.PI / 180; return [cx + Math.cos(r) * (a[1] - 2), cy + Math.sin(r) * (a[1] - 2)]; });
      for (var i = 0; i < 5; i++) { var p = pts[i], q = pts[(i + 2) % 5]; d.ln(p[0], p[1], q[0], q[1], 'line', 0.35, 0.35, { light: 0.9 }); }
      pts.forEach(function (p) { d.el(p[0], p[1], 1.7, 1.7, 'star'); d.px(p[0], p[1] - 3, 'star'); d.px(p[0] + 3, p[1], 'star'); });
      // one big psychic eye in the centre, with two small stars orbiting it
      d.el(cx, cy, 6.4, 6, 'eyeg', { edge: true });
      d.el(cx, cy, 4, 4, 'ink'); d.el(cx, cy, 2.8, 2.8, 'iris'); d.px(cx - 1.6, cy - 1.6, 'shine');
      d.el(52, 12, 1.4, 1.4, 'orbit'); d.el(10, 16, 1.2, 1.2, 'orbit'); d.px(52, 9, 'orbit'); d.px(10, 13, 'orbit');
    }
  };

  // ===== hermit crab that collects treasures (Water/Rock -> Water/Rock) =====
  DESIGNS.trinkrab = {
    pal: { shell: '#d8b48c', shelld: '#a07a54', crab: '#e8743e', crabd: '#b04a24', cap: '#e04a4a', btn: '#4a88d8', gold: '#f0c84a', ribbon: '#68c890', iris: '#1a1a22' },
    draw: function (d) {
      [[14, 60, 8, 54], [20, 62, 14, 58], [46, 62, 52, 58], [52, 60, 58, 54]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'crab', 1.2, 0.9, { edge: true }); });
      // shell decorated with junk: a bottle cap, a button, a scrap of ribbon and a coin
      d.el(38, 40, 17, 17, 'shell');
      d.el(38, 40, 12.6, 12.6, 'shelld'); d.el(38, 40, 8.4, 8.4, 'shell'); d.el(38, 40, 4, 4, 'shelld');
      d.el(30, 30, 3.6, 1.6, 'cap', { edge: true }); d.px(28, 30, 'ink'); d.px(32, 30, 'ink');
      d.el(50, 36, 2.8, 2.8, 'btn', { edge: true }); d.px(49.4, 35.4, 'ink'); d.px(50.6, 35.4, 'ink');
      d.el(44, 52, 2.6, 2.6, 'gold', { edge: true });
      d.cv(26, 40, 30, 46, 33, 52, 'ribbon', 1.2, 0.8);
      // crab body peeking out, with one big claw
      d.el(18, 50, 9, 7, 'crab');
      d.ln(11, 46, 5, 38, 'crab', 2.6, 2.2, { edge: true }); d.el(4, 33, 4.6, 5, 'crab', { edge: true }); d.po([[2, 32], [4, 39], [7, 31]], 'crabd'); d.cut(4, 36, 1.2, 2);
      d.ln(14, 43, 12, 36, 'crab', 0.9, 0.9); d.ln(21, 43, 22, 35, 'crab', 0.9, 0.9);
      if (!d.back) {
        d.eye(12, 34, 2.4, 2.6, { look: [-0.2, 0] }); d.eye(22, 33, 2.4, 2.6, { look: [-0.2, 0] });
        d.ln(15, 52, 21, 52, 'mouth', 0.4);
      }
    }
  };
  DESIGNS.curiocrab = {
    pal: { shell: '#7a8aa0', shelld: '#4e5a70', crab: '#d05a3e', crabd: '#8a2e1e', brass: '#e8c04a', brassd: '#a88428', glass: '#a8d8f0', key: '#c8ccd8', ribbon: '#e85a8a', lens: '#f4f8ff', iris: '#1a1a22' },
    draw: function (d) {
      [[10, 60, 4, 52], [18, 63, 12, 58], [48, 63, 54, 58], [56, 60, 61, 52]].forEach(function (l) { d.ln(l[0], l[1], l[2], l[3], 'crab', 1.6, 1.1, { edge: true }); });
      // shell as a walking cabinet of curiosities: a bell, a telescope, a key, a ship's wheel
      d.el(40, 36, 20, 20, 'shell');
      d.el(40, 36, 15, 15, 'shelld'); d.el(40, 36, 9.6, 9.6, 'shell');
      d.po([[33, 12], [47, 12], [50, 22], [30, 22]], 'brass', { edge: true }); d.el(40, 23, 10, 2.2, 'brassd'); d.px(40, 26, 'ink');   // bell
      d.ln(52, 32, 62, 22, 'brass', 2.2, 1.6, { edge: true }); d.el(63, 21, 2.4, 2.4, 'glass', { edge: true });                               // telescope
      d.el(28, 34, 3.6, 3.6, 'key', { edge: true }); d.rc(26.6, 37, 2.6, 7, 'key', { edge: true }); d.rc(28, 42, 3, 1.4, 'key');              // key
      d.el(40, 48, 5, 5, 'brass', { edge: true }); d.cut(40, 48, 2.2, 2.2); [[40, 42], [40, 54], [34, 48], [46, 48]].forEach(function (p) { d.px(p[0], p[1], 'brassd'); });
      d.cv(23, 30, 20, 40, 26, 52, 'ribbon', 1.4, 0.8);
      d.el(20, 50, 10, 8, 'crab');
      // monocle over one eye and a raised claw holding a coin
      d.ln(11, 45, 4, 34, 'crab', 3, 2.4, { edge: true }); d.el(3, 28, 5.4, 6, 'crab', { edge: true }); d.po([[0.4, 26], [3, 35], [6.4, 26]], 'crabd'); d.cut(3, 31, 1.4, 2.4);
      d.el(1, 21, 2.4, 2.4, 'brass', { edge: true });
      d.ln(15, 43, 13, 34, 'crab', 1, 1); d.ln(24, 42, 26, 33, 'crab', 1, 1);
      if (!d.back) {
        d.eye(13, 32, 2.6, 2.8, { look: [-0.2, 0] }); d.eye(26, 31, 2.6, 2.8, { look: [-0.2, 0] });
        
        d.el(13, 32, 4.2, 4.2, 'lens', { light: 0.9 }); d.eye(13, 32, 2.2, 2.4, { look: [-0.2, 0] });
        d.ln(16, 52, 24, 52, 'mouth', 0.5);
      }
    }
  };

  // ===== drowned lantern from the ghost ship (Ghost/Fire) =====
  DESIGNS.wraithlamp = {
    float: true,
    pal: { brass: '#a88a4a', brassd: '#6a5424', glass: '#20405e', flame: ['#1a3a6a', '#3a7ad0', '#7ad0ff', '#c8f0ff', '#ffffff'], weed: '#3a6a58', weedl: '#5a9a7a', chain: '#7a8290', iris: '#0a1a2a' },
    draw: function (d) {
      d.ln(32, 0, 32, 10, 'chain', 0.9, 0.9); d.ln(28, 4, 32, 9, 'chain', 0.6, 0.6); d.ln(36, 4, 32, 9, 'chain', 0.6, 0.6);
      // brass lantern frame with a ghostly flame face inside
      d.po([[24, 12], [40, 12], [44, 18], [20, 18]], 'brass', { edge: true });
      d.el(32, 11, 4, 3, 'brass', { edge: true });
      d.po([[21, 18], [43, 18], [45, 50], [19, 50]], 'glass', { edge: true, light: 0.45 });
      d.flame(32, 51, 32, 10.5, 0, -1);
      d.rc(19, 50, 26, 5, 'brass', { edge: true }); d.rc(21, 55, 22, 3, 'brassd', { edge: true });
      [[21, 18, 19, 50], [43, 18, 45, 50], [32, 18, 32, 50]].forEach(function (b) { d.ln(b[0], b[1], b[2], b[3], 'brassd', 0.7, 0.7); });
      // seaweed and barnacles clinging to it
      d.cv(19, 52, 12, 58, 14, 64, 'weed', 1.6, 0.6); d.cv(45, 52, 52, 58, 49, 64, 'weed', 1.6, 0.6); d.cv(26, 58, 24, 62, 27, 66, 'weedl', 1, 0.5);
      d.el(20, 14, 1.3, 1.3, 'weedl'); d.el(44, 30, 1.2, 1.2, 'weedl');
      if (!d.back) {
        d.el(28, 36, 2.6, 3.4, 'ink'); d.el(36, 36, 2.6, 3.4, 'ink'); d.px(27.4, 34.6, 'shine'); d.px(35.4, 34.6, 'shine');
        d.el(32, 42, 2, 2.6, 'ink');
      }
    }
  };

  // ===== LEGENDARY: Argusalis, the Tidal Oracle (Water/Dragon) =====
  DESIGNS.argusalis = {
    float: true,
    pal: { skin: '#2a5a88', skind: '#173a63', belly: '#bfe6f0', fin: '#5ac8d8', fin2: '#a8f0f0', bubble: '#dff6ff', eyeo: '=#fff6c0', iris: '#e83a8a', pat: '#6ad8e8', horn: '#f0e8c8', glow: '=#8ef4ff' },
    draw: function (d) {
      // a long S-curve of body rising out of the swell, with a fin ridge down the back
      d.cv(2, 56, 8, 38, 24, 46, 'skind', 5, 6.4);
      d.cv(24, 46, 40, 54, 48, 40, 'skin', 6.4, 6.6);
      d.cv(48, 40, 58, 26, 46, 20, 'skin', 6.6, 6);
      d.cv(2, 56, 8, 38, 24, 46, 'skin', 3.6, 4.8);
      d.cv(9, 47, 16, 47, 24, 47, 'belly', 1.2, 1.4, { light: 0.9 });
      d.cv(30, 51, 38, 54, 45, 44, 'belly', 1.4, 1.6, { light: 0.9 });
      for (var i = 0; i < 6; i++) { var fx = 6 + i * 8.4, fy = 44 + Math.sin(i * 1.1) * 5; d.po([[fx - 2, fy], [fx, fy - 6], [fx + 2.6, fy]], i % 2 ? 'fin2' : 'fin', { edge: true }); }
      // glowing pattern lines along the flanks
      [[10, 50, 20, 46], [28, 52, 38, 53], [46, 34, 52, 24]].forEach(function (p) { d.ln(p[0], p[1], p[2], p[3], 'pat', 0.5, 0.5, { light: 0.95 }); });
      // head reared up and looking out: long whiskered muzzle, swept horns
      d.ln(46, 20, 40, 12, 'skin', 5, 5);
      d.el(38, 10, 8.6, 6.6, 'skin');
      d.el(31, 12.4, 6.6, 3.6, 'skin');
      d.el(33, 14.4, 5, 2, 'belly', { clip: lower(13) });
      d.po([[40, 5], [47, 0], [44, 8]], 'horn', { edge: true }); d.po([[36, 5], [39, 0], [39.6, 6.6]], 'horn', { edge: true });
      d.cv(28, 14, 20, 16, 15, 12, 'fin2', 0.6, 0.3, { light: 0.9 }); d.cv(28, 16, 21, 20, 17, 19, 'fin2', 0.6, 0.3, { light: 0.9 });
      // a crown of floating eyes, each in its own bubble, circling the head
      var eyes = [[29, 4, 2.6], [37, 0.6, 2.8], [46, 3, 2.4], [52, 10, 2.2], [24, 8, 2.1], [55, 17, 2]];
      eyes.forEach(function (e) {
        d.el(e[0], e[1], e[2] + 1.5, e[2] + 1.5, 'bubble', { light: 0.8, edge: true });
        d.el(e[0], e[1], e[2], e[2] * 0.9, 'eyeo'); d.el(e[0] + 0.3, e[1] + 0.2, e[2] * 0.62, e[2] * 0.66, 'iris'); d.px(e[0] - 0.4, e[1] - 0.6, 'shine');
      });
      if (!d.back) {
        d.eye(35, 9.6, 2.2, 2.4, { look: [-0.4, 0], iris: 'iris', slit: true });
        d.px(29, 11, 'ink');
      }
    }
  };

  // ===== LEGENDARY: Tempestine, the Storm-crowned Heron (Psychic/Water) =====
  DESIGNS.tempestine = {
    pal: { plume: '#7c8fb8', plumed: '#4a5a86', belly: '#dfe6f4', neck: '#94a4c8', bill: '#e8c060', cloud: '#c6d0e8', clouddk: '#7a86a8', bolt: '#ffe650', gem: '#ee5fa8', gem2: '=#ffd6ee', leg: '#c8a44a', ripple: '=#bfe6ff', iris: '#ff7ad0' },
    draw: function (d) {
      // ripples where it wades
      d.el(24, 62, 9, 1.6, 'ripple', { light: 0.9 }); d.el(24, 62, 5, 0.8, 'clouddk');
      // long legs
      d.ln(26, 46, 24, 61, 'leg', 1.1, 0.9); d.ln(32, 46, 34, 61, 'leg', 1.1, 0.9);
      d.ln(24, 61, 20, 62, 'leg', 0.8, 0.5); d.ln(34, 61, 38, 62, 'leg', 0.8, 0.5);
      // body with storm-grey cape wings sweeping back
      d.el(30, 38, 13, 11, 'plume');
      d.el(30, 42, 8, 6, 'belly', { clip: lower(38) });
      d.po([[42, 30], [60, 26], [56, 40], [61, 46], [48, 50], [40, 46]], 'plumed', { edge: true });
      [[44, 38], [50, 34], [55, 42], [48, 46]].forEach(function (p) { d.ln(p[0], p[1], p[0] + 5, p[1] + 3, 'plume', 0.6, 0.4); });
      d.po([[54, 40], [58, 34], [60, 39]], 'bolt', { edge: true, light: 0.9 });
      // long S-curved neck to a small crowned head
      d.cv(24, 34, 14, 26, 22, 14, 'neck', 3.6, 2.6);
      d.cv(24, 34, 16, 27, 22, 14, 'belly', 1.2, 0.8, { light: 0.8 });
      d.el(24, 11, 5.4, 4.8, 'neck');
      d.po([[19, 10.5], [4, 11.5], [19, 13.4]], 'bill', { edge: true });   // dagger beak
      // storm-cloud crest with tiny arcs of lightning
      [[26, 5, 3.4], [31, 4, 3.8], [35, 7, 3], [22, 5, 2.6]].forEach(function (c) { d.el(c[0], c[1], c[2], c[2] * 0.78, 'cloud', { edge: true }); });
      d.po([[28, 5], [32, 0], [31, 4.6], [34.4, 4.6], [29.6, 11], [30.6, 6.4]], 'bolt', { edge: true, light: 0.9 });
      d.cv(36, 6, 40, 12, 38, 20, 'plume', 1.4, 0.5); d.cv(34, 8, 38, 16, 35, 24, 'plumed', 1, 0.4);
      // third-eye gem on the brow
      d.el(21.4, 8, 1.7, 1.9, 'gem', { edge: true }); d.px(20.8, 7.2, 'gem2');
      if (!d.back) {
        d.eye(22.6, 11, 2, 2.2, { look: [-0.5, 0], iris: 'iris' });
      }
    }
  };
})();
