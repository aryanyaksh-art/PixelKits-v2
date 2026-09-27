# PixelKits — Handoff

Everything a new chat needs to continue this project, including a planned **revamp**. Read this whole file first.

- **Repo:** https://github.com/aryanyaksh-art/PixelKits (branch `main`, GitHub user `aryanyaksh-art`, `gh` CLI is logged in)
- **Live game:** https://aryanyaksh-art.github.io/PixelKits/ (GitHub Pages from `main` / root; rebuilds on every push, about 1 minute)
- **Local folder:** `C:\Users\aryan\OneDrive\Desktop\pixel_kits` (Windows 11, Node 24, Python 3.14)
- **Player guide (Claude Doc):** https://claude.ai/code/artifact/c3fa3c31-43f3-47f6-8b3d-57825eb6ef2d — walkthrough, secrets, best Kits, items, mechanics
- **Commit attribution:** end every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. The user asked to commit and push everything.

---

## 1. The user and what they want next

- The user (Aryan) asked for "a retro Pokémon-style game like the original 2D games" named **PixelKits**, with lots of original creatures, gyms, bosses and regions, and was very clear: **"I do NOT want to get copyrighted."** Keep everything original (see section 8).
- Chosen early on: browser game (HTML5 + JS), "slightly modern pixel art", full scope (~100 creatures, 8 gyms, Elite 4), GitHub Pages hosting. Later: make it more like **FireRed** (look and mechanics).
- They have played it a lot and now say it has **"gotten kinda repetitive"** and want a **revamp that changes a lot**. Start the new chat by asking what feels repetitive and what they want changed (section 12 has ideas to offer). They like being asked a few multiple-choice questions before big work.
- They play in **Chrome on the live site**, mostly **FILE 2** (party includes fiyah the Infernhorn, Zephydrake "hardahh", Beetank, Bogtoad, Trunkle, cet the Mistfawn). They sometimes ask for save edits (section 10).
- Style they respond well to: short plain answers, tables for lists, verify fixes in the game, push to the live site.

---

## 2. What the game is today

A retro creature-collecting RPG that runs in the browser, **no build step**: classic `<script>` tags sharing one global `PK` namespace (works from `file://` and GitHub Pages).

- **110 original Kits**, 16 original types (Plain, Blaze, Tide, Leaf, Volt, Frost, Brawl, Venom, Terra, Gale, Mind, Swarm, Shade, Lumen, Metal, Wyrm), evolutions by level / shard item / time of day, rare **Prism** color variants (1/512).
- **Battles:** singles and **2v2 doubles** (targeting, spread moves), 32 abilities, 25 temperaments (+10%/-10% natures), hidden genes (0-15 per stat), Training Points (EV-like, 252/stat, 510 total), status, stat stages, crits, priority, recoil/drain, held items, catching, EXP share (50% to non-participants), move learning, evolution. Safari mode.
- **World:** 85 maps. Regions Verdant Vale, Sunscar Coast, Frostcrown Highlands, Crown Summit League, plus post-game Starfall Sea/Ruins and the **Moonlit Isles** (ferry). Secret caves Hidden Hollow and Glacier Grotto. Wildwood Reserve safari park.
- **Story:** starter at Prof. Ines Vale's lab (Brookhollow), rival (player-named), 8 Wardens (gyms), Hollow Syndicate (Captain Nix, Director Kael Voss at the Syndicate Spire), High Council (Dax, Hemlock, Orrin, Sable) + Champion Castor, Hall of Fame + credits. Post-game: 3 weather guardians (Solaryx, Nimbray, Rimewyrm), mythical Lumikit at Starfall Ruins, Admin Vesper arc and Moonveil on the Moonlit Isles.
- **Features:** 3 save files + export/import codes, Lumora Map (terrain map drawn from real tiles; also Wayfinder "fly"), Trail Bike, running (hold B), Rally Bell rematches (scaled, evolved teams), Seeker Lens, Exit Cord, Boost Candy, stat Roots, Recall Master (move relearner, Emberisle), Name Sage (Pinecrest), party EDIT (rename, swap/forget moves, 9 color tints), move detail screens everywhere, storage terminal with sprite/info preview, day/night from the real clock, weather, poison damage while walking, cleared bushes/rocks stay cleared, about 30 original chiptune tracks + synthesized SFX and per-Kit cries, touch controls.
- **Controls:** arrows/WASD move; Z/Space/J = A; X/Esc/K/Backspace = B (hold to run); Enter/Tab/C = menu; Shift = SELECT (tap = registered key item). Name entry takes normal typing.

