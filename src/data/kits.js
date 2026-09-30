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
  K(1, 'Mossip', ['Grass'], 1, L(2, 16), 'tank', 'st1', 'Moss Blob', { design: 'mossip' }, 'A soft ball of moss that naps in the sun by riverbanks. The flower on its head closes when it is scared.');
  K(2, 'Pebblom', ['Grass', 'Rock'], 2, L(3, 36), 'tank', 'st2', 'Moss Stone', { design: 'pebblom' }, 'Its moss has grown over a shell of river stone. It stands in one spot for days, and flowers bloom on its head.');
  K(3, 'Templith', ['Grass', 'Rock'], 3, null, 'tank', 'st3', 'Ruin Golem', { design: 'templith' }, 'Ancient carvings glow on its stone body. Whole groves grow on its shoulders, and birds nest in its temple crown.');
  K(4, 'Emberlet', ['Fire'], 1, L(5, 16), 'phys', 'st1', 'Hatchling', { design: 'emberlet' }, 'A baby dragon that never fully left its eggshell. The flame on its head flickers brighter when it is happy.');
  K(5, 'Shardrake', ['Fire'], 2, L(6, 36), 'phys', 'st2', 'Shell Drake', { design: 'shardrake' }, 'It wears pieces of its old eggshell as armor. Its flame crest streams behind it when it charges.');
  K(6, 'Halorax', ['Fire', 'Dragon'], 3, null, 'mixed', 'st3', 'Sun Dragon', { design: 'halorax' }, 'A ring of sunfire burns behind its head. Old songs say it once kept the valley warm through a winter that never ended.');
  K(7, 'Conchi', ['Water'], 1, L(8, 16), 'spec', 'st1', 'Ink Sprite', { design: 'conchi' }, 'A tiny squid that wears a conch shell as a hat. It squirts harmless ink when it sneezes.');
  K(8, 'Glyphsquid', ['Water'], 2, L(9, 36), 'spec', 'st2', 'Rune Squid', { design: 'glyphsquid', float: 1 }, 'Glowing runes appear on its body as it grows. No two Glyphsquid have the same markings.');
  K(9, 'Galleoth', ['Water', 'Ghost'], 3, null, 'spec', 'st3', 'Wreck Kraken', { design: 'galleoth' }, 'It wears the wreck of an old ship as a crown. Sailors leave lanterns on the shore so it will guide them home.');
  // ---- Brookhollow reeds ----
  K(10, 'Rushkin', ['Normal'], 1, L(11, 18), 'fast', 'e1', 'Reed Mouse', { design: 'rushkin' }, 'It climbs reeds to nibble the seeds at the top. Its fuzzy cattail tail makes a warm pillow.');
  K(11, 'Bulrusher', ['Normal', 'Grass'], 2, null, 'phys', 'e2', 'Marsh Brawler', { design: 'bulrusher' }, 'It weaves itself a hood of reeds and guards its patch of riverbank with a sharpened reed staff.');
  // ---- Willow Trail ----
  K(12, 'Kitefinch', ['Normal', 'Flying'], 1, L(13, 14), 'fast', 'e1', 'Kite Bird', { design: 'kitefinch' }, 'Its diamond-shaped wings catch the wind like a paper kite. Flocks of them dot the sky on breezy days.');
  K(13, 'Streamlark', ['Normal', 'Flying'], 2, L(14, 32), 'fast', 'b1', 'Streamer Bird', { design: 'streamlark' }, 'It trails long ribbon feathers when it flies. Villages hang ribbons on their gates to welcome it.');
  K(14, 'Festivane', ['Normal', 'Flying'], 3, null, 'phys', 'b2', 'Festival Kite', { design: 'festivane' }, 'Its great kite wings are painted in bright festival colors. When it circles overhead, a harvest is said to be coming.');
  K(15, 'Caddle', ['Bug'], 1, L(16, 7), 'tank', 'bug1', 'Case Grub', { design: 'caddle' }, 'It glues river pebbles and twigs into a tube and lives inside. It only pokes its head out to eat.');
  K(16, 'Stonesheath', ['Bug', 'Rock'], 2, L(17, 11), 'wall', 'bug2', 'Stone Case', { design: 'stonesheath' }, 'It seals its case shut and waits. Anyone who kicks it learns very quickly that it is made of stone.');
  K(17, 'Caddira', ['Bug', 'Grass'], 3, null, 'spec', 'bug3', 'Moss Moth', { design: 'caddira' }, 'It keeps one pebble from its old case pinned to its chest. Its mossy wings hum softly over the water at dusk.');
  K(18, 'Puffhop', ['Grass'], 1, L(19, 20), 'fast', 'b1', 'Dandelion Hare', { design: 'puffhop' }, 'Its tail is a giant dandelion puff. When it sneezes, seeds scatter everywhere and new flowers sprout.');
  K(19, 'Dandeloft', ['Grass', 'Flying'], 2, null, 'spec', 'b2', 'Seed Glider', { design: 'dandeloft', float: 1 }, 'Its ears grew into a dandelion parachute. It drifts over the valley for days, planting meadows as it goes.');
  K(20, 'Acornet', ['Bug'], 1, L(21, 22), 'tank', 'b1', 'Acorn Beetle', { design: 'acornet' }, 'It wears a fallen acorn cap as a helmet. It will fight anything, even a leaf, if the leaf looks at it wrong.');
  K(21, 'Oaknight', ['Bug', 'Steel'], 2, null, 'phys', 'b2', 'Knight Beetle', { design: 'oaknight' }, 'It forges armor from acorn shells and carries a twig lance. It swears an oath to protect one tree for life.');
  K(22, 'Skimble', ['Water'], 1, L(23, 24), 'fast', 'b1', 'Skip Fish', { design: 'skimble', float: 1 }, 'It is round and flat like a smooth river stone. It skips across the water to escape, up to twenty hops at a time.');
  K(23, 'Rapidfin', ['Water', 'Ground'], 2, null, 'phys', 'b2', 'Rapids Fish', { design: 'rapidfin', float: 1 }, 'Stone plates cover its back. It leaps up waterfalls that no other fish can climb.');
  K(24, 'Nocturr', ['Dark'], 1, L(25, 26), 'spec', 'b1', 'Owl Cat', { design: 'nocturr' }, 'It purrs like a cat and hoots like an owl. Its glowing eyes are the last lights you see on the trail at night.');
  K(25, 'Umbrowl', ['Dark', 'Flying'], 2, null, 'spec', 'b2', 'Night Stalker', { design: 'umbrowl' }, 'It wraps its wings around itself like a cloak and vanishes into the dark. A crescent moon glows on its chest.');
  K(26, 'Geodrop', ['Rock', 'Fairy'], 1, L(27, 30), 'wall', 'rare', 'Geode Snail', { design: 'geodrop' }, 'Its shell looks like a plain rock, but a crack in its side shows crystals glittering inside.');
  K(27, 'Amethell', ['Rock', 'Fairy'], 2, null, 'wall', 'b2', 'Crystal Snail', { design: 'amethell' }, 'A spire of purple crystal grows from its shell and glows in dark caves. It moves very slowly, and very proudly.');
  // ---- Pinecrest mountain ----
  K(28, 'Crampling', ['Rock'], 1, L(29, 17), 'fast', 'e1', 'Cliff Kid', { design: 'crampling' }, 'It hops between ledges no wider than a coin. The stone plate on its brow grows thicker every time it bonks into something.');
  K(29, 'Ledgeram', ['Rock'], 2, L(30, 34), 'phys', 'b1', 'Ledge Ram', { design: 'ledgeram' }, 'Herds of Ledgeram butt heads on the cliffs at dawn. The crack of their stone horns echoes for miles.');
  K(30, 'Peakhorn', ['Rock', 'Fighting'], 3, null, 'phys', 'b2', 'Summit Goat', { design: 'peakhorn' }, 'Its horns are shaped like the two highest peaks of the mountain. It stands on the summit and watches over every climber below.');
  K(31, 'Pebbeetle', ['Bug', 'Rock'], 1, L(32, 25), 'tank', 'b1', 'Pebble Beetle', { design: 'pebbeetle' }, 'Its shell is a smooth river pebble. When a Crampling steps on it by accident, the Crampling usually gets the worse end.');
  K(32, 'Bouldrone', ['Bug', 'Rock'], 2, null, 'phys', 'b2', 'Boulder Beetle', { design: 'bouldrone' }, 'It digs tunnels with its pickaxe horn. Old miners followed Bouldrone to find the richest rock in the mountain.');
  K(33, 'Echip', ['Flying', 'Dark'], 1, L(34, 18), 'fast', 'e1', 'Sonar Pup', { design: 'echip', float: 1 }, 'It keeps its eyes shut and finds its way with tiny squeaks. A cave full of Echip sounds like a room of squeaky toys.');
  K(34, 'Flittermaw', ['Flying', 'Dark'], 2, L(35, 36), 'fast', 'b1', 'Maw Bat', { design: 'flittermaw', float: 1 }, 'Its mouth is bigger than its head. It swallows moths whole and screeches loud enough to shake dust from the ceiling.');
  K(35, 'Stalagwing', ['Flying', 'Dark'], 3, null, 'phys', 'b2', 'Stalactite Bat', { design: 'stalagwing', float: 1 }, 'Stalactites grow from the edges of its wings. It hangs so still in deep caves that explorers mistake it for part of the ceiling.');
  K(36, 'Palewick', ['Water'], 1, L(37, 28), 'spec', 'b1', 'Blind Newt', { design: 'palewick' }, 'It has no eyes, only a tail tip that glows like a candle wick. It lives in the still pools under the mountain.');
  K(37, 'Gloamander', ['Water', 'Fairy'], 2, null, 'spec', 'b2', 'Lantern Newt', { design: 'gloamander' }, 'The spots on its back glow in patterns. Miners who got lost followed a Gloamander\'s lights back to the surface.');
  K(38, 'Glowgrub', ['Bug', 'Fairy'], 1, L(39, 12), 'tank', 'bug1', 'Glow Grub', { design: 'glowgrub' }, 'Its body rings glow brighter while it sleeps. Cave children keep one in a jar as a night-light.');
  K(39, 'Wickmoth', ['Bug', 'Fairy'], 2, null, 'spec', 'bug3', 'Lantern Moth', { design: 'glimmoth', float: 1 }, 'The eye spots on its wings glow a soft green. Clouds of Glimmoth drift through the dark caves like floating lanterns.');
  K(40, 'Quartzel', ['Rock'], 1, L(41, 30), 'mixed', 'ps1', 'Quartz Lizard', { design: 'quartzel' }, 'A single quartz crystal grows from its back. It basks on sunny rocks to make the crystal shine.');
  K(41, 'Facetail', ['Rock', 'Fairy'], 2, L(42, 50), 'mixed', 'ps2', 'Crystal Lizard', { design: 'facetail' }, 'Crystals line its spine and cluster into a club on its tail. It swings the club to crack open geodes for food.');
  K(42, 'Crystalisk', ['Rock', 'Fairy'], 3, null, 'mixed', 'ps3', 'Crystal Basilisk', { design: 'crystalisk' }, 'When it fans out its crystal frill, light bursts through it in every color. The Ashen Accord hunts it for the crystals it grows.');
  K(43, 'Amberjaw', ['Rock', 'Dragon'], 1, L(44, 40), 'phys', 'f1', 'Amber Fossil', { design: 'amberjaw' }, 'A Kit from the time before the mountain. Lumps of amber are set into its hide like jewels.');
  K(44, 'Runemaw', ['Rock', 'Dragon'], 2, null, 'phys', 'f2', 'Rune Titan', { design: 'runemaw' }, 'Its bone plates are carved with the same runes as the old tablet. Nobody knows who carved them, or when.');
  K(45, 'Flurrip', ['Ice'], 1, L(46, 26), 'fast', 'b1', 'Snow Lop', { design: 'flurrip' }, 'Icicles form on the tips of its floppy ears. When it shakes its head, they chime like tiny bells.');
  K(46, 'Avalop', ['Ice', 'Flying'], 2, null, 'fast', 'b2', 'Drift Hare', { design: 'avalop' }, 'It stomps its huge feet to start small snowslides, then rides them down the mountain for fun.');
  K(47, 'Hailet', ['Ice', 'Flying'], 1, L(48, 30), 'spec', 'b1', 'Snow Owlet', { design: 'hailet' }, 'It looks just like a snowball until it opens its big blue eyes. It lives near the frozen summit.');
  K(48, 'Rimecrown', ['Ice', 'Flying'], 2, null, 'spec', 'b2', 'Crown Owl', { design: 'glacrown' }, 'A crown of icicles grows on its head. Legends call it the ruler of the summit, and climbers bow as it flies past.');

  // ---- The Way Down: Far Slope (wind and wire), Windswept Trail (dune and scrub), Gullshore (shore) ----
  K(49, 'Wirelet', ['Electric'], 1, L(50, 24), 'fast', 'e1', 'Coil Hedgehog', { design: 'zipwick' }, 'Coils of copper wire grow in place of quills, and a little spark jumps between them when it is happy.');
  K(50, 'Arcwhisk', ['Electric'], 2, null, 'fast', 'b2', 'Arc Ferret', { design: 'arcwhisk' }, 'Arcs of blue electricity jump over its back as it slinks along. It can smell a storm hours before the first cloud shows up.');
  K(51, 'Windlet', ['Flying'], 1, L(52, 20), 'fast', 'e1', 'Gust Fluff', { design: 'windlet' }, 'A round ball of feathers that the wind carries wherever it likes. It never seems to mind.');
  K(52, 'Cliffswift', ['Flying'], 2, L(53, 38), 'fast', 'st2', 'Ledge Glider', { design: 'cliffswift' }, 'It sleeps on the wing and only lands to nest on sheer cliffs. Its forked tail steers it through the fiercest gusts.');
  K(53, 'Squallcrest', ['Flying', 'Electric'], 3, null, 'mixed', 'st3', 'Storm Raptor', { design: 'squallcrest' }, 'A small thundercloud follows it everywhere. Sailors watch for its crest to know when a squall is coming.');
  K(54, 'Dunelet', ['Ground'], 1, L(55, 26), 'tank', 'e1', 'Sand Roller', { design: 'dunelet' }, 'It rolls into a ball and lets the wind push it across the dunes. Its shell is the exact color of the sand it lives on.');
  K(55, 'Hazeveil', ['Ground', 'Psychic'], 2, null, 'spec', 'b2', 'Mirage Fox', { design: 'sandveil' }, 'The shimmering veil on its back bends the light. Travelers who follow one always end up somewhere they did not plan to go.');
  K(56, 'Tumblet', ['Normal'], 1, L(57, 22), 'bal', 'e1', 'Scrub Sentry', { design: 'tumblet' }, 'It stands on its hind legs and keeps watch while the others eat. Its tumbleweed tail is stuck on so well it is basically part of it.');
  K(57, 'Sentrybrush', ['Normal', 'Grass'], 2, null, 'phys', 'e2', 'Thorn Sentry', { design: 'sentrybrush' }, 'A mane of thorny brush grows down its back. It will not let anyone past its patch of trail until they battle it.');
  K(58, 'Cranklet', ['Water'], 1, L(59, 27), 'phys', 'e1', 'Shore Crab', { design: 'cranklet' }, 'One claw is huge and one is tiny, and it is very proud of both. It waves the big one at anything that passes.');
  K(59, 'Pincerlord', ['Water', 'Fighting'], 2, null, 'phys', 'b2', 'Claw Champion', { design: 'pincerlord' }, 'It wins contests by raising both claws and rattling them. Beach crabs line up to challenge it, and it always accepts.');
  K(60, 'Jellyp', ['Poison'], 1, L(61, 28), 'spec', 'e1', 'Moon Jelly', { design: 'jellyp', float: 1 }, 'It drifts into shore on the evening tide. Its glow is harmless, but the ends of its tentacles tingle.');
  K(61, 'Stingbloom', ['Poison', 'Water'], 2, null, 'spec', 'b2', 'Bloom Jelly', { design: 'stingbloom', float: 1 }, 'Petals grow around its bell like a flower opening at night. Fishers keep well away, because it stings as beautifully as it glows.');

  // ---------- stats ----------
  var BST = { f1: 360, f2: 515, st1: 315, st2: 410, st3: 530, e1: 255, e2: 420, b1: 310, b2: 480, bug1: 200, bug2: 285, bug3: 420, ps1: 300, ps2: 420, ps3: 600, single: 455, rare: 500, legend: 620, myth: 600 };
  var CATCH = { f1: 45, f2: 45, st1: 45, st2: 45, st3: 45, e1: 255, e2: 120, b1: 190, b2: 75, bug1: 255, bug2: 120, bug3: 45, ps1: 45, ps2: 30, ps3: 15, single: 90, rare: 45, legend: 3, myth: 3 };
  var ROLE = {
    bal: [1, 1, 1, 1, 1, 1], phys: [1, 1.35, 0.95, 0.7, 0.85, 1.1], spec: [0.95, 0.7, 0.85, 1.35, 1.05, 1.1],
    tank: [1.2, 1.0, 1.4, 0.7, 1.05, 0.6], fast: [0.85, 1.15, 0.75, 1.05, 0.8, 1.4], wall: [1.4, 0.75, 1.1, 0.85, 1.3, 0.6],
    mixed: [1, 1.12, 0.95, 1.12, 0.95, 1.0]
  };
  PK.STAT_NAMES = ['HP', 'ATK', 'DEF', 'TEC', 'RES', 'SPD'];

  // ---------- learnsets ----------
  var COVER = {
    Normal: ['Ground', 'Fighting'], Fire: ['Ground', 'Fighting'], Water: ['Ice', 'Psychic'], Grass: ['Poison', 'Ground'], Electric: ['Steel', 'Flying'],
    Ice: ['Water', 'Psychic'], Fighting: ['Ground', 'Ghost'], Poison: ['Ghost', 'Ground'], Ground: ['Steel', 'Fighting'], Flying: ['Bug', 'Normal'],
    Psychic: ['Fairy', 'Ghost'], Bug: ['Ground', 'Poison'], Ghost: ['Psychic', 'Poison'], Fairy: ['Flying', 'Psychic'], Steel: ['Ground', 'Electric'], Dragon: ['Fire', 'Water'],
    Rock: ['Ground', 'Fighting'], Dark: ['Ghost', 'Fighting']
  };
  function tier(p) { return p <= 45 ? 1 : p <= 70 ? 2 : p <= 90 ? 3 : 4; }
  var SIG = {};
  var SIGS = { 3: ['grovewrath', 36], 6: ['sunfire', 36], 9: ['maelstrom', 36] };

  function buildLearnset(k) {
    var r = PK.seeded(PK.hash('learn' + k.name));
    var sig = PK.SIGNATURE;
    var preferP = k.stats[1] >= k.stats[3];
    var t1 = k.types[0], t2 = k.types[1] || COVER[t1][0], cv = COVER[t1][k.types[1] ? 0 : 1], cv2 = COVER[t2] ? COVER[t2][0] : 'Normal';
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
      [1, function () { return pick('Normal', 1); }],
      [1, function () { var o = ['glower', 'pout', 'puffup'][r.int(3)]; used[o] = 1; return o; }],
      [4, function () { return pick(t1, 1); }],
      [8, function () { return k.types[1] ? pick(t2, 1) : status(t1); }],
      [12, function () { return pick('Normal', 2); }],
      [16, function () { return pick(t1, 2); }],
      [20, function () { return status(t1) || status('Normal'); }],
      [25, function () { return pick(t2, 2) || pick(t1, 2); }],
      [30, function () { return pick(t1, 3); }],
      [35, function () { return status(t2) || status('Normal'); }],
      [40, function () { return pick(cv, 2) || pick(cv, 3); }],
      [45, function () { return pick(t2, 3) || pick('Normal', 3); }],
      [51, function () { return pick(t1, 4); }],
      [57, function () { return pick(cv2, 3) || pick('Normal', 3); }],
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
