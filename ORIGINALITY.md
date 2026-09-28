# Originality

PixelKits v2 borrows the *genre*, not anybody's *expression*. Game mechanics and genre conventions (turn-based battles, elemental matchups, collecting creatures, towns connected by routes, gyms) are ideas that many games share. Everything you actually see, hear and read in the game was created for this project.

## What was made from scratch

- **Creatures** — every Kit has an original name, hand-drawn design, types, stats and KitLog entry. Designs are drawn per-species in code from hand-authored pixel data (`src/gfx/kitDesigns.js`, `src/data/kits.js`), not generated from a shared template. No existing creature designs were traced or referenced.
- **Art** — tiles, buildings, furniture, characters, UI frames and the font are all drawn procedurally or from hand-authored pixel data in this repository. No sprites, tiles, fonts or UI were ripped from any game.
- **Music and sound** — every track is an original composition written in MML (`src/data/music.js`) and played by the game's own synthesizer. Sound effects are synthesized at runtime.
- **World and story** — the continent of Lumora, its towns (Brookhollow, Willow Trail, Pinecrest and more to come), characters and plot (the flood, the sibling's double-agent arc, the Ashen Accord) are original.
- **Systems vocabulary** — the game uses its own terms: *Kits*, *Keepers*, *Kit Capsules*, *KitLog*, *Kit Clinic*, *Crests*, *Wardens*, *Skill Discs*, *Tonics*, *Prism* variants, *Temperaments*, *Training Points*.
- **Type system** — 16 original types with their own effectiveness chart (`src/data/types.js`).

## How names were checked

Every Kit, move, item, ability, temperament, place and character name is checked automatically against public lists of existing franchise names (species, moves, items, locations, abilities) with `tools/namecheck.mjs`. Exact matches are rejected, and names within two letters of an existing creature name are renamed. Character names are also reviewed by hand against other well-known franchises. The reference lists are used only for this check and are not part of the repository.

## Design choices that avoid known patents

Capturing a Kit is a turn-based menu action inside a battle. There is no aiming or throwing of capture devices at creatures in the overworld, and there are no rideable creatures.

## Note

This document describes the care taken to keep PixelKits original. It is not legal advice.
