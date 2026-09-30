# PixelKits v2 — Handoff

**v2 is a full rebuild of PixelKits in its own repo.** This file covers v2 only; the original v1 game and its own handoff notes live in the separate `PixelKits` repo.

- **Repo:** https://github.com/aryanyaksh-art/PixelKits-v2 (branch `main`) · **Live:** https://aryanyaksh-art.github.io/PixelKits-v2/
- **Local folder:** `C:\Users\aryan\OneDrive\Desktop\pixel_kits_v2` · v1 stays untouched in `Desktop\pixel_kits` (repo PixelKits).
- Saves use their own keys (`pixelkits2_save_slot1..3`, `pixelkits2_options`) so v2 never touches v1 saves on the shared github.io origin.
- **Before every push run `node tools/bump.mjs`** (stamps ?v= on index.html script links so browsers skip GitHub Pages' 10-minute cache).
- Commit attribution: end every commit message with the `Co-Authored-By:` line the session's system reminder gives (it has changed between sessions: Opus 5.5, Sonnet 5, Sonnet 5.5). The user asked to commit and push everything.

## START HERE (status as of 2026-09-29)

**Built and live:** Brookhollow → Willow Trail → Pinecrest (town + summit + 6 caves + 4-room Challenge Hall gym) → **the Way Down** (built 2026-09-29: summit north gate opened by Guide Maren, `pc_far` Far Slope with wind ridge / rockfall floor / rope bridge / camp / Accord trap rescue, `pc_windpipe` + `pc_whisper` caves, `pc_trail` Windswept Trail with a Trail Station and food stall, `pc_beach` Gullshore with the sibling scene and a festival barricade), 61 of 151 Kits, quests (*The Far Side*, side quest *The Snapped Cable* for the far-side cable car), character creator, fast day/night. **Next:** Saltmarsh (replace the `barA..barD` barricade npcs on `pc_beach` with a real `n` edge, and set quest step `harbor` to complete on arrival), then gym 2. See the Saltmarsh plan below. The main story so far ends with Elder Morrow escaping with half the tablet; a note in the Summit Inn attic says the Accord's next stop is "by the sea" and the sibling is now trusted by the Elder. The cable car's far-side line (down the other side of Pinecrest) is "under repair" and is meant to open the route to the next town.

**How to work with this user (Aryan) — important, they get frustrated fast:**
- They want **speed and low token use**: short replies, no long explanations, batch tool calls, avoid extra screenshots and repeated test loops. They have said "hurry", "don't waste my tokens" more than once.
- **Verify fixes by actually walking the path in the test harness**, not by debug-warping past the puzzle (warping skipped two real soft-locks last session). Never claim "fixed" without checking their real save's situation.
- When they report "still stuck/didn't work", first check **caching**: read their save with the Claude-in-Chrome tools and check which script version they're on (`[...document.scripts].find(x=>x.src.includes('pinecrest')).src` shows the `?v=` stamp; compare with the last `bump.mjs` stamp). GitHub Pages caches ~10 min; tell them to close the tab and open the link fresh + Ctrl+Shift+R. Also fix their save directly (teleport them clear) so they aren't blocked waiting.
- **Secrets/clues must always be a little visible** (a sprite, crack, glint) — never invisible spots.
- **Keep everything original**; run `node tools/namecheck.mjs` for any new name. Never commit the reference name lists (they live in `Desktop\pixelkits_namelists`).
- Work **town by town**: ask ~15 multiple-choice questions per town and many per gym before building (they answer in bulk, often with "add more", and ask for many unique buildings/props/quests). Give every town its own quest structure, unique buildings with picture icons instead of text labels, full multi-room interiors, food stalls, and a gym with its own mini-game challenges (a gym locks you in until you win; losing = full reset; no helpers/healing inside).
- Shell tools sometimes fail with "auto mode classifier gave no verdict" (transient outage). Retry once; if it persists do read-only work or edits and come back. Edit-tool string surgery on map rows is error-prone (row width must stay exact): verify length with a quick node script, or do the edit by index in a script file.
- Before every push: `node tools/validate.mjs`, `npcblock.mjs`, `propcheck.mjs`, `namecheck.mjs`, then `node tools/bump.mjs`, commit, push.

**The user's save** (live site, `localStorage['pixelkits2_save_slot1']`, Aryan's Halorax-line starter): finished the Pinecrest gym, Grotto, all main Pinecrest quests; side quests: *Kids on the Cliffs* 3/4 (goat1 at (3,65) on the `pinecrest` map, then turn in to Nell at the barn), *Buried in Amber* done (dig2 at (22,4) in `pc_mine` still undug), *The Singing Cave* done. All 48 Kits were also placed in their storage box at Lv16 for testing (that is normal test data, not a bug).

