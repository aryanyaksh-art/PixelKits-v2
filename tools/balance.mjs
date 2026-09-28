// Progression balance check: a typical player team vs each boss, both sides using the smart AI.
// Usage: node tools/balance.mjs [runs]
import { loadGame } from './load.mjs';
const PK = loadGame();
const RUNS = +(process.argv[2] || 200);

// [boss, player level, player team (species)] - team grows through the game
const plan = [
  ['cinder_1', 6, [4]],
  ['sibling1', 7, [4, 10]],
  ['sibling2', 12, [4, 10, 12]],
  ['pc_warden', 15, [4, 10, 12, 28]],
  ['sibling3', 15, [4, 10, 12, 28]],
  ['cinder_3', 14, [4, 10, 12, 28]],
  ['elder_morrow', 17, [4, 10, 12, 28, 40]]
];

function battle(pTeam, eTeam, ai) {
  const b = new PK.Battle({ wild: false, playerParty: pTeam, enemyParty: eTeam, ai, enemyItems: 2 });
  for (let t = 0; t < 300; t++) {
    const pa = b.chooseFor(b.p.slots[0], 2, false);
    const ea = b.chooseAI();
    b.runTurn(pa, ea);
    if (b.e.alive() === 0) return true;
    if (b.p.alive() === 0) return false;
    if (!b.e.slots[0].alive()) b.sendIn(b.e.slots[0], b.nextEnemy());
    if (!b.p.slots[0].alive()) b.sendIn(b.p.slots[0], b.p.bench()[0]);
  }
  return false;
}

for (const [boss, lvl, team] of plan) {
  const tr = PK.TRAINERS[boss];
  if (!tr) { console.log(boss, '- missing trainer, skipped'); continue; }
  let wins = 0;
  for (let r = 0; r < RUNS; r++) {
    // rotate the starter line across the three choices (Blaze 4-6, Leaf 1-3, Tide 7-9)
    const shift = [0, -3, 3][r % 3];
    const t2 = team.map((id, i) => i === 0 ? id + shift : id);
    const pTeam = t2.map((id, i) => PK.stats.create(id, lvl + (i === 0 ? 2 : 0), { noPrism: true }));
    const flags = { starter: 4 };
    const et = typeof tr.team === 'function' ? tr.team({ flags }) : tr.team;
    const eTeam = et.map(e => PK.stats.create(e[0], e[1], { noPrism: true, genes: 12 }));
    if (battle(pTeam, eTeam, tr.ai)) wins++;
  }
  const pct = Math.round(wins / RUNS * 100);
  console.log(`${boss.padEnd(12)} player Lv${lvl} x${team.length}  win rate ${String(pct).padStart(3)}%  ${pct < 45 ? '<-- hard' : pct > 95 ? '<-- easy' : ''}`);
}
