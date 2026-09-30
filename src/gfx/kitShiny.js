// Prism ("shiny") colours: a hand-picked alternate palette for every Kit design. Only the materials listed here change
// (everything else keeps its normal colour). A design with no entry falls back to an automatic hue shift.
// Values follow the design palettes: '#rrggbb' gets a shaded ramp, '=#rrggbb' is used exactly.
// Themes: fire line burns blue, leafy Kits go autumn gold, sea Kits go coral and pink, night Kits go dawn pink, and so on.
(function () {
  'use strict';
  var BLUEFLAME = ['#12307a', '#2a6ad8', '#5ab4ff', '#a8e0ff', '#f0fcff'];
  PK.SHINY = {
    // Fire line: blue flames
    emberlet: { body: '#2f86d8', belly: '#d0f0ff', shell: '#e6f0ff', speck: '#a8bcd8', horn: '#d8ecff', iris: '#ff7ac0', flame: BLUEFLAME },
    shardrake: { body: '#2a6ccc', belly: '#c4e8ff', shell: '#e2eeff', speck: '#a4b8d4', wing: '#5ad0f0', horn: '#d8ecff', iris: '#ff7ac0', flame: BLUEFLAME },
    halorax: { body: '#1e3a9a', belly: '#9ac8f8', gold: '#e8e8f8', halo: '#a8f0ff', wing: '#3ab0f0', horn: '#dcecff', iris: '#ff80d0', flame: BLUEFLAME },
    // Sea starter line: coral and gold
    conchi: { body: '#e05a8a', belly: '#ffc6dc', shell: '#c8f0e0', shelld: '#78b8a0', shellin: '#ffd870', glow: '=#ffb0e0', iris: '#2a2a6a' },
    glyphsquid: { body: '#c04080', belly: '#f4a0c8', fin: '#f0b040', glow: '=#ffd870', iris: '#48d0e8', sucker: '#ffd0e4' },
    galleoth: { body: '#8a3a5a', under: '#88d0e8', glow: '=#ffb04a', wood: '#4a5a6a', woodd: '#2e3a48', cloth: '#d8e8f0', metal: '#d0a860', lamp: '=#8ff0ff' },
    // Leaf starter line: autumn gold
    mossip: { moss: '#e0a040', mossd: '#a86a24', stem: '#8a5a2a', petal: '#8ad8f0', pollen: '#fff0a0' },
    pebblom: { stone: '#8a94a8', moss: '#e0a040', mossd: '#a86a24', petal: '#8ad0f0', leaf: '#d88a30', iris: '=#ffd070' },
    templith: { stone: '#7a86a0', stoned: '#565f78', moss: '#d89a38', vine: '#a86a24', wood: '#5a4a7a', leaf: '#e8b040', petal: '#8ad0f0', glow: '=#ffd870' },
    // Riverbank and meadow
    rushkin: { body: '#a0a0b8', belly: '#f0f0f8', ear: '#a8c8f0', cat: '#4a4a6a', stem: '#5aa0a0', seed: '#e8a0d8', iris: '#2a1a44' },
    bulrusher: { body: '#8a8aa8', belly: '#e8e8f4', ear: '#a0b8e8', reed: '#4a9aa0', reedd: '#2e6e78', cat: '#3a3a5a', iris: '#e05a9a' },
    kitefinch: { body: '#e8688a', belly: '#fff4ee', wing: '#60d0c8', ribbon: '#3a6ae0', beak: '#f0c040', iris: '#4a1a2a' },
    streamlark: { body: '#d8508a', belly: '#fff4ee', wing: '#3ac8c0', wing2: '#3a8ae0', ribbon: '#4a5ae8', beak: '#f0c040', iris: '#4a1a2a' },
    festivane: { body: '#a83a8a', belly: '#fff0f4', wing: '#3ad0c8', wing2: '#4a7ae8', wing3: '#f0d040', ribbon: '#3ab0e8', ribbon2: '#f08ac8', iris: '#3af0d8' },
    caddle: { case: '#8a9ab8', pebble: '#c8d4e8', pebble2: '#a89ab0', twig: '#5a6a8a', grub: '#f0c8e0' },
    stonesheath: { case: '#7a90a8', pebble: '#b8c8d8', pebble2: '#a08ab0', moss: '#c86ab0', twig: '#4a5a7a', glow: '=#ff9ad8' },
    caddira: { wing: '#c86ab0', wing2: '#8a3a86', vein: '#f0a8e0', body: '#6a5a8a', fluff: '#f0e0f4', pebble: '#b8b0d0', leg: '#4a3a66' },
    puffhop: { fur: '#f0a8c8', belly: '#fff0f4', puff: '#fff8fc', seed: '#a08a90', ear: '#a8c8f0', leaf: '#e0709a', iris: '#4a2a3a' },
    dandeloft: { fur: '#e898b8', belly: '#fff0f4', puff: '#fff8fc', seed: '#a08a90', stem: '#c8709a', leaf: '#e86a9a', ear: '#a8c8f0', iris: '#4a2a3a' },
    acornet: { shell: '#c8a040', cap: '#d8d0c0', capd: '#a09888' },
    oaknight: { shell: '#c89a30', plate: '#d8d8e0', plated: '#9a9aa8', metal: '#f0d890', twig: '#8a6a30', leaf: '#e8c040', glow: '=#ffffff' },
    skimble: { body: '#e0a878', stripe: '#f8e4cc', fin: '#c86a4a', water: '=#ffd8bf', iris: '#3a1a1a' },
    rapidfin: { body: '#c86a4a', plate: '#88a0a8', plated: '#5a7078', fin: '#a8402e', belly: '#f4e0d4', water: '=#ffd8bf', iris: '#3ac0f0' },
    // Night Kits go dawn pink
    nocturr: { body: '#e0a8c0', face: '#fff0f4', wing: '#b06888', talon: '#5a4a78', glow: '=#7af0ff', ear: '#8a4a68' },
    umbrowl: { body: '#c87098', face: '#f4d0e0', wing: '#8a4068', wingin: '#e8a0c0', talon: '#6a5a88', glow: '=#7af0ff', moon: '=#ffe0f0', ear: '#6a2a4a' },
    // Mountain and cave
    geodrop: { foot: '#a8e0d0', rock: '#7a8a88', rockd: '#4e5e5c', crys: '#40e0b0', crys2: '#b8ffe8', eye: '#1a3030' },
    amethell: { foot: '#a8d8c8', rock: '#6a7a78', rockd: '#3e4e4c', crys: '#30d0a0', crys2: '#c8ffec', glow: '=#e8fff8', eye: '=#e8fff8' },
    crampling: { fur: '#a8b8d0', tuft: '#f2f4fa', rock: '#6e7a8e', hoof: '#2a3a50', iris: '#3a6ac8' },
    ledgeram: { wool: '#c8d4e8', fur: '#8898b8', rock: '#626e82', rockd: '#3e4658', hoof: '#2a3244', iris: '#5a8ad8' },
    peakhorn: { fur: '#3a3a4a', beard: '#7a7a8a', rock: '#8a8898', rockd: '#585666', snow: '=#c8e0ff', hoof: '#1a1a24', iris: '#ff6a4a' },
    pebbeetle: { shell: '#c8a040', shelld: '#8a6a24', moss: '#40a0a0', body: '#2a3a4a', leg: '#1a2a38', iris: '#ff6a4a' },
    bouldrone: { shell: '#b89030', shelld: '#7a5a1a', crack: '#3a3020', body: '#22303e', leg: '#182430', horn: '#f0e0a0', glow: '=#40e0ff', moss: '#3a9090' },
    echip: { fur: '#e8e0f0', ear: '#a8c8f0', wing: '#b8a8d0' },
    flittermaw: { fur: '#dcd0ec', wing: '#b0a0cc', memb: '#8a70b0', ear: '#a0c0e8', iris: '#ff6a8a' },
    stalagwing: { fur: '#c8bcd8', wing: '#9888b8', memb: '#7a68a0', stone: '#b8b0a0', glow: '=#ff9a5a', ear: '#8a68b0' },
    palewick: { body: '#c8f0e0', belly: '#f0fffa', spot: '#88c8a8', glow: '=#ffc8f0', halo: '=#fff0fb' },
    gloamander: { body: '#e0a8c8', belly: '#f8e4f0', spot: '=#ffe07a', glow: '=#7af0d0', frill: '#b06888' },
    glowgrub: { body: '#f0c8d8', band: '=#7af0ff', head: '#b89ab0', iris: '#3a2a4a' },
    glimmoth: { wing: '#a85e82', wing2: '#d08aa8', spot: '=#7af0ff', fur: '#f4e0e8', ant: '#c8a0b0', iris: '#3a2a3a' },
    quartzel: { skin: '#c08a78', belly: '#f0e2d8', crys: '#ffd6e8', iris: '#3ab0e8' },
    facetail: { skin: '#a86a70', belly: '#ecd8d8', crys: '#ffb0d4', iris: '#40c0f0' },
    crystalisk: { skin: '#8a4a5e', belly: '#e8d0d8', crys: '#ff9ac8', crys2: '=#fff0f8', glow: '=#ffd0ec', iris: '#40e0ff' },
    amberjaw: { skin: '#4a6a8e', skind: '#2e4664', amber: '#40e0d0', bone: '#dce8f0', iris: '#40e0d0' },
    runemaw: { skin: '#3a506e', skind: '#243a54', amber: '#30d8c8', rune: '=#a8fff0', bone: '#d6e4f0', iris: '#a8fff0' },
    // Snow Kits go rose
    flurrip: { fur: '#f8e8f4', ice: '#f0a8d8', nose: '#a0c8f0', iris: '#c84a90' },
    avalop: { fur: '#f6e4f0', drift: '#dcc0d8', ice: '#f098cc', nose: '#90b8e8', iris: '#b03a80' },
    hailet: { fur: '#f8ecf4', feather: '#e0b8d4', beak: '#f0a060', iris: '#c04a90', ice: '=#ffe0f4' },
    glacrown: { fur: '#fcf2f8', feather: '#e0a8cc', cape: '#b8608a', beak: '#f0a060', iris: '#ff9ad8', ice: '#ff9ad8' },
    // Far Slope, Windswept Trail, Gullshore
    zipwick: { fur: '#e0a040', belly: '#fff0d0', coil: '#4ac0d8', spark: '#a8f0ff', snout: '#f0c898', iris: '#e83a3a' },
    arcwhisk: { fur: '#f4e4c8', shade: '#c8a878', stripe: '#8a4a2a', coil: '#4ac0d8', spark: '#a8f0ff', iris: '#e8503a' },
    windlet: { fur: '#f4d4e4', wing: '#e08ab0', beak: '#8ad0f0', iris: '#a82a68' },
    cliffswift: { fur: '#f0b8cc', belly: '#fff8fb', wing: '#c8508a', beak: '#8ad0f0', iris: '#2a8ad0' },
    squallcrest: { fur: '#a05a7a', belly: '#f4dce8', cloud: '#e8c8d8', bolt: '#7af0ff', wing: '#6a3050', beak: '#7af0ff', iris: '#7af0ff' },
    dunelet: { shell: '#8ab0a0', band: '#5a8a7a', skin: '#c8e0d0', horn: '#e8f4ec', iris: '#2a5a4a' },
    sandveil: { fur: '#a0b0c8', belly: '#e0e8f4', veil: '#f8e8a0', gem: '#40d8c0', gem2: '=#c8fff4', iris: '#2a9a88' },
    tumblet: { fur: '#a0b8c8', belly: '#e0ecf4', weed: '#7a9a8a', dark: '#3e4e5a', iris: '#2a3a4a' },
    sentrybrush: { fur: '#8aa0b0', belly: '#dce8f0', thorn: '#b04a6a', thorn2: '#e08aa8', dark: '#3a4650', flower: '#f0e060', iris: '#8a1a3a' },
    cranklet: { shell: '#e86a8a', belly: '#fff0e8', claw: '#40c8d0' },
    pincerlord: { shell: '#c03a70', plate: '#7a1a48', belly: '#fff0e0', claw: '#30c0d0', gold: '#e8e8f8', iris: '#40e8f0' },
    jellyp: { bell: '#a0e8d0', rim: '#40b898', tent: '#68d0b0', glow: '=#f0fff8', iris: '#1a6a4a' },
    stingbloom: { bell: '#f4d0b0', petal: '#f0708a', petal2: '#b03a6a', tent: '#e890a0', glow: '=#fff8ee', iris: '#8a1a3a' }
  };
})();
