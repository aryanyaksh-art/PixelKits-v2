// PixelKits type system: the standard 18 types and their effectiveness chart.
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  var TYPES = {
    Normal: { color: '#a8a492' },
    Fire: { color: '#ee6a2c' },
    Water: { color: '#3c8ce0' },
    Grass: { color: '#4cb04a' },
    Electric: { color: '#f2c428' },
    Ice: { color: '#7cd0ea' },
    Fighting: { color: '#c0443a' },
    Poison: { color: '#9c52b8' },
    Ground: { color: '#c8a45a' },
    Flying: { color: '#8ab4e8' },
    Psychic: { color: '#ec5f9c' },
    Bug: { color: '#9aba2c' },
    Rock: { color: '#a08a4c' },
    Ghost: { color: '#5a4a78' },
    Dragon: { color: '#5a5ad8' },
    Dark: { color: '#4c3e4e' },
    Steel: { color: '#9aa4b4' },
    Fairy: { color: '#f4b0e0' }
  };
  // attacker -> { defender: multiplier }
  var CHART = {
    Normal: { Rock: 0.5, Steel: 0.5, Ghost: 0 },
    Fire: { Grass: 2, Ice: 2, Bug: 2, Steel: 2, Fire: 0.5, Water: 0.5, Rock: 0.5, Dragon: 0.5 },
    Water: { Fire: 2, Ground: 2, Rock: 2, Water: 0.5, Grass: 0.5, Dragon: 0.5 },
    Electric: { Water: 2, Flying: 2, Electric: 0.5, Grass: 0.5, Dragon: 0.5, Ground: 0 },
    Grass: { Water: 2, Ground: 2, Rock: 2, Fire: 0.5, Grass: 0.5, Poison: 0.5, Flying: 0.5, Bug: 0.5, Dragon: 0.5, Steel: 0.5 },
    Ice: { Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Fire: 0.5, Water: 0.5, Ice: 0.5, Steel: 0.5 },
    Fighting: { Normal: 2, Ice: 2, Rock: 2, Dark: 2, Steel: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Fairy: 0.5, Ghost: 0 },
    Poison: { Grass: 2, Fairy: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0 },
    Ground: { Fire: 2, Electric: 2, Poison: 2, Rock: 2, Steel: 2, Grass: 0.5, Bug: 0.5, Flying: 0 },
    Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
    Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Steel: 0.5, Dark: 0 },
    Bug: { Grass: 2, Psychic: 2, Dark: 2, Fire: 0.5, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Ghost: 0.5, Steel: 0.5, Fairy: 0.5 },
    Rock: { Fire: 2, Ice: 2, Flying: 2, Bug: 2, Fighting: 0.5, Ground: 0.5, Steel: 0.5 },
    Ghost: { Psychic: 2, Ghost: 2, Dark: 0.5, Normal: 0 },
    Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
    Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 },
    Steel: { Ice: 2, Rock: 2, Fairy: 2, Fire: 0.5, Water: 0.5, Electric: 0.5, Steel: 0.5 },
    Fairy: { Fighting: 2, Dragon: 2, Dark: 2, Fire: 0.5, Poison: 0.5, Steel: 0.5 }
  };
  PK.TYPES = TYPES;
  PK.TYPE_LIST = Object.keys(TYPES);
  PK.typeEff = function (atk, defTypes) {
    var m = 1;
    for (var i = 0; i < defTypes.length; i++) {
      var r = CHART[atk] && CHART[atk][defTypes[i]];
      if (r != null) m *= r;
    }
    return m;
  };
  // Status immunities by type
  PK.STATUS_IMMUNE = { brn: ['Fire'], psn: ['Poison', 'Steel'], par: ['Electric'], frz: ['Ice'] };
})();