---

## 3. Running and testing

```bash
python tools/serve.py 8766      # dev server (no-cache headers) + POST /__shot?name=x saves a PNG to .shots/x.png
node tools/validate.mjs         # data integrity: maps, warps, edges, reachability, trainers, items, music; syntax-checks all scripts
node tools/sim.mjs 2000         # headless battle stress test (singles + doubles), balance numbers
node tools/balance.mjs 150      # a typical team vs every boss (win rates)
node tools/npcblock.mjs         # finds NPCs/trainers that block a path at their posts (should print "issues 0")
node tools/namecheck.mjs        # originality check of every name (reference lists live OUTSIDE the repo, see section 8)
```

- `.claude/launch.json` has a `pixelkits` config (python tools/serve.py 8766) for the Claude app's built-in browser (`preview_start` name `pixelkits`). If the pane shows about:blank / "PK is not defined", the server died: call `preview_start` again.
- `?debug=1` adds a DEBUG entry to the in-game menu (warp, heal, level +10, all crests, items, toggle encounters, add Kit) and <kbd>`</kbd> toggles 4x speed. `?gallery=kits|tiles|chars|buildings` shows art galleries.
- **In-page test harness** (`src/scenes/debug.js`, `PK.test`), used through the browser tool's JS eval:
  - `PK.test.step(n)`, `press('a'|'b'|'start'|'up'…)`, `mash(b, times)`, `walk(dir, n)` (tile by tile), `face(dir)`, `warp(map, x, y)`, `advance(max)` (presses A through dialogue, auto-battles with the strongest move, answers menus with defaults, handles forced party picks and name entry), `idle()`, `battle()` (current BattleScene), `info()` (scene/map/pos/party/lastError), `shot(name, scale)` (saves `.shots/name.png`, then Read the PNG to see it).
  - Typical setup: `PK.game.newGame(); st=PK.game.state; st.party=[PK.stats.create(4,20)]; await PK.enterWorld(); PK.test.warp('pinecrest',10,8)`.
  - Gotchas: never `await PK.world.onEnter()` or other scripts that wait on text (the eval times out); don't name a variable `top` (it's `window.top`); give the page ~1.5 s after `location.reload()`.
- Workflow that worked: change code → `node --check` → `validate.mjs` → test in the built-in browser with screenshots → commit → push → poll `gh api repos/aryanyaksh-art/PixelKits/pages/builds/latest --jq '.status+" "+.commit[0:7]'` until `built <sha>`.

---

## 4. Code map

```
index.html            script order matters (engine → gfx → data → systems → ui → scenes → main)
style.css             centered canvas, touch pad
src/engine/  core.js (loop, scene stack PK.push/pop/top, PK.wait, PK.run, rAF + setInterval fallback)
             input.js (virtual buttons, key latch, textMode for name entry, onKey/offKey)
             renderer.js (240x160 canvas, integer scale, PK.fx fade/flash/shake), rng.js (PK.rnd, pick, seeded, hash)
             font.js (original 5x7 variable-width font: draw/right/center/width/wrap/fit), audio.js (WebAudio synth, MML, SFX, cries)
src/gfx/     color.js (shade/ramp/mix/hueRotate), pixel.js (PK.PG shaded-primitive pixel grid, auto outlines, dither)
             tiles.js (TILE table, THEMES, drawMapTile, 16x24 overlapping trees via drawTrees)
             buildings.js (house, bighouse, clinic, shop, gym, lab, league, spire, hut, ruin, gate)
             chars.js (16x22 layered character sprites + PALS, portraits, bike), kitArt.js (part-based Kit sprite generator, TINTS)
             battleFx.js (move animations, particles, capsule drawing)
src/data/    types.js (chart, typeEff), moves.js (149 moves), kits.js (110 Kits + stat/learnset generation)
             abilities.js (abilities, temperaments, tpYield; assigns 2 abilities per species), items.js, trainers.js
             music.js (MML tracks), maps.js (defMap/buildMap/interior templates/linkMaps), story.js (PK.SCRIPTS + helpers)
             world1.js Vale, world2.js Coast, world3.js Highlands + League + Starfall, world4.js Reserve/secret caves/Moonlit Isles
