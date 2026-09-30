// The Beacon Playhouse (Water gym): an old lighthouse turned theatre. Three big rooms, each with two challenges, a guard,
// then the showman's stage. Losing anywhere resets the whole Playhouse. Leader: Warden Marlo Luce (secretly helping the Accord).
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, S = PK.SCRIPTS, TK = PK.TK;
  function g() { return PK.game; }
  function beat(id) { return !!g().state.defeated[id]; }
  function notFlag(f) { return function () { return !g().flag(f); }; }
  function sm() { return PK.sm.sm(); }

  // ---------------- trainers ----------------
  TK('smg_1', 'Stagehand', 'Rune', 'dockhand', [[62, 19], [65, 19], [69, 20]], { reward: 55, noRematch: true, music: 'gym2', intro: 'Mirrors and crates, done! Now the fun part: getting past ME.', after: 'The crates are heavier than they look. So are my Kits.' });
  TK('smg_2', 'Diver', 'Kai', 'swimmer', [[75, 20], [58, 20], [60, 21]], { reward: 60, noRematch: true, music: 'gym2', intro: 'Levers, fishing, and flooded corridors? You are just getting warm!', after: 'Water is my home turf. I lost at home. That is humbling.' });
  TK('smg_3', 'Usher', 'Barnaby', 'cinder', [[66, 21], [77, 20], [65, 21]], { reward: 70, noRematch: true, music: 'syndicate', intro: 'Ha! You caught me. Yes, the usher jacket is a costume. The Elder does love a costume.', after: 'Marlo is up there. He is nervous. Go easy. Or do not. Whatever.', lose: 'The Elder is not going to like this.' });
  TK('sm_showman', 'Warden', 'Marlo', 'showman', [[63, 19], [68, 20], [72, 21], [59, 21], [64, 22]], { reward: 250, noRematch: true, music: 'gym2', ai: 2, items: 1, intro: 'Ladies, gentlemen, and one very determined challenger! Welcome to the finale of the Beacon Playhouse!', lose: 'Bravo. What a finish. What a spectacular, terrible finish.' });

  // ---------------- helpers ----------------
  var GYM_FLAGS = ['smg1_mirrors', 'smg1_done', 'smg2_fish', 'smg3_buoys', 'smg3_cues'];
  var GYM_TRAINERS = ['smg_1', 'smg_2', 'smg_3'];
  function guardRow(y, trainerId, npcId, cols) {
    var run = async function (w) {
      if (beat(trainerId)) return;
      var n = w.npc(npcId), tr = PK.TRAINERS[trainerId];
      if (n) w.facePlayer(n);
      if (tr.intro) await w.say(tr.intro);
      var r = await w.battle(trainerId);
      if (r === 'win' && tr.after) await w.say(tr.after);
    };
    return (cols || [8, 9, 10]).map(function (x) { return { at: [x, y], run: run, cond: function () { return !beat(trainerId); } }; });
  }
  function gymReset(w) {
    var st = g().state;
    GYM_FLAGS.forEach(function (f) { g().setFlag(f, false); });
    GYM_TRAINERS.forEach(function (id) { delete st.defeated[id]; });
    if (st.boulders) delete st.boulders.sm_gym1;
    if (st.cleared) delete st.cleared.sm_gym1;
    sm().mir = null; sm().gates = null;
    w.load('sm_gym1', 9, 14, 'up');
  }
  async function gymOnLose(w) {
    gymReset(w);
    await PK.fx.fadeIn(20);
    await PK.ui.say('MARLO (over the theatre speakers): Oh no! Oh, the drama! Back to the top of the show, my dear. Every mirror, every lever, every buoy.');
    await PK.ui.say('The stagehands healed your Kits and reset every challenge in the Playhouse.');
  }
  var LOCK = function () { return beat('sm_showman') ? null : 'The doors are barred. A sign glows above: THE SHOW GOES ON. NOBODY LEAVES UNTIL THE FINAL BOW.'; };

  // ================= ROOM 1: light-beam mirrors, then cargo crates =================
  // Lamp at (1,9) fires east. Mirrors A (4,9), B (4,12), C (10,12). Solution: A '\', B '\', C '/'  ->  target at (10,9).
  var MIRROR_POS = { mA: [4, 9], mB: [4, 12], mC: [10, 12] };
  var LAMP = [1, 9], TARGET = [10, 9], NEXT = { E: [1, 0], W: [-1, 0], N: [0, -1], S: [0, 1] };
  function mirState() { var s = sm(); if (!s.mir) s.mir = { mA: 1, mB: 1, mC: 0 }; return s.mir; }   // 0 = '\', 1 = '/'
  function beam() {
    var m = mirState(), x = LAMP[0], y = LAMP[1], d = 'E', tiles = [], hit = false, byPos = {};
    Object.keys(MIRROR_POS).forEach(function (k) { byPos[MIRROR_POS[k].join(',')] = m[k]; });
    for (var i = 0; i < 60; i++) {
      x += NEXT[d][0]; y += NEXT[d][1];
      if (x < 1 || x > 17 || y < 8 || y > 13) break;
      var key = x + ',' + y;
      if (x === TARGET[0] && y === TARGET[1]) { hit = true; break; }
      if (byPos[key] != null) {
        var slash = byPos[key] === 1;
        d = slash ? { E: 'N', W: 'S', N: 'E', S: 'W' }[d] : { E: 'S', W: 'N', N: 'W', S: 'E' }[d];
        continue;
      }
      tiles.push([x, y]);
    }
    return { tiles: tiles, hit: hit };
  }
  function showBeam(w) {
    var b = beam();
    w.hl = { tiles: b.tiles, t: 1e9, color: 'rgba(255,238,120,0.62)' };
    var tg = w.npc('target'); if (tg) tg.d.art = { lit: b.hit };
    Object.keys(MIRROR_POS).forEach(function (k) { var n = w.npc(k); if (n) n.d.art = { variant: String(mirState()[k] ? 1 : 0) }; });
    return b;
  }
  S.smg1_enter = async function (w) { if (!g().flag('smg1_mirrors')) showBeam(w); else w.hl = null; };
  S.smg_mirror = async function (w, n) {
    var m = mirState(), k = n.id;
    m[k] = m[k] ? 0 : 1;
    if (PK.audio) PK.audio.sfx('select');
    var b = showBeam(w);
    if (b.hit && !g().flag('smg1_mirrors')) {
      w.setFlag('smg1_mirrors');
      if (PK.audio) PK.audio.jingle('item');
      await w.say('The beam bounces from mirror to mirror and strikes the sun-dial. It blazes gold!');
      await w.say('With a rumble, the shutters above rise. The crate hall is open.');
      ['sh1', 'sh2', 'sh3'].forEach(function (id) { var s = w.npc(id); if (s) s.hidden = true; });
      w.hl = null;
    }
  };
  S.smg_lamp = async function (w) { await w.say('A brass lamp on a stand, firing a thin beam east across the hall. It follows whatever the mirrors do to it.'); };
  S.smg_target = async function (w) { await w.say(g().flag('smg1_mirrors') ? 'The sun-dial glows warm gold.' : 'A sun-dial target. It lights up when a beam of light lands on it.'); };

  D('sm_gym1', {
    name: 'Beacon Playhouse: Mirrors and Cargo', interior: true, theme: 'gym_Water', music: 'gym2',
    rows: [
      'WWWWWWWW...WWWWWWWW',
      'W.................W',
      'WWWWWWWWoooWWWWWWWW',
      'W.................W',
      'W.................W',
      'W.................W',
      'W..Q...........Q..W',
      'WWWWWWWW...WWWWWWWW',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W........M........W'
    ],
    entry: [9, 14], statue: 'A gilded statue of a performer taking a bow. The pedestal reads: "THE SHOW MUST GO ON".',
    links: [['sm_gym1', 9, 1], ['sm_gym1', 9, 9]],
    npcs: {
      lamp: { at: [1, 9], sprite: 'bld:beamlamp', noTurn: true, talk: 'smg_lamp' },
      target: { at: [10, 9], sprite: 'bld:suntarget', art: { lit: false }, noTurn: true, talk: 'smg_target' },
      mA: { at: [4, 9], sprite: 'bld:mirror', art: { variant: '1' }, noTurn: true, talk: 'smg_mirror' },
      mB: { at: [4, 12], sprite: 'bld:mirror', art: { variant: '1' }, noTurn: true, talk: 'smg_mirror' },
      mC: { at: [10, 12], sprite: 'bld:mirror', art: { variant: '0' }, noTurn: true, talk: 'smg_mirror' },
      // a spare mirror the beam never touches
      mD: { at: [14, 11], sprite: 'bld:mirror', art: { variant: '0' }, noTurn: true, text: 'A mirror that is not part of the puzzle. It has a sticker: "PROP. DO NOT REFLECT."' },
      sh1: { at: [8, 7], sprite: 'gate', gate: 'stone', noTurn: true, cond: notFlag('smg1_mirrors'), text: 'A heavy stage shutter. It hums, as if waiting for a bright idea.' },
      sh2: { at: [9, 7], sprite: 'gate', gate: 'stone', noTurn: true, cond: notFlag('smg1_mirrors'), text: 'A heavy stage shutter. It hums, as if waiting for a bright idea.' },
      sh3: { at: [10, 7], sprite: 'gate', gate: 'stone', noTurn: true, cond: notFlag('smg1_mirrors'), text: 'A heavy stage shutter. It hums, as if waiting for a bright idea.' },
      // five crates for three pits (two spares, so a stuck crate never soft-locks the room)
      c1: { at: [8, 4], sprite: 'crate', push: true }, c2: { at: [9, 4], sprite: 'crate', push: true }, c3: { at: [10, 4], sprite: 'crate', push: true },
      c4: { at: [3, 5], sprite: 'crate', push: true }, c5: { at: [15, 5], sprite: 'crate', push: true },
      t1: { at: [9, 1], sprite: 'dockhand', dir: 'down' }
    },
    eventsAt: guardRow(1, 'smg_1', 't1'),
    warpsAt: [[9, 0, 'sm_gym2', 9, 14, 'up']],
    onEnter: 'smg1_enter',
    lockExit: LOCK, onLose: gymOnLose
  });

  // ================= ROOM 2: current levers, then a fishing hatch =================
  // Four sluice gates across the corridor. Levers: L1 flips gates 1+2, L2 flips 2+3, L3 flips 3+4, L4 flips 4+1. Start all closed: press L1 + L3 (or L2 + L4).
  var GATE_ROWS = [4, 6, 8, 10];
  var LEVER_OPS = { l1: [0, 1], l2: [1, 2], l3: [2, 3], l4: [3, 0] };
  function gateState() { var s = sm(); if (!s.gates) s.gates = [0, 0, 0, 0]; return s.gates; }
  function applyGates(w) {
    var gs = gateState();
    GATE_ROWS.forEach(function (row, i) { ['a', 'b', 'c'].forEach(function (c) { var n = w.npc('g' + i + c); if (n) n.hidden = !!gs[i]; }); });
  }
  S.smg2_enter = async function (w) { applyGates(w); };
  S.smg_lever = async function (w, n) {
    var gs = gateState(), ops = LEVER_OPS[n.id];
    ops.forEach(function (i) { gs[i] = gs[i] ? 0 : 1; });
    if (PK.audio) PK.audio.sfx('door');
    PK.fx.shake(6, 2);
    applyGates(w);
    var open = gs.reduce(function (a, b) { return a + b; }, 0);
    await w.say('You crank the lever. Water surges and sluice gates clank: ' + gs.map(function (x, i) { return 'gate ' + (i + 1) + (x ? ' OPEN' : ' shut'); }).join(', ') + '.');
    if (open === 4) await w.say('Every gate is open. The corridor stretches clear to the top hall.');
  };
  S.smg2_fish = async function (w) {
    if (g().flag('smg2_fish')) return w.say('The hatch above stands open. The pond ripples, satisfied.');
    await w.say('A sunken pond, and a heavy brass key glinting at the bottom. A fishing rod leans against the rim. The hatch key will not fish itself out.');
    if (!(await w.yesno('Reel it in?'))) return;
    var r = await PK.minigame.timing({ title: 'REEL IN THE KEY', hint: 'Stop the marker in the gold zone', hits: 3, speed: 1.9, zone: 26, theme: 'fish', good: ['A tug!', 'Heavier!', 'Almost there!'], winMsg: 'A brass key breaks the surface!', badMsg: 'It slipped the line!', loseMsg: 'The key sank again. Try once more.' });
    if (!r.win) return w.say(r.quit ? 'You set the rod down.' : 'The key sinks back into the dark. Try again whenever you are ready.');
    w.setFlag('smg2_fish');
    if (PK.audio) PK.audio.jingle('keyitem');
    await w.say('You fish out the brass key and fit it into the hatch lock. The hatch swings open with a splash.');
    ['h1', 'h2', 'h3'].forEach(function (id) { var h = w.npc(id); if (h) h.hidden = true; });
  };

  var g2npcs = {
    l1: { at: [3, 5], sprite: 'bld:crank', noTurn: true, talk: 'smg_lever' }, l2: { at: [3, 9], sprite: 'bld:crank', noTurn: true, talk: 'smg_lever' },
    l3: { at: [15, 5], sprite: 'bld:crank', noTurn: true, talk: 'smg_lever' }, l4: { at: [15, 9], sprite: 'bld:crank', noTurn: true, talk: 'smg_lever' },
    h1: { at: [8, 2], sprite: 'gate', noTurn: true, cond: notFlag('smg2_fish'), text: 'A brass hatch, locked. A note pinned to it: "Key is in the pond. Do not ask how it got there."' },
    h2: { at: [9, 2], sprite: 'gate', noTurn: true, cond: notFlag('smg2_fish'), text: 'A brass hatch, locked. A note pinned to it: "Key is in the pond. Do not ask how it got there."' },
    h3: { at: [10, 2], sprite: 'gate', noTurn: true, cond: notFlag('smg2_fish'), text: 'A brass hatch, locked. A note pinned to it: "Key is in the pond. Do not ask how it got there."' },
    t2: { at: [9, 1], sprite: 'swimmer', dir: 'down' }
  };
  GATE_ROWS.forEach(function (row, i) { ['a', 'b', 'c'].forEach(function (c, j) { g2npcs['g' + i + c] = { at: [8 + j, row], sprite: 'gate', noTurn: true, gate: 'stone', cond: function () { return true; }, text: 'A sluice gate. Water thunders against the other side. A lever somewhere in the side halls controls it.' }; }); });
  D('sm_gym2', {
    name: 'Beacon Playhouse: Currents and Bait', interior: true, theme: 'gym_Water', music: 'gym2',
    rows: [
      'WWWWWWWW...WWWWWWWW',
      'W.................W',
      'WWWWWWWW...WWWWWWWW',
      'W......W...W......W',
      'W......W...W......W',
      'W......W...W......W',
      'W......W...W......W',
      'W......W...W......W',
      'W......W...W......W',
      'W......W...W......W',
      'W......W...W......W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W........M........W'
    ],
    entry: [9, 14],
    links: [['sm_gym2', 9, 1]],
    props: [['touchpool', 1, 12, { w: 3, h: 2, talk: 'smg2_fish', text: 'A deep pond with a key at the bottom.' }]],
    npcs: g2npcs,
    eventsAt: guardRow(1, 'smg_2', 't2'),
    warpsAt: [[9, 0, 'sm_gym3', 9, 14, 'up']],
    onEnter: 'smg2_enter',
    lockExit: LOCK, onLose: gymOnLose
  });

  // ================= ROOM 3: buoy memory, then stage cues =================
  S.smg3_buoys = async function (w) {
    if (g().flag('smg3_buoys')) return w.say('The buoys bob quietly. The first gate stands open.');
    await w.say('Four buoys float in a tank: red, yellow, green and blue. A brass plaque: "Remember the order they light. Repeat it. Do not blink."');
    if (!(await w.yesno('Try the Buoy Memory?'))) return;
    var r = await PK.minigame.memory({ title: 'BUOY MEMORY', rounds: 4, start: 3 });
    if (!r.win) return w.say(r.quit ? 'You step back from the tank.' : 'The buoys dim. Whoever designed this had a very good memory. Try again.');
    w.setFlag('smg3_buoys');
    if (PK.audio) PK.audio.jingle('item');
    await w.say('Every buoy shines in order. The first gate rolls open.');
    ['b1', 'b2', 'b3'].forEach(function (id) { var n = w.npc(id); if (n) n.hidden = true; });
  };
  S.smg3_cues = async function (w) {
    if (g().flag('smg3_cues')) return w.say('The cue board hums quietly. The final gate stands open.');
    await w.say('A stage cue board with four glowing buttons. A note: "Hit every cue on the beat. The audience is watching. The audience is always watching."');
    if (!(await w.yesno('Take the cue board?'))) return;
    var r = await PK.minigame.cues({ title: 'STAGE CUES', cues: 16, speed: 1.5, gap: 34, pass: 0.7 });
    if (!r.win) return w.say(r.quit ? 'You step away from the board.' : 'The lights flicker out. Scattered applause, from the ghost of a stagehand. Try again.');
    w.setFlag('smg3_cues');
    if (PK.audio) PK.audio.jingle('item');
    await w.say('The lights bloom in perfect rhythm. The final gate lifts.');
    ['f1', 'f2', 'f3'].forEach(function (id) { var n = w.npc(id); if (n) n.hidden = true; });
  };
  D('sm_gym3', {
    name: 'Beacon Playhouse: Buoys and Cues', interior: true, theme: 'gym_Water', music: 'gym2',
    rows: [
      'WWWWWWWW...WWWWWWWW',
      'W.................W',
      'WWWWWWWW...WWWWWWWW',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'WWWWWWWW...WWWWWWWW',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W........M........W'
    ],
    entry: [9, 14],
    links: [['sm_gym3', 9, 3], ['sm_gym3', 9, 1]],
    props: [['buoy', 4, 11, { talk: 'smg3_buoys' }], ['buoy', 5, 11, { talk: 'smg3_buoys' }], ['buoy', 13, 11, { talk: 'smg3_buoys' }], ['buoy', 14, 11, { talk: 'smg3_buoys' }], ['cueboard', 8, 5, { w: 2, talk: 'smg3_cues' }], ['spotlight', 3, 5], ['spotlight', 15, 5], ['drumkit', 2, 3, { w: 2 }]],
    npcs: {
      b1: { at: [8, 8], sprite: 'gate', noTurn: true, cond: notFlag('smg3_buoys'), text: 'A stage gate, locked tight. The buoy tank in the hall below controls it.' },
      b2: { at: [9, 8], sprite: 'gate', noTurn: true, cond: notFlag('smg3_buoys'), text: 'A stage gate, locked tight. The buoy tank in the hall below controls it.' },
      b3: { at: [10, 8], sprite: 'gate', noTurn: true, cond: notFlag('smg3_buoys'), text: 'A stage gate, locked tight. The buoy tank in the hall below controls it.' },
      f1: { at: [8, 2], sprite: 'gate', noTurn: true, cond: notFlag('smg3_cues'), text: 'The final gate. Its lock lights up in time with the cue board in the hall.' },
      f2: { at: [9, 2], sprite: 'gate', noTurn: true, cond: notFlag('smg3_cues'), text: 'The final gate. Its lock lights up in time with the cue board in the hall.' },
      f3: { at: [10, 2], sprite: 'gate', noTurn: true, cond: notFlag('smg3_cues'), text: 'The final gate. Its lock lights up in time with the cue board in the hall.' },
      t3: { at: [9, 1], sprite: 'cinder', dir: 'down', keeper: 'smg_3', sight: 0 }
    },
    eventsAt: guardRow(1, 'smg_3', 't3'),
    warpsAt: [[9, 0, 'sm_gym4', 9, 12, 'up']],
    lockExit: LOCK, onLose: gymOnLose
  });

  // ================= ROOM 4: the showman's stage =================
  S.sm_marlo = async function (w) {
    var n = w.npc('marlo');
    if (beat('sm_showman')) return w.say('MARLO: The applause is for you. Please, take a bow. I mean it. Take a bow.');
    w.music('gym2');
    await w.say('MARLO: Ah! The challenger who conquered my mirrors, my crates, my currents, and my buoys! Welcome to the last act!');
    await w.say('MARLO: I am Marlo Luce, showman, Warden of the Beacon Playhouse, and the man who lights the sky over Saltmarsh every festival night.');
    await w.say('MARLO: I have a confession, darling. I am terribly nervous tonight. So let us make it a show worth remembering!');
    var r = await w.battle('sm_showman');
    if (r !== 'win') return;
    await w.say('MARLO: ...Bravo. Oh, bravo. The Harbor Crest is yours.');
    var st = g().state;
    st.crests = st.crests || [];
    st.crests[1] = true;
    if (PK.audio) PK.audio.jingle('keyitem');
    await w.say(st.player.name + ' received the Harbor Crest from Warden Marlo!');
    await w.give('sd03');
    await w.say('MARLO: That disc teaches Riptide. A finishing move. I know a thing or two about finishing moves.');
    await w.say('MARLO: And this, for the road ahead: the Raft. It floats. Somewhat.');
    await w.give('raft');
    await w.say('MARLO: Now. A real confession, since you have earned it. The Elder... Mister Quill... asked me to light the signal rocket at midnight tomorrow. Green over white over red.');
    await w.say('MARLO: I asked what it was for. He smiled and said, "A surprise for the harbor." He is so charming. I said yes.');
    await w.say('MARLO: Then I saw what came off the boats. Cages. Small Kits in cages. And a hooded person who looked at me like I was a lamp to be lit.');
    await w.say('MARLO: I do not want to light that rocket. But the lighthouse controls are Quill\'s now. Go up the Saltmarsh Light. Stop him. I will stall the fireworks as long as I can.');
    w.setFlag('marlo_confessed');
    PK.quest.advance('festival', 'quill');
    w.playMapMusic();
  };
  D('sm_gym4', {
    name: 'Beacon Playhouse: The Stage', interior: true, theme: 'gym_Water', music: 'gym2',
    rows: [
      'WWWWWWWWWWWWWWWWWWW',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W.................W',
      'W........M........W'
    ],
    entry: [9, 12],
    props: [['stagecurtain', 1, 1, { w: 3 }], ['stagecurtain', 5, 1, { w: 3 }], ['stagecurtain', 11, 1, { w: 3 }], ['stagecurtain', 15, 1, { w: 3 }], ['spotlight', 3, 4], ['spotlight', 15, 4], ['drumkit', 1, 8, { w: 2 }], ['festivaldrum', 16, 8], ['lantern', 3, 10], ['lantern', 15, 10]],
    npcs: { marlo: { at: [9, 3], sprite: 'showman', dir: 'down', talk: 'sm_marlo' } },
    lockExit: LOCK, onLose: gymOnLose
  });
})();
