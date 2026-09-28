// Willow Trail: the river road north of Brookhollow. Reservoir shore, meadow, then forest and the old weir.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, IN = PK.interior, S = PK.SCRIPTS, Q = PK.QUESTS;
  function g() { return PK.game; }
  function flag(f) { return function () { return g().flag(f); }; }
  function notFlag(f) { return function () { return !g().flag(f); }; }
  var STONES = [[7, 31], [8, 31], [9, 31]];

  Q.trail = { title: 'Upriver', kind: 'main', desc: 'The river leads north toward the hills where the three flood Kits came from. {RIVAL} went this way too.',
    steps: [
      { id: 'weir', text: 'Head upriver to the old weir' },
      { id: 'tracks', text: 'Search the mud by the weir' },
      { id: 'sibling', text: 'Catch up with {RIVAL} on the north road' },
      { id: 'road', text: 'Wait for the road to Pinecrest to reopen' }
    ] };
  Q.lowwater = { title: 'Low Water', kind: 'side', desc: 'Angler Jory says the river has run too high since the storm. The weir upstream controls the flow.',
    steps: [{ id: 'lever', text: 'Pull the sluice lever in the weir hut' }, { id: 'back', text: 'Tell Angler Jory the water is down' }], reward: 'Plus Capsules and a secret' };

  D('willow_trail', {
    name: 'Willow Trail', theme: 'vale', music: 'willow', region: 'Verdant Vale',
    rows: [
      'TTTTTTT~~~TTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTT',
      'TTTTTTT~~~TTTTTTTTTTTTTTTTTTTrrrr..TTTTTTTTT',
      'TTTTTTT~~~TTTTTTTTTTTTTTTTTT.r::r.....TTTTTT',
      'TTTTTTT~~~TTTTTTTTT.TTTT.T..S.::..,.....TTTT',
      'TTTTTTT~~~TTTTTT..............::.........TTT',
      'TTTTTTT~~~....................::.........TTT',
      'TTTTTTT~~~.................::::.....".,...TT',
      'TTTTTTT~~~.....,..........::...,.,"""""..TTT',
      'TTTTTTT~~~....."".......:::......""""""".TTT',
      'TTTTTTT~~~..:.."""......::........""""".TTTT',
      'TTTT___JJJ___"""".......::....,.....".TTTTTT',
      'TTTTTTTJJJ...,".........::...........TTTTTTT',
      'TTTTTTT~~~.,..........,.::..,...,<..TTTTTTTT',
      'TTTTTTT~~~..............:::......,.TTTTTTTTT',
      'TTTTTTT~~~T...............::::....,TTTTTTTTT',
      'TTTTTTT~~~TTT...,,.........,.:::....TTTTTTTT',
      'TTTTTTT~~~TTETT..."....,......::.""".,.TTTTT',
      'TTTTTTT~~~TTTTTTTT"""..,.,....::"""""".TTTTT',
      'TTTT...~~~.....TTT""""........::""""""..TTTT',
      'TTTT,..~~~.....TT""""........,::"""""""..TTT',
      'TTTT..~~~~A....TT."...........::""""""..TTTT',
      'TTTT..~~~~,....TT.............::""""""...TTT',
      'T.....~~~~....,TT.........S.,.::."""....TTTT',
      'T.....~~~~.,..................::.,.....TTTTT',
      'TWWWW.~~~~A,...............::::,.....E.TTTTT',
      'TWWWW.~~~~................::,...,.....TTTTTT',
      'TWWWW.~~~~..............:::..........TTTTTTT',
      'TWWWW.~~~~A.."""........::...""......TTTTTTT',
      'TWWWW.~~~~.""""""".,..,.::.""""......TTTTTTT',
      'TWWOW.~~~~."""""""......::"""""......TTTTTTT',
      'T.....~~~~""""""""".....::,""""...:..TTTTTTT',
      'T......~~~.""""""",.....::..."""..:..TTTTTTT',
      'T......~~~,"""""""...,..::............,.TTTT',
      'T......~~~..."""..,..,..::...............TTT',
      'T......~~~...........,..::vvvvvvvvvvvv..TTTT',
      'TTTTA..~~~............:::.....,..........TTT',
      'TTTT.A.~~~,..........<:..........,....,..,.T',
      'TTTTTTT~~~TTvvvvv..:::.,.........""".,.....T',
      'TTTTTTT~~~TTTTTTTT::........,."""""""""....T',
      'TTTTTTT~~~TTTTTTTT::.........."""""""""....T',
      'TTTTTTT~~~TTTT....::....,.".."""""""""""...T',
      'TTTTTTT~~~TTTT....::...."""""."""""""""...TT',
      'TTTTTTT~~~~TTT...,::..,""""""""""""""""...TT',
      'TTTTTT~~~~~~~T....::...."""""...."""....TTTT',
      'TTTTT~~~~~~~~~....::......"....,.......TTTTT',
      'TTTT~~~~~~~~~~~A...::....,.........E..TTTTTT',
      'TTT~~~~~~~~~~~~.....:::..............TTTTTTT',
      'TTTT~~~~~~~~~~~~".....::.............,.TTTTT',
      'TTT~~~~~~~~~~~~~~""...::...............TTTTT',
      'TTT~~~~~~~~~~~~~"""...::........""".....TTTT',
      'TTT~~~~~~~~~~~NNN"""..::.....""""""""".,TTTT',
      'TT~~~~~~~~~~~~~~"""...::....."""""""""..T.TT',
      'TT~~~~~~~~~~~~~~""".,.::...."""""""""""..TTT',
      'TT~~~~~~~~~~~~~~~.....::....."""""""""....TT',
      'TTT~~~~~~~~~~~~~......::....."""""""""..T,TT',
      'TTTT~~~~~~~~~~~~A.....::........"""......TTT',
      'TTTT~~~~~~~~~~~........:::.............,TTTT',
      'TTTT~~~~~~~~~~~..........:::........,.TT.TTT',
      'TTTTT~~~~~~~~.......E......::..,......TTTTTT',
      'TTTTTTT~~~~~~T.............::.........TTTTTT',
      'TTTTTTTT~~~TT.TT...........::S......,TTTTTTT',
      'TTTTTTTT~~~TTTTT.T.........::.....TTTTTTTTTT',
      'TTTTTTWW~~~WWTTTTTT..TTTT..::.....TTTTTTTTTT',
      'TTTTTTWW~~~WWTTTTTTTTTTTTTT::TTTTTTTTTTTTTTT'
    ],
    buildings: [
      { k: 'floodhouse', at: [11, 6], to: 'wt_weir', roof: '#6a7080' },
      { k: 'cottage', at: [32, 27], to: 'wt_rest', roof: '#b8903e' },
      { k: 'cabin', at: [14, 40], to: 'wt_ranger' },
      { k: 'treehouse', at: [16, 2], to: 'wt_tree' }
    ],
    signsAt: [
      [29, 60, 'WILLOW TRAIL - North: Pinecrest   South: Brookhollow'],
      [26, 22, 'REST STOP ahead. Weary travelers welcome!'],
      [28, 3, function () { return g().flag('road_open') ? 'NORTH: Pinecrest. Road open. (Somebody blew up the rockslide.)' : 'NORTH: Pinecrest. ROAD CLOSED - rockslide. Crews at work.'; }]
    ],
    itemsAt: [['capsule', 2, 36, 41], ['tonic', 1, 13, 16], ['riverberry', 2, 38, 8]],
    hiddenAt: [['pluscapsule', 1, 2, 33], ['remedy', 1, 20, 3]],
    npcs: {
      ellis: { at: [20, 44], sprite: 'kid', dir: 'right', keeper: 'willow_1', sight: 4 },
      mae: { at: [36, 38], sprite: 'birder', dir: 'left', keeper: 'willow_2', sight: 4 },
      rolf: { at: [14, 50], sprite: 'fisher', dir: 'left', keeper: 'willow_3', sight: 0 },
      jory: { at: [18, 52], sprite: 'angler', dir: 'left', talk: 'wt_jory' },
      bram: { at: [34, 16], sprite: 'hiker2', dir: 'left', keeper: 'willow_4', sight: 4 },
      tamsin: { at: [14, 24], sprite: 'girl', dir: 'down', keeper: 'willow_5', sight: 4 },
      cinderA: { at: [11, 11], sprite: 'cinder', dir: 'left', cond: notFlag('cinders_fled') },
      cinderB: { at: [13, 11], sprite: 'cinder2', dir: 'left', cond: notFlag('cinders_fled') },
      tracks: { at: [11, 13], sprite: 'tracks', noTurn: true, cond: function () { return PK.quest.at('trail', 'tracks'); }, talk: 'wt_tracks' },
      sibling: { at: [33, 3], sprite: 'rival', dir: 'up', cond: function () { return PK.quest.has('trail') && !g().flag('sibling_met'); } },
      worker: { at: [34, 2], sprite: 'worker', dir: 'left', text: 'WORKER: Big rockslide after the storm! The road to Pinecrest is closed until we clear it. Could be a while.', textIf: [['road_open', 'WORKER: A week of digging, gone in one BOOM. And they had the nerve to say "you are welcome".']] },
      blastA: { at: [30, 2], sprite: 'cinder', dir: 'up', startHidden: true, cond: notFlag('road_open') },
      blastB: { at: [31, 3], sprite: 'cinder2', dir: 'up', startHidden: true, cond: notFlag('road_open') },
      picnic: { at: [22, 50], sprite: 'villager1', move: 'wander', text: 'I come up here to watch the Kitefinch. On windy days the whole sky is full of them!' }
    },
    eventsAt: [
      { at: [16, 9], run: 'wt_weir_scene', cond: notFlag('cinders_fled') }, { at: [16, 10], run: 'wt_weir_scene', cond: notFlag('cinders_fled') },
      { at: [16, 11], run: 'wt_weir_scene', cond: notFlag('cinders_fled') }, { at: [16, 12], run: 'wt_weir_scene', cond: notFlag('cinders_fled') },
      { at: [16, 13], run: 'wt_weir_scene', cond: notFlag('cinders_fled') }, { at: [16, 14], run: 'wt_weir_scene', cond: notFlag('cinders_fled') },
      { at: [30, 5], run: 'wt_sibling', cond: function () { return PK.quest.at('trail', 'sibling'); } },
      { at: [31, 5], run: 'wt_sibling', cond: function () { return PK.quest.at('trail', 'sibling'); } },
      { at: [30, 4], run: 'wt_blast', cond: function () { return PK.quest.at('trail', 'road') && !g().flag('road_open'); } },
      { at: [31, 4], run: 'wt_blast', cond: function () { return PK.quest.at('trail', 'road') && !g().flag('road_open'); } },
      { at: [30, 5], run: 'wt_blast', cond: function () { return PK.quest.at('trail', 'road') && !g().flag('road_open'); } },
      { at: [31, 5], run: 'wt_blast', cond: function () { return PK.quest.at('trail', 'road') && !g().flag('road_open'); } }
    ],
    warpsAt: [[3, 29, 'willow_hollow', 7, 11, 'up']],
    onEnter: 'wt_enter',
    edges: { s: { to: 'brookhollow', off: 0 }, n: { to: 'pinecrest', off: 0 } },
    enc: {
      grass: [[12, 3, 6, 30], [10, 3, 5, 18], [18, 4, 6, 14], [15, 3, 5, 12], [20, 4, 7, 10], [24, 4, 7, 12, 'night'], [13, 7, 8, 4]],
      reeds: [[10, 3, 6, 50], [15, 3, 5, 50]],
      water: [[22, 4, 8, 80], [23, 10, 12, 5], [15, 4, 6, 15]]
    }
  });

  D('willow_hollow', {
    name: 'Willow Hollow', theme: 'cave', music: 'cave', region: 'Verdant Vale', dungeon: true,
    rows: [
      'WWWWWWWWWWWWWWWW',
      'WWW....WWW...WWW',
      'WW......W.....WW',
      'W....R.......R.W',
      'W..............W',
      'WW.....WW.....WW',
      'W.....WWWW.....W',
      'W..R.........R.W',
      'WW............WW',
      'WWW....WW....WWW',
      'WWWW........WWWW',
      'WWWWWW...WWWWWWW',
      'WWWWWWWOWWWWWWWW'
    ],
    warps: [['willow_trail', 3, 30, 'down']],
    itemsAt: [['pluscapsule', 1, 4, 1], ['remedy', 1, 12, 1]],
    hiddenAt: [['rekindle', 1, 14, 4]],
    tileText: { R: 'A rock covered in tiny purple crystals.' },
    enc: { cave: [[26, 6, 9, 30], [15, 5, 8, 35], [24, 5, 8, 35]], rate: 1 }
  });

  D('wt_weir', {
    name: 'Weir Hut', interior: true, theme: 'works',
    rows: ['WWWWWWWWWW', 'WWWWWWWWWW', '..........', '..........', '..........', '...M......'],
    entry: [3, 5],
    props: [
      ['gearwall', 0, 0], ['pipes', 3, 1], ['lever', 5, 2, { talk: 'wt_lever' }], ['window', 8, 1],
      ['bedroll', 1, 3, { text: 'A grey bedroll with an ember stitched on the corner. Someone has been sleeping here.' }],
      ['table', 6, 4, { w: 2, icon: 'map', text: 'A map of the valley. The dam is circled, and next to it: "Flush the little ones. Find the one with the spark." Three ember marks point up into the hills.' }],
      ['lantern', 9, 3, { text: 'An oil lantern, still warm.' }], ['crate', 9, 5, { icon: 'tent', text: 'A crate of supplies stamped with an ember. Rope, lamp oil, and a lot of crowbars.' }]
    ]
  });
  D('wt_ranger', {
    name: 'Ranger Cabin', interior: true, theme: 'cottage',
    rows: ['WWWWWWWWWWWW', 'WWWWWWWWWWWW', '............', '............', '............', '....M.......'],
    entry: [4, 5],
    props: [
      ['bed', 0, 2, { color: '#3e6e3e' }], ['stove', 2, 2], ['window', 3, 1], ['bookcase', 5, 2, { text: 'Field guides to every Kit in the valley, full of pressed leaves and feathers.' }],
      ['painting', 7, 1, { art: 'map', text: 'A trail map with little drawings of Kits where they live. A tiny snail is drawn next to the cliff by the river.' }],
      ['telescope', 9, 2, { talk: 'bh_scope' }], ['table', 7, 4, { w: 2, icon: 'books' }], ['rug', 1, 4, { w: 3, h: 1, color: '#6a8a4a' }], ['plant', 11, 5]
    ],
    npcs: { ranger: { at: [4, 3], sprite: 'hiker2', dir: 'down', talk: 'wt_ranger' } }
  });
  D('wt_tree', {
    name: 'Treehouse', interior: true, theme: 'mill',
    rows: ['WWWWWWWW', 'WWWWWWWW', '........', '........', '...M....'],
    entry: [3, 4],
    props: [['window', 1, 1], ['window', 6, 1], ['toybox', 0, 2], ['painting', 3, 1, { art: 'kit', icon: 12, text: 'A crayon drawing of a Kitefinch. It\'s labeled "MY BEST FRIEND FLAPS".' }], ['cushion', 5, 3, { color: '#e84848' }], ['chest', 7, 2, { text: 'A treasure chest. It\'s full of shiny pebbles and bottle caps.' }]],
    npcs: { treekid: { at: [4, 2], sprite: 'kid', dir: 'down', keeper: 'willow_6', sight: 0 } }
  });
  IN('wt_rest', 'hut', { name: 'Rest Stop', people: [
    { x: 3, y: 2, sprite: 'oldwoman', dir: 'down', talk: 'wt_caretaker' },
    { x: 1, y: 4, sprite: 'hiker', dir: 'right', text: 'I was hiking to Pinecrest when the rocks came down. Now I\'m stuck drinking tea here. There are worse fates!' }
  ] });

  // ================= Scripts =================
  S.wt_enter = async function (w) {
    if (PK.quest.at('after', 'north')) {
      PK.quest.complete('after');
      w.setFlag('after_done');
      await w.wait(10);
      PK.quest.start('trail');
    }
  };

  S.wt_weir_scene = async function (w) {
    var a = w.npc('cinderA'), b = w.npc('cinderB');
    w.music('mystery');
    w.setFlag('cinders_met');
    await w.say('...Two figures in grey cloaks are arguing by the weir.');
    await w.say('CINDER: Keep that sluice jammed open. The Elders want the valley below soaked to the roots.');
    await w.say('CINDER: And the three little ones we flushed down? The Elders want them found. Especially the ones that still have their spark.');
    if (a) await w.emote(a, '!');
    if (b) await w.emote(b, '!');
    if (a) a.dir = 'right';
    if (b) b.dir = 'right';
    await w.say('CINDER: Hey! A kid from the village. And look, it has one of them!');
    var r = await w.battle('cinder_1');
    if (r !== 'win') return;
    await w.say('CINDER: Tch! Fine, you deal with this brat.');
    r = await w.battle('cinder_2');
    if (r !== 'win') return;
    await w.say('CINDER: The Ashen Accord will purify this valley, whether your little village likes it or not.');
    await w.say('CINDER: Stay out of the hills, kid. Next time it won\'t be just the two of us.');
    if (a) { await w.moveNpc(a, 'rrrrr'); a.hidden = true; }
    if (b) { await w.moveNpc(b, 'rrrrr'); b.hidden = true; }
    w.setFlag('cinders_fled');
    PK.quest.advance('trail', 'tracks');
    w.playMapMusic();
    await w.say('They ran off toward the north road. Wait, what are those marks in the mud by the weir?');
  };

  S.wt_tracks = async function (w, n) {
    var st = g().state, mine = st.flags.starter, sib = PK.siblingStarter(st);
    var third = [1, 4, 7].filter(function (id) { return id !== mine && id !== sib; })[0];
    var what = { 1: 'a trail of soft moss and crushed flowers', 4: 'little scorch marks and a scattering of eggshell', 7: 'tiny smudges of ink and a broken bit of seashell' }[third];
    await w.say('Tiny footprints in the mud, and ' + what + '...');
    await w.say('It must be the third Kit from the flood, the one nobody caught! It climbed out of the river right here.');
    await w.say('The tracks lead up past the weir, into the hills where the river begins.');
    g().see(third);
    await w.say(PK.KITS[third].name + ' was added to your KitLog as seen.');
    n.hidden = true;
    PK.quest.advance('trail', 'sibling');
  };

  S.wt_sibling = async function (w) {
    var sib = w.npc('sibling');
    if (!sib) return;
    w.setFlag('sibling_met');
    w.music('sibling');
    await w.emote(sib, '!');
    sib.dir = 'down';
    await w.say('{RIVAL}: ...{PLAYER}? What are you doing out here?');
    await w.say('{RIVAL}: Grandma let you leave? With THAT? You can barely keep it out of the river.');
    await w.say('{RIVAL}: Fine. If you want to follow me around, let\'s see if you\'re worth the trouble.');
    var r = await w.battle('sibling1', { canLose: true });
    if (r === 'win') await w.say('{RIVAL}: ...Huh. Not bad. Not bad at all.');
    else await w.say('{RIVAL}: Told you. Always one step ahead. Go home, {PLAYER}.');
    PK.game.healParty();
    await w.say('{RIVAL}: Listen. Those grey coats at the weir? I know who they are. The Ashen Accord.');
    await w.say('{RIVAL}: Grandpa didn\'t just walk away from them. They know what happened to him. I\'m going to find out.');
    await w.say('{RIVAL}: Don\'t follow me. And don\'t tell Mom where I am.');
    w.music('sibling');
    await w.moveNpc(sib, 'u');
    await w.say('{RIVAL} scrambled up over the rockslide and disappeared toward Pinecrest.');
    sib.hidden = true;
    PK.quest.advance('trail', 'road');
    w.playMapMusic();
  };

  // The Ashen Accord blows the rockslide apart and marches up to Pinecrest
  var SLIDE = [[29, 1, '.'], [30, 1, ':'], [31, 1, ':'], [32, 1, '.'], [29, 2, '.'], [32, 2, '.']];
  S.wt_blast = async function (w) {
    w.music('mystery');
    await w.say('...Wait. Something is fizzing in the rocks. A long grey fuse, burning fast!');
    await w.wait(30);
    if (PK.audio) PK.audio.sfx('smash');
    PK.fx.flash(12, '#ffffff');
    PK.fx.shake(50, 4);
    SLIDE.forEach(function (t) { w.clearTile(t[0], t[1], t[2]); });
    await w.wait(40);
    await w.say('BOOOOOM! The whole rockslide blows apart in a storm of dust and pebbles!');
    var a = w.npc('blastA'), b = w.npc('blastB');
    if (a) a.hidden = false;
    if (b) b.hidden = false;
    await w.say('CINDER: The road is open, boys! The Elder wants the heavy gear up the mountain by nightfall!');
    if (a) { await w.moveNpc(a, 'uu'); a.hidden = true; }
    if (b) { await w.moveNpc(b, 'uuu'); b.hidden = true; }
    var wk = w.npc('worker');
    if (wk) { w.facePlayer(wk); await w.emote(wk, '!'); }
    await w.say('WORKER: They just... BLEW IT UP?! A week of digging! They said they had a "permit"!');
    await w.say('WORKER: Well. The road to Pinecrest is open, I suppose. Be careful up there, kid.');
    w.setFlag('road_open');
    PK.quest.complete('trail');
    PK.quest.start('mountain');
    w.playMapMusic();
  };

  S.wt_jory = async function (w) {
    var q = PK.quest;
    if (!q.has('lowwater')) {
      await w.say('ANGLER JORY: The river\'s been running high and muddy since the storm. Fish won\'t bite, and the stepping stones upstream are under water.');
      await w.say('ANGLER JORY: The old weir up north has a sluice lever in its hut. Pull that, and the river would drop back to normal.');
      if (!g().flag('cinders_fled')) await w.say('ANGLER JORY: Mind you, I saw some shady types in grey hanging around up there. Be careful.');
      q.start('lowwater');
      return;
    }
    if (q.at('lowwater', 'back')) {
      await w.say('ANGLER JORY: The water\'s dropping! I can see the stepping stones from here. You did it!');
      await w.give('pluscapsule', 3);
      q.complete('lowwater');
      await w.say('ANGLER JORY: Here\'s a secret: across those stones, on the west bank, there\'s a little cave in the cliff. My grandad swore there were crystal snails living in it.');
      return;
    }
    if (q.done('lowwater')) return w.say('ANGLER JORY: Finally, a bite! Well, a nibble. I\'ll take it.');
    return w.say('ANGLER JORY: The weir hut is up north, past the forest. Pull the sluice lever and the river will drop.');
  };

  S.wt_lever = async function (w) {
    if (!g().flag('cinders_fled')) return w.say('Someone has wedged the lever with a chunk of wood. You\'d better deal with whoever is outside first.');
    if (g().flag('weir_low')) return w.say('The lever is pulled down. The river below is running low and calm.');
    if (!(await w.yesno('A big iron lever. Someone jammed it all the way open. Pull it back?'))) return;
    if (PK.audio) PK.audio.sfx('smash');
    PK.fx.shake(14, 2);
    await w.say('CLUNK! The sluice gate grinds shut. Outside, the roar of the water fades to a gurgle.');
    g().setFlag('weir_low');
    var st = g().state;
    st.cleared = st.cleared || {};
    var c = st.cleared.willow_trail = st.cleared.willow_trail || {};
    STONES.forEach(function (p) { c[p[0] + ',' + p[1]] = 'I'; });
    if (PK.quest.at('lowwater', 'lever')) PK.quest.advance('lowwater', 'back');
    else if (!PK.quest.has('lowwater')) await w.say('Downstream, stepping stones should be poking out of the river now.');
  };

  S.wt_ranger = async function (w) {
    if (!w.flag('met_ranger')) {
      w.setFlag('met_ranger');
      await w.say('RANGER HOLT: Welcome, welcome! I track every Kit on Willow Trail. Day and night, rain or shine.');
    }
    var night = PK.game.timeOfDay() === 'night';
    await w.say('RANGER HOLT: By day you\'ll find Kitefinch, Rushkin, Puffhop, Caddle and Acornet in the grass. Streamlark if you\'re lucky.');
    await w.say('RANGER HOLT: After dark, the Nocturr come out. Big yellow eyes, purrs like a cat. ' + (night ? 'It\'s dark now, so go have a look!' : 'Come back at night to find one.'));
    await w.say('RANGER HOLT: And the river is full of Skimble. If you\'ve got a rod, cast from any bank.');
    if (!w.flag('ranger_gift')) { w.setFlag('ranger_gift'); await w.say('RANGER HOLT: Here, every explorer needs a few of these.'); await w.give('swiftsnap', 2); }
  };
  S.wt_caretaker = async function (w) {
    await w.say('CARETAKER: Welcome to the Rest Stop, dear. Sit, have some tea. Your Kits look tired.');
    await w.heal();
    await w.say('CARETAKER: There. All rested. The road can wait a little while.');
  };
})();