src/systems/ stats.js (create/calc/levels/EXP/evolve/upgrade/addTP), battleEngine.js (rules, pure logic → event list), game.js (state, saves, slots)
src/ui/      ui.js (window box, TextBox, Menu (+info panel), NumberPick, NameEntry, PK.ui.say/ask/yesno/menu/name/showKit), touch.js
src/scenes/  overworld.js (PK.world: movement, NPCs, keepers, encounters, interactions, bike, ferry, safari, rematches)
             battle.js (BattleScene for singles/doubles/safari), menus.js (party, summary, bag, learnMove, evolve, KitLog, shop, storage, card, options, start menu)
             moves.js (move list/detail screen, move card, rename, edit Kit, tint picker), townmap.js (region map), title.js (title, slots, intro, credits), debug.js
tools/       serve.py, load.mjs (loads data+systems into Node), validate.mjs, sim.mjs, balance.mjs, npcblock.mjs, namecheck.mjs, pyedit.py
```

---

## 5. Data formats (how to add content)

**Maps** (`D(id, {...})` in world files; `IN(id, template, opts)` for standard interiors: house, house2, clinic, shop, hut):
- `rows`: equal-width ASCII strings. Tiles: `.` ground, `,` flowers (rug indoors), `"` tall grass, `:` path, `g` paving, `d` stone floor, `T` tree, `~` water, `=`/`|` bridges, `v` ledge (jump down), `f` fence, `S` sign, `b` cuttable bush, `r` smashable rock, `R` boulder, `W` wall/cliff, `l` lava, `i` ice, `k` planter, `L` lamp, `Q` statue, `X` stairs, `O` door/cave warp, `M` exit mat; interiors: `t` table, `B` bed, `K`/`D` shelves, `p` plant, `C` storage PC, `c`/`H` counters, `Y`/`Z` wall decor.
- Markers: digits `1-9` = building anchors (footprint `#`), NPC letters `a e h j m n o q s u w x y z`, `*` item, `?` hidden item, `!` step event, `@` spawn. `O`/`X` pair with `warps` in row-major order, `S` with `signs`, `*` with `items`, `?` with `hidden`, `!` with `events`.
- Keys: `name, theme (vale|coast|desert|snow|spooky|cave|ice|volcano|ruins|house|lab|clinic|shop|league|spire|gym_<Type>), music, region, weather, buildings:[{k, to, roof?, label?, emblem?}], npcs:{letter:{sprite, dir, move:'wander'|'look', text, textIf:[[flag,text]], talk: 'scriptName'|fn, keeper:'trainerId', sight, cond, hideIf, id}}, warps:[[map,x,y,dir]], edges:{n|s|e|w:{to, off}} (offsets must be symmetric), enc:{grass|water|cave:[[kitId,minL,maxL,weight,'day'|'night'|'morning'?]], rate}, secret, dungeon, safari, links:[[map,x,y]] (script travel for the validator), interior, entry, homeBed, statue, shelfText, onEnter`.
- **Watch out:** a keeper standing in a 1-tile corridor walks back into it after battle and soft-locks the map (happened in the Dunespire Gym). Run `node tools/npcblock.mjs`.
- The region map places areas by following `edges` from the roots in `ROOTS` (townmap.js); caves/special places are `ICONS`. New outdoor areas need a root or an edge link, and possibly `FILL` land.

**Kits** (`kits.js`): `K(id, name, types, stage, evo, role, tier, category, artSpec, dexText)`. `L(to, level, time?)` / `I(to, item)` evolutions. Roles: bal, phys, spec, tank, fast, wall, mixed. Tiers set total stats and catch rate (st1-3, e1-2, b1-2, bug1-3, ps1-3, single, rare, legend, myth). Stats and learnsets are generated from the name (seeded); `SIGS` adds signature moves. IDs must stay consecutive from 1.
- Art spec: `p` body plan (quad, biped, blob, bird, serpent, fish, bug, golem, ghost, dragon, ray, flower), `c:[base, accent, belly]`, `ear, horn, top, tail, wing, eye (round|big|dot|fierce|sleepy|glow|single), mouth, pat (belly|stripes|spots|bands|back|mask|crown), x:[cheeks, whiskers, claws, fists, mane, collar, scarf, shell, spikes, leaves, gem, tusks, trunk, lure, arms]`, colors `hc gc cc lc wc ec ic`, `s` scale, `big`.

