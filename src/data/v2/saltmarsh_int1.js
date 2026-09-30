// Saltmarsh interiors, part 1: the Saltmarsh Light (five floors), the storm lab, costume workshop, The Salted Gull tavern,
// the pier arcade and the aquarium (three halls).
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, S = PK.SCRIPTS;
  function g() { return PK.game; }
  function fest() { return !PK.quest.done('festival'); }
  function room(id, name, theme, width, floorRows, o) {
    var wall = new Array(width + 1).join('W');
    return D(id, Object.assign({ name: name, interior: true, theme: theme, rows: [o.wall0 || wall, o.wall1 || wall].concat(floorRows) }, o));
  }
  var TT = { fest: 'festival_done' };

  // =============== THE SALTMARSH LIGHT ===============
  room('sm_light1', 'Saltmarsh Light: Keeper\'s Quarters', 'lightkeep', 12, [
    '...........X', '............', '............', '............', '............', '............', '.....M......'
  ], {
    music: 'lighthouse', entry: [5, 8],
    warpsAt: [[11, 2, 'sm_light2', 1, 3, 'down']],
    props: [
      ['window', 2, 1], ['window', 5, 1], ['clock', 8, 1, { text: 'A brass ship\'s clock, exactly eleven minutes fast. The keeper likes it that way.' }],
      ['stove', 0, 2], ['kettle', 1, 2], ['table', 3, 3, { w: 2 }], ['bookcase', 8, 2, { text: 'Logbooks for forty winters. Every entry ends the same: "Light kept. All well."' }],
      ['bed', 10, 4, { color: '#3a5a8a' }], ['radio', 7, 5], ['anchor', 0, 4], ['rug', 3, 5, { w: 4, h: 2, color: '#c8323a' }],
      ['trophycase', 6, 2, { text: 'Rescue medals, mostly. And one very old brass compass engraved with two names. One is Tull. The other has been scratched out.' }],
      ['lifering', 2, 6], ['plant', 11, 6]
    ],
    npcs: { keeper: { at: [5, 4], sprite: 'keeper', dir: 'down', talk: 'sm_keeper' } }
  });
  room('sm_light2', 'Saltmarsh Light: The Ship Gallery', 'lightkeep', 12, [
    'X...........', '............', '............', '............', '............', '...........X'
  ], {
    music: 'lighthouse',
    warpsAt: [[0, 2, 'sm_light1', 10, 3, 'down'], [11, 7, 'sm_light3', 1, 3, 'down']],
    props: [
      ['window', 3, 1], ['window', 8, 1], ['shipmodel', 2, 3], ['shipmodel', 5, 2], ['shipmodel', 9, 3], ['shipmodel', 3, 5], ['shipmodel', 7, 5],
      ['starmap', 6, 1], ['painting', 10, 1, { art: 'map', text: 'A chart of the whole Windward Coast in faded ink. Somewhere in the storm belt to the north, someone has drawn a small, wobbly island.' }],
      ['globe', 11, 3], ['plant', 0, 6]
    ],
    npcs: {
      visitor: { at: [3, 4], sprite: 'villager1', dir: 'right', text: 'I came for the view. I stayed for the ships. I have named them all. That one is Gerald.', textIf: [[TT.fest, 'Nobody comes to the gallery now the festival is over. I like it. Gerald likes it too.']] },
      guide: { at: [8, 4], sprite: 'oldman', dir: 'left', text: 'The Gull and Sun, first vessel of the Saltmarsh fleet. Built by hand, launched by accident, sailed for forty years. She only sank twice.', textIf: [[TT.fest, 'Forty years of sailing, two sinkings, and a fleet named after her. Not bad for a boat.']] }
    }
  });
  room('sm_light3', 'Saltmarsh Light: Signal Station', 'lightkeep', 12, [
    'X...........', '............', '............', '............', '............', '...........X'
  ], {
    music: 'lighthouse',
    warpsAt: [[0, 2, 'sm_light2', 10, 6, 'down'], [11, 7, 'sm_light4', 1, 3, 'down']],
    props: [
      ['window', 3, 1], ['window', 7, 1], ['signalpanel', 2, 2], ['signalpanel', 6, 2], ['radio', 9, 2], ['desk', 10, 3, { text: 'A signal log. The last entry, written this morning: "Night ferry again. No lights. No name."' }],
      ['bell', 5, 5, { text: 'A brass fog bell on a bracket. One pull and the whole harbor hears it.' }], ['chest', 1, 5], ['plant', 0, 6]
    ],
    npcs: {
      signalman: { at: [4, 4], sprite: 'weatherman', dir: 'up', talk: 'sm_signalman' }
    }
  });
  room('sm_light4', 'Saltmarsh Light: The Lens Room', 'lightkeep', 12, [
    'X...........', '............', '............', '............', '............', '...........X'
  ], {
    music: 'lighthouse',
    warpsAt: [[0, 2, 'sm_light3', 10, 6, 'down'], [11, 7, 'sm_light5', 10, 9, 'up']],
    props: [
      ['window', 2, 1], ['window', 4, 1], ['window', 8, 1], ['window', 10, 1],
      ['lens', 5, 3, { text: 'The great lens. It is warm to the touch and very, very bright. You are not supposed to look straight at it. You look straight at it.' }], ['candles', 3, 2], ['workbench', 9, 5, { text: 'Lens polish, tiny screwdrivers, and a hand-written sign: "Do not sneeze on the prisms."' }], ['plant', 0, 6]
    ],
    npcs: { polisher: { at: [8, 4], sprite: 'villager3', dir: 'left', text: 'Four hundred and twelve prisms. I dust every one. It takes six hours and I love it more than anything.', textIf: [[TT.fest, 'Four hundred and twelve prisms. The Elder\'s crates never touched a single one. I am very happy.']] } }
  });
  // the balcony: a platform above the sea, with the telescope
  D('sm_light5', {
    name: 'Saltmarsh Light: Balcony', theme: 'coast', music: 'lighthouse', region: 'Windward Coast', dungeon: true,
    rows: [
      '~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~',
      '~~~~~~ffffffff~~~~~~',
      '~~~~~~fNNNNNNf~~~~~~',
      '~~~~~~fNNNNNNf~~~~~~',
      '~~~~~~fNNNNNNf~~~~~~',
      '~~~~~~fNNNNNNf~~~~~~',
      '~~~~~~fNNNNNNf~~~~~~',
      '~~~~~~ffffXfff~~~~~~',
      '~~~~~~~~~~~~~~~~~~~~'
    ],
    warpsAt: [[10, 10, 'sm_light4', 10, 6, 'down']],
    props: [
      ['telescope', 10, 6, { talk: 'sm_scope_light' }], ['lantern', 7, 5], ['lantern', 12, 5], ['barrel', 12, 8]
    ],
    npcs: {
      quilltop: { at: [10, 6], sprite: 'elder2', dir: 'down', cond: function () { return PK.quest.at('festival', 'quill') && !g().flag('quill_gone'); }, talk: 'sm_quill_top' }
    },
    edges: {}
  });

  // =============== STORM RESEARCH LAB ===============
  room('sm_lab', 'Storm Research Lab', 'lab', 16, [
    '................', '................', '................', '................', '................', '................', '................', '......M.........'
  ], {
    music: 'lab', entry: [6, 9],
    props: [
      ['window', 2, 1], ['window', 6, 1], ['computer', 9, 2], ['computer', 11, 2], ['board', 13, 1, { w: 2, text: 'A weather map covered in pins. All the pins in the north are red. All of them.' }],
      ['tank', 1, 2, { w: 2, text: 'A stormcloud in a tank. It rumbles, then rains on a tiny plastic town. The town looks worried.' }],
      ['microscope', 4, 3], ['pc', 14, 2], ['plant', 0, 8], ['desk', 12, 5, { text: 'Storm logs. The belt north of the harbor has grown a mile a day for a month. Every note is underlined twice.' }],
      ['lantern', 9, 8], ['bookcase', 7, 5, { text: 'Books on pressure systems, wave patterns, and one hopeful paperback titled "So You Want to Chase a Tempest".' }]
    ],
    npcs: {
      halvard: { at: [7, 4], sprite: 'weatherman', dir: 'down', talk: 'sm_halvard' },
      assistant: { at: [3, 6], sprite: 'girl', dir: 'right', text: 'I count lightning. Nine strikes an hour, up from two. Dr. Glass says I should stop counting. I cannot stop counting.', textIf: [[TT.fest, 'The count dropped to two an hour after the festival. Dr. Glass is buying me a cake.']] }
    }
  });

  // =============== COSTUME WORKSHOP ===============
  room('sm_costume', 'Thimble & Thread Costume Workshop', 'theatre', 14, [
    '..............', '..............', '..............', '..............', '..............', '..............', '.....M........'
  ], {
    music: 'shop', entry: [5, 8],
    props: [
      ['window', 2, 1], ['window', 5, 1], ['stagecurtain', 8, 1, { w: 3 }], ['costumerack', 0, 2], ['costumerack', 3, 2], ['mannequin', 6, 2, { color: '#e83a8a' }], ['mannequin', 7, 3, { color: '#3a8ae0' }],
      ['sewingmachine', 10, 3], ['sewingmachine', 11, 3], ['fabricbolts', 13, 3], ['fabricbolts', 13, 5],
      ['table', 3, 5, { w: 2, text: 'A cutting table strewn with patterns: crab claws, gull wings, and one enormous sardine.' }], ['mirror', 9, 6, { variant: '0', text: 'A tall dressing mirror. You look like someone who is about to try on a gull costume.' }], ['plant', 0, 8]
    ],
    npcs: {
      seam: { at: [8, 5], sprite: 'seamstress', dir: 'left', talk: 'sm_seam' },
      model1: { at: [5, 4], sprite: 'dancer2', move: 'dance', beat: 2, cond: fest, text: 'Do not look at the hem. The hem is not ready. The hem is never ready.' },
      model2: { at: [11, 6], sprite: 'dancer3', dir: 'up', text: 'The wig is itchy. The feathers are itchy. I think I am itchy.', textIf: [[TT.fest, 'Now that the festival is over I am just an itchy person again.']] }
    }
  });

  // =============== THE SALTED GULL (tavern) ===============
  room('sm_tavern', 'The Salted Gull', 'tavern', 16, [
    '................', '................', '................', '................', '................', '................', '................', '.......M........'
  ], {
    music: 'tavern', entry: [7, 9],
    props: [
      ['window', 2, 1], ['window', 12, 1], ['hangsign', 7, 1, { icon: 'anchor', text: 'THE SALTED GULL. Est. before anyone wrote it down.' }],
      ['counter', 0, 2, { w: 6 }], ['shelfjars', 6, 2], ['barrel', 0, 4], ['barrel', 1, 4], ['stove', 14, 2], ['clock', 10, 1],
      ['table', 3, 5, { w: 2 }], ['table', 7, 4, { w: 2 }], ['table', 11, 6, { w: 2 }], ['dining', 3, 7], ['dining', 12, 4],
      ['drumkit', 12, 2, { text: 'A drum kit painted with waves. The bass drum has a gull on it.' }], ['festivaldrum', 14, 4], ['rug', 6, 7, { w: 4, h: 1, color: '#8a2e36' }], ['lantern', 5, 8], ['lantern', 10, 8],
      ['shipmodel', 8, 2], ['plant', 15, 8]
    ],
    npcs: {
      nan: { at: [2, 3], sprite: 'tavernkeep', dir: 'down', talk: 'sm_nan' },
      junie: { at: [4, 6], sprite: 'journalist', dir: 'right', talk: 'sm_junie' },
      fiddler: { at: [13, 3], sprite: 'fiddler', move: 'dance', beat: 2, text: 'Play it loud, play it fast, play it until the mugs rattle!', textIf: [[TT.fest, 'Slow songs this week. The mugs need the rest.']] },
      singer: { at: [12, 5], sprite: 'singer', move: 'dance', beat: 6, text: '"Oh the tide comes in and the tide goes out and nobody knows what it is about..."', textIf: [[TT.fest, '"Oh the festival ended and the crates all went home..." I am still working on the second verse.']] },
      drummer: { at: [14, 5], sprite: 'drummer', move: 'dance', beat: 0, text: 'BOOM. BOOM. Did you hear that? That was an entire song.' },
      sailorA: { at: [8, 6], sprite: 'sailor', dir: 'left', talk: 'sm_rumor1' },
      sailorB: { at: [10, 4], sprite: 'pirate', dir: 'down', talk: 'sm_rumor2' },
      gambler: { at: [1, 6], sprite: 'hiker', dir: 'right', talk: 'sm_battletable' },
      cook: { at: [6, 2], sprite: 'cook', dir: 'down', talk: 'shop', stock: ['chowder', 'grillskewer', 'minttea', 'fishcake'] },
      sibT: { at: [1, 8], sprite: 'rival', dir: 'up', cond: function () { return PK.quest.past('festival', 'keeper') && !g().flag('sib_met_sm') && !PK.quest.done('festival'); }, talk: 'sm_sibling_tavern' }
    }
  });

  // =============== PIER ARCADE ===============
  room('sm_arcade', 'Pier Arcade', 'arcadefun', 14, [
    '..............', '..............', '..............', '..............', '..............', '..............', '.....M........'
  ], {
    music: 'arcade', entry: [5, 8],
    props: [
      ['cabinet', 1, 2, { color: '#5a3aa0' }], ['cabinet', 2, 2, { color: '#3a6ac8' }], ['cabinet', 3, 2, { color: '#c83a8a' }], ['cabinet', 4, 2, { color: '#3aa878' }],
      ['clawmachine', 7, 2, { talk: 'sm_claw' }], ['strengthtest', 11, 2, { talk: 'sm_strength' }], ['ringtoss', 1, 5, { talk: 'sm_ringtoss' }], ['shellgame', 4, 5, { talk: 'sm_shellgame' }],
      ['cabinet', 7, 5, { color: '#e87a30' }], ['cabinet', 9, 5, { color: '#5a3aa0' }], ['rug', 5, 7, { w: 4, h: 1, color: '#e85a8a' }], ['hangsign', 6, 1, { icon: 'star', text: 'SHELL TOKENS: three plays for one clam. Prizes at the back.' }], ['plant', 13, 8]
    ],
    npcs: {
      clerk: { at: [12, 6], sprite: 'clerk', dir: 'left', talk: 'sm_arcade_clerk' },
      kid1: { at: [2, 3], sprite: 'kid', dir: 'up', text: 'The Rhythm Cabinet is broken. It eats tokens and yells "TOO EARLY". I keep feeding it.', textIf: [[TT.fest, 'The Rhythm Cabinet was fixed. It yells "TOO LATE" now. Progress!']] },
      kid2: { at: [10, 3], sprite: 'kid2', dir: 'left', text: 'I got the strength test bell exactly once. Then it forgot how. It is a proud bell.' }
    }
  });

  // =============== AQUARIUM: three halls ===============
  room('sm_aquarium', 'Saltmarsh Aquarium: Reef Hall', 'aqua', 18, [
    '.................X', '..................', '..................', '..................', '..................', '..................', '..................', '........M.........'
  ], {
    music: 'aquarium', entry: [8, 9],
    warpsAt: [[17, 2, 'sm_aq2', 1, 3, 'down']],
    props: [
      ['bigtank', 0, 1, { w: 4, h: 2, variant: 'reef' }], ['bigtank', 5, 1, { w: 4, h: 2, variant: 'kelp' }], ['bigtank', 10, 1, { w: 4, h: 2, variant: 'jelly' }],
      ['touchpool', 2, 5, { w: 3, h: 2 }], ['cushion', 9, 5], ['hangsign', 15, 1, { icon: 'fish', text: 'REEF HALL: 40 species, one very rude crab.' }],
      ['plant', 0, 9], ['plant', 17, 9], ['banner', 12, 5, { color: '#3a9ab8', icon: 'fish' }]
    ],
    npcs: {
      curator: { at: [6, 4], sprite: 'curator', dir: 'down', talk: 'sm_curator' },
      kid: { at: [3, 4], sprite: 'kid2', dir: 'down', text: 'The starfish are asleep. The lady says it is rude to wake them. I am being very polite.', textIf: [[TT.fest, 'The starfish woke up! They are rude. I love them.']] },
      dad: { at: [11, 5], sprite: 'oldman', dir: 'up', text: 'Forty species and my son wants to look at the crab. Every time. Every single time.' },
      guide: { at: [14, 6], sprite: 'girl', move: 'wander', text: 'Reef Hall is home to the Twinklearm pool. If you visit at night, their arms glow like a little sky. It is my favorite thing in the world.' }
    }
  });
  room('sm_aq2', 'Saltmarsh Aquarium: Deep Hall', 'aqua', 18, [
    'X.................', '..................', '..................', '..................', '..................', '.................X'
  ], {
    music: 'aquarium',
    warpsAt: [[0, 2, 'sm_aquarium', 16, 3, 'down'], [17, 7, 'sm_aq3', 1, 3, 'down']],
    props: [
      ['bigtank', 1, 1, { w: 4, h: 2, variant: 'deep' }], ['bigtank', 6, 1, { w: 4, h: 2, variant: 'deep' }], ['bigtank', 11, 1, { w: 4, h: 2, variant: 'jelly' }],
      ['shipmodel', 2, 4], ['starmap', 8, 4], ['hangsign', 14, 4, { icon: 'eye', text: 'DEEP HALL: the tanks are dark on purpose. The residents are shy. Please do not tap the glass.' }],
      ['plant', 0, 6], ['plant', 17, 5]
    ],
    npcs: {
      guardian: { at: [12, 6], sprite: 'crabber', dir: 'left', text: 'The back hall is closed for renovations. The curator says so. The sign says so. The lock says so, in a very firm voice.', textIf: [[TT.fest, 'The back hall is open now. Careful with the lights. They are old.']] },
      visitor: { at: [7, 5], sprite: 'villager3', dir: 'up', text: 'That one in the big tank is a Stormray. Watch its wings. When it flickers, the whole tank hums.' }
    }
  });
  room('sm_aq3', 'Saltmarsh Aquarium: Back Halls', 'aqua', 18, [
    'X.................', '..................', '..................', '..................', '..................', '..................', '..................'
  ], {
    music: 'mystery',
    warpsAt: [[0, 2, 'sm_aq2', 16, 7, 'down']],
    props: [
      ['bigtank', 3, 1, { w: 4, h: 2, variant: 'deep' }], ['cannerypress', 12, 2], ['fishcrate', 9, 3, { talk: 'sm_photo_aq' }], ['fishcrate', 10, 3], ['fishcrate', 9, 4], ['ledgerdesk', 13, 6, { text: 'A ledger with two sets of numbers. The lower set has a small lighthouse stamped at the top of every page.' }],
      ['barrel', 1, 6], ['ropecoil', 6, 7], ['lantern', 15, 3]
    ],
    itemsAt: [['hitonic', 1, 16, 8]],
    npcs: {
      empty: { at: [4, 5], sprite: 'kid', dir: 'down', text: 'I was hiding from my mom. I found a room full of empty cages and a lot of feathers. Everyone tells me I was not supposed to see that.' }
    }
  });
})();
