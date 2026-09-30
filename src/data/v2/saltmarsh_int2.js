// Saltmarsh interiors, part 2: Harbor Inn (two floors), harbor master, Lighthouse Trading Co. (office, warehouse, cellar),
// shipyard, fish market, cannery, homes, shops, the ghost ship and the pirate cove.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, S = PK.SCRIPTS;
  function g() { return PK.game; }
  function fest() { return !PK.quest.done('festival'); }
  function flag(f) { return function () { return g().flag(f); }; }
  function notFlag(f) { return function () { return !g().flag(f); }; }
  function room(id, name, theme, width, floorRows, o) {
    var wall = new Array(width + 1).join('W');
    return D(id, Object.assign({ name: name, interior: true, theme: theme, rows: [o.wall0 || wall, o.wall1 || wall].concat(floorRows) }, o));
  }
  var AF = 'festival_done';

  // =============== HARBOR INN ===============
  room('sm_inn', 'Harbor Inn', 'harborinn', 16, [
    '...............X', '................', '................', '................', '................', '................', '.......M........'
  ], {
    music: 'harbor', entry: [7, 8],
    warpsAt: [[15, 2, 'sm_inn2', 1, 3, 'down']],
    props: [
      ['window', 2, 1], ['window', 5, 1], ['clock', 8, 1], ['painting', 11, 1, { art: 'map', text: 'A map of the harbor with every wreck marked in red. There are a lot of red marks.' }],
      ['counter', 0, 2, { w: 4 }], ['shelfjars', 4, 2], ['lifering', 12, 1], ['fireplace', 9, 2], ['dining', 3, 5], ['dining', 11, 4], ['rug', 5, 4, { w: 4, h: 2, color: '#3a78b8' }],
      ['lantern', 6, 8], ['lantern', 9, 8], ['plant', 0, 8], ['plant', 15, 8], ['shipmodel', 13, 2]
    ],
    npcs: {
      portia: { at: [1, 3], sprite: 'innkeeper', dir: 'down', talk: 'sm_innkeeper' },
      guest1: { at: [4, 6], sprite: 'oldwoman', dir: 'right', text: 'I have stayed here every festival for thirty years. They always give me the room over the water. The fish visit at night.', textIf: [[AF, 'The festival is over but the fish still visit. I told them. They are staying another week.']] },
      guest2: { at: [12, 5], sprite: 'scholar', dir: 'left', text: 'I am writing a treatise on tide pools. The chapter on Constellarm is going very well. The chapter on the crowd noise is not.', textIf: [[AF, 'The chapter on the crowd noise is now a short one. Blessed silence.']] }
    }
  });
  room('sm_inn2', 'Harbor Inn: Rooms over the Water', 'harborinn', 16, [
    'X...............', '................', '................', '................', '................', '................'
  ], {
    music: 'harbor',
    warpsAt: [[0, 2, 'sm_inn', 14, 3, 'down']],
    props: [
      ['window', 3, 1], ['window', 8, 1], ['window', 12, 1], ['bed', 2, 4, { color: '#3a78b8' }], ['bed', 6, 4, { color: '#e870a0' }], ['bed', 7, 4, { color: '#e870a0' }], ['bed', 13, 4, { color: '#4ab890' }],
      ['desk', 10, 3, { text: 'A stack of forms from Lighthouse Trading Co. Every page has the same signature in a very curly hand.' }], ['plant', 0, 7], ['lantern', 15, 7],
      ['painting', 5, 1, { text: 'A painting of a lighthouse in a storm. Someone has drawn a tiny sailor waving from the balcony in the corner.' }], ['wardrobe', 15, 2]
    ],
    npcs: {
      newlywed1: { at: [4, 5], sprite: 'villager1', dir: 'right', text: 'We chose Saltmarsh for the romance. The lanterns, the sea, the music! Also there was a discount on the honeymoon suite.', textIf: [[AF, 'We are staying two extra weeks. Turns out the town is romantic when it is not on fire.']] },
      newlywed2: { at: [5, 5], sprite: 'villager3', dir: 'left', text: 'She said romantic. I said "there are a lot of crates on the pier". She said romantic. I said okay.', textIf: [[AF, 'She was right. It is romantic. I am going to say that to her right now.']] },
      accountant: { at: [11, 5], sprite: 'scholar', dir: 'down', talk: 'sm_accountant' },
      admiral: { at: [14, 6], sprite: 'oldman', dir: 'left', text: 'I retired as an admiral. I have no fleet. I have no ships. I have a very good room at the inn. Life is unpredictable.', textIf: [[AF, 'I was asked to lead the fireworks parade. I said yes. I am now technically in command of forty children with sparklers.']] }
    }
  });

  // =============== HARBOR MASTER ===============
  room('sm_harbormaster', "Harbor Master's Office", 'harborinn', 14, [
    '..............', '..............', '..............', '..............', '..............', '.....M........'
  ], {
    music: 'harbor', entry: [5, 7],
    props: [
      ['window', 2, 1], ['window', 6, 1], ['board', 9, 1, { w: 2, text: 'The job board. "Wanted: dockhands, Lighthouse Trading Co." "Lost: one lifeboat." "Found: one sock, possibly haunted."' }],
      ['desk', 1, 2, { w: 2 }], ['radio', 4, 2], ['signalpanel', 11, 2], ['trophycase', 12, 5, { text: 'The Golden Reel, a solid gold fishing reel awarded for the biggest catch of the festival. It has never been won fairly. Nobody will say why.' }],
      ['shipmodel', 6, 4], ['bell', 9, 4], ['lifering', 0, 6], ['plant', 13, 7], ['lantern', 3, 7]
    ],
    npcs: { tobias: { at: [3, 4], sprite: 'harbormaster', dir: 'down', talk: 'sm_tobias' } }
  });

  // =============== LIGHTHOUSE TRADING CO. ===============
  room('sm_trading', 'Lighthouse Trading Co.', 'lab', 16, [
    '...............X', '................', '................', '................', '................', '................', '......M.........'
  ], {
    music: 'trading', entry: [6, 8],
    warpsAt: [[15, 2, 'sm_warehouse', 8, 9, 'up']],
    props: [
      ['window', 2, 1], ['window', 5, 1], ['painting', 8, 1, { art: 'map', text: 'The company crest in gold: a lighthouse over an anchor. The motto beneath: "We Bring Everything Home."' }],
      ['ledgerdesk', 1, 2], ['ledgerdesk', 4, 2], ['counter', 10, 2, { w: 4 }], ['plant', 14, 3], ['bookcase', 8, 3, { text: 'Bound ledgers in navy cloth. All of them are perfectly aligned. That is unsettling.' }],
      ['fishcrate', 1, 5], ['fishcrate', 2, 5], ['fishcrate', 13, 6], ['rug', 5, 4, { w: 6, h: 2, color: '#243a5c' }], ['plant', 0, 8], ['plant', 15, 8], ['lantern', 3, 8], ['lantern', 12, 8]
    ],
    itemsAt: [],
    npcs: {
      vespa: { at: [11, 3], sprite: 'clerk', dir: 'down', talk: 'sm_vespa' },
      quill: { at: [7, 4], sprite: 'elder2', dir: 'down', cond: function () { return fest() && !g().flag('quill_gone'); }, talk: 'sm_quill_office' },
      clerk2: { at: [2, 4], sprite: 'dockhand', dir: 'right', text: 'Lighthouse Trading Co.: We Bring Everything Home. That is the motto. I say it fifty times a day. I say it in my sleep. My wife is alarmed.', textIf: [[AF, 'The company folded. I am now free to say things that are not the motto. Nice. Weird.']] }
    }
  });
  room('sm_warehouse', 'Trading Co. Warehouse', 'factory', 18, [
    '..................', '..................', '..................', '..................', '..................', '..................', '..................', '........M.........'
  ], {
    music: 'trading', entry: [8, 9], exit: { map: 'sm_trading', x: 14, y: 3 }, onEnter: 'sm_warehouse_enter', onStep: function (w, x, y) { return PK.SCRIPTS.sm_step(w, x, y); },
    props: [
      ['window', 3, 1], ['window', 12, 1], ['fishcrate', 1, 2], ['fishcrate', 2, 2], ['fishcrate', 3, 2], ['fishcrate', 1, 3], ['fishcrate', 5, 2], ['fishcrate', 14, 2], ['fishcrate', 15, 2], ['fishcrate', 16, 3],
      ['barrel', 6, 2], ['barrel', 7, 2], ['barrel', 11, 2], ['cannerybelt', 3, 5, { w: 4 }], ['ledgerdesk', 13, 6, { text: 'A shipping ledger. This week\'s entries: "Festival lanterns (assorted)", "Bunting (assorted)", and "Miscellaneous (see cellar)".' }],
      ['lantern', 9, 8], ['ropecoil', 15, 8], ['ropecoil', 0, 8]
    ],
    npcs: {
      foreman: { at: [9, 4], sprite: 'worker', dir: 'down', talk: 'sm_foreman' },
      hauler1: { at: [4, 7], sprite: 'dockhand', move: 'patrol', path: 'rrrrllll', pause: 6, text: 'Crate, crate, crate. I count them in my head. Last week I got to a hundred and forty and one of them moved.' },
      hauler2: { at: [13, 4], sprite: 'dockhand', dir: 'left', text: 'Do not ask about the cellar. I did not. My uncle did. He is fine. He is just very quiet now.' }
    }
  });
  // the cellar under the market and the cannery: cages of captured Kits and the Elder's private office
  room('sm_cellar', 'Under Saltmarsh: The Cellar', 'ghostship', 20, [
    '....................', '....................', '....................', '....................', '....................', '....................', '....................', '....................', '.........M..........'
  ], {
    music: 'mystery', entry: [9, 10], exit: { map: 'sm_cannery', x: 9, y: 3 }, onStep: function (w, x, y) { return PK.SCRIPTS.sm_step(w, x, y); },
    props: [
      ['pipes', 3, 1], ['pipes', 12, 1], ['fishcrate', 1, 2], ['fishcrate', 2, 2], ['fishcrate', 1, 3], ['barrel', 17, 2], ['barrel', 18, 2],
      ['ledgerdesk', 15, 8, { text: 'The Elder\'s real ledger. Every page: a Kit\'s name, a price, and a date. The last column reads "storm belt" over and over.' }],
      ['lantern', 5, 10], ['lantern', 14, 10], ['tank', 4, 6, { w: 2, text: 'A tank of murky water. Something sleeps at the bottom. It opens one big blue eye and closes it again.' }], ['tank', 13, 4, { w: 2, text: 'Empty. The glass has a long scratch down one side, from the inside.' }]
    ],
    itemsAt: [['pluscapsule', 2, 18, 6], ['hitonic', 1, 1, 9]],
    npcs: {
      guardA: { at: [6, 4], sprite: 'cinder', dir: 'right', keeper: 'sm_c1', sight: 4, cond: function () { return !g().flag('cellar_clear') && !PK.sm.sm().costume; } },
      guardB: { at: [12, 8], sprite: 'cinder2', dir: 'left', keeper: 'sm_c2', sight: 4, cond: function () { return !g().flag('cellar_clear') && !PK.sm.sm().costume; } },
      guardA2: { at: [6, 4], sprite: 'cinder', dir: 'right', cond: function () { return !g().flag('cellar_clear') && !!PK.sm.sm().costume; }, text: 'ACCORD CINDER: A troupe member in a sardine costume. Somebody in the parade took a wrong turn. Do not touch the cages, sardine.' },
      guardB2: { at: [12, 8], sprite: 'cinder2', dir: 'left', cond: function () { return !g().flag('cellar_clear') && !!PK.sm.sm().costume; }, text: 'ACCORD CINDER: Is that a glittery sardine? We have orders not to touch the parade. Move along, sardine.' },
      cages: { at: [10, 3], sprite: 'kit:52', noTurn: true, talk: 'sm_cages' },
      cageb: { at: [11, 3], sprite: 'kit:68', noTurn: true, talk: 'sm_cages' },
      cagec: { at: [9, 3], sprite: 'kit:65', noTurn: true, talk: 'sm_cages' }
    }
  });

  // =============== SHIPYARD ===============
  room('sm_shipyard', 'Saltmarsh Shipyard', 'yard', 18, [
    '..................', '..................', '..................', '..................', '..................', '..................', '..................', '........M.........'
  ], {
    music: 'harbor', entry: [8, 9],
    props: [
      ['window', 3, 1], ['window', 14, 1], ['boat', 1, 3, { w: 3, h: 2 }], ['float', 6, 3, { w: 3, h: 2, variant: 'fish' }], ['float', 10, 3, { w: 3, h: 2, variant: 'sun' }],
      ['workbench', 14, 5, { text: 'A workbench of half-carved oars, paint pots, and a very small paper boat that is somehow the pride of the yard.' }], ['workbench', 1, 6], ['anchor', 17, 3], ['ropecoil', 5, 6], ['barrel', 12, 7], ['barrel', 13, 7],
      ['lantern', 7, 8], ['lantern', 11, 8], ['crate', 16, 6, { text: 'A crate stenciled "FRAGILE: FISH FLOAT." The fish float is, in fact, extremely fragile.' }]
    ],
    itemsAt: [['swiftroot', 1, 16, 8]],
    npcs: {
      ondine: { at: [8, 6], sprite: 'worker', dir: 'up', talk: 'sm_shipwright' },
      apprentice1: { at: [4, 6], sprite: 'kid', dir: 'right', text: 'I paint the fish float. I have painted the same eye eleven times. It keeps looking surprised.', textIf: [[AF, 'The fish float has a new eye now. It looks content. I cried a little.']] },
      apprentice2: { at: [13, 6], sprite: 'crabber', dir: 'left', text: 'The keel is the backbone. The ribs are the ribs. The rest is glue and hope.' }
    }
  });

  // =============== FISH MARKET ===============
  room('sm_market', 'Saltmarsh Fish Market', 'market', 20, [
    '....................', '....................', '....................', '....................', '....................', '....................', '....................', '.........M..........'
  ], {
    music: 'harbor', entry: [9, 9],
    props: [
      ['window', 3, 1], ['window', 16, 1], ['bigtank', 1, 1, { w: 4, variant: 'reef' }], ['bigtank', 14, 1, { w: 4, variant: 'kelp' }],
      ['counter', 6, 2, { w: 6 }], ['fishcrate', 1, 4], ['fishcrate', 2, 4], ['fishcrate', 17, 4, { talk: 'sm_photo_market' }], ['fishcrate', 18, 4], ['barrel', 1, 6], ['barrel', 18, 6], ['netpile', 4, 6], ['netpile', 15, 6],
      ['lantern', 7, 9], ['lantern', 12, 9], ['banner', 9, 5, { color: '#3a78d8', icon: 'fish' }]
    ],
    itemsAt: [['seaglass', 1, 19, 7], ['covemap3', 1, 2, 7]],
    npcs: {
      monger1: { at: [7, 3], sprite: 'crabber', dir: 'down', talk: 'shop', stock: ['kelpcrisp', 'fishcake', 'shellbait', 'tonic', 'remedy'] },
      monger2: { at: [10, 3], sprite: 'oldwoman', dir: 'down', talk: 'shop', stock: ['chowder', 'grillskewer', 'minttea', 'sparkbait', 'glowbait'] },
      shopper1: { at: [5, 6], sprite: 'villager2', move: 'wander', text: 'Fresh fish! Fresher fish! The freshest fish, from this morning, from the boat, from the sea! It is very fresh!', textIf: [[AF, 'The prices dropped after the festival. I am buying eleven fish.']] },
      shopper2: { at: [14, 6], sprite: 'girl', dir: 'left', text: 'I sell shrimp. Do not ask me about the tin cans on the pier. Every can has a lighthouse on it and I have decided to have no opinion.', textIf: [[AF, 'I have an opinion now. It is not polite.']] },
      cat: { at: [9, 5], sprite: 'kit:65', move: 'wander', text: 'A Bilgekin is sitting on a fish crate. It is guarding the fish. It is also eating one. Both jobs, one cat.' }
    }
  });

  // =============== CANNERY ===============
  room('sm_cannery', 'Saltmarsh Cannery', 'factory', 18, [
    '.........X........', '..................', '..................', '..................', '..................', '..................', '..................', '........M.........'
  ], {
    music: 'trading', entry: [8, 9], onStep: function (w, x, y) { return PK.SCRIPTS.sm_step(w, x, y); },
    warpsAt: [[9, 2, 'sm_cellar', 9, 10, 'up']],
    props: [
      ['pipes', 3, 1], ['pipes', 12, 1], ['window', 6, 1], ['cannerybelt', 1, 3, { w: 4 }], ['cannerybelt', 1, 5, { w: 4 }], ['cannerypress', 7, 3], ['cannerypress', 10, 3],
      ['fishcrate', 14, 3], ['fishcrate', 15, 3], ['fishcrate', 14, 4], ['fishcrate', 16, 6], ['barrel', 0, 7], ['ledgerdesk', 13, 7, { text: 'The daily output sheet. Four hundred tins of chowder, fifty tins of sardines, and a line that just says: "Special: see cellar."' }],
      ['lantern', 6, 9], ['lantern', 11, 9]
    ],
    npcs: {
      canner1: { at: [5, 4], sprite: 'worker', dir: 'left', text: 'Tins, tins, tins. I stamp a lighthouse on every lid. I stopped noticing the lighthouse. Then I noticed it again. It is a bad time.', textIf: [[AF, 'The line is slower now. Fewer lighthouses. I miss them, honestly.']] },
      canner2: { at: [12, 5], sprite: 'crabber', dir: 'up', text: 'The stairs at the back are for staff only. Do not ask why the staff never come back up looking happy.', textIf: [[AF, 'The cellar stairs are unlocked. I walked down. It was a very sad room. I brought them sandwiches.']] },
      cellargate: { at: [9, 3], sprite: 'gate', noTurn: true, cond: notFlag('cellar_open'), talk: 'sm_cellar_gate' },
      canner3: { at: [16, 4], sprite: 'oldman', dir: 'left', text: 'Eleven years in this cannery and I have never seen the inside of the cellar. I have seen the outside of it plenty.' }
    }
  });

  // =============== HOMES ===============
  room('sm_home1', 'The Osric Family Home', 'home', 12, [
    '............', '............', '............', '............', '............', '.....M......'
  ], {
    music: 'harbor', entry: [5, 7],
    props: [
      ['window', 2, 1], ['window', 8, 1], ['stove', 0, 2], ['kettle', 1, 2], ['fridge', 10, 2], ['dining', 4, 3], ['couch', 9, 5], ['tv', 11, 4], ['rug', 3, 5, { w: 4, h: 1, color: '#3a78b8' }],
      ['shipmodel', 6, 2], ['plant', 0, 7], ['lifering', 5, 1]
    ],
    npcs: {
      osric: { at: [3, 4], sprite: 'fisher', dir: 'right', text: 'I have fished this bay for thirty years. The fish have been odd lately. Sparky. Nervous. Like they know something.', textIf: [[AF, 'The fish are calm again. I would like to think I had something to do with it. I did not. Thank you.']] },
      mira: { at: [6, 4], sprite: 'villager1', dir: 'left', text: 'Osric says the sea is talking. I say the sea has never said anything useful. Then it said "tide" and I had to admit it was right.', textIf: [[AF, 'The sea said "thank you" this morning. I checked. It was just the tide. But I like to think.']] },
      pip: { at: [8, 6], sprite: 'kid', move: 'wander', text: 'I found a sea glass that glows! I will not tell you where. It is my secret. It is behind the market. Oops.', textIf: [[AF, 'I found four more! I have told everyone where. I am a terrible secret keeper.']] }
    }
  });
  room('sm_home2', "Old Dahlia's Cottage", 'cottage', 12, [
    '............', '............', '............', '............', '............', '.....M......'
  ], {
    music: 'harbor', entry: [5, 7],
    props: [
      ['window', 3, 1], ['window', 7, 1], ['bed', 9, 2, { color: '#a88ad0' }], ['bookcase', 0, 2], ['table', 3, 3], ['candles', 5, 3], ['rug', 4, 5, { w: 3, h: 1, color: '#a88ad0' }], ['crystalball', 10, 4, { text: 'A crystal ball. Inside, tiny clouds move in a circle. You think one of them waved.' }], ['plant', 0, 7], ['painting', 6, 1, { text: 'A portrait of a young dancer in a feathered headdress. The signature says "D. Marlowe, opening night, 1st Great Catch."' }]
    ],
    npcs: {
      dahlia: { at: [6, 4], sprite: 'oldwoman', dir: 'down', text: 'I danced in the first Great Catch. Fifty years ago. I still know every step. My knees do not, but my heart does.', textIf: [[AF, 'They asked me to lead the last dance of the festival. I said yes. I only fell over once. Nobody noticed. Ha!']] },
      catkit: { at: [3, 6], sprite: 'kit:65', move: 'wander', text: 'A Bilgekin curled up on a rug. It wears a tiny scarf. It purrs, then stops, then purrs.' }
    }
  });
  room('sm_home3', 'The Glass Family Flat', 'bedroom', 12, [
    '............', '............', '............', '............', '............', '.....M......'
  ], {
    music: 'harbor', entry: [5, 7],
    props: [
      ['window', 2, 1], ['window', 8, 1], ['bed', 10, 2, { color: '#3a78b8' }], ['desk', 0, 2, { text: 'A desk covered in weather charts. The top sheet says "PLEASE STOP COUNTING LIGHTNING" in someone else\'s handwriting.' }], ['bookcase', 3, 2], ['computer', 1, 2], ['table', 5, 4, { w: 2 }], ['rug', 4, 5, { w: 4, h: 1, color: '#3a78b8' }], ['plant', 0, 7]
    ],
    npcs: {
      mrsglass: { at: [7, 3], sprite: 'oldwoman', dir: 'left', text: 'My husband is Dr. Halvard Glass, the weatherman. He is very brilliant and also completely unable to boil an egg. We balance.', textIf: [[AF, 'Halvard boiled an egg yesterday. I cried. I am so proud.']] },
      teen: { at: [4, 6], sprite: 'girl', dir: 'right', text: 'Dad thinks the storm is unusual. I think Dad thinks everything is unusual. Then he was right about the tide, and now nobody will let me tease him.' }
    }
  });

  // =============== SHOPS ===============
  room('sm_shop', 'Harbor Chandlery', 'shop', 12, ['............', '..cccccc....', '............', '............', '.....M......'], {
    music: 'shop', entry: [5, 6], wall1: 'WWWWWWWWWWWW',
    props: [['rope', 0, 2], ['lifering', 3, 1], ['window', 6, 1], ['crate', 10, 2, { icon: 'anchor' }], ['barrel', 11, 2], ['anchor', 11, 4], ['plant', 0, 5]],
    npcs: { clerk: { at: [4, 2], sprite: 'dockhand', dir: 'down', talk: 'shop', stock: ['capsule', 'pluscapsule', 'tonic', 'hitonic', 'remedy', 'hushspray', 'exitcord', 'smokepellet', 'boostcandy'] } }
  });
  room('sm_rodshop', "Reel & Tackle", 'shop', 12, ['............', '............', '............', '............', '.....M......'], {
    music: 'shop', entry: [5, 6],
    props: [['rodrack', 0, 2], ['rodrack', 2, 2], ['window', 5, 1], ['netpile', 9, 2], ['crate', 10, 4, { icon: 'fish' }], ['trophycase', 6, 2, { text: 'Photos of record catches. The biggest one is a Stormray, and the fisher in the photo looks less proud than terrified.' }], ['plant', 0, 5]],
    npcs: { reel: { at: [4, 3], sprite: 'angler', dir: 'down', talk: 'sm_reel' } }
  });
  room('sm_baitshop', 'The Bait Bucket', 'shop', 12, ['............', '............', '............', '............', '.....M......'], {
    music: 'shop', entry: [5, 6],
    props: [['tank', 0, 2, { w: 2 }], ['barrel', 3, 2], ['barrel', 4, 2], ['window', 6, 1], ['netpile', 9, 2], ['crate', 10, 4, { icon: 'fish' }], ['plant', 0, 5]],
    npcs: { baiter: { at: [4, 3], sprite: 'crabber', dir: 'down', talk: 'shop', stock: ['sparkbait', 'glowbait', 'shellbait', 'tonic', 'kittreat'] } }
  });
  room('sm_trader', "The Glass Trader's Shop", 'workshop', 12, ['............', '............', '............', '............', '.....M......'], {
    music: 'shop', entry: [5, 6],
    props: [['shelfjars', 1, 2], ['shelfjars', 3, 2], ['window', 6, 1], ['crystalball', 9, 2], ['candles', 10, 4], ['painting', 8, 1, { text: 'A painting of the sea at sunset, made entirely of tiny frosted glass shards. It glitters when you walk past.' }], ['plant', 0, 5]],
    npcs: { trader: { at: [5, 3], sprite: 'oldman', dir: 'down', talk: 'sm_trader' } }
  });

  // =============== THE GHOST SHIP (low tide only) ===============
  room('sm_ghost1', 'The Wreck: Lower Deck', 'ghostship', 18, [
    '.........X........', '..................', '..................', '..................', '..................', '..................', '........M.........'
  ], {
    music: 'ghost', entry: [8, 8], dark: true, onEnter: 'sm_ghost_enter',
    warpsAt: [[9, 2, 'sm_ghost2', 5, 6, 'up']],
    props: [
      ['lantern', 2, 3], ['lantern', 15, 3], ['barrel', 0, 2], ['barrel', 1, 2], ['crate', 16, 2], ['ropecoil', 8, 2], ['chest', 12, 5, { text: 'Empty. The lock has been open for a hundred years. There is a faint smell of salt and violets.' }],
      ['anchor', 17, 4]
    ],
    itemsAt: [['seaglass', 2, 3, 6], ['boostcandy', 1, 15, 6]],
    npcs: {
      lamp1: { at: [4, 5], sprite: 'kit:77', move: 'wander', text: 'A Wraithlamp bobs in the dark. It looks at you. It is a little sad. It follows you for three steps, then gets bored.' },
      hatch: { at: [9, 3], sprite: 'gate', noTurn: true, cond: notFlag('ghost_open'), text: 'A heavy hatch. Something rings faintly behind it, like a bell being pulled by a hand that is not there.' }
    },
    enc: { cave: [[77, 19, 21, 8], [69, 18, 20, 20], [65, 18, 20, 20], [73, 19, 20, 15], [60, 18, 20, 10]] }
  });
  room('sm_ghost2', 'The Wreck: Captain\'s Cabin', 'ghostship', 14, [
    '..............', '..............', '..............', '..............', '.....M........'
  ], {
    music: 'ghost', entry: [5, 6], dark: true, exit: { map: 'sm_ghost1', x: 9, y: 3 },
    props: [
      ['bed', 1, 2, { color: '#3a5a6a' }], ['desk', 6, 2, { text: 'A logbook, water-stained. Last entry: "The lamp will not go out. We tried. We are not sad. We are only very cold."' }], ['bell', 11, 2, { talk: 'sm_ghostbell' }],
      ['globe', 9, 2], ['chest', 12, 4], ['candles', 3, 4], ['painting', 4, 1, { text: 'A portrait of a captain with a lantern, and a dog. The dog looks exactly like a Bilgekin. It probably is.' }]
    ],
        npcs: {
      captain: { at: [7, 4], sprite: 'pirate', dir: 'left', talk: 'sm_ghostcaptain' }
    }
  });

  // =============== PIRATE COVE (reached by raft across the bay) ===============
  D('sm_cove', {
    name: 'Pirate Cove', theme: 'cave', music: 'cave', region: 'Windward Coast', dungeon: true,
    rows: [
      'WWWWWWWWWWWWWWWW',
      'WW............WW',
      'W..............W',
      'W..............W',
      'W..............W',
      'W..............W',
      'WW............WW',
      'WWW..........WWW',
      'WWWWWWWOWWWWWWWW'
    ],
    warpsAt: [[7, 8, 'saltmarsh', 56, 42, 'down']],
    props: [
      ['chest', 6, 2, { talk: 'sm_cove_chest' }], ['chest', 9, 2], ['barrel', 2, 2], ['barrel', 3, 2], ['anchor', 13, 3], ['lantern', 4, 5], ['lantern', 11, 5], ['ropecoil', 1, 5]
    ],
    itemsAt: [['pluscapsule', 3, 13, 6], ['boostcandy', 2, 2, 6]],
    npcs: {}
  });
})();
