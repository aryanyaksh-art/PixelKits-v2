// Checks that furniture/props never block entries, exits, stairs or doorways, and that every
// exit in a map can be reached from its entry. Usage: node tools/propcheck.mjs
import { loadGame } from './load.mjs';
const PK = loadGame();
PK.linkMaps();
let issues = 0;
const bad = (...a) => { issues++; console.log(...a); };
for (const id in PK.MAPS) {
  const m = PK.buildMap(PK.MAPS[id]);
  const walk = (x, y) => {
    const c = m.at(x, y);
    if (c == null || m.solid[y][x]) return false;
    const t = PK.TILE[c] || {};
    return !t.solid && !t.water;
  };
  const goals = [];
  for (const k in m.warpDefs) goals.push(k.split(',').map(Number));
  m.grid.forEach((r, y) => [...r].forEach((c, x) => { if (c === 'M') goals.push([x, y]); }));
  for (const k in m.doors) { const [x, y] = k.split(',').map(Number); goals.push([x, y + 1]); }
  const start = m.entry || (goals.find(g => walk(g[0], g[1])) || null);
  if (m.entry && !walk(m.entry[0], m.entry[1])) bad(id, 'entry blocked at', m.entry.join(','));
  // arrivals into this map from warps elsewhere
  for (const oid in PK.MAPS) {
    const o = PK.MAPS[oid];
    for (const k in o.warpDefs) { const w = o.warpDefs[k]; if (w.to === id && !walk(w.x, w.y) && m.at(w.x, w.y) !== 'X') bad(id, 'arrival from', oid, 'blocked at', w.x + ',' + w.y); }
  }
  if (!start || !m.interior) continue;
  const seen = new Set([start.join(',')]), q = [start];
  while (q.length) {
    const [x, y] = q.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, key = nx + ',' + ny;
      if (seen.has(key)) continue;
      const c = m.at(nx, ny);
      if (c === 'X' || c === '%' || c === 'M' || walk(nx, ny)) { seen.add(key); if (walk(nx, ny) || c === 'M') q.push([nx, ny]); }
    }
  }
  for (const g of goals) if (!seen.has(g.join(','))) bad(id, 'unreachable exit/warp at', g.join(','));
}
console.log('prop issues', issues);
