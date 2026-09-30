// Saltmarsh: a harbor town in the middle of the Great Catch festival. Outdoor map (generated layout in saltmarsh_layout.js),
// shared helpers, themes, trainers, and the festival ambience (parade, boats, floating lanterns, fireworks, tide).
// Interiors are in saltmarsh_int1/int2/gym.js; story scripts are in saltmarsh_story.js.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var D = PK.defMap, S = PK.SCRIPTS, Q = PK.QUESTS, L = PK.SM;
  function g() { return PK.game; }
  function beat(id) { return !!g().state.defeated[id]; }
  function sm() { var st = g().state; if (!st.sm) st.sm = { susp: 0, glass: 0, day: 1 }; return st.sm; }
  // the festival is on until the main quest is finished
  function fest() { return !PK.quest.done('festival'); }
  function after() { return PK.quest.done('festival'); }
  function eve() { var t = g().timeOfDay(); return t === 'evening' || t === 'night'; }
  function lowTide() { return !g().tideHigh(); }
  PK.sm = { sm: sm, fest: fest, after: after, eve: eve };

  // ================= interior themes =================
  Object.assign(PK.THEMES, {
    tavern: { style: 'plank', wallStyle: 'plank', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#5a3a20', '#7a5230', '#946a40'], wall: ['#4a3020', '#6a4a2c', '#8a6640'], trim: '#2a1a10', rug: ['#8a2e36', '#b8484e', '#e0807a'] },
    market: { style: 'flag', wallStyle: 'stone', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#6a7078', '#8a9098', '#a8b0b8'], wall: ['#5a6068', '#7a8088', '#9aa0a8'], trim: '#3a4048', rug: ['#2e5a8a', '#4a7ab0', '#7aa6d8'] },
    aqua: { style: 'tile', wallStyle: 'glass', water: ['#1a7ac0', '#2ab0e8', '#7ad8f8', '#e4fbff'], floor: ['#6ab0c8', '#8ad0e0', '#b0e8f0'], wall: ['#2a6a98', '#3a8ac0', '#6ac0e8'], trim: '#1a4a70', rug: ['#2ab8a8', '#4ad0c0', '#8af0e0'] },
    theatre: { style: 'carpet', wallStyle: 'paper', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#5a1a2a', '#7a2a3a', '#9a4050'], wall: ['#3a1a3a', '#5a2a5a', '#7a4a7a'], trim: '#e8c060', rug: ['#8a1e3a', '#b0304e', '#d85a70'] },
    lightkeep: { style: 'flag', wallStyle: 'stone', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#b8b0a0', '#d0c8b8', '#e8e0d0'], wall: ['#c8c4bc', '#e8e4dc', '#fcf8f0'], trim: '#c8323a', rug: ['#c8323a', '#e05a5e', '#f08a8e'] },
    arcadefun: { style: 'tile', wallStyle: 'paper', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#28204a', '#3a2e64', '#4e4080'], wall: ['#3a2a5a', '#5a3a8a', '#8a5ac0'], trim: '#f8d040', rug: ['#e85a8a', '#f080a8', '#f8b0c8'] },
    harborinn: { style: 'plank', wallStyle: 'paper', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#a07040', '#c49058', '#e0b078'], wall: ['#9ac8d8', '#c0e0ec', '#e0f2f8'], trim: '#3a78b8', rug: ['#3a78b8', '#5a98d8', '#8ac0f0'] },
    ghostship: { style: 'plank', wallStyle: 'plank', water: ['#1a3a4a', '#2a5a6a', '#4a8a9a', '#a8d8e0'], floor: ['#2a3a3a', '#3a5050', '#4a6a68'], wall: ['#1e2a2a', '#2e4040', '#3e5858'], trim: '#1a2020', rug: ['#3a5a6a', '#4a7a8a', '#6a9aaa'] },
    factory: { style: 'flag', wallStyle: 'brick', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#5a5a62', '#74747e', '#8e8e98'], wall: ['#8a3a2a', '#b0503a', '#d0705a'], trim: '#3a3a44', rug: ['#8a6a2a', '#b89040', '#e8c860'] },
    yard: { style: 'plank', wallStyle: 'plank', water: ['#2e62c4', '#4a8ee6', '#84c2f8', '#e4f4ff'], floor: ['#8a6a44', '#a8845a', '#c8a478'], wall: ['#7a5a3a', '#9a7a52', '#ba9a6c'], trim: '#4a3018', rug: ['#3a5a8a', '#5a7aaa', '#8aa0d0'] },
    cove: { style: 'cave', wallStyle: 'stone', water: ['#1c5a8a', '#2a86b8', '#68c2f2', '#e0f6ff'], floor: ['#6a5a48', '#867460', '#a29078'], wall: ['#3a2e26', '#584638', '#78624c'], trim: '#3a2e26', rug: ['#8a6a2a', '#b89040', '#e8c860'] }
  });

  // ================= quests =================
  Q.festival = { title: 'The Great Catch', kind: 'main', desc: 'Saltmarsh is in the middle of its harvest festival, and crates keep going missing. Something shady is running through the harbor.',
    steps: [
      { id: 'odessa', text: 'Meet Festival Organizer Odessa on the Green' },
      { id: 'hire', text: 'Get a dockhand job with Lighthouse Trading Co.' },
      { id: 'shift', text: 'Work a shift: carry 3 crates to the Trading Co.' },
      { id: 'junie', text: 'Meet the journalist at the Salted Gull tavern' },
      { id: 'keeper', text: 'Visit the lighthouse keeper' },
      { id: 'costume', text: 'Get a parade costume from the workshop' },
      { id: 'parade', text: 'Slip into the cannery cellar during the Lantern Parade' },
      { id: 'lowtide', text: 'Follow the smugglers to the wreck at low tide' },
      { id: 'gym', text: 'Win the Beacon Playhouse challenge' },
      { id: 'quill', text: 'Confront Elder Quill at the lighthouse' },
      { id: 'oracle', text: 'Watch the fireworks over the harbor' }
    ], reward: 'The Raft, and the road to the storm sea' };
  Q.ghostship = { title: 'The Ghost Ship', kind: 'side', desc: 'At low tide a wreck appears on the Old Docks flats. The harbor master says the lights on board have never gone out.',
    steps: [{ id: 'lights', text: 'Explore the wreck at low tide' }, { id: 'bell', text: 'Ring the ship\'s bell on the top deck' }, { id: 'report', text: 'Tell Harbor Master Tobias what you found' }], reward: 'Old sea charts and a very rare Kit' };
  Q.rodcontest = { title: 'The Rod Contest', kind: 'side', desc: 'Harbor Master Tobias is running a fishing contest for the festival. The winner takes home the Golden Reel.',
    steps: [{ id: 'catch', text: 'Reel in 3 big fish with the timing game at the pier' }, { id: 'weigh', text: 'Have your catch weighed by Tobias' }], reward: 'The Golden Reel and a Harbor Rod upgrade' };
  Q.scoop = { title: "The Journalist's Scoop", kind: 'side', desc: 'Junie Fathom needs three photos of suspicious cargo to break her story.',
    steps: [{ id: 'photos', text: 'Photograph 3 suspicious crates (use the camera)' }, { id: 'deliver', text: 'Bring the photos to Junie at the tavern' }], reward: 'A press pass and a rare item' };
  Q.cove = { title: 'Pirate Cove Treasure', kind: 'side', desc: 'A torn map in the shipyard shows an X on a rock island in the bay. You would need a raft to reach it.',
    steps: [{ id: 'map', text: 'Find the three pieces of the treasure map' }, { id: 'cove', text: 'Sail the Raft to the rock island in the bay' }], reward: 'Pirate treasure' };

  // ================= trainers =================
  function TK(id, title, name, sprite, team, o) {
    PK.TRAINERS[id] = Object.assign({ id: id, title: title, name: name, sprite: sprite, team: team, reward: 30, ai: 1 }, o || {});
  }
  PK.TK = TK;
  TK('sm_1', 'Dockhand', 'Nils', 'dockhand', [[62, 17], [65, 17]], { intro: 'Break time is over the second the boss walks past. Battle me before he does!', after: 'A Bilgekin stole my lunch and my tin can. Same Bilgekin. Same day.' });
  TK('sm_2', 'Angler', 'Perrin', 'angler', [[69, 18], [58, 19], [60, 18]], { intro: 'Shh, the Fizzeel are running! ...You scared them. You owe me a battle.', after: 'The Harbor Rod reaches the deep water. That is where the big sparks live.' });
  TK('sm_3', 'Swimmer', 'Coral', 'swimmer', [[60, 19], [61, 20]], { intro: 'The tide just went out and every rock pool is a battlefield!', after: 'Careful with Jellyp. Cute glow, nasty tingle.' });
  TK('sm_4', 'Sailor', 'Bosun Fenn', 'sailor', [[68, 20], [66, 21], [64, 21]], { intro: 'Ye look like ye can handle a swell. Let us see ye handle a Corsaircat!', after: 'That cat has stolen more from me than the tide has.' });
  TK('sm_5', 'Crabber', 'Wilhelmina', 'crabber', [[75, 20], [76, 21]], { intro: 'You are standing on my flats. That means you are challenging me. Those are the rules!', after: 'Trinkrab hoard anything shiny. Do not leave your keys on the beach.' });
  TK('sm_6', 'Performer', 'Beatrix', 'dancer1', [[73, 20], [74, 20], [70, 19]], { intro: 'A dance-off? Better! A BATTLE dance-off!', after: 'Constellarm turn in time with the drums. Not a single missed step.' });
  TK('sm_7', 'Weather Fan', 'Ludo', 'weatherman', [[70, 21], [71, 20]], { intro: 'A storm is coming and I have been waiting my whole life to be right about it!', after: 'Thundernaut do not just carry storms. They ARE storms. In a shell.' });
  TK('sm_8', 'Sightseer', 'Delia', 'kid2', [[65, 18], [67, 19], [69, 19]], { intro: 'My guidebook says every trainer in Saltmarsh is friendly. Prove it!', after: 'I am writing a review of you. Four stars.' });
  // undercover Accord at the cannery and the trading company
  TK('sm_c1', 'Accord Cinder', 'Grunt', 'cinder', [[66, 20], [65, 20]], { reward: 55, noRematch: true, music: 'syndicate', intro: 'A festival guest with a vest? Nice try. Nobody gets past the crates!', lose: 'The Elder said nothing about a kid who fights like this...' });
  TK('sm_c2', 'Accord Cinder', 'Grunt', 'cinder2', [[68, 20], [70, 21]], { reward: 55, noRematch: true, music: 'syndicate', intro: 'You saw too much! Hold it right there!', lose: 'We had a perfect night planned...' });
  TK('sm_c3', 'Accord Cinder', 'Grunt', 'cinder', [[69, 21], [66, 21], [72, 21]], { reward: 60, noRematch: true, music: 'syndicate', intro: 'We have been waiting for the tide. You have been waiting for a battle. Fine.', lose: 'The wreck was supposed to be our secret.' });
  TK('sm_c4', 'Accord Cinder', 'Grunt', 'cinder2', [[75, 21], [68, 22]], { reward: 60, noRematch: true, music: 'syndicate', intro: 'The Elder is busy. I am the doorman. Doormen battle.', lose: 'That was not in the doorman contract.' });
  TK('sm_quill', 'Accord Elder', 'Quill', 'elder2', [[66, 21], [77, 21], [74, 22], [53, 22]], { reward: 250, noRematch: true, music: 'syndicate', ai: 2, intro: 'You know, I did so hope we would not have to do this. I adore a polite guest.', lose: 'Well now. That was not in the script at all.' });

  // ================= Saltmarsh town =================
  var BLD = L.buildings.map(function (b) { return Object.assign({}, b); });
  // the Old Docks wreck shows up on the flats at low tide only (its door is handled by an event)
  D('saltmarsh', {
    name: 'Saltmarsh', theme: 'coast', music: function () { if (PK.quest.done('festival')) return 'saltmarsh_calm'; return eve() ? 'festival' : 'saltmarsh'; }, region: 'Windward Coast', townPoint: [31, 90],
    rows: L.rows,
    buildings: BLD,
    props: [
      // main street and green
      ['lantern', 29, 30], ['lantern', 34, 30], ['lantern', 29, 44], ['lantern', 34, 44], ['lantern', 29, 60], ['lantern', 34, 60], ['lantern', 29, 76], ['lantern', 34, 76],
      ['banner', 13, 30, { color: '#e83a3a', icon: 'fish' }], ['banner', 28, 30, { color: '#3a78d8', icon: 'anchor' }],
      ['festivaldrum', 14, 33], ['festivaldrum', 27, 33], ['spotlight', 18, 30], ['spotlight', 23, 30],
      // docks
      ['barrel', 44, 47], ['ropecoil', 46, 57], ['netpile', 50, 39], ['barrel', 44, 39], ['buoy', 43, 65], ['ropecoil', 41, 85], ['barrel', 46, 85],
      ['netpile', 8, 48], ['ropecoil', 13, 49], ['anchor', 26, 50], ['barrel', 31, 62], ['barrel', 40, 58],
      // fish market yard
      ['fishcrate', 16, 82], ['fishcrate', 17, 82], ['barrel', 7, 82], ['netpile', 6, 80],
      // hill
      ['telescope', 32, 13, { talk: 'sm_scope_hill' }], ['fishcrate', 41, 83, { talk: 'sm_photo_wharf' }], ['lantern', 22, 14], ['banner', 8, 16, { color: '#e83a3a', icon: 'anchor' }],
      // fireworks platform launchers
      ['barrel', 44, 9], ['barrel', 44, 13], ['crate', 46, 9, { text: 'FIREWORKS. Do not touch. Do not sneeze near. Do not ask.' }], ['crate', 46, 13, { text: 'FIREWORKS. Marked, labeled, and very heavy.' }]
    ],
    signsAt: L.signs.map(function (s) { return [s[0], s[1], s[2]]; }),
    itemsAt: [
      ['seaglass', 1, 3, 60], ['seaglass', 1, 12, 66], ['seaglass', 1, 9, 54], ['seaglass', 1, 10, 30], ['seaglass', 1, 36, 91], ['seaglass', 1, 52, 85],
      ['chowder', 1, 25, 82], ['hitonic', 1, 5, 20], ['pluscapsule', 1, 30, 6], ['shellbait', 2, 13, 63], ['sparkbait', 2, 38, 69]
    ],
    npcs: {
      // ---- the Green: organizer, dancers, drummers and the parade marshal
      odessa: { at: [21, 31], sprite: 'organizer', dir: 'up', talk: 'sm_odessa' },
      dance1: { at: [15, 33], sprite: 'dancer1', move: 'dance', cond: fest, text: 'One-two-three, spin! One-two-three, spin! Do not talk to me, I will lose count!' },
      dance2: { at: [26, 33], sprite: 'dancer2', move: 'dance', beat: 2, cond: fest, text: 'The trick is to smile with your KNEES.' },
      dance3: { at: [16, 39], sprite: 'dancer3', move: 'dance', beat: 4, cond: fest, text: 'The gold sash makes you twenty percent faster. Scientifically.' },
      drummer1: { at: [26, 39], sprite: 'drummer', move: 'dance', beat: 1, cond: fest, text: 'BOOM. Boom boom. BOOM. Sorry, I cannot stop. It is in my arms now.' },
      marshal: { at: [23, 34], sprite: 'marshal', dir: 'up', cond: fest, talk: 'sm_marshal' },
      // ---- ferry pilots at each pier
      ferry1: { at: [50, 47], sprite: 'sailor', dir: 'left', talk: 'sm_ferry' },
      ferry2: { at: [51, 57], sprite: 'sailor', dir: 'left', talk: 'sm_ferry' },
      ferry3: { at: [46, 85], sprite: 'sailor', dir: 'left', talk: 'sm_ferry' },
      ferry4: { at: [45, 11], sprite: 'sailor', dir: 'left', talk: 'sm_ferry' },
      ferry5: { at: [12, 49], sprite: 'sailor', dir: 'right', talk: 'sm_ferry' },
      // ---- food row shopkeepers stand just above their stalls
      cook1: { at: [22, 86], sprite: 'cook', dir: 'down', talk: 'shop', stock: ['chowder', 'campstew', 'minttea'] },
      cook2: { at: [25, 86], sprite: 'crabber', dir: 'down', talk: 'shop', stock: ['grillskewer', 'spicejerky'] },
      cook3: { at: [34, 86], sprite: 'girl', dir: 'down', talk: 'shop', stock: ['shavedice', 'swiftsnap', 'shellcrisp'] },
      cook4: { at: [37, 86], sprite: 'villager3', dir: 'down', talk: 'shop', stock: ['sugarwhirl', 'honeybun', 'fancytreat', 'kittreat'] },
      cook5: { at: [27, 89], sprite: 'tavernkeep', dir: 'down', talk: 'shop', stock: ['fishcake', 'kelpcrisp', 'riverberry'] },
      cook6: { at: [22, 89], sprite: 'oldwoman', dir: 'down', talk: 'shop', stock: ['sunpeach', 'goatcheese', 'mountainmilk'] },
      // ---- townsfolk (festival and after)
      dockhandA: { at: [31, 74], sprite: 'dockhand', move: 'patrol', path: 'uuuuuuuuddddddddd', pause: 6, text: 'Crates, crates, crates. I never want to see another crate as long as I live. Then tomorrow I do it again.', textIf: [['festival_done', 'Quiet week after the festival. The crates finally have time to breathe.']] },
      dockhandB: { at: [38, 66], sprite: 'dockhand', dir: 'left', text: 'The trading company pays double during the festival. Do not ask what is in the crates. That is the deal.', textIf: [['festival_done', 'I asked what was in the crates. Turns out the answer was "trouble." I am unemployed and very relieved.']] },
      kidA: { at: [24, 40], sprite: 'kid', move: 'wander', text: 'The parade has a float shaped like a FISH! Bigger than a FISH! It is a fish shaped like a fish!', textIf: [['festival_done', 'The floats are back in the shipyard now. I asked if they were sad. They did not answer.']] },
      kidB: { at: [20, 44], sprite: 'kid2', move: 'wander', text: 'If you catch a Jellyp, do NOT poke it. Learn from my mistake. It tingled for a whole day.', textIf: [['festival_done', 'I poked another one. It was worth it.']] },
      touristA: { at: [16, 42], sprite: 'villager1', move: 'wander', text: 'We came for the festival! I heard there are lanterns! Lanterns!', textIf: [['festival_done', 'The festival is over but we are staying. This place is lovely when it is not screaming.']] },
      touristB: { at: [27, 42], sprite: 'villager2', move: 'wander', text: 'The chowder is the best I have ever had. I have had it four times. It is still the best.', textIf: [['festival_done', 'The chowder is still the best. The festival was a bonus.']] },
      oldsalt: { at: [37, 47], sprite: 'oldman', dir: 'down', text: 'I have watched this harbor for sixty years. It never gets less busy. Or less suspicious.', textIf: [['festival_done', 'Sixty years, and I finally see the harbor sit still. Nice. Boring. Nice.']] },
      gullkid: { at: [31, 52], sprite: 'kid', move: 'wander', text: 'A Pouchbill stole my sandwich. Then it gave me a coin! I think we are even.', textIf: [['festival_done', 'The Pouchbill came back. It brought two coins this time. We are best friends.']] },
      beachlady: { at: [40, 61], sprite: 'oldwoman', move: 'wander', text: 'The best sea glass turns up right after a big tide. Blue for luck, green for the sea, and this frosted one... well, ask the trader.', textIf: [['festival_done', 'Sea glass, sea glass. The festival dropped more of it than usual.']] },
      // ---- crates to carry on the dockhand shift, and the rod contest spots
      crateA: { at: [43, 85], sprite: 'crate', noTurn: true, talk: 'sm_crate_pick', cond: function () { return PK.quest.at('festival', 'shift') && !(sm().cr && sm().cr.crateA); } },
      crateB: { at: [45, 84], sprite: 'crate', noTurn: true, talk: 'sm_crate_pick', cond: function () { return PK.quest.at('festival', 'shift') && !(sm().cr && sm().cr.crateB); } },
      crateC: { at: [46, 86], sprite: 'crate', noTurn: true, talk: 'sm_crate_pick', cond: function () { return PK.quest.at('festival', 'shift') && !(sm().cr && sm().cr.crateC); } },
      spot1: { at: [47, 46], sprite: 'bld:netpile', noTurn: true, talk: 'sm_contest_spot' },
      spot2: { at: [48, 58], sprite: 'bld:netpile', noTurn: true, talk: 'sm_contest_spot' },
      spot3: { at: [47, 86], sprite: 'bld:netpile', noTurn: true, talk: 'sm_contest_spot' },
      // ---- the Playhouse is closed until the story reaches it
      gymgate: { at: [18, 22], sprite: 'gate', noTurn: true, cond: function () { return !PK.quest.past('festival', 'lowtide') && PK.quest.has('festival') && !PK.quest.done('festival'); }, text: 'The Beacon Playhouse doors are chained shut. A hand-painted sign: CLOSED FOR REHEARSAL. FINAL SHOW ON THE THIRD NIGHT. A very nervous voice on the other side says "Not yet! Not ready!"' },
      // ---- the Tidal Oracle waits in the bay after the festival (reach it by Raft); it stays until you catch it
      argus: { at: [50, 30], sprite: 'kit:78', swim: true, noTurn: true, cond: function () { return PK.quest.done('festival') && !g().state.caught[78]; }, talk: 'sm_argus' },
      // ---- the wreck's hatch is under water at high tide
      floodhatch: { at: [4, 57], sprite: 'none', noTurn: true, cond: function () { return g().tideHigh(); }, text: 'The hatch of the wreck is under a foot of water. The tide will have to go out first.' },
      // ---- outdoor trainers
      t1: { at: [27, 74], sprite: 'dockhand', dir: 'right', keeper: 'sm_1', sight: 3 },
      t2: { at: [44, 46], sprite: 'angler', dir: 'down', keeper: 'sm_2', sight: 2 },
      t3: { at: [41, 53], sprite: 'swimmer', dir: 'down', keeper: 'sm_3', sight: 3 },
      t4: { at: [10, 50], sprite: 'sailor', dir: 'right', keeper: 'sm_4', sight: 3 },
      t5: { at: [9, 58], sprite: 'crabber', dir: 'right', keeper: 'sm_5', sight: 3, cond: lowTide },
      t6: { at: [25, 38], sprite: 'dancer1', dir: 'down', keeper: 'sm_6', sight: 3 },
      t7: { at: [22, 20], sprite: 'weatherman', dir: 'down', keeper: 'sm_7', sight: 3 },
      t8: { at: [26, 16], sprite: 'kid2', dir: 'left', keeper: 'sm_8', sight: 3 },
      // ---- ambient parade and boats (visible in the evening during the festival)
      float1: { at: [31, 88], sprite: 'bld:float', art: { variant: 'fish' }, move: 'patrol', path: 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuddddddddddddddddddddddddddddddddddddddddddddddddddddddd', pause: 2, cond: function () { return fest() && eve(); }, text: 'A float shaped like a fish shaped like a float. The driver waves.' },
      float2: { at: [32, 76], sprite: 'bld:float', art: { variant: 'lighthouse' }, move: 'patrol', path: 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuddddddddddddddddddddddddddddddddddddddddddddddddddddddd', pause: 2, cond: function () { return fest() && eve(); }, text: 'A tall paper lighthouse with a real lamp inside. It is not on fire yet.' },
      float3: { at: [30, 64], sprite: 'bld:float', art: { variant: 'sun' }, move: 'patrol', path: 'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuddddddddddddddddddddddddddddddddddddddddddddddddddddddd', pause: 2, cond: function () { return fest() && eve(); }, text: 'A sun with a face. The face is smiling. It is a little unsettling.' },
      lant1: { at: [30, 82], sprite: 'dancer2', move: 'patrol', path: 'uuuuuuuuuuuuuuuuuuuuddddddddddddddddddddd', pause: 4, cond: function () { return fest() && eve(); }, text: 'Everyone carries a lantern in the parade. Mine is shaped like a crab!' },
      lant2: { at: [33, 70], sprite: 'dancer3', move: 'patrol', path: 'uuuuuuuuuuuuuuuuuuuuddddddddddddddddddddd', pause: 4, cond: function () { return fest() && eve(); }, text: 'Lantern parade! Do not touch the lantern. It is on fire. Politely.' },
      lant3: { at: [31, 58], sprite: 'drummer', move: 'patrol', path: 'uuuuuuuuuuuuuuuuuuuuddddddddddddddddddddd', pause: 4, cond: function () { return fest() && eve(); }, text: 'BOOM BOOM BOOM. We are marching. This is the marching sound.' },
      boat1: { at: [52, 50], sprite: 'bld:beachboat', water: true, move: 'patrol', path: 'llllllllllllllllllllrrrrrrrrrrrrrrrrrrrrr', pause: 8, cond: function () { return fest() && eve() && PK.sm.sm().day >= 2; }, text: 'A decorated boat in the procession. The captain waves with both hands. Nobody is steering.' },
      boat2: { at: [58, 62], sprite: 'bld:beachboat', water: true, move: 'patrol', path: 'uuuuuuuuuuuuuuuuuuuuddddddddddddddddddddd', pause: 8, cond: function () { return fest() && eve() && PK.sm.sm().day >= 2; }, text: 'A festival boat covered in paper flowers and one real, very confused gull.' }
    },
    warpsAt: [[56, 41, 'sm_cove', 7, 7, 'up']],
    eventsAt: [
      { at: [31, 91], run: 'sm_arrive', cond: function () { return !g().flag('sm_arrived'); } }, { at: [32, 91], run: 'sm_arrive', cond: function () { return !g().flag('sm_arrived'); } }
    ],
    onEnter: 'sm_enter',
    onStep: function (w, x, y) { return S.sm_step && S.sm_step(w, x, y); },
    drawOver: function (ctx, cx, cy) { smOverlay(ctx, cx, cy); },
    edges: { s: { to: 'pc_beach', off: -17 } },
    enc: {
      grass: [[62, 16, 18, 30], [65, 16, 18, 28], [67, 17, 19, 25], [24, 16, 18, 8, 'night']],
      water: [[22, 15, 17, 40], [58, 17, 19, 30], [69, 18, 20, 20], [60, 18, 20, 20]],
      deep: [[69, 19, 21, 25], [60, 19, 21, 18], [71, 19, 21, 18], [70, 20, 22, 10], [72, 21, 22, 8], [61, 21, 22, 8], [59, 21, 22, 5]],
      pool: [[73, 17, 19, 30], [75, 18, 20, 25], [58, 18, 20, 20], [74, 21, 22, 5], [60, 18, 20, 15]],
      bait: {
        sparkbait: [[69, 19, 21, 30], [70, 20, 22, 20], [71, 19, 21, 25], [72, 21, 22, 18], [49, 18, 20, 8]],
        glowbait: [[74, 20, 22, 25], [60, 19, 21, 25], [61, 21, 22, 12], [77, 20, 21, 5]],
        shellbait: [[75, 19, 21, 30], [76, 21, 22, 25], [58, 19, 21, 20], [59, 21, 22, 15]]
      }
    }
  });

  // ================= festival ambience drawn over the map =================
  var bursts = [];
  function smOverlay(ctx, cx, cy) {
    var t = PK.frame, night = eve();
    var st = g().state;
    // floating lanterns drift over the harbor at dusk (festival only)
    if (fest() && (g().timeOfDay() === 'evening' || g().timeOfDay() === 'night')) {
      for (var i = 0; i < 26; i++) {
        var bx = 44 + ((i * 37) % 17) + ((t / 400 + i * 0.13) % 1) * 1.2, by = 5 + ((i * 53) % 66) - ((t / 900 + i * 0.07) % 1) * 3;
        var sx = Math.round(bx * 16 - cx), sy = Math.round(by * 16 - cy + Math.sin(t / 30 + i) * 2);
        if (sx < -10 || sy < -10 || sx > PK.W + 10 || sy > PK.H + 10) continue;
        var col = ['#ffd060', '#ff9a8a', '#a8f0ff', '#f8f0a0'][i % 4];
        ctx.fillStyle = 'rgba(255,220,140,0.18)'; ctx.beginPath(); ctx.arc(sx + 3, sy + 3, 7, 0, 6.3); ctx.fill();
        ctx.fillStyle = '#3a2a30'; ctx.fillRect(sx, sy + 1, 6, 5); ctx.fillStyle = col; ctx.fillRect(sx + 1, sy + 1, 4, 4); ctx.fillStyle = '#ffffff'; ctx.fillRect(sx + 2, sy + 2, 2, 2);
      }
    }
    // fireworks over the bay on the third night
    if (fest() && st.sm && st.sm.day >= 3 && night) {
      if ((t % 70) === 0 || (t % 97) === 0) bursts.push({ x: 46 * 16 + Math.random() * 15 * 16, y: (8 + Math.random() * 20) * 16, age: 0, col: ['#ff6a8a', '#ffe060', '#7af0ff', '#b08aff', '#ffffff'][(Math.random() * 5) | 0] });
      bursts = bursts.filter(function (b) { return b.age < 55; });
      bursts.forEach(function (b) {
        b.age++;
        var r = b.age * 0.9, a = 1 - b.age / 55;
        ctx.globalAlpha = a; ctx.fillStyle = b.col;
        for (var k = 0; k < 16; k++) { var ang = k / 16 * 6.283; ctx.fillRect(Math.round(b.x - cx + Math.cos(ang) * r), Math.round(b.y - cy + Math.sin(ang) * r + b.age * 0.15), 2, 2); if (b.age > 10 && k % 2) ctx.fillRect(Math.round(b.x - cx + Math.cos(ang) * r * 0.55), Math.round(b.y - cy + Math.sin(ang) * r * 0.55), 1, 1); }
        ctx.globalAlpha = 1;
      });
    }
    // the lighthouse beam sweeps the harbor after dark (any time)
    if (g().timeOfDay() === 'night' || g().timeOfDay() === 'evening') {
      var lx = 10 * 16 + 8 - cx, ly = 7 * 16 + 6 - cy, ang2 = t / 90;
      ctx.fillStyle = 'rgba(255,248,176,0.10)'; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + Math.cos(ang2 - 0.08) * 240, ly + Math.sin(ang2 - 0.08) * 240); ctx.lineTo(lx + Math.cos(ang2 + 0.08) * 240, ly + Math.sin(ang2 + 0.08) * 240); ctx.fill();
    }
  }
  PK.smOverlay = smOverlay;

  // ================= ferries: boats between the district piers =================
  var STOPS = [
    { name: 'Market Row pier', map: 'saltmarsh', x: 49, y: 47 },
    { name: 'Harbor Front pier', map: 'saltmarsh', x: 50, y: 57 },
    { name: 'Cannery wharf', map: 'saltmarsh', x: 45, y: 85 },
    { name: 'Lighthouse Point', map: 'saltmarsh', x: 44, y: 11 },
    { name: 'Old Docks', map: 'saltmarsh', x: 11, y: 49 }
  ];
  S.sm_ferry = async function (w, npc) {
    var here = 0, best = 1e9;
    STOPS.forEach(function (s, i) { var d = Math.abs(s.x - w.p.x) + Math.abs(s.y - w.p.y); if (d < best) { best = d; here = i; } });
    await w.say('FERRY PILOT: Welcome aboard the harbor ferry! Where to? It is a short ride and the boat only sinks on special occasions.');
    var names = STOPS.filter(function (s, i) { return i !== here; }).map(function (s) { return s.name; });
    names.push('Stay here');
    var pick = await w.ask('Where to?', names);
    if (pick < 0 || pick >= names.length - 1) return;
    var dest = STOPS.filter(function (s, i) { return i !== here; })[pick];
    if (PK.audio) PK.audio.sfx('door');
    await PK.fx.fadeOut(20);
    await w.say('The little ferry chugs across the harbor...', { auto: 70 });
    w.load(dest.map, dest.x, dest.y, 'down');
    await PK.fx.fadeIn(20);
  };

  // tide-aware sign text helpers
  S.sm_scope_hill = async function (w) {
    await w.say('You look through the telescope. The whole harbor spreads out below: the piers, the green, the smoke over the cannery.');
    if (fest()) await w.say('Far out where the sea turns dark, a line of storm clouds waits on the horizon. They have not moved all week.');
    else await w.say('Far out, a line of storm clouds sits on the horizon. The sea beyond it looks like another world.');
  };
})();
