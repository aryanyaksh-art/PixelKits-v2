// Story script registry and reusable event helpers. Scripts receive the world API (PK.world) as `w`.
// Each area file (data/v2/*.js) adds its own scripts to PK.SCRIPTS and quests to PK.QUESTS.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var CREST_NAMES = ['Sprout Crest', 'Bedrock Crest', 'Spark Crest', 'Wave Crest', 'Ember Crest', 'Mirror Crest', 'Rime Crest', 'Umbra Crest'];
  PK.CREST_NAMES = CREST_NAMES;
  PK.SCRIPTS = PK.SCRIPTS || {};
  PK.QUESTS = PK.QUESTS || {};
  function st() { return PK.game.state; }
  function crest(i) { return !!st().crests[i]; }

  PK.story = {
    crest: crest,
    // Gym warden conversation + battle + reward
    warden: function (o) {
      return async function (w) {
        if (crest(o.i)) return w.say(o.after);
        await w.say(o.intro);
        var r = await w.battle(o.trainer);
        if (r !== 'win') return;
        await w.say(o.win);
        st().crests[o.i] = true;
        if (PK.audio) PK.audio.jingle('crest');
        await w.say(st().player.name + ' received the ' + CREST_NAMES[o.i] + '!');
        if (o.disc) {
          await w.say('Take this too. It will serve you well.');
          await w.give(o.disc);
        }
        if (o.extra) await w.say(o.extra);
      };
    },
    // One-time item gift with an optional condition
    gift: function (flag, item, pre, post, cond, notYet) {
      return async function (w) {
        if (cond && !cond()) return w.say(notYet);
        if (w.flag(flag)) return w.say(post);
        await w.say(pre);
        await w.give(item);
        w.setFlag(flag);
        if (post) await w.say(post);
      };
    },
    guardian: function (id, lvl, flag, text) {
      return async function (w, n) {
        await w.say(text);
        if (PK.audio) PK.audio.cry(id);
        await w.wait(30);
        var out = await w.wildBattle(id, lvl, { legend: true, music: 'legend', noRun: false, noPrism: true });
        w.setFlag(flag);
        n.hidden = true;
        if (out !== 'caught') await w.say('The ' + PK.KITS[id].name + ' vanished... Perhaps it will return someday.');
      };
    }
  };
})();
