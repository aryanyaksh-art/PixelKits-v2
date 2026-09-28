# PixelKits v2 — Handoff

**v2 is a full rebuild of PixelKits in its own repo.** This file covers v2 only; the original v1 game and its own handoff notes live in the separate `PixelKits` repo.

- **Repo:** https://github.com/aryanyaksh-art/PixelKits-v2 (branch `main`) · **Live:** https://aryanyaksh-art.github.io/PixelKits-v2/
- **Local folder:** `C:\Users\aryan\OneDrive\Desktop\pixel_kits_v2` · v1 stays untouched in `Desktop\pixel_kits` (repo PixelKits).
- Saves use their own keys (`pixelkits2_save_slot1..3`, `pixelkits2_options`) so v2 never touches v1 saves on the shared github.io origin.
- **Before every push run `node tools/bump.mjs`** (stamps ?v= on index.html script links so browsers skip GitHub Pages' 10-minute cache).
- Commit attribution: end every commit message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. The user asked to commit and push everything.

## How v2 is being built

The user (Aryan) found v1 repetitive and asked for: the game filling the browser, a brand-new roster where every Kit has a unique design (151 Kits, mostly 3-stage lines, cool evolutions), every town rebuilt bigger and different from the others with unique buildings, a different quest structure per town (not "beat the gym, get the tool from a house"), bigger routes, gyms with their own mini-game/challenge that you can't leave until you win, a customizable player, unique NPC looks, a quest bar + quest menu, and foe types shown in battle. Keep the v1 town names but rebuild everything. **Work town by town: ask the user ~15 multiple-choice questions per town (and many per gym) before building it.** Keep everything original (see Originality rules below).

## Done so far

- **Full screen:** the canvas widens to the window (`PK.FW` up to 432 px wide, `PK.H` 160). Scenes flagged `wide` (overworld, battle, designs gallery) use the full width; others draw in a centered 240 px stage (`PK.BASE_W`, offset `PK.OX`) with a dark frame. Overlays take the width of the opaque scene below them (`PK.layout()` in core.js).
- **Battle:** layout spreads over the wide screen; foe types are shown under the foe HP box.
- **Kit art:** `src/gfx/kitDesigns.js`. Each Kit has its own `draw(d)` function (shaded ellipses/polys/strokes with auto outline; `d.eye`, `d.flame`, `d.speckle`, `d.cut`); views `front` (64 px), `back` (84 px, mirrored) and `icon` (32 px). `PK.KITS[id].art.design` names the design. Preview: `?gallery=designs`. The user approved this style.
- **Roster (27 of 151):** 1-3 Mossip→Pebblom→Templith (Leaf), 4-6 Emberlet→Shardrake→Halorax (Blaze→Blaze/Wyrm), 7-9 Conchi→Glyphsquid→Galleoth (Tide→Tide/Shade), 10-11 Rushkin→Bulrusher, 12-14 Kitefinch→Streamlark→Festivane, 15-17 Caddle→Stonesheath→Caddira, 18-19 Puffhop→Dandeloft, 20-21 Acornet→Oaknight, 22-23 Skimble→Rapidfin, 24-25 Nocturr→Umbrowl (night), 26-27 Geodrop→Amethell (rare). Stats/learnsets are still generated from the name (kits.js); hand-made learnsets are a future task.
- **Character creator** (title.js `Creator`): body (pants/skirt/shorts), 6 skin tones, 9 hairstyles, hair color, hat (none/cap/beanie), hat/top/bottom/shoe colors. Stored in `state.player.look`, applied with `PK.chars.setPlayerLook`.
- **Quests** (`src/systems/quests.js`): `PK.QUESTS[id] = {title, kind:'main'|'side', desc, steps:[{id,text}], reward}`; API `PK.quest.start/advance(id, stepId)/complete/at/past/has/done/current`. Quest bar on the map (hidden during scripts), NEW QUEST / QUEST UPDATED / QUEST COMPLETE toasts, QUESTS screen in the start menu, Options toggle.
- **Maps by coordinates** (maps.js): `buildings: [{k, at:[x,y], to}]`, `npcs: {name: {at:[x,y], ...}}`, `signsAt`, `itemsAt`, `hiddenAt`, `eventsAt`, `warpsAt`. NPC options added: `startHidden`, sprite `'item'` (satchel), sprite `'tracks'`, `swept` path. `W.refreshNpcs()` re-checks NPC conditions after every script/interaction.
- **New tiles:** `A` reeds (encounters use `enc.reeds`), `E` berry tree (daily River Berries), `G` hedge, `I` stepping stone, `J` waterfall, `N` dock, `P` herb bed, `U` well, `&` barrel, `$` crate, `-` rail fence, `_` stone wall, `/` bench, `^` steps, `F` flower bed, `<` logs, `(` lily pads, `+` mailbox. Flavor text via `TILE_TEXT` or a map's `tileText`.
- **New buildings** (`src/gfx/buildings2.js`, each with its own draw code): home, cottage (thatch), mill (animated wheel), tower, school, bakery, stall (no door), boathouse, rivlab, floodhouse.
- **Story weather:** flag `storm` forces night + heavy rain on outdoor maps.
- **Brookhollow** (`src/data/v2/brookhollow.js`): opens on the flood night: bell rings, run to the north bridge, pull one of three baby Kits out of the flood (your starter), the other two are swept away, your sibling chases them. Morning: main quest *After the Flood* (lab → help the baker/teacher/Grandma → floodgate clue (Ashen Accord scrap) → Grandma's story about Grandpa → his journal + map in the watchtower → north). Side quests: *Flour in the Reeds*, *The Silent School Bell* (fisher + River Berry bait), *Grandma's Catching Lesson*.
- **Willow Trail** (`src/data/v2/willow.js`, 44x64): reservoir shore, meadow, forest. Main quest *Upriver*: Ashen Accord Cinders at the weir (2 battles), tracks of the third flood Kit, sibling battle on the north road. Side quest *Low Water*: the weir hut lever lowers the river so stepping stones appear, leading to *Willow Hollow* (cave with Geodrop). Rest stop heals. North road blocked by a rockslide until Pinecrest is built.
- Map generators used for the big layouts live in the session scratchpad only; the rows are committed in the area files.

- **Round 2 (interiors):** props/furniture system in `src/gfx/props.js` (map `props: [[kind, x, y, {w,h,color,icon,art,variant,text,talk,use}]]`; art can be taller than the footprint; `deco` props hang on walls). Interior themes `home bedroom mill cellar bakery school cottage tower boat works teller sitter green` with wall styles. `%` = doorway tile in a wall row (use `warpsAt`); sub-rooms set `exit: {map,x,y}` and use an `M` mat. The `room()` helper in brookhollow.js builds interiors with two wall rows. `tools/propcheck.mjs` verifies furniture never blocks entries/exits/stairs. Food items (snack/boost/joy uses), `kit.joy` happiness (endure + status shrug in battle), `kit.boost` applied on battle entry, Old Rod fishing (`enc.water`), `PK.showView` telescope views, music tracks `storm lab mystery tender sibling willow`. Willow Trail has a ranger cabin, treehouse (trainer Flint) and the Accord camp in the weir hut.

## Story bible (decided with the user)

- Brookhollow: riverside mill village. Family: Mom at home; Grandma runs the mill and mentors you; Grandpa co-founded the villains when they were idealists, left, then went missing years ago; Dad is secretly the 8th Warden (reveal before the League). The older sibling (named by the player, sprite `rival`) is the rival: a **double agent** who pretends to join the villains to learn what happened to Grandpa; **bittersweet ending** (redeemed, loses their partner Kit, leaves to make amends, returns post-game).
- Villains: **the Ashen Accord** (grey cloaks, ember symbol; grunts = Cinders; leaders = Elders). They want to "purify" the valley.
- Starters were swept down from the hills; the sibling fished out the one strong against yours; the third one is loose in the hills (tracks on Willow Trail).

## Pinecrest plan (user answers, 2026-09-27)

- **Day/night:** fast game cycle (a full day is about 20 real minutes) instead of the real clock.
- **Pinecrest = one huge mountain.** You enter at the bottom and climb terraces joined by stairs to the peak, with **lots of caves**: shortcut tunnels between terraces, a dark cave (needs light), the crystal grotto (Accord dig site) and an underground lake (fishing, stepping stones).
- **Buildings:** mine + miners' hall, hot spring bathhouse (heals), stonecarver workshop, lookout + cable car, climbing gear shop, mountain inn (multi-floor, guests with mini-stories), shrine at the peak, goat herder's barn (milk stall food). All enterable and full.
- **Main story:** the Ashen Accord is "logging" the old grove to dig underneath. They're after all three things: the relic tablet leads to the crystal vein, and the crystals hold a fossil Kit. The Accord **blasts the Willow Trail rockslide open** (that's how the road reopens). Climax: a grotto showdown with an Elder that you win, but they flee with **half the tablet** (bittersweet, sets up the next town).
- **Sibling appears three times:** seen with the Accord at the dig (double-agent act), helps in the avalanche rescue, then waits at the shrine for a battle.
- **Side quests:** lost goat Kits across the ledges, fossil dig in the mine (revive later), echo cave puzzle (shout in order to open a chamber), avalanche rescue (dig out a hiker).
- **Gym:** Rock type, leader = a gruff old miner who knew Grandpa. Locked in until you win. Structure: challenge → trainer → challenge → trainer → challenge → trainer → challenge → leader. Challenges in order: **boulder push, minecart switches, crumbling floor (memory), pickaxe timing**. **Losing = full reset** (heal, all puzzles and trainers reset).
- **Gym rewards:** break-rocks field move, the Pickaxe (opens the sealed Accord mine door), a Grandpa clue (his old helmet with a note), cable car access down to the next route.
- **New Kits:** rock/mountain goats + boulder beetles, cave dwellers (bat, blind salamander, glow moth), crystal lizard + fossil Kit, snow/ice at the peak (snow hare, frost owl).

## Pinecrest (built 2026-09-28)

- Files: `src/data/v2/pinecrest.js` (all maps, interiors, quests, scripts), `src/scenes/minigames.js` (minecart switches + pickaxe timing), 21 new Kit designs (ids 28-48), buildings `chalet barn gearshop inn bathhouse miners mine carver cablecar shrine rockgym`, props `carving statue minecart pickrack spring`, themes `mount mine lodge spa workshop`, music `mountain peak mine challenge grotto`, NPC palettes `miner miner2 warden1 herder carver innkeeper guide bathkeeper elder`.
- Map rows for the big maps come from a generator in the session scratchpad (`pc_maps.py`); the rows are committed in pinecrest.js.
- Engine additions: pushable boulders (`npcs {push:true, sprite:'boulder'}`, fill pits `o`, positions saved in `state.boulders`), map hooks `lockExit()`, `onStep(w,x,y)`, `onLose(w)`, `onFill`, `W.hl` tile highlight, `dark: 'deep'` caves (need `minerlamp`), tiles `o` pit, `q` cracked floor, `y` rails, `j` snow rock, sprites `boulder gate pickwall panel echo dig`, `m.townPoint` for fly-in. Lowercase letters in rows are only NPC markers if the map has a matching npc key without `at`.
- Day/night is now a fast game clock (`PK.game.DAY_FRAMES` = 20 min); `PK.game.setTime('morning')` after the flood.
- Region map is 300 px tall and scrolls with the cursor (townmap.js `MH`, `VH`).
- Story: Willow Trail rockslide is blasted by the Accord (`wt_blast`) → main quest *Ashes on the Mountain* (grove scene with the sibling, avalanche rescue + sibling2, summit sibling3, gym, mine door, Elder Morrow in the Crystal Grotto, Tablet Half, freed Quartzel). Side quests *Kids on the Cliffs*, *Buried in Amber* (Amberjaw fossil), *The Singing Cave* (echo stones, order green-red-blue-yellow).
- Gym: Warden Harrow (Rock/Terra). Boulders → Miner t1 → minecart → Miner t2 → memory floor → Miner t3 → pickaxe wall → Harrow.

## Gym fixes (2026-09-28/29, post-launch)

The Challenge Hall was originally one 40-row map; it's now **4 separate rooms** (`pc_gym1`..`pc_gym4`, one per challenge), each small enough to show in full on screen. Splitting it surfaced (and fixed) a run of real bugs, in case similar patterns show up elsewhere:
- Doors/gates must be **3 tiles wide** — a beaten guard rests at its post afterward, and a 1-wide gap meant that post permanently blocked the only way through.
- A 3-wide gap also means a guard's single-column sight line can be walked around entirely — every guard row now has a `guardRow()` forced-battle event across all 3 columns so the fight can't be skipped, and it stops firing once that trainer is beaten (`beat(trainerId)`).
- The same "wide gap, single npc in the middle" bug hit the minecart gate and the pickaxe wall too — they're each 3 npcs wide now (`gatem`/`gatem_l`/`gatem_r`, `wall`/`wall_l`/`wall_r`).
- Every room needs an explicit way back to the previous one (`warpsAt` at each room's own entry tile) — rooms only had a forward warp at first, so re-entering after winning (or just backtracking) left no way out. `pc_gym4` also needs its own real `exit`/`lockExit`/`M` — it lost them when an earlier fix stripped a broken exit tile and nobody put a working one back.
- `PK.enterWorld` now falls back to the game's own start (`bh_home2f`) if a save points at a map that no longer exists (e.g. after a rename like this one), instead of crashing to a black screen.
- `W.refreshNpcs` used to only ever *add* npcs whose `cond` became true, never hide ones whose `cond` went false — fixed so a flag-gated npc (like a solved puzzle's blocker) actually disappears once its flag flips, not just on the next full map reload.
- `pc_grotto`'s entrance corridor had a 1-tile misalignment (row 13's gap was one column off from the rows above/below it), a dead end that only `namecheck`/`validate`-style tools can't catch since it's still statically reachable via a different column — worth an occasional manual walk-through of new areas, not just the automated checks.

## Next up

1. Ask the user ~15 questions about the next town (the cable car far-side line and the Accord's note point "by the sea"), then build it.
2. Keep designing Kits for each new area (target 151) and consider hand-authored learnsets.
3. Title screen and menus could be made wide like the overworld.
4. `tools/balance.mjs` currently shows `elder_morrow` near 0% win rate at the suggested level — worth a rebalance pass (lower its team's levels or the AI tier) once there's time.

## Running and testing

```bash
python tools/serve.py 8767              # dev server + POST /__shot?name=x saves a PNG to .shots/x.png
node tools/validate.mjs                 # data integrity: maps, warps, edges, reachability, trainers, items, music
node tools/npcblock.mjs                 # finds NPCs that block a path at their posts (should print "issues 0")
node tools/propcheck.mjs                # furniture never blocks entries/exits/stairs
node tools/namecheck.mjs                # originality check (reference lists live OUTSIDE the repo, see ORIGINALITY.md)
node tools/balance.mjs 150              # a typical team vs each boss (win rates)
node tools/bump.mjs                     # run before every push — stamps ?v= so browsers skip the GitHub Pages cache
```

- `.claude/launch.json` has a `pixelkits2` config (`python tools/serve.py 8767`) for the built-in browser (`preview_start` name `pixelkits2`).
- `?debug=1` adds a DEBUG entry to the in-game menu and <kbd>`</kbd> toggles 4x speed. `?gallery=designs` shows every Kit design.
- **In-page test harness** (`src/scenes/debug.js`, `PK.test`): `press('a'|'b'|'start'|'up'…)`, `walk(dir, n)` (tile by tile), `face(dir)`, `warp(map, x, y)`, `advance(max)` (presses A through dialogue, auto-battles, answers menus), `info()` (scene/map/pos/party/lastError).
  - Typical setup: `PK.game.newGame(); st=PK.game.state; st.party=[PK.stats.create(4,20)]; await PK.enterWorld(); PK.test.warp('pinecrest',10,8)`.
  - Gotchas: give the page ~1.5s after `location.reload()` before `PK.test` exists; leftover `W.busy` from a script you interrupted mid-test (e.g. force-closing a minigame) silently blocks all further movement in that same session — `W.world.busy = 0` or a fresh `newGame()` clears it.
- Workflow: change code → `node --check` → `validate.mjs`/`npcblock.mjs`/`propcheck.mjs` → test with the harness → `bump.mjs` → commit → push.

---

## Data formats (how to add content)

**Maps** (`D(id, {...})` in world files; `IN(id, template, opts)` for standard interiors: house, house2, clinic, shop, hut):
- `rows`: equal-width ASCII strings. Tiles: `.` ground, `,` flowers (rug indoors), `"` tall grass, `:` path, `g` paving, `d` stone floor, `T` tree, `~` water, `=`/`|` bridges, `v` ledge (jump down), `f` fence, `S` sign, `b` cuttable bush, `r` smashable rock, `R` boulder, `W` wall/cliff, `l` lava, `i` ice, `k` planter, `L` lamp, `Q` statue, `X` stairs, `O` door/cave warp, `M` exit mat; interiors: `t` table, `B` bed, `K`/`D` shelves, `p` plant, `C` storage PC, `c`/`H` counters, `Y`/`Z` wall decor.
- Markers: digits `1-9` = building anchors (footprint `#`), NPC letters `a e h j m n o q s u w x y z`, `*` item, `?` hidden item, `!` step event, `@` spawn. `O`/`X` pair with `warps` in row-major order, `S` with `signs`, `*` with `items`, `?` with `hidden`, `!` with `events`.
- Keys: `name, theme, music, region, weather, buildings:[{k, at:[x,y], to, roof?}], props:[[kind,x,y,opts]], npcs:{name:{at:[x,y], sprite, dir, move:'wander'|'look', text, textIf:[[flag,text]], talk: 'scriptName'|fn, keeper:'trainerId', sight, cond, hideIf}}, signsAt, itemsAt, hiddenAt, eventsAt, warpsAt, edges:{n|s|e|w:{to, off}} (offsets must be symmetric), enc:{grass|water|cave|reeds:[[kitId,minL,maxL,weight,'day'|'night'|'morning'?]], rate}, rooms (camera bands, rarely needed now that big puzzles get their own small map), dungeon, interior, entry, exit:{map,x,y}, lockExit(), onStep(w,x,y), onLose(w), onEnter, links:[[map,x,y]] (tells the validator a puzzle-gated tile is reachable, since it can't simulate solving it)`.
- **Watch out:** a keeper resting at its post after battle can permanently block a 1-tile-wide doorway — keep doors/gates at least 3 tiles wide (see the Pinecrest gym fixes above for the full pattern: wide doors need a forced-battle event across all 3 columns too, or the guard can just be walked around). Run `node tools/npcblock.mjs` and `node tools/propcheck.mjs` after any new interior.
- The region map places areas by following `edges` from the roots in `ROOTS` (townmap.js); caves/special places are `ICONS`. New outdoor areas need a root or an edge link, and possibly `FILL` land.

**Kits** (`kits.js`): `K(id, name, types, stage, evo, role, tier, category, {design:'name'}, dexText)`. `L(to, level, time?)` / `I(to, item)` evolutions. Roles: bal, phys, spec, tank, fast, wall, mixed. Tiers set total stats and catch rate. IDs must stay consecutive from 1. Each Kit's actual look is its own hand-drawn `draw(d)` function in `src/gfx/kitDesigns.js` — no shared body-plan template.

**Moves** (`moves.js`): `[id, name, type, cat P|T|S, power, acc (0 = never misses), pp, eff, prio, desc]`. Effect grammar, `;`-separated: `brn|psn|par|slp|frz|conf|flinch:chance`, `self:atk+1,spd+1` / `foe:def-1@30`, `heal:50`, `drain:50`, `recoil:25`, `multi:2-5`, `crit`, `rest`, `guard`, `clear`, `spread`.

**Trainers** (`trainers.js`): `K(id, title, name, sprite, team, {reward, ai 0|1|2, items, intro, after, lose, music, double, partner, needTwo, canLose, noRematch})`. Team entries `[kitId, level, moves?, held?]`; the sibling's team is a function of the player's starter.

**Items** (`items.js`): `it(id, name, pocket items|capsules|discs|key, price, use, value, desc)`; Skill Discs SD01-SD20 generated from a move list.

**Story scripts** (`story.js`, `PK.SCRIPTS`): `async (w, npc)` with `w.say/ask/yesno/battle(trainerId,{canLose})/wildBattle(id,lvl,opts)/give(item,n)/giveKit(id,lvl)/heal/flag/setFlag/moveNpc/movePlayer/face/emote/warp/ferry/wait/music`. Helpers `PK.story.warden({...})`, `gift(flag, item, pre, post, cond, notYet)`, `guardian(id, lvl, flag, text)`.

**Music** (`music.js`): `T(name, tempo, lead, bass, drums, extra)` in MML (`o` octave, `l` default length, `v` volume, `@` duty, `[ ]n` repeat, `|` bar marker ignored; drums k/s/h). Keep each bar summing to one whole note.

---

## 6. Systems worth knowing

- **Stats:** `v = floor((2*base + gene*2 + floor(TP/4)) * L/100) + 5` (HP: `+ L + 10`), then temperament x1.1 / x0.9. EXP curve `0.9 * n^3`.
- **Battle engine** (`PK.Battle`): sides have `slots` of `Battler`s keyed `p0 p1 e0 e1`; `runTurn(pActs, eActs)` returns events (`msg, anim, dmg, heal, hp, status, fx, faint, withdraw, send, capsule, fled`) that `BattleScene.play` animates. AI levels 0/1/2 via `chooseFor(battler, level)`. Replacement via `nextEnemy()` / `sendIn()`. Abilities are hooked inside the engine (entry, damage, contact, absorb, end of turn).
- **Catch:** `((3*maxHP - 2*HP) * catchRate * capsuleValue) / (3*maxHP) * statusBonus / 255`.
- **Saves:** `localStorage` keys `pixelkits2_save_slot1..3`, options in `pixelkits2_options`. State keys include `party, box, bag, flags, crests, quests, seen, caught, defeated, picked, cleared, visited, boulders, player`.

---

## Originality rules (non-negotiable)

- Never use franchise names or terms. Game vocabulary: Kits, Keepers, Kit Capsules, KitLog, Kit Clinic, Crests, Wardens, Skill Discs, Tonics, Prism, Temperaments, Training Points.
- All art is drawn in code (per-species designs, not a shared template), all music is original MML, all names are invented. No sprite/tile/font ripping.
- Patent caution: catching is a battle-menu action only; no throwing at creatures in the overworld; no riding creatures.
- Before shipping new names run `node tools/namecheck.mjs` (optionally `--kits a,b,c` for just the new ones). It reads reference lists from `C:\Users\aryan\OneDrive\Desktop\pixelkits_namelists\`. **Never commit those lists.** Exact matches are rejected, names within 2 letters of an existing one too.
- Full details in `ORIGINALITY.md`; it's not legal advice.

---

## Windows / tooling gotchas

- Some files had CRLF; Python on Windows defaults to cp1252 and CRLF. When editing from Python, `import pyedit` from `tools/` (forces UTF-8 + LF). `.gitattributes` normalizes to LF.
- Bash heredocs with lots of quotes break: write the Python edit script to a file with the Write tool, then run it.
- Keep every script syntax-valid: run `node --check <file>` after edits, in addition to `validate.mjs`.

---

## Editing the user's save safely

The user plays in **Chrome** at the live site, so saves are in that origin's `localStorage` (the Claude built-in browser has separate storage). The Claude-in-Chrome tools can read/modify it:

1. Ask the user to **save to the file first** and not save again.
2. Open a tab at https://aryanyaksh-art.github.io/PixelKits-v2/, read `localStorage['pixelkits2_save_slot1']`, make the change, write it back, re-read to verify, close the tab.
3. Tell the user to **reload the page before saving**, otherwise the open tab overwrites the fix.

The user keeps accidentally forgetting moves via the party EDIT screen sometimes — worth double-checking after any save edit that touches a Kit's moveset.

---

## Known limitations and loose ends

- Only 48 of 151 Kits exist so far; only 3 of the planned towns are built.
- Storage is one list (no boxes grid). No fishing beyond the Old/Reed Rod, breeding, trading, or weather-in-battle.
- Moves come from generated learnsets for now (seeded from the name), so many early Kits share similar movepools; hand-authored learnsets are a future task.
- Nobody has done a full human playthrough start to finish except the user's own play — the automated test harness catches reachability/soft-lock bugs, not balance or fun.
