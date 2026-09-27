// The original Kits of Lumora (v2 roster). Each Kit's look comes from its hand-drawn design in gfx/kitDesigns.js.
// K(id, name, types, stage, evo, role, tier, category, art spec, KitLog text)
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var KITS = {};
  function K(id, name, types, stage, evo, role, tier, cat, art, dex) {
    KITS[id] = { id: id, name: name, types: types, stage: stage, evo: evo, role: role, tier: tier, cat: cat, art: art, dex: dex };
  }
  function L(to, lvl, time) { return { to: to, lvl: lvl, time: time }; }
  function I(to, item) { return { to: to, item: item }; }

  // ---- Starters: the three Kits swept down the Willow on the night of the flood ----
  K(1, 'Mossip', ['Leaf'], 1, L(2, 16), 'tank', 'st1', 'Moss Blob', { design: 'mossip' }, 'A soft ball of moss that naps in the sun by riverbanks. The flower on its head closes when it is scared.');
  K(2, 'Pebblom', ['Leaf', 'Terra'], 2, L(3, 36), 'tank', 'st2', 'Moss Stone', { design: 'pebblom' }, 'Its moss has grown over a shell of river stone. It stands in one spot for days, and flowers bloom on its head.');
  K(3, 'Templith', ['Leaf', 'Terra'], 3, null, 'tank', 'st3', 'Ruin Golem', { design: 'templith' }, 'Ancient carvings glow on its stone body. Whole groves grow on its shoulders, and birds nest in its temple crown.');
  K(4, 'Emberlet', ['Blaze'], 1, L(5, 16), 'phys', 'st1', 'Hatchling', { design: 'emberlet' }, 'A baby dragon that never fully left its eggshell. The flame on its head flickers brighter when it is happy.');
  K(5, 'Shardrake', ['Blaze'], 2, L(6, 36), 'phys', 'st2', 'Shell Drake', { design: 'shardrake' }, 'It wears pieces of its old eggshell as armor. Its flame crest streams behind it when it charges.');
  K(6, 'Halorax', ['Blaze', 'Wyrm'], 3, null, 'mixed', 'st3', 'Sun Dragon', { design: 'halorax' }, 'A ring of sunfire burns behind its head. Old songs say it once kept the valley warm through a winter that never ended.');
  K(7, 'Conchi', ['Tide'], 1, L(8, 16), 'spec', 'st1', 'Ink Sprite', { design: 'conchi' }, 'A tiny squid that wears a conch shell as a hat. It squirts harmless ink when it sneezes.');
  K(8, 'Glyphsquid', ['Tide'], 2, L(9, 36), 'spec', 'st2', 'Rune Squid', { design: 'glyphsquid', float: 1 }, 'Glowing runes appear on its body as it grows. No two Glyphsquid have the same markings.');
  K(9, 'Galleoth', ['Tide', 'Shade'], 3, null, 'spec', 'st3', 'Wreck Kraken', { design: 'galleoth' }, 'It wears the wreck of an old ship as a crown. Sailors leave lanterns on the shore so it will guide them home.');
  // ---- Brookhollow reeds ----
  K(10, 'Rushkin', ['Plain'], 1, L(11, 18), 'fast', 'e1', 'Reed Mouse', { design: 'rushkin' }, 'It climbs reeds to nibble the seeds at the top. Its fuzzy cattail tail makes a warm pillow.');
  K(11, 'Bulrusher', ['Plain', 'Leaf'], 2, null, 'phys', 'e2', 'Marsh Brawler', { design: 'bulrusher' }, 'It weaves itself a hood of reeds and guards its patch of riverbank with a sharpened reed staff.');
  // ---- Willow Trail ----
  K(12, 'Kitefinch', ['Plain', 'Gale'], 1, L(13, 14), 'fast', 'e1', 'Kite Bird', { design: 'kitefinch' }, 'Its diamond-shaped wings catch the wind like a paper kite. Flocks of them dot the sky on breezy days.');
  K(13, 'Streamlark', ['Plain', 'Gale'], 2, L(14, 32), 'fast', 'b1', 'Streamer Bird', { design: 'streamlark' }, 'It trails long ribbon feathers when it flies. Villages hang ribbons on their gates to welcome it.');
  K(14, 'Festivane', ['Plain', 'Gale'], 3, null, 'phys', 'b2', 'Festival Kite', { design: 'festivane' }, 'Its great kite wings are painted in bright festival colors. When it circles overhead, a harvest is said to be coming.');
  K(15, 'Caddle', ['Swarm'], 1, L(16, 7), 'tank', 'bug1', 'Case Grub', { design: 'caddle' }, 'It glues river pebbles and twigs into a tube and lives inside. It only pokes its head out to eat.');
  K(16, 'Stonesheath', ['Swarm', 'Terra'], 2, L(17, 11), 'wall', 'bug2', 'Stone Case', { design: 'stonesheath' }, 'It seals its case shut and waits. Anyone who kicks it learns very quickly that it is made of stone.');
  K(17, 'Caddira', ['Swarm', 'Leaf'], 3, null, 'spec', 'bug3', 'Moss Moth', { design: 'caddira' }, 'It keeps one pebble from its old case pinned to its chest. Its mossy wings hum softly over the water at dusk.');
  K(18, 'Puffhop', ['Leaf'], 1, L(19, 20), 'fast', 'b1', 'Dandelion Hare', { design: 'puffhop' }, 'Its tail is a giant dandelion puff. When it sneezes, seeds scatter everywhere and new flowers sprout.');
  K(19, 'Dandeloft', ['Leaf', 'Gale'], 2, null, 'spec', 'b2', 'Seed Glider', { design: 'dandeloft', float: 1 }, 'Its ears grew into a dandelion parachute. It drifts over the valley for days, planting meadows as it goes.');
  K(20, 'Acornet', ['Swarm'], 1, L(21, 22), 'tank', 'b1', 'Acorn Beetle', { design: 'acornet' }, 'It wears a fallen acorn cap as a helmet. It will fight anything, even a leaf, if the leaf looks at it wrong.');
  K(21, 'Oaknight', ['Swarm', 'Metal'], 2, null, 'phys', 'b2', 'Knight Beetle', { design: 'oaknight' }, 'It forges armor from acorn shells and carries a twig lance. It swears an oath to protect one tree for life.');
  K(22, 'Skimble', ['Tide'], 1, L(23, 24), 'fast', 'b1', 'Skip Fish', { design: 'skimble', float: 1 }, 'It is round and flat like a smooth river stone. It skips across the water to escape, up to twenty hops at a time.');
  K(23, 'Rapidfin', ['Tide', 'Terra'], 2, null, 'phys', 'b2', 'Rapids Fish', { design: 'rapidfin', float: 1 }, 'Stone plates cover its back. It leaps up waterfalls that no other fish can climb.');
  K(24, 'Nocturr', ['Shade'], 1, L(25, 26), 'spec', 'b1', 'Owl Cat', { design: 'nocturr' }, 'It purrs like a cat and hoots like an owl. Its glowing eyes are the last lights you see on the trail at night.');
  K(25, 'Umbrowl', ['Shade', 'Gale'], 2, null, 'spec', 'b2', 'Night Stalker', { design: 'umbrowl' }, 'It wraps its wings around itself like a cloak and vanishes into the dark. A crescent moon glows on its chest.');
  K(26, 'Geodrop', ['Terra', 'Lumen'], 1, L(27, 30), 'wall', 'rare', 'Geode Snail', { design: 'geodrop' }, 'Its shell looks like a plain rock, but a crack in its side shows crystals glittering inside.');
  K(27, 'Amethell', ['Terra', 'Lumen'], 2, null, 'wall', 'b2', 'Crystal Snail', { design: 'amethell' }, 'A spire of purple crystal grows from its shell and glows in dark caves. It moves very slowly, and very proudly.');

  // ---------- stats ----------
  var BST = { st1: 315, st2: 410, st3: 530, e1: 255, e2: 420, b1: 310, b2: 480, bug1: 200, bug2: 285, bug3: 420, ps1: 300, ps2: 420, ps3: 600, single: 455, rare: 500, legend: 620, myth: 600 };
  var CATCH = { st1: 45, st2: 45, st3: 45, e1: 255, e2: 120, b1: 190, b2: 75, bug1: 255, bug2: 120, bug3: 45, ps1: 45, ps2: 30, ps3: 15, single: 90, rare: 45, legend: 3, myth: 3 };
  var ROLE = {
    bal: [1, 1, 1, 1, 1, 1], phys: [1, 1.35, 0.95, 0.7, 0.85, 1.1], spec: [0.95, 0.7, 0.85, 1.35, 1.05, 1.1],
    tank: [1.2, 1.0, 1.4, 0.7, 1.05, 0.6], fast: [0.85, 1.15, 0.75, 1.05, 0.8, 1.4], wall: [1.4, 0.75, 1.1, 0.85, 1.3, 0.6],
    mixed: [1, 1.12, 0.95, 1.12, 0.95, 1.0]
  };
  PK.STAT_NAMES = ['HP', 'ATK', 'DEF', 'TEC', 'RES', 'SPD'];

  // ---------- learnsets ----------
  var COVER = {
    Plain: ['Terra', 'Brawl'], Blaze: ['Terra', 'Brawl'], Tide: ['Frost', 'Mind'], Leaf: ['Venom', 'Terra'], Volt: ['Metal', 'Gale'],
    Frost: ['Tide', 'Mind'], Brawl: ['Terra', 'Shade'], Venom: ['Shade', 'Terra'], Terra: ['Metal', 'Brawl'], Gale: ['Swarm', 'Plain'],
    Mind: ['Lumen', 'Shade'], Swarm: ['Terra', 'Venom'], Shade: ['Mind', 'Venom'], Lumen: ['Gale', 'Mind'], Metal: ['Terra', 'Volt'], Wyrm: ['Blaze', 'Tide']
  };
  function tier(p) { return p <= 45 ? 1 : p <= 70 ? 2 : p <= 90 ? 3 : 4; }
  var SIG = {};
  var SIGS = { 3: ['grovewrath', 36], 6: ['sunfire', 36], 9: ['maelstrom', 36] };

  function buildLearnset(k) {
    var r = PK.seeded(PK.hash('learn' + k.name));
    var sig = PK.SIGNATURE;
    var preferP = k.stats[1] >= k.stats[3];
    var t1 = k.types[0], t2 = k.types[1] || COVER[t1][0], cv = COVER[t1][k.types[1] ? 0 : 1], cv2 = COVER[t2] ? COVER[t2][0] : 'Plain';
    var used = {};
    function pick(type, tr) {
      var all = Object.keys(PK.MOVES).map(function (id) { return PK.MOVES[id]; }).filter(function (m) {
        return m.type === type && m.cat !== 'S' && tier(m.power) === tr && sig.indexOf(m.id) < 0 && !used[m.id];
      });
      if (!all.length) return null;
      var pref = all.filter(function (m) { return (m.cat === 'P') === preferP; });
      var pool = pref.length ? pref : all;
      var m = pool[r.int(pool.length)];
      used[m.id] = 1;
      return m.id;
    }
    function status(type) {
      var all = Object.keys(PK.MOVES).map(function (id) { return PK.MOVES[id]; }).filter(function (m) {
        return m.type === type && m.cat === 'S' && sig.indexOf(m.id) < 0 && !used[m.id];
      });
      if (!all.length) return null;
      var m = all[r.int(all.length)];
      used[m.id] = 1;
      return m.id;
    }
    var plan = [
      [1, function () { return pick('Plain', 1); }],
      [1, function () { var o = ['glower', 'pout', 'puffup'][r.int(3)]; used[o] = 1; return o; }],
      [4, function () { return pick(t1, 1); }],
      [8, function () { return k.types[1] ? pick(t2, 1) : status(t1); }],
      [12, function () { return pick('Plain', 2); }],
      [16, function () { return pick(t1, 2); }],
      [20, function () { return status(t1) || status('Plain'); }],
      [25, function () { return pick(t2, 2) || pick(t1, 2); }],
      [30, function () { return pick(t1, 3); }],
      [35, function () { return status(t2) || status('Plain'); }],
      [40, function () { return pick(cv, 2) || pick(cv, 3); }],
      [45, function () { return pick(t2, 3) || pick('Plain', 3); }],
      [51, function () { return pick(t1, 4); }],
      [57, function () { return pick(cv2, 3) || pick('Plain', 3); }],
      [63, function () { return pick(cv, 3); }],
      [70, function () { return pick(t2, 4) || pick(t1, 4); }]
    ];
    var ls = [];
    plan.forEach(function (p) { var id = p[1](); if (id) ls.push([p[0], id]); });
    var s = SIGS[k.id];
    if (s) ls.push([s[1], s[0]]);
    ls.sort(function (a, b) { return a[0] - b[0]; });
    return ls;
  }

  Object.keys(KITS).forEach(function (id) {
    var k = KITS[id];
    var w = ROLE[k.role] || ROLE.bal, sum = w.reduce(function (a, b) { return a + b; }, 0);
    var r = PK.seeded(PK.hash('stats' + k.name));
    var total = BST[k.tier];
    k.stats = w.map(function (x) { return Math.max(10, Math.round(total * x / sum + (r() * 10 - 5))); });
    k.catchRate = CATCH[k.tier];
    k.exp = Math.round(total * 0.22);
    if (k.tier === 'legend' || k.tier === 'myth') k.exp = 200;
  });
  Object.keys(KITS).forEach(function (id) { KITS[id].learn = buildLearnset(KITS[id]); });
  // mark pre-evolutions
  Object.keys(KITS).forEach(function (id) { var e = KITS[id].evo; if (e) KITS[e.to].from = +id; });
  void SIG;

  PK.KITS = KITS;
  PK.KIT_COUNT = Object.keys(KITS).length;
})();
