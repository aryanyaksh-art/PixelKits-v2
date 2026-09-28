// Pinecrest: a whole mountain. You arrive in the foothills and climb terrace by terrace to the summit.
// Lower terrace (Base Camp), middle terrace (Miners' Row + the Old Grove), High Ledge, then the snowy peak.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, S = PK.SCRIPTS, Q = PK.QUESTS;
  function g() { return PK.game; }
  function flag(f) { return function () { return g().flag(f); }; }
  function notFlag(f) { return function () { return !g().flag(f); }; }
  function qat(id, step) { return function () { return PK.quest.at(id, step); }; }
  function beat(id) { return !!g().state.defeated[id]; }
  function room(id, name, theme, width, floorRows, o) {
    var wall = new Array(width + 1).join('W');
    var top = [o.wall0 || wall, o.wall1 || wall];
    return D(id, Object.assign({ name: name, interior: true, theme: theme, rows: top.concat(floorRows) }, o));
  }

  // ================= Quests =================
  Q.mountain = { title: 'Ashes on the Mountain', kind: 'main', desc: 'The Ashen Accord blasted the road open and marched up to Pinecrest. Grey-cloaked "loggers" are tearing up the old grove.',
    steps: [
      { id: 'grove', text: 'Find out who is cutting down the old grove' },
      { id: 'rescue', text: 'Help the mountain guide on the High Ledge' },
      { id: 'summit', text: 'Climb to the summit' },
      { id: 'gym', text: 'Win the Pinecrest Challenge' },
      { id: 'mine', text: 'Break the sealed door deep in the mine' },
      { id: 'grotto', text: 'Stop the Ashen Accord in the crystal grotto' }
    ], reward: 'Half of an ancient tablet' };
  Q.goats = { title: 'Kids on the Cliffs', kind: 'side', desc: 'Four Crampling kids hopped out of Nell\'s pasture after the blast and scattered all over the mountain.',
    steps: [{ id: 'find', text: 'Find the 4 runaway Crampling kids' }, { id: 'return', text: 'Tell Nell at the goat barn' }], reward: 'Mountain Milk and a new friend' };
  Q.fossil = { title: 'Buried in Amber', kind: 'side', desc: 'Foreman Dunmore says the old mine tunnels are full of buried treasure. Loose soil marks the best spots.',
    steps: [{ id: 'dig', text: 'Dig at the loose soil in the mine' }, { id: 'carver', text: 'Take the Amber Fossil to the stonecarver' }], reward: 'An ancient Kit' };
  Q.echo = { title: 'The Singing Cave', kind: 'side', desc: 'A cave on Miners\' Row is full of stones that ring when touched. An old carving shows four colored notes.',
    steps: [{ id: 'song', text: 'Ring the echo stones in the carved order' }], reward: 'Whatever the mountain hid' };

  var SIGN_TEXT = {
    welcome: 'PINECREST - The town that climbs. Base Camp ahead, Summit at the top.',
    miners: 'MINERS\' ROW - Mine, Miners\' Hall, Stonecarver. The Old Grove is to the east.',
    ledge: 'HIGH LEDGE - Caves ahead. Watch for falling rocks!',
    summit: 'SUMMIT PATH - The Pinecrest Challenge Hall waits at the top.',
    camp: 'BASE CAMP - Inn, Bathhouse, Gear Shop and the Cable Car.'
  };

  // ================= Pinecrest (the mountain) =================
  D('pinecrest', {
    name: 'Pinecrest', theme: 'mount', music: 'mountain', region: 'Verdant Vale', townPoint: [38, 57],
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TT........T".T"T...."...".."::.T....T".T"TTT.TT".T"...TT',
      'TT........T""..TTTT".TT""...::"..T..j..""T.TTTT"TTTT"TTT',
      'TT........::::::::::::::::::::.TT""T..""TT"T.TT.,T.T,.TT',
      'TT.........T"T.,."T.j.....T"::"TTTT.."..."TTTTj..."..TTT',
      'TTvvvvvvvv...."T."..""..TTT.::.T...".TT..,."..TTTT.T"TTT',
      'TT.""..".",,T"TT.T"..""..T.T::T.".j.."."".","....T...TTT',
      'TTT"TTT...T..T..jT.""..T"""T::".T."T"."T...TTT.TT"..TTTT',
      'TT...TT."T...T.T.""..TT..TTT::T"".T"T"TTT..T".T.""."".TT',
      'TT."...""TTT.TTT...TTT"T.T..::.T.""T"""Tj"TTT"TT"T.,..TT',
      'TT.."".T..T.....T,".....j..T::TT"T....."T..",.T.TTT.T.TT',
      'TT."""....TTT.".TTT...T"""T.::T..T".."TT.T.T,.T."..T."TT',
      'TTTT"""T"".T..T...T""..""TTT::.T.TT"T"........T."..TT.TT',
      'TTT""T..T."."TTT."T.."TTT"ST::TT..."",""TT.T"..TTT""..TT',
      'TTWWWWWWWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWWWWWTT',
      'TTWWWWWWWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWWWWWTT',
      'TTWWOWWWWWWWWWOWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWOWWWTT',
      'TT.T:T....T,..:.."T"........::T.".."T"..TT..,".T".:...TT',
      'TT.":::::::::::".."T...".."T::".."...".".""R.".."":...TT',
      'TT","....."TT,:.....""..T.""::""....T"".RT.""...RT:.".TT',
      'TT"".T.......T:TT.".."".."."::"T........T"...,"...:"..TT',
      'TT..."...."".T:"."TT."..."TT::......."......TRRR.":.""TT',
      'TT""......",..:"...T....T"T"::.......".."..T.....":"R.TT',
      'TT."T..::::::::::::::::"."""::...:....TT,..T......:"."TT',
      'TT...""."T......"T...T::::::::::::::::::::::::.::::.".TT',
      'TT""..T..."T...T.,..."::."..."",.,T"..T..T.T..."......TT',
      'TTT.."...".TT.T..T.T..::.T.".T...."...."..T"..".......TT',
      'TT."."..""."T""...".T.::."....T..,.".."..R".T.".......TT',
      'TT...."TT"....T".TT"T"::".."..T.""T...."T.."..........TT',
      'TT.".T.."T.T..""....""::"T...T....."T"T"....".vvvvvvvvTT',
      'TT..."..".T""...".""..::S.........."".T."TT.""TT....T.TT',
      'TTWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWTT',
      'TTWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWTT',
      'TTWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWOWWWWWWWWWWWWWWWTT',
      'TT....T...T,TT........::..TT.,..T.....:.TTTTTTTTTTTTTTTT',
      'TT...T......,.....T."T:::::::::::::::::,TTTTTTTTTTTTTTTT',
      'TT..T..."..........,..::T.T........T.T,.T-...........TTT',
      'TT.............:..yyyy::."..."......."..T-..<..<.....TTT',
      'TT."...""...".":..T.T.::....".T,.....T..T-........<..TTT',
      'TT...........".:......::................T-....oo.....TTT',
      'TTT............:......::"..............TT-....oo.....TTT',
      'TT."..........T:......::........::::::::::...........TTT',
      'TT,..........".:.T..T.::.............,..T-.......<...TTT',
      'TT,"...:::::::::::::::::::::............T-.<.........TTT',
      'TT......"......."T....::::::::::.......TT-.........<.TTT',
      'TT..."..TT...T"...".."::......::."......T-...........TTT',
      'TT..".T."....T........T..T...S::.....T..TTTTTTTTTTTTTTTT',
      'TTWWWWWWWWWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWWWTT',
      'TTWWWWWWWWWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWWWTT',
      'TTWWWWOWWWWWWWWWWWWWWWWWWWWWWW^^WWWWWWWWWWWWWWWWWWWWWWTT',
      'TT....:......................T::...T.T................TT',
      'TT".T.:.............T.T"....T.::....."..,TT."."."T....TT',
      'TTT...:.........".......TT..T.::.,..T....,............TT',
      'TT...T:.......................::..................T...TT',
      'TT..T.:......................"::......................TT',
      'TT...":.......................::..................,T..TT',
      'TT"..,:...........T.....T.....::...............:....T.TT',
      'TT."T.:.............:.....T.."::......:........:..,...TT',
      'TTT..g:gggg:gggggggg:ggggggggggggggggg:gggggggg:ggg...TT',
      'TTT..gggggggggggggggggggggggggggggggggggggggggggggg..TTT',
      'TT,..gggggggggggggggggggggggggggggggggggggggggggggg...TT',
      'TT.".gggggggg:ggggggggggggggggggggggggggggggg:ggggg.".TT',
      'TT,.,.T..T...:..,."...........::....,.T..,...:,...,...TT',
      'TT".T........:......"..T......::.ST..,T......:.....,..TT',
      'TT....T".....:.......T.......T::.....T.......:....,..TTT',
      'TT.....".....:.....T..........::...T..."..T".:.....T..TT',
      'TT...."..T"..:....".,..,..,...::.............:........TT',
      'TT.......T...:....T,.......T..::.............:....."..TT',
      'TT....,",...."................::.T.........,T..T..."..TT',
      'TT.,..............".T.........::...............,.."...TT',
      'TT.."..TT.........,"."...T,...::......"..T"...T......TTT',
      'TT".."".."..T----------..".T".::.."..".....TT.TTT....TTT',
      'TTT."......."-........-T"T..".::,T....."....T..".."...TT',
      'TT.",......."-........-"..."T"::".".T.,.....TT."....""TT',
      'TT""T......."-........-T.T".T.::..T".,."......".....T.TT',
      'TT"..,......"-................::.".T..".....,.."....,TTT',
      'TTT."...:....-.........:::::::::.T.,."T..:...""T....."TT',
      'TT.....T:"T..-........-"..."."::::::::::::::::::::....TT',
      'TT"T...T:TT""-........-,T".T..::.".."T.."T..T"T."..T..TT',
      'TT.."T..:....----------..T.S..::.T.T.."...."T".""T..""TT',
      'TT..."".::::::::::::::::::::::::T."...T.....T","T""..TTT',
      'TT".,~~~~~~~A.T..".T.....""TT.::.""...T..."".",.,."T..TT',
      'TT..A~~~~~~~.T..TT.".T...."...::"....T"..""T"........TTT',
      'TTTTTTT~~~TTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTTTTTTTT'
    ],
    buildings: [
      { k: 'barn', at: [6, 72], to: 'pc_barn' },
      { k: 'chalet', at: [40, 72], to: 'pc_home_a' },
      { k: 'chalet', at: [48, 73], to: 'pc_home_b', roof: '#3e5a6a', color: '#8a5a34' },
      { k: 'inn', at: [8, 52], to: 'pc_inn' },
      { k: 'gearshop', at: [19, 53], to: 'pc_gear' },
      { k: 'bathhouse', at: [35, 53], to: 'pc_bath' },
      { k: 'chalet', at: [46, 52], to: 'pc_home_c', roof: '#5a4a6a' },
      { k: 'stall', at: [24, 63], goods: 'milk', roof: '#5a8ad0' },
      { k: 'stall', at: [27, 63], goods: 'bread', roof: '#c85a3a' },
      { k: 'cablecar', at: [44, 63], to: 'pc_cable_base' },
      { k: 'chalet', at: [12, 63], to: 'pc_home_d', roof: '#8a6a2a', color: '#a8743e', icon: 'milk' },
      { k: 'miners', at: [5, 39], to: 'pc_miners' },
      { k: 'mine', at: [14, 34], to: 'pc_mine' },
      { k: 'carver', at: [26, 40], to: 'pc_carver' },
      { k: 'chalet', at: [33, 37], to: 'pc_home_e', roof: '#7a3a5a', color: '#9a7a5a' },
      { k: 'chalet', at: [6, 19], to: 'pc_home_f', roof: '#4a6a4a', snow: true },
      { k: 'chalet', at: [32, 19], to: 'pc_guide', roof: '#c8702a', icon: 'rope', snow: true }
    ],
    props: [
      ['haybale', 15, 73], ['haybale', 16, 73], ['haybale', 20, 78], ['cart', 3, 76, { text: 'A cart loaded with milk cans, ready for the market.' }],
      ['banner', 29, 70, { color: '#3a8a4a', icon: 'goat' }], ['banner', 32, 70, { color: '#3a8a4a', icon: 'goat' }],
      ['lantern', 7, 62], ['lantern', 18, 62], ['lantern', 34, 62], ['lantern', 42, 62], ['lantern', 29, 57], ['lantern', 32, 57],
      ['flowerpots', 17, 57], ['flowerpots', 43, 57], ['crate', 24, 57, { icon: 'rope' }], ['crate', 25, 57],
      ['hangsign', 22, 62, { icon: 'milk', text: 'MILK & CHEESE, fresh from the barn every morning.' }],
      ['hangsign', 29, 62, { icon: 'bread', text: 'CAMP KITCHEN - stew, jerky and treats for the climb.' }],
      ['minecart', 19, 38, { text: 'A mine cart full of rocks. Some of them glitter.' }], ['crate', 13, 38, { icon: 'pick' }], ['lantern', 12, 36], ['lantern', 19, 35],
      ['statue', 24, 42, { icon: 29, text: 'A stone Ledgeram, carved by the stonecarver. Its horns are polished smooth by children climbing on it.' }],
      ['tent', 49, 43, { text: 'A grey tent with an ember stitched on the flap. The Accord is camping in the grove.' }], ['campfire', 44, 44],
      ['crate', 51, 37, { icon: 'tent', text: 'Crates stamped with an ember. Blasting caps, rope, lamp oil.' }],
      ['telescope', 36, 25, { talk: 'pc_scope' }], ['lantern', 27, 23], ['lantern', 30, 23],
      ['campfire', 10, 27, { text: 'A climbers\' campfire ring, long cold.' }], ['bedroll', 11, 26, { text: 'Someone left a bedroll here. It smells like smoke and pine.' }]
    ],
    signsAt: [[27, 79, SIGN_TEXT.welcome], [29, 46, SIGN_TEXT.miners], [24, 30, SIGN_TEXT.ledge], [26, 13, SIGN_TEXT.summit], [33, 63, SIGN_TEXT.camp]],
    itemsAt: [['pluscapsule', 1, 52, 66], ['tonic', 2, 3, 53], ['goatcheese', 1, 21, 81], ['hushspray', 1, 3, 35], ['capsule', 3, 53, 18], ['rekindle', 1, 3, 1]],
    hiddenAt: [['mountainmilk', 1, 16, 76], ['pluscapsule', 1, 36, 45], ['hitonic', 1, 44, 26], ['boostcandy', 1, 52, 2]],
    npcs: {
      greeter: { at: [33, 80], sprite: 'herder', dir: 'left', text: 'Welcome to Pinecrest! Mind the stairs, they go up. And up. And up some more.', textIf: [['grotto_done', 'The grove is quiet again. You can almost hear the pines growing.']] },
      milkman: { at: [24, 62], sprite: 'herder', dir: 'down', talk: 'shop', stock: ['mountainmilk', 'goatcheese'] },
      cook: { at: [27, 62], sprite: 'innkeeper', dir: 'down', talk: 'shop', stock: ['campstew', 'spicejerky', 'kittreat', 'fancytreat'] },
      plazakid: { at: [26, 60], sprite: 'kid2', move: 'wander', text: 'Did you hear the BOOM? My whole house shook! Mom says it was the grey coats.' },
      porter: { at: [16, 59], sprite: 'hiker', move: 'look', text: 'I carry supplies up to the miners every morning. My knees have opinions about the stairs.' },
      kidgoat1: { at: [16, 75], sprite: 'kit:28', move: 'wander', text: 'A Crampling kid. It headbutts the fence post, then looks very proud of itself.' },
      kidgoat2: { at: [19, 73], sprite: 'kit:28', move: 'wander', text: 'A Crampling kid chewing on a bit of rope.' },
      rhea: { at: [40, 67], sprite: 'girl', dir: 'left', keeper: 'pc_1', sight: 4 },
      // Miners' Row
      tobin: { at: [11, 45], sprite: 'hiker2', dir: 'up', keeper: 'pc_2', sight: 2 },
      oreminer: { at: [20, 36], sprite: 'miner', dir: 'left', text: 'The mine\'s been in Pinecrest for two hundred years. Lately the rock sounds... hollow. Like something\'s been dug out from the other side.' },
      rowkid: { at: [29, 38], sprite: 'kid', move: 'wander', text: 'I\'m gonna be a stonecarver when I grow up. Or a Crampling. Whichever is easier.' },
      groveguard: { at: [41, 41], sprite: 'cinder', dir: 'left', cond: notFlag('grotto_done'), text: 'CINDER: Logging site. Official business. Move along, kid.', textIf: [['grove_seen', 'CINDER: The Elder said nobody gets past this fence. Especially you.']] },
      groveA: { at: [45, 38], sprite: 'cinder', dir: 'left', cond: function () { return PK.quest.has('mountain') && !g().flag('grove_seen'); } },
      groveB: { at: [48, 42], sprite: 'cinder2', dir: 'up', cond: function () { return PK.quest.has('mountain') && !g().flag('grove_seen'); } },
      grovesib: { at: [44, 41], sprite: 'rival', dir: 'right', cond: function () { return PK.quest.has('mountain') && !g().flag('grove_seen'); } },
      // High Ledge
      ada: { at: [24, 8], sprite: 'birder', dir: 'down', keeper: 'pc_4', sight: 3 },
      ledgeclimber: { at: [18, 26], sprite: 'villager3', move: 'look', text: 'The caves up here go deep. One of them is so dark you can\'t see your own hands. The miners use lamps.' },
      trapped: { at: [46, 22], sprite: 'hiker', dir: 'down', cond: function () { return g().flag('avalanche') && !g().flag('rescued'); }, text: 'HIKER: H-hello? Is someone there? I can\'t move these rocks by myself!' },
      mound1: { at: [45, 22], sprite: 'boulder', cond: function () { return g().flag('avalanche') && !g().flag('mound1'); }, talk: 'pc_mound' },
      mound2: { at: [47, 22], sprite: 'boulder', cond: function () { return g().flag('avalanche') && !g().flag('mound2'); }, talk: 'pc_mound' },
      mound3: { at: [46, 23], sprite: 'boulder', cond: function () { return g().flag('avalanche') && !g().flag('mound3'); }, talk: 'pc_mound' },
      sibrescue: { at: [44, 24], sprite: 'rival', dir: 'up', startHidden: true, cond: function () { return g().flag('avalanche') && !g().flag('rescued'); } },
      // runaway goats (Kids on the Cliffs)
      goat1: { at: [3, 65], sprite: 'kit:28', noTurn: true, cond: function () { return PK.quest.at('goats', 'find') && !g().flag('goat1'); }, talk: 'pc_goat' },
      goat2: { at: [37, 45], sprite: 'kit:28', noTurn: true, cond: function () { return PK.quest.at('goats', 'find') && !g().flag('goat2'); }, talk: 'pc_goat' },
      goat3: { at: [50, 27], sprite: 'kit:28', noTurn: true, cond: function () { return PK.quest.at('goats', 'find') && !g().flag('goat3'); }, talk: 'pc_goat' },
      goat4: { at: [5, 2], sprite: 'kit:28', noTurn: true, cond: function () { return PK.quest.at('goats', 'find') && !g().flag('goat4'); }, talk: 'pc_goat' }
    },
    eventsAt: [
      { at: [38, 41], run: 'pc_grove', cond: function () { return PK.quest.at('mountain', 'grove'); } },
      { at: [39, 41], run: 'pc_grove', cond: function () { return PK.quest.at('mountain', 'grove'); } }
    ],
    warpsAt: [
      [6, 49, 'pc_tunnel', 3, 13, 'up'], [4, 16, 'pc_tunnel', 14, 1, 'down'],
      [14, 16, 'pc_dark', 5, 16, 'up'], [50, 16, 'pc_lake', 9, 15, 'up'], [38, 33, 'pc_echo', 7, 10, 'up']
    ],
    onEnter: 'pc_enter',
    edges: { s: { to: 'willow_trail', off: 0 }, n: { to: 'pinecrest_peak', off: -8 } },
    enc: {
      grass: [[28, 7, 10, 30], [31, 7, 10, 22], [12, 7, 10, 12], [13, 10, 11, 4], [18, 7, 9, 10], [33, 8, 10, 10, 'night'], [24, 9, 11, 8, 'night']]
    }
  });

  D('pinecrest_peak', {
    name: 'Pinecrest Summit', theme: 'snow', music: 'peak', region: 'Verdant Vale', weather: 'snow',
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TTT.."...".T".T.""........"....."....TTT',
      'TT........T..T..""...TTT."."..".....T.TT',
      'TT"..........T"...."....Tj"..T".....T.TT',
      'TTj.......T..T".""."....T......."....jTT',
      'TT..............Tjj...""."T....j"Tjj..TT',
      'TT....:......T"......T..""T""."."...".TT',
      'TT..T.:..""............."j....jT.T.j..TT',
      'TT".T.:..T..jT".........".T.......j.".TT',
      'TT..j.:..".."T.............."........TTT',
      'TTT"T.:."..""..........."T."..........TT',
      'TT...j:.T.T...T.....................""TT',
      'TT"."":..".".".....:....."..".......j.TT',
      'TT."..:..."...."..":TT.T.".T"..:.....TTT',
      'TTj...:.T"..T.".TT.:.."."."."..:T...."TT',
      'TT..."::::::::::::::::::::::::::::::""TT',
      'TTTT....T.........j.::..S..".T.."..:""TT',
      'TTT...T.j..j.T....."::........j..".:".TT',
      'TT....""....."".....::.T..."""T....:T.TT',
      'TT......"..."...T".T::"."j"...."...:.TTT',
      'TT..."......."....jT::.............:..TT',
      'TT......T....T"T.TT.::.T...T......":j.TT',
      'TTT.""j"....Tj...""T::......."..Tj....TT',
      'TT...j".".......T..T::.T."......""....TT',
      'TT."."TT....".."T.T.::"".j.".j."......TT',
      'TT.T..".T....T."....::"....T....T"....TT',
      'TT"..".T.....Tj.".".::"T.T....T.T."...TT',
      'TT."".j..."T.T..T.".::.."."""...T.....TT',
      'TTTTTTTTTTTTTTTTTTTT::TTTTTTTTTTTTTTTTTT'
    ],
    buildings: [
      { k: 'rockgym', at: [16, 8], to: 'pc_gym1' },
      { k: 'shrine', at: [4, 3], to: 'pc_shrine' },
      { k: 'cablecar', at: [30, 10], to: 'pc_cable_top', roof: '#3a78c8' }
    ],
    props: [['banner', 15, 12, { color: '#8a5a30', icon: 'pick' }], ['banner', 23, 12, { color: '#8a5a30', icon: 'pick' }], ['telescope', 36, 23, { talk: 'pc_scope' }], ['lantern', 5, 8], ['lantern', 9, 8]],
    signsAt: [[24, 17, 'PINECREST CHALLENGE HALL - Warden Harrow. Those who enter do not leave until the challenge is done.']],
    itemsAt: [['frostshard', 1, 36, 26], ['pluscapsule', 2, 3, 27]],
    hiddenAt: [['rekindle', 1, 12, 4]],
    npcs: {
      sigrid: { at: [28, 20], sprite: 'villager3', dir: 'left', keeper: 'pc_7', sight: 4 },
      sibpeak: { at: [20, 15], sprite: 'rival', dir: 'down', cond: function () { return PK.quest.at('mountain', 'summit'); } },
      snowkid: { at: [12, 22], sprite: 'kid2', move: 'wander', text: 'It\'s snowing on top of the world! I saw a Kit that looked exactly like a snowball. Then it blinked.' }
    },
    eventsAt: [
      { at: [20, 18], run: 'pc_peak_sib', cond: qat('mountain', 'summit') }, { at: [21, 18], run: 'pc_peak_sib', cond: qat('mountain', 'summit') },
      { at: [19, 13], run: 'pc_gym_warn', cond: notFlag('gym1_warned') }
    ],
    edges: { s: { to: 'pinecrest', off: 8 } },
    enc: { grass: [[45, 10, 13, 30], [47, 10, 13, 25], [28, 10, 12, 15], [29, 12, 13, 6], [13, 11, 12, 8]] }
  });

  // ================= caves =================
  D('pc_tunnel', {
    name: 'Switchback Tunnel', theme: 'cave', music: 'cave', region: 'Verdant Vale', dungeon: true,
    rows: [
      'WWWWWWWWWWWWWWOWWWWW',
      'WWWWWWWWWWWW....WWWW',
      'WWWWW...WWW......WWW',
      'WWW......R.....WWWWW',
      'WW.....WWWW.....WWWW',
      'WW....WWWWWWW....WWW',
      'WWW...WWWWWWW.....WW',
      'WWW....WWWWW......WW',
      'WWWW......R......WWW',
      'WWWWW...........WWWW',
      'WWW....WWWW....WWWWW',
      'WW....WWWWWWWWWWWWWW',
      'WW...WWWWWWWWWWWWWWW',
      'WWW.WWWWWWWWWWWWWWWW',
      'WWWOWWWWWWWWWWWWWWWW'
    ],
    warpsAt: [[3, 14, 'pinecrest', 6, 50, 'down'], [14, 0, 'pinecrest', 4, 17, 'down']],
    itemsAt: [['tonic', 1, 16, 7], ['capsule', 2, 2, 5]],
    hiddenAt: [['spicejerky', 1, 7, 2]],
    npcs: { wes: { at: [12, 4], sprite: 'miner', dir: 'left', keeper: 'pc_3', sight: 3 } },
    tileText: { R: 'A boulder streaked with sparkly mica.' },
    enc: { cave: [[33, 8, 10, 35], [31, 8, 10, 30], [38, 8, 10, 20], [26, 9, 10, 4]] }
  });
  D('pc_dark', {
    name: 'Blackrock Cave', theme: 'cave', music: 'mystery', region: 'Verdant Vale', dungeon: true, dark: 'deep',
    rows: [
      'WWWWWWWWWWWWWWWWWWWWWWWW',
      'WWW.....WWWWWWW......WWW',
      'WW.......WWWWW........WW',
      'W....R....WWW.....R....W',
      'W.........WWW..........W',
      'WW...WWW.......WWW....WW',
      'WW...WWWW.....WWWW...WWW',
      'WWW...WW...R...WW...WWWW',
      'WWWW.......WW.......WWWW',
      'WWWWW.....WWWW.....WWWWW',
      'WW........WWWW........WW',
      'W....R...........WW....W',
      'W.......WWW......WW....W',
      'WW.....WWWWW..........WW',
      'WWW...WWWWWWW.......WWWW',
      'WWWW..WWWWWWWWW....WWWWW',
      'WWWWW.WWWWWWWWWWWWWWWWWW',
      'WWWWWOWWWWWWWWWWWWWWWWWW'
    ],
    warpsAt: [[5, 17, 'pinecrest', 14, 17, 'down']],
    itemsAt: [['hitonic', 1, 21, 3], ['sd13', 1, 3, 11], ['rekindle', 1, 20, 12]],
    hiddenAt: [['boostcandy', 1, 1, 4], ['pluscapsule', 2, 13, 14]],
    npcs: { pim: { at: [9, 8], sprite: 'hiker', dir: 'down', keeper: 'pc_5', sight: 3 } },
    enc: { cave: [[33, 10, 12, 30], [34, 12, 13, 12], [38, 10, 12, 25], [36, 10, 12, 18]], rate: 1.2 }
  });
  D('pc_lake', {
    name: 'Hollow Lake', theme: 'cave', music: 'cave', region: 'Verdant Vale', dungeon: true,
    rows: [
      'WWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWW......WWWWWWWWW....WWWW',
      'WW...~~~~~~~~~~~~~~~...WWW',
      'W...~~~~~~~~~~~~~~~~~~..WW',
      'W..~~~~~~~~..~~~~~~~~~~..W',
      'W..~~~~~~~....~~~~~~~~~..W',
      'W..~~~~~~~~..~~~~~~~~~~..W',
      'W...~~~~~~~~I~~~~~~~~~~..W',
      'WW...~~~~~~~I~~~~~~~~~..WW',
      'WW....~~~~~~I~~~~~~~~...WW',
      'WWW....~~~~~I~~~~~~....WWW',
      'WWW.........I..........WWW',
      'WWWW.....R.......R....WWWW',
      'WWWWW................WWWWW',
      'WWWWWWW....WWWW....WWWWWWW',
      'WWWWWWWW..WWWWWW..WWWWWWWW',
      'WWWWWWWWWOWWWWWWWWWWWWWWWW'
    ],
    warpsAt: [[9, 16, 'pinecrest', 50, 17, 'down']],
    itemsAt: [['kelpcrisp', 2, 12, 4], ['pluscapsule', 1, 5, 12]],
    hiddenAt: [['hitonic', 1, 12, 5]],
    npcs: {
      colm: { at: [18, 12], sprite: 'angler', dir: 'up', keeper: 'pc_6', sight: 2 },
      lakewick: { at: [5, 11], sprite: 'kit:36', move: 'wander', text: 'A Palewick. Its tail glows softly as it feels the air around you.' }
    },
    tileText: { R: 'A slick rock. Tiny glowing specks cling to it.' },
    enc: { cave: [[36, 10, 12, 45], [33, 10, 12, 30], [38, 10, 11, 20]], water: [[22, 10, 12, 60], [36, 11, 13, 30], [23, 13, 14, 10]] }
  });
  D('pc_echo', {
    name: 'Echo Cave', theme: 'cave', music: 'cave', region: 'Verdant Vale', dungeon: true,
    rows: [
      'WWWWWWWWWWWWWWWW',
      'WWWWWW....WWWWWW',
      'WWWWW......WWWWW',
      'WWWWWWW..WWWWWWW',
      'WW............WW',
      'W..............W',
      'W..............W',
      'W..............W',
      'WW............WW',
      'WWWWW......WWWWW',
      'WWWWWWW..WWWWWWW',
      'WWWWWWWOWWWWWWWW'
    ],
    warpsAt: [[7, 11, 'pinecrest', 38, 34, 'down']],
    props: [['carving', 4, 3, { notes: [2, 0, 3, 1], talk: 'pc_carving' }]],
    itemsAt: [['quickcharm', 1, 6, 1], ['boostcandy', 1, 9, 1], ['pluscapsule', 2, 8, 2]],
    npcs: {
      stone0: { at: [3, 6], sprite: 'echo', note: 0, noTurn: true, talk: 'pc_echo' },
      stone1: { at: [6, 5], sprite: 'echo', note: 1, noTurn: true, talk: 'pc_echo' },
      stone2: { at: [9, 5], sprite: 'echo', note: 2, noTurn: true, talk: 'pc_echo' },
      stone3: { at: [12, 6], sprite: 'echo', note: 3, noTurn: true, talk: 'pc_echo' },
      seal0: { at: [7, 3], sprite: 'gate', gate: 'stone', noTurn: true, cond: notFlag('echo_open'), text: 'A slab of stone blocks the passage. It hums faintly when the echo stones ring.' },
      seal1: { at: [8, 3], sprite: 'gate', gate: 'stone', noTurn: true, cond: notFlag('echo_open'), text: 'A slab of stone blocks the passage. It hums faintly when the echo stones ring.' }
    },
    enc: { cave: [[33, 9, 11, 60], [34, 11, 12, 10]], rate: 0.6 }
  });
  D('pc_mine', {
    name: 'Pinecrest Mine', theme: 'mine', music: 'mine', region: 'Verdant Vale', dungeon: true,
    rows: [
      'WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWW..WWW',
      'WW......WWWWWWW........R..WW',
      'W..yyyyyyyy......WWWW......W',
      'W.............R..WWWW...R..W',
      'W..WWWW..........WWWW......W',
      'W..WWWW....WWWWW.....yyyyy.W',
      'W.........WWWWWWW..........W',
      'WW......R.WWWWWWW....WWWWWWW',
      'WWW.......WWWWWWW.....WWWWWW',
      'WW..............R......WWWWW',
      'W.....yyyyyy............WWWW',
      'W..R................R...WWWW',
      'WW........WWWWW.........WWWW',
      'WWW......WWWWWWW......WWWWWW',
      'WWWWW...WWWWWWWWW...WWWWWWWW',
      'WWWWWW..WWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWOWWWWWWWWWWWWWWWWWWWW'
    ],
    entry: [7, 16],
    warpsAt: [[7, 17, 'pinecrest', 15, 37, 'down'], [24, 1, 'pc_grotto', 22, 15, 'up']],
    props: [['minecart', 12, 3], ['minecart', 22, 6, { color: '#f0d060' }], ['lantern', 2, 2], ['lantern', 9, 10], ['lantern', 19, 12], ['crate', 26, 3, { icon: 'pick' }], ['crate', 1, 12]],
    itemsAt: [['tonic', 2, 20, 9]],
    hiddenAt: [['hitonic', 1, 2, 7]],
    npcs: {
      digger: { at: [5, 9], sprite: 'miner2', move: 'look', text: 'MINER: We found old Accord tunnels down here last week. Somebody has been digging INTO our mine from the other side.' },
      railman: { at: [16, 4], sprite: 'miner', dir: 'down', text: 'MINER: Mind the rails! And if you see loose soil, that\'s where the good stuff is. Ask the foreman for a trowel.' },
      dig1: { at: [5, 4], sprite: 'dig', noTurn: true, cond: notFlag('dig1'), talk: 'pc_dig' },
      dig2: { at: [22, 4], sprite: 'dig', noTurn: true, cond: notFlag('dig2'), talk: 'pc_dig' },
      dig3: { at: [4, 12], sprite: 'dig', noTurn: true, cond: notFlag('dig3'), talk: 'pc_dig' },
      dig4: { at: [18, 11], sprite: 'dig', noTurn: true, cond: notFlag('dig4'), talk: 'pc_dig' },
      sealdoor: { at: [24, 2], sprite: 'gate', noTurn: true, cond: notFlag('mine_door'), talk: 'pc_mine_door' }
    },
    enc: { cave: [[31, 9, 12, 40], [38, 9, 11, 25], [33, 9, 11, 20], [32, 12, 13, 3]], rate: 0.8 }
  });
  D('pc_grotto', {
    name: 'Crystal Grotto', theme: 'ice', music: 'grotto', region: 'Verdant Vale', dungeon: true,
    rows: [
      'WWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWW........WWWWWWWWW',
      'WWWWWW..............WWWWWW',
      'WWWW..T...........T...WWWW',
      'WWW......................W',
      'WW..T..........T.....T...W',
      'WW.......................W',
      'WWW....T.........T......WW',
      'WWWW...................WWW',
      'WWW......T.......T.....WWW',
      'WW..T.................T.WW',
      'WW......................WW',
      'WWW.....WWW.....WWW....WWW',
      'WWWW...WWWWW...WWWWW..WWWW',
      'WWWWW..............WWW..WW',
      'WWWWWWWWWWWWWWWWWWWWW..WWW',
      'WWWWWWWWWWWWWWWWWWWWWWOWWW'
    ],
    warpsAt: [[22, 16, 'pc_mine', 24, 2, 'down']],
    props: [['tent', 3, 9, { color: '#5a5860' }], ['crate', 20, 8, { icon: 'crystal', text: 'Crates of raw crystal, packed in straw and stamped with an ember.' }], ['crate', 21, 8, { icon: 'crystal' }], ['campfire', 6, 11]],
    itemsAt: [['pluscapsule', 2, 23, 4]],
    hiddenAt: [['radiantshard', 1, 2, 5]],
    npcs: {
      gc1: { at: [16, 11], sprite: 'cinder', dir: 'left', keeper: 'cinder_3', sight: 4 },
      gc2: { at: [9, 7], sprite: 'cinder2', dir: 'down', keeper: 'cinder_4', sight: 4 },
      elder: { at: [13, 2], sprite: 'elder', dir: 'down', cond: notFlag('grotto_done') },
      cage: { at: [17, 3], sprite: 'kit:40', noTurn: true, cond: notFlag('quartz_freed'), talk: 'pc_cage' }
    },
    eventsAt: [
      { at: [12, 5], run: 'pc_elder', cond: notFlag('grotto_done') }, { at: [13, 5], run: 'pc_elder', cond: notFlag('grotto_done') }, { at: [14, 5], run: 'pc_elder', cond: notFlag('grotto_done') }
    ],
    enc: { cave: [[26, 11, 13, 25], [33, 11, 13, 30], [38, 11, 12, 20], [40, 12, 13, 4]], rate: 0.5 }
  });

  // ================= the gym: four challenges, each its own room =================
  var SAFE = [[7, 7], [6, 7], [6, 6], [6, 5], [5, 5], [5, 4], [5, 3], [6, 3], [7, 3], [7, 2], [7, 1]];
  function safe(x, y) { return SAFE.some(function (q) { return q[0] === x && q[1] === y; }); }
  // A door/gate is 3 tiles wide so a beaten guard resting in the middle never seals the only
  // way through — but that also means you could just hug a side column and never trigger their
  // sight line. These force the fight on all 3 columns of that row until the guard is beaten.
  function guardRow(y, trainerId, npcId) {
    var run = async function (w) {
      if (beat(trainerId)) return;
      var n = w.npc(npcId), tr = PK.TRAINERS[trainerId];
      if (n) w.facePlayer(n);
      if (tr.intro) await w.say(tr.intro);
      var r = await w.battle(trainerId);
      if (r === 'win' && tr.after) await w.say(tr.after);
    };
    return [6, 7, 8].map(function (x) { return { at: [x, y], run: run, cond: function () { return !beat(trainerId); } }; });
  }
  // shared by every room: losing anywhere in the Hall sends you all the way back to the start
  function pcgReset(w) {
    var st = g().state;
    ['pcg_cart', 'pcg_pick'].forEach(function (f) { g().setFlag(f, false); });
    ['pcgym_1', 'pcgym_2', 'pcgym_3'].forEach(function (id) { delete st.defeated[id]; });
    if (st.boulders) delete st.boulders.pc_gym1;
    if (st.cleared) delete st.cleared.pc_gym1;
    w.load('pc_gym1', 7, 8, 'up');
  }
  async function pcgOnLose(w) {
    pcgReset(w);
    await PK.fx.fadeIn(20);
    await PK.ui.say('HARROW (over a speaking tube): Back to the start. Boulders, carts, floor, wall. All of it. That\'s how the mountain works.');
    await PK.ui.say('The miners healed your Kits and reset every challenge in the hall.');
  }

  D('pc_gym1', {
    name: 'Challenge Hall: Boulders', interior: true, theme: 'gym_Terra', music: 'challenge',
    rows: [
      'WWWWWW...WWWWWW',
      'W.............W',
      'WWWWWWoooWWWWWW',
      'W.............W',
      'W.............W',
      'W..Q.......Q..W',
      'W.............W',
      'W.............W',
      'W......M......W'
    ],
    entry: [7, 7], statue: 'A stone statue of a miner holding a pickaxe high.',
    // the boulder gate can only be told solvable, not seen, by static analysis
    links: [['pc_gym1', 7, 1]],
    npcs: {
      b1: { at: [6, 4], sprite: 'boulder', push: true },
      b2: { at: [7, 4], sprite: 'boulder', push: true },
      b3: { at: [8, 4], sprite: 'boulder', push: true },
      t1: { at: [7, 1], sprite: 'miner', dir: 'down' }
    },
    eventsAt: guardRow(1, 'pcgym_1', 't1'),
    warpsAt: [[7, 0, 'pc_gym2', 7, 8, 'up']],
    onEnter: 'pcg_enter',
    lockExit: function () { return beat('pc_warden') ? null : 'The doors are barred shut. Carved over them: NO ONE LEAVES UNTIL THE CHALLENGE IS DONE.'; },
    onLose: pcgOnLose
  });

  D('pc_gym2', {
    name: 'Challenge Hall: Minecart', interior: true, theme: 'gym_Terra', music: 'challenge',
    rows: [
      'WWWWWW...WWWWWW',
      'W.............W',
      'W.............W',
      'W.............W',
      'W.............W',
      'Wy............W',
      'Wy............W',
      'Wyyyyy........W',
      'W.............W'
    ],
    entry: [7, 8],
    npcs: {
      t2: { at: [7, 1], sprite: 'miner2', dir: 'down' },
      gatem: { at: [7, 0], sprite: 'gate', noTurn: true, cond: notFlag('pcg_cart'), text: 'An iron gate. It\'s wired to the minecart track.' },
      gatem_l: { at: [6, 0], sprite: 'gate', noTurn: true, cond: notFlag('pcg_cart'), text: 'An iron gate. It\'s wired to the minecart track.' },
      gatem_r: { at: [8, 0], sprite: 'gate', noTurn: true, cond: notFlag('pcg_cart'), text: 'An iron gate. It\'s wired to the minecart track.' },
      panel: { at: [12, 3], sprite: 'panel', noTurn: true, talk: 'pcg_panel' }
    },
    eventsAt: guardRow(1, 'pcgym_2', 't2'),
    warpsAt: [[7, 0, 'pc_gym3', 7, 8, 'up']],
    onLose: pcgOnLose
  });

  D('pc_gym3', {
    name: 'Challenge Hall: Memory Floor', interior: true, theme: 'gym_Terra', music: 'challenge',
    rows: [
      'WWWWWW...WWWWWW',
      'WqqqqqqqqqqqqqW',
      'WqqqqqqqqqqqqqW',
      'WqqqqqqqqqqqqqW',
      'WqqqqqqqqqqqqqW',
      'WqqqqqqqqqqqqqW',
      'WqqqqqqqqqqqqqW',
      'WqqqqqqqqqqqqqW',
      'W.............W'
    ],
    entry: [7, 8],
    tileText: { y: 'Rails for the challenge minecart.' },
    npcs: { memory: { at: [1, 8], sprite: 'echo', note: 4, noTurn: true, talk: 'pcg_memory' } },
    warpsAt: [[7, 0, 'pc_gym4', 7, 8, 'up']],
    onStep: async function (w, x, y) {
      if (y < 1 || y > 7 || x < 1 || x > 13 || safe(x, y)) return false;
      if (PK.audio) PK.audio.sfx('smash');
      PK.fx.shake(14, 3);
      await PK.ui.say('CRACK! The floor crumbled away!');
      await PK.fx.fadeOut(14);
      w.load('pc_gym3', 7, 8, 'up');
      await PK.fx.fadeIn(14);
      await PK.ui.say('...You tumbled back down to the start of the room. The floor behind you creaks back into place.');
      return true;
    },
    onLose: pcgOnLose
  });

  D('pc_gym4', {
    name: 'Challenge Hall: Warden\'s Chamber', interior: true, theme: 'gym_Terra', music: 'challenge',
    rows: [
      'WWWWWWWWWWWWWWW',
      'W.............W',
      'W.............W',
      'W.............W',
      'W.............W',
      'WWWWWW...WWWWWW',
      'W.............W',
      'W.............W',
      'W.............W',
      'W......M......W'
    ],
    entry: [7, 8],
    exit: { map: 'pinecrest', x: 19, y: 13 },
    npcs: {
      harrow: { at: [7, 3], sprite: 'warden1', dir: 'down', talk: 'pcg_warden' },
      wall: { at: [7, 5], sprite: 'pickwall', noTurn: true, cond: notFlag('pcg_pick'), talk: 'pcg_pickwall' },
      wall_l: { at: [6, 5], sprite: 'pickwall', noTurn: true, cond: notFlag('pcg_pick'), talk: 'pcg_pickwall' },
      wall_r: { at: [8, 5], sprite: 'pickwall', noTurn: true, cond: notFlag('pcg_pick'), talk: 'pcg_pickwall' },
      t3: { at: [7, 7], sprite: 'miner', dir: 'down' }
    },
    eventsAt: guardRow(7, 'pcgym_3', 't3'),
    lockExit: function () { return beat('pc_warden') ? null : 'The doors are barred shut. Carved over them: NO ONE LEAVES UNTIL THE CHALLENGE IS DONE.'; },
    onLose: pcgOnLose
  });

  // ================= interiors =================
  room('pc_barn', 'Goat Barn', 'mill', 14, [
    'X.............', '..............', '..-----.-----.', '..............', '..............', '......M.......'
  ], {
    music: 'mountain', entry: [6, 7],
    warps: [['pc_barn_loft', 0, 3, 'down']],
    props: [['haybale', 2, 2], ['haybale', 3, 2], ['window', 5, 1], ['haybale', 9, 2], ['basket', 11, 2, { text: 'A basket of fresh eggs. Wait, goats don\'t lay eggs. Whose are these?' }], ['window', 12, 1], ['crate', 13, 2, { icon: 'milk' }], ['haybale', 0, 6], ['cart', 11, 6, { text: 'Milk cans, scrubbed and shining.' }]],
    npcs: {
      nell: { at: [4, 5], sprite: 'herder', dir: 'down', talk: 'pc_nell' },
      barngoat1: { at: [3, 3], sprite: 'kit:28', move: 'wander', text: 'A Crampling kid. It bleats at you and hops in place.' },
      barngoat2: { at: [10, 3], sprite: 'kit:29', move: 'look', text: 'A big Ledgeram. It watches the kids like a very serious babysitter.' }
    }
  });
  room('pc_barn_loft', 'Hayloft', 'mill', 14, ['X.............', '..............', '..............', '..............'], {
    music: 'mountain', warps: [['pc_barn', 0, 3, 'down']],
    props: [['haybale', 3, 2], ['haybale', 4, 2], ['haybale', 5, 2], ['haybale', 8, 4], ['haybale', 9, 4], ['window', 11, 1], ['chest', 12, 2, { text: 'A chest of old goat bells, each with a name painted on it.' }]],
    itemsAt: [['goatcheese', 2, 6, 3]],
    npcs: { hidekid: { at: [10, 3], sprite: 'kid', dir: 'down', text: 'Shh! I\'m hiding from chores. If Nell asks, I\'m a haybale.' } }
  });
  room('pc_home_a', 'Chalet', 'home', 12, ['............', '............', '............', '............', '....M.......'], {
    entry: [4, 6],
    props: [['window', 1, 1], ['stove', 2, 2], ['counter', 3, 2], ['fridge', 4, 2], ['painting', 6, 1, { art: 'kit', icon: 28, text: 'A child\'s drawing of a Crampling, with the word "BEST FRIEND" in giant letters.' }], ['window', 8, 1], ['bed', 10, 2, { color: '#3a8a4a' }], ['dining', 1, 4], ['rug', 6, 4, { w: 3, h: 2, color: '#3a8a4a' }], ['plant', 11, 5]],
    npcs: {
      amom: { at: [5, 3], sprite: 'villager1', dir: 'down', text: 'The blast rattled every plate in the house. Grey coats blowing up our road, then "logging" our grove. Logging! With dynamite!' },
      akid: { at: [8, 5], sprite: 'kid2', move: 'wander', text: 'Nell lets me brush the Crampling kids. They have the softest ears! Except when they headbutt you.' }
    }
  });
  room('pc_home_b', 'Chalet', 'cottage', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['trophycase', 0, 2, { text: 'Climbing medals from every peak in Lumora. One is just a painted rock labeled "TRIED".' }], ['photos', 3, 1, { text: 'Old photos of climbers roped together on an icy ridge.' }], ['fireplace', 6, 2], ['rope', 9, 2], ['bed', 10, 2, { color: '#5a6a8a' }], ['rug', 4, 4, { w: 3, h: 1, color: '#6a5a8a' }], ['couch', 7, 4, { color: '#8a5a3a' }]],
    npcs: { climber: { at: [2, 4], sprite: 'oldman', dir: 'right', talk: 'pc_oldclimber' } }
  });
  room('pc_home_c', 'Chalet', 'home', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['window', 1, 1], ['kettle', 2, 2], ['shelfjars', 3, 2], ['photos', 5, 1, { text: 'A photo of two young miners with soot on their faces, grinning. One of them has your grandpa\'s smile.' }], ['clock', 8, 1], ['wardrobe', 10, 2], ['table', 5, 4, { w: 2 }], ['plant', 0, 5], ['pickrack', 8, 1]],
    npcs: { edda: { at: [4, 3], sprite: 'oldwoman', dir: 'down', talk: 'pc_edda' } }
  });
  room('pc_home_d', 'Cheesemaker\'s Chalet', 'sitter', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['shelfjars', 0, 2, { text: 'Wheels of cheese aging on the shelves. The whole room smells tangy.' }], ['shelfjars', 1, 2, { text: 'More cheese. Some of it is older than you.' }], ['window', 3, 1], ['stove', 5, 2], ['counter', 6, 2, { w: 2 }], ['window', 9, 1], ['bed', 10, 2, { color: '#e8b040' }], ['table', 3, 4, { w: 2, icon: 'milk' }]],
    npcs: { cheesy: { at: [7, 4], sprite: 'baker', dir: 'left', talk: 'pc_cheese' } }
  });
  room('pc_home_e', 'Painter\'s Chalet', 'teller', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['painting', 1, 1, { art: 'hills', text: 'A painting of the summit at dawn, all gold and pink.' }], ['painting', 3, 1, { art: 'kit', icon: 42, text: 'A painting of a crystal-frilled Kit glowing in a dark cave. It looks almost too bright to be real.' }], ['painting', 5, 1, { art: 'map' }], ['desk', 8, 2, { text: 'Brushes, jars of ground-up crystal and a half-finished sketch of the grove.' }], ['bed', 10, 2, { color: '#7a3a5a' }], ['rug', 3, 4, { w: 3, h: 1, color: '#e8b040' }], ['plant', 0, 5]],
    npcs: { painter: { at: [6, 4], sprite: 'villager2', dir: 'left', text: 'I grind cave crystals into paint. The glowing ones make the best blues. The Accord bought up every crystal in town last month... all of them.' } }
  });
  room('pc_home_f', 'Ledge Chalet', 'bedroom', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['window', 1, 1, { variant: 'night' }], ['bed', 2, 2, { color: '#4a6a4a' }], ['fireplace', 5, 2], ['bookcase', 8, 2, { text: 'Books about avalanches, weather and knots. Lots and lots of knots.' }], ['clock', 10, 1], ['rug', 4, 4, { w: 4, h: 1, color: '#8a5a3a' }], ['cushion', 1, 5, { color: '#c85a3a' }]],
    npcs: {
      oldhusband: { at: [6, 4], sprite: 'oldman', dir: 'down', text: 'We\'ve lived on the High Ledge for fifty years. The mountain talks, if you listen. Lately it\'s been groaning.' },
      oldwife: { at: [9, 4], sprite: 'oldwoman', dir: 'left', text: 'The shrine at the summit is older than the town. Your grandfather used to sit up there for hours, reading the carvings.' }
    }
  });
  room('pc_guide', 'Guide Hut', 'cottage', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['painting', 1, 1, { art: 'map', text: 'A trail map of the whole mountain with every cave marked in red.' }], ['rope', 3, 2], ['bunk', 5, 2], ['window', 8, 1], ['telescope', 10, 2, { talk: 'pc_scope' }], ['table', 1, 4, { w: 2, icon: 'rope' }], ['crate', 11, 5, { icon: 'tent' }]],
    npcs: { maren: { at: [7, 4], sprite: 'guide', dir: 'down', talk: 'pc_maren' } }
  });
  room('pc_inn', 'Summit Inn', 'lodge', 16, [
    '...............X', '................', '................', '................', '................', '.......M........'
  ], {
    music: 'mountain', entry: [7, 7],
    warps: [['pc_inn2', 15, 3, 'down']],
    props: [['counter', 0, 2, { w: 3 }], ['shelfjars', 3, 2], ['window', 4, 1], ['fireplace', 6, 2], ['window', 8, 1], ['clock', 10, 1], ['bookcase', 11, 2, { text: 'Guest books going back a hundred years. Page after page of "the stairs, THE STAIRS".' }], ['pc', 13, 2],
      ['dining', 2, 5], ['dining', 11, 5], ['rug', 6, 4, { w: 4, h: 2, color: '#b8484e' }], ['plant', 0, 6], ['plant', 15, 6]],
    npcs: {
      greta: { at: [1, 3], sprite: 'innkeeper', dir: 'down', talk: 'pc_innkeeper' },
      poet: { at: [5, 5], sprite: 'teacher', dir: 'right', text: 'The pines, they whisper... no. The pines, they WHISTLE. Hmm. Mountains are hard to rhyme with.' },
      diner: { at: [14, 5], sprite: 'hiker', dir: 'left', text: 'Get the Camp Stew. Trust me. I came for one night and I\'ve been here a week.' }
    }
  });
  room('pc_inn2', 'Summit Inn 2F', 'lodge', 16, [
    'X...W....W.....X', '....W....W......', '....W....W......', '................', '................'
  ], {
    music: 'mountain',
    warps: [['pc_inn3', 0, 3, 'down'], ['pc_inn', 15, 3, 'down']],
    props: [['bed', 1, 3, { color: '#b8484e' }], ['bed', 5, 2, { color: '#e87a9a' }], ['bed', 6, 2, { color: '#e87a9a' }], ['desk', 12, 2, { text: 'Rock samples, labeled in tiny handwriting: "quartz", "more quartz", "WHY is there so much quartz".' }], ['microscope', 13, 2], ['plant', 7, 6], ['rug', 1, 6, { w: 4, h: 1, color: '#6a5a8a' }]],
    npcs: {
      honey1: { at: [6, 4], sprite: 'villager1', dir: 'right', text: 'We came up for the view! Then someone blew up the road behind us. Very romantic. Very loud.' },
      honey2: { at: [7, 4], sprite: 'villager3', dir: 'left', text: 'She says romantic. I say we\'re stuck. At least the stew is good.' },
      geologist: { at: [11, 3], sprite: 'prof', dir: 'right', text: 'The crystal vein under the grove runs deeper than anyone guessed. And the old tablet legend says it was sealed on purpose. Sealed! Why seal a crystal vein?' }
    }
  });
  room('pc_inn3', 'Attic Room', 'lodge', 12, ['X...........', '............', '............', '............'], {
    music: 'mystery', warps: [['pc_inn2', 0, 3, 'down']],
    props: [['window', 5, 1, { variant: 'night' }], ['bedroll', 8, 2], ['crate', 11, 2, { icon: 'tent' }], ['candles', 3, 4, { text: 'Burned-down candles and a scrap of paper with a drawing of half a stone tablet.' }]],
    npcs: {
      lodger: { at: [8, 4], sprite: 'cinder', dir: 'left', cond: notFlag('grotto_done'), text: 'QUIET GUEST: ...I\'m just a traveler. A traveler in a grey cloak. Who likes grey. Please leave.' },
      note: { at: [9, 2], sprite: 'item', cond: flag('grotto_done'), talk: 'pc_atticnote' }
    }
  });
  room('pc_gear', 'Ridge Gear', 'shop', 14, ['..............', '..cccccc......', '..............', '..............', '......M.......'], {
    music: 'shop', entry: [6, 6], wall1: 'WWWWWWWWWWWWW%',
    warpsAt: [[13, 1, 'pc_gear_store', 5, 5, 'up']],
    props: [['rope', 0, 2], ['pickrack', 2, 1], ['window', 5, 1], ['breadrack', 9, 2, { text: 'Racks of climbing boots in every size.' }], ['rope', 11, 2], ['crate', 12, 5, { icon: 'rope' }], ['plant', 0, 5]],
    npcs: { clerk: { at: [4, 2], sprite: 'guide', dir: 'down', talk: 'shop', stock: ['capsule', 'pluscapsule', 'tonic', 'hitonic', 'remedy', 'hushspray', 'exitcord', 'smokepellet'] } }
  });
  room('pc_gear_store', 'Stockroom', 'shop', 12, ['............', '............', '............', '.....M......'], {
    exit: { map: 'pc_gear', x: 13, y: 2 }, entry: [5, 5],
    props: [['crate', 0, 2, { icon: 'rope' }], ['crate', 1, 2, { icon: 'pick' }], ['crate', 2, 2], ['sacks', 5, 2], ['rope', 8, 2], ['crate', 10, 2, { icon: 'tent' }], ['crate', 11, 2]],
    itemsAt: [['smokepellet', 2, 10, 4]],
    npcs: { stockboy: { at: [6, 3], sprite: 'boy', dir: 'down', text: 'Inventory day. I\'ve counted the rope six times. It\'s either 40 coils or 41. It keeps changing.' } }
  });
  room('pc_bath', 'Bathhouse', 'spa', 14, ['..............', '.cccc.........', '..............', '..............', '......M.......'], {
    music: 'clinic', entry: [6, 6], wall1: 'WWWWWWWWWW%WWW',
    warpsAt: [[10, 1, 'pc_bath_spring', 6, 7, 'up']],
    props: [['shelfjars', 0, 2, { text: 'Folded towels, stacked in perfect towers.' }], ['window', 7, 1], ['plant', 12, 2], ['couch', 1, 5, { color: '#3e6e8a' }], ['plant', 13, 5], ['clock', 5, 1], ['pc', 9, 2]],
    npcs: { hollis: { at: [2, 2], sprite: 'bathkeeper', dir: 'down', talk: 'pc_bathkeeper' } }
  });
  room('pc_bath_spring', 'Hot Spring', 'spa', 14, ['..............', '..............', '..............', '..............', '..............', '......M.......'], {
    music: 'clinic', exit: { map: 'pc_bath', x: 10, y: 2 }, entry: [6, 7],
    props: [['spring', 1, 2], ['spring', 9, 2], ['window', 5, 1], ['window', 8, 1], ['plant', 0, 6], ['plant', 13, 6], ['cushion', 5, 5, { color: '#5a8aa8' }]],
    npcs: {
      soaker: { at: [5, 3], sprite: 'oldman', dir: 'down', text: 'Ahhh. My knees are twenty years younger in here. The rest of me is still eighty.' },
      offduty: { at: [12, 5], sprite: 'cinder2', dir: 'left', cond: notFlag('grotto_done'), text: 'OFF-DUTY CINDER: I\'m on my break. Don\'t tell the Elder I\'m in here. Or that the grotto dig is behind schedule. Or that there even IS a grotto.' },
      gossip: { at: [8, 5], sprite: 'villager2', dir: 'left', text: 'Heard the Warden up top used to mine with your grandpa. They say Harrow hasn\'t smiled since.' }
    }
  });
  room('pc_miners', 'Miners\' Hall', 'mill', 16, ['................', '................', '................', '................', '.......M........'], {
    music: 'mine', entry: [7, 6], wall1: 'WWWWWWWWWWWWWWW%',
    warpsAt: [[15, 1, 'pc_miners_bunk', 5, 5, 'up']],
    props: [['pickrack', 0, 1], ['stove', 2, 2], ['board', 4, 1, { text: 'NOTICE BOARD: "Tunnel 3 closed - strange noises." "Lost: one helmet, answers to Gus." "Do NOT feed the Bouldrone."' }], ['window', 7, 1], ['painting', 9, 1, { art: 'map', text: 'A map of the mine. One tunnel at the top right has been scratched out and labeled "SEALED".' }], ['pickrack', 11, 1], ['dining', 3, 4], ['dining', 9, 4], ['crate', 14, 2, { icon: 'pick' }]],
    npcs: {
      dunmore: { at: [7, 3], sprite: 'miner', dir: 'down', talk: 'pc_dunmore' },
      eater: { at: [2, 5], sprite: 'miner2', dir: 'right', text: 'Stew, bread, stew again. Miner\'s diet. Keeps you strong for swinging a pick all day.' },
      cardplayer: { at: [12, 5], sprite: 'miner', dir: 'left', text: 'Warden Harrow runs the Challenge Hall at the summit. Boulders, carts, a floor that eats you, and a wall. Then Harrow. Good luck.' }
    }
  });
  room('pc_miners_bunk', 'Bunk Room', 'mill', 12, ['............', '............', '............', '.....M......'], {
    exit: { map: 'pc_miners', x: 15, y: 2 }, entry: [5, 5],
    props: [['bunk', 0, 2], ['bunk', 2, 2], ['bunk', 7, 2], ['bunk', 9, 2], ['chest', 11, 2, { text: 'A footlocker. Socks. So many socks.' }], ['lantern', 5, 2]],
    npcs: { napper: { at: [4, 4], sprite: 'miner2', dir: 'down', text: 'Zzz... five more minutes... zzz... no, the OTHER cart...' } }
  });
  room('pc_carver', 'Stonecarver', 'workshop', 12, ['............', '............', '............', '....M.......'], {
    music: 'shop', entry: [4, 5], wall1: 'WWWWWWWWWWW%',
    warpsAt: [[11, 1, 'pc_carver_gal', 5, 5, 'up']],
    props: [['workbench', 0, 2, { text: 'Chisels, mallets and a block of stone that is slowly becoming a Pebbeetle.' }], ['statue', 3, 2, { icon: 31 }], ['window', 5, 1], ['statue', 7, 2, { icon: 26 }], ['millstone', 9, 4, { text: 'A round grinding stone for sharpening chisels.' }], ['crate', 0, 5, { icon: 'chisel' }]],
    npcs: { oswin: { at: [5, 3], sprite: 'carver', dir: 'down', talk: 'pc_oswin' } }
  });
  room('pc_carver_gal', 'Statue Gallery', 'workshop', 12, ['............', '............', '............', '.....M......'], {
    exit: { map: 'pc_carver', x: 11, y: 2 }, entry: [5, 5],
    props: [['statue', 0, 2, { icon: 28 }], ['statue', 2, 2, { icon: 30 }], ['statue', 4, 2, { icon: 33 }], ['statue', 7, 2, { icon: 40 }], ['statue', 9, 2, { icon: 45 }], ['statue', 11, 2, { icon: 47 }], ['rug', 3, 4, { w: 6, h: 1, color: '#6a5a8a' }]],
    npcs: { visitor: { at: [8, 4], sprite: 'girl', dir: 'up', text: 'Oswin carves every Kit on the mountain. He says the hardest one was a Crampling that would not sit still.' } }
  });
  room('pc_cable_base', 'Cable Car Station', 'lab', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['window', 1, 1], ['window', 3, 1], ['gearwall', 6, 1], ['counter', 8, 2, { w: 2 }], ['painting', 11, 1, { art: 'map', text: 'CABLE CAR: Base Camp to Summit. The far-side line to the next valley is closed for repairs.' }], ['plant', 0, 5]],
    npcs: { opbase: { at: [9, 3], sprite: 'clerk', dir: 'down', talk: 'pc_cable' } }
  });
  room('pc_cable_top', 'Summit Station', 'lab', 12, ['............', '............', '............', '....M.......'], {
    entry: [4, 5],
    props: [['window', 1, 1, { variant: 'night' }], ['gearwall', 3, 1], ['telescope', 6, 2, { talk: 'pc_scope' }], ['counter', 8, 2, { w: 2 }], ['window', 11, 1], ['plant', 11, 5]],
    npcs: { optop: { at: [9, 3], sprite: 'clerk', dir: 'down', talk: 'pc_cable' } }
  });
  room('pc_shrine', 'Summit Shrine', 'tower', 12, ['............', '............', '............', '............', '....M.......'], {
    music: 'tender', entry: [4, 6],
    props: [['candles', 1, 2], ['candles', 10, 2], ['statue', 3, 3, { icon: 42 }], ['statue', 8, 3, { icon: 42 }], ['rug', 4, 4, { w: 4, h: 2, color: '#6a5a8a' }]],
    npcs: { keeper: { at: [6, 2], sprite: 'oldwoman', dir: 'down', talk: 'pc_shrinekeeper' } }
  });

  // ================= scripts =================
  S.pc_enter = async function (w) {
    if (!PK.quest.has('mountain') && !PK.quest.done('mountain')) {
      if (PK.quest.has('trail') && !PK.quest.done('trail')) PK.quest.complete('trail');
      PK.quest.start('mountain');
    }
  };
  S.pc_scope = async function (w) {
    await w.say('You peek through the telescope...');
    if (PK.showView) await PK.showView('hills');
    await w.say('The whole valley is spread out below. You can see the Willow winding all the way down to Brookhollow.');
  };

  // --- the grove: the sibling with the Accord
  S.pc_grove = async function (w) {
    var sib = w.npc('grovesib'), a = w.npc('groveA'), b = w.npc('groveB');
    w.music('mystery');
    w.playerFace('right');
    await w.say('Through the fence you can see stumps... dozens of them. Grey cloaks are hauling logs away from a deep pit in the middle of the grove.');
    await w.say('CINDER: The roots are too deep! We need the heavy charges, not these firecrackers.');
    await w.say('???: Then stop blasting the roots. The vein runs sideways under the High Ledge. Blow the ledge, open the vein from above.');
    await w.say('That voice...!');
    if (sib) await w.emote(sib, '...');
    await w.say('It\'s {RIVAL}! Standing with the Ashen Accord like they belong there!');
    await w.say('CINDER: The kid\'s smarter than you, Brask. The Elder will like that. Go set the charge.');
    if (sib) { sib.dir = 'left'; await w.emote(sib, '!'); }
    await w.say('{RIVAL}: ...Who\'s that? Just some village kid. Probably lost.');
    await w.say('{RIVAL}: Hey, kid. This is a logging site. Get lost before you get hurt.');
    await w.say('({RIVAL} didn\'t even blink. As if you were a stranger.)');
    if (a) { await w.moveNpc(a, 'rr'); a.hidden = true; }
    if (sib) { await w.moveNpc(sib, 'rrr'); sib.hidden = true; }
    if (b) { await w.moveNpc(b, 'rr'); b.hidden = true; }
    w.setFlag('grove_seen');
    await w.wait(40);
    // the blast on the High Ledge
    if (PK.audio) PK.audio.sfx('smash');
    PK.fx.shake(50, 4);
    PK.fx.flash(10, '#ffffff');
    await w.wait(30);
    await w.say('BOOOOM! The whole mountain shudders. Somewhere above, rocks thunder down the slope!');
    if (PK.audio) PK.audio.sfx('smash');
    PK.fx.shake(30, 3);
    await w.say('A MINER shouts from the path: "AVALANCHE on the High Ledge! Get the guide! Someone was up there!"');
    w.setFlag('avalanche');
    PK.quest.advance('mountain', 'rescue');
    w.playMapMusic();
  };

  // --- High Ledge rescue
  S.pc_maren = async function (w) {
    if (PK.quest.at('mountain', 'rescue')) {
      await w.say('GUIDE MAREN: You heard the blast too? A hiker was camping on the east ledge. The rocks came down right on top of the camp!');
      await w.say('GUIDE MAREN: I can hear someone shouting under there. The rocks are too heavy for me alone. Help me dig! East side, past the telescope.');
      w.setFlag('maren_asked');
      return;
    }
    if (g().flag('rescued') && !g().flag('maren_thanks')) {
      w.setFlag('maren_thanks');
      await w.say('GUIDE MAREN: You got the hiker out! And that other kid helped? Whoever they are, they dig like a Bouldrone.');
      await w.say('GUIDE MAREN: Take these. A guide never climbs without them.');
      await w.give('hitonic', 2);
      return;
    }
    await w.say('GUIDE MAREN: Every cave on this mountain is on my map. The dark one needs a lamp. The echo one needs... patience.');
  };
  S.pc_mound = async function (w, n) {
    if (!PK.quest.at('mountain', 'rescue')) return w.say('A heap of rocks and snow.');
    if (!g().flag('sib_rescue')) {
      var sib = w.npc('sibrescue');
      if (sib) {
        sib.hidden = false;
        w.music('sibling');
        await w.emote(sib, '!');
        await w.say('{RIVAL}: ...Move over. You dig that side, I\'ll take the big ones.');
        await w.say('{RIVAL}: Don\'t look at me like that. I didn\'t know they\'d set it off with someone up here.');
        w.playMapMusic();
      }
      w.setFlag('sib_rescue');
    }
    await w.say('You heave rocks and scoop snow away as fast as you can...');
    if (PK.audio) PK.audio.sfx('smash');
    w.setFlag(n.id);
    n.hidden = true;
    if (!(g().flag('mound1') && g().flag('mound2') && g().flag('mound3'))) return w.say('{RIVAL} grunts and shoves another boulder aside. Keep digging!');
    var hk = w.npc('trapped');
    await w.say('The last rock rolls away!');
    if (hk) await w.emote(hk, '!');
    await w.say('HIKER: Air! Sky! You two are the best! I thought I\'d be a snowman forever!');
    await w.say('HIKER: Here, I was saving these for the summit. You earned them.');
    await w.give('spicejerky', 2);
    w.setFlag('rescued');
    var s2 = w.npc('sibrescue');
    if (s2) w.facePlayer(s2);
    w.music('sibling');
    await w.say('{RIVAL}: ...Fine. You\'re not useless. But you shouldn\'t be here, {PLAYER}. These people are dangerous.');
    await w.say('{RIVAL}: Let me prove it. If you can\'t beat me, you go home.');
    var r = await w.battle('sibling2', { canLose: true });
    if (r === 'win') await w.say('{RIVAL}: ...Tch. Okay. Okay! You\'re stronger than you were at the weir.');
    else await w.say('{RIVAL}: See? Go home. Please.');
    PK.game.healParty();
    await w.say('{RIVAL}: I\'m heading to the summit. There\'s something at the old shrine I need to see. Don\'t follow me.');
    if (s2) { await w.moveNpc(s2, 'lluu'); s2.hidden = true; }
    PK.quest.advance('mountain', 'summit');
    w.playMapMusic();
  };

  // --- summit: the sibling waits by the shrine
  S.pc_peak_sib = async function (w) {
    var sib = w.npc('sibpeak');
    if (!sib) return;
    w.music('sibling');
    await w.emote(sib, '!');
    await w.say('{RIVAL}: Of course you followed me.');
    await w.say('{RIVAL}: I read the shrine carvings. There was a tablet once. Two halves. Grandpa and the first Elders split it, so nobody could wake what\'s under the mountain.');
    await w.say('{RIVAL}: The Accord wants both halves back together. And Grandpa... Grandpa knew where they were. That\'s why he disappeared.');
    await w.say('{RIVAL}: I\'m getting close. I need them to trust me. So you need to STOP showing up.');
    await w.say('{RIVAL}: Last chance. Beat me, or turn around.');
    var r = await w.battle('sibling3', { canLose: true });
    PK.game.healParty();
    if (r === 'win') {
      await w.say('{RIVAL}: ...');
      await w.say('{RIVAL}: Fine. Then win the Challenge Hall. Harrow gives the winners a pickaxe. The Accord sealed their tunnel from the mine side, and a pickaxe opens it.');
      await w.say('{RIVAL}: I didn\'t tell you that.');
    } else {
      await w.say('{RIVAL}: Go home, {PLAYER}. I mean it.');
      await w.say('{RIVAL} hesitates, then mutters: "...The Warden\'s pickaxe opens the mine tunnel. Not that you\'ll need it."');
    }
    await w.moveNpc(sib, 'lllll');
    sib.hidden = true;
    PK.quest.advance('mountain', 'gym');
    w.playMapMusic();
  };

  // --- gym
  S.pc_gym_warn = async function (w) {
    await w.say('A miner stands by the door: "The Pinecrest Challenge Hall. Once you\'re in, the doors lock until you beat Warden Harrow. No leaving. No exceptions."');
    if (await w.yesno('Are you ready to take the challenge?')) {
      w.setFlag('gym1_warned');
      await w.say('"Good luck. Mind the floor."');
    } else {
      await w.say('"Smart. Heal up and stock up first. The Hall isn\'t going anywhere."');
      await w.movePlayer('d');
    }
  };
  S.pcg_enter = async function (w) {
    if (beat('pc_warden')) return;
    if (!w.flag('pcg_locked')) {
      w.setFlag('pcg_locked');
      if (PK.audio) PK.audio.sfx('smash');
      PK.fx.shake(10, 2);
      await w.say('KA-CHUNK! The doors slam shut and a heavy bar drops across them.');
      await w.say('HARROW (over a speaking tube): Four challenges. Three of my miners. Then me. Nobody leaves until it\'s done. No shortcuts, no help from outside these doors.');
    }
  };
  S.pcg_panel = async function (w) {
    if (w.flag('pcg_cart')) return w.say('The panel shows a green light. The gate is open.');
    await w.say('A control panel for the challenge minecart. Flip the three switches, then send the cart. If it reaches the exit, the gate opens.');
    var ok = await PK.minigame.minecart(PK.MINECART_GYM);
    w.playMapMusic();
    if (!ok) return w.say('You stepped away from the panel.');
    w.setFlag('pcg_cart');
    if (PK.audio) PK.audio.sfx('door');
    await w.say('DING! The cart rolls into the exit and the iron gate grinds open!');
  };
  S.pcg_memory = async function (w) {
    await w.say('A glowing stone. Touching it lights up the safe stones across the cracked floor... but only for a moment. Watch closely!');
    w.hl = { tiles: SAFE, t: 170, color: 'rgba(140,255,170,0.55)' };
    await w.wait(170);
    await w.say('The glow faded. Every stone looks the same again.');
  };
  S.pcg_pickwall = async function (w) {
    if (!(await w.yesno('A wall of rock with a gold seam running through it. A pickaxe leans against it. Swing at the seam?'))) return;
    var ok = await PK.minigame.pickaxe({ hits: 3, speed: 1.8, zone: 26 });
    w.playMapMusic();
    if (!ok) return w.say('You set the pickaxe down to catch your breath.');
    w.setFlag('pcg_pick');
    PK.fx.shake(16, 3);
    await w.say('The wall crumbles into gravel! The Warden\'s chamber is open.');
  };
  S.pcg_warden = async function (w, n) {
    var st = g().state;
    if (beat('pc_warden')) return w.say('HARROW: Go on. The mine won\'t open itself. And... read that note, kid.');
    w.music('gym');
    await w.say('HARROW: So. You moved my boulders, fixed my tracks, didn\'t fall through my floor, and broke my wall.');
    await w.say('HARROW: I knew your grandfather. We dug this mountain together, back before he... left. You have his stubborn chin.');
    await w.say('HARROW: Harrow. Warden of Pinecrest. I dig, I battle, and I don\'t talk much. Show me what you\'ve got.');
    var r = await w.battle('pc_warden');
    if (r !== 'win') return;
    await w.say('HARROW: ...Hah. You\'ve got stone in your bones.');
    if (PK.audio) PK.audio.jingle('keyitem');
    st.crests = st.crests || [];
    st.crests[0] = true;
    await w.say(st.player.name + ' received the Summit Crest from Warden Harrow!');
    await w.say('HARROW: The Summit Crest. The cable car crews will let you ride now, too.');
    w.setFlag('cable_ok');
    await w.give('sd09');
    await w.say('HARROW: That disc teaches Landslide. Bury them in rock.');
    await w.give('pickaxe');
    await w.say('HARROW: And a real pickaxe. Cracked rocks all over Lumora will crumble for you now.');
    await w.say('HARROW: One more thing. I\'ve kept this for years. Your grandfather left it in the mine the day he walked away.');
    await w.give('grandpahelmet');
    await w.say('There\'s a folded note tucked inside the helmet band...');
    await w.say('"If you are reading this, they found the vein. The tablet is the key, not the crystals. Keep the halves apart. Whatever happens, keep them APART."');
    await w.say('HARROW: The Accord sealed an old tunnel in my mine, top right corner. Break it open. Stop them. For him.');
    PK.quest.advance('mountain', 'mine');
    w.playMapMusic();
  };

  // --- the mine door and the grotto showdown
  S.pc_mine_door = async function (w, n) {
    if (!g().count('pickaxe')) return w.say('A heavy door of timber and iron, stamped with an ember. Rubble has been packed around the edges. You\'d need a pickaxe to break through.');
    if (!(await w.yesno('The Accord\'s sealed door. Break it open with the Pickaxe?'))) return;
    if (PK.audio) PK.audio.sfx('smash');
    PK.fx.shake(20, 3);
    await w.say('CRUNCH! The rubble gives way and the door swings open. Cold, glittering light spills out of the tunnel beyond.');
    w.setFlag('mine_door');
    n.hidden = true;
    if (PK.quest.at('mountain', 'mine')) PK.quest.advance('mountain', 'grotto');
  };
  S.pc_elder = async function (w) {
    var el = w.npc('elder');
    if (!el) return;
    w.music('syndicate');
    await w.emote(el, '!');
    await w.say('???: Harrow\'s pickaxe. Of course. That old man never could leave a door closed.');
    await w.say('ELDER MORROW: I am Morrow, an Elder of the Ashen Accord. And you... you have HIS face.');
    await w.say('ELDER MORROW: Your grandfather broke the tablet and hid the halves, so nobody could finish what we started. Purify the valley. Wake what sleeps under this mountain.');
    await w.say('ELDER MORROW: We found the first half here, in the crystal. He was very good at hiding things. Not good enough.');
    await w.say('ELDER MORROW: Now, child. Stand aside, or be buried with the rest of the grove.');
    var r = await w.battle('elder_morrow');
    if (r !== 'win') return;
    w.music('mystery');
    await w.say('ELDER MORROW: ...Enough.');
    await w.say('The Elder lifts a slab of carved stone from the crystal wall... and slams it down on a rock. CRACK!');
    if (PK.audio) PK.audio.sfx('smash');
    PK.fx.shake(20, 3);
    PK.fx.flash(8, '#ffffff');
    await w.say('ELDER MORROW: Keep that half, then. It is useless without mine. And we will find the rest of your grandfather\'s secrets. We always do.');
    await PK.fx.fadeOut(16);
    el.hidden = true;
    await PK.fx.fadeIn(16);
    await w.say('The Elder vanished in a cloud of ash. Half of the stone tablet lies on the floor.');
    await w.give('tablethalf');
    w.setFlag('grotto_done');
    await w.say('Something squeaks in the corner. A little Kit is trapped behind a wall of Accord crates!');
    w.playMapMusic();
  };
  S.pc_cage = async function (w, n) {
    if (!g().flag('grotto_done')) return w.say('A Quartzel is trapped behind stacked crates. It squeaks at you, then glares at the grey cloaks.');
    await w.say('You push the crates aside. The Quartzel scurries out... and climbs right onto your shoulder.');
    await w.say('It seems it wants to come with you!');
    w.setFlag('quartz_freed');
    n.hidden = true;
    await w.giveKit(40, 15);
    PK.quest.complete('mountain');
    await w.say('The grotto is quiet now. Water drips from the crystals like a slow, gentle bell.');
    await w.say('Half a tablet, a note from Grandpa, and {RIVAL} still out there with the Accord...');
  };
  S.pc_atticnote = async function (w, n) {
    await w.say('The quiet guest left in a hurry. A note is pinned to the bedroll:');
    await w.say('"To B.: The Elder is leaving Pinecrest with the half. Next stop is by the sea. Bring the sibling. The Elder trusts them now. - K."');
    n.hidden = true;
    w.setFlag('attic_note');
  };

  // --- side quests
  S.pc_nell = async function (w) {
    var q = PK.quest;
    if (!q.has('goats') && !q.done('goats')) {
      await w.say('HERDER NELL: Oh, thank goodness, a Keeper! That blast spooked my herd. Four Crampling kids jumped the fence and scattered all over the mountain!');
      await w.say('HERDER NELL: They love ledges, the higher and sillier the better. If you find them, just say hello. They\'ll follow the smell of the barn home.');
      q.start('goats');
      return;
    }
    if (q.at('goats', 'return')) {
      await w.say('HERDER NELL: All four are back! Look at them, pretending nothing happened.');
      await w.give('mountainmilk', 3);
      await w.say('HERDER NELL: And... this little one keeps following you around. I think it\'s picked its Keeper.');
      await w.giveKit(28, 12);
      q.complete('goats');
      return;
    }
    if (q.done('goats')) return w.say('HERDER NELL: The herd\'s calm again. Come by for milk any time! The stall at Base Camp sells it fresh.');
    var n = ['goat1', 'goat2', 'goat3', 'goat4'].filter(function (f) { return g().flag(f); }).length;
    await w.say('HERDER NELL: ' + n + ' of 4 kids are home. Try the high places. They LOVE the high places.');
  };
  S.pc_goat = async function (w, n) {
    await w.say('A runaway Crampling kid! It sniffs your hand, sneezes, and bounds off down the mountain toward the barn.');
    w.setFlag(n.id);
    n.hidden = true;
    var all = ['goat1', 'goat2', 'goat3', 'goat4'].every(function (f) { return g().flag(f); });
    if (all) { PK.quest.advance('goats', 'return'); await w.say('That was the last one! Nell will want to know.'); }
  };
  S.pc_dunmore = async function (w) {
    var q = PK.quest;
    if (!g().flag('got_lamp')) {
      await w.say('FOREMAN DUNMORE: A young Keeper! If you\'re poking around our caves, take this. Blackrock Cave is dark as the inside of a boot.');
      await w.give('minerlamp');
      w.setFlag('got_lamp');
    }
    if (!q.has('fossil') && !q.done('fossil')) {
      await w.say('FOREMAN DUNMORE: And if you like digging, the old tunnels are full of buried things. Look for loose soil with something shiny poking out. Here\'s a trowel.');
      q.start('fossil');
      return;
    }
    if (q.at('fossil', 'carver')) return w.say('FOREMAN DUNMORE: An Amber Fossil! Oswin the stonecarver can chip it free. He\'s done it before, you know.');
    if (q.done('fossil')) return w.say('FOREMAN DUNMORE: A living fossil Kit. My granddad would\'ve fainted.');
    await w.say('FOREMAN DUNMORE: Four spots of loose soil in the mine, last I checked. Happy digging!');
  };
  var DIG = { dig1: ['spicejerky', 2], dig2: ['pluscapsule', 2], dig3: ['amberfossil', 1], dig4: ['boostcandy', 1] };
  S.pc_dig = async function (w, n) {
    if (!PK.quest.has('fossil') && !PK.quest.done('fossil')) return w.say('Loose soil with something shiny poking out. The foreman in the Miners\' Hall hands out trowels.');
    await w.say('You dig into the loose soil with the trowel...');
    if (PK.audio) PK.audio.sfx('cut');
    var d = DIG[n.id];
    w.setFlag(n.id);
    n.hidden = true;
    await w.give(d[0], d[1]);
    if (d[0] === 'amberfossil') { await w.say('It\'s a Kit, sealed inside a lump of golden amber! The stonecarver might be able to free it.'); PK.quest.advance('fossil', 'carver'); }
  };
  S.pc_oswin = async function (w) {
    if (PK.quest.at('fossil', 'carver') && g().count('amberfossil')) {
      await w.say('OSWIN: Ohhh. Amber. And there\'s something alive in there, sleeping. Give me a moment.');
      await PK.fx.fadeOut(20);
      if (PK.audio) PK.audio.sfx('smash');
      await w.wait(30);
      if (PK.audio) PK.audio.sfx('smash');
      await PK.fx.fadeIn(20);
      g().removeItem('amberfossil', 1);
      await w.say('OSWIN: Tap, tap... there. It\'s waking up!');
      await w.giveKit(43, 15);
      PK.quest.complete('fossil');
      return;
    }
    await w.say('OSWIN: I carve what the mountain shows me. Every Kit up here has sat for me at least once. Well. Sat. Or hopped. Crampling don\'t sit.');
  };
  var SONG = [2, 0, 3, 1];
  S.pc_carving = async function (w) {
    await w.say('Four colored notes are carved into the rock: GREEN, RED, BLUE, YELLOW. Underneath: "Sing as the mountain sang, and the mountain will open."');
    if (!PK.quest.has('echo') && !PK.quest.done('echo')) PK.quest.start('echo');
  };
  S.pc_echo = async function (w, n) {
    var note = n.d.note;
    n.glow = 40;
    if (PK.audio) PK.audio.sfx(['select', 'emote', 'statup', 'exp'][note] || 'select');
    if (g().flag('echo_open')) return w.say('The stone rings softly. The passage is already open.');
    w.echoSeq = w.echoSeq || [];
    w.echoSeq.push(note);
    var k = w.echoSeq.length - 1;
    if (w.echoSeq[k] !== SONG[k]) {
      w.echoSeq = [];
      return w.say('The stone rings... but the echoes clash and fade into silence. Start the song again.');
    }
    if (w.echoSeq.length < SONG.length) return w.say(['The stone rings and the cave hums along.', 'Two notes echo together!', 'Three notes shimmer through the cave!'][k]);
    w.echoSeq = [];
    if (PK.audio) PK.audio.jingle('keyitem');
    PK.fx.shake(20, 2);
    await w.say('All four notes ring out together... and the stone slabs at the back of the cave grind apart!');
    w.setFlag('echo_open');
    if (!PK.quest.has('echo')) PK.quest.start('echo');
    PK.quest.complete('echo');
  };

  // --- townsfolk with more to say
  S.pc_innkeeper = async function (w) {
    var pick = await w.ask('GRETA: Welcome to the Summit Inn! What can I do for you?', ['Rest (free)', 'Buy food', 'Nothing']);
    if (pick === 0) {
      await PK.fx.fadeOut(20); await w.heal(); await PK.fx.fadeIn(20);
      g().state.clinic = { map: 'pc_inn', x: 1, y: 4 };
      return w.say('GRETA: Rested and ready! Climbers sleep free here. It\'s a Pinecrest tradition.');
    }
    if (pick === 1) return PK.menus.shop(['campstew', 'goatcheese', 'mountainmilk', 'honeybun']);
  };
  S.pc_bathkeeper = async function (w) {
    if (!(await w.yesno('HOLLIS: Welcome to the bathhouse! Let your Kits soak in the hot spring?'))) return w.say('HOLLIS: The water\'s always warm. Come back any time.');
    await PK.fx.fadeOut(20); await w.heal(); await PK.fx.fadeIn(20);
    g().state.clinic = { map: 'pc_bath', x: 2, y: 4 };
    await w.say('HOLLIS: Warm, clean and happy! If you ever get knocked out on the mountain, the miners will carry you here.');
  };
  S.pc_cable = async function (w) {
    var top = w.map.id === 'pc_cable_top';
    if (!g().flag('cable_ok')) return w.say('OPERATOR: Sorry! The cable car is only for Summit Crest holders. Mountain rules. Win the Challenge Hall and hop on any time.');
    var pick = await w.ask('OPERATOR: Where to, Crest holder?', [top ? 'Down to Base Camp' : 'Up to the Summit', 'The far-side line', 'Stay here']);
    if (pick === 1) return w.say('OPERATOR: The line down the far side of the mountain is still being repaired. The cable snapped in the blast. Soon!');
    if (pick !== 0) return;
    if (PK.audio) PK.audio.sfx('door');
    await PK.fx.fadeOut(20);
    await w.say('The little red car sways out over the pines...', { auto: 80 });
    if (top) w.load('pinecrest', 45, 67, 'down'); else w.load('pinecrest_peak', 31, 14, 'down');
    await PK.fx.fadeIn(20);
  };
  S.pc_oldclimber = async function (w) {
    if (!w.flag('climber_gift')) {
      w.setFlag('climber_gift');
      await w.say('OLD CLIMBER: Every peak in Lumora, I\'ve stood on it. Now my knees stand on this rug. Take these, they kept me fast on the ice.');
      await w.give('swiftsnap', 2);
      return;
    }
    await w.say('OLD CLIMBER: Three points of contact, always. And never trust a ledge a Crampling won\'t stand on.');
  };
  S.pc_edda = async function (w) {
    await w.say('EDDA: You\'re his grandchild, aren\'t you? You stand just like him.');
    await w.say('EDDA: My husband and your grandfather worked the deep tunnels together, with Harrow. The three of them found something down there once. They never told me what.');
    await w.say('EDDA: After that, your grandfather spent all his time at the shrine. Then one day he just packed up and left the mountain. Harrow hasn\'t been the same since.');
  };
  S.pc_cheese = async function (w) {
    var st = g().state, today = Math.floor(Date.now() / 86400000);
    if (st.flags.cheese_day !== today) {
      st.flags.cheese_day = today;
      await w.say('CHEESEMAKER: A visitor! Here, try today\'s wheel. It\'s aged three months in the mine. Very cave-y.');
      return w.give('goatcheese');
    }
    await w.say('CHEESEMAKER: Come back tomorrow for another taste. Cheese can\'t be rushed. Neither can I.');
  };
  S.pc_shrinekeeper = async function (w) {
    await w.say('SHRINE KEEPER: This shrine is older than Pinecrest. The carvings tell of a tablet that held something asleep beneath the mountain.');
    await w.say('SHRINE KEEPER: Long ago it was broken in two, and the halves were hidden far apart. "Keep them apart," the carvings say, "and the mountain sleeps."');
    if (g().count('tablethalf')) await w.say('SHRINE KEEPER: ...Is that one of the halves? Oh, child. Keep it close. Keep it safe.');
    else await w.say('SHRINE KEEPER: The Echo Cave on Miners\' Row sings an old song too. Your grandfather could hum it by heart.');
  };
})();
