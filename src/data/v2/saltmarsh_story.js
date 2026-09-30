// Saltmarsh story and scripts: the undercover main quest across three festival nights (Lantern Parade, Low Tide, Fireworks),
// suspicion and deadlines, side quests, shops, minigames and the finale with the Tidal Oracle.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var S = PK.SCRIPTS, Q = PK.QUESTS, TK = PK.TK;
  function g() { return PK.game; }
  function sm() { return PK.sm.sm(); }
  function beat(id) { return !!g().state.defeated[id]; }
  function at(step) { return PK.quest.at('festival', step); }
  function past(step) { return PK.quest.past('festival', step); }
  function eve() { var t = g().timeOfDay(); return t === 'evening' || t === 'night'; }
  function lowTide() { return !g().tideHigh(); }
  function money(n) { g().state.money = Math.max(0, (g().state.money || 0) + n); }

  // ================= disguise: the parade costume changes how the player looks =================
  var COSTUME_LOOK = { top: 6, bottom: 3, hat: 2, hatCol: 3 };
  function applyCostume(on) {
    var st = g().state;
    sm().costume = !!on;
    var base = st.player.look || PK.chars.defaultLook();
    if (on) PK.chars.setPlayerLook(Object.assign({}, base, COSTUME_LOOK));
    else PK.chars.setPlayerLook(base);
  }
  PK.smApplyCostume = applyCostume;

  // ================= suspicion =================
  PK.smHud = function (ctx) {
    var s = g().state.sm;
    if (!s || !s.susp || PK.quest.done('festival')) return;
    var x = PK.W - 44, y = 4;
    ctx.fillStyle = 'rgba(20,16,32,0.72)'; ctx.fillRect(x - 2, y - 2, 42, 14);
    for (var i = 0; i < 3; i++) {
      var on = i < s.susp, ex = x + 2 + i * 12;
      ctx.fillStyle = on ? '#e84848' : '#4a4058'; ctx.fillRect(ex, y + 3, 9, 5); ctx.fillStyle = on ? '#ffffff' : '#6a5e78'; ctx.fillRect(ex + 3, y + 4, 3, 3); ctx.fillStyle = '#1a1420'; ctx.fillRect(ex + 4, y + 5, 1, 1);
    }
  };
  async function addSusp(w, n, why) {
    var s = sm();
    s.susp = Math.min(3, (s.susp || 0) + n);
    if (PK.audio) PK.audio.sfx('buzz');
    PK.quest.toast && PK.quest.toast('SUSPICION ' + s.susp + '/3', why || 'Someone is watching you.');
    if (s.susp >= 3) { await w.say('Cold eyes turn your way from across the room. Two grey cloaks step out of the crowd.'); await ambush(w); }
  }
  async function ambush(w) {
    var s = sm();
    w.music('syndicate');
    await w.say('ACCORD CINDER: You have been poking around the Elder\'s things all week, dockhand. Time for a chat. The rough kind.');
    var r = await w.battle('sm_c3');
    if (r === 'win') r = await w.battle('sm_c4');
    if (r === 'win') {
      s.susp = 1;
      await w.say('ACCORD CINDER: Nnh... The Elder will hear about this...');
      await w.say('The Cinders melt into the crowd. Your heart is pounding. You are on thin ice, but you are still in the game.');
    } else s.susp = 1;
    w.playMapMusic();
  }
  // deadlines: the Lantern Parade and Low Tide nights end at dawn
  async function missedNight(w, which) {
    var s = sm();
    if (which === 'parade') {
      s.paradeMissed = true;
      await w.say('The horns sound. Dawn light spills over the harbor. The parade is over, and the cellar stairs are locked and guarded.');
      await w.say('You missed your chance to slip in during the festivities. The doorman will not be so easy to fool now.');
    } else {
      s.tideMissed = true;
      await w.say('Dawn. The tide is already turning and the flats are empty. Whatever came in on the ferry is gone.');
      await w.say('Still, ferry tracks and dropped crate straw lead toward the wreck. You have a decent idea of where they went.');
    }
    await addSusp(w, 1, 'A missed night has made the Accord careful.');
  }
  // called from onStep in the town, cannery and cellar
  S.sm_step = function (w, x, y) {
    var s = sm();
    if (at('parade') && s.paradeOn && !s.paradeMissed && g().timeOfDay() === 'morning' && (g().dayPos() > 0.06)) return missedNight(w, 'parade').then(function () { return true; });
    if (at('lowtide') && s.tideOn && !s.tideMissed && !g().flag('ferry_seen') && g().timeOfDay() === 'morning' && (g().dayPos() > 0.06)) return missedNight(w, 'tide').then(function () { return true; });
    if (w.map.id === 'saltmarsh' && at('lowtide') && !g().flag('ferry_seen') && x <= 13 && y >= 51 && y <= 71 && lowTide() && (g().timeOfDay() === 'night' || g().timeOfDay() === 'morning') && s.tideOn) return ferryScene(w).then(function () { return true; });
  };

  // ================= the town: arrival and entering =================
  S.sm_enter = async function (w) {
    var s = sm();
    if (S.sm_cove_check) S.sm_cove_check();
    if (s.costume) applyCostume(true);
    if (PK.quest.done('festival') && !s.unbunted) {
      s.unbunted = true;
      (PK.MAPS.saltmarsh.buildings || []).forEach(function (b) { if (b.bunting) b.bunting = false; });
      if (w.prerender) w.prerender();
    }
  };
  S.sm_arrive = async function (w) {
    w.setFlag('sm_arrived'); w.setFlag('harbor_open');
    if (PK.quest.has('farside') && !PK.quest.done('farside')) PK.quest.complete('farside');
    PK.quest.start('festival');
    await w.say('SALTMARSH. The harbor town wears its whole wardrobe: bunting from every mast, lanterns in every window, and a smell of chowder that could stop a ship.');
    await w.say('Drums thump somewhere near the green. The Great Catch has begun.');
    await w.say('Something on the wind does not smell like chowder. It smells like crates, and smoke, and secrets.');
  };

  // ================= Odessa, the organizer =================
  S.sm_odessa = async function (w) {
    var n = w.npc('odessa'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) {
      if (!g().flag('odessa_gift')) {
        w.setFlag('odessa_gift');
        await w.say('ODESSA: You! The Great Catch is over, and it was the best one Saltmarsh has ever had, and half of that is you!');
        await w.say('ODESSA: Nobody should be that brave without a snack. Take this.');
        await w.give('fancytreat', 3);
        return;
      }
      return w.say('ODESSA: I finally sat down. Do you know how long it has been? Six weeks. My knees are so grateful.');
    }
    if (at('odessa')) {
      await w.say('ODESSA: Oh thank the tide, a fresh face! I am Odessa Marrin, festival organizer, and I have not slept since the spring thaw!');
      await w.say('ODESSA: The Great Catch starts at dusk and everything is going wrong! The lantern shipment is "delayed", the drum crates are "misrouted", and half my sponsors want to know why their bunting has a lighthouse stamped on it.');
      await w.say('ODESSA: The Lighthouse Trading Co. supplies everything. They are the festival\'s biggest sponsor. Wonderful people! Mister Quill sends me tea!');
      await w.say('ODESSA: They are short of dockhands, too. If you have a free afternoon, go and ask at their office on the Harbor Front. They pay double during the festival.');
      await w.say('ODESSA: Just do not ask what is in the crates. That is the deal. It is always the deal.');
      PK.quest.advance('festival', 'hire');
      return;
    }
    if (at('hire')) return w.say('ODESSA: The Trading Co. is on the Harbor Front, past the harbor master. Look for the crate with the little lighthouse. It is every crate. Just go.');
    if (at('parade')) return w.say('ODESSA: You are in the parade? Wonderful! Talk to Marshal Fenwick on the green. Do NOT step on the floats. The paint is still tacky.');
    if (at('gym')) return w.say('ODESSA: The Beacon Playhouse is open for the finale! Marlo Luce is the best showman on the coast. Try not to make him nervous. He is very nervous.');
    return w.say('ODESSA: Everything is going wrong and I love it! Well, no. But I am used to it.');
  };
  S.sm_marshal = async function (w) {
    var n = w.npc('marshal'); if (n) w.facePlayer(n);
    var s = sm();
    if (at('parade') && !s.paradeOn) {
      if (!g().count('paradecostume')) return w.say('MARSHAL FENWICK: A parade needs a troupe. And a troupe needs costumes. Try the Thimble and Thread workshop, up the west side of the green.');
      await w.say('MARSHAL FENWICK: A troupe member! In a magnificent costume! Wonderful. We start when the lanterns are lit.');
      if (!(await w.yesno('Join the Lantern Parade now?'))) return;
      applyCostume(true);
      s.paradeOn = true; s.paradeMissed = false;
      g().setTime('evening');
      await w.say('You pull on the feathered costume. A hush of bunting, the crackle of a hundred lanterns, and the first drum begins.');
      await w.say('MARSHAL FENWICK: The route runs up Main Street, past the cannery, and ends at the harbor. Keep to the crowd. Nobody looks twice at anyone in a costume. That is the whole point of the parade.');
      await w.say('You have until dawn. Somewhere near the cannery there is a stairwell the doorman never leaves. Tonight, he might.');
      return;
    }
    if (at('parade') && s.paradeOn) return w.say('MARSHAL FENWICK: Keep in step! Eyes on the lanterns, elbows up!');
    return w.say('MARSHAL FENWICK: One-two-three, HUP! One-two-three, HUP! I have been saying this since before you were born.');
  };

  // ================= hiring and the crate shift =================
  S.sm_vespa = async function (w) {
    var n = w.npc('vespa'); if (n) w.facePlayer(n);
    if (at('hire')) {
      await w.say('VESPA: Lighthouse Trading Co., we bring everything home! Dockhand position? Lovely. Let me see... a signature here, another here, and the third is just a swirl.');
      await w.say('VESPA: Mister Quill likes a swirl. It is a tradition.');
      await w.give('dockvest');
      PK.quest.advance('festival', 'shift');
      await w.say('VESPA: Your first shift: three crates from the cannery wharf, back to the warehouse. Foreman Brandt will pay you at the end. Do not open the crates. They are very shy.');
      return;
    }
    if (at('shift')) return w.say('VESPA: Crates from the cannery wharf, to the warehouse. Three of them. Foreman Brandt is at the back. Smile at him. He appreciates it.');
    if (!g().count('dockvest') && PK.quest.done('festival')) return w.say('VESPA: We are closed for good, I think. I have never been so relaxed in my life.');
    return w.say('VESPA: Lighthouse Trading Co.! We bring everything home. Can I interest you in a swirl?');
  };
  S.sm_quill_office = async function (w) {
    var n = w.npc('quill'); if (n) w.facePlayer(n);
    var s = sm();
    if (!g().flag('quill_met')) {
      w.setFlag('quill_met');
      await w.say('QUILL: Ah! A new face in my little company! You must be our marvelous new dockhand. I am Lysander Quill. Do call me Lys. Everyone does.');
      await w.say('QUILL: I do so love the festival. Lanterns, music, the smell of the harbor at dusk. Everything the sea has to offer, all in one week!');
      await w.say('QUILL: Now, work hard, be careful with the crates, and if anyone gives you any trouble, you tell dear Vespa. She has a way of making trouble simply melt.');
      await w.say('His smile is warm and easy. A silver chain glints at his collar with a tiny lighthouse charm. Something about it makes your neck prickle.');
      return;
    }
    if (at('costume') || at('parade')) return w.say('QUILL: A parade costume? How marvelous. Just remember, my dear, a costume is only as good as the person wearing it. I have seen so many people lose themselves in one.');
    return w.say('QUILL: You are doing splendidly. Do not let the noise bother you. It is only the festival. Everything is only the festival.');
  };
  // crates on the cannery wharf
  S.sm_crate_pick = async function (w, n) {
    var s = sm(); s.cr = s.cr || {};
    if (!at('shift')) return w.say('A crate stamped with a small lighthouse. Fish on top. It smells normal.');
    if (!g().count('dockvest')) return w.say('A crate. Probably not yours to carry.');
    if (s.cr[n.id]) return;
    var got = Object.keys(s.cr).length;
    if (n.id === 'crateB' && !s.peeked) {
      await w.say('This crate is lighter than the others. Something inside squeaks, softly, once.');
      if (await w.yesno('Peek inside?')) {
        s.peeked = true;
        await w.say('You pry the lid a finger\'s width. A frightened blue eye blinks back at you from a small cage. A Cliffswift chick, stuffed in straw.');
        await w.say('You close the lid gently. Your heart is hammering.');
        await addSusp(w, 1, 'A passing worker saw you peeking.');
      }
    }
    s.cr[n.id] = 1; n.hidden = true;
    if (PK.audio) PK.audio.sfx('select');
    await w.say('You hoist the crate onto your shoulder. (' + (got + 1) + '/3)');
    if (got + 1 >= 3) await w.say('That is all three. Time to take them to Foreman Brandt in the warehouse behind the Trading Co.');
  };
  S.sm_foreman = async function (w) {
    var n = w.npc('foreman'); if (n) w.facePlayer(n);
    var s = sm(); s.cr = s.cr || {};
    if (at('shift')) {
      if (Object.keys(s.cr).length < 3) return w.say('FOREMAN BRANDT: Three crates from the wharf. Not two. Not "a few". THREE. I can count to three, and so can you.');
      await w.say('FOREMAN BRANDT: Three crates. On time. Not a scratch. You will go far, kid. Very far. Somewhere far from here, if I have anything to say about it.');
      money(400);
      await w.say('You received 400 for the shift.');
      s.cr = {};
      PK.quest.advance('festival', 'junie');
      await w.say('FOREMAN BRANDT: Go get some air. There is a tavern on the green. The Salted Gull. Big Nan pours the good chowder.');
      return;
    }
    return w.say('FOREMAN BRANDT: Crates in, crates out. That is the whole job. Some people find it boring. Those people are happier than the ones who ask questions.');
  };
  // bouncing you out of the warehouse without a vest
  S.sm_warehouse_enter = async function (w) {
    if (g().count('dockvest') || PK.quest.done('festival')) return;
    await w.say('FOREMAN BRANDT: Hey! No vest, no entry! Out you go!');
    await PK.fx.fadeOut(12); w.load('sm_trading', 14, 3, 'down'); await PK.fx.fadeIn(12);
    await addSusp(w, 1, 'You wandered where you should not.');
  };

  // ================= Junie the journalist =================
  S.sm_junie = async function (w) {
    var n = w.npc('junie'); if (n) w.facePlayer(n);
    var s = sm();
    if (at('junie')) {
      await w.say('JUNIE: Oh! Another new dockhand! You have the look. You have the FEAR. I am Junie Fathom, Saltmarsh Gazette, and I have a story that no editor will touch.');
      await w.say('JUNIE: Every festival crate is stamped with a lighthouse. Kits keep vanishing from the coast: sky Kits on the slope, sea Kits from the tide pools. The Trading Co. keeps winning every contract. Every contract!');
      await w.say('JUNIE: The night ferry docks with no lights on it. I am dead sure of it. But every time I look, it has already gone. I need someone on the inside. And a witness.');
      await w.say('JUNIE: Here. A press camera. Snap three photos of crates that should not be where they are, and I will build a story. Also, talk to Keeper Tull at the Saltmarsh Light. He watches the sea. He watches everything.');
      await w.give('camera');
      PK.quest.start('scoop');
      PK.quest.advance('festival', 'keeper');
      return;
    }
    if (PK.quest.at('scoop', 'photos')) return w.say('JUNIE: How are the photos? Three crates, three clues. I keep the flash charged. It is the only thing I keep charged.');
    if (PK.quest.at('scoop', 'deliver')) {
      await w.say('JUNIE: The photos! Oh, I could kiss you. I will not. Just to be polite. Look at these!');
      await w.say('JUNIE: Three crates, same lighthouse, same shipping mark, three different addresses. It is not a supply line. It is a lie in triplicate.');
      PK.quest.complete('scoop');
      await w.give('luckyclover');
      await w.say('JUNIE: Take my old press pass, too. It will not open any doors. But it looks great in a wallet.');
      return;
    }
    if (PK.quest.done('festival')) return w.say('JUNIE: FRONT PAGE! "SALTMARSH SAVED BY A KID WHO WOULD NOT STOP ASKING QUESTIONS." I wrote it myself. In four minutes. It is my best work.');
    return w.say('JUNIE: I write down everything. Everything! Even this conversation. I am writing that I wrote that.');
  };
  // photo spots: the camera turns a crate into a clue
  function photoSpot(id) {
    return async function (w) {
      var s = sm(); s.photos = s.photos || {};
      if (!PK.quest.at('scoop', 'photos')) return w.say('A crate stamped with a small lighthouse. Fish on top. Smells normal.');
      if (!g().count('camera')) return w.say('A crate. If only you had a camera.');
      if (s.photos[id]) return w.say('You already photographed this crate.');
      s.photos[id] = 1;
      if (PK.audio) PK.audio.sfx('emote');
      PK.fx.flash(8, '#ffffff');
      await w.say('CLICK. You snap a photo of a crate stamped with a lighthouse. Under the straw, a faint scratch marks the lid from the inside.');
      var n = Object.keys(s.photos).length;
      await w.say('Photos: ' + n + '/3.');
      if (n >= 3) { PK.quest.advance('scoop', 'deliver'); await w.say('That is all three. Bring them to Junie at the Salted Gull.'); }
    };
  }
  S.sm_photo_market = photoSpot('market'); S.sm_photo_aq = photoSpot('aq'); S.sm_photo_wharf = photoSpot('wharf');

  // ================= Keeper Tull and the lighthouse =================
  S.sm_keeper = async function (w) {
    var n = w.npc('keeper'); if (n) w.facePlayer(n);
    var s = sm();
    if (at('keeper') && !s.keeperAsked) {
      s.keeperAsked = true;
      await w.say('KEEPER TULL: Hmph. Visitors. Another festival, another parade of people who want to see the lens. Nobody ever asks about the keeper.');
      await w.say('KEEPER TULL: ...You have the look of someone. That chin. That stubborn set to the jaw. I sailed with a man like that. Forty years ago. Last voyage of the Gull and Sun.');
      await w.say('KEEPER TULL: He wore a brass compass with two names on it. One was mine. The other... the other was his.');
      await w.say('KEEPER TULL: Junie sent you? The girl with the camera? Good. She is not wrong about the night ferry. I have seen it. A ship with no lights. Three long flashes, two short, from a shuttered lantern.');
      await w.say('KEEPER TULL: Go up to the balcony tonight and look north with the big glass. If it signals, come tell me. Then I will tell you a few things about your grandfather.');
      return;
    }
    if (at('keeper') && s.keeperAsked && !s.sawShip) return w.say('KEEPER TULL: Go up to the balcony after dark. Look north with the big glass. Three long, two short. I will be here.');
    if (at('keeper') && s.sawShip) {
      await w.say('KEEPER TULL: Three long, two short? Then it is as I feared. The Gull\'s Ransom. A ship with no flag that sails under the storm.');
      await w.say('KEEPER TULL: Here. This was in the compass case. A scrap of your grandfather\'s chart. He tore it in half the night before he vanished. I kept my half. The other half went with him.');
      await w.give('mappiece1');
      await w.say('KEEPER TULL: The Trading Co. holds their parade at dusk and ends it at the cannery. Costumed folk go anywhere at a parade. If you want to see what is under the cannery, put on a costume.');
      await w.say('KEEPER TULL: The Thimble and Thread workshop, west side of the green. Seamstress Marigold is very kind, and very expensive in sea glass.');
      PK.quest.advance('festival', 'costume');
      return;
    }
    if (PK.quest.done('festival')) {
      if (!g().flag('tull_gift')) { w.setFlag('tull_gift'); await w.say('KEEPER TULL: The light burned all night, and nobody had to pull the bell. You did well, kid. Your grandfather would have said so. Loudly.'); await w.give('boostcandy', 2); return; }
      return w.say('KEEPER TULL: Quiet nights are the best nights. Take the stairs slow. My knees are a hundred years old.');
    }
    return w.say('KEEPER TULL: The light is kept. All is well. That is the whole job, and it is the hardest job in the world.');
  };
  S.sm_scope_light = async function (w) {
    var s = sm();
    await w.say('You lean into the great brass telescope. The harbor slides into focus: piers, floats, a thousand tiny lights.');
    if (at('keeper') && s.keeperAsked && !s.sawShip) {
      if (!eve()) return w.say('Nothing unusual, but it is still bright out. The keeper said to look after dark.');
      await w.say('You sweep north. Past the dock lights, past the last buoy, where the water turns black... a shuttered lantern winks. Long. Long. Long. Short. Short.');
      await w.say('A hull slides into view, ridiculously dark. No flag. No lights. On the stern, in peeling paint: GULL\'S RANSOM.');
      s.sawShip = true;
      await w.say('That is what Tull was waiting for. Tell him.');
      return;
    }
    if (at('quill')) return w.say('Through the glass: the pier, the launch racks, and a tall figure in a cream suit on the fireworks platform, adjusting a wire with a smile.');
    await w.say('Out where the sea turns dark, the storm belt sits like a wall. Lightning walks along its edge.');
  };
  S.sm_signalman = async function (w) {
    var n = w.npc('signalman'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) return w.say('SIGNALMAN: The signal panel says ALL WELL and I finally believe it.');
    await w.say('SIGNALMAN: Every night I send ALL WELL. Every night, someone blinks back a different message. Yesterday it was "TIDE LOW, WRECK SAFE." I am not paid enough to have opinions.');
  };

  // ================= costume workshop =================
  S.sm_seam = async function (w) {
    var n = w.npc('seam'); if (n) w.facePlayer(n);
    if (at('costume')) {
      if (g().count('paradecostume')) return w.say('MARIGOLD: You are wearing the best thing I have ever made. Do not ruin it. Do not dance in the harbor.');
      await w.say('MARIGOLD: A costume? Oh, my dear, every troupe slot is booked. Unless... you have Sea Glass? Three pieces of frosted sea glass. I sew them into the trim. They catch the lantern light. Lovely.');
      var have = g().count('seaglass');
      if (have < 3) return w.say('MARIGOLD: You have ' + have + '. Three, please. You will find some on the beaches and flats, behind the market, and in odd corners. They shine a little.');
      if (!(await w.yesno('Give her 3 Sea Glass for a Parade Costume?'))) return;
      g().removeItem('seaglass', 3);
      await w.say('MARIGOLD: Stand still! Hands up! Turn! Chin down! Oh, it is PERFECT. A troupe member. A star. A sardine.');
      await w.give('paradecostume');
      PK.quest.advance('festival', 'parade');
      await w.say('MARIGOLD: Now go find Marshal Fenwick on the green. He hands out the route. And keep the feathers out of the harbor. They do not dry.');
      return;
    }
    if (PK.quest.done('festival')) return w.say('MARIGOLD: Now that the Great Catch is over I can finally make normal clothes. Do you know how boring hems are? I love them so much.');
    return w.say('MARIGOLD: Feathers, sequins, and sea glass! Every costume is unique and every costume is late.');
  };

  // ================= the tavern =================
  S.sm_nan = async function (w) {
    var n = w.npc('nan'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) return w.say('BIG NAN: Half the town has been in to say thank you. The other half has been in to see the person everyone is thanking. Have a chowder. On the house.');
    await w.say('BIG NAN: The Salted Gull! Chowder in the pot, jig on the fiddle, and no questions past the second mug.');
    await w.say('BIG NAN: You look like someone who needs a chowder. Do you want a chowder? Everybody wants a chowder.');
    var pick = await w.ask('BIG NAN: What will it be?', ['A bowl of chowder', 'Just looking']);
    if (pick === 0) { await w.heal(); await w.say('BIG NAN: There! Hot, creamy, and your Kits get a bite too. You are all patched up.'); }
  };
  S.sm_rumor1 = async function (w) {
    var n = w.npc('sailorA'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) return w.say('SAILOR: I told you the harbor was full of secrets. Now it is full of quiet.');
    await w.say('SAILOR: The wreck on the old flats? Aye. Shows at low tide, all rusty and bent. They say the lantern inside never goes out. I saw it. The lantern blinked at me.');
    await w.say('SAILOR: The harbor master says it is safe. He says a lot of things. Half of them are about the Golden Reel.');
  };
  S.sm_rumor2 = async function (w) {
    var n = w.npc('sailorB'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) return w.say('PIRATE: A retired pirate has nothing to say. Except: the island is real. I never told you that.');
    await w.say('PIRATE: A map, is it? Three scraps, torn on purpose. One in the shipyard, one in the wreck, one in the market. Follow the X to the rock in the bay.');
    await w.say('PIRATE: Take a raft. Take a lamp. Take a friend who can swim. Do not take the Corsaircat. The Corsaircat has had enough.');
  };
  S.sm_battletable = async function (w) {
    var n = w.npc('gambler'); if (n) w.facePlayer(n);
    await w.say('GAMBLER: A friendly battle at the table? Loser buys the chowder. Winner gets bragging rights and maybe a shell or two.');
    if (!(await w.yesno('Battle the gambler?'))) return;
    var id = ['sm_g1', 'sm_g2', 'sm_g3'][sm().tableRound = ((sm().tableRound || 0) % 3)];
    sm().tableRound++;
    var r = await w.battle(id, { canLose: true });
    if (r === 'win') { money(150); await w.say('GAMBLER: Ha! You got me! Here is the pot. Come back for another round anytime.'); }
    else await w.say('GAMBLER: Better luck next time! The chowder is on you.');
  };
  TK('sm_g1', 'Gambler', 'Rook', 'hiker', [[65, 18], [62, 17]], { reward: 40, canLose: true, noRematch: false, intro: 'Cards are for beginners. Battles are for people with nerve.', after: 'Not bad at all.' });
  TK('sm_g2', 'Gambler', 'Rook', 'hiker', [[73, 19], [66, 19]], { reward: 55, canLose: true, noRematch: false, intro: 'Round two! The stakes have gone up. By four shells.', after: 'Fair play. Come back for round three.' });
  TK('sm_g3', 'Gambler', 'Rook', 'hiker', [[70, 20], [59, 20], [64, 20]], { reward: 75, canLose: true, noRematch: false, intro: 'Round three! The final table! The good chowder!', after: 'You have earned that chowder. I will buy it.' });

  // ================= the arcade =================
  S.sm_arcade_clerk = async function (w) {
    var n = w.npc('clerk'); if (n) w.facePlayer(n);
    await w.say('CLERK: Shell Tokens: three plays for one Sea Glass. Or, if you would like, I take coins. Ha! Coins! We do not take coins. Bring me glass.');
    if (PK.quest.done('festival')) await w.say('CLERK: The festival is over, so the games are free until closing. Try the claw! Try everything!');
  };
  function playCost(w) { if (PK.quest.done('festival')) return true; return true; }
  S.sm_claw = async function (w) {
    await w.say('A pink claw machine full of plush Kits. The claw glints hopefully.');
    if (!(await w.yesno('Play the claw machine? (100)'))) return;
    if ((g().state.money || 0) < 100) return w.say('You are 100 short. The claw looks disappointed.');
    money(-100);
    var r = await PK.minigame.claw({ title: 'CLAW MACHINE', tries: 2, grip: 0.7 });
    if (r.win) {
      var prizes = ['kittreat', 'fancytreat', 'sugarwhirl', 'honeybun', 'shavedice'];
      var pz = prizes[Math.floor(Math.random() * prizes.length)];
      await w.say('The claw drops a plush into the chute. Inside its tiny pocket: a prize!');
      await w.give(pz);
    } else await w.say('The claw sighs. Nobody hears it. It sighs anyway.');
  };
  S.sm_strength = async function (w) {
    await w.say('TEST YOUR MIGHT! Whack the pad, ring the bell, become a legend!');
    if (!(await w.yesno('Swing the hammer? (100)'))) return;
    if ((g().state.money || 0) < 100) return w.say('You need 100 for the hammer.');
    money(-100);
    var r = await PK.minigame.timing({ title: 'TEST YOUR MIGHT', hint: 'Stop the marker in the gold zone', hits: 4, speed: 2.2, zone: 22, theme: 'strength', good: ['THUD!', 'WHAM!', 'CRACK!'], winMsg: 'DING! The bell rings!', badMsg: 'Weak swing!', loseMsg: 'The puck barely moved.' });
    if (r.win) { await w.say('DING! DING! DING! The whole arcade turns to look. The attendant rings a bell of his own.'); await w.give('mightroot'); }
    else await w.say('The puck lands with a sad clunk. "So close," says the attendant. It was not close.');
  };
  S.sm_ringtoss = async function (w) {
    await w.say('RING TOSS! Get a ring over a bottle and take home a prize.');
    if (!(await w.yesno('Play ring toss? (80)'))) return;
    if ((g().state.money || 0) < 80) return w.say('You are short.');
    money(-80);
    var r = await PK.minigame.timing({ title: 'RING TOSS', hint: 'Time your throw', hits: 3, speed: 1.9, zone: 24, misses: 3, theme: 'ring', good: ['Around it!', 'Ring!', 'Ringer!'], winMsg: 'Three rings on three bottles!', badMsg: 'Bounced off!', loseMsg: 'Out of rings.' });
    if (r.win) { await w.say('Three rings, three bottles, three cheers!'); await w.give(['tonic', 'hitonic', 'remedy'][Math.floor(Math.random() * 3)], 2); }
    else await w.say('The bottles are a little wider than the rings. Nobody mentions this.');
  };
  S.sm_shellgame = async function (w) {
    await w.say('THREE CUPS AND A TINY KIT. Find the one under the cup. Simple!');
    if (!(await w.yesno('Play the shell game? (60)'))) return;
    if ((g().state.money || 0) < 60) return w.say('You need 60.');
    money(-60);
    var win = Math.floor(Math.random() * 3);
    await w.say('The cups slide. Left, right, over, under. Faster, faster, a blur of red...');
    var pick = await w.ask('Which cup hides the Kit?', ['Left', 'Middle', 'Right']);
    if (pick < 0) return;
    if (pick === win) { await w.say('You lifted the right cup! A tiny Kit blinks up at you.'); money(180); await w.say('You won 180!'); }
    else await w.say('Wrong cup! The Kit was under the ' + ['left', 'middle', 'right'][win] + ' one, laughing.');
  };

  // ================= aquarium =================
  S.sm_curator = async function (w) {
    var n = w.npc('curator'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) {
      await w.say('CURATOR IONE: The empty tanks in the back are full again. The Kits came home. The cages are gone, and the whole aquarium hums like a shell held to the ear.');
      return w.say('CURATOR IONE: Come and see the Twinklearm pool at night. It is the best thing we have.');
    }
    await w.say('CURATOR IONE: Welcome to the Saltmarsh Aquarium! I am Ione Varga. I would show you around, but three of my tanks are empty and I cannot explain why.');
    await w.say('CURATOR IONE: Sky Kits that drift to the harbor. Small tide-pool Kits. Something takes them in the night. The company\'s boats dock behind the aquarium. I have asked. I have been told it is "festival supply".');
    await w.say('CURATOR IONE: If you see anyone with a lighthouse on a crate, tell me. I am not a brave woman. But I am a very determined one.');
  };

  // ================= lab =================
  S.sm_halvard = async function (w) {
    var n = w.npc('halvard'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) {
      await w.say('DR. GLASS: The storm belt has stopped growing. The lightning count is down to two. Do you know what that means? It means somebody stopped feeding it.');
      return w.say('DR. GLASS: Beyond the belt is an island. Nobody has crossed in three hundred years. If you want to try, you will need the Raft, and a Kit the storm respects. The Oracle, perhaps.');
    }
    await w.say('DR. GLASS: Storm Research Lab! I am Dr. Halvard Glass, and I am about to tell you the most alarming thing you will hear this week.');
    await w.say('DR. GLASS: A belt of storm has sat north of the harbor for a month. It should have moved. It has grown a mile a day. Storms do not do that. Storms are stupid. Something is FEEDING it.');
    await w.say('DR. GLASS: Nobody sails through. Nobody sails around. Whatever is on the other side has been left alone for three hundred years. The fisher legends call it the Island. The sea legends call it worse.');
    await w.say('DR. GLASS: The old sea charts mention an Oracle. A tidal spirit that walks the belt and parts it for those it favors. Nobody has seen it. My assistant says it is a myth. I say it is a very good myth.');
  };

  // ================= inn =================
  S.sm_innkeeper = async function (w) {
    var n = w.npc('portia'); if (n) w.facePlayer(n);
    await w.say('PORTIA: Welcome to the Harbor Inn! Rooms over the water, chowder downstairs, a mattress you will not want to leave.');
    var pick = await w.ask('PORTIA: What can I do for you?', ['Rest (heal your team)', 'Rest until evening', 'Rest until late night', 'Rest until dawn', 'Never mind']);
    if (pick === 4 || pick < 0) return;
    await PK.fx.fadeOut(20);
    await w.heal();
    if (pick === 1) g().setTime('evening'); else if (pick === 2) { g().setTime('night'); g().state.clockOff += Math.round(0.1 * g().DAY_FRAMES); } else if (pick === 3) { g().setTime('morning'); }
    g().state.clinic = { map: 'sm_inn', x: 1, y: 4 };
    await PK.fx.fadeIn(20);
    await w.say('PORTIA: Rested and ready! ' + (pick === 0 ? 'Your Kits are good as new.' : pick === 1 ? 'The lanterns are lighting up outside.' : pick === 2 ? 'The harbor is dark and the tide is falling.' : 'The sun is coming up over the water.'));
  };
  S.sm_accountant = async function (w) {
    var n = w.npc('accountant'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) return w.say('ACCOUNTANT: I quit. I handed in my notice by hand. The company did not have a handwriting department, so it was accepted immediately. I feel wonderful.');
    if (past('junie') && !sm().acctTalk) {
      sm().acctTalk = true;
      await w.say('ACCOUNTANT: Shh! Please. I keep the books for the Lighthouse Trading Co. and I have been terrified for three months. I stay at the inn so nobody sees me talking.');
      await w.say('ACCOUNTANT: The company\'s expenses do not match its income. The difference goes to something called "the storm fund". And a line item: "Oracle, live."');
      await w.say('ACCOUNTANT: There is a ledger in the cellar under the cannery. The real one. That is all I know. Please do not say where you heard it.');
      return;
    }
    await w.say('ACCOUNTANT: I am just an accountant. Numbers are quiet. It is people who are loud.');
  };

  // ================= harbor master, ghost ship, rod contest =================
  S.sm_tobias = async function (w) {
    var n = w.npc('tobias'); if (n) w.facePlayer(n);
    var s = sm();
    if (PK.quest.done('festival')) {
      if (!PK.quest.has('rodcontest') || PK.quest.done('rodcontest')) return w.say('TOBIAS: Quiet harbor. Tidy books. A trophy in the case. I could cry, and I might.');
    }
    if (PK.quest.at('rodcontest', 'weigh')) {
      await w.say('TOBIAS: Three big ones? Let me see. Well I will be! A Stormray, a Jellyp the size of a hat, and a Trinkrab that hoards a whole shell collection.');
      PK.quest.complete('rodcontest');
      await w.say('TOBIAS: The Golden Reel is yours. It has never been won fairly. Now it has. Enjoy the shine!');
      await w.give('goldenreel');
      if (!g().count('goodrod')) { await w.give('goodrod'); await w.say('TOBIAS: And take this Harbor Rod. It reaches the deep water. Now the fish can be afraid of you.'); }
      return;
    }
    if (PK.quest.at('ghostship', 'report')) {
      await w.say('TOBIAS: You went in? The wreck on the flats? And the bell... you rang the bell? Well, the lights have gone out on the flats. First time in a century.');
      await w.say('TOBIAS: That was Captain Arlo Fenn\'s ship. The Gull\'s Bounty, sunk in a storm with all hands. He never left. Now he can. Thank you.');
      PK.quest.complete('ghostship');
      await w.give('pluscapsule', 3);
      await w.say('TOBIAS: The sea charts in his cabin are yours. Some of them are marked with an X, if you have a pirate\'s patience.');
      return;
    }
    await w.say('TOBIAS: Harbor Master Tobias. I know every ship that has ever come or gone. Except one. Some nights there is a ship with no name.');
    var opts = [];
    if (!PK.quest.has('rodcontest')) opts.push('Enter the Rod Contest'); else opts.push('The Rod Contest');
    if (!PK.quest.has('ghostship')) opts.push('Ask about the wreck'); else opts.push('The wreck');
    opts.push('Never mind');
    var pick = await w.ask('TOBIAS: What can I do for you?', opts);
    if (pick === 0) {
      if (!PK.quest.has('rodcontest')) {
        await w.say('TOBIAS: The Great Catch Rod Contest! Three big fish from three spots: the Market pier, the Harbor pier, and the cannery wharf. Catch them with the reel game. Then I weigh them.');
        PK.quest.start('rodcontest');
      } else await w.say('TOBIAS: Three big ones from the piers. Use the reel game at each spot. Then come back and I will weigh them.');
    } else if (pick === 1) {
      if (!PK.quest.has('ghostship')) {
        await w.say('TOBIAS: The wreck on the Old Docks flats? It only shows at low tide. Lights inside that have never gone out. I have sent three sailors to look. All three came back and refused to describe it.');
        await w.say('TOBIAS: If you go, ring the ship\'s bell on the top deck. That is what Captain Fenn wanted, if the old stories are right.');
        PK.quest.start('ghostship');
      } else await w.say('TOBIAS: Low tide, a lantern, and the bell in the captain\'s cabin. That is all I know.');
    }
  };
  // contest spots on the piers
  S.sm_contest_spot = async function (w, n) {
    var s = sm(); s.spots = s.spots || {};
    if (!PK.quest.at('rodcontest', 'catch')) return w.say('A fishing spot with a numbered sign. The contest is run by the harbor master.');
    if (s.spots[n.id]) return w.say('You already caught a big one here.');
    await w.say('A contest fishing spot. The water is dark and the sign says: BIG ONES ONLY.');
    if (!(await w.yesno('Fish here?'))) return;
    var r = await PK.minigame.timing({ title: 'CONTEST FISH', hint: 'Stop the marker in the gold zone', hits: 3, speed: 2.0, zone: 24, theme: 'fish', good: ['A tug!', 'Something big!', 'Hold on!'], winMsg: 'A monster on the line!', badMsg: 'It got away!', loseMsg: 'The line snapped.' });
    if (!r.win) return w.say(r.quit ? 'You put the rod down.' : 'It got away. There is always another tide.');
    s.spots[n.id] = 1;
    var caught = Object.keys(s.spots).length;
    await w.say('You haul in a huge fish, all scales and sparkle. (' + caught + '/3)');
    if (caught >= 3) { PK.quest.advance('rodcontest', 'weigh'); await w.say('Three big ones. Take them to Harbor Master Tobias.'); }
  };
  S.sm_reel = async function (w) {
    var n = w.npc('reel'); if (n) w.facePlayer(n);
    await w.say('ANGLER REEL: Reel & Tackle! Rods, line, hooks, and stories about the one that got away.');
    if (g().count('goodrod')) return w.say('ANGLER REEL: You already have a Harbor Rod. I could sell you a different one, but you would be lying to yourself.');
    await w.say('ANGLER REEL: The Harbor Rod reaches the deep water off the piers. Twelve hundred. It is the best twelve hundred you will ever spend.');
    if (!(await w.yesno('Buy the Harbor Rod for 1200?'))) return;
    if ((g().state.money || 0) < 1200) return w.say('ANGLER REEL: You are a little short. Come back with the rest.');
    money(-1200);
    await w.give('goodrod');
    await w.say('ANGLER REEL: A fine choice! Face deep water and use it. Baits work too: Spark, Glow, and Shell. Use one from your bag before you cast.');
  };
  S.sm_trader = async function (w) {
    var n = w.npc('trader'); if (n) w.facePlayer(n);
    var have = g().count('seaglass');
    await w.say('TRADER: Sea glass! Frosted, tumbled, beautiful. Each piece a little map of a storm somewhere. I collect them. I trade for them.');
    await w.say('TRADER: You have ' + have + '. For 3 pieces I give a Boost Candy. For 5, a Lucky Clover. For 8, a Pro Capsule. For 12... something special.');
    var pick = await w.ask('TRADER: What would you like?', ['3 glass: Boost Candy', '5 glass: Lucky Clover', '8 glass: Pro Capsule', '12 glass: Mystery', 'Never mind']);
    var cost = [3, 5, 8, 12][pick];
    if (cost == null) return;
    if (have < cost) return w.say('TRADER: A few short. There is always more glass on the tide.');
    g().removeItem('seaglass', cost);
    var prize = ['boostcandy', 'luckyclover', 'procapsule', 'safaricapsule'][pick];
    if (pick === 3) { await w.say('TRADER: The mystery! An old collector\'s prize. Not a soul has asked for it in years.'); await w.give('omnicapsule'); }
    else await w.give(prize);
  };
  // the wreck
  S.sm_ghost_enter = async function (w) {
    if (!g().flag('wreck_seen')) {
      w.setFlag('wreck_seen');
      await w.say('You climb down the hatch. Every porthole glows a pale blue. The deck is cold under your boots and the air smells of salt and violets.');
      if (!PK.quest.has('ghostship')) PK.quest.start('ghostship');
    }
  };
  S.sm_wreck_enter = async function (w) {
    if (!g().flag('wreck_seen')) {
      w.setFlag('wreck_seen');
      await w.say('A rusted hull sticks out of the wet sand, tilted like a tired giant. A lantern in a broken porthole glows pale blue. It does not flicker.');
      if (!PK.quest.has('ghostship')) PK.quest.start('ghostship');
    }
    if (!(await w.yesno('Climb down the hatch into the wreck?'))) return;
    await PK.fx.fadeOut(14); w.load('sm_ghost1', 8, 8, 'up'); await PK.fx.fadeIn(14);
  };
  S.sm_ghostbell = async function (w) {
    if (g().flag('ghost_open')) return w.say('The bell hangs quiet.');
    if (!(await w.yesno('Ring the captain\'s bell?'))) return;
    if (PK.audio) PK.audio.sfx('door');
    await w.say('You pull the rope. A single brass note rolls through the wreck. Every pale light in the hull flickers... and steadies. Then, one by one, they go out.');
    await w.say('A quiet voice, very close: "Ah. That is the bell. Thank you, lad."');
    w.setFlag('ghost_open');
    if (PK.quest.at('ghostship', 'lights')) PK.quest.advance('ghostship', 'bell');
    if (PK.quest.at('ghostship', 'bell')) PK.quest.advance('ghostship', 'report');
  };
  S.sm_ghostcaptain = async function (w) {
    var n = w.npc('captain'); if (n) w.facePlayer(n);
    if (!g().flag('ghost_open')) return w.say('The captain stares through the glass of the cabin window at a sea he cannot see. He does not hear you.');
    await w.say('CAPTAIN FENN: The Gull\'s Bounty, hit by a storm a hundred years ago. We never left. We kept the lamp lit for anyone who might need it. A hundred years is a long time to hold a lamp.');
    await w.say('CAPTAIN FENN: There is a scrap of chart in the drawer, marked by my navigator. I do not need it any more. Perhaps you do. Somewhere in the bay there is a cove that keeps a small treasure.');
    if (!g().count('covemap2')) await w.give('covemap2');
    await w.say('CAPTAIN FENN: Go gently, lad. The tide will remember you.');
  };
  S.sm_cove_chest = async function (w) {
    if (g().flag('cove_done')) return w.say('The chest is empty, except for a very small note: "THANKS, KID. -A PIRATE."');
    await w.say('You lift the lid. A heap of glittering coins, gems, and an old telescope with a compass on the side.');
    await w.give('omnicapsule', 2);
    await w.give('boostcandy', 3);
    await w.give('luckyclover');
    w.setFlag('cove_done');
    if (PK.quest.has('cove') && !PK.quest.done('cove')) PK.quest.complete('cove');
  };
  // the treasure map: three scraps, then the Raft
  S.sm_cove_check = function () {
    if (PK.quest.has('cove') && PK.quest.at('cove', 'map') && g().count('covemap1') && g().count('covemap2') && g().count('covemap3')) PK.quest.advance('cove', 'cove');
  };
  S.sm_shipwright = async function (w) {
    var n = w.npc('ondine'); if (n) w.facePlayer(n);
    if (PK.quest.done('festival')) { await w.say('ONDINE: The floats are all folded away, and I have never been so bored. I love it. I could build you a boat, but you already have a Raft.'); return; }
    await w.say('ONDINE: Shipwright Ondine. Boats by day, floats by night. The floats are much harder.');
    if (!g().count('covemap1')) {
      await w.say('ONDINE: Torn scrap of paper stuck in a plank? Yes, it is a map. My grandfather hid it there. He hid everything everywhere. Take it.');
      await w.give('covemap1');
      if (!PK.quest.has('cove')) PK.quest.start('cove');
      await w.say('ONDINE: If you find the other two scraps, there is a cove on the rock in the bay. You will need a raft.');
    } else await w.say('ONDINE: Remember, it is a rock in the bay. A raft, a lamp, and a good sense of direction.');
  };
  S.sm_cellar_gate = async function (w) {
    var s = sm();
    var d = w.npc('cellargate');
    if (!at('parade') && !past('parade')) return w.say('A heavy iron gate at the back of the cannery. A sign: STAFF ONLY. THE STAIRS ARE NOT FOR VISITORS.');
    if (at('parade') && s.paradeOn && s.costume && !s.paradeMissed) {
      await w.say('DOORMAN: Halt! ...Oh. A parade troupe member. In a sardine. Fine, fine. The parade uses the back stairs to reach the harbor. Down you go. Do not touch anything.');
      w.setFlag('cellar_open'); if (d) d.hidden = true;
      return;
    }
    if (s.paradeMissed && at('parade')) {
      await w.say('DOORMAN: You again? The dock rat with the nosy look? Get out of here. Unless you fancy a fight.');
      if (await w.yesno('Fight the doorman?')) {
        var r = await w.battle('sm_c4');
        if (r === 'win') { w.setFlag('cellar_open'); if (d) d.hidden = true; await w.say('DOORMAN: Fine! Go! The Elder can deal with you himself!'); }
      }
      return;
    }
    if (g().count('paradecostume') && !s.costume) return w.say('DOORMAN: No. No costume, no stairs. Parade troupe only. Are you in the troupe? Are you wearing the costume? No.');
    await w.say('DOORMAN: Staff only. The stairs are not for visitors.');
    await addSusp(w, 1, 'The doorman does not like you loitering.');
  };
  // cellar: the ledger, cages and the Elder
  S.sm_cages = async function (w, n) {
    var s = sm();
    if (g().flag('cellar_clear')) return w.say('The cage is open. It is empty. A few blue feathers are stuck to the bars.');
    await w.say('A small Kit huddles in a wire cage. It looks up with huge eyes. There are more cages behind it. So many.');
    if (!(await w.yesno('Open the cages?'))) return;
    await w.say('You start working the latch. Somebody behind you clears their throat.');
    var a = w.npc('guardA') || w.npc('guardA2');
    if (a) w.emote(a, '!');
    await addSusp(w, 1, 'The guards spotted you at the cages.');
    var r = await w.battle('sm_c1');
    if (r === 'win') r = await w.battle('sm_c2');
    if (r !== 'win') return;
    w.setFlag('cellar_clear');
    ['guardA', 'guardB', 'guardA2', 'guardB2'].forEach(function (id) { var gd = w.npc(id); if (gd) gd.hidden = true; });
    await w.say('The Cinders bolt for the stairs. You spring the latches one by one. The Kits pour out: a Cliffswift, a Cargobeak, a Bilgekin, a dozen frightened little shapes that vanish up the stairwell to freedom.');
    await w.say('One stays behind, peeking out of the straw. It follows you at a distance. It is not scared of you. It has decided you are safe.');
    await w.giveKit(52, 18);
    if (!g().count('manifest')) {
      await w.say('On the ledger desk, under a coffee cup, lies the real book. You flip through it: names of Kits, prices, dates, routes. Every route ends the same way: "storm belt".');
      await w.say('The last page: a schedule. Three nights. LANTERN PARADE: cargo moves. LOW TIDE: ship arrives at the wreck. FIREWORKS: the Oracle.');
      await w.give('manifest');
    }
    await w.say('From the top of the stairs, a warm voice drifts down. It does not sound angry. That is the worst part.');
    await w.say('QUILL: Oh dear, dear. A parade guest who wandered downstairs. I do hope you are not lost, my dear.');
    await w.say('He does not come down. He does not need to. His footsteps walk away, calm as tea. You know that he knows.');
    w.setFlag('night1_done');
    applyCostume(false);
    sm().costume = false; sm().paradeOn = false;
    PK.quest.advance('festival', 'lowtide');
    g().state.sm.day = 2;
    await w.say('You slip out through the cannery with the manifest under your costume. Dawn is still an hour away. One more night: the ferry, at low tide, at the old wreck.');
    sm().tideOn = true;
  };

  // ================= night 2: the ferry at the wreck =================
  async function ferryScene(w) {
    var s = sm();
    w.setFlag('ferry_seen');
    w.music('mystery');
    await w.say('The tide has drawn the sea back from the flats. Out where the water meets the dark, a shape without a single light slides in: the Gull\'s Ransom.');
    await w.say('A boat noses onto the sand. Grey cloaks hop down. Crates, cages, straw. A hooded figure counts them off.');
    await w.say('CINDER: Storm Kits go to the belt. The rest go to the buyer. The Elder wants the cargo aboard before the fireworks. Green, white, red.');
    await w.say('CINDER: And the Oracle? ...Tomorrow night. He says the light will call it. He says the lighthouse lens is the lure.');
    await w.say('A drip of chowder falls off your sleeve into a puddle. All four Cinders look up.');
    var r = await w.battle('sm_c3');
    if (r === 'win') r = await w.battle('sm_c4');
    if (r === 'win') {
      await w.say('The last Cinder splashes back aboard. The Gull\'s Ransom backs off the flats and disappears into the dark. A crate lies where they dropped it.');
      await w.say('Inside: a lens mount, a coil of brass wire, and a shipping tag: "TO THE SALTMARSH LIGHT. FOR THE LURE."');
      await w.say('The fireworks tomorrow are not a party. They are a signal. And the lighthouse is the bait.');
      PK.quest.advance('festival', 'gym');
      g().state.sm.day = 3;
      s.tideOn = false;
      await w.say('Marlo Luce runs the fireworks from the Beacon Playhouse. If anyone knows what those rockets are meant to do, it is him.');
    }
    w.playMapMusic();
  }

  // ================= sibling in the tavern (secret meeting) =================
  S.sm_sibling_tavern = async function (w) {
    var n = w.npc('sibT'); if (n) w.facePlayer(n);
    if (g().flag('sib_met_sm')) return;
    w.setFlag('sib_met_sm');
    w.music('sibling');
    await w.say('{RIVAL}: Do not turn around. Sit. Drink something. Pretend we are strangers arguing about chowder.');
    await w.say('{RIVAL}: I know about the cellar. I have been under the cannery twice. There are cages. There is a ledger. There is a ferry, a wreck, a lighthouse lens, and the biggest, quietest, nicest Elder I have ever met.');
    await w.say('{RIVAL}: Quill gave me tea. It was Kit-calming. It was in MY cup. He wanted to see how much I would trust him. I drank it, {PLAYER}. I drank it and smiled.');
    await w.say('{RIVAL}: The Accord wants something called the Oracle. It lives in the storm. It can part the belt. Beyond the belt is the island the tablet points to. The sleeping thing is there.');
    await w.say('{RIVAL}: I am not telling you not to go. I am telling you to go carefully. And here. These are the last of my smoke pellets. I do not need them where I am going.');
    await w.give('smokepellet', 3);
    await w.say('{RIVAL}: Do not look at me. Do not wave. Do not wait. I was never here.');
    var s2 = w.npc('sibT'); if (s2) { await w.moveNpc(s2, 'ddddd'); s2.hidden = true; }
    w.playMapMusic();
  };

  // ================= night 3: Elder Quill at the lighthouse, then the Oracle =================
  S.sm_quill_top = async function (w) {
    var q = w.npc('quilltop');
    if (!q) return;
    w.music('mystery');
    if (q) w.facePlayer(q);
    await w.say('QUILL: Ah! The dockhand. The photographer. The sardine. How very good of you to come.');
    await w.say('QUILL: You are wondering how I know. My dear, I own the harbor. Nothing moves in it that I do not hear about. The cellar, the cages, the wreck, Marlo\'s little conscience. All of it.');
    await w.say('QUILL: I could have stopped you a dozen times. I did not. You see, I love a good story, and you are the most delightful one this festival has produced.');
    await w.say('QUILL: Let me tell you mine. Three hundred years ago something was sealed away beyond the storm belt. The Accord wishes to wake it. It sleeps on an island the sea guards with a wall of thunder.');
    await w.say('QUILL: The only thing that walks that wall is the Oracle. It answers to light and song. Tonight the lens, the rockets and the Playhouse chorus will sing it out of the deep. And I, with a very small cage, will hold the door.');
    await w.say('QUILL: Do step aside, dear. Or do not. I would so love a duel. I am told I am gracious in defeat.');
    var r = await w.battle('sm_quill');
    if (r !== 'win') return;
    await w.say('QUILL: Oh! Oh, how very nice. Gracious indeed. I have not lost like that in twenty years.');
    await w.say('QUILL: A pity about the plan, though. The lens is already turning. The rockets are already lit. And you have just made me late for a very important boat.');
    await w.say('He steps onto the rail, tips an imaginary hat, and drops into the dark. A small boat cuts across the harbor toward the storm belt. The Gull\'s Ransom answers with one long flash.');
    q.hidden = true; w.setFlag('quill_gone');
    PK.quest.advance('festival', 'oracle');
    await w.say('Below, the fireworks begin. Green over white over red. The great lens swells with light. The whole harbor holds its breath.');
    w.playMapMusic();
    await oracleScene(w);
  };
  async function oracleScene(w) {
    g().setTime('night');
    await PK.fx.fadeOut(20);
    w.load('sm_light5', 10, 8, 'up');
    await PK.fx.fadeIn(20);
    w.music('legend');
    await w.say('From the balcony you can see everything. Rockets bloom over the bay, green, white, red, green, white, red. The lens throws a beam across the black water.');
    await w.say('For a long moment, nothing. Then the sea itself lifts.');
    await w.say('A serpent rises, longer than any ship, scaled in deep teal and pale gold. A crown of eyes drifts around its head, each in its own bubble, each looking at something different: a storm, a tide, a face in the crowd, you.');
    await w.say('The Tidal Oracle turns. For a moment every one of its eyes is on you.');
    await w.say('It does not follow the lens. It does not obey the rockets. It circles the balcony, once, slowly, as if it has been looking for someone.');
    var r = await w.wildBattle(78, 28, { legend: true, music: 'legend', noRun: false, noPrism: true });
    void r;
    await finishFestival(w);
  }
  async function finishFestival(w) {
    var st = g().state;
    if (PK.quest.done('festival')) return;
    PK.quest.complete('festival');
    w.setFlag('festival_done');
    sm().day = 4;
    await w.say('The storm belt shudders. The thunder that has sat on the horizon for a month backs slowly out to sea. A single clean sky opens over the harbor.');
    await w.say('Down on the green, the crowd is cheering. Nobody knows quite what they are cheering for. Everybody is cheering anyway.');
    await w.say('Saltmarsh exhales. The Great Catch is over. Tomorrow the bunting comes down, the floats fold away, and the harbor goes back to being a harbor.');
    await w.say('Beyond the storm belt, on the far side of a sea that is no longer a wall, the outline of an island sits in the last light.');
    w.playMapMusic();
    await w.say('NEW: The Raft can carry you over the harbor and beyond. The Oracle remembers you.');
  }
  S.sm_argus = async function (w) {
    await w.say('The Tidal Oracle rises from the swell, eyes drifting in their bubbles. It waits.');
    var r = await w.wildBattle(78, 28, { legend: true, music: 'legend', noRun: false, noPrism: true });
    void r;
  };
  S.sm_scope_noop = async function () {};
})();