**Moves** (`moves.js`): `[id, name, type, cat P|T|S, power, acc (0 = never misses), pp, eff, prio, desc]`. Effect grammar, `;`-separated: `brn|psn|par|slp|frz|conf|flinch:chance`, `self:atk+1,spd+1` / `foe:def-1@30`, `heal:50`, `drain:50`, `recoil:25`, `multi:2-5`, `crit`, `rest`, `guard`, `clear`, `spread`.

**Trainers** (`trainers.js`, plus `K()` in world4.js): `K(id, title, name, sprite, team, {reward, ai 0|1|2, items, intro, after, lose, music, double, partner:{name, sprite, lose}, needTwo, canLose})`. Team entries `[kitId, level, moves?, held?]`; rival teams are functions of the player's starter.

**Items** (`items.js`): `it(id, name, pocket items|capsules|discs|key, price, use, value, desc)`; Skill Discs SD01-SD20 generated from a move list.

**Story scripts** (`story.js`, `PK.SCRIPTS`): `async (w, npc)` with `w.say/ask/yesno/battle(trainerId,{canLose})/wildBattle(id,lvl,opts)/give(item,n)/giveKit(id,lvl)/heal/flag/setFlag/moveNpc/movePlayer/face/emote/warp/ferry/wait/music`. Helpers `PK.story.warden({...})`, `gift(flag, item, pre, post, cond, notYet)`, `guardian(id, lvl, flag, text)`.

**Music** (`music.js`): `T(name, tempo, lead, bass, drums, extra)` in MML (`o` octave, `l` default length, `v` volume, `@` duty, `[ ]n` repeat, `|` bar marker ignored; drums k/s/h). Keep each bar summing to one whole note.

---

## 6. Systems worth knowing

- **Stats:** `v = floor((2*base + gene*2 + floor(TP/4)) * L/100) + 5` (HP: `+ L + 10`), then temperament x1.1 / x0.9. EXP curve `0.9 * n^3`.
- **Battle engine** (`PK.Battle`): sides have `slots` of `Battler`s keyed `p0 p1 e0 e1`; `runTurn(pActs, eActs)` returns events (`msg, anim, dmg, heal, hp, status, fx, faint, withdraw, send, capsule, fled`) that `BattleScene.play` animates. AI levels 0/1/2 via `chooseFor(battler, level)`. Replacement via `nextEnemy()` / `sendIn()`. Abilities are hooked inside the engine (entry, damage, contact, absorb, end of turn).
- **Catch:** `((3*maxHP - 2*HP) * catchRate * capsuleValue) / (3*maxHP) * statusBonus / 255`.
- **Saves:** `localStorage` keys `pixelkits_save_v1_slot1..3`, options in `pixelkits_options_v1`. `PK.game.fixup()` / `PK.stats.upgrade()` migrate old saves (add temperament, ability, TP). State keys include `party, box, bag, flags, crests[8], seen, caught, defeated, picked, cleared, visited, rematch, safari, registered, lastOutdoor, clinic`.

---

## 7. Content cheat sheet

| Gym | Town | Warden | Type | Top Lv |
| --- | --- | --- | --- | --- |
| 1 | Pinecrest | Fenna | Leaf | 11 |
| 2 | Quarryton | Gideon | Terra | 17 |
| 3 | Voltmere | Juno | Volt | 23 |
| 4 | Saltmarsh | Marisol | Tide | 28 |
| 5 | Dunespire | Ignatius | Blaze | 34 |
| 6 | Mirage City | Celestine | Mind | 38 |
| 7 | Rimeholt | Bjorn | Frost | 45 |
| 8 | Shadefall | Morwen | Shade | 49 |

Council Dax (Brawl 53), Hemlock (Venom 54), Orrin (Metal 55), Sable (Wyrm 56), Champion Castor (59). Balance sim (no items): gyms 60-100%, Council 1 ~87%, Council 4 ~66%, Champion ~39%.

Gates: Machete (1 crest), Pickaxe + Trail Bike (2), Wayfinder (3), Raft + Rally Bell (4), Seeker Lens (10 species caught), Omni Capsule then Ferry Pass (Prof. Vale after the Champion).

---

## 8. Originality rules (non-negotiable)

