// The Way Down: from the Pinecrest summit's north gate, down the Far Slope (cliff switchbacks, wind ridge, rockfall floor,
// rope bridge, trailside camp), across the Windswept Trail (dunes and scrub) to Gullshore, where the harbor road begins.
// Map rows are generated (farpath_rows.js); everything else lives here.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, S = PK.SCRIPTS, Q = PK.QUESTS, R = PK.FAR_ROWS;
  function g() { return PK.game; }
  function flag(f) { return function () { return g().flag(f); }; }
  function notFlag(f) { return function () { return !g().flag(f); }; }
  function qat(id, step) { return function () { return PK.quest.at(id, step); }; }
  function beat(id) { return !!g().state.defeated[id]; }
  function room(id, name, theme, width, floorRows, o) {
    var wall = new Array(width + 1).join('W');
    return D(id, Object.assign({ name: name, interior: true, theme: theme, rows: [o.wall0 || wall, o.wall1 || wall].concat(floorRows) }, o));
  }
  function TK(id, title, name, sprite, team, o) {
    PK.TRAINERS[id] = Object.assign({ id: id, title: title, name: name, sprite: sprite, team: team, reward: 24, ai: 1 }, o || {});
  }

  // ================= Quests =================
  Q.farside = { title: 'The Far Side', kind: 'main', desc: 'The Accord\'s next stop is "by the sea". The only way there is the old guide trail down the far side of the mountain.',
    steps: [
      { id: 'descend', text: 'Climb down the Far Slope' },
      { id: 'trap', text: 'Find who is trapping Kits on the slope' },
      { id: 'coast', text: 'Cross the Windswept Trail to the coast' },
      { id: 'harbor', text: 'Get into Saltmarsh harbor' }
    ], reward: 'The road to the sea' };
  Q.cable = { title: 'The Snapped Cable', kind: 'side', desc: 'The far-side cable car line snapped in the Accord\'s blast. The operator needs three steel spools, and Guide Maren says spares were left along the old trail.',
    steps: [{ id: 'spools', text: 'Find 3 Cable Spools along the far trail' }, { id: 'deliver', text: 'Bring the spools to a Cable Car operator' }], reward: 'A shortcut over the mountain' };

  // ================= Trainers (far slope, trail, beach) =================
  TK('fs_1', 'Hiker', 'Ansel', 'hiker2', [[51, 15], [49, 15]], { intro: 'Nobody uses the old trail any more! You must be lost. Or brave. Battle?', after: 'A Windlet blew off the ridge with my hat. It brought the hat back. Best Kit ever.' });
  TK('fs_2', 'Birdwatcher', 'Odile', 'birder', [[51, 16], [52, 17]], { intro: 'Shh, the gliders are landing! ...Oh, a challenger. Fine!', after: 'Cliffswift sleep while flying. Imagine that. I can barely nap in a bed.' });
  TK('fs_3', 'Hiker', 'Bertram', 'hiker', [[28, 16], [49, 17], [31, 17]], { intro: 'Rockfall ahead, so I am just waiting here. Might as well train!', after: 'Watch the shadows on the ground. Shadow first, rock second.' });
  TK('fs_4', 'Climber', 'Wren', 'girl', [[52, 17], [29, 17]], { intro: 'You crossed the rope bridge? Nice. Now cross MY team!', after: 'The bridge sways more when you look down. So do not look down.' });
  TK('cinder_5', 'Accord Cinder', 'Grunt', 'cinder', [[24, 17], [51, 17]], { reward: 45, noRematch: true, music: 'syndicate', intro: 'This slope is ours! We are collecting stock for... a client.', lose: 'That Cliffswift was OURS to sell!' });
  TK('cinder_6', 'Accord Cinder', 'Grunt', 'cinder2', [[31, 17], [49, 18]], { reward: 45, noRematch: true, music: 'syndicate', intro: 'Boss says nobody sees the nets. So nobody saw anything!', lose: 'The crates were supposed to leave tonight...' });
  TK('tw_1', 'Traveler', 'Marisa', 'girl', [[54, 19], [55, 19], [56, 18]], { intro: 'The trail is long and I am bored. Battle me!', after: 'Dunelet roll all the way down the dunes. I chase them for fun.' });
  TK('tw_2', 'Scout', 'Cormac', 'hiker2', [[57, 20], [56, 20], [51, 19]], { intro: 'A Sentrybrush guards this stretch. So do I!', after: 'Sentrybrush will not let you past until you battle. They are worse than me.' });
  TK('gs_1', 'Swimmer', 'Delphine', 'swimmer', [[58, 20], [60, 20], [58, 21]], { intro: 'The tide just went out and my day just got better! Battle!', after: 'Jellyp float in on the evening tide. Do not poke them, however cute.' });
  TK('gs_2', 'Sailor', 'Bosun Pike', 'sailor', [[59, 21], [58, 21], [57, 21], [55, 20]], { intro: 'Harbor is closed for the festival, matey. Unless you can beat me!', after: 'Fine crew this year. Fine festival, too. Fine as anything.' });

  // ================= Far Slope =================
  var CAMP_SIGN = 'TRAILSIDE CAMP - Rest here. Guide Maren\'s camp.';
  D('pc_far', {
    name: 'Far Slope', theme: 'mount', music: 'willow', region: 'Windward Coast', townPoint: [20, 40],
    rows: R.pc_far,
    props: [
      ['tent', 27, 25, { color: '#4a7a9a', text: 'A neat blue tent. A guide\'s cot and a folded map inside.' }], ['tent', 31, 25, { color: '#9a6a3a', text: 'A canvas tent smelling of stew and woodsmoke.' }],
      ['campfire', 29, 27], ['bedroll', 34, 26], ['crate', 35, 27, { text: 'SUPPLIES: rope, tonic, and a lot of tea.' }],
      ['hangsign', 33, 24, { icon: 'rope', text: 'GUIDE CAMP. Rest, eat, then go on.' }]
    ],
    signsAt: [
      [18, 55, 'FAR SLOPE - The old guide route down to the coast. Mind the wind!'],
      [7, 44, 'WIND RIDGE - Gusts will shove you around. Stay steady and keep moving.'],
      [10, 35, 'ROCKFALL FLOOR - Stones drop on this stretch. Watch for the red shadows on the ground!'],
      [30, 27, CAMP_SIGN],
      [21, 6, 'NORTH: Windswept Trail and the coast.   SOUTH: Pinecrest Summit.']
    ],
    itemsAt: [['hitonic', 1, 36, 24], ['spoolA', 1, 30, 5], ['swiftroot', 1, 6, 19], ['capsule', 2, 24, 55]],
    warpsAt: [[8, 32, 'pc_windpipe', 9, 11, 'up'], [8, 31, 'pc_windpipe', 11, 1, 'down'], [4, 7, 'pc_whisper', 6, 8, 'up']],
    npcs: {
      fa1: { at: [28, 52], sprite: 'hiker2', dir: 'down', keeper: 'fs_1', sight: 3 },
      fa2: { at: [18, 43], sprite: 'birder', dir: 'down', keeper: 'fs_2', sight: 3 },
      fa3: { at: [9, 37], sprite: 'hiker', dir: 'right', keeper: 'fs_3', sight: 3 },
      fa4: { at: [9, 26], sprite: 'girl', dir: 'down', keeper: 'fs_4', sight: 3 },
      trapA: { at: [24, 17], sprite: 'cinder', dir: 'down', keeper: 'cinder_5', sight: 3 },
      trapB: { at: [31, 17], sprite: 'cinder2', dir: 'down', keeper: 'cinder_6', sight: 3 },
      net: { at: [27, 16], sprite: 'kit:52', noTurn: true, cond: notFlag('net_freed'), talk: 'far_net' },
      spare: { at: [30, 16], sprite: 'item', noTurn: true, talk: 'far_crates' },
      maren2: { at: [30, 26], sprite: 'guide', dir: 'left', cond: flag('farpath'), talk: 'far_camp' },
      cook: { at: [33, 27], sprite: 'baker', dir: 'left', cond: flag('farpath'), talk: 'shop', stock: ['campstew', 'spicejerky', 'minttea', 'swiftsnap'] },
      nest: { at: [12, 5], sprite: 'kit:53', noTurn: true, cond: notFlag('squall_done'), talk: 'far_nest' }
    },
    eventsAt: [
      { at: [19, 18], run: 'far_trap', cond: qat('farside', 'descend') }, { at: [20, 18], run: 'far_trap', cond: qat('farside', 'descend') },
      { at: [19, 19], run: 'far_trap', cond: qat('farside', 'descend') }, { at: [20, 19], run: 'far_trap', cond: qat('farside', 'descend') }
    ],
    onStep: function (w, x, y) { return farStep(w, x, y); },
    onEnter: 'far_enter',
    edges: { s: { to: 'pinecrest_peak', off: 0 }, n: { to: 'pc_trail', off: 2 } },
    enc: {
      grass: [[51, 14, 16, 30], [49, 14, 16, 26], [52, 17, 18, 7], [31, 15, 16, 12], [29, 15, 16, 8], [24, 15, 16, 8, 'night'], [45, 16, 17, 4]]
    }
  });

  // hazards on the Far Slope: wind ridge (T1) and rockfall floor (T2)
  var gustN = 0, rockMarks = [], rockHits = 0;
  function farStep(w, x, y) {
    // wind ridge: cols 8..31, rows 43..47
    if (x >= 8 && x <= 31 && y >= 43 && y <= 47) {
      gustN++;
      if (gustN % 7 !== 0) return;
      var dirs = ['left', 'right'], dx = { left: -1, right: 1 };
      var d = dirs[(gustN / 7) % 2 | 0], nx = x + dx[d] * 2;
      if (w.blocked(x + dx[d], y) || w.blocked(nx, y) || w.map.at(x + dx[d], y) === 'V') return;
      return (async function () {
        if (PK.audio) PK.audio.sfx('bump');
        await w.say('A GUST shoves you sideways!', { auto: 30 });
        await w.movePlayer(d === 'left' ? 'll' : 'rr');
        return true;
      })();
    }
    // rockfall floor: cols 12..28, rows 33..39
    if (x >= 12 && x <= 28 && y >= 33 && y <= 39) {
      var hit = rockMarks.some(function (m) { return m[0] === x && m[1] === y; });
      if (hit) {
        rockMarks = []; w.hl = null; rockHits++;
        return (async function () {
          if (PK.audio) PK.audio.sfx('hit');
          PK.fx.shake(14, 3);
          await w.say('A rock smashes down right on you! You scramble back to the start of the floor.', { auto: 60 });
          await PK.fx.fadeOut(12); w.load('pc_far', 11, 36, 'right'); await PK.fx.fadeIn(12);
          return true;
        })();
      }
      var dxs = w.lastDir === 'left' ? -1 : 1, marks = [], tries = 0;
      while (marks.length < 3 && tries++ < 30) {
        var mx = x + dxs * (1 + (Math.random() * 2 | 0)), my = 33 + (Math.random() * 7 | 0);
        if (mx < 12 || mx > 28 || (mx === x && my === y)) continue;
        if (marks.some(function (m) { return m[0] === mx && m[1] === my; })) continue;
        marks.push([mx, my]);
      }
      rockMarks = marks;
      w.hl = { tiles: marks, t: 200, color: 'rgba(255,70,50,0.55)' };
      return;
    }
    if (rockMarks.length) { rockMarks = []; w.hl = null; }
  }
  S.far_enter = async function (w) {
    rockMarks = []; gustN = 0;
  };

  S.far_gate = async function (w) {
    var m = w.npc('marenGate');
    if (m) w.facePlayer(m);
    await w.say('GUIDE MAREN: There you are. I heard what happened in the grotto. Half a tablet, an Elder loose, and a note about "the sea." Am I close?');
    await w.say('GUIDE MAREN: From up here, there is exactly one way to the sea. The old guide trail down the far side. I have kept this gate shut for eleven years. Too many people got lost on it.');
    await w.say('GUIDE MAREN: Steep switchbacks. A rope bridge. Wind that will shove you flat. And a floor where the mountain drops stones on the careless.');
    await w.say('GUIDE MAREN: I will open it and set up camp halfway. Rest there before you go on. And watch the red shadows. Shadow first, rock second.');
    if (PK.audio) PK.audio.sfx('door');
    w.setFlag('farpath');
    PK.quest.start('farside');
    await w.say('The old gate swings open with a long, rusty groan.');
  };
  S.far_gate_closed = async function (w) {
    await w.say('An old iron gate with a rope lashed across it. A tag reads: FAR TRAIL - CLOSED. Keys: Guide Maren.');
  };

  S.far_camp = async function (w) {
    var m = w.npc('maren2');
    if (m) w.facePlayer(m);
    if (PK.quest.at('farside', 'descend') || PK.quest.at('farside', 'trap')) {
      await w.say('GUIDE MAREN: Sit by the fire. Something is off on this slope. I keep finding empty nets and bird feathers.');
    } else {
      await w.say('GUIDE MAREN: Sit by the fire and rest. Every traveler is welcome at a guide\'s camp.');
    }
    if (await w.yesno('Rest by the fire?')) {
      await PK.fx.fadeOut(20); await w.heal(); await PK.fx.fadeIn(20);
      g().state.clinic = { map: 'pc_far', x: 30, y: 28 };
      await w.say('GUIDE MAREN: There. Your team is good as new.');
    }
  };

  S.far_trap = async function (w) {
    PK.quest.advance('farside', 'trap');
    var a = w.npc('trapA'), b = w.npc('trapB');
    w.music('mystery');
    await w.say('Up ahead, two grey-cloaked figures crouch over a heap of netting. Something small and blue flaps inside it.');
    if (a) await w.emote(a, '!');
    await w.say('CINDER: Keep it quiet. The buyer wants six more Cliffswift by the festival.');
    w.playMapMusic();
  };
  S.far_net = async function (w) {
    if (!beat('cinder_5') || !beat('cinder_6')) return w.say('A Cliffswift is tangled in a snare net, chirping in panic. The two Accord Cinders are still guarding it!');
    await w.say('You cut the net free. The Cliffswift tumbles out, shakes its wings, and circles you twice.');
    w.setFlag('net_freed');
    PK.quest.advance('farside', 'coast');
    await w.say('There is a shipping tag under the netting: "STOCK FOR SALTMARSH FESTIVAL - LIGHTHOUSE DOCK." A small lighthouse is stamped on it.');
    await w.say('Guide Maren would want to know about this.');
  };
  S.far_crates = async function (w) {
    await w.say('Crates full of empty snare nets. Stamped on each lid is a small lighthouse with an anchor.');
  };
  S.far_nest = async function (w) {
    await w.say('A tall, dark-feathered Kit dozes on a ledge, a tiny thundercloud hanging over its head. It has not noticed you yet.');
    if (!(await w.yesno('Wake it up?'))) return;
    w.setFlag('squall_done');
    var r = await w.wildBattle(53, 21);
    void r;
  };

  // ================= the secret caves =================
  D('pc_windpipe', {
    name: 'The Windpipe', theme: 'cave', music: 'cave', region: 'Windward Coast', dungeon: true,
    rows: [
      'WWWWWWWWWWWOWWWW',
      'WWWWWWWWWW...WWW',
      'WWWWWWWW.....WWW',
      'WWWWWW......WWWW',
      'WWWWW.....R.WWWW',
      'WWWW.....WWWWWWW',
      'WWW.....WWWWWWWW',
      'WWW...R....WWWWW',
      'WWWW.........WWW',
      'WWWWWW.......WWW',
      'WWWWWWWW....WWWW',
      'WWWWWWWWW..WWWWW',
      'WWWWWWWWWOWWWWWW'
    ],
    warpsAt: [[11, 0, 'pc_far', 8, 30, 'up'], [9, 12, 'pc_far', 8, 33, 'down']],
    itemsAt: [['hitonic', 1, 11, 3], ['pluscapsule', 1, 4, 6]],
    tileText: { R: 'A boulder streaked with wind-polished quartz.' },
    enc: { cave: [[49, 14, 16, 30], [51, 14, 16, 25], [31, 14, 16, 22], [33, 14, 15, 15]] }
  });
  D('pc_whisper', {
    name: 'Whisper Hollow', theme: 'cave', music: 'cave', region: 'Windward Coast', dungeon: true,
    rows: [
      'WWWWWWWWWWWW',
      'WW........WW',
      'W..R....R..W',
      'W..........W',
      'W....WW....W',
      'W..........W',
      'WW........WW',
      'WWW......WWW',
      'WWWWW..WWWWW',
      'WWWWWWOWWWWW'
    ],
    warpsAt: [[6, 9, 'pc_far', 4, 9, 'down']],
    itemsAt: [['spoolC', 1, 3, 3], ['boostcandy', 1, 9, 2]],
    hiddenAt: [['pluscapsule', 1, 10, 5]],
    tileText: { R: 'A pale boulder that hums softly when the wind blows through the cave.' },
    enc: { cave: [[55, 19, 21, 10], [54, 17, 19, 30], [51, 15, 17, 30]] }
  });

  // ================= Windswept Trail =================
  D('pc_trail', {
    name: 'Windswept Trail', theme: 'desert', music: 'willow', region: 'Windward Coast',
    rows: R.pc_trail,
    buildings: [
      { k: 'cablecar', at: [31, 46], to: 'pc_cable_far', roof: '#3a78c8' },
      { k: 'stall', at: [36, 46], goods: 'bread', roof: '#c85a3a' }
    ],
    props: [['hangsign', 36, 45, { icon: 'bread', text: 'TRAIL SNACKS. For dusty travelers.' }], ['lantern', 30, 50], ['crate', 38, 49, { text: 'Crates of dried fruit for the stall.' }]],
    signsAt: [
      [20, 51, 'WINDSWEPT TRAIL - North: Gullshore and the harbor.   South: Far Slope and the mountain.'],
      [16, 41, 'DUNE RIDGE - Watch the wind! Loose sand may slide.'],
      [24, 30, 'OASIS AHEAD - Fresh water and a fine place to fish.'],
      [12, 18, 'NORTH: Gullshore (2 hours).'],
      [20, 12, 'CAUTION: Sentrybrush in the scrub. They stand their ground.']
    ],
    itemsAt: [['spoolB', 1, 12, 30], ['tonic', 2, 36, 12], ['remedy', 1, 6, 40], ['capsule', 2, 34, 33]],
    npcs: {
      tr1: { at: [24, 35], sprite: 'girl', dir: 'up', keeper: 'tw_1', sight: 3 },
      tr2: { at: [16, 17], sprite: 'hiker2', dir: 'up', keeper: 'tw_2', sight: 3 },
      stallman: { at: [36, 45], sprite: 'baker', dir: 'down', talk: 'shop', stock: ['honeybun', 'sunpeach', 'kelpcrisp', 'minttea'] },
      op2: { at: [33, 51], sprite: 'clerk', dir: 'up', text: 'CABLE OPERATOR: The far-side line is dead until the cable is repaired. Three spools, one snapped cable, no hurry.', textIf: [['cable_far', 'CABLE OPERATOR: All fixed! Head inside to ride the line back up to the summit.']] },
      nomad: { at: [10, 6], sprite: 'oldman', move: 'wander', text: 'NOMAD: Follow the wind and it always takes you somewhere. Mostly downhill. Tonight I follow it to the coast for the festival.' },
      traveler: { at: [28, 20], sprite: 'kid2', move: 'wander', text: 'The oasis fish are huge! Or I am small. My mom says it is a little of both.' }
    },
    onEnter: 'trail_enter',
    edges: { s: { to: 'pc_far', off: -2 }, n: { to: 'pc_beach', off: 0 } },
    enc: {
      grass: [[54, 17, 19, 30], [56, 17, 19, 28], [57, 19, 20, 8], [51, 17, 18, 12], [55, 19, 20, 5], [24, 16, 18, 10, 'night']],
      water: [[22, 17, 20, 70], [58, 18, 20, 25]]
    }
  });
  S.trail_enter = async function (w) {
    if (PK.quest.at('farside', 'trap') || PK.quest.at('farside', 'descend')) PK.quest.advance('farside', 'coast');
  };

  room('pc_cable_far', 'Trail Station', 'lab', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['window', 1, 1], ['window', 3, 1], ['gearwall', 6, 1], ['counter', 8, 2, { w: 2 }], ['painting', 11, 1, { art: 'map', text: 'CABLE CAR: Trail Station to Summit. The line was blasted. Bring three spools and it will run again.' }], ['plant', 1, 5]],
    npcs: { opfar: { at: [9, 3], sprite: 'clerk', dir: 'down', talk: 'pc_cable' } }
  });

  // ================= Gullshore =================
  D('pc_beach', {
    name: 'Gullshore', theme: 'coast', music: 'willow', region: 'Windward Coast',
    rows: R.pc_beach,
    props: [['banner', 12, 5, { color: '#e85a3a', icon: 'anchor' }], ['banner', 17, 5, { color: '#3a8ae8', icon: 'anchor' }], ['crate', 9, 4, { text: 'FESTIVAL: bunting and lanterns. Delivered by the Lighthouse Trading Co.' }], ['boat', 33, 13, { w: 2, h: 1 }]],
    signsAt: [
      [20, 36, 'GULLSHORE - Sea breeze, salt air, and a very long queue for the harbor.'],
      [14, 20, 'NORTH: Saltmarsh Harbor - FESTIVAL WEEK! Come in, come in!'],
      [20, 6, 'HARBOR ROAD - The gates open when the bunting is up.']
    ],
    itemsAt: [['hitonic', 1, 5, 22], ['minttea', 1, 38, 34], ['pluscapsule', 1, 6, 8]],
    npcs: {
      be1: { at: [22, 19], sprite: 'swimmer', dir: 'right', keeper: 'gs_1', sight: 4 },
      be2: { at: [19, 12], sprite: 'sailor', dir: 'left', keeper: 'gs_2', sight: 4 },
      sibB: { at: [17, 9], sprite: 'rival', dir: 'left', startHidden: true, cond: function () { return PK.quest.at('farside', 'harbor'); } },
      barA: { at: [13, 2], sprite: 'gate', noTurn: true, text: 'A barricade of crates and ropes. A painted sign: HARBOR CLOSED - FESTIVAL SET-UP. OPENING SOON!' },
      barB: { at: [14, 2], sprite: 'gate', noTurn: true, text: 'A barricade of crates and ropes. A painted sign: HARBOR CLOSED - FESTIVAL SET-UP. OPENING SOON!' },
      barC: { at: [15, 2], sprite: 'gate', noTurn: true, text: 'A barricade of crates and ropes. A painted sign: HARBOR CLOSED - FESTIVAL SET-UP. OPENING SOON!' },
      barD: { at: [16, 2], sprite: 'gate', noTurn: true, text: 'A barricade of crates and ropes. A painted sign: HARBOR CLOSED - FESTIVAL SET-UP. OPENING SOON!' },
      beachcomber: { at: [30, 32], sprite: 'oldwoman', move: 'wander', text: 'I collect sea glass. Blue for luck, green for the ocean, and this one is the color of the Accord\'s smoke. Odd, isn\'t it?' }
    },
    eventsAt: [
      { at: [14, 11], run: 'far_sib', cond: function () { return PK.quest.at('farside', 'coast') || PK.quest.at('farside', 'harbor'); } },
      { at: [15, 11], run: 'far_sib', cond: function () { return PK.quest.at('farside', 'coast') || PK.quest.at('farside', 'harbor'); } }
    ],
    onEnter: 'beach_enter',
    edges: { s: { to: 'pc_trail', off: 0 } },
    enc: {
      grass: [[58, 19, 21, 30], [51, 19, 21, 18], [56, 19, 21, 14], [54, 19, 21, 12], [52, 20, 22, 6]],
      water: [[60, 19, 22, 55], [58, 20, 22, 25], [61, 21, 23, 4]]
    }
  });
  S.beach_enter = async function (w) {
    if (PK.quest.at('farside', 'coast')) PK.quest.advance('farside', 'harbor');
  };
  S.far_sib = async function (w) {
    if (g().flag('sib_beach')) return;
    var sib = w.npc('sibB');
    if (!sib) return;
    w.setFlag('sib_beach');
    sib.hidden = false;
    w.music('sibling');
    await w.emote(sib, '!');
    await w.say('{RIVAL}: You are slow. I have been here since sunrise.');
    await w.say('{RIVAL}: See the smoke over the harbor? That is not festival fireworks. The Elder who got away is there. So are the crates you found on the slope.');
    await w.say('{RIVAL}: Do not trust anyone who smiles too much in Saltmarsh. Especially the ones who are very, very nice.');
    await w.say('{RIVAL}: The Accord already trusts me. Better if they never see the two of us together. Understand?');
    await w.moveNpc(sib, 'llll');
    sib.hidden = true;
    w.playMapMusic();
  };

  // ================= Cable car: far-side line (side quest) =================
  S.pc_cable = async function (w) {
    var mapId = w.map.id, top = mapId === 'pc_cable_top', far = mapId === 'pc_cable_far';
    if (!g().flag('cable_ok') && !far) return w.say('OPERATOR: Sorry! The cable car is only for Summit Crest holders. Mountain rules. Win the Challenge Hall and hop on any time.');
    var opts = far ? ['Up to the Summit', 'Stay here'] : [top ? 'Down to Base Camp' : 'Up to the Summit', 'The far-side line', 'Stay here'];
    var pick = await w.ask('OPERATOR: Where to?', opts);
    if (far) {
      if (pick !== 0) return;
      return riding(w, function () { w.load('pinecrest_peak', 31, 14, 'down'); });
    }
    if (pick === 1) return farLine(w, top);
    if (pick !== 0) return;
    return riding(w, function () { if (top) w.load('pinecrest', 45, 67, 'down'); else w.load('pinecrest_peak', 31, 14, 'down'); });
  };
  async function riding(w, go) {
    if (PK.audio) PK.audio.sfx('door');
    await PK.fx.fadeOut(20);
    await w.say('The little red car sways out over the pines...', { auto: 80 });
    go();
    await PK.fx.fadeIn(20);
  }
  async function farLine(w, top) {
    if (g().flag('cable_far')) {
      return riding(w, function () { w.load('pc_trail', 32, 50, 'down'); });
    }
    if (!PK.quest.has('cable')) {
      await w.say('OPERATOR: The line down the far side snapped in the blast. I need three steel cable spools to fix it.');
      if (g().flag('farpath')) {
        await w.say('OPERATOR: Guide Maren says she left spares along the old trail. One up on the slope, one down on the trail, and one hidden away in a cave. Keep your eyes open.');
        PK.quest.start('cable');
      } else {
        await w.say('OPERATOR: The trail is closed right now, so there is no way to look for them.');
      }
      return;
    }
    var have = g().count('spoolA') + g().count('spoolB') + g().count('spoolC');
    if (have < 3) return w.say('OPERATOR: ' + have + ' of 3 spools so far. Keep looking along the far trail!');
    await w.say('OPERATOR: Three spools! That is exactly the steel I need!');
    ['spoolA', 'spoolB', 'spoolC'].forEach(function (s) { g().removeItem(s, 1); });
    w.setFlag('cable_far');
    PK.quest.complete('cable');
    await w.say('OPERATOR: Give me a minute... There! The far-side line is running again, both ways. Ride for free.');
    await w.give('luckyclover');
  }

  // spool items advance the cable quest
  var spoolWatcher = function () {
    if (PK.quest.at('cable', 'spools') && g().count('spoolA') + g().count('spoolB') + g().count('spoolC') >= 3) PK.quest.advance('cable', 'deliver');
  };
  PK.farSpoolWatcher = spoolWatcher;
})();
