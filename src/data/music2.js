// Saltmarsh music (v2): a sea-shanty harbor theme, festival drums, a calm night version, the Accord front's polite menace,
// lighthouse air, tavern jig, arcade chiptune, aquarium dreaming, gentle harbor interiors, the ghost ship, and an intense gym theme.
// Written in the same MML as music.js; every bar sums to one whole note. Loaded after music.js.
(function () {
  'use strict';
  var M = window.PK.MUSIC;
  function T(name, tempo, lead, bass, drums, extra) {
    var ch = [{ inst: 'lead', mml: lead, vol: 1 }, { inst: 'tri', mml: bass, vol: 1 }];
    if (drums) ch.push({ inst: 'noise', mml: drums, vol: 0.8 });
    if (extra) ch.push({ inst: 'pulse', mml: extra, vol: 0.55 });
    M[name] = { tempo: tempo, ch: ch };
    return M[name];
  }

  // Saltmarsh by day: a rolling sea shanty
  T('saltmarsh', 138,
    '@1 v11 o5 d8 d8 f+8 a8 a4 f+4 | o5 g8 g8 b8 o6 d8 o5 b4 g4 | o5 a8 a8 o6 c+8 e8 e4 c+4 | o5 a8 g8 f+8 e8 d2 | o5 d8 f+8 a8 o6 d8 o5 b4 a4 | o5 g8 b8 o6 d8 g8 f+4 d4 | o5 a8 o6 c+8 e8 a8 g8 e8 c+4 | o5 d4 f+4 a4 d4',
    'o3 d4 a4 d4 a4 | o3 g4 o4 d4 o3 g4 o4 d4 | o3 a4 o4 e4 o3 a4 o4 e4 | o3 a4 a4 d2 | o3 d4 a4 d4 a4 | o3 g4 o4 d4 o3 g4 o4 d4 | o3 a4 o4 e4 o3 a4 o4 e4 | o3 d4 a4 d2',
    'l8 v8 [k h s h k h s h]8',
    '@1 v6 l8 [o4 d f+ a f+]16');

  // Saltmarsh at festival dusk: drums and a stomping dance
  T('festival', 152,
    '@2 v12 o5 e8 e8 e8 g8 a4 g8 e8 | o5 d8 d8 d8 f8 g4 f8 d8 | o5 c8 c8 c8 e8 f4 e8 c8 | o4 b8 o5 c8 d8 e8 e2 | o5 a8 a8 a8 o6 c8 o5 b4 a8 g8 | o5 g8 g8 g8 b8 o6 c4 o5 b8 g8 | o5 f8 a8 o6 c8 f8 e8 d8 c8 o5 a8 | o5 e2 e4 r4',
    'o3 e8 e8 o4 e8 o3 e8 e8 e8 o4 e8 o3 e8 | o3 d8 d8 o4 d8 o3 d8 d8 d8 o4 d8 o3 d8 | o3 c8 c8 o4 c8 o3 c8 c8 c8 o4 c8 o3 c8 | o3 e8 e8 o4 e8 o3 e8 b4 e4 | o3 a8 a8 o4 a8 o3 a8 a8 a8 o4 a8 o3 a8 | o3 g8 g8 o4 g8 o3 g8 g8 g8 o4 g8 o3 g8 | o3 f8 f8 o4 f8 o3 f8 c8 c8 o4 c8 o3 c8 | o3 e4 e4 e4 r4',
    'l8 v10 [k k s k k s s h]8',
    '@1 v7 l16 [o5 e g a g e g a g e g a g e g a g]8');

  // Saltmarsh after the festival, and at night: calm waves
  T('saltmarsh_calm', 84,
    '@1 v9 o5 d4 f+4 a2 | o5 g4 b4 o6 d2 | o5 a4 o6 c+4 e2 | o5 f+4 e4 d2 | o5 d4 f+4 a4 b4 | o6 d2 o5 b4 g4 | o5 a4 g4 f+4 e4 | o5 d1',
    'o3 d2 a2 | o3 g2 o4 d2 | o3 a2 o4 e2 | o3 f+2 a2 | o3 d2 f+2 | o3 g2 b2 | o3 a2 e2 | o3 d1',
    'v4 l8 [h r h r h r h r]8');
  M.saltmarsh_night = M.saltmarsh_calm;

  // Lighthouse Trading Co. and the cannery: polite, brass-bright, faintly wrong
  T('trading', 92,
    '@1 v9 o5 c4 r8 e-8 g4 r8 f+8 | o5 g4 r8 b-8 o6 c4 r8 o5 b8 | o5 a-4 r8 c8 e-4 r8 d8 | o5 c2 r2 | o5 c4 r8 e-8 g4 r8 f+8 | o5 g4 r8 b-8 o6 e-4 r8 d8 | o6 c4 o5 b4 a-4 g4 | o5 f+2 g2',
    'o3 c4 g4 c4 g4 | o3 c4 g4 f+4 g4 | o3 a-4 e-4 a-4 e-4 | o3 g4 d4 g2 | o3 c4 g4 c4 g4 | o3 c4 g4 f+4 g4 | o3 a-4 e-4 f4 g4 | o3 f+4 g4 c2',
    'v5 l8 [k r h r s r h r]8');

  // The Saltmarsh Light: wind and open air
  T('lighthouse', 96,
    '@2 v10 o5 e4 g4 b4 g4 | o5 a4 o6 c4 e4 c4 | o5 g4 b4 o6 d4 b4 | o5 e2 g2 | o5 c4 e4 g4 e4 | o5 f4 a4 o6 c4 a4 | o5 g4 f4 e4 d4 | o5 e1',
    'o3 e2 b2 | o3 a2 o4 e2 | o3 g2 o4 d2 | o3 e2 g2 | o3 c2 g2 | o3 f2 o4 c2 | o3 g2 b2 | o3 e1',
    'v4 l8 [h r r r h r r r]8',
    '@1 v5 l8 [o4 e b o5 e o4 b]8');

  // The Salted Gull: a fast fiddle jig
  T('tavern', 168,
    '@1 v11 o5 g8 a8 b8 a8 g8 e8 g8 a8 | o5 b8 o6 c8 d8 c8 o5 b8 a8 g4 | o5 g8 a8 b8 a8 g8 e8 d8 e8 | o5 g8 f+8 e8 d8 g4 r4 | o5 g8 a8 b8 a8 g8 e8 g8 a8 | o6 d8 e8 f+8 e8 d8 c8 o5 b4 | o6 c8 o5 b8 a8 g8 a8 b8 o6 c8 d8 | o5 g4 d4 g4 r4',
    'o3 g8 d8 g8 d8 g8 d8 g8 d8 | o3 g8 d8 g8 d8 e8 b8 e8 b8 | o3 g8 d8 g8 d8 c8 g8 c8 g8 | o3 d8 a8 d8 a8 g4 r4 | o3 g8 d8 g8 d8 g8 d8 g8 d8 | o3 b8 f+8 b8 f+8 e8 b8 e8 b8 | o3 c8 g8 c8 g8 d8 a8 d8 a8 | o3 g4 d4 g4 r4',
    'l8 v9 [k h s h k h s s]8');

  // Pier arcade: bright chiptune
  T('arcade', 158,
    '@2 v11 o6 c8 e8 g8 e8 c8 e8 g8 e8 | o5 b8 o6 d8 f8 d8 o5 b8 o6 d8 f8 d8 | o5 a8 o6 c8 e8 c8 o5 a8 o6 c8 e8 c8 | o5 g8 b8 o6 d8 b8 g4 r4 | o6 c8 e8 g8 o7 c8 o6 g8 e8 c8 e8 | o5 f8 a8 o6 c8 a8 f8 a8 o7 c8 o6 a8 | o5 g8 b8 o6 d8 g8 f8 d8 o5 b8 g8 | o6 c4 e4 c4 r4',
    'o3 c8 g8 c8 g8 c8 g8 c8 g8 | o3 g8 o4 d8 o3 g8 o4 d8 o3 g8 o4 d8 o3 g8 o4 d8 | o3 a8 o4 e8 o3 a8 o4 e8 o3 a8 o4 e8 o3 a8 o4 e8 | o3 g8 o4 d8 o3 g8 o4 d8 g4 r4 | o3 c8 g8 c8 g8 c8 g8 c8 g8 | o3 f8 o4 c8 o3 f8 o4 c8 o3 f8 o4 c8 o3 f8 o4 c8 | o3 g8 o4 d8 o3 g8 o4 d8 o3 g8 o4 d8 o3 g8 o4 d8 | o3 c4 g4 c4 r4',
    'l8 v8 [k h h h s h h h]8');

  // The aquarium: dreamy and slow
  T('aquarium', 76,
    '@1 v9 o5 e4 b4 o6 e2 | o5 d4 a4 o6 d2 | o5 c4 g4 o6 c2 | o5 b2 g2 | o5 e4 b4 o6 e2 | o6 f+4 e4 d4 o5 b4 | o5 a4 g4 f+4 e4 | o5 e1',
    'o3 e2 b2 | o3 d2 a2 | o3 c2 g2 | o3 g2 b2 | o3 e2 b2 | o3 d2 f+2 | o3 c2 e2 | o3 e1',
    'v3 l8 [h r r r r r r r]8',
    '@1 v4 l8 [o5 e g b g]16');

  // Gentle harbor interiors: inn, offices, homes
  T('harbor', 100,
    '@1 v9 o5 c4 e8 g8 e4 c4 | o5 f4 a8 o6 c8 o5 a4 f4 | o5 g4 b8 o6 d8 o5 b4 g4 | o5 c2 e2 | o5 c4 e8 g8 o6 c4 o5 g4 | o5 f4 a8 o6 c8 f4 c4 | o5 g8 f8 e8 d8 c4 d4 | o5 c1',
    'o3 c4 g4 c4 g4 | o3 f4 c4 f4 c4 | o3 g4 d4 g4 d4 | o3 c4 e4 g4 c4 | o3 c4 g4 c4 g4 | o3 f4 c4 f4 c4 | o3 g4 d4 g4 b4 | o3 c1',
    'v4 l8 [k r h r s r h r]8');

  // The ghost ship: cold, slow, and not quite alone
  T('ghost', 72,
    '@1 v8 o5 c4 r4 e-4 r4 | o5 f+4 r4 g4 r4 | o5 a-4 r4 g4 r4 | o5 e-2 c2 | o5 c4 r4 e-4 r4 | o5 g4 r4 b-4 r4 | o6 c4 o5 b4 a-4 f+4 | o5 g1',
    'o3 c2 f+2 | o3 c2 g2 | o3 a-2 e-2 | o3 c2 g2 | o3 c2 f+2 | o3 c2 g2 | o3 a-2 f+2 | o3 g1',
    'v3 l8 [h r r r r r r r]8');

  // Beacon Playhouse: an intense theatre-stage gym theme
  T('gym2', 172,
    '@2 v13 o5 a8 a8 o6 c8 e8 e8 d8 c8 o5 a8 | o5 g8 g8 b8 o6 d8 d8 c8 o5 b8 g8 | o5 f8 f8 a8 o6 c8 c8 o5 b8 a8 f8 | o5 e8 g+8 b8 o6 e8 e2 | o5 a8 o6 c8 e8 a8 g8 e8 c8 o5 a8 | o5 g8 b8 o6 d8 g8 f8 d8 o5 b8 g8 | o5 f8 a8 o6 c8 f8 e8 c8 o5 a8 f8 | o5 e8 e8 g+8 b8 o6 e4 r4',
    'l8 o3 [a a o4 a o3 a a a o4 a o3 a]1 [g g o4 g o3 g g g o4 g o3 g]1 [f f o4 f o3 f f f o4 f o3 f]1 [e e o4 e o3 e g+ g+ b b]1 [a a o4 a o3 a a a o4 a o3 a]1 [g g o4 g o3 g g g o4 g o3 g]1 [f f o4 f o3 f f f o4 f o3 f]1 [e e g+ g+ e4 r4]1',
    'l8 v11 [k k s k k s s s]8',
    '@1 v7 l16 [o5 a o6 c e c o5 a o6 c e c o5 g b o6 d b o5 g b o6 d b]8');

  // ---- more intense battles: faster, with a driving arpeggio layer and busier sixteenth-note drums ----
  var DRUMS = 'l16 v10 [k h k h s h k h k k s h s h k h]8';
  function punch(name, dTempo, arp) {
    var t = M[name];
    if (!t || t.punched) return;
    t.punched = true; t.tempo += dTempo;
    var i = t.ch.map(function (c) { return c.inst; }).indexOf('noise');
    var drums = { inst: 'noise', mml: DRUMS, vol: 0.9 };
    if (i >= 0) t.ch[i] = drums; else t.ch.push(drums);
    if (!t.ch.some(function (c) { return c.inst === 'pulse'; })) t.ch.push({ inst: 'pulse', mml: '@1 v6 l16 [' + arp + ']8', vol: 0.5 });
  }
  punch('wild', 14, 'o5 e g b g e g b g e g b g e g b g');
  punch('trainer', 16, 'o5 a o6 c e c o5 a o6 c e c o5 a o6 c e c o5 a o6 c e c');
  punch('gym', 16, 'o5 d f a f d f a f d f a f d f a f');
  punch('rival', 18, 'o5 e g+ b g+ e g+ b g+ e g+ b g+ e g+ b g+');
  punch('syndicate', 16, 'o5 c e- g e- c e- g e- c e- g e- c e- g e-');
  punch('legend', 12, 'o5 d f a f d f a f d f a f d f a f');
  punch('league', 14, 'o5 c e g e c e g e c e g e c e g e');
  punch('champion', 12, 'o5 a o6 c e c o5 a o6 c e c o5 a o6 c e c o5 a o6 c e c');
})();
