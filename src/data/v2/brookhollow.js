// Brookhollow: riverside mill village. The game opens here on the night of the flood.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, S = PK.SCRIPTS, Q = PK.QUESTS;
  function g() { return PK.game; }
  function flag(f) { return function () { return g().flag(f); }; }
  function storm() { return g().flag('storm'); }
  function calm() { return !g().flag('storm'); }
  function qdone(id) { return function () { return !!PK.quest && PK.quest.done(id); }; }
  function today() { return Math.floor(Date.now() / 86400000); }
  // Interior helper: two wall rows on top; rows are the floor below them
  function room(id, name, theme, width, floorRows, o) {
    var wall = new Array(width + 1).join('W');
    var top = [o.wall0 || wall, o.wall1 || wall];
    return D(id, Object.assign({ name: name, interior: true, theme: theme, rows: top.concat(floorRows) }, o));
  }

  // ================= Quests =================
  Q.flood = { title: 'The Flood Bell', kind: 'main', desc: 'The flood bell is ringing in the middle of a storm. Something is wrong at the mill.',
    steps: [{ id: 'mill', text: 'Run to the mill by the north bridge!' }] };
  Q.after = { title: 'After the Flood', kind: 'main', desc: 'Brookhollow woke up to mud, broken fences and a lot of questions.',
    steps: [
      { id: 'lab', text: 'Visit Prof. Vale at the river lab' },
      { id: 'help', text: 'Help the baker, the teacher and Grandma' },
      { id: 'gate', text: 'Look for clues in the floodgate house' },
      { id: 'grandma', text: 'Show Grandma the scrap of cloth' },
      { id: 'tower', text: "Find Grandpa's journal in the watchtower" },
      { id: 'north', text: 'Follow the river north to Willow Trail' }
    ], reward: 'The road north' };
  Q.flour = { title: 'Flour in the Reeds', kind: 'side', desc: 'The flood carried Baker Hobb\'s flour sacks out of the storeroom and into the reeds.',
    steps: [{ id: 'find', text: 'Find 3 flour sacks along the river' }, { id: 'return', text: 'Bring the flour back to Baker Hobb' }], reward: 'The market reopens' };
  Q.bell = { title: 'The Silent School Bell', kind: 'side', desc: 'The storm knocked the clapper out of the school bell and into the pond.',
    steps: [{ id: 'ask', text: 'Ask Old Fenwick on the dock for help' }, { id: 'berry', text: 'Bring Old Fenwick a River Berry for bait' }, { id: 'return', text: 'Return the clapper to Ms. Pell at the school' }], reward: 'Practice battles and a gift' };
  Q.lesson = { title: "Grandma's Catching Lesson", kind: 'side', desc: 'Grandma wants to see you catch a wild Kit the proper way.',
    steps: [{ id: 'catch', text: 'Catch a wild Kit in the riverside reeds' }, { id: 'show', text: 'Show Grandma your catch' }], reward: 'River Berries and a Hush Spray' };

  function helpDone() { return PK.quest.done('flour') && PK.quest.done('bell') && PK.quest.done('lesson'); }
  async function checkRecovery(w) {
    if (!helpDone() || !PK.quest.at('after', 'help')) return;
    await w.wait(20);
    await w.say('...The village sounds a little more like itself again.');
    await w.say('Everyone keeps asking the same question, though. How did the floodgate jam wide open on a night like that?');
    PK.quest.advance('after', 'gate');
  }

  // ================= Brookhollow (outdoors) =================
  D('brookhollow', {
    name: 'Brookhollow', theme: 'vale', region: 'Verdant Vale',
    music: function () { return storm() ? 'storm' : 'hometown'; },
    rows: [
      'TTTTTTWW~~~WWTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTT',
      'TTTTTTWW~~~WWTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTT',
      'TTTT..WW~~~WWT.............::.......TT.W......TT',
      'TTT..___JJJ___.............::..........W.....,TT',
      'TT...W..JJJ................::..........W......TT',
      'TT......~~~....::::........::.........-W......TT',
      'TT......~~~A......:........::.........-W/.....TT',
      'TT......~~~A......:.+:.....::...:.....-W......TT',
      'TT......~~~A......:-.:.FF-.::.-.:.....-W....,.TT',
      'TT......~~~A..T...:-.:,..-.::.-.:.....-W,.....TT',
      'TT......~~~A......:--:----.::.--:------WWW^WWWTT',
      'TT......~~~A......:..:....S::...:.........:...TT',
      'TT.:::::~~~:::::::::::::::::::::::::::::::::::TT',
      'TT.:...:===:..................................TT',
      'TT.:......~~~~.gggggggggggg.....gg............TT',
      'TT.:....E.~~~~.gg..g..gg&gg.....gg............TT',
      'TT.:......~~~.Sgg..g..ggggg.....gg............TT',
      'TT.:.....E~~~AAggggggggggggggggggg....:.......TT',
      'TT.::::...~~~AAgggggggggUggggggggg............TT',
      'TT.:....E.~~~..gg..g..gggggggggggg............TT',
      'TT.:...-..~~~T.gg..g..ggggggg//ggg............TT',
      'TT.:...-..~~~..ggggggggggggggggggg.:GGGGGGGGGGTT',
      'TT.:......~~~...........:..........:..........TT',
      'TT.:......~~~...........:.,........:..........TT',
      'TT.:......~~~.T.........:..........:..........TT',
      'TT.:......~~~...........:..........:..........TT',
      'TT.:......~~~...........:.........S::::.......TT',
      'TT.::::..A~~~...T.......:..,....,....,....,...TT',
      'TT.......A~~~...........:...,....,....,....,..TT',
      'TT......AA~~~......&....:....,....,....,....,.TT',
      'TTA......A~~~.................,....,....T.....TT',
      'TT.A....~~~~~~~~~~(~......,....,....,....,.T..TT',
      'TT..A...~(~~~~~~~~~~.......,....,....,....,...TT',
      'TT...A..~~~~~(~NNNNN:::::...,....,....,E...,..TT',
      'TT....AA~~~~~~~~(~~~.........,....,.T..,....,TTT',
      'TTT.....~~(~~~~~~~~~........T.,....,....,...T.TT',
      'TTTT....~~~~~~~~~(~~......,....,....,....,..T.TT',
      'TT..........~~................................TT',
      'TTTTTTTTTTTT~~TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TTTTTTTTTTTT~~TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'
    ],
    buildings: [
      { k: 'home', at: [20, 3], to: 'bh_home1f' },
      { k: 'mill', at: [4, 6], to: 'bh_mill' },
      { k: 'cottage', at: [4, 15], to: 'bh_grandma', roof: '#d4ae52' },
      { k: 'rivlab', at: [4, 22], to: 'bh_lab' },
      { k: 'floodhouse', at: [14, 2], to: 'bh_flood' },
      { k: 'home', at: [31, 3], to: 'bh_sitter', roof: '#b84a3a', icon: 'paw' },
      { k: 'tower', at: [41, 2], to: 'bh_tower' },
      { k: 'bakery', at: [27, 14], to: 'bh_bakery' },
      { k: 'stall', at: [17, 15], goods: 'fruit', roof: '#e8b030' },
      { k: 'stall', at: [20, 15], goods: 'fish', roof: '#4a90d8' },
      { k: 'stall', at: [17, 19], goods: 'bread', roof: '#e05a8a' },
      { k: 'stall', at: [20, 19], goods: 'flowers', roof: '#6aaa58' },
      { k: 'cottage', at: [36, 14], to: 'bh_teller', roof: '#6a4a8a', icon: 'eye' },
      { k: 'school', at: [36, 22], to: 'bh_school' },
      { k: 'boathouse', at: [20, 30], to: 'bh_boathouse' }
    ],
    props: [["vegpatch", 4, 20, {"w": 3, "h": 2, "text": "Grandma's herb and berry garden. Everything is neatly labeled."}], ["flowerpots", 2, 13], ["lantern", 2, 18], ["lantern", 7, 27], ["laundry", 22, 2, {"text": "Mom's laundry. One of the shirts is {RIVAL}'s, and it's been patched a lot."}], ["kithouse", 36, 6, {"color": "#4a8ae0"}], ["kithouse", 37, 6, {"color": "#e8a040"}], ["toybox", 35, 8], ["banner", 44, 3, {"color": "#3a78c8", "icon": "star"}], ["lantern", 14, 11], ["lantern", 24, 11], ["lantern", 34, 11], ["lantern", 44, 11], ["banner", 15, 13, {"color": "#d83a3a", "icon": "fruit"}], ["banner", 33, 13, {"color": "#3a9a50", "icon": "bread"}], ["crate", 23, 15, {"icon": "fruit"}], ["crate", 23, 16], ["cart", 31, 17, {"text": "A cart full of vegetables from the farms up the valley."}], ["candles", 41, 16, {"text": "Candles on the doorstep, flickering even in the daylight."}], ["flowerpots", 35, 16], ["dummy", 43, 26, {"text": "A practice dummy for the pupils. It's covered in little scorch marks and leaf cuts."}], ["dummy", 44, 26, {"text": "Another practice dummy. This one has a drawn-on face."}], ["rope", 25, 31], ["crate", 25, 30, {"icon": "fish"}], ["haybale", 30, 30], ["haybale", 31, 30], ["haybale", 30, 31], ["wheelbarrow", 33, 32]],
    signsAt: [
      [26, 11, 'BROOKHOLLOW - Where the Willow sings.'],
      [14, 16, function () { return PK.quest.done('flour') ? 'MARKET NOTICE: Fresh bread today! Fruit, fish, treats and flowers. Thank you to everyone who helped after the flood.' : 'MARKET NOTICE: Market closed until further notice. Flood cleanup in progress.'; }],
      [34, 26, 'BROOKHOLLOW SCHOOL - Every Keeper starts somewhere.']
    ],
    hiddenAt: [['tonic', 1, 43, 37], ['riverberry', 2, 2, 31]],
    npcs: {
      // the night of the flood
      grandma_storm: { at: [7, 12], sprite: 'grandma', dir: 'right', cond: storm, text: 'GRANDMA: {PLAYER}! Over here, by the bridge!' },
      flood1: { at: [10, 10], swim: true, swept: 'dddddddddd', sprite: 'kit:1', cond: function () { return storm() && !g().flag('starter'); }, text: 'A little Kit is clinging to a branch in the current!' },
      flood4: { at: [9, 12], swim: true, swept: 'rdddddddd', sprite: 'kit:4', cond: function () { return storm() && !g().flag('starter'); }, text: 'A little Kit is bobbing in the flood water!' },
      flood7: { at: [12, 14], swim: true, swept: 'dddddd', sprite: 'kit:7', cond: function () { return storm() && !g().flag('starter'); }, text: 'A little Kit is spinning in the current!' },
      sibling_storm: { at: [13, 6], sprite: 'rival', dir: 'down', startHidden: true, cond: storm },
      // everyday Brookhollow
      tomas: { at: [26, 3], sprite: 'tomas', dir: 'right', cond: calm, talk: 'bh_tomas' },
      baker: { at: [28, 19], sprite: 'baker', move: 'look', cond: function () { return calm() && !PK.quest.done('flour'); }, talk: 'bh_baker' },
      fruitseller: { at: [17, 14], sprite: 'villager1', dir: 'down', cond: qdone('flour'), talk: 'shop', stock: ['riverberry', 'sunpeach', 'minttea'] },
      fishseller: { at: [20, 14], sprite: 'villager3', dir: 'down', cond: qdone('flour'), talk: 'shop', stock: ['kelpcrisp', 'shellcrisp'] },
      breadseller: { at: [18, 18], sprite: 'baker', dir: 'down', cond: qdone('flour'), talk: 'shop', stock: ['honeybun', 'embercookie', 'swiftsnap'] },
      treatseller: { at: [21, 18], sprite: 'girl', dir: 'down', cond: qdone('flour'), talk: 'shop', stock: ['kittreat', 'fancytreat'] },
      fisher: { at: [15, 33], sprite: 'fisher', dir: 'left', cond: calm, talk: 'bh_fisher' },
      sweeper: { at: [22, 11], sprite: 'villager2', move: 'wander', cond: calm, text: 'Mud everywhere! The river came right up to the market. I\'ve never seen it that high.', textIf: [['after_done', 'The market smells like fresh bread again. You did good, kid.']] },
      oldman: { at: [40, 7], sprite: 'oldman', dir: 'down', cond: calm, text: 'I sit up here every morning. You can see the whole valley... and last night I saw lanterns moving up by the dam. Nobody goes up there at night.' },
      fencefix: { at: [8, 21], sprite: 'villager3', dir: 'left', cond: calm, text: "Grandma's herb garden fence got knocked flat. I'm patching it before the Rushkin get in!" },
      kid: { at: [33, 24], sprite: 'kid2', move: 'wander', cond: calm, text: 'The school bell stopped ringing! That means no school, right? ...Right?', textIf: [['bell_fixed', 'The bell works again. Ugh. School.']] },
      flowergirl: { at: [32, 29], sprite: 'girl', move: 'wander', cond: calm, text: 'The flowers down here survived the flood! Rushkin like to hide in the reeds by the river. Grandma says they\'re easy to catch.' },
      sitterkit: { at: [34, 8], sprite: 'kit:12', move: 'wander', cond: calm, text: 'A Kitefinch from the Kit-sitters\' house. It chirps at you and hops in a circle.' },
      // flour sacks (Flour in the Reeds)
      sack1: { at: [9, 28], sprite: 'item', cond: function () { return PK.quest.at('flour', 'find') && !g().flag('sack1'); }, talk: 'bh_sack1' },
      sack2: { at: [13, 17], sprite: 'item', cond: function () { return PK.quest.at('flour', 'find') && !g().flag('sack2'); }, talk: 'bh_sack2' },
      sack3: { at: [6, 34], sprite: 'item', cond: function () { return PK.quest.at('flour', 'find') && !g().flag('sack3'); }, talk: 'bh_sack3' }
    },
    eventsAt: [
      { at: [27, 2], run: 'bh_north' }, { at: [28, 2], run: 'bh_north' },
      { at: [10, 13], run: 'bh_floodscene', cond: function () { return storm() && !g().flag('starter'); } },
      { at: [9, 13], run: 'bh_floodscene', cond: function () { return storm() && !g().flag('starter'); } }
    ],
    edges: { n: { to: 'willow_trail', off: 0 } },
    enc: { reeds: [[10, 2, 4, 100]], water: [[22, 3, 6, 100]] }
  });

  // ================= Home =================
  room('bh_home1f', 'Home', 'home', 14, [
    '.............X', '..............', '..............', '..............', '..............', '..............', '......M.......'
  ], {
    music: 'hometown', entry: [6, 8],
    warps: [['bh_home2f', 13, 3, 'down']],
    props: [
      ['window', 1, 1, { color: '#e8b040' }], ['counter', 0, 2, { w: 2 }], ['stove', 2, 2], ['sink', 3, 2], ['fridge', 4, 2],
      ['painting', 5, 1, { art: 'family', text: 'A family portrait: Mom, Dad, {RIVAL}, and you as a baby. Dad is wearing a strange gold pin.' }],
      ['lockeddoor', 6, 1, { talk: 'bh_study' }], ['window', 7, 1, { color: '#e8b040' }],
      ['fireplace', 8, 2], ['clock', 10, 1], ['tv', 11, 2, { talk: 'bh_tv' }], ['shelfjars', 12, 2],
      ['dining', 1, 4], ['rug', 8, 4, { w: 4, h: 2, color: '#b8484e' }], ['couch', 9, 6, { color: '#5a78b8' }],
      ['plant', 0, 7], ['plant', 13, 7, { variant: 'flowers' }]
    ],
    npcs: { mom: { at: [5, 5], sprite: 'mom', dir: 'left', talk: 'bh_mom' } }
  });
  room('bh_home2f', 'Upstairs', 'bedroom', 14, [
    '......W......X', '......W.......', '......W.......', '......W.......', '..............', '..............'
  ], {
    music: 'hometown', homeBed: true,
    warps: [['bh_home1f', 13, 3, 'down']],
    onEnter: 'bh_bedroom',
    props: [
      ['bed', 0, 2, { color: '#3a9a8a', text: 'Your bed.' }], ['window', 1, 1], ['desk', 2, 2, { text: 'Your desk. A half-finished drawing of the mill wheel.' }], ['pc', 4, 2],
      ['painting', 5, 1, { art: 'hills' }], ['rug', 1, 5, { w: 3, h: 2, color: '#4a7ab0', variant: 'round' }], ['wardrobe', 0, 6, { text: 'Your clothes. You could change your look... maybe later.' }],
      ['bed', 7, 2, { color: '#8a3a3a', variant: 'messy', text: '{RIVAL}\'s bed. The blankets are a mess, and it hasn\'t been slept in.' }],
      ['painting', 8, 1, { art: 'map', text: 'A map of the valley pinned to the wall. The old weir is circled in red, twice.' }],
      ['table', 9, 2, { w: 2, icon: 'map', talk: 'bh_sibdesk' }], ['bookcase', 11, 2, { text: '{RIVAL}\'s books: "Kit Tracking for Experts", "The Old Families of the Willow", and a diary with the lock picked open... and then glued shut again.' }],
      ['chest', 12, 6, { talk: 'bh_sibchest' }]
    ]
  });

  // ================= The mill (ground, loft, basement) =================
  room('bh_mill', 'The Mill', 'mill', 16, [
    'X..............X', '................', '................', '................', '................', '&..............&', '.....M..........'
  ], {
    entry: [5, 8],
    warps: [['bh_millbase', 0, 3, 'down'], ['bh_mill2', 15, 3, 'down']],
    props: [
      ['window', 3, 1], ['gearwall', 6, 0], ['millstone', 6, 3], ['chute', 8, 2], ['window', 12, 1],
      ['sacks', 1, 6], ['sacks', 2, 6], ['sacks', 13, 6], ['crate', 14, 6, { icon: 'wheat' }], ['rope', 12, 3]
    ],
    npcs: { miller: { at: [10, 5], sprite: 'miller', dir: 'left', text: 'MILLER: The wheel took a beating last night, but she still turns. Your Grandma ran this mill for thirty years, you know. Her old office is up in the loft.', textIf: [['after_done', 'MILLER: Heading out? Say hello to the Willow for us. That river raised half this village.']] } }
  });
  room('bh_mill2', 'Mill Loft', 'mill', 16, [
    '...............X', '................', '................', '................', '................'
  ], {
    warps: [['bh_mill', 15, 3, 'down']],
    props: [
      ['desk', 0, 2, { icon: 'ledger', talk: 'bh_ledger' }], ['photos', 2, 1], ['bookcase', 4, 2, { text: 'Old almanacs: rainfall, river heights, grain prices. Forty years of Grandma\'s notes.' }],
      ['chest', 6, 2, { text: 'Grandma\'s old tool chest. Oiled, sharpened and perfectly organized.' }], ['window', 10, 1], ['window', 13, 1],
      ['sacks', 9, 3], ['sacks', 11, 3], ['sacks', 13, 5], ['sacks', 10, 6], ['sacks', 14, 6], ['rug', 1, 4, { w: 3, h: 2, color: '#8a6a2a' }]
    ],
    itemsAt: [['capsule', 2, 15, 6]],
    npcs: { napper: { at: [12, 4], sprite: 'kit:18', cond: function () { return !g().flag('napper'); }, talk: 'bh_napper' } }
  });
  room('bh_millbase', 'Mill Basement', 'cellar', 14, [
    'X.............', '..............', '~~~~~~||~~~~~~', '~~~~~~||~~~~~~', '..............', '..............'
  ], {
    warps: [['bh_mill', 0, 3, 'down']],
    props: [['pipes', 2, 1], ['gearwall', 9, 0], ['lever', 12, 2, { variant: 'down', text: 'The mill\'s own little sluice. It feeds river water onto the wheel. Grandma\'s label says: DO NOT TOUCH (this means you, {RIVAL}).' }], ['crate', 0, 7], ['rope', 13, 7]],
    itemsAt: [['riverberry', 3, 12, 6]],
    hiddenAt: [['remedy', 1, 3, 7]],
    tileText: { '~': 'The Willow rushes right under the mill. It\'s loud down here.' }
  });

  // ================= Grandma's cottage =================
  room('bh_grandma', "Grandma's Cottage", 'cottage', 14, [
    '..............', '..............', '..............', '..............', '..............', '......M.......'
  ], {
    music: 'hometown', entry: [6, 7], wall1: 'W%WWWWWWWW%WWW',
    warpsAt: [[1, 1, 'bh_grandma_k', 4, 5, 'up'], [10, 1, 'bh_grandma_g', 1, 5, 'up']],
    props: [
      ['herbs', 3, 1], ['kettle', 5, 2, { talk: 'bh_tea' }], ['counter', 6, 2, { w: 2, text: 'Grandma\'s counter. Herbs, mortar and pestle, and a tin of biscuits.' }], ['shelfjars', 8, 2],
      ['window', 12, 1, { color: '#6aaa58' }], ['table', 2, 4, { w: 2, icon: 'tea' }], ['rug', 5, 4, { w: 3, h: 2, color: '#6a8a4a' }],
      ['basket', 11, 5], ['plant', 0, 6], ['plant', 13, 6, { variant: 'flowers' }]
    ],
    npcs: {
      grandma: { at: [7, 4], sprite: 'grandma', dir: 'left', cond: calm, talk: 'bh_grandma' },
      oldkit: { at: [11, 5], sprite: 'kit:11', noTurn: true, talk: 'bh_oldkit' }
    }
  });
  room('bh_grandma_k', 'Keepsake Room', 'cottage', 9, [
    '.........', '.........', '.........', '....M....'
  ], {
    exit: { map: 'bh_grandma', x: 1, y: 2 }, entry: [4, 5],
    props: [
      ['bookcase', 0, 2, { text: 'Grandpa\'s old field guides. Every page is full of his notes and doodles.' }], ['photos', 2, 1],
      ['trophycase', 4, 2, { text: 'Grandpa\'s Keeper trophies. The biggest one is engraved: "Willow Valley Open - Champion".' }],
      ['painting', 6, 1, { art: 'kit', icon: 11, text: 'A painting of Grandma\'s Bulrusher, back when it was young and very proud of its reed hat.' }],
      ['chest', 7, 3, { talk: 'bh_keepchest' }], ['rug', 3, 4, { w: 3, h: 1, color: '#8a2e36' }]
    ]
  });
  room('bh_grandma_g', 'Greenhouse', 'green', 10, [
    '..........', '..........', '..........', '.M........'
  ], {
    exit: { map: 'bh_grandma', x: 10, y: 2 }, entry: [1, 5],
    props: [['planter', 0, 2, { w: 4 }], ['planter', 5, 2, { w: 5, variant: 'b' }], ['planter', 3, 4, { w: 4, variant: 'c' }], ['plant', 9, 4, { variant: 'flowers' }]],
    npcs: { gpuff: { at: [8, 5], sprite: 'kit:18', move: 'wander', text: 'A Puffhop lives in Grandma\'s greenhouse. It sneezes, and three new seedlings sprout.' } },
    itemsAt: [['riverberry', 2, 0, 5]]
  });

  // ================= River lab =================
  room('bh_lab', 'River Lab', 'lab', 18, [
    'X.................', '..................', '..................', '..................', '..................', '..................', '..................', '........M.........'
  ], {
    music: 'lab', entry: [8, 9], wall1: 'WWWWWWWWWWWWWWW%WW',
    warps: [['bh_lab2', 14, 3, 'down']],
    warpsAt: [[15, 1, 'bh_labgreen', 6, 6, 'up']],
    props: [
      ['tank', 2, 2], ['tank', 4, 2, { color: '#3a8ab0' }], ['tank', 6, 2], ['tank', 8, 2, { color: '#5aa0a0' }],
      ['computer', 11, 2], ['board', 13, 1], ['bookcase', 16, 2, { text: 'Research journals: "River Kits of the Willow", "Why Do Kits Migrate?", "Flood Behavior in Aquatic Kits (unfinished)".' }],
      ['tank', 2, 6, { color: '#3a8ab0' }], ['tank', 5, 6], ['microscope', 10, 5], ['table', 11, 5, { w: 2, icon: 'books' }],
      ['desk', 14, 6, { text: 'Prof. Vale\'s desk. A note on top: "Three young Kits, far from home. WHY? Check the hills."' }], ['plant', 0, 8], ['plant', 17, 8]
    ],
    npcs: {
      prof: { at: [8, 5], sprite: 'prof', dir: 'down', cond: calm, talk: 'bh_prof' },
      aide: { at: [4, 5], sprite: 'scholar', dir: 'right', cond: calm, text: 'AIDE: The tanks hold Kits from the Willow while we study them. Upstairs is the library and the observatory, and the greenhouse is through the back door.' }
    }
  });
  room('bh_lab2', 'Lab Library', 'lab', 16, [
    '..............X.', '................', '................', '................', '................'
  ], {
    music: 'lab',
    warps: [['bh_lab', 0, 3, 'down']],
    props: [
      ['bookcase', 0, 2], ['bookcase', 2, 2, { variant: 'b' }], ['bookcase', 4, 2, { variant: 'c' }], ['bookcase', 6, 2, { variant: 'd', text: 'A whole shelf on the Ashen Accord. Most of the books have pages cut out.' }], ['bookcase', 8, 2, { variant: 'e' }],
      ['window', 11, 1, { variant: 'night' }], ['telescope', 12, 3, { talk: 'bh_labscope' }], ['globe', 13, 5], ['table', 2, 5, { w: 3, icon: 'books' }], ['rug', 5, 5, { w: 4, h: 2, color: '#2e5a8a' }]
    ]
  });
  room('bh_labgreen', 'Lab Greenhouse', 'green', 12, [
    '............', '............', '............', '............', '......M.....'
  ], {
    exit: { map: 'bh_lab', x: 15, y: 2 }, entry: [6, 6], music: 'lab',
    props: [['planter', 0, 2, { w: 5 }], ['planter', 7, 2, { w: 5, variant: 'b' }], ['planter', 1, 4, { w: 4, variant: 'c' }], ['planter', 7, 4, { w: 4, variant: 'd' }], ['tank', 10, 5, { color: '#3a9a8a' }]],
    npcs: { lgkit: { at: [6, 3], sprite: 'kit:15', noTurn: true, text: 'A Caddle is dozing in the moss, snug in its pebble case. A label on the pot says: "DO NOT WATER THE CADDLE".' } }
  });

  // ================= Bakery (shop, kitchen, upstairs, cellar) =================
  room('bh_bakery', "Hobb's Bakery", 'bakery', 14, [
    'X............X', '..............', '...cccccc.....', '..............', '......M.......'
  ], {
    music: 'shop', entry: [6, 6], wall1: 'WWWWWWWWWWW%WW',
    warps: [['bh_bakery_cel', 0, 3, 'down'], ['bh_bakery_up', 10, 3, 'down']],
    warpsAt: [[11, 1, 'bh_bakery_k', 5, 5, 'up']],
    props: [['breadrack', 1, 2], ['breadrack', 2, 2], ['window', 4, 1], ['painting', 6, 1, { art: 'hills' }], ['window', 8, 1], ['cakecase', 9, 2], ['plant', 0, 5], ['table', 10, 5, { w: 2, icon: 'bread' }]],
    npcs: {
      hobb: { at: [5, 3], sprite: 'baker', dir: 'down', cond: qdone('flour'), talk: 'shop', stock: ['capsule', 'tonic', 'remedy', 'honeybun', 'kittreat'] },
      hobbsad: { at: [5, 3], sprite: 'baker', dir: 'down', cond: function () { return !PK.quest.done('flour'); }, text: 'BAKER HOBB: No flour, no bread. No bread, no bakery. The sacks must be out in the reeds somewhere.' },
      customer: { at: [9, 5], sprite: 'oldwoman', dir: 'up', text: 'I come here every morning for a Honey Bun. My Kits like them even more than I do!' }
    }
  });
  room('bh_bakery_k', 'Bakery Kitchen', 'bakery', 12, [
    '............', '............', '............', '.....M......'
  ], {
    exit: { map: 'bh_bakery', x: 11, y: 2 }, entry: [5, 5],
    props: [['oven', 1, 2], ['oven', 4, 2], ['shelfjars', 7, 2], ['sacks', 10, 2], ['sacks', 11, 2], ['mixtable', 7, 4]],
    npcs: { apprentice: { at: [3, 4], sprite: 'girl', dir: 'right', talk: 'bh_apprentice' } }
  });
  room('bh_bakery_up', "Hobb's Home", 'home', 12, [
    '..........X.', '............', '............', '............'
  ], {
    warps: [['bh_bakery', 13, 3, 'down']],
    props: [['bed', 0, 2, { color: '#e0807a' }], ['window', 2, 1], ['bookcase', 3, 2], ['couch', 6, 4, { color: '#b86a3a' }], ['toybox', 9, 2], ['rug', 5, 3, { w: 4, h: 1, color: '#d8884a' }], ['plant', 11, 5]],
    npcs: { cardkid: { at: [3, 5], sprite: 'kid', dir: 'right', talk: 'bh_cardkid' } }
  });
  room('bh_bakery_cel', 'Bakery Cellar', 'cellar', 12, [
    'X...........', '..~~........', '..~~....~...', '&&....&&....'
  ], {
    warps: [['bh_bakery', 0, 3, 'down']],
    props: [['sacks', 10, 2, { text: 'The flour sacks the flood didn\'t get. Soggy, but saved.' }], ['crate', 11, 2], ['crate', 5, 2]],
    npcs: { barrelkit: { at: [9, 5], sprite: 'kit:10', cond: function () { return !g().flag('barrelkit'); }, talk: 'bh_barrelkit' } },
    tileText: { '~': 'A puddle of flood water. It smells like wet bread.' }
  });

  // ================= School (classroom, training room, bell tower) =================
  room('bh_school', 'Brookhollow School', 'school', 16, [
    'X...............', '................', '................', '................', '................', '................', '......M.........'
  ], {
    entry: [6, 8], wall1: 'WWWWWWWWWWWWWW%W',
    warps: [['bh_school_bell', 0, 3, 'down']],
    warpsAt: [[14, 1, 'bh_school_gym', 5, 6, 'up']],
    props: [
      ['window', 2, 1], ['window', 3, 1], ['board', 5, 1, { w: 3, variant: 'chalk', text: 'The chalkboard: "TYPES! Leaf beats Tide, Tide beats Blaze, Blaze beats Leaf. Check the foe\'s type under its HP bar!"' }],
      ['desk', 9, 2, { text: 'Ms. Pell\'s desk. A stack of homework titled "My Favorite Kit". Seven of them are about Rushkin.' }], ['bookcase', 12, 2, { talk: 'bh_lore' }], ['globe', 15, 4],
      ['schooldesk', 3, 5], ['schooldesk', 5, 5], ['schooldesk', 7, 5], ['schooldesk', 9, 5], ['schooldesk', 3, 7], ['schooldesk', 9, 7], ['plant', 15, 8]
    ],
    npcs: { pell: { at: [8, 3], sprite: 'teacher', dir: 'down', talk: 'bh_pell' }, pupil: { at: [6, 7], sprite: 'kid2', dir: 'up', text: 'I\'m reading about the Ashen Accord in the library corner. Did you know they used to plant forests? Now they burn them. Weird.' } }
  });
  room('bh_school_gym', 'Training Room', 'school', 12, [
    '............', '............', '............', '............', '.....M......'
  ], {
    exit: { map: 'bh_school', x: 14, y: 2 }, entry: [5, 6],
    props: [['dummy', 1, 2], ['dummy', 10, 2], ['mat', 3, 3, { w: 6, h: 2 }], ['window', 4, 1], ['window', 7, 1]],
    npcs: {
      pip: { at: [3, 3], sprite: 'kid', dir: 'right', keeper: 'school_1', sight: 0, cond: flag('bell_fixed'), text: 'Pip is waiting for the bell to be fixed before battling.' },
      juniper: { at: [8, 3], sprite: 'kid2', dir: 'left', keeper: 'school_2', sight: 0, cond: flag('bell_fixed') },
      waiter: { at: [5, 5], sprite: 'kid', dir: 'up', cond: function () { return !g().flag('bell_fixed'); }, text: 'No practice battles until the bell works again. Ms. Pell\'s rules!' }
    }
  });
  room('bh_school_bell', 'Bell Loft', 'tower', 8, [
    'X.......', '........', '........'
  ], {
    warps: [['bh_school', 0, 3, 'down']],
    props: [['bell', 3, 2, { talk: 'bh_bell' }], ['window', 6, 1], ['window', 1, 1]]
  });

  // ================= Watchtower (3 floors) =================
  room('bh_tower', 'Watchtower', 'tower', 8, [
    '.......X', '........', '&......<', '...M....'
  ], {
    entry: [3, 5],
    warps: [['bh_tower2', 7, 3, 'down']],
    props: [['crate', 0, 2], ['sacks', 1, 2], ['rope', 5, 3], ['window', 3, 1]]
  });
  room('bh_tower2', 'Watchtower - Map Room', 'tower', 8, [
    'X......X', '........', '........'
  ], {
    warps: [['bh_tower3', 0, 3, 'down'], ['bh_tower', 7, 3, 'down']],
    props: [
      ['painting', 2, 1, { art: 'map', text: 'An old map of the valley. Someone has marked the weir, the dam and a cave in the hills with little ember symbols.' }],
      ['painting', 4, 1, { art: 'map', text: 'A map of the coast far to the south. It\'s labeled in Grandpa\'s handwriting.' }],
      ['table', 2, 3, { w: 3, icon: 'map', text: 'Charts of river heights going back fifty years. The last line is circled: "Storm season - watch the dam."' }]
    ]
  });
  room('bh_tower3', 'Watchtower Lookout', 'tower', 9, [
    'X........', '.........', '.........'
  ], {
    wall1: 'WYWYWYWYW',
    warps: [['bh_tower2', 0, 3, 'down']],
    props: [['telescope', 8, 3, { talk: 'bh_scope' }], ['sacks', 8, 2], ['cushion', 4, 4, { color: '#c8a060' }]],
    npcs: {
      roost: { at: [5, 2], sprite: 'kit:12', move: 'wander', talk: 'bh_roost' },
      stone1: { at: [2, 2], sprite: 'loosestone', noTurn: true, talk: 'bh_stone1' },
      stone2: { at: [6, 2], sprite: 'loosestone', noTurn: true, talk: 'bh_stone2' },
      stone3: { at: [3, 4], sprite: 'loosestone', noTurn: true, talk: 'bh_stone3' }
    }
  });

  // ================= Boathouse, floodgate house =================
  room('bh_boathouse', 'Boathouse', 'boat', 14, [
    '..............', '....~~~~~.....', '....~~~~~.....', '....~~~~~.....', '..............', '...M..........'
  ], {
    entry: [3, 7],
    props: [['rodrack', 1, 1], ['boat', 4, 3], ['window', 7, 1], ['workbench', 0, 5], ['rope', 11, 5], ['crate', 13, 6, { icon: 'fish' }], ['crate', 12, 6]],
    npcs: { boatman: { at: [11, 4], sprite: 'sailor', dir: 'down', talk: 'bh_boatman' } },
    tileText: { '~': 'Water from the pond flows in under the boathouse doors.' }
  });
  room('bh_flood', 'Floodgate House', 'works', 12, [
    '............', '............', '~~~~||~~~~~~', '~~~~||~~~~~~', '............', '...M........'
  ], {
    entry: [3, 7], wall1: 'WWWWWWWWWW%W',
    warpsAt: [[10, 1, 'bh_flood_q', 3, 4, 'up']],
    props: [['gearwall', 1, 0], ['pipes', 4, 1], ['gearwall', 7, 0], ['lever', 8, 2, { text: 'The floodgate lever. It\'s locked in the CLOSED position now, with a brand new padlock.' }]],
    npcs: {
      gatekeeper: { at: [2, 6], sprite: 'worker', dir: 'right', cond: calm, talk: 'bh_gatekeeper' },
      gearclue: { at: [3, 2], sprite: 'crowbar', noTurn: true, cond: function () { return PK.quest.at('after', 'gate'); }, talk: 'bh_gearclue' }
    },
    tileText: { '~': 'The channel under the floodgate. The water is calm now.' }
  });
  room('bh_flood_q', "Keeper's Quarters", 'cottage', 8, [
    '........', '........', '...M....'
  ], {
    exit: { map: 'bh_flood', x: 10, y: 2 }, entry: [3, 4],
    props: [['bunk', 0, 2], ['desk', 3, 2, { icon: 'ledger', talk: 'bh_logbook' }], ['chest', 6, 2], ['window', 5, 1]]
  });

  // ================= Kit-sitters and fortune teller =================
  room('bh_sitter', "Kit-Sitters' House", 'sitter', 14, [
    '..............', '..............', '..............', '..............', '..............', '......M.......'
  ], {
    entry: [6, 7],
    props: [
      ['window', 1, 1], ['counter', 0, 2, { w: 2 }], ['fridge', 2, 2], ['painting', 4, 1, { art: 'kit', icon: 10 }], ['bookcase', 5, 2, { text: '"Caring for Your Kit", "Kit Nutrition", "My Kit Ate My Homework: A Memoir".' }],
      ['playpen', 8, 2], ['toybox', 12, 2], ['cushion', 1, 5, { color: '#e8a040' }], ['cushion', 3, 5, { color: '#4a8ae0' }], ['couch', 10, 6, { color: '#6aaa58' }], ['rug', 3, 6, { w: 3, h: 1, color: '#6aaa70' }]
    ],
    npcs: {
      sitter: { at: [5, 4], sprite: 'villager1', dir: 'down', text: 'We look after the village\'s Kits when their Keepers are busy. After the flood, we\'re looking after almost everyone\'s!' },
      tradekid: { at: [12, 4], sprite: 'kid2', dir: 'left', talk: 'bh_tradekid' },
      pk1: { at: [9, 3], sprite: 'kit:10', move: 'wander', text: 'A Rushkin is chewing on a squeaky toy. It squeaks back at you.' },
      pk2: { at: [2, 4], sprite: 'kit:18', noTurn: true, text: 'A Puffhop is asleep on a cushion, twitching its nose.' },
      pk3: { at: [7, 6], sprite: 'kit:20', move: 'wander', text: 'An Acornet is guarding a single biscuit with its life.' }
    }
  });
  room('bh_teller', "Madame Oriel's", 'teller', 10, [
    '..........', '..........', '..........', '....M.....'
  ], {
    entry: [4, 5],
    props: [['beads', 1, 1], ['beads', 8, 1], ['candles', 0, 2], ['candles', 9, 2], ['rug', 2, 3, { w: 6, h: 2, color: '#8a1e3a' }], ['crystalball', 4, 3, { talk: 'bh_teller' }]],
    npcs: { oriel: { at: [4, 2], sprite: 'mystic', dir: 'down', talk: 'bh_teller' } }
  });

  // ================= Scripts =================
  S.bh_bedroom = async function (w) {
    if (storm() && !w.flag('woke')) {
      w.setFlag('woke');
      await w.wait(30);
      PK.fx.flash(10, '#e8eeff');
      if (PK.audio) PK.audio.sfx('buzz');
      await w.say('CRASH! Thunder shakes the whole house.');
      await w.say('...DONG... DONG... DONG...');
      await w.say('That\'s the flood bell! It only rings when the river breaks its banks!');
      await w.say('{RIVAL}\'s bed is empty.');
      PK.quest.start('flood');
      return;
    }
    if (w.flag('flood_over') && !w.flag('morning')) {
      w.setFlag('morning');
      await w.wait(20);
      await w.say('Sunlight pours through the window. The storm is over.');
      await w.say('Your new partner is curled up at the foot of the bed, snoring softly.');
      await w.say('{RIVAL}\'s bed still hasn\'t been slept in.');
      PK.quest.start('after');
    }
  };
  S.bh_mom = async function (w) {
    if (storm()) {
      await w.say('MOM: {PLAYER}, you\'re up! The flood bell... Grandma went down to the mill to close the sluice, all by herself!');
      await w.say('MOM: And {RIVAL} ran out the door before I could stop them. Please, go find Grandma. The mill is across the north bridge!');
      return;
    }
    if (!w.flag('mom_morning')) {
      w.setFlag('mom_morning');
      await w.say('MOM: There you are. What a night... Grandma told me everything. Diving for a Kit in a flood, {PLAYER}!');
      await w.say('MOM: I should be furious. But she said you were very brave.');
      await w.say('MOM: {RIVAL} came back just before dawn, packed a bag and left again. Not a word to anyone.');
      await w.say('MOM: Prof. Vale came by. She wants to see you and your new friend at the river lab, across the north bridge.');
      return;
    }
    var st = g().state;
    if (st.momSnack !== today()) {
      st.momSnack = today();
      await w.say('MOM: Here, I packed you a snack. Don\'t share it all with your Kit. ...Okay, share some.');
      await w.give('honeybun');
    }
    await w.say('MOM: Let me look after your team for a moment.');
    await w.heal();
    await w.say('MOM: All better. Be careful out there, and come home if you get hurt.');
  };
  S.bh_tv = async function (w) {
    var q = PK.quest;
    if (storm()) return w.say('The TV just shows static. The storm must have knocked out the signal.');
    if (!q.past('after', 'lab')) return w.say('NEWS: "...heavy flooding in Brookhollow last night. The floodgate failed for the first time in forty years. Villagers are asked to stay away from the riverbanks..."');
    if (!q.past('after', 'gate')) return w.say('NEWS: "...Brookhollow\'s market remains closed while cleanup continues. In other news, strange lights were reported near the old weir north of town..."');
    if (!q.done('after')) return w.say('NEWS: "...a group calling itself the Ashen Accord has been seen in the hills. Travelers are advised to... *crackle*"');
    return w.say('NEWS: "...a rockslide has closed the road between Willow Trail and Pinecrest. Crews expect it to be cleared soon."');
  };
  S.bh_study = async function (w) {
    await w.say('Dad\'s study. It\'s locked, like always.');
    await w.say('A brass plaque on the door: "DO NOT DISTURB - WORKING". Dad hasn\'t been home in months.');
    await w.say('Through the keyhole you can just make out a glass case... with something glinting inside. A badge?');
  };
  S.bh_sibdesk = async function (w) {
    await w.say('{RIVAL}\'s desk. A notebook is lying open:');
    await w.say('"Grey coats seen at the dam: Tuesday, Thursday. Always after dark. They know about Grandpa. I KNOW they do."');
    await w.say('"If I can get close enough... if they trust me..." The rest of the page is scribbled out.');
  };
  S.bh_sibchest = async function (w) {
    await w.say('A small locked box. Scratched into the lid: "FOR GRANDPA - WHEN I FIND HIM".');
  };
  S.bh_ledger = async function (w) {
    await w.say('The Mill Ledger. Forty years of flour, grain and river heights in Grandma\'s neat handwriting.');
    await w.say('On one page, in different, messier handwriting: "Gone up to the weir to talk sense into them. Back by supper. - G"');
    await w.say('The date is from the day Grandpa disappeared.');
  };
  S.bh_napper = async function (w, n) {
    await w.say('A Puffhop is fast asleep in a pile of spilled flour, covered head to toe in white.');
    await w.say('...It sneezes. A cloud of flour and dandelion seeds explodes everywhere!');
    w.setFlag('napper');
    n.hidden = true;
    await w.wildBattle(18, 6);
  };
  S.bh_tea = async function (w) {
    var st = g().state;
    if (st.teaDay === today()) return w.say('The kettle is still warm. Grandma says one pot of her tea a day is plenty for anyone.');
    if (!(await w.yesno('Grandma\'s kettle is whistling. Pour a cup of herb tea for your team?'))) return;
    st.teaDay = today();
    await w.heal();
    st.party.forEach(function (k) { k.status = null; });
    await w.say('The minty tea soothes every ache and cures every ailment. Your team looks refreshed!');
    await w.give('minttea');
  };
  S.bh_oldkit = async function (w) {
    await w.say('Grandma\'s old Bulrusher, Sir Reginald. His reed hood has gone grey with age.');
    await w.say('He opens one eye, looks at your Kit, and gives a small, approving grunt. Then he goes back to sleep.');
  };
  S.bh_keepchest = async function (w) {
    if (!PK.quest.past('after', 'tower')) return w.say('Grandpa\'s old chest, locked tight. Grandma keeps the key on a string around her neck.');
    await w.say('Grandpa\'s chest. Grandma has left it unlocked for you.');
    if (w.flag('keepchest')) return w.say('Inside: old maps, a broken capsule, and a photo of Grandpa with a Kit you\'ve never seen.');
    w.setFlag('keepchest');
    await w.say('Inside, wrapped in cloth, is Grandpa\'s old Keeper gear.');
    await w.give('luckyclover');
    await w.say('A Lucky Clover. A Kit holding it earns extra EXP. Grandpa never battled without one.');
  };
  S.bh_labscope = async function (w) {
    await PK.showView('hills');
    await w.say('Through the telescope: the hills north of the valley, where the Willow begins. A thin column of grey smoke is rising from somewhere up there.');
  };
  S.bh_scope = async function (w) {
    var i = await PK.ui.menu(['THE DAM', 'THE HILLS', 'THE NORTH ROAD'], { x: 8, y: 8, title: 'Look toward...' });
    if (i < 0) return;
    await PK.showView(['dam', 'hills', 'road'][i]);
    await w.say(['The dam and the floodgate house. The water behind the dam is still high and brown.', 'The hills where the river begins. There\'s smoke rising from a hollow up there.', 'The road north winds past the weir toward Pinecrest. You can see a big pile of rocks blocking it.'][i]);
  };
  S.bh_roost = async function (w) {
    await w.say('A tame Kitefinch lives up here in the rafters. It hops onto your shoulder and pecks your hair.');
    await w.say('It keeps looking at the three loose-looking stones in the floor, then back at you. Is it trying to tell you something?');
  };
  function stone(i) {
    return async function (w, n) {
      if (!PK.quest.at('after', 'tower')) return w.say('A slightly loose floor stone. You wiggle it, but there\'s nothing special underneath.');
      if (i !== 2) { await w.say('You pry up the loose stone... Just dust and an old spider web.'); n.hidden = true; return; }
      w.music('mystery');
      await w.say('You pry up the loose stone. Underneath, wrapped in oilcloth... a battered old journal!');
      n.hidden = true;
      await w.give('journal');
      await w.say('"Day 12. The Accord met again at the weir above Willow Trail. They say the valley\'s Kits must be \'guided\'. I don\'t like the way they say it."');
      await w.say('"Day 30. I\'ve made my choice. I\'m leaving them. If they come looking, I\'ll be where the river begins."');
      await w.say('The rest of the pages have been torn out.');
      await w.say('A folded map is tucked in the back cover. It shows the whole valley, and beyond it, all of Lumora.');
      await w.give('townmap');
      PK.quest.advance('after', 'north');
      await w.say('The weir above Willow Trail... that\'s where the river comes down from the hills. The same way {RIVAL} went.');
      w.playMapMusic();
    };
  }
  S.bh_stone1 = stone(1); S.bh_stone2 = stone(2); S.bh_stone3 = stone(3);
  S.bh_bell = async function (w) {
    if (!w.flag('bell_fixed')) return w.say('The school bell hangs silent. Its clapper is missing.');
    if (PK.audio) PK.audio.jingle('crest');
    await w.say('DONG! The bell rings out over the whole village. Somewhere below, a pupil groans.');
  };
  S.bh_lore = async function (w) {
    var i = await PK.ui.menu(['LUMORA', 'KITS', 'THE ASHEN ACCORD', 'CLOSE'], { x: 8, y: 8, title: 'Read about...' });
    if (i === 0) await w.say('"Lumora is a land of green valleys, sunny coasts and frozen peaks. People and Kits have lived side by side here for as long as there are stories."');
    if (i === 1) await w.say('"Kits grow stronger by battling and evolve when they are ready. Some need a special shard, some a certain time of day. A happy Kit fights harder for its Keeper."');
    if (i === 2) await w.say('"The Accord began as a circle of Keepers who protected wild places. Over time, its leaders came to believe the valley must be \'purified\' by fire. Many members left. Some were never seen again."');
  };
  S.bh_apprentice = async function (w) {
    var st = g().state;
    if (!PK.quest.done('flour')) return w.say('APPRENTICE: No flour, no baking! Mr. Hobb is out looking for the sacks.');
    if (st.bakeDay === today()) return w.say('APPRENTICE: One batch a day, that\'s the rule. Come back tomorrow and we\'ll bake something else!');
    if (!(await w.yesno('APPRENTICE: Want to help me bake? You knead, I\'ll watch the oven!'))) return;
    st.bakeDay = today();
    await w.say('You knead the dough... shape it... and slide it into the roaring oven...');
    if (PK.audio) PK.audio.sfx('statup');
    await w.wait(40);
    var prize = ['honeybun', 'embercookie', 'kittreat'][today() % 3];
    await w.say('APPRENTICE: Perfect! Here, you earned it.');
    await w.give(prize, 2);
  };
  S.bh_cardkid = async function (w) {
    var n = Object.keys(g().state.caught).length;
    await w.say('HOBB\'S KID: I collect Kit cards! I have ' + (12 + n) + ' of them. How many Kits have YOU caught?');
    await w.say('HOBB\'S KID: ' + n + '? ' + (n >= 5 ? 'Whoa, that\'s a lot! You\'re a real Keeper!' : 'That\'s okay. Catch more and come show me!'));
    if (n >= 5 && !w.flag('cardkid')) { w.setFlag('cardkid'); await w.say('HOBB\'S KID: Here, take my spare. It\'s shiny!'); await w.give('fancytreat'); }
  };
  S.bh_barrelkit = async function (w, n) {
    await w.say('Something is rustling inside a barrel... A Rushkin pops out, holding a whole loaf of bread!');
    w.setFlag('barrelkit');
    n.hidden = true;
    await w.wildBattle(10, 6);
  };
  S.bh_logbook = async function (w) {
    await w.say('The floodgate keeper\'s logbook. The last entry before the storm:');
    await w.say('"11 PM. Two visitors in grey coats. Said the Council sent them to inspect the gate before the storm. Let them in. They were very polite."');
    await w.say('Below it, scrawled in angry capital letters: "THERE IS NO COUNCIL INSPECTION. STUPID, STUPID, STUPID."');
  };
  S.bh_tradekid = async function (w) {
    if (w.flag('tradekid')) return w.say('KID: Thanks again for the berries! The Kits here love them.');
    if (g().count('riverberry') < 3) return w.say('KID: The Kits here are hungry after the flood. If you bring me 3 River Berries, I\'ll give you something really good!');
    if (!(await w.yesno('KID: You have River Berries! Trade me 3 of them?'))) return;
    g().removeItem('riverberry', 3);
    w.setFlag('tradekid');
    await w.say('KID: Yay! Here, my mom said this helps Kits grow up big and strong.');
    await w.give('boostcandy');
  };
  S.bh_teller = async function (w) {
    var st = g().state;
    if (!w.flag('met_oriel')) {
      w.setFlag('met_oriel');
      await w.say('MADAME ORIEL: Ah, the child of the flood. I saw you coming three days ago. Well, I saw a small person in a hat. Close enough.');
    }
    if (st.fortuneDay === today()) return w.say('MADAME ORIEL: One fortune a day, dear. The crystal needs its rest.');
    st.fortuneDay = today();
    await w.say('MADAME ORIEL: Let us see what the crystal shows today...');
    var hints = [
      'The crystal shows... a snail made of stone, glittering in the dark. Look for low water and a hidden cave on Willow Trail.',
      'The crystal shows... glowing yellow eyes in the trees. Some Kits only come out after the sun goes down.',
      'The crystal shows... a kite in the sky. Festival colors. Train your Kitefinch well, and one day it will fly higher than any of them.',
      'The crystal shows... a little one with no home, climbing into the hills alone. It is waiting to be found.',
      'The crystal shows... bread. Lots of bread. Hmm. Perhaps visit the bakery today.'
    ];
    await w.say(hints[today() % hints.length]);
  };
  S.bh_boatman = async function (w) {
    if (!g().count('oldrod')) {
      await w.say('BOATMAN: Welcome to the boathouse! We fix boats, and we sell the best fishing rods on the Willow.');
      if (await w.yesno('BOATMAN: A Reed Rod is $300. Face any water and use it from your BAG to fish for Kits. Buy one?')) {
        if (g().state.money < 300) return w.say('BOATMAN: Ah, you\'re a little short. Come back when you have $300.');
        g().state.money -= 300;
        await w.give('oldrod');
        await w.say('BOATMAN: Register it to SELECT in your BAG and you can cast with one button!');
      }
      return;
    }
    await w.say('BOATMAN: How\'s the rod treating you? The Skimble in the pond love a quick cast.');
    await PK.menus.shop(['riverberry', 'kittreat']);
  };

  S.bh_north = async function (w) {
    if (storm()) {
      await w.say('The wind howls down the north road. The mill is the other way, across the north bridge!');
      return w.movePlayer('d');
    }
    if (!PK.quest.past('after', 'tower')) {
      var t = w.npc('tomas'); if (t) w.face(t, 'left');
      await w.say('TOMAS: Whoa there! The trail north is a mess after the storm.');
      await w.say('TOMAS: Folks here could use a hand first. Once things settle down, I\'ll let you through.');
      return w.movePlayer('d');
    }
    if (!w.flag('tomas_ok')) {
      w.setFlag('tomas_ok');
      await w.say('TOMAS: Heading north, eh? Willow Trail follows the river up past the old weir. Mind the tall grass.');
    }
  };
  S.bh_tomas = async function (w) {
    if (PK.quest.past('after', 'tower')) return w.say('TOMAS: The trail north follows the river. If you see any strangers in grey coats up there, you keep your distance, hear?');
    return w.say('TOMAS: I keep watch on the north road. After last night, nobody leaves until the village is back on its feet.');
  };

  // The flood: choose which Kit to pull from the water
  S.bh_floodscene = async function (w) {
    var gm = w.npc('grandma_storm');
    w.music('storm');
    w.playerFace('left');
    await w.say('GRANDMA: {PLAYER}! Thank goodness! The floodgate is jammed wide open, the whole reservoir is pouring down the valley!');
    w.playerFace('up');
    await w.wait(20);
    ['flood1', 'flood4', 'flood7'].forEach(function (id) { var n = w.npc(id); if (n) n.emote = '!'; });
    if (PK.audio) PK.audio.sfx('splash');
    await w.wait(40);
    ['flood1', 'flood4', 'flood7'].forEach(function (id) { var n = w.npc(id); if (n) n.emote = null; });
    await w.say('GRANDMA: Look, in the water! Three little Kits, swept down from the hills! They\'re caught in the current by the wheel!');
    await w.say('GRANDMA: These old knees can\'t manage the bank. You can reach one from the bridge, {PLAYER}. Quick! Which one?!');
    var ids = [1, 4, 7], pick = null;
    while (pick == null) {
      var i = await PK.ui.menu(ids.map(function (id) { return PK.KITS[id].name + '  (' + PK.KITS[id].types.join('/') + ')'; }), { x: 8, y: 30, cancel: false, title: 'Reach for which Kit?' });
      var pv = PK.ui.showKit(ids[i]);
      if (PK.audio) PK.audio.cry(ids[i]);
      var desc = { 1: 'A soft little moss blob, clinging to a branch.', 4: 'A tiny dragon, still half inside its eggshell. Its head flame is sputtering in the rain!', 7: 'A little squid in a conch-shell hat, spinning in the current.' }[ids[i]];
      var yes = await w.yesno(desc + ' Reach for ' + PK.KITS[ids[i]].name + '?');
      PK.pop(pv);
      if (yes) pick = ids[i];
    }
    var chosen = w.npc('flood' + pick);
    await w.say('You threw yourself flat on the bridge and stretched out over the water...');
    if (PK.audio) PK.audio.sfx('splash');
    PK.fx.shake(10, 2);
    if (chosen) chosen.hidden = true;
    w.setFlag('starter', pick);
    var kit = await w.giveKit(pick, 5, { noPrism: true });
    await w.say('...and caught ' + PK.KITS[pick].name + ' just in time!');
    if (await w.yesno('Give a nickname to ' + PK.KITS[pick].name + '?')) {
      var nn = await PK.ui.name(PK.KITS[pick].name + "'s nickname?", PK.KITS[pick].name);
      if (nn && nn !== PK.KITS[pick].name) kit.nick = nn;
    }
    var others = ids.filter(function (id) { return id !== pick; }).map(function (id) { return w.npc('flood' + id); });
    await w.say('The other two slipped under the bridge and were carried off downstream!');
    await Promise.all(others.map(function (n) { return n ? w.moveNpc(n, n.d.swept) : null; }));
    others.forEach(function (n) { if (n) n.hidden = true; });
    var sib = w.npc('sibling_storm');
    if (sib) {
      sib.hidden = false;
      w.playerFace('right');
      await w.emote(sib, '!');
      await w.say('A figure dashes along the far bank, chasing the current...');
      await w.moveNpc(sib, 'dddddd');
      sib.hidden = true;
    }
    if (gm) w.facePlayer(gm);
    w.playerFace('left');
    await w.say('GRANDMA: Was that... {RIVAL}? Running after those little ones, in this?');
    await w.say('GRANDMA: That child... Come on, {PLAYER}. Let\'s get you and your new friend out of the rain.');
    await PK.fx.fadeOut(40);
    g().setFlag('storm', false);
    g().setTime('morning');
    w.setFlag('flood_over');
    PK.quest.complete('flood');
    PK.game.healParty();
    await w.wait(60);
    w.load('bh_home2f', 1, 4, 'down');
    await PK.fx.fadeIn(40);
    await w.script('bh_bedroom');
  };

  S.bh_prof = async function (w) {
    if (PK.quest.at('after', 'lab')) {
      var k = g().state.party[0], sp = PK.KITS[k.id];
      await w.say('PROF. VALE: {PLAYER}! Come in, come in. So this is the Kit you pulled out of the flood. May I?');
      await w.say('PROF. VALE: A ' + sp.name + '... I\'ve only ever read about them. They live high in the hills, far upstream. How did three of them end up in our river?');
      await w.say('PROF. VALE: Something up there scared them badly. Kits don\'t leave their homes for nothing.');
      await w.say('PROF. VALE: It has chosen you, you know. Kits remember who saves them. Here, you\'ll want this.');
      await w.give('kitlog');
      await w.say('PROF. VALE: A KitLog records every Kit you meet. Yours already has its first entry.');
      await w.give('tonic', 3);
      await w.say('PROF. VALE: Now, the village needs every pair of hands today. Hobb the baker, Ms. Pell at the school, your Grandma... go and see who needs help.');
      await w.say('PROF. VALE: And {PLAYER}? If you see {RIVAL}... tell them I\'d like a word.');
      PK.quest.advance('after', 'help');
      return;
    }
    if (PK.quest.at('after', 'help')) return w.say('PROF. VALE: The baker, the teacher and your Grandma. Each of them could use your help. Check your QUESTS list in the menu if you forget.');
    if (PK.quest.past('after', 'tower')) return w.say('PROF. VALE: The Ashen Accord... I hoped I\'d never hear that name again. Be careful up north, {PLAYER}. And find your sibling.');
    return w.say('PROF. VALE: The river Kits are calmer today. So am I, a little. Feel free to look around, the library upstairs is open to everyone.');
  };

  S.bh_baker = async function (w) {
    var q = PK.quest;
    if (!q.has('flour')) {
      if (!q.past('after', 'lab')) return w.say('BAKER HOBB: Not now, little one. I\'m counting what the river left me. It isn\'t much.');
      await w.say('BAKER HOBB: Oh, {PLAYER}. My storeroom flooded and the current took three sacks of flour clean out the door.');
      await w.say('BAKER HOBB: Without flour, no bread. Without bread, no market. They\'re probably stuck somewhere along the river. Would you look for them?');
      q.start('flour');
      return;
    }
    if (q.at('flour', 'find')) {
      var n = ['sack1', 'sack2', 'sack3'].filter(function (f) { return w.flag(f); }).length;
      return w.say('BAKER HOBB: Found ' + n + ' of 3 so far? Try the reeds and the edge of the pond. Flour sacks float for a surprisingly long time.');
    }
    if (q.at('flour', 'return')) {
      await w.say('BAKER HOBB: All three! Soggy on the outside, but the flour inside is dry. Bless you!');
      g().removeItem('floursack', 1);
      q.complete('flour');
      await w.say('BAKER HOBB: The market opens again today! Fruit, fish, bread and Kit treats at the stalls, and I sell capsules inside. Here, the first ones are on me.');
      await w.give('capsule', 5);
      await checkRecovery(w);
    }
  };
  function sack(i) {
    return async function (w, n) {
      w.setFlag('sack' + i);
      n.hidden = true;
      var got = ['sack1', 'sack2', 'sack3'].filter(function (f) { return w.flag(f); }).length;
      if (got === 1) await w.give('floursack');
      else { if (PK.audio) PK.audio.jingle('item'); await w.say(g().state.player.name + ' found another Flour Sack!'); }
      await w.say('Flour sacks found: ' + got + ' / 3');
      if (got >= 3) PK.quest.advance('flour', 'return');
    };
  }
  S.bh_sack1 = sack(1); S.bh_sack2 = sack(2); S.bh_sack3 = sack(3);

  S.bh_pell = async function (w) {
    var q = PK.quest;
    if (!q.has('bell')) {
      if (!q.past('after', 'lab')) return w.say('MS. PELL: No school today, I\'m afraid. We\'re drying out the books.');
      await w.say('MS. PELL: {PLAYER}! Did you hear our bell this morning? No? That\'s because the storm tore the clapper right out of it.');
      await w.say('MS. PELL: The children say they saw it roll into the pond. Old Fenwick fishes off the dock every day. Maybe he could hook it out?');
      q.start('bell');
      return;
    }
    if (q.at('bell', 'return')) {
      await w.say('MS. PELL: You found it! Let me put it back right away.');
      g().removeItem('clapper', 1);
      if (PK.audio) PK.audio.jingle('crest');
      await w.say('DING! DING! DING! The school bell rings out across the village.');
      w.setFlag('bell_fixed');
      q.complete('bell');
      await w.say('MS. PELL: Thank you, {PLAYER}. Here\'s a little something from the school supply cupboard.');
      await w.give('hushspray', 2);
      await w.say('MS. PELL: Pip and Juniper have been begging for a practice battle. They\'re in the training room through the back door.');
      await w.say('MS. PELL: Remember your types. Leaf beats Tide, Tide beats Blaze, Blaze beats Leaf. The foe\'s types show under its HP bar in battle.');
      await checkRecovery(w);
      return;
    }
    if (q.done('bell')) return w.say('MS. PELL: Every Keeper starts somewhere. For a lot of us, it was right here in this room. The library corner is open if you want to read.');
    return w.say('MS. PELL: Old Fenwick is usually on the dock by the boathouse, south of the market.');
  };
  S.bh_fisher = async function (w) {
    var q = PK.quest;
    if (q.at('bell', 'ask')) {
      await w.say('OLD FENWICK: The school bell\'s clapper? Aye, I saw it go plop, right off the end of this dock.');
      await w.say('OLD FENWICK: I could hook it out for you, but the flood washed away all my bait. Bring me a River Berry and we\'ll see what bites.');
      await w.say('OLD FENWICK: Berry trees grow by Grandma\'s cottage, over on the west bank.');
      q.advance('bell', 'berry');
      return;
    }
    if (q.at('bell', 'berry')) {
      if (!g().count('riverberry')) return w.say('OLD FENWICK: No berry, no bait. The berry trees are by your Grandma\'s cottage, across the north bridge.');
      g().removeItem('riverberry', 1);
      await w.say('OLD FENWICK: That\'ll do nicely. Now, hush...');
      if (PK.audio) PK.audio.sfx('splash');
      await w.wait(60);
      await w.say('...');
      await w.wait(40);
      await w.say('OLD FENWICK: Got it! Heavier than a Skimble, that\'s for sure.');
      await w.give('clapper');
      q.advance('bell', 'return');
      return;
    }
    return w.say('OLD FENWICK: The Willow gives and the Willow takes. Last night it took a lot. If you want to fish, the boatman sells rods.');
  };

  S.bh_grandma = async function (w) {
    var q = PK.quest, st = g().state;
    if (q.at('after', 'lab')) return w.say('GRANDMA: Go and see Prof. Vale first, dear. She was up all night worrying about those little Kits.');
    if (q.at('after', 'grandma')) {
      w.music('tender');
      await w.say('GRANDMA: What\'s that you\'ve got? Let me see...');
      await w.say('GRANDMA: ...A grey scrap with an ember stitched on it. Oh, no. No, no.');
      await w.say('GRANDMA: The Ashen Accord. I haven\'t seen that mark in forty years.');
      await w.say('GRANDMA: Your Grandpa... helped start that group, back when it was a good idea. People who wanted to protect the wild places.');
      await w.say('GRANDMA: Then it changed. They started talking about "purifying" the valley. Burning out the old ways. Your Grandpa walked away, and he never talked about it again.');
      await w.say('GRANDMA: And then one day, he just... didn\'t come home.');
      await w.say('GRANDMA: He kept a journal. He used to climb the old watchtower to write in peace. If there\'s anything left of it, it\'ll be hidden up at the top.');
      await w.say('GRANDMA: And... the keepsake room is unlocked now. His old things are in the chest. He\'d want you to have them.');
      q.advance('after', 'tower');
      w.playMapMusic();
      return;
    }
    if (!q.has('lesson')) {
      await w.say('GRANDMA: There\'s my brave grandchild. How\'s your little friend? Eating well?');
      await w.say('GRANDMA: Now, a real Keeper doesn\'t just pull Kits out of rivers. Let me teach you to catch one properly.');
      await w.say('GRANDMA: Weaken a wild Kit in battle first, but don\'t knock it out. Then pick BAG and use a Capsule. The weaker it is, the better your chances.');
      await w.give('capsule', 5);
      await w.say('GRANDMA: Rushkin love the reeds along the river. Walk through the reeds and one will pop out. Go on, show me what you can do!');
      q.start('lesson');
      return;
    }
    if (q.at('lesson', 'catch')) {
      var caught = st.party.concat(st.box).filter(function (k) { return k.id !== st.flags.starter; });
      if (!caught.length) return w.say('GRANDMA: Walk through the reeds by the river. Weaken the Kit, then use a Capsule from your BAG!');
      q.advance('lesson', 'show');
    }
    if (q.at('lesson', 'show')) {
      var mine = st.party.concat(st.box).filter(function (k) { return k.id !== st.flags.starter; })[0];
      await w.say('GRANDMA: Oh, look at you! A ' + PK.KITS[mine.id].name + ', and not a scratch on it. Your Grandpa would have been proud.');
      await w.give('riverberry', 3);
      await w.give('hushspray');
      q.complete('lesson');
      await checkRecovery(w);
      return;
    }
    if (q.past('after', 'tower')) return w.say('GRANDMA: Whatever you find out there, {PLAYER}... you come home and tell me. Promise me that.');
    await w.say('GRANDMA: The kettle\'s on if you need it, dear. My herb tea fixes anything.');
  };

  S.bh_gatekeeper = async function (w) {
    if (PK.quest.at('after', 'gate')) return w.say('GATEKEEPER: The gears were jammed with something. Go on, take a look at the machinery by the channel.');
    if (PK.quest.past('after', 'gate')) return w.say('GATEKEEPER: A crowbar, jammed right into the gears. That wasn\'t the storm. Someone wanted this valley flooded. Read my logbook if you don\'t believe me.');
    return w.say('GATEKEEPER: I got the floodgate shut this morning, finally. Strangest thing. It was like the gears had been locked in place.');
  };
  S.bh_gearclue = async function (w, n) {
    await w.say('There\'s an iron crowbar wedged deep between the gears. Someone forced it in on purpose.');
    await w.say('A scrap of grey cloth is snagged on the crowbar...');
    await w.give('ashscrap');
    n.hidden = true;
    PK.quest.advance('after', 'grandma');
    await w.say('Grandma knows everyone who has ever lived in Brookhollow. Maybe she\'ll recognize this.');
  };
})();