- Never use franchise names or terms (Pokémon, Poké Ball, Pokédex, species/moves/items/places/characters, catchphrases). Game vocabulary: Kits, Keepers, Kit Capsules, KitLog, Kit Clinic, Crests, Wardens, High Council, Skill Discs, Tonics, Prism, Temperaments, Training Points.
- All art is generated in code, all music is original MML, all names are invented. No sprite/tile/font ripping. Avoid designs that echo iconic creatures (a zigzag lightning tail was removed for that reason).
- Patent caution: catching is a battle-menu action only; no throwing at creatures in the overworld; no riding creatures (a bike is fine).
- Before shipping new names run `node tools/namecheck.mjs`. It reads reference lists from `C:\Users\aryan\OneDrive\Desktop\pixelkits_namelists\` (PokeAPI species, moves, items, abilities, locations; natures are hard-coded). **Never commit those lists.** Exact matches are rejected, Kit names within 2 letters of a species too. Also check character names against other franchises by hand.
- `ORIGINALITY.md` documents this; it's not legal advice.

---

## 9. Windows / tooling gotchas

- Some files had CRLF; Python on Windows defaults to cp1252 and CRLF. When editing from Python, `import pyedit` from `tools/` (forces UTF-8 + LF) or silent `str.replace` misses happen. `.gitattributes` normalizes to LF.
- Bash heredocs with lots of quotes break: write the Python edit script to a file with the Write tool, then run it.
- Keep every script syntax-valid: `validate.mjs` runs `node --check`-style checks, but also run `node --check <file>` after edits.

---

## 10. Editing the user's save safely

The user plays in **Chrome** at the live site, so saves are in that origin's `localStorage` (the Claude built-in browser has separate storage). The Claude-in-Chrome tools can read/modify it:

1. Ask the user to **save to the file first** and not save again.
2. Open a tab at https://aryanyaksh-art.github.io/PixelKits/, read `localStorage['pixelkits_save_v1_slot2']`, find the Kit by nickname, change it, write it back, re-read to verify, close the tab.
3. Tell the user to **reload the page before saving**, otherwise the open tab overwrites the fix.

Past edits: gave fiyah back Flurry Paws, swapped cet's Sonic Hum → Sap Siphon, fiyah's Smolder → Char Bite. The user keeps accidentally forgetting moves; the only Recall Master is post-game (Emberisle). Adding an early one was offered but not done.

---

## 11. Known limitations and loose ends

- Maps are small (about 20-30 tiles per side); the whole main story is roughly 6-8 hours, 10-12 with post-game.
- Only four-legged Kits use the 3/4 pose; other body plans face forward. Back sprites are simple.
- Storage is one list (no boxes grid). No fishing, breeding/day care, trading, weather-in-battle, or held-item variety beyond a handful.
- Moves come from generated learnsets, so many Kits share similar movepools; trainers are mostly 2-4 Kits.
- Music has never been listened to by a human reviewer; nobody has done a full human playthrough start to finish except the user's own play.
- Only one soft-lock has been found (Dunespire Gym, fixed); `npcblock.mjs` now guards against that class of bug.

---

## 12. Revamp: why it may feel repetitive, and options to offer

Ask the user first; then plan (use plan mode for a big change). Likely causes and fixes:

- **Battles feel the same:** generated movepools and similar AI. Hand-author signature moves and learnsets per line, add more move effects (weather, hazards, trapping, two-turn moves, status moves that matter), smarter boss AI with set-ups and switching, trainer classes with themed teams.
- **Routes feel the same:** small maps with grass patches. Bigger hand-designed routes with puzzles (strength boulders, switches, one-way paths, ice/lava variety), more caves and landmarks, side paths with rewards, weather events.
- **Nothing to do between gyms:** side quests, NPC requests, a Day Care / breeding, fishing, a battle facility (tower with streaks), daily events, collectibles, trainer rematch schedule, a Kit ranch.
- **Progression:** more meaningful items (TMs from quests, mega-style temporary transformations of the game's own design), a type-themed story twist per gym, the rival and Syndicate appearing more often.
- **Presentation:** hand-drawn signature sprites for starters/legendaries, battle backgrounds per area, animated overworld Kits, cutscenes.
- **Structure option:** keep the engine and rebuild the world (new region layout, bigger maps) — the tools (validate, npcblock, sim, harness) make that safe.

---

## 13. Suggested first message for the new chat

> I'm continuing my browser game PixelKits (repo https://github.com/aryanyaksh-art/PixelKits, local folder C:\Users\aryan\OneDrive\Desktop\pixel_kits). Read HANDOFF.md in the repo first — it has everything. I've played it a lot and it feels repetitive, so I want a big revamp. Ask me questions about what to change, then plan it. Keep everything original so it can't be copyrighted, test changes in the game, and commit + push everything.
