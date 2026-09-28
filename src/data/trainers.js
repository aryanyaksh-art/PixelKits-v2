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

  // ---------- Pinecrest ----------
  K('pc_1', 'Climber', 'Rhea', 'girl', [[28, 9], [12, 10]], { intro: 'You climbed all the way up here too? Let\'s see whose legs AND Kits are stronger!', after: 'Crampling hop between ledges no wider than a coin. I\'m still learning from them.' });
  K('pc_2', 'Hiker', 'Tobin', 'hiker2', [[31, 9], [28, 10]], { intro: 'The mountain tests everyone. So do I!', after: 'Pebbeetle look like rocks. I sat on one once. It was not happy.' });
  K('pc_3', 'Spelunker', 'Wes', 'miner', [[33, 9], [38, 10]], { intro: 'Shh! You\'ll wake the Echip! ...Too late. Battle!', after: 'The tunnel is a shortcut from the lower town all the way to the high ledge.' });
  K('pc_4', 'Birdwatcher', 'Ada', 'birder', [[13, 12]], { intro: 'My Streamlark flew up here on its own. Now we train together!', after: 'Snow Kits live near the summit. I\'ve seen a little owlet up there, round like a snowball.' });
  K('pc_5', 'Explorer', 'Pim', 'hiker', [[34, 12], [38, 11]], { intro: 'Who turned off the lights?! Oh, it\'s you. Battle me while my eyes adjust!', after: 'A Miner\'s Lamp would help in here. The foreman in the miners\' hall has spares.' });
  K('pc_6', 'Angler', 'Colm', 'angler', [[22, 11], [36, 12]], { intro: 'An underground lake! The fish down here have never seen a hook!', after: 'Palewick have no eyes at all. They find food by feeling ripples.' });
  K('pc_7', 'Skier', 'Sigrid', 'villager3', [[45, 13], [47, 13]], { intro: 'Fresh snow and a fresh opponent! Perfect day!', after: 'Avalop start little snowslides and ride them down. I\'m jealous.' });
  // gym: three miners between the challenges, then the Warden
  K('pcgym_1', 'Miner', 'Dov', 'miner', [[31, 10], [28, 11]], { reward: 40, noRematch: true, music: 'gym', intro: 'Boulders moved? Good. Now let\'s see if you can move ME.', after: 'Next up: the minecart line. Flip the switches wrong and your cart ends up in the buffers.' });
  K('pcgym_2', 'Driller', 'Sabe', 'miner2', [[26, 11], [31, 12]], { reward: 45, noRematch: true, music: 'gym', intro: 'You got the cart through? Not bad. My drill-arm is stronger than any switch!', after: 'Watch the floor ahead. It shows you the safe stones once, and only once.' });
  K('pcgym_3', 'Foreman', 'Garrick', 'miner', [[32, 12], [16, 12]], { reward: 50, noRematch: true, music: 'gym', intro: 'Only one wall left between you and the Warden. And me, of course.', after: 'The last wall needs a steady swing. Strike the gold seam and it\'ll give.' });
  K('pcgym_spar', 'Sparring Miner', 'Juno', 'miner2', [[28, 9], [31, 9], [33, 9]], { reward: 15, noRematch: true, music: 'trainer', canLose: true, intro: 'Warming up? I\'ll spar as often as you like!', after: 'Good work! Come back any time you need practice.' });
  K('pc_warden', 'Warden', 'Harrow', 'warden1', [[31, 12], [16, 13], [29, 14]], { reward: 150, noRematch: true, music: 'gym', ai: 2, items: 1, intro: 'Harrow. I dig, I battle, and I don\'t talk much. Show me what you\'ve got.', lose: '...Hah. You\'ve got stone in your bones, kid.' });
  // Accord in the crystal grotto
  K('cinder_3', 'Accord Cinder', 'Grunt', 'cinder', [[33, 13], [24, 13]], { reward: 50, noRematch: true, music: 'syndicate', intro: 'The Elder said no visitors! Especially not you!', lose: 'The crystals... the Elder will be furious.' });
  K('cinder_4', 'Accord Cinder', 'Grunt', 'cinder2', [[31, 13], [20, 14]], { reward: 50, noRematch: true, music: 'syndicate', intro: 'You broke through the mine door?! With a PICKAXE?!', lose: 'Ugh, this kid is relentless.' });
  K('elder_morrow', 'Accord Elder', 'Morrow', 'elder', [[25, 16], [32, 15], [41, 17]], { reward: 200, noRematch: true, music: 'syndicate', ai: 2, lose: 'You have your grandfather\'s stubbornness. How irritating.' });

  // ---------- Sibling ----------
  K('sibling1', 'Sibling', '{RIVAL}', 'rival', sibling([], 6), { reward: 30, canLose: true, music: 'rival', ai: 1, lose: 'Huh. You actually got a hit in.', winText: 'Told you. Always one step ahead.' });
  K('sibling2', 'Sibling', '{RIVAL}', 'rival', sibling([[12, 10]], 11), { reward: 60, canLose: true, music: 'rival', ai: 1, lose: 'Okay. Okay! You\'re getting better. Annoying.', winText: 'Still one step ahead.' });
  K('sibling3', 'Sibling', '{RIVAL}', 'rival', sibling([[13, 13], [24, 12]], 14), { reward: 90, canLose: true, music: 'rival', ai: 2, lose: '...You really aren\'t going to stop, are you.', winText: 'Go home, {PLAYER}. Please.' });

  // names used in dialogue (for the originality check)
  PK.EXTRA_NAMES = ['Lumora', 'Verdant Vale', 'Brookhollow', 'Willow Trail', 'Ashen Accord', 'Ines Vale', 'Hobb', 'Pell', 'Fenwick', 'Tomas', 'KitLog', 'Pinecrest', 'Harrow', 'Morrow', 'Dunmore', 'Maren', 'Oswin', 'Greta', 'Hollis', 'Nell', 'Edda', 'Garrick', 'Juno', 'Sabe', 'Brask', 'Blackrock Cave', 'Hollow Lake', 'Echo Cave', 'Crystal Grotto', 'Summit Crest', 'Switchback Tunnel'];
  PK.TRAINERS = TR;
})();
