// Keepers (trainers). team entries: [kitId, level, moves?, held?]
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var TR = {};
  function K(id, title, name, sprite, team, o) {
    TR[id] = Object.assign({ id: id, title: title, name: name, sprite: sprite, team: team, reward: 20, ai: 1 }, o || {});
  }
  // The sibling fished one of the other two flood Kits out of the river: the one strong against yours.
  function siblingStarter(st) { var p = st.flags.starter || 1; return p === 1 ? 4 : p === 4 ? 7 : 1; }
  function sibling(extra, starterLv, stage) {
    return function (st) { return extra.concat([[siblingStarter(st) + (stage || 0), starterLv]]); };
  }
  PK.siblingStarter = siblingStarter;

  // ---------- Brookhollow school (optional practice battles) ----------
  K('school_1', 'Pupil', 'Pip', 'kid', [[10, 3]], { reward: 10, noRematch: true, intro: 'Ms. Pell says practice battles are the best homework! Ready?', after: 'Next time I\'m going to win. Probably.' });
  K('school_2', 'Pupil', 'Juniper', 'kid2', [[10, 4], [10, 3]], { reward: 12, noRematch: true, intro: 'I\'ve got TWO Rushkin. Two is more than one. That\'s math!', after: 'Hmm. Maybe math isn\'t everything.' });

  // ---------- Sibling ----------
  K('sibling1', 'Sibling', '{RIVAL}', 'rival', sibling([], 6), { reward: 30, canLose: true, music: 'rival', ai: 1, lose: 'Huh. You actually got a hit in.', winText: 'Told you. Always one step ahead.' });

  // names used in dialogue (for the originality check)
  PK.EXTRA_NAMES = ['Lumora', 'Verdant Vale', 'Brookhollow', 'Willow Trail', 'Ashen Accord', 'Ines Vale', 'Hobb', 'Pell', 'Fenwick', 'Tomas', 'KitLog'];
  PK.TRAINERS = TR;
})();
