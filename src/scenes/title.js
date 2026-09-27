// Title screen, new-game intro and end credits.
(function () {
  'use strict';
  var PK = window.PK;
  var F = function () { return PK.font; };

  function drawLogo(ctx, cx, y, t) {
    var text = 'PixelKits';
    var sc = 3;
    var w = F().width(text) * sc;
    var x = Math.round(cx - w / 2);
    var bob = Math.round(Math.sin(t / 30) * 2);
    // drop shadow + outline
    F()._raw(ctx, text, x + 3, y + 4 + bob, '#141a30', sc);
    F().outline(ctx, text, x, y + bob, '#ffd860', '#241c3c', sc);
    // lower half recolored for a two-tone look
    ctx.save();
    ctx.beginPath(); ctx.rect(0, y + bob + 11, PK.W, 12); ctx.clip();
    F()._raw(ctx, text, x, y + bob, '#ff9a3c', sc);
    ctx.restore();
    ctx.save();
    ctx.beginPath(); ctx.rect(0, y + bob, PK.W, 3); ctx.clip();
    F()._raw(ctx, text, x, y + bob, '#fff4c0', sc);
    ctx.restore();
  }

  function Title() {
    this.opaque = true;
    this.t = 0;
    this.phase = 'press';
    this.parade = [1, 4, 7, 2, 5, 8, 3, 6, 9];
    this.clouds = [0, 1, 2, 3, 4].map(function (i) { return { x: i * 60, y: 12 + (i * 17) % 40, s: 0.1 + (i % 3) * 0.05 }; });
  }
  Title.prototype.enter = function () { if (PK.audio) PK.audio.music('title'); };
  Title.prototype.update = function () {
    this.t++;
    this.clouds.forEach(function (c) { c.x += c.s; if (c.x > PK.W + 40) c.x = -60; });
    if (this.phase === 'press' && PK.top() === this && (PK.input.ok() || PK.input.p('a'))) {
      if (PK.audio) { PK.audio.unlock(); PK.audio.music('title'); PK.audio.sfx('select'); }
      this.phase = 'menu';
      var self = this;
      PK.run(function () { return self.menu(); });
    }
  };
  function slotItems() {
    var out = [];
    for (var n = 1; n <= 3; n++) {
      var inf = PK.game.saveInfo(n);
      out.push(inf ? { label: 'FILE ' + n + '  ' + inf.name, right: (inf.champion ? '★ ' : '') + inf.crests + ' crests  ' + PK.game.playTime(inf.time) } : { label: 'FILE ' + n + '  - empty -', empty: true });
    }
    return out;
  }
  Title.prototype.menu = async function () {
    for (;;) {
      var has = PK.game.hasSave();
      var items = [];
      if (has) items.push({ label: 'CONTINUE' });
      items.push({ label: 'NEW GAME' });
      items.push({ label: 'OPTIONS' });
      items.push({ label: 'CONTROLS' });
      var i = await PK.ui.menu(items, { x: 60, y: 96, w: 120, cancel: false });
      var pick = items[i].label;
      if (pick === 'CONTINUE') {
        var sl = slotItems();
        var c = await PK.ui.menu(sl.map(function (x) { return x.empty ? Object.assign({ disabled: true }, x) : x; }), { x: 8, y: 60, w: 224, title: 'Continue which file?' });
        if (c < 0) continue;
        var act = await PK.ui.menu(['LOAD', 'DELETE', 'CANCEL'], { right: 232, y: 60 });
        if (act === 1) {
          if (await PK.ui.yesno('Delete FILE ' + (c + 1) + ' forever? This cannot be undone.') && await PK.ui.yesno('Are you really sure?')) {
            PK.game.deleteSlot(c + 1);
            await PK.ui.say('FILE ' + (c + 1) + ' was deleted.');
          }
          continue;
        }
        if (act !== 0) continue;
        if (!PK.game.load(c + 1)) { await PK.ui.say('The save data could not be loaded.'); continue; }
        if (PK.audio) PK.audio.applyVolumes();
        await PK.fx.fadeOut(20);
        await PK.enterWorld();
        return;
      }
      if (pick === 'NEW GAME') {
        var sl2 = slotItems();
        var slot = 1;
        if (has) {
          var c2 = await PK.ui.menu(sl2, { x: 8, y: 60, w: 224, title: 'Start in which file?' });
          if (c2 < 0) continue;
          if (!sl2[c2].empty && !(await PK.ui.yesno('FILE ' + (c2 + 1) + ' already has a save. It will be overwritten the first time you save. OK?'))) continue;
          slot = c2 + 1;
        }
        PK.game.newGame();
        PK.game.slot = slot;
        await PK.fx.fadeOut(20);
        PK.pop(this);
        PK.push(new Intro());
        await PK.fx.fadeIn(20);
        return;
      }
      if (pick === 'OPTIONS') { await PK.menus.options(); continue; }
      if (pick === 'CONTROLS') {
        await PK.ui.say('Arrow keys or WASD move. Z, Space or J is A (confirm/talk). X, Esc or K is B (back).');
        await PK.ui.say('Enter or C opens the menu. Hold B or Shift to run. Tap Shift (SELECT) to use a registered key item.');
        await PK.ui.say('On phones, use the on-screen buttons. When naming, just type on your keyboard.');
      }
    }
  };
  Title.prototype.draw = function (ctx) {
    var t = this.t;
    var g = ctx.createLinearGradient(0, 0, 0, PK.H);
    g.addColorStop(0, '#3a4a9a'); g.addColorStop(0.55, '#e88a6a'); g.addColorStop(1, '#f8d8a0');
    ctx.fillStyle = g; ctx.fillRect(0, 0, PK.W, PK.H);
    // stars
    for (var s = 0; s < 30; s++) {
      var sx = (s * 53) % PK.W, sy = (s * 29) % 50;
      if (((t >> 3) + s) % 7) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(sx, sy, 1, 1); }
    }
    // sun
    ctx.fillStyle = '#ffe890'; ctx.beginPath(); ctx.arc(190, 96, 22, 0, 6.3); ctx.fill();
    ctx.fillStyle = 'rgba(255,240,180,0.35)'; ctx.beginPath(); ctx.arc(190, 96, 30, 0, 6.3); ctx.fill();
    // clouds
    this.clouds.forEach(function (c) {
      ctx.fillStyle = 'rgba(255,240,235,0.85)';
      ctx.fillRect(c.x, c.y, 34, 6); ctx.fillRect(c.x + 6, c.y - 4, 18, 6); ctx.fillRect(c.x + 20, c.y - 2, 10, 4);
    });
    // hills
    ctx.fillStyle = '#6a9a58';
    ctx.beginPath(); ctx.moveTo(0, 118);
    for (var x = 0; x <= PK.W; x += 8) ctx.lineTo(x, 112 + Math.sin(x / 30) * 8);
    ctx.lineTo(PK.W, PK.H); ctx.lineTo(0, PK.H); ctx.fill();
    ctx.fillStyle = '#4a7a44';
    ctx.beginPath(); ctx.moveTo(0, 132);
    for (x = 0; x <= PK.W; x += 8) ctx.lineTo(x, 128 + Math.sin(x / 22 + 2) * 5);
    ctx.lineTo(PK.W, PK.H); ctx.lineTo(0, PK.H); ctx.fill();
    // Kit parade
    var n = this.parade.length;
    for (var i = 0; i < n; i++) {
      var px = ((t * 0.5 + i * 44) % (n * 44)) - 40;
      var id = this.parade[i];
      var ic = PK.kitArt.icon(id);
      var hop = Math.abs(Math.sin((t + i * 13) / 8)) * 3;
      ctx.drawImage(ic, Math.round(px), Math.round(118 - hop));
    }
    drawLogo(ctx, PK.W / 2, 26, t);
    F().center(ctx, 'A Lumora Adventure', PK.W / 2, 60, '#fff4e0', '#3a2a4a');
    if (this.phase === 'press' && ((t >> 5) & 1)) F().center(ctx, 'PRESS START', PK.W / 2, 90, '#ffffff', '#3a2a4a');
    F().draw(ctx, 'v2 preview', 4, PK.H - 9, 'rgba(255,255,255,0.6)');
    F().right(ctx, 'Original game', PK.W - 4, PK.H - 9, 'rgba(255,255,255,0.6)');
  };

  // ---------------- Character creator ----------------
  var CREATOR_ROWS = [
    { label: 'BODY', key: 'body', names: ['PANTS', 'SKIRT', 'SHORTS'] },
    { label: 'SKIN', key: 'skin', swatch: function (i) { return PK.chars.LOOK.skin[i][0]; } },
    { label: 'HAIR', key: 'hair', names: ['SHORT', 'LONG', 'SPIKY', 'BUN', 'PONYTAIL', 'CURLY', 'SWEPT', 'BRAIDS', 'NONE'] },
    { label: 'HAIR COLOR', key: 'hairCol', swatch: function (i) { return PK.chars.LOOK.hairCol[i]; } },
    { label: 'HAT', key: 'hat', names: ['NONE', 'CAP', 'BEANIE'] },
    { label: 'HAT COLOR', key: 'hatCol', swatch: function (i) { return PK.chars.LOOK.cloth[i]; } },
    { label: 'TOP', key: 'top', swatch: function (i) { return PK.chars.LOOK.cloth[i]; } },
    { label: 'BOTTOM', key: 'bottom', swatch: function (i) { return PK.chars.LOOK.cloth[i]; } },
    { label: 'SHOES', key: 'shoes', swatch: function (i) { return PK.chars.LOOK.shoes[i]; } },
    { label: 'RANDOM' },
    { label: 'DONE' }
  ];
  var LOOK_SIZE = { body: 'body', skin: 'skin', hair: 'hair', hairCol: 'hairCol', hat: 'hat', hatCol: 'cloth', top: 'cloth', bottom: 'cloth', shoes: 'shoes' };
  function Creator(done) {
    this.opaque = true; this.done = done; this.i = 0; this.t = 0;
    this.look = Object.assign(PK.chars.defaultLook(), PK.game.state.player.look || {});
    PK.chars.setPlayerLook(this.look);
  }
  Creator.prototype.count = function (key) { return PK.chars.LOOK[LOOK_SIZE[key]].length; };
  Creator.prototype.update = function () {
    var inp = PK.input, row = CREATOR_ROWS[this.i];
    this.t++;
    if (inp.rep('up')) { this.i = (this.i + CREATOR_ROWS.length - 1) % CREATOR_ROWS.length; if (PK.audio) PK.audio.sfx('cursor'); }
    if (inp.rep('down')) { this.i = (this.i + 1) % CREATOR_ROWS.length; if (PK.audio) PK.audio.sfx('cursor'); }
    var d = inp.rep('left') ? -1 : inp.rep('right') ? 1 : 0;
    if (!d && inp.ok() && row.key) d = 1;
    if (d && row.key) {
      var n = this.count(row.key);
      this.look[row.key] = (this.look[row.key] + d + n) % n;
      PK.chars.setPlayerLook(this.look);
      if (PK.audio) PK.audio.sfx('cursor');
    }
    if (inp.ok() && row.label === 'RANDOM') {
      var self = this;
      Object.keys(LOOK_SIZE).forEach(function (k) { self.look[k] = PK.rnd(self.count(k)); });
      PK.chars.setPlayerLook(this.look);
      if (PK.audio) PK.audio.sfx('select');
    }
    if (inp.ok() && row.label === 'DONE') {
      PK.game.state.player.look = PK.chars.setPlayerLook(this.look);
      if (PK.audio) PK.audio.sfx('select');
      PK.pop(this); this.done();
    }
  };
  Creator.prototype.draw = function (ctx) {
    var t = PK.ui.THEME;
    ctx.fillStyle = '#2a3458'; ctx.fillRect(0, 0, PK.W, PK.H);
    ctx.fillStyle = '#313c66';
    for (var y = 0; y < PK.H; y += 8) for (var x = ((y >> 3) & 1) * 8; x < PK.W; x += 16) ctx.fillRect(x, y, 8, 8);
    PK.ui.box(ctx, 4, 4, 138, 152);
    F().draw(ctx, 'YOUR LOOK', 12, 9, '#d08a10');
    for (var r = 0; r < CREATOR_ROWS.length; r++) {
      var row = CREATOR_ROWS[r], yy = 21 + r * 12, sel = r === this.i;
      if (sel) { ctx.fillStyle = '#fff0c8'; ctx.fillRect(8, yy - 2, 130, 11); }
      F().draw(ctx, row.label, 12, yy, sel ? t.text : t.dim, sel ? t.shadow : null);
      if (!row.key) continue;
      var v = this.look[row.key];
      if (row.names) F().right(ctx, row.names[v], 128, yy, t.text, t.shadow);
      else { ctx.fillStyle = '#28304c'; ctx.fillRect(107, yy - 1, 18, 9); ctx.fillStyle = row.swatch(v); ctx.fillRect(108, yy, 16, 7); }
      if (sel) { F().draw(ctx, '◀', 74, yy, '#d08a10'); F().draw(ctx, '▶', 131, yy, '#d08a10'); }
    }
    // preview: turns around and walks in place
    PK.ui.box(ctx, 148, 4, 88, 124);
    ctx.fillStyle = '#cfe8b8'; ctx.fillRect(152, 8, 80, 116);
    ctx.fillStyle = '#b8d8a0'; ctx.beginPath(); ctx.ellipse(192, 116, 26, 6, 0, 0, 6.3); ctx.fill();
    var dirs = ['down', 'left', 'up', 'right'], dir = dirs[Math.floor(this.t / 70) % 4];
    var fr = [0, 1, 0, 2][Math.floor(this.t / 10) % 4];
    var spr = PK.chars.sprite('player')[dir][fr];
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spr, 192 - 32, 26, 64, 88);
    F().center(ctx, 'LEFT/RIGHT: change', 192, 134, '#ffffff', '#1c2238');
    F().center(ctx, 'A on DONE: confirm', 192, 145, '#ffffff', '#1c2238');
  };
  PK.creator = function () { return new Promise(function (res) { PK.push(new Creator(res)); }); };

  // ---------------- Intro ----------------
  function Intro() {
    this.opaque = true;
    this.t = 0;
    this.show = null;
    this.rain = [];
    for (var i = 0; i < 70; i++) this.rain.push({ x: Math.random() * 400, y: Math.random() * 160, s: 0.6 + Math.random() });
    var self = this;
    PK.run(function () { return self.main(); });
  }
  Intro.prototype.main = async function () {
    var st = PK.game.state;
    if (PK.audio) PK.audio.music('hometown');
    await PK.wait(30);
    await PK.ui.say('Brookhollow. A little mill village on the banks of the Willow, where people and Kits have lived side by side for as long as anyone can remember.');
    await PK.ui.say('Before this story begins... who are you?');
    await PK.creator();
    this.show = 'player';
    st.player.name = await pickName('Your name?', ['REMY', 'NOVA', 'SAGE'], 'REMY');
    await PK.ui.say('{PLAYER}. You grew up with the sound of the mill wheel, and with someone always one step ahead of you.');
    this.show = 'rival';
    await PK.ui.say('Your older sibling. They already have a Kit partner, and they never let you forget it.');
    st.rival = await pickName("Your sibling's name?", ['ROWAN', 'WREN', 'ASH'], 'ROWAN');
    await PK.ui.say("{RIVAL}. Lately they have been slipping out of the house at strange hours, and they won't say where they go.");
    this.show = null;
    await PK.ui.say('Then one night, a storm rolled down the valley...');
    PK.game.setFlag('storm');
    await PK.fx.fadeOut(40, '#000');
    await PK.enterWorld();
  };
  async function pickName(title, presets, def) {
    var items = ['NEW NAME'].concat(presets);
    var i = await PK.ui.menu(items, { x: 8, y: 8, cancel: false, title: title });
    if (i === 0) return (await PK.ui.name(title, def)).slice(0, 10);
    return presets[i - 1];
  }
  Intro.prototype.update = function () { this.t++; };
  Intro.prototype.draw = function (ctx) {
    var g = ctx.createLinearGradient(0, 0, 0, PK.H);
    g.addColorStop(0, '#0e1228'); g.addColorStop(1, '#2a3458');
    ctx.fillStyle = g; ctx.fillRect(0, 0, PK.W, PK.H);
    // village silhouette with the mill and its turning wheel
    ctx.fillStyle = '#161a30';
    ctx.fillRect(0, 112, PK.W, 48);
    [[10, 92, 30, 20], [46, 98, 26, 14], [150, 94, 28, 18], [186, 100, 40, 12]].forEach(function (h) {
      ctx.fillRect(h[0], h[1], h[2], h[3] + 2);
      ctx.beginPath(); ctx.moveTo(h[0] - 3, h[1]); ctx.lineTo(h[0] + h[2] / 2, h[1] - 12); ctx.lineTo(h[0] + h[2] + 3, h[1]); ctx.fill();
    });
    ctx.fillRect(92, 80, 34, 32);
    ctx.beginPath(); ctx.moveTo(88, 80); ctx.lineTo(109, 58); ctx.lineTo(130, 80); ctx.fill();
    ctx.strokeStyle = '#161a30'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(136, 100, 14, 0, 6.3); ctx.stroke();
    for (var s = 0; s < 6; s++) { var a = s * 1.047 + this.t / 60; ctx.beginPath(); ctx.moveTo(136, 100); ctx.lineTo(136 + Math.cos(a) * 14, 100 + Math.sin(a) * 14); ctx.stroke(); }
    ctx.fillStyle = '#f8d870'; [[20, 100], [56, 104], [160, 102], [200, 104], [104, 90]].forEach(function (w) { ctx.fillRect(w[0], w[1], 3, 3); });
    // rain and lightning
    if (this.t % 300 < 3) { ctx.fillStyle = 'rgba(220,230,255,0.5)'; ctx.fillRect(0, 0, PK.W, PK.H); }
    ctx.fillStyle = 'rgba(170,190,240,0.55)';
    this.rain.forEach(function (d) { d.y += d.s * 6; d.x -= d.s * 2; if (d.y > PK.H) { d.y -= PK.H + 6; } if (d.x < -4) d.x += PK.W + 8; ctx.fillRect(d.x | 0, d.y | 0, 1, 4); });
    if (this.show) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(PK.W / 2, 98, 30, 7, 0, 0, 6.3); ctx.fill();
      ctx.drawImage(PK.chars.portrait(this.show, 4, 'down'), PK.W / 2 - 32, 12);
    }
  };

  // ---------------- Credits ----------------
  PK.credits = function () {
    return new Promise(function (res) {
      var lines = [
        'PIXELKITS', '', 'A Lumora Adventure', '', '', 'Thank you for playing!', '', '',
        'CHAMPION', '{PLAYER}', '', '', 'YOUR TEAM'
      ];
      var st = PK.game.state;
      st.party.forEach(function (k) { lines.push(PK.stats.name(k) + '  Lv' + k.level); });
      lines = lines.concat(['', '', 'KITLOG', Object.keys(st.caught).length + ' / ' + PK.KIT_COUNT + ' caught', '', '',
        'GAME DESIGN, CODE, PIXEL ART & MUSIC', 'Built entirely from scratch', '', '',
        'WARDENS', 'Fenna  Gideon  Juno  Marisol', 'Ignatius  Celestine  Bjorn  Morwen', '', '',
        'HIGH COUNCIL', 'Dax  Hemlock  Orrin  Sable', '', 'CHAMPION EMERITUS', 'Castor', '', '',
        'The guardians still sleep...', 'and Starfall waits beyond the sea.', '', '', '', 'THE END']);
      var sc = {
        opaque: true, y: PK.H + 10, t: 0,
        update: function () {
          this.t++;
          this.y -= PK.input.h('a') ? 1.6 : 0.4;
          if (this.y < -lines.length * 14 - 20 || (this.t > 60 && PK.input.p('start'))) { PK.pop(this); res(); }
        },
        draw: function (ctx) {
          ctx.fillStyle = '#10142a'; ctx.fillRect(0, 0, PK.W, PK.H);
          for (var i = 0; i < 40; i++) { ctx.fillStyle = 'rgba(255,255,255,' + (0.3 + (i % 3) * 0.2) + ')'; ctx.fillRect((i * 67) % PK.W, (i * 41 + this.t * (0.2 + (i % 3) * 0.1)) % PK.H, 1, 1); }
          for (var j = 0; j < lines.length; j++) {
            var yy = this.y + j * 14;
            if (yy < -10 || yy > PK.H) continue;
            var l = PK.ui.fmt(lines[j]);
            var big = l === l.toUpperCase() && l.length > 0 && j > 0;
            F().center(ctx, l, PK.W / 2, yy, big ? '#ffd860' : '#e0e4f8', '#000');
          }
          var id = 1 + Math.floor(this.t / 90) % PK.KIT_COUNT;
          ctx.globalAlpha = 0.9;
          ctx.drawImage(PK.kitArt.get(id, 'front'), 176, 96);
          ctx.globalAlpha = 1;
        }
      };
      if (PK.audio) PK.audio.music('credits');
      PK.push(sc);
      PK.fx.fadeIn(30);
    });
  };

  PK.TitleScene = Title;
  PK.IntroScene = Intro;
})();
