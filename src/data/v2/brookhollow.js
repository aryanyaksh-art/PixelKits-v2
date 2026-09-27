// Brookhollow: riverside mill village. The game opens here on the night of the flood.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, IN = PK.interior, S = PK.SCRIPTS, Q = PK.QUESTS;
  function g() { return PK.game; }
  function flag(f) { return function () { return g().flag(f); }; }
  function storm() { return g().flag('storm'); }
  function calm() { return !g().flag('storm'); }
  function qat(id, step) { return function () { return !!PK.quest && PK.quest.at(id, step); }; }
  function qdone(id) { return function () { return !!PK.quest && PK.quest.done(id); }; }

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
    steps: [{ id: 'ask', text: 'Ask Old Fenwick at the dock for help' }, { id: 'berry', text: 'Bring Old Fenwick a River Berry for bait' }, { id: 'return', text: 'Return the clapper to Ms. Pell at the school' }], reward: 'Practice battles and a gift' };
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
    music: function () { return storm() ? 'cave' : 'hometown'; },
    rows: [
      'TTTTTTWW~~~WWTTTTTTTTTTTTTT::TTTTTTTTTTT',
      'TTTTTTWW~~~WWTTTTTTTTTTTTTT::TTTTTTTTTTT',
      'TTTT..WW~~~WW.....T.T...TT.::W........TT',
      'TTT..___JJJ___.....T.......::W.......,TT',
      'TT...W..JJJ................::W........TT',
      'TT......~~~....:::::.......::W./......TT',
      'TT......~~~A.......:.......::W........TT',
      'TT......~~~A.......:.......::W........TT',
      'TT......~~~A.......:+.:.FF.::W.L......TT',
      'TT......~~~A.......:..:...,::W,.....,.TT',
      'TT......~~~A.......:,,:....::WWWWW^WWWTT',
      'TT.,....~~~..T.:...:..:...S::.....:...TT',
      'TT,,.:::~~~::::::::::::::::::::::::::.TT',
      'TT....::===:....Lggggggg.....gL.......TT',
      'TT....:..~~~~...g..$..gg...,.gg.......TT',
      'TT....:...~~~~..g..&..gg.....gg.......TT',
      'TT....:....~~~..SggggggggggggggT...:..TT',
      'TT..:::PPP-~~~AAggggggUgggggggg..,,...TT',
      'TT.<..:PPP-~~~AAggggggggggg//gg....TT.TT',
      'TTE...:----~~~.,ggggggggggggggg.......TT',
      'TT.E.,:.,..~~~.........:...:GGGGGGGGG.TT',
      'TTE...:::::===.........:...:..........TT',
      'TT,...:...A~~~..,,.....:,,.:..........TT',
      'TT.......AA~~~.........:...:..........TT',
      'TT.......AA~~~T........:..S:..........TT',
      'TT.......AA~~~.T.......:...:::::......TT',
      'TT.....S.AA~~~.........:..,....,....,.TT',
      'TT..:::.~~~~~~~~(~.....:...,<...,T.E.,TT',
      'TT.....A~(~~~~~~~~.....:....,....,...TTT',
      'TT.,,..A~~~(~NNNNN::::::..T..,....,.T.TT',
      'TTT..,AA~~~~~~~(~~.......,....T....,TTTT',
      'TTTT....~~(~~~~~~~........,....,....,.TT',
      'TTTTTTTTTTTT~~TTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TTTTTTTTTTTT~~TTTTTTTTTTTTTTTTTTTTTTTTTT'
    ],
    buildings: [
      { k: 'home', at: [21, 4], to: 'bh_home1f' },
      { k: 'mill', at: [4, 6], to: 'bh_mill' },
      { k: 'cottage', at: [2, 14], to: 'bh_grandma' },
      { k: 'rivlab', at: [2, 23], to: 'bh_lab' },
      { k: 'floodhouse', at: [14, 2], to: 'bh_flood' },
      { k: 'home', at: [14, 7], to: 'bh_house', roof: '#b84a3a' },
      { k: 'tower', at: [33, 2], to: 'bh_tower' },
      { k: 'bakery', at: [24, 13], to: 'bh_bakery' },
      { k: 'stall', at: [17, 14], goods: 'fruit', roof: '#e8b030' },
      { k: 'stall', at: [20, 14], goods: 'fish', roof: '#4a90d8' },
      { k: 'cottage', at: [33, 13], to: 'bh_cottage2', roof: '#c89a48' },
      { k: 'school', at: [29, 21], to: 'bh_school' },
      { k: 'boathouse', at: [18, 26], to: 'bh_boathouse' }
    ],
    signsAt: [
      [26, 11, 'BROOKHOLLOW - Where the Willow sings.'],
      [7, 26, "RIVER LAB - Prof. Vale's study of river Kits."],
      [16, 16, function () { return PK.quest.done('flour') ? 'MARKET NOTICE: Fresh bread today! Thank you to everyone who helped after the flood.' : 'MARKET NOTICE: Market closed until further notice. Flood cleanup in progress.'; }],
      [26, 24, 'BROOKHOLLOW SCHOOL - Every Keeper starts somewhere.']
    ],
    hiddenAt: [['tonic', 1, 34, 30]],
    npcs: {
      // the night of the flood
      grandma_storm: { at: [7, 12], sprite: 'grandma', dir: 'right', cond: storm, text: 'GRANDMA: {PLAYER}! Over here, by the bridge!' },
      flood1: { at: [10, 10], swept: 'dddddrrddd', sprite: 'kit:1', cond: function () { return storm() && !g().flag('starter'); }, text: 'A little Kit is clinging to a branch in the current!' },
      flood4: { at: [8, 12], swept: 'rrdddrrddd', sprite: 'kit:4', cond: function () { return storm() && !g().flag('starter'); }, text: 'A little Kit is bobbing in the flood water!' },
      flood7: { at: [10, 12], swept: 'dddrrddd', sprite: 'kit:7', cond: function () { return storm() && !g().flag('starter'); }, text: 'A little Kit is spinning in the current!' },
      sibling_storm: { at: [12, 6], sprite: 'rival', dir: 'down', startHidden: true, cond: storm },
      // everyday Brookhollow
      tomas: { at: [26, 3], sprite: 'tomas', dir: 'right', cond: calm, talk: 'bh_tomas' },
      baker: { at: [26, 17], sprite: 'baker', move: 'look', cond: function () { return calm() && !PK.quest.done('flour'); }, talk: 'bh_baker' },
      fruitseller: { at: [17, 13], sprite: 'villager1', dir: 'down', cond: qdone('flour'), talk: 'shop', stock: ['riverberry', 'tonic', 'remedy'] },
      fishseller: { at: [20, 13], sprite: 'villager3', dir: 'down', cond: qdone('flour'), text: 'FISHMONGER: Nothing to sell yet. The river\'s still too muddy to fish. Give it a few days!' },
      fisher: { at: [13, 29], sprite: 'fisher', dir: 'left', cond: calm, talk: 'bh_fisher' },
      sweeper: { at: [21, 10], sprite: 'villager2', move: 'wander', cond: calm, text: 'Mud everywhere! The river came right up to the market. I\'ve never seen it that high.', textIf: [['after_done', 'The market smells like fresh bread again. You did good, kid.']] },
      oldman: { at: [30, 6], sprite: 'oldman', dir: 'down', cond: calm, text: 'I sit up here every morning. You can see the whole valley... and last night I saw lanterns moving up by the dam. Nobody goes up there at night.' },
      fencefix: { at: [8, 20], sprite: 'villager3', dir: 'up', cond: calm, text: "Grandma's herb garden fence got knocked flat. I'm patching it before the Rushkin get in!" },
      kid: { at: [25, 23], sprite: 'kid2', move: 'wander', cond: calm, text: 'The school bell stopped ringing! That means no school, right? ...Right?', textIf: [['bell_fixed', 'The bell works again. Ugh. School.']] },
      flowergirl: { at: [30, 28], sprite: 'girl', move: 'wander', cond: calm, text: 'The flowers down here survived the flood! Rushkin like to hide in the reeds by the river. Grandma says they\'re easy to catch.' },
      // flour sacks (Flour in the Reeds)
      sack1: { at: [10, 22], sprite: 'item', cond: function () { return PK.quest.at('flour', 'find') && !g().flag('sack1'); }, talk: 'bh_sack1' },
      sack2: { at: [15, 18], sprite: 'item', cond: function () { return PK.quest.at('flour', 'find') && !g().flag('sack2'); }, talk: 'bh_sack2' },
      sack3: { at: [7, 30], sprite: 'item', cond: function () { return PK.quest.at('flour', 'find') && !g().flag('sack3'); }, talk: 'bh_sack3' }
    },
    eventsAt: [
      { at: [27, 2], run: 'bh_north' }, { at: [28, 2], run: 'bh_north' },
      { at: [13, 21], run: 'bh_southbridge', cond: storm },
      { at: [10, 13], run: 'bh_floodscene', cond: function () { return storm() && !g().flag('starter'); } }
    ],
    edges: { n: { to: 'willow_trail', off: 0 } },
    enc: { reeds: [[10, 2, 4, 100]] }
  });

  // ================= Home =================
  D('bh_home1f', {
    name: 'Home', interior: true, theme: 'house', music: 'hometown',
    rows: ['WWYWWWZWWW', 'KK.p..,,.X', '..........', '..tt......', '..tt......', 'p........p', '..........', '....M.....'],
    entry: [4, 7],
    warps: [['bh_home2f', 8, 2, 'down']],
    npcs: { mom: { at: [7, 4], sprite: 'mom', dir: 'left', talk: 'bh_mom' } }
  });
  D('bh_home2f', {
    name: 'Bedroom', interior: true, theme: 'house', music: 'hometown', homeBed: true,
    rows: ['WWYWWWWZWW', 'BK..C...BX', '..........', '..,,,,....', '..,,,,..t.', 'p........p'],
    warps: [['bh_home1f', 8, 2, 'down']],
    onEnter: 'bh_bedroom',
    shelfText: 'Adventure books and a dog-eared guide called "Your First Kit". A note on the cover says: Property of {RIVAL}. HANDS OFF.'
  });

  // ================= Other interiors =================
  D('bh_mill', {
    name: 'The Mill', interior: true, theme: 'house',
    rows: ['WWYWWWWWYWWW', 'K$$..&&..<<X', '............', '.RR.........', '.RR.........', '............', '$..........&', '.....M......'],
    entry: [5, 7],
    warps: [['bh_mill2', 10, 2, 'down']],
    npcs: { miller: { at: [7, 4], sprite: 'miller', dir: 'left', text: 'MILLER: The wheel took a beating last night, but she still turns. Your Grandma ran this mill for thirty years, you know. She knows every creak.', textIf: [['after_done', 'MILLER: Heading out? Say hello to the Willow for us. That river raised half this village.']] } },
    tileText: { R: 'Two huge millstones. Grain goes in the top, flour comes out the side.' }
  });
  D('bh_mill2', {
    name: 'Mill Loft', interior: true, theme: 'house',
    rows: ['WWWYWWWWYWWW', '$$$.......X.', '$$.........$', '..........$$', '$...........'],
    warps: [['bh_mill', 10, 2, 'down']],
    itemsAt: [['capsule', 2, 1, 4]]
  });
  D('bh_grandma', {
    name: "Grandma's Cottage", interior: true, theme: 'house', music: 'hometown',
    rows: ['WYWWWZWWW', 'KK.p.PP..', '.........', '..tt.....', '..tt.....', 'p.......p', '....M....'],
    entry: [4, 6],
    npcs: { grandma: { at: [6, 3], sprite: 'grandma', dir: 'left', cond: calm, talk: 'bh_grandma' } },
    shelfText: 'Jars of dried herbs, each labeled in careful handwriting. One jar just says "for emergencies (and cake)".'
  });
  D('bh_lab', {
    name: 'River Lab', interior: true, theme: 'lab', music: 'hometown',
    rows: ['WWYWWWWWWYWWW', 'WKK~~~C~~~KKW', 'W...........W', 'W...........W', 'W.tt.....tt.W', 'W...........W', 'Wp.........pW', 'W...........W', 'WWWWWWMWWWWWW'],
    entry: [6, 8],
    npcs: {
      prof: { at: [6, 3], sprite: 'prof', dir: 'down', cond: calm, talk: 'bh_prof' },
      aide: { at: [3, 6], sprite: 'scholar', dir: 'right', cond: calm, text: 'AIDE: The tanks hold Kits from the Willow while we study them. After a flood, they wash up in all sorts of odd places!' }
    },
    shelfText: 'Research notes: "River Kits follow the current downstream in spring. Some travel all the way to the sea."',
    tileText: { '~': 'A tank of clear river water. Little shapes dart between the stones.' }
  });
  D('bh_flood', {
    name: 'Floodgate House', interior: true, theme: 'house',
    rows: ['WWYWWWWW', 'K..HH..K', '........', '..&.....', '........', '...M....'],
    entry: [3, 5],
    npcs: {
      gatekeeper: { at: [6, 3], sprite: 'worker', dir: 'left', cond: calm, talk: 'bh_gatekeeper' },
      gearclue: { at: [4, 2], sprite: 'none', cond: function () { return PK.quest.at('after', 'gate'); }, talk: 'bh_gearclue' }
    },
    tileText: { H: 'The floodgate machinery. Big iron gears, still dripping.' }
  });
  IN('bh_house', 'house', { name: 'Neighbor\'s House', people: [
    { x: 5, y: 3, sprite: 'oldwoman', dir: 'down', text: 'The water came right up to our door. Our Kits hid under the bed all night, poor things.' },
    { x: 2, y: 4, sprite: 'boy', move: 'wander', text: 'I saw {RIVAL} running along the river in the middle of the storm. Is that normal for your family?' }
  ] });
  D('bh_tower', {
    name: 'Watchtower', interior: true, theme: 'house',
    rows: ['WWWYWWW', '$..X..$', '.......', '&.....<', '.......', '...M...'],
    entry: [3, 5],
    warps: [['bh_tower2', 3, 2, 'down']]
  });
  D('bh_tower2', {
    name: 'Watchtower Lookout', interior: true, theme: 'house',
    rows: ['YWYWYWYWY', '...X....$', '.........', 'Q.......Q', '........$'],
    warps: [['bh_tower', 3, 2, 'down']],
    npcs: { journal: { at: [7, 2], sprite: 'item', cond: function () { return PK.quest.at('after', 'tower'); }, talk: 'bh_journal' } },
    statue: 'An old brass telescope. Through it you can see the dam, and the dark road winding north.'
  });
  D('bh_bakery', {
    name: 'Hobb\'s Bakery', interior: true, theme: 'shop', music: 'shop',
    rows: ['WWYWWWWYWW', 'WHH.DD..KW', 'Wccc.....W', 'W........W', 'Wp..tt..pW', 'WWWWMWWWWW'],
    entry: [4, 5],
    npcs: {
      hobb: { at: [2, 3], sprite: 'baker', dir: 'up', cond: qdone('flour'), talk: 'shop', stock: ['capsule', 'tonic', 'remedy', 'riverberry', 'smokepellet'] },
      apprentice: { at: [6, 3], sprite: 'girl', move: 'wander', text: function () { return PK.quest.done('flour') ? 'The ovens are hot again! Mr. Hobb sells capsules too. Everyone in Brookhollow buys them here.' : 'Mr. Hobb is outside in the square. Without flour, we can\'t bake a thing!'; } }
    },
    tileText: { H: 'The bread ovens.', D: 'Shelves of bread tins and flour jars.' }
  });
  D('bh_school', {
    name: 'Brookhollow School', interior: true, theme: 'lab',
    rows: ['WWKKWWWWKKWW', 'W..........W', 'W.t.t..t.t.W', 'W..........W', 'W.t.t..t.t.W', 'W..........W', 'WWWWWMWWWWWW'],
    entry: [5, 6],
    npcs: {
      pell: { at: [5, 1], sprite: 'teacher', dir: 'down', talk: 'bh_pell' },
      pip: { at: [1, 3], sprite: 'kid', dir: 'right', keeper: 'school_1', sight: 0, cond: flag('bell_fixed') },
      juniper: { at: [10, 5], sprite: 'kid2', dir: 'left', keeper: 'school_2', sight: 0, cond: flag('bell_fixed') }
    },
    shelfText: 'Textbooks: "Types and You", "Kits of the Willow Valley", "So You Want to Be a Keeper".'
  });
  D('bh_boathouse', {
    name: 'Boathouse', interior: true, theme: 'house',
    rows: ['WWYWWWWWWW', '$..~~~~..&', '...~~~~...', '<..~~~~..$', '..........', '...M......'],
    entry: [3, 5],
    npcs: { boatman: { at: [8, 4], sprite: 'sailor', dir: 'left', text: 'BOATMAN: The Willow runs all the way from the mountains to the sea. One day, when the water calms down, I\'ll take you downriver.' } },
    tileText: { '~': 'A little rowboat bobs in the slip.' }
  });
  IN('bh_cottage2', 'hut', { name: 'Riverside Cottage', people: [
    { x: 3, y: 2, sprite: 'oldman', dir: 'down', text: 'Forty years I\'ve lived here, and the floodgate has never failed. Not once. Gates don\'t just jam themselves, you know.' }
  ] });

  // ================= Scripts =================
  // Wake up to the flood bell
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
      await w.say('MOM: And {RIVAL} ran out the door before I could stop them. Please, go find Grandma. Stay off the south bridge!');
      return;
    }
    if (!w.flag('mom_morning')) {
      w.setFlag('mom_morning');
      await w.say('MOM: There you are. What a night... Grandma told me everything. Diving for a Kit in a flood, {PLAYER}!');
      await w.say('MOM: I should be furious. But she said you were very brave.');
      await w.say('MOM: {RIVAL} came back just before dawn, packed a bag and left again. Not a word to anyone.');
      await w.say('MOM: Prof. Vale came by. She wants to see you and your new friend at the river lab. Go on, then.');
      return;
    }
    await w.say('MOM: Let me look after your team for a moment.');
    await w.heal();
    await w.say('MOM: All better. Be careful out there, and come home if you get hurt.');
  };

  S.bh_southbridge = async function (w) {
    await w.say('The south bridge is under water! There\'s no way across here.');
    await w.say('The north bridge by the mill is higher up...');
    await w.movePlayer('r');
  };
  S.bh_north = async function (w) {
    if (storm()) {
      await w.say('The wind howls down the north road. The mill is the other way, by the river!');
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
    w.playerFace('left');
    await w.say('GRANDMA: {PLAYER}! Thank goodness! The floodgate is jammed wide open, the whole reservoir is pouring down the valley!');
    w.playerFace('up');
    await w.wait(20);
    ['flood1', 'flood4', 'flood7'].forEach(function (id) { var n = w.npc(id); if (n) n.emote = '!'; });
    if (PK.audio) PK.audio.sfx('splash');
    await w.wait(40);
    ['flood1', 'flood4', 'flood7'].forEach(function (id) { var n = w.npc(id); if (n) n.emote = null; });
    await w.say('GRANDMA: Look, in the water! Three little Kits, swept down from the hills! They\'re heading straight for the wheel!');
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
    await w.say('...and caught ' + PK.KITS[pick].name + ' just before the wheel!');
    if (await w.yesno('Give a nickname to ' + PK.KITS[pick].name + '?')) {
      var nn = await PK.ui.name(PK.KITS[pick].name + "'s nickname?", PK.KITS[pick].name);
      if (nn && nn !== PK.KITS[pick].name) kit.nick = nn;
    }
    // the other two are carried off downstream
    var others = ids.filter(function (id) { return id !== pick; }).map(function (id) { return w.npc('flood' + id); });
    await w.say('The other two slipped past the wheel and were carried off downstream!');
    // follow the river under the bridge and around the bend
    await Promise.all(others.map(function (n) { return n ? w.moveNpc(n, n.d.swept) : null; }));
    others.forEach(function (n) { if (n) n.hidden = true; });
    // a figure on the far bank
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
    // morning
    await PK.fx.fadeOut(40);
    g().setFlag('storm', false);
    w.setFlag('flood_over');
    PK.quest.complete('flood');
    PK.game.healParty();
    await w.wait(60);
    w.load('bh_home2f', 1, 2, 'down');
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
    return w.say('PROF. VALE: The river Kits are calmer today. So am I, a little.');
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
      await w.say('BAKER HOBB: The market opens again today. I\'ll be selling capsules inside the bakery too, the good kind. Here, the first ones are on me.');
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
      await w.say('MS. PELL: And Pip and Juniper have been begging for a practice battle. Talk to them any time!');
      await w.say('MS. PELL: Remember your types. Leaf beats Tide, Tide beats Blaze, Blaze beats Leaf. The foe\'s types show under its HP bar in battle.');
      await checkRecovery(w);
      return;
    }
    if (q.done('bell')) return w.say('MS. PELL: Every Keeper starts somewhere. For a lot of us, it was right here in this room.');
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
      await w.say('OLD FENWICK: Got it! Heavier than a Finnip, that\'s for sure.');
      await w.give('clapper');
      q.advance('bell', 'return');
      return;
    }
    return w.say('OLD FENWICK: The Willow gives and the Willow takes. Last night it took a lot. But it gave you a friend, didn\'t it?');
  };

  S.bh_grandma = async function (w) {
    var q = PK.quest, st = g().state;
    if (q.at('after', 'lab')) return w.say('GRANDMA: Go and see Prof. Vale first, dear. She was up all night worrying about those little Kits.');
    if (q.at('after', 'grandma')) {
      await w.say('GRANDMA: What\'s that you\'ve got? Let me see...');
      await w.say('GRANDMA: ...A grey scrap with an ember stitched on it. Oh, no. No, no.');
      await w.say('GRANDMA: The Ashen Accord. I haven\'t seen that mark in forty years.');
      await w.say('GRANDMA: Your Grandpa... helped start that group, back when it was a good idea. People who wanted to protect the wild places.');
      await w.say('GRANDMA: Then it changed. They started talking about "purifying" the valley. Burning out the old ways. Your Grandpa walked away, and he never talked about it again.');
      await w.say('GRANDMA: And then one day, he just... didn\'t come home.');
      await w.say('GRANDMA: He kept a journal. He used to climb the old watchtower to write in peace. If there\'s anything left of it, it\'ll be up there.');
      q.advance('after', 'tower');
      return;
    }
    if (!q.has('lesson')) {
      await w.say('GRANDMA: There\'s my brave grandchild. How\'s your little friend? Eating well?');
      await w.say('GRANDMA: Now, a real Keeper doesn\'t just pull Kits out of rivers. Let me teach you to catch one properly.');
      await w.say('GRANDMA: Weaken a wild Kit in battle first, but don\'t knock it out. Then pick BAG and throw a Capsule. The weaker it is, the better your chances.');
      await w.give('capsule', 5);
      await w.say('GRANDMA: Rushkin love the reeds along the river. Walk through the reeds and one will pop out. Go on, show me what you can do!');
      q.start('lesson');
      return;
    }
    if (q.at('lesson', 'catch')) {
      var caught = st.party.concat(st.box).filter(function (k) { return k.id !== st.flags.starter; });
      if (!caught.length) return w.say('GRANDMA: Walk through the reeds by the river. Weaken the Kit, then throw a Capsule from your BAG!');
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
    await w.say('GRANDMA: Let me look at your team, dear.');
    await w.heal();
    await w.say('GRANDMA: There. Nothing a bit of Grandma\'s herb tea can\'t fix.');
  };

  S.bh_gatekeeper = async function (w) {
    if (PK.quest.at('after', 'gate')) return w.say('GATEKEEPER: The gears were jammed with something. Go on, take a look at the machinery by the back wall.');
    if (PK.quest.past('after', 'gate')) return w.say('GATEKEEPER: A crowbar, jammed right into the gears. That wasn\'t the storm. Someone wanted this valley flooded.');
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
  S.bh_journal = async function (w, n) {
    await w.say('Behind a loose board, wrapped in oilcloth... a battered old journal.');
    await w.give('journal');
    n.hidden = true;
    await w.say('"Day 12. The Accord met again at the weir above Willow Trail. They say the valley\'s Kits must be \'guided\'. I don\'t like the way they say it."');
    await w.say('"Day 30. I\'ve made my choice. I\'m leaving them. If they come looking, I\'ll be where the river begins."');
    await w.say('The rest of the pages have been torn out.');
    await w.say('A folded map is tucked in the back cover. It shows the whole valley, and beyond it, all of Lumora.');
    await w.give('townmap');
    PK.quest.advance('after', 'north');
    await w.say('The weir above Willow Trail... that\'s where the river comes down from the hills. The same way {RIVAL} went.');
  };
})();
