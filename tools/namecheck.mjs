// Originality check: compares every Kit/move/item/ability/temperament/place/character name against
// public lists of existing franchise names (exact matches, and Kit names within 2 letters). Usage: node tools/namecheck.mjs
import fs from 'fs';
import { loadGame } from './load.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
// Reference name lists live OUTSIDE the repo (never commit them): ../pixelkits_namelists/*.json
const LISTS = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'pixelkits_namelists');
const PK = loadGame();
const norm = s => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');
const load = n => JSON.parse(fs.readFileSync(path.join(LISTS, n + '.json'))).results.map(r => norm(r.name));
const off = { species: load('pokemon-species'), move: load('move'), item: load('item'), ability: load('ability'), location: load('location') };
const natures = 'hardy lonely brave adamant naughty bold docile relaxed impish lax timid hasty serious jolly naive modest mild quiet bashful rash calm gentle sassy careful quirky'.split(' ');
const all = new Set([...off.species, ...off.move, ...off.item, ...off.ability, ...off.location, ...natures]);
function lev(a, b) { const d = Array.from({ length: a.length + 1 }, (_, i) => [i]); for (let j = 1; j <= b.length; j++) d[0][j] = j; for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[a.length][b.length]; }
const ours = [];
Object.values(PK.KITS).forEach(k => ours.push(['kit', k.name]));
Object.values(PK.MOVES).forEach(m => ours.push(['move', m.name]));
Object.values(PK.ITEMS).forEach(i => ours.push(['item', i.name.replace(/^SD\d+ /, '')]));
Object.values(PK.ABILITIES).forEach(a => ours.push(['ability', a.name]));
PK.TEMPERAMENTS.forEach(t => ours.push(['temper', t[0]]));
Object.values(PK.MAPS).forEach(m => ours.push(['map', (m.name || '').replace('{RIVAL}', '')]));
Object.values(PK.TRAINERS).forEach(t => { ours.push(['trainer', t.name]); if (t.partner) ours.push(['trainer', t.partner.name]); });
let bad = 0;
for (const [kind, name] of ours) {
  const n = norm(name);
  if (!n || n.length < 3) continue;
  if (all.has(n)) { console.log('EXACT', kind, name); bad++; continue; }
  if (kind === 'kit') for (const s of off.species) if (Math.abs(s.length - n.length) <= 2 && lev(s, n) <= 2) { console.log('NEAR', kind, name, '~', s); bad++; }
}
console.log('checked', ours.length, 'names; issues', bad);
