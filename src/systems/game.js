// Game state: party, bag, money, flags, KitLog, saving/loading, time of day.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var SAVE_KEY = 'pixelkits2_save';
  var OPT_KEY = 'pixelkits2_options';

  function newState() {
    return {
      v: 2,
      player: { name: 'REMY', map: 'bh_home2f', x: 1, y: 3, dir: 'down', look: null },
      quests: {},
      rival: 'JASPER',
      money: 3000,
      party: [],
      box: [],
      bag: {},
      flags: {},
      crests: [false, false, false, false, false, false, false, false],
      seen: {},
      caught: {},
      defeated: {},
      picked: {},
      cleared: {},
      visited: { brookhollow: true },
      frames: 0,
      steps: 0,
      hush: 0,
      clinic: { map: 'bh_home1f', x: 6, y: 7 },
      options: loadOptions(),
      started: Date.now()
    };
  }

  function loadOptions() {
    var def = { textSpeed: 1, music: 0.5, sfx: 0.7, anim: true };
    try {
      var o = JSON.parse(localStorage.getItem(OPT_KEY) || 'null');
      if (o) Object.assign(def, o);
    } catch (e) { /* storage unavailable */ }
    return def;
  }

  var G = {
    state: null,
    init: function () { G.state = newState(); },
    newGame: function () { G.state = newState(); if (PK.chars) G.state.player.look = PK.chars.setPlayerLook(null); return G.state; },
    tick: function () { if (G.state) G.state.frames++; },
    // ---- save slots (3). The old single save is migrated into slot 1.
    slot: 1,
    slotKey: function (n) { return SAVE_KEY + '_slot' + n; },
    migrate: function () {
      try {
        var old = localStorage.getItem(SAVE_KEY);
        if (old && !localStorage.getItem(G.slotKey(1))) localStorage.setItem(G.slotKey(1), old);
        if (old) localStorage.removeItem(SAVE_KEY);
      } catch (e) { /* storage unavailable */ }
    },
    hasSave: function (n) {
      G.migrate();
      try {
        if (n) return !!localStorage.getItem(G.slotKey(n));
        for (var i = 1; i <= 3; i++) if (localStorage.getItem(G.slotKey(i))) return true;
        return false;
      } catch (e) { return false; }
    },
    save: function () {
      try {
        G.state.savedAt = Date.now();
        localStorage.setItem(G.slotKey(G.slot), JSON.stringify(G.state));
        G.saveOptions();
        return true;
      } catch (e) { console.error(e); return false; }
    },
    saveOptions: function () {
      try { localStorage.setItem(OPT_KEY, JSON.stringify(G.state.options)); } catch (e) { /* ignore */ }
    },
    fixup: function (s) {
      var base = newState();
      for (var k in base) if (s[k] === undefined) s[k] = base[k];
      s.options = Object.assign(loadOptions(), s.options || {});
      if (PK.stats && PK.stats.upgrade) s.party.concat(s.box).forEach(PK.stats.upgrade);
      return s;
    },
    load: function (n) {
      G.migrate();
      try {
        var s = JSON.parse(localStorage.getItem(G.slotKey(n || G.slot)));
        if (!s) return false;
        G.slot = n || G.slot;
        G.state = G.fixup(s);
        if (PK.chars) PK.chars.setPlayerLook(G.state.player.look);
        return true;
      } catch (e) { console.error(e); return false; }
    },
    deleteSlot: function (n) { try { localStorage.removeItem(G.slotKey(n)); } catch (e) { /* ignore */ } },
    saveInfo: function (n) {
      G.migrate();
      try {
        var s = JSON.parse(localStorage.getItem(G.slotKey(n || G.slot)));
        if (!s) return null;
        return { name: s.player.name, crests: s.crests.filter(Boolean).length, caught: Object.keys(s.caught).length, time: s.frames, map: s.player.map, champion: !!(s.flags && s.flags.champion) };
      } catch (e) { return null; }
    },
    exportCode: function () { return btoa(unescape(encodeURIComponent(JSON.stringify(G.state)))); },
    importCode: function (code) {
      var s = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
      if (!s || !s.player || !s.party) throw new Error('Invalid save code');
      G.state = G.fixup(s);
      G.save();
    },
    // --- flags
    flag: function (f) { return !!G.state.flags[f]; },
    setFlag: function (f, v) { G.state.flags[f] = v === undefined ? true : v; },
    // --- items
    count: function (id) { return G.state.bag[id] || 0; },
    addItem: function (id, n) {
      if (!PK.ITEMS[id]) { console.warn('unknown item', id); return; }
      n = n == null ? 1 : n;
      if (PK.ITEMS[id].pocket === 'key' || PK.ITEMS[id].pocket === 'discs') G.state.bag[id] = 1;
      else G.state.bag[id] = Math.min(999, (G.state.bag[id] || 0) + n);
    },
    removeItem: function (id, n) {
      n = n == null ? 1 : n;
      G.state.bag[id] = Math.max(0, (G.state.bag[id] || 0) - n);
      if (!G.state.bag[id]) delete G.state.bag[id];
    },
    pocketItems: function (pocket) {
      var out = [];
      for (var id in G.state.bag) if (PK.ITEMS[id] && PK.ITEMS[id].pocket === pocket && G.state.bag[id] > 0) out.push(id);
      var order = Object.keys(PK.ITEMS);
      out.sort(function (a, b) { return order.indexOf(a) - order.indexOf(b); });
      return out;
    },
    // --- kits
    see: function (id) { G.state.seen[id] = true; },
    catchKit: function (id) { G.state.seen[id] = true; G.state.caught[id] = true; },
    giveKit: function (k) {
      G.catchKit(k.id);
      k.ot = G.state.player.name;
      if (G.state.party.length < 6) { G.state.party.push(k); return 'party'; }
      G.state.box.push(k);
      return 'box';
    },
    healParty: function () { G.state.party.forEach(PK.stats.heal); },
    firstAlive: function () {
      for (var i = 0; i < G.state.party.length; i++) if (G.state.party[i].hp > 0) return i;
      return -1;
    },
    aliveCount: function () { return G.state.party.filter(function (k) { return k.hp > 0; }).length; },
    crestCount: function () { return G.state.crests.filter(Boolean).length; },
    // --- time of day: a fast game clock, one full day every 20 minutes of play
    DAY_FRAMES: 72000,
    PHASES: [['morning', 0], ['day', 0.2], ['evening', 0.6], ['night', 0.7]],
    // Smooth light: [day position, [r, g, b, alpha]]. The overworld tint blends between these instead of stepping.
    TINTS: [[0, [90, 80, 130, 0.24]], [0.08, [255, 170, 120, 0.10]], [0.2, [255, 200, 150, 0]], [0.5, [255, 220, 170, 0]],
      [0.6, [255, 150, 80, 0.10]], [0.66, [255, 110, 60, 0.18]], [0.73, [70, 50, 110, 0.30]], [0.8, [20, 24, 80, 0.40]],
      [0.92, [20, 24, 80, 0.40]], [1, [90, 80, 130, 0.24]]],
    // Current sky tint {r, g, b, a, dark}; dark is 0 (bright) to 1 (full night), used for lamp glow.
    dayTint: function () {
      var T = G.TINTS, c;
      if (PK.forceTime || (G.state && G.state.flags.storm)) {
        var t = PK.forceTime || 'night';
        c = t === 'night' ? [20, 24, 80, 0.40] : t === 'evening' ? [255, 110, 60, 0.18] : t === 'morning' ? [255, 190, 140, 0.08] : [0, 0, 0, 0];
      } else {
        var p = G.dayPos(), i = 0;
        while (i < T.length - 2 && p > T[i + 1][0]) i++;
        var a = T[i], b = T[i + 1], u = Math.max(0, Math.min(1, (p - a[0]) / (b[0] - a[0])));
        u = u * u * (3 - 2 * u);
        c = [0, 1, 2, 3].map(function (k) { return a[1][k] + (b[1][k] - a[1][k]) * u; });
      }
      return { r: Math.round(c[0]), g: Math.round(c[1]), b: Math.round(c[2]), a: c[3], dark: Math.max(0, Math.min(1, (c[3] - 0.12) / 0.28)) };
    },
    dayPos: function () {
      var s = G.state; if (!s) return 0.3;
      return (((s.frames + (s.clockOff || 0)) % G.DAY_FRAMES) + G.DAY_FRAMES) % G.DAY_FRAMES / G.DAY_FRAMES;
    },
    timeOfDay: function () {
      if (PK.forceTime) return PK.forceTime;
      if (!G.state) return 'day';
      if (G.state.flags.storm) return 'night';
      var p = G.dayPos(), r = 'morning';
      G.PHASES.forEach(function (ph) { if (p >= ph[1]) r = ph[0]; });
      return r;
    },
    // jump the clock to the start of a phase ('morning', 'day', 'evening', 'night')
    setTime: function (name) {
      var ph = G.PHASES.filter(function (p) { return p[0] === name; })[0];
      if (!ph || !G.state) return;
      // morning starts a little after the phase edge so the sky has already warmed up
      G.state.clockOff = Math.round((ph[1] + (name === 'morning' ? 0.06 : 0)) * G.DAY_FRAMES + 60) - G.state.frames;
    },
    playTime: function (frames) {
      var s = Math.floor((frames == null ? G.state.frames : frames) / 60);
      var h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60;
      return h + ':' + (m < 10 ? '0' : '') + m;
    }
  };
  PK.game = G;
})();
