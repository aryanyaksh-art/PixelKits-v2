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

  // ---------- Willow Trail ----------
  K('willow_1', 'Rookie', 'Ellis', 'kid', [[15, 4], [15, 5]], { intro: 'I found these two in the reeds! They\'re basically rocks, but they\'re MY rocks!', after: 'Caddle evolve really fast, you know. Just wait!' });
  K('willow_2', 'Birdwatcher', 'Mae', 'birder', [[12, 5], [12, 6]], { intro: 'Shh! You\'ll scare the Kitefinch! ...Oh, fine, a quick battle.', after: 'Did you know Kitefinch can glide for an hour without flapping?' });
  K('willow_3', 'Angler', 'Rolf', 'fisher', [[22, 6]], { intro: 'Nothing\'s biting, so I might as well battle!', after: 'The water\'s too high for proper fishing. Talk to Jory, he\'s got ideas about that.' });
  K('willow_4', 'Hiker', 'Bram', 'hiker2', [[20, 7], [10, 6]], { intro: 'The road north is blocked, so I\'m training instead! Let\'s go!', after: 'An Acornet will defend its tree to the very end. Respect.' });
  K('willow_5', 'Scout', 'Tamsin', 'girl', [[18, 6], [12, 6]], { intro: 'Scouts are always prepared! Are you?', after: 'I should have packed more River Berries.' });
  K('willow_6', 'Treehouse Kid', 'Flint', 'kid', [[12, 7], [18, 7], [20, 8]], { reward: 60, noRematch: true, intro: 'HEY! This is my secret base! If you want in, you gotta beat me!', after: 'Okay, okay, you\'re in the club now. Don\'t tell anyone where the treehouse is!', lose: 'No fair! ...Fine. You\'re cool.' });
  // ---------- Ashen Accord ----------
  K('cinder_1', 'Accord Cinder', 'Grunt', 'cinder', [[24, 6], [10, 6]], { reward: 40, noRematch: true, music: 'syndicate', lose: 'What?! A village kid?' });
  K('cinder_2', 'Accord Cinder', 'Grunt', 'cinder2', [[15, 6], [24, 7]], { reward: 40, noRematch: true, music: 'syndicate', lose: 'The Elders won\'t like this...' });

  // ---------- Sibling ----------
  K('sibling1', 'Sibling', '{RIVAL}', 'rival', sibling([], 6), { reward: 30, canLose: true, music: 'rival', ai: 1, lose: 'Huh. You actually got a hit in.', winText: 'Told you. Always one step ahead.' });

  // names used in dialogue (for the originality check)
  PK.EXTRA_NAMES = ['Lumora', 'Verdant Vale', 'Brookhollow', 'Willow Trail', 'Ashen Accord', 'Ines Vale', 'Hobb', 'Pell', 'Fenwick', 'Tomas', 'KitLog'];
  PK.TRAINERS = TR;
})();