## How v2 is being built

The user (Aryan) found v1 repetitive and asked for: the game filling the browser, a brand-new roster where every Kit has a unique design (151 Kits, mostly 3-stage lines, cool evolutions), every town rebuilt bigger and different from the others with unique buildings, a different quest structure per town (not "beat the gym, get the tool from a house"), bigger routes, gyms with their own mini-game/challenge that you can't leave until you win, a customizable player, unique NPC looks, a quest bar + quest menu, and foe types shown in battle. Keep the v1 town names but rebuild everything. **Work town by town: ask the user ~15 multiple-choice questions per town (and many per gym) before building it.** Keep everything original (see Originality rules below).

## Done so far

- **Full screen:** the canvas widens to the window (`PK.FW` up to 432 px wide, `PK.H` 160). Scenes flagged `wide` (overworld, battle, designs gallery) use the full width; others draw in a centered 240 px stage (`PK.BASE_W`, offset `PK.OX`) with a dark frame. Overlays take the width of the opaque scene below them (`PK.layout()` in core.js).
- **Battle:** layout spreads over the wide screen; foe types are shown under the foe HP box.
- **Kit art:** `src/gfx/kitDesigns.js`. Each Kit has its own `draw(d)` function (shaded ellipses/polys/strokes with auto outline; `d.eye`, `d.flame`, `d.speckle`, `d.cut`); views `front` (64 px), `back` (84 px, mirrored) and `icon` (32 px). `PK.KITS[id].art.design` names the design. Preview: `?gallery=designs`. The user approved this style.
- **Roster (48 of 151):** 1-3 Mossip→Pebblom→Templith (Leaf), 4-6 Emberlet→Shardrake→Halorax (Blaze→Blaze/Wyrm), 7-9 Conchi→Glyphsquid→Galleoth (Tide→Tide/Shade), 10-11 Rushkin→Bulrusher, 12-14 Kitefinch→Streamlark→Festivane, 15-17 Caddle→Stonesheath→Caddira, 18-19 Puffhop→Dandeloft, 20-21 Acornet→Oaknight, 22-23 Skimble→Rapidfin, 24-25 Nocturr→Umbrowl (night), 26-27 Geodrop→Amethell (rare). Pinecrest: 28-30 Crampling→Ledgeram→Peakhorn (Terra→Terra/Brawl), 31-32 Pebbeetle→Bouldrone, 33-35 Echip→Flittermaw→Stalagwing (bats), 36-37 Palewick→Gloamander, 38-39 Glowgrub→Wickmoth (design key `glimmoth`), 40-42 Quartzel→Facetail→Crystalisk, 43-44 Amberjaw→Runemaw (fossil), 45-46 Flurrip→Avalop, 47-48 Hailet→Rimecrown (design key `glacrown`). **No type in the roster yet uses Volt, Venom or Mind** — later towns should introduce them. Most lines are 3 stages; some 2, a couple 1 (the user's request). Stats/learnsets are still generated from the name (kits.js); hand-made learnsets are a future task.
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

## Saltmarsh + Way Down plan (user answers, 2026-09-29)

**Build order: the Way Down (DONE), then Saltmarsh, then its gym.** Model tip: Sonnet 5.5 for building from spec; Opus only for a bug that survives one fix.

**Way Down (Pinecrest summit → Saltmarsh):** a real walk, not just the cable car. Summit north edge → *Far Slope* (cliff switchbacks with stairs/ledge-drops) → trail → beach → Saltmarsh. 3 maps. A **guide NPC unlocks** the summit's north gate. Hazards: ledge-drops, rope bridge, wind gusts, rockfall. Two caves (one shortcut, one dark/secret). 6-8 trainers. Trailside camp rest stop (heals). Story: a rescue + a sibling scene. Wild Kits: mix of wind/sky, scrub/dune, marsh/coast (start introducing Volt/Venom/Mind). Secrets, all three: hidden cave with visible crack, a rare Kit glint spot, a hidden item trail. Weather: clear and sunny. The cable car far-side line gets repaired via a **side quest** (currently `pc_cable` says it is under repair).

**Saltmarsh:** coastal harbor, mix layout (stilt boardwalks below, cliff lighthouse above, canals). Tone: cozy + lively, sometimes mysterious. Main quest: the harbor **festival is sabotaged**, a cover for a **smuggling mystery**; the Accord's Elder runs a front business. Character design and animation matter a lot (parade with dancers/floats, animated aquarium Kits). Music: sea shanty (and make **battle music more intense**). Buildings (put real thought into exteriors AND interiors, add more than listed): lighthouse, fish market + cannery, aquarium, shipyard, tide-pool lab, pier arcade, sailors' tavern, costume workshop. Full harbor food row. 4 side quests (festival-prep themed; some unlock secret items). Town features (all): festival parade, ferry between districts, time-of-day changes, tide clock. Shops (all): upgraded rod, bait shop, rare-item trader. New types: introduce Volt, Venom, Mind (maybe all). Story threads: the lighthouse keeper knew Grandpa (tablet clue); tense harbor scene with the sibling.

**Gym 2 (Tide, lighthouse tower):** leader = a flashy **festival showman** who is **secretly helping the Accord**. 3 big rooms, each pairing two challenges: R1 light-beam mirrors + rope-and-crate pulleys; R2 current levers + fishing timing; R3 buoy memory + stage-show cues. Guards are a mix, some are undercover Accord. Leader: 5 Kits with a strong ace. Losing = full reset. Reward: **Raft** (+ side quests unlock secret items). Remember gym rules: 3-wide doors, guardRow events, a way back out of every room.

## Way Down notes (built 2026-09-29)

- Files: `src/data/v2/farpath.js` (maps, NPCs, trainers, quests, scripts, hazards) + `farpath_rows.js` (generated rows; the generator lived in the session scratchpad, edit the rows by hand from now on), `src/gfx/kitDesigns2.js` (Kit designs 49-61: Wirelet, Arcwhisk, Windlet, Cliffswift, Squallcrest, Dunelet, Hazeveil, Tumblet, Sentrybrush, Cranklet, Pincerlord, Jellyp, Stingbloom; design keys `zipwick` and `sandveil` are the old names for Wirelet and Hazeveil). This is where Volt, Venom and Mind first appear.
- Engine: new tile `V` = cliff you hop up-over when moving north (mirror of `v`); validate.mjs and npcblock.mjs know it. `farStep` in farpath.js implements the wind ridge (gusts shove you sideways) and the rockfall floor (red highlighted tiles = a rock lands there when you step on it next; a hit sends you back to the start). Region map (`townmap.js`) grew to MH=420 with Brookhollow at y=370 so the northward chain fits.
- Summit gate: rows 0-1 cols 19-21 of `pinecrest_peak` are open path; `fgate0..2` block them until flag `farpath`; `marenGate` (only after the Pinecrest main quest is done) opens it and starts *The Far Side*.
- Cable car far-side line: three spool key items (`spoolA` slope, `spoolB` trail, `spoolC` Whisper Hollow, behind a cracked rock that needs the Pickaxe). `S.pc_cable` in farpath.js replaces the one in pinecrest.js.
- Cable stations: Brookhollow now has `bh_cable` (home line to Pinecrest Base Camp, Summit Crest holders only); Pinecrest Base Camp has a "Home line: Brookhollow" option. The far-side (Trail Station) end is dead until `cable_far` (all three spools handed in): riding up from the Trail Station without spools used to work by mistake, fixed 2026-09-29. All cable logic is `S.pc_cable` in farpath.js.
- Walk-tested with a BFS bot in the browser (all terraces, trap rescue, both caves, shortcut hop, gate scene, cable flow, sibling scene).

## Saltmarsh detailed answers (2026-09-29, 40 questions; these OVERRIDE the shorter plan above where they differ)

- **Size/layout:** bigger than Pinecrest (~60x90), 4 districts (Harbor front, Market Row, Lighthouse Hill, Old Docks), painted stilt-house style (blues, corals, yellows). You enter **through the fish market first** (working end of town). Ferry stops at every district pier. Full animated tide cycle (water rises/falls smoothly; boardwalks and tide pools open/close).
- **Festival:** *The Great Catch*, a fishing-harvest festival. Runs **until the main quest is beaten**, after that Saltmarsh relaxes into a normal pier town (decorations packed away, thank-you gifts, lots of NPC + shop dialogue changes between festival and after). Three centerpiece shows, one per festival night: lantern parade, boat procession, fireworks from the lighthouse. Animation priority: dancers and drummers, floating lanterns, bunting/flags in the wind, parade floats (and more).
- **Main quest (Undercover):** you take a **dockhand job for the Lighthouse Trading Co.** and wear a festival-costume disguise (costume workshop makes it). Risk = **suspicion meter + nightly deadlines**. Smuggled: captured Kits (matches the crates on the Far Slope) as cover for a bigger secret: **rare Kits to get past the harsh stormy sea to a big island after Saltmarsh**. Front = Lighthouse Trading Co., run by a **brand new, warm and charming Elder** (dangerous because everyone loves them). Gym leader (festival showman) secretly helps the Accord.
- **Allies:** festival organizer, harbor master, aquarium curator, young journalist. **Sibling:** a secret back-room meeting (info swap). **Lighthouse keeper** = retired sailor, gruff and kind, knew Grandpa; gives **a piece of the map**. Dad: nothing yet.
- **Buildings (put real thought into exteriors and interiors):** lighthouse (all three: multi-floor climb + view balcony, keeper's museum of ship models/maps, working signal station), aquarium (mix of animated Kit tanks and a twisty tank maze with hidden plot rooms), pier arcade (ring toss/fishing, strength test bell, claw machine with Kit plushies, guess-the-shell), sailors' tavern (rumors, battle table, animated band/music room, food that boosts Kits), shipyard (walkable half-built float + ship in drydock AND a boat workshop interior), weather and storm research lab (sets up the island), fish market + cannery (smuggling cover, secret-compartment crates), harbor inn with rooms over the water (guest mini-stories), costume workshop. Full harbor food row. Shops: upgraded rod, bait, rare-item trader.
- **Side quests:** The Ghost Ship (wreck visible at low tide), The Rod Contest (harbor master's trophy), The Journalist's Scoop (photograph suspicious cargo), Pirate Cove Treasure Map (hidden cove, Raft secret). Some unlock secret items.
- **New Kits:** about 16 (ids 62+): storm/lightning sea Kits, tide-pool critters, harbor animals. **Three rare weather/sea Kits are the island key: one can be caught early after Saltmarsh's story, the other two later.**
- **Music:** sea shanty (base), festival drum theme, calm night tune, Accord-front mystery theme, more intense gym/boss battle music.

## Decisions after the Saltmarsh questions (2026-09-29 evening)

- **Build all of Saltmarsh, with a lot of thought in every design** (Kits, buildings, interiors). Work in stages, commit each.
- **Types switch to the standard 18 names.** Mapping: Plain→Normal, Blaze→Fire, Tide→Water, Leaf→Grass, Volt→Electric, Frost→Ice, Brawl→Fighting, Venom→Poison, Terra→Ground, Gale→Flying, Mind→Psychic, Swarm→Bug, Shade→Ghost, Lumen→Fairy, Metal→Steel, Wyrm→Dragon, plus **new Rock and Dark**. (User asked for "Add Dark, Lumen becomes Fairy"; Rock is added too so it is truly the standard 18.) ORIGINALITY.md must be updated: type names are now common English words used by the standard chart; everything else stays original.
- **Legendaries: 2 instead of 3 rare Kits** (the island key). #1 (catch early, after Saltmarsh's story): **tidal oracle, a many-eyed sea serpent with a crown of floating eyes, Water/Dragon.** #2 (caught later): **storm-crowned heron, Psychic/Water.** Both hand-designed with a lot of thought.
- **Removed:** the COLOR option in the Kit EDIT menu (no more recolouring your own Kit).
- **Shiny Kits ("Prism") are rare: 1 in 2048.** Hand-picked alternate colours per Kit (not an automatic hue shift). Encounter effects: sparkle burst on entry, a special jingle, star mark in menus and battle, an overworld glint on the grass before the fight.

## Level cap (added 2026-09-29)

Kits cannot level past the ace level of the next Warden you have not beaten. `PK.GYM_LEADERS` (trainer ids in order) and `PK.GYM_CAPS` (cap after n leaders are beaten) live in `src/systems/stats.js`; `addExp` stops at the cap, battles and Level candies say so. Current: `[14, 22, 100]` = Harrow's ace is 14, the Saltmarsh showman (`sm_showman`, not built yet) must have his ace at **Lv 22**. **When each new gym is built, add its leader id to GYM_LEADERS and set the cap to his ace level, plus the following entry.** Debug menu (`?debug=1`) has "All Kits at cap" (gives every missing Kit at the current cap).

## Next up

1. **Next town (gym 2).** Ask the user ~15 multiple-choice questions about it, then ~many about its gym, then build it (new area file `src/data/v2/<town>.js`, add it to `index.html` + `tools/load.mjs` picks scripts up from index.html automatically; add a `ROOTS`/edge link in `townmap.js` so it shows on the region map; keep names original). Keep the v1 town names (v1 order was Pinecrest, Quarryton, Voltmere, Saltmarsh, Dunespire, Mirage City, Rimeholt, Shadefall) but rebuild each unique. Likely next per the story: something coastal ("by the sea") reached from the far side of Pinecrest via the cable car's repaired line (`pc_cable` script currently says the far-side line is under repair; unlock it when the next town exists). Gym 2's reward should keep the gates chain going (v1 gates: Machete, Pickaxe (done in Pinecrest), Trail Bike, Wayfinder, Raft, Rally Bell...).
2. **Story threads to keep advancing:** the Ashen Accord wants both tablet halves (Aryan holds one: item `tablethalf`); Grandpa co-founded the Accord, hid the halves and vanished (his helmet + note are in the bag: keep the halves APART); the sibling is a double agent (bittersweet ending planned, Elder now trusts them); Dad is secretly the 8th Warden (reveal before the League); the third starter (loose in the hills) can show up; the crystal/fossil "sleeping thing under the mountain" idea is set up but unresolved (Runemaw/Amberjaw fossils, shrine keeper hints).
3. Keep designing Kits for each new area (target 151; ~103 to go, many need new types Volt/Venom/Mind) and consider hand-authored learnsets (stats/learnsets are still generated from the name).
4. Title screen, character creator and menus are still drawn in the centered 240px stage; making them wide like the overworld is optional polish.
5. `tools/balance.mjs` shows `elder_morrow` near 0% win rate at the suggested level and Warden Harrow ~60%, cinder fights 64-100% — a rebalance pass would help.
6. Small polish ideas the user liked: more stalls that sell food, picture-icon signs on every building, extra caves.

**Suggested first message for the next chat:** "Continue PixelKits v2 (repo PixelKits-v2, folder C:\Users\aryan\OneDrive\Desktop\pixel_kits_v2). Read HANDOFF.md first, especially START HERE. Then ask me the questions for the next town and its gym, and build it. Keep it fast and cheap, keep everything original, walk-test every puzzle for real, and commit + push everything."

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
