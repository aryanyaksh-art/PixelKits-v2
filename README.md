# PixelKits v2

**A retro creature-collecting RPG that runs in your browser.**

**▶ Play:** https://aryanyaksh-art.github.io/PixelKits-v2/

PixelKits v2 is a full rebuild of [PixelKits](https://github.com/aryanyaksh-art/PixelKits): a brand-new roster where every Kit has its own hand-drawn design, big hand-built towns and routes, gyms with their own challenges, and a new story. It is being built town by town and is still in progress.

Every creature, character, place, move, item, sprite, tile, sound and song in it was made from scratch for this project.

---

## What's in it so far

- **Brookhollow**, a riverside mill village, starting on the night of a flood. Pull your first Kit out of the river, then help the village recover.
- **Willow Trail**, a long river road with a reservoir, meadows, a forest, a weir and a hidden cave.
- **Pinecrest**, a whole mountain: foothills, Base Camp, Miners' Row, the High Ledge and a snowy summit, with six caves (one pitch black), a mine and a crystal grotto.
- **The Pinecrest Challenge Hall**: boulder pushing, minecart switches, a memory floor and a pickaxe wall, each its own room, with a miner to beat between each. Once you walk in, you can't leave until you win.
- **48 original Kits** so far (the goal is 151), mostly in 3-stage evolution lines, each with its own design.
- **Quests**: a main story per town plus side quests, tracked in a quest bar and a QUESTS menu.
- **A customizable player** (body, skin, hair, hat and outfit colors) and unique looks for the townsfolk.
- **Every building can be entered**, with multi-room, multi-floor interiors, food stalls and shops.
- **Fast day/night cycle** (a full day is about 20 minutes of play). Some Kits only come out at night.
- **Original chiptune music** for each situation: towns, routes, caves, cutscenes, gyms and battles.
- **Battles** in singles and doubles, with abilities, temperaments, status, held items, catching and evolution. The foe's types are shown in battle.
- **Region map** that scrolls with the world, fishing, 3 save files, and touch controls on phones and tablets.

## Controls

| Action | Keyboard |
| --- | --- |
| Move | Arrow keys / WASD |
| A (confirm, talk, interact) | Z / Space / J |
| B (back, cancel) | X / Esc / Backspace / K |
| Menu | Enter / Tab / C |
| Run | Hold B (or Shift) |
| Use registered key item | Tap Shift (SELECT) |
| Type a name | Just type on your keyboard |

On touch devices an on-screen D-pad and buttons appear automatically.

## Running locally

No build step and no dependencies. Either open `index.html` in a browser, or run the dev server and visit http://localhost:8765:

```bash
python tools/serve.py
```

## Development tools

```bash
node tools/validate.mjs    # checks all data: maps, warps, edges, reachability, trainers, items, music
node tools/npcblock.mjs    # finds NPCs that block a path when standing at their posts
node tools/propcheck.mjs   # checks that furniture never blocks entrances, exits or stairs
node tools/namecheck.mjs   # originality check of every name (reference lists kept outside the repo)
node tools/balance.mjs     # a typical player team vs each boss (win rates)
node tools/sim.mjs 2000    # headless battle stress test
node tools/bump.mjs        # stamps script links with a version so browsers load new files after a push
```

Debug mode: open `index.html?debug=1` for a **DEBUG** entry in the in-game menu (warp, heal, levels, items) and press <kbd>`</kbd> to toggle 4× speed. `?gallery=designs` shows every Kit design.

## Project layout

```
index.html, style.css
src/engine/   loop and scene stack, input, renderer and effects, bitmap font, RNG, chiptune audio
src/gfx/      pixel-art builder, tiles, buildings, furniture, characters, Kit designs, battle effects
src/data/     types, moves, Kits, abilities, items, trainers, music, map loader
src/data/v2/  the world, one file per area (brookhollow, willow, pinecrest)
src/systems/  Kit stats and EXP, battle rules, game state and saving, quests
src/scenes/   overworld, battle, menus, region map, minigames, title, debug
tools/        dev server, validators, simulators
```

See [HANDOFF.md](HANDOFF.md) for the full technical and design handoff, and [ORIGINALITY.md](ORIGINALITY.md) for how the game keeps its content original.

## License

MIT — see [LICENSE](LICENSE).
