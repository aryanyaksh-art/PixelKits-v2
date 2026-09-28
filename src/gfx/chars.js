// Overworld character sprites (16x22, GBA-era proportions) built from original layered templates.
// Layers: body + head + hair/hat. Fills only; a dark outline is added automatically.
(function () {
  'use strict';
  var PK = window.PK;
  var CW = 16, CH = 22;

  // letters: s skin, S skin shade, e eye, w white, h hair, H hair shade, b hat, B hat shade,
  // c shirt, C shirt shade, a accent (strap/belt/scarf), p pants, P pants shade, f shoes, k bag
  var HEAD = {
    down: [
      '................', '................', '.....ssssss.....', '....ssssssss....', '...ssssssssss...', '...ssssssssss...',
      '...ssessssess...', '...ssessssess...', '...SsssssssssS..', '....SssssssS....'
    ],
    up: [
      '................', '................', '.....ssssss.....', '....ssssssss....', '...ssssssssss...', '...ssssssssss...',
      '...ssssssssss...', '...ssssssssss...', '...SssssssssS...', '....SSSSSSSS....'
    ],
    side: [
      '................', '................', '.....ssssss.....', '....ssssssss....', '....sssssssss...', '....sssssssss...',
      '....ssssssesss..', '....ssssssesss..', '....Sssssssss...', '.....SSssssS....'
    ]
  };
  // hair / hat overlays over the head rows (10 rows; long hair continues onto the shoulders)
  var HAIR = {
    short: {
      down: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhHhhhhHhhh..', '..hh........hh..', '..h..........h..'],
      up: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...hhhhhhhhhh...', '...HhhhhhhhhH...'],
      side: ['................', '....hhhhhhh.....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhHhhh...', '..hhhhhh........', '..hhhhh.........', '...hhh..........']
    },
    cap: {
      down: ['................', '....bbbbbbbb....', '...bbbbwwbbbb...', '..bbbbbwwbbbbb..', '..BBBBBBBBBBBB..', '..hh........hh..', '..h..........h..'],
      up: ['................', '....bbbbbbbb....', '...bbbbbbbbbb...', '..bbbbbbbbbbbb..', '..BbbbbbbbbbbB..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...hhhhhhhhhh...', '...HhhhhhhhhH...'],
      side: ['................', '....bbbbbbb.....', '...bbbbbwwbb....', '..bbbbbbbbbbb...', '..hhhBBBBBBBBBB.', '..hhhhhh........', '..hhhhh.........', '...hhh..........']
    },
    long: {
      down: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhH....Hhhh..', '..hh........hh..', '..hh........hh..', '..hh........hh..', '..hhh......hhh..', '..hh........hh..', '..hh........hh..'],
      up: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...HhhhhhhhhH...'],
      side: ['................', '....hhhhhhh.....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhHhhh...', '..hhhhhh........', '..hhhhh.........', '..hhhhh.........', '..hhhhh.........', '..hhhhh.........', '..hhhh..........', '..hhhh..........']
    },
    spiky: {
      down: ['...h..hh..h..h..', '..hhhhhhhhhhhh..', '.hhhhhhhhhhhhhh.', '..hhhhhhhhhhhh..', '.hhhHhhhhhHhhhh.', '..hh........hh..', '..h..........h..'],
      up: ['...h..hh..h..h..', '..hhhhhhhhhhhh..', '.hhhhhhhhhhhhhh.', '..hhhhhhhhhhhh..', '.hhhhhhhhhhhhhh.', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...hhhhhhhhhh...', '...HhhhhhhhhH...'],
      side: ['....h..h..h.....', '...hhhhhhhhh....', '..hhhhhhhhhhhh..', '.hhhhhhhhhhhhh..', '..hhhhhhhHhhhh..', '.hhhhhhh........', '..hhhhh.........', '...hhh..........']
    },
    bald: {
      down: ['................', '................', '................', '................', '................', '..hh........hh..', '..hh........hh..'],
      up: ['................', '................', '................', '................', '................', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...hhhhhhhhhh...'],
      side: ['................', '................', '................', '................', '................', '...hhhh.........', '...hhhh.........', '....hh..........']
    },
    bun: {
      down: ['.....hhhhhh.....', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhHhhhhHhhh..', '..hh........hh..', '..h..........h..'],
      up: ['.....hhhhhh.....', '....hhHHHHhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...hhhhhhhhhh...', '...HhhhhhhhhH...'],
      side: ['..hhh...........', '.hhhhhhhhhh.....', '..hhhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhHhhh...', '..hhhhhh........', '..hhhhh.........', '...hhh..........']
    },
    ponytail: {
      down: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhHhhhhhhHhh..', '..hh........hh..', '..h..........h..'],
      up: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...hhhhhhhhhh...', '...HhhhhhhhhH...', '......hhhh......', '......hhhh......', '.......HH.......'],
      side: ['................', '....hhhhhhh.....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', 'hhhhhhhhhHhhh...', 'hhhhhhhh........', '.hhhhhh.........', '..hhh...........']
    },
    curly: {
      down: ['...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '.hhhhhhhhhhhhhh.', '.hhhHhhhhhhHhhh.', '.hhhhhhhhhhhhhh.', '.hhh........hhh.', '.hh..........hh.', '..h..........h..'],
      up: ['...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '.hhhhhhhhhhhhhh.', '.hhhhhhhhhhhhhh.', '.hhhhhhhhhhhhhh.', '.hhhhhhhhhhhhhh.', '.hhhhhhhhhhhhhh.', '..hhhhhhhhhhhh..', '...HhhhhhhhhH...'],
      side: ['...hhhhhhhh.....', '..hhhhhhhhhhh...', '.hhhhhhhhhhhhh..', '.hhhhhhhhhhhhh..', '.hhhhhhhhHhhh...', '.hhhhhhh........', '.hhhhhh.........', '..hhhh..........']
    },
    swept: {
      down: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhHh....', '..hhhhhh....hh..', '..h..........h..'],
      up: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '...hhhhhhhhhh...', '...HhhhhhhhhH...'],
      side: ['................', '....hhhhhhh.....', '...hhhhhhhhhh...', '..hhhhhhhhhhhhh.', '..hhhhhhhhhhh...', '..hhhhhh........', '..hhhhh.........', '...hhh..........']
    },
    braids: {
      down: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhHhhhhHhhh..', '..hh........hh..', '..hh........hh..', '..H..........H..', '..h..........h..', '..H..........H..', '..h..........h..'],
      up: ['................', '....hhhhhhhh....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..hhhhhhhhhhhh..', '..HhhhhhhhhhhH..', '..h..........h..', '..H..........H..', '..h..........h..'],
      side: ['................', '....hhhhhhh.....', '...hhhhhhhhhh...', '..hhhhhhhhhhhh..', '..hhhhhhhHhhh...', '..hhhhhh........', '..hhhhh.........', '...hh...........', '...Hh...........', '...hh...........']
    },
    hood: {
      down: ['.....bbbbbb.....', '....bbbbbbbb....', '...bbbbbbbbbb...', '..bbbbbbbbbbbb..', '..bbbhhhhhhbbb..', '..bbh......hbb..', '..bb........bb..', '..bb........bb..', '..BB........BB..'],
      up: ['.....bbbbbb.....', '....bbbbbbbb....', '...bbbbbbbbbb...', '..bbbbbbbbbbbb..', '..bbbbbbbbbbbb..', '..bbbbbbbbbbbb..', '..bbbbbbbbbbbb..', '..bbbbbbbbbbbb..', '..BBBBBBBBBBBB..'],
      side: ['.....bbbbbb.....', '....bbbbbbbbb...', '...bbbbbbbbbbb..', '..bbbbbbbbbbbb..', '..bbbbbbbhhhbb..', '..bbbbbb........', '..bbbbb.........', '..bbbbb.........', '..BBBB..........']
    }
  };
  // hats drawn over any hairstyle
  var HATS = {
    cap: {
      down: ['................', '....bbbbbbbb....', '...bbbbwwbbbb...', '..bbbbbwwbbbbb..', '..BBBBBBBBBBBB..'],
      up: ['................', '....bbbbbbbb....', '...bbbbbbbbbb...', '..bbbbbbbbbbbb..', '..BbbbbbbbbbbB..'],
      side: ['................', '....bbbbbbb.....', '...bbbbbwwbb....', '..bbbbbbbbbbb...', '..hhhBBBBBBBBBB.']
    },
    beanie: {
      down: ['.....bbbbbb.....', '....bbbbbbbb....', '...bbbbbbbbbb...', '..bbbbbbbbbbbb..', '..BwBwBwBwBwBB..'],
      up: ['.....bbbbbb.....', '....bbbbbbbb....', '...bbbbbbbbbb...', '..bbbbbbbbbbbb..', '..BwBwBwBwBwBB..'],
      side: ['.....bbbbb......', '....bbbbbbbb....', '...bbbbbbbbbb...', '..bbbbbbbbbbb...', '..BwBwBwBwBB....']
    }
  };
  // bodies: rows 10..21 (12 rows). frames: stand, walk
  var BODY = {
    down: [
      ['....cccccccc....', '...ccccccccccc..', '..cccccccccccCc.', '..ccccccccccCCc.', '..sccccccccCCCs.', '..saaaaaaaaaaas.', '...ppppppppppP..', '...pppppppppPP..', '...ppppPPpppPP..', '...pppP..pppPP..', '...fff....fff...', '................'],
      ['....cccccccc....', '...ccccccccccc..', '..cccccccccccCc.', '..ccccccccccCCc.', '..sccccccccCCCs.', '..saaaaaaaaaaas.', '...ppppppppppP..', '...pppppppppPP..', '...ppppPP.pppP..', '...fffP...pppP..', '..........fff...', '................']
    ],
    up: [
      ['....cccccccc....', '...ccccccccccc..', '..cccccccccccCc.', '..ccckkkkkkccCc.', '..scckkkkkkccCs.', '..sCckkkkkkcCCs.', '...ppppppppppP..', '...pppppppppPP..', '...ppppPPpppPP..', '...pppP..pppPP..', '...fff....fff...', '................'],
      ['....cccccccc....', '...ccccccccccc..', '..cccccccccccCc.', '..ccckkkkkkccCc.', '..scckkkkkkccCs.', '..sCckkkkkkcCCs.', '...ppppppppppP..', '...pppppppppPP..', '...pppP.PPpppP..', '...pppP...fffP..', '...fff..........', '................']
    ],
    side: [
      ['.....cccccc.....', '....ccccccccc...', '....ccccccccc...', '....ckkcccccC...', '....ckkcsccCC...', '....kkaaaaaaa...', '.....pppppPP....', '.....pppppPP....', '.....pppppPP....', '.....ppppPP.....', '.....fffff......', '................'],
      ['.....cccccc.....', '....ccccccccc...', '...cccccccccC...', '...sckkcccccC...', '....ckkccccCs...', '....ckkcccCC....', '.....pppppPP....', '....ppppPPPP....', '...pppP..pPPP...', '...ppP....pPP...', '..fff.....fff...', '................']
    ]
  };
  // skirt / robe variants for some characters
  var DRESS = {
    down: ['...cccccccccCC..', '...cccccccccCC..', '..ccccccccccCCC.', '..cccccccccCCCC.', '...ss......ss...', '...ff......ff...', '................'],
    up: ['...cccccccccCC..', '...cccccccccCC..', '..ccccccccccCCC.', '..cccccccccCCCC.', '...ss......ss...', '...ff......ff...', '................'],
    side: ['.....cccccCC....', '....ccccccCCC...', '....ccccccCCC...', '....cccccCCCC...', '.....ss..ss.....', '.....ff..ff.....', '................']
  };

  var OUT = '#20182a';
  var BASE_PAL = {
    e: '#20182a', w: '#ffffff', h: '#5a3a2a', H: '#3a2418', s: '#f8d0a8', S: '#e0a880',
    c: '#4a78c8', C: '#2e4e90', a: '#383040', p: '#384058', P: '#242a3c', f: '#4a3a34', b: '#d84040', B: '#982828', k: '#c8a040'
  };

  // Named palettes for characters (all original outfits)
  var PALS = {
    player: { head: 'cap', b: '#e8f0f8', B: '#9aa8c0', w: '#26a896', h: '#3a2a22', H: '#241812', c: '#26a896', C: '#15705f', a: '#f4f4f4', p: '#2c3a60', P: '#1c2640', f: '#e04848', k: '#f0a030' },
    rival: { head: 'swept', h: '#7a2e2a', H: '#4e1a18', c: '#4a5a4e', C: '#303c34', a: '#c8a060', p: '#2e2a34', P: '#1c1a22', f: '#3a2a20', k: '#6a4a30' },
    // Brookhollow residents (v2)
    grandma: { head: 'bun', dress: 1, h: '#e8e4f0', H: '#b0aac4', s: '#f0c8a4', S: '#c89878', c: '#5a8a5a', C: '#3a6440' },
    baker: { head: 'short', h: '#e8a040', H: '#b87020', s: '#f0c090', S: '#d09868', c: '#f8f4ea', C: '#d8d0c0', a: '#c85a3a', p: '#6a5a4a', P: '#4a3e30', k: '#f8f4ea' },
    teacher: { head: 'long', dress: 1, h: '#2a1a14', H: '#140a08', s: '#c68a5a', S: '#9a6438', c: '#3a6ab0', C: '#264a80' },
    fisher: { head: 'short', hat: 'beanie', b: '#c83a3a', B: '#8a2424', h: '#d8d8d8', H: '#a8a8a8', s: '#e0a878', S: '#b88050', c: '#e8c040', C: '#b08a20', a: '#6a4a2a', p: '#3a4a6a', P: '#24304a', f: '#2a2a2a', k: '#e8c040' },
    tomas: { head: 'bald', h: '#3a2a1a', H: '#2a1a10', s: '#9a6440', S: '#744626', c: '#8a6a3a', C: '#5a4424', a: '#3a2a1a', p: '#4a5a3a', P: '#303c24', k: '#8a6a3a' },
    villager1: { head: 'ponytail', dress: 1, h: '#c84030', H: '#8a2418', c: '#f0d890', C: '#c0a860' },
    villager2: { head: 'curly', h: '#141418', H: '#000000', s: '#6e4428', S: '#4e2e18', c: '#e07830', C: '#a8501a', a: '#f4f4f4', p: '#384058', P: '#242a3c', k: '#e07830' },
    villager3: { head: 'swept', h: '#e8c060', H: '#b89030', c: '#3a9a50', C: '#246a34', a: '#f4f4f4', p: '#6a5a4a', P: '#4a3e30', k: '#3a9a50' },
    kid2: { head: 'braids', h: '#6a4020', H: '#44260e', s: '#e0a878', S: '#b88050', c: '#f070a8', C: '#b84478', a: '#f4f4f4', p: '#4a78c8', P: '#2e4e90', k: '#f8d040', shorts: 1 },
    // Ashen Accord: grey cloaks with an ember trim
    cinder: { head: 'hood', b: '#6e6c74', B: '#4a484e', h: '#2a2628', s: '#e8c8a8', S: '#c09878', c: '#6e6c74', C: '#4a484e', a: '#f07a2a', p: '#3a383e', P: '#26242a', f: '#2a2628', k: '#6e6c74' },
    cinder2: { head: 'hood', b: '#6e6c74', B: '#4a484e', h: '#2a2628', s: '#9a6440', S: '#744626', c: '#6e6c74', C: '#4a484e', a: '#f07a2a', p: '#3a383e', P: '#26242a', f: '#2a2628', k: '#6e6c74' },
    hiker2: { head: 'curly', hat: 'cap', b: '#4a8a4a', B: '#2e5e2e', w: '#f4f4f4', h: '#3a2418', H: '#241208', s: '#c68a5a', S: '#9a6438', c: '#d88a3a', C: '#a0602a', a: '#5a4424', p: '#5a5a3a', P: '#3a3a24', k: '#6a8a40' },
    birder: { head: 'ponytail', hat: 'cap', b: '#e8d060', B: '#b09a30', w: '#3a6ab0', h: '#8a4a20', H: '#5a2a10', c: '#6a8a5a', C: '#4a6a3a', a: '#e8d060', p: '#6a5a4a', P: '#4a3e30', k: '#e8d060' },
    angler: { head: 'short', hat: 'beanie', b: '#3a6ab0', B: '#264a80', h: '#6a4020', H: '#44260e', s: '#e0a878', S: '#b88050', c: '#8a9a5a', C: '#5a6a3a', a: '#4a3a2a', p: '#3a4a6a', P: '#24304a', f: '#2a2a2a', k: '#8a9a5a' },
    miller: { head: 'short', hat: 'cap', b: '#8a8a8a', B: '#5a5a5a', w: '#f4f4f4', h: '#6a4020', H: '#44260e', c: '#e8e0d0', C: '#b8b0a0', a: '#7a5230', p: '#5a6a8a', P: '#3a4a6a', k: '#e8e0d0' },
    // Pinecrest (v2)
    miner: { head: 'short', hat: 'cap', b: '#e8b030', B: '#b08020', w: '#fff4c0', h: '#3a2a1a', H: '#241808', s: '#d09868', S: '#a87048', c: '#6a7a8a', C: '#4a5a6a', a: '#8a5a30', p: '#4a4038', P: '#302822', f: '#2a2220', k: '#e8b030' },
    miner2: { head: 'braids', hat: 'cap', b: '#e8b030', B: '#b08020', w: '#fff4c0', h: '#c84030', H: '#8a2418', s: '#8a5a38', S: '#6a4024', c: '#8a5a3a', C: '#6a4024', a: '#3a3a44', p: '#4a4038', P: '#302822', f: '#2a2220', k: '#e8b030' },
    warden1: { head: 'bald', h: '#e8e8e8', H: '#b8b8b8', s: '#c68a5a', S: '#9a6438', c: '#5a4a3a', C: '#3a2e24', a: '#e8b030', p: '#4a4038', P: '#302822', f: '#1e1a18', k: '#e8b030' },
    herder: { head: 'ponytail', hat: 'beanie', b: '#c83a3a', B: '#8a2424', h: '#e8c060', H: '#b89030', s: '#f0c8a0', S: '#c89870', c: '#e8dcc4', C: '#b8ac94', a: '#6a8a4a', p: '#5a4a3a', P: '#3a2e24', f: '#4a3020', k: '#e8dcc4' },
    carver: { head: 'curly', h: '#8a8a8a', H: '#5a5a5a', s: '#e0a878', S: '#b88050', c: '#a8a098', C: '#7a746e', a: '#6a4a2a', p: '#6a6460', P: '#4a4440', f: '#3a3430', k: '#a8a098' },
    innkeeper: { head: 'bun', dress: 1, h: '#6a3a2a', H: '#4a2418', s: '#f0c8a0', S: '#c89870', c: '#7a3a30', C: '#5a2620' },
    guide: { head: 'swept', hat: 'beanie', b: '#3a8ac8', B: '#265a8a', h: '#141418', H: '#000000', s: '#8a5a38', S: '#6a4024', c: '#e8702a', C: '#b0501a', a: '#3a3a44', p: '#4a5a4a', P: '#303c30', f: '#2a2220', k: '#e8702a' },
    bathkeeper: { head: 'short', h: '#f4f4f4', H: '#c8c8c8', s: '#f0c8a0', S: '#c89870', c: '#3e6e8a', C: '#264a60', a: '#f4f4f4', p: '#3e6e8a', P: '#264a60', f: '#c8a070', k: '#3e6e8a' },
    elder: { head: 'hood', b: '#3a3840', B: '#24222a', h: '#1a1820', s: '#d8b898', S: '#b09070', c: '#4a4850', C: '#2e2c34', a: '#ff9a3a', p: '#2e2c34', P: '#1c1a20', f: '#1a1820', k: '#ff9a3a' },
    mom: { head: 'bun', dress: 1, h: '#a0522d', H: '#6e3418', c: '#e87a9a', C: '#b8506e' },
    prof: { head: 'long', h: '#c8c8d4', H: '#9090a4', c: '#f4f4f8', C: '#c0c4d4', a: '#4a8a78', p: '#4a5a7a', P: '#34405a', f: '#3a3a44', k: '#f4f4f8' },
    nurse: { head: 'bun', dress: 1, h: '#f0a0c0', H: '#c87098', c: '#f4fbf8', C: '#9ad8c8', f: '#f0f0f0' },
    clerk: { head: 'cap', b: '#3a9a50', B: '#246a34', w: '#f4f4f4', c: '#f4f4f4', C: '#c8c8c8', a: '#3a9a50', p: '#3a6a44', P: '#244a2c', k: '#f4f4f4' },
    agent: { head: 'hood', b: '#2a2434', B: '#141018', h: '#141018', c: '#3c3448', C: '#262030', a: '#e04a6a', p: '#2a2434', P: '#18141e', f: '#141018', k: '#3c3448' },
    captain: { head: 'spiky', h: '#e04a6a', H: '#a02a44', c: '#2a2434', C: '#161218', a: '#e04a6a', p: '#3c3448', P: '#262030', f: '#141018', k: '#2a2434' },
    boss: { head: 'short', h: '#e8e8f0', H: '#a0a0b8', c: '#1e1a28', C: '#0e0c14', a: '#e04a6a', p: '#2a2434', P: '#18141e', f: '#e04a6a', k: '#1e1a28' },
    oldman: { head: 'bald', h: '#d8d8d8', H: '#a8a8a8', c: '#8a6a4a', C: '#604a30', a: '#604a30', p: '#5a5a5a', P: '#3a3a3a', k: '#8a6a4a' },
    oldwoman: { head: 'bun', dress: 1, h: '#d8d8e0', H: '#a8a8b8', c: '#9a6ab0', C: '#6e4488' },
    boy: { head: 'short', h: '#2a2a2a', H: '#141414', c: '#e04848', C: '#a02c2c', a: '#f4f4f4', p: '#4a6ac0', P: '#2e4890', k: '#e0c040' },
    girl: { head: 'long', dress: 1, h: '#e8a040', H: '#b87020', c: '#f070a8', C: '#b84478' },
    kid: { head: 'cap', b: '#4a88e0', B: '#2c5aa8', w: '#f8d040', c: '#f8d040', C: '#c09a20', a: '#4a88e0', p: '#6a8a40', P: '#4a6a28', k: '#4a88e0' },
    hiker: { head: 'cap', b: '#8a6a3a', B: '#5a4424', w: '#c85a3a', c: '#c85a3a', C: '#8e3a22', a: '#5a4424', p: '#6a5a3a', P: '#4a3e24', h: '#3a2a1a', k: '#6a8a40' },
    scholar: { head: 'short', h: '#4a3a2a', H: '#2a2018', c: '#6a4aa0', C: '#4a2e78', a: '#e8d8a0', p: '#3a3a4a', P: '#24242e', k: '#8a6a4a' },
    swimmer: { head: 'short', h: '#f0d040', H: '#c0a020', s: '#e8b888', S: '#c08860', c: '#2a78d8', C: '#1a54a0', a: '#f4f4f4', p: '#2a78d8', P: '#1a54a0', f: '#e8b888', k: '#2a78d8' },
    brawler: { head: 'spiky', h: '#1a1a1a', H: '#000000', c: '#f4f4f4', C: '#c8c8c8', a: '#1a1a1a', p: '#f4f4f4', P: '#c8c8c8', f: '#6a3a1a', k: '#f4f4f4' },
    mystic: { head: 'hood', dress: 1, b: '#8a4ac0', B: '#5e2e8a', h: '#4a2a6a', c: '#8a4ac0', C: '#5e2e8a' },
    skier: { head: 'cap', b: '#e8e8f8', B: '#b0b0c8', w: '#e04848', c: '#3a8ae0', C: '#2460a8', a: '#e04848', p: '#e04848', P: '#a02c2c', k: '#3a8ae0' },
    sailor: { head: 'cap', b: '#f4f4f4', B: '#c0c0c8', w: '#3a5a9a', c: '#f4f4f4', C: '#b8c0d0', a: '#3a5a9a', p: '#2a3a6a', P: '#1a2448', k: '#f4f4f4' },
    worker: { head: 'cap', b: '#f0c030', B: '#b88a18', w: '#e07830', c: '#e07830', C: '#a8501a', a: '#f0c030', p: '#4a5a8a', P: '#303c60', k: '#e07830' },
    occult: { head: 'hood', dress: 1, b: '#2a2a3a', B: '#16161e', h: '#1a1a24', s: '#e8dce8', S: '#b8a8c0', c: '#2a2a3a', C: '#16161e' },
    // gym wardens & council & champion
    fenna: { head: 'long', h: '#5aa040', H: '#3a7028', c: '#e8d070', C: '#b09a40', a: '#4a7a3a', p: '#4a7a3a', P: '#2e5424', k: '#e8d070' },
    gideon: { head: 'bald', h: '#6a4a2a', H: '#4a3018', s: '#c89468', S: '#a06c44', c: '#9a7a5a', C: '#6a5238', a: '#4a3018', p: '#5a4a3a', P: '#3a3024', k: '#9a7a5a' },
    juno: { head: 'spiky', h: '#f0e040', H: '#c0a818', c: '#2a2a3a', C: '#16161e', a: '#f0e040', p: '#f0e040', P: '#b0a020', k: '#2a2a3a' },
    marisol: { head: 'long', dress: 1, h: '#2a78d0', H: '#1a54a0', c: '#f4f8ff', C: '#a8c8f0' },
    ignatius: { head: 'spiky', h: '#e85a2a', H: '#b0381a', c: '#3a2a2a', C: '#221818', a: '#e85a2a', p: '#8a2a1a', P: '#5a1a10', k: '#3a2a2a' },
    celestine: { head: 'long', dress: 1, h: '#e070c0', H: '#a84890', c: '#6a3ab0', C: '#48227e' },
    bjorn: { head: 'short', h: '#e8e8f0', H: '#a8b0c8', c: '#6aa8e0', C: '#3e78b0', a: '#f4f4f4', p: '#3a4a6a', P: '#24304a', k: '#6aa8e0' },
    morwen: { head: 'hood', dress: 1, b: '#3a2a5a', B: '#22163a', h: '#2a1a3a', s: '#e8e0ec', S: '#c0b0cc', c: '#3a2a5a', C: '#22163a' },
    dax: { head: 'short', h: '#1a1a1a', H: '#000000', s: '#a8744a', S: '#80522e', c: '#d83a3a', C: '#982424', a: '#1a1a1a', p: '#2a2a2a', P: '#141414', k: '#d83a3a' },
    hemlock: { head: 'long', h: '#6a2a8a', H: '#461a5e', c: '#5a8a3a', C: '#3a6024', a: '#6a2a8a', p: '#3a2a4a', P: '#241a30', k: '#5a8a3a' },
    orrin: { head: 'short', h: '#8a8a9a', H: '#5a5a6a', c: '#a8b0c0', C: '#7a8294', a: '#4a5060', p: '#4a5060', P: '#30343e', k: '#a8b0c0' },
    sable: { head: 'long', dress: 1, h: '#1a2a4a', H: '#0e162a', c: '#3a6a8a', C: '#244a64' },
    castor: { head: 'short', h: '#f0c040', H: '#c09020', c: '#f4f0e8', C: '#c8b890', a: '#8a2a3a', p: '#2a2a4a', P: '#18182e', f: '#8a2a3a', k: '#f4f0e8' }
  };
  PK.CHAR_PALS = PALS;

  function layer(grid, rows, top) {
    for (var r = 0; r < rows.length; r++) {
      var y = top + r;
      if (y >= CH) break;
      for (var x = 0; x < CW; x++) { var ch = rows[r][x]; if (ch && ch !== '.') grid[y][x] = ch; }
    }
  }
  function buildFrame(p, dir, walk) {
    var grid = [];
    for (var y = 0; y < CH; y++) { grid.push([]); for (var x = 0; x < CW; x++) grid[y].push('.'); }
    var d = dir === 'side' ? 'side' : dir;
    var body = BODY[d][walk ? 1 : 0].slice();
    if (p.dress) {
      // dress replaces the legs; walking just shifts the feet
      var dr = DRESS[d].slice();
      if (walk) dr[5] = d === 'side' ? '....ff....ff....' : '..ff........ff..';
      body = body.slice(0, 5).concat(dr);
    } else if (p.shorts) {
      // shorts: bare legs below the knee
      body = body.map(function (row, i) { return i >= 8 && i <= 9 ? row.replace(/p/g, 's').replace(/P/g, 'S') : row; });
    }
    layer(grid, body, 10);
    layer(grid, HEAD[d], 0);
    var hair = HAIR[p.head || 'short'] || HAIR.short;
    layer(grid, hair[d], 0);
    if (p.hat && HATS[p.hat]) layer(grid, HATS[p.hat][d], 0);
    var pal = Object.assign({}, BASE_PAL, p);
    var c = PK.makeCanvas(CW, CH), x2 = c.getContext('2d');
    // auto outline
    x2.fillStyle = OUT;
    for (y = 0; y < CH; y++) for (x = 0; x < CW; x++) {
      if (grid[y][x] !== '.') continue;
      var n = (y > 0 && grid[y - 1][x] !== '.') || (y < CH - 1 && grid[y + 1][x] !== '.') || (x > 0 && grid[y][x - 1] !== '.') || (x < CW - 1 && grid[y][x + 1] !== '.');
      if (n) x2.fillRect(x, y, 1, 1);
    }
    for (y = 0; y < CH; y++) for (x = 0; x < CW; x++) {
      var k = grid[y][x];
      if (k === '.') continue;
      x2.fillStyle = pal[k] || '#ff00ff';
      x2.fillRect(x, y, 1, 1);
    }
    return c;
  }

  var cache = {};
  // Returns {down:[stand, walkA, walkB], up:[...], left:[...], right:[...]} (16x22 canvases)
  function sprite(name) {
    if (cache[name]) return cache[name];
    var p = PALS[name] || PALS.boy;
    var d0 = buildFrame(p, 'down', false), d1 = buildFrame(p, 'down', true);
    var u0 = buildFrame(p, 'up', false), u1 = buildFrame(p, 'up', true);
    var l0 = buildFrame(p, 'side', false), l1 = buildFrame(p, 'side', true);
    var s = {
      down: [d0, d1, PK.flipCanvas(d1)],
      up: [u0, u1, PK.flipCanvas(u1)],
      right: [l0, l1, l0],
      left: [PK.flipCanvas(l0), PK.flipCanvas(l1), PK.flipCanvas(l0)]
    };
    cache[name] = s;
    return s;
  }

  // Large portrait for battle intros (nearest-neighbour scaled front sprite)
  function portrait(name, scale, dir) {
    var key = name + '|p|' + scale + '|' + (dir || 'down');
    if (cache[key]) return cache[key];
    var s = sprite(name)[dir || 'down'][0];
    var c = PK.makeCanvas(CW * scale, CH * scale);
    var x = c.getContext('2d');
    x.imageSmoothingEnabled = false;
    x.drawImage(s, 0, 0, CW * scale, CH * scale);
    cache[key] = c;
    return c;
  }

  // player on the Trail Bike (drawn under/over the rider)
  function drawBike(ctx, x, y, dir, t) {
    var spin = (t >> 2) & 1;
    ctx.fillStyle = OUT;
    if (dir === 'left' || dir === 'right') {
      ctx.fillRect(x + 1, y + 15, 6, 6); ctx.fillRect(x + 9, y + 15, 6, 6);
      ctx.fillStyle = '#6a6a78'; ctx.fillRect(x + 2, y + 16, 4, 4); ctx.fillRect(x + 10, y + 16, 4, 4);
      ctx.fillStyle = spin ? '#c8c8d4' : '#9a9aa8'; ctx.fillRect(x + 3, y + 17, 2, 2); ctx.fillRect(x + 11, y + 17, 2, 2);
      ctx.fillStyle = '#e04848'; ctx.fillRect(x + 4, y + 14, 8, 2);
    } else {
      ctx.fillRect(x + 6, y + 13, 4, 9);
      ctx.fillStyle = '#6a6a78'; ctx.fillRect(x + 7, y + 14, 2, 7);
      ctx.fillStyle = spin ? '#c8c8d4' : '#9a9aa8'; ctx.fillRect(x + 7, y + (dir === 'down' ? 19 : 14), 2, 2);
      ctx.fillStyle = '#e04848'; ctx.fillRect(x + 4, y + (dir === 'down' ? 13 : 16), 8, 2);
    }
  }

  function emote(ctx, x, y, ch) {
    PK.ui.box(ctx, x, y, 12, 13);
    PK.font.draw(ctx, ch || '!', x + (ch === '?' ? 4 : 5), y + 3, '#d84c3c');
  }

  // ---------- player appearance (character creator) ----------
  var LOOK = {
    body: ['pants', 'skirt', 'shorts'],
    skin: [['#f8d8b4', '#e0b08a'], ['#f0c090', '#d09868'], ['#e0a878', '#b88050'], ['#c68a5a', '#9a6438'], ['#9a6440', '#744626'], ['#6e4428', '#4e2e18']],
    hair: ['short', 'long', 'spiky', 'bun', 'ponytail', 'curly', 'swept', 'braids', 'bald'],
    hairCol: ['#3a2a22', '#141418', '#6a4020', '#b87030', '#e8c060', '#c84030', '#e8e8f0', '#4a6ad0', '#3aa070', '#d060a0'],
    hat: ['none', 'cap', 'beanie'],
    cloth: ['#26a896', '#d84848', '#4a78c8', '#f0b030', '#8a4ac0', '#3a9a50', '#f070a8', '#f4f4f4', '#3a3a44', '#e07830'],
    shoes: ['#e04848', '#3a3a44', '#f4f4f4', '#6a4020', '#4a78c8']
  };
  function defaultLook() { return { body: 0, skin: 1, hair: 0, hairCol: 0, hat: 1, top: 0, bottom: 8, hatCol: 7, shoes: 0 }; }
  // Rebuild the player's palette from a look (indices into LOOK) and drop cached sprites.
  function setPlayerLook(look) {
    look = Object.assign(defaultLook(), look || {});
    var sh = PK.color.shade, sk = LOOK.skin[look.skin], hc = LOOK.hairCol[look.hairCol];
    var top = LOOK.cloth[look.top], bot = LOOK.cloth[look.bottom], hat = LOOK.cloth[look.hatCol];
    var body = LOOK.body[look.body];
    PALS.player = {
      head: LOOK.hair[look.hair], hat: LOOK.hat[look.hat] === 'none' ? null : LOOK.hat[look.hat],
      dress: body === 'skirt' ? 1 : 0, shorts: body === 'shorts' ? 1 : 0,
      s: sk[0], S: sk[1], h: hc, H: sh(hc, -0.35),
      c: top, C: sh(top, -0.35), a: '#f4f4f4', p: body === 'skirt' ? top : bot, P: sh(bot, -0.35),
      b: hat, B: sh(hat, -0.35), w: top === hat ? '#f4f4f4' : top, f: LOOK.shoes[look.shoes], k: sh(top, 0.25)
    };
    Object.keys(cache).forEach(function (k) { if (k === 'player' || k.indexOf('player|') === 0) delete cache[k]; });
    return look;
  }

  PK.chars = { sprite: sprite, portrait: portrait, emote: emote, drawBike: drawBike, PALS: PALS, W: CW, H: CH, LOOK: LOOK, defaultLook: defaultLook, setPlayerLook: setPlayerLook };
})();
