// Quests: main story steps and side requests. Definitions live in PK.QUESTS (data files);
// progress is saved in state.quests[id] = {step, done}. The overworld shows the current step in a quest bar.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  PK.QUESTS = PK.QUESTS || {};
  var F = function () { return PK.font; };

  function qs() { var st = PK.game.state; if (!st.quests) st.quests = {}; return st.quests; }
  function def(id) { var d = PK.QUESTS[id]; if (!d) throw new Error('Unknown quest ' + id); return d; }

  var Q = {
    toasts: [],
    has: function (id) { return !!qs()[id]; },
    done: function (id) { return !!(qs()[id] && qs()[id].done); },
    active: function (id) { var q = qs()[id]; return !!q && !q.done; },
    // True while the quest sits on this step (by step id)
    at: function (id, stepId) {
      var q = qs()[id];
      if (!q || q.done) return false;
      return def(id).steps[q.step].id === stepId;
    },
    // Step reached or passed
    past: function (id, stepId) {
      var q = qs()[id];
      if (!q) return false;
      if (q.done) return true;
      var i = def(id).steps.findIndex(function (s) { return s.id === stepId; });
      return q.step > i;
    },
    start: function (id) {
      if (qs()[id]) return false;
      qs()[id] = { step: 0, done: false };
      Q.toast('NEW QUEST', def(id).title);
      if (PK.audio) PK.audio.sfx('select');
      return true;
    },
    // Move to the named step (or the next one). Advancing past the last step completes the quest.
    advance: function (id, stepId) {
      var q = qs()[id], d = def(id);
      if (!q) { Q.start(id); q = qs()[id]; }
      if (q.done) return;
      var to = stepId ? d.steps.findIndex(function (s) { return s.id === stepId; }) : q.step + 1;
      if (to < 0) throw new Error('Quest ' + id + ' has no step ' + stepId);
      if (to <= q.step) return;
      if (to >= d.steps.length) return Q.complete(id);
      q.step = to;
      Q.toast('QUEST UPDATED', d.steps[to].text);
    },
    complete: function (id) {
      var q = qs()[id];
      if (!q) { qs()[id] = q = { step: 0 }; }
      if (q.done) return;
      q.done = true;
      Q.toast('QUEST COMPLETE', def(id).title);
      if (PK.audio) PK.audio.jingle('item');
    },
    // Current objective: the first unfinished main quest, else the newest side quest.
    current: function () {
      var st = qs(), best = null;
      Object.keys(st).forEach(function (id) {
        var q = st[id], d = PK.QUESTS[id];
        if (!d || q.done) return;
        if (!best || (d.kind === 'main' && best.d.kind !== 'main')) best = { id: id, d: d, q: q };
      });
      if (!best) return null;
      return { id: best.id, title: best.d.title, text: best.d.steps[best.q.step].text, kind: best.d.kind };
    },
    toast: function (head, text) { Q.toasts.push({ head: head, text: text, t: 0 }); },
    // Draw toasts and the quest bar (overworld only)
    drawHud: function (ctx, hideBar) {
      var T = PK.ui.THEME;
      var o = PK.game.state.options;
      if (!hideBar && o.questBar !== false && !Q.toasts.length) {
        var cur = Q.current();
        if (cur) {
          var maxW = Math.min(PK.W - 8, 200);
          var txt = F().fit(cur.text, maxW - 18);
          var w = F().width(txt) + 18;
          ctx.globalAlpha = 0.9;
          PK.ui.box(ctx, 4, 4, w, 15);
          ctx.globalAlpha = 1;
          F().draw(ctx, cur.kind === 'main' ? '★' : '◆', 8, 8, cur.kind === 'main' ? '#e0a020' : '#4a9ad8');
          F().draw(ctx, txt, 15, 8, T.text, T.shadow);
        }
      }
      if (Q.toasts.length) {
        var t = Q.toasts[0];
        t.t++;
        var a = t.t < 12 ? t.t / 12 : t.t > 150 ? Math.max(0, (170 - t.t) / 20) : 1;
        var line = F().fit(PK.ui.fmt(t.text), PK.W - 40);
        var bw = Math.max(F().width(line), F().width(t.head)) + 20, bx = Math.round((PK.W - bw) / 2);
        ctx.globalAlpha = a;
        PK.ui.box(ctx, bx, 6, bw, 26);
        F().center(ctx, t.head, PK.W / 2, 10, t.head === 'QUEST COMPLETE' ? '#2a9a50' : '#d08a10');
        F().center(ctx, line, PK.W / 2, 20, T.text, T.shadow);
        ctx.globalAlpha = 1;
        if (t.t > 170) Q.toasts.shift();
      }
    }
  };
  PK.quest = Q;

  // ---------------- Quest log screen ----------------
  function QuestLog(done) {
    this.opaque = true; this.done = done;
    this.tab = 0; this.i = 0; this.detail = false;
  }
  QuestLog.prototype.list = function () {
    var st = qs(), tab = this.tab;
    return Object.keys(st).filter(function (id) {
      var d = PK.QUESTS[id]; if (!d) return false;
      if (tab === 2) return st[id].done;
      return !st[id].done && (tab === 0 ? d.kind === 'main' : d.kind !== 'main');
    });
  };
  QuestLog.prototype.update = function () {
    var inp = PK.input, L = this.list();
    if (this.detail) {
      if (inp.ok() || inp.cancel()) { this.detail = false; if (PK.audio) PK.audio.sfx('back'); }
      return;
    }
    if (inp.rep('left')) { this.tab = (this.tab + 2) % 3; this.i = 0; if (PK.audio) PK.audio.sfx('cursor'); }
    if (inp.rep('right')) { this.tab = (this.tab + 1) % 3; this.i = 0; if (PK.audio) PK.audio.sfx('cursor'); }
    if (inp.rep('up') && this.i > 0) { this.i--; if (PK.audio) PK.audio.sfx('cursor'); }
    if (inp.rep('down') && this.i < L.length - 1) { this.i++; if (PK.audio) PK.audio.sfx('cursor'); }
    if (inp.ok() && L.length) { this.detail = true; if (PK.audio) PK.audio.sfx('select'); }
    if (inp.cancel()) { if (PK.audio) PK.audio.sfx('back'); PK.pop(this); this.done(); }
  };
  QuestLog.prototype.draw = function (ctx) {
    var t = PK.ui.THEME, L = this.list(), st = qs();
    ctx.fillStyle = '#e8dcc0'; ctx.fillRect(0, 0, PK.W, PK.H);
    ctx.fillStyle = '#dccfb0';
    for (var y = 0; y < PK.H; y += 6) ctx.fillRect(0, y, PK.W, 1);
    var tabs = ['MAIN', 'SIDE', 'DONE'];
    for (var k = 0; k < 3; k++) {
      var on = k === this.tab;
      PK.ui.box(ctx, 6 + k * 58, 4, 54, 15, on ? { frame: '#28304c', frame2: '#f0a040', fill: '#fff4dc' } : null);
      F().center(ctx, tabs[k], 33 + k * 58, 8, on ? t.text : t.dim, on ? t.shadow : null);
    }
    F().right(ctx, '◀ ▶', PK.W - 8, 8, t.dim);
    if (this.detail && L[this.i]) {
      var id = L[this.i], d = PK.QUESTS[id], q = st[id];
      PK.ui.box(ctx, 6, 24, PK.W - 12, PK.H - 30);
      F().draw(ctx, d.title, 14, 30, t.text, t.shadow);
      var lines = F().wrap(d.desc || '', PK.W - 30);
      var yy = 42;
      lines.forEach(function (ln) { F().draw(ctx, ln, 14, yy, t.dim); yy += 10; });
      yy += 4;
      for (var s = 0; s < d.steps.length && yy < PK.H - 16; s++) {
        if (s > q.step && !q.done) break;
        var fin = q.done || s < q.step;
        F().draw(ctx, fin ? '✓' : '▶', 14, yy, fin ? '#2a9a50' : '#d08a10');
        F().draw(ctx, F().fit(d.steps[s].text, PK.W - 40), 24, yy, fin ? t.dim : t.text, fin ? null : t.shadow);
        yy += 11;
      }
      if (d.reward) F().draw(ctx, 'Reward: ' + d.reward, 14, PK.H - 16, '#8a6a20');
      return;
    }
    if (!L.length) {
      F().center(ctx, this.tab === 2 ? 'No finished quests yet.' : 'No quests right now.', PK.W / 2, 70, t.dim);
      return;
    }
    var top = Math.max(0, Math.min(this.i - 3, L.length - 7));
    for (var r = 0; r < 7 && top + r < L.length; r++) {
      var qi = top + r, qid = L[qi], qd = PK.QUESTS[qid], qq = st[qid], sel = qi === this.i;
      var yb = 24 + r * 19;
      PK.ui.box(ctx, 6, yb, PK.W - 12, 18, sel ? { frame: '#28304c', frame2: '#f0a040', fill: '#fff4dc' } : null);
      F().draw(ctx, qd.kind === 'main' ? '★' : '◆', 12, yb + 5, qd.kind === 'main' ? '#e0a020' : '#4a9ad8');
      F().draw(ctx, F().fit(qd.title, 120), 22, yb + 5, t.text, t.shadow);
      var sub = qq.done ? 'Complete' : qd.steps[qq.step].text;
      F().right(ctx, F().fit(sub, PK.W - 160), PK.W - 12, yb + 5, t.dim);
    }
  };
  Q.log = function () { return new Promise(function (res) { PK.push(new QuestLog(res)); }); };
})();
