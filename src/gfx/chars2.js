// Saltmarsh characters: festival dancers and drummers, harbor folk, the gym showman, and the charming Elder.
// Loaded after chars.js; adds palettes to PK.CHAR_PALS (same format: head, hat, dress, then colour letters).
(function () {
  'use strict';
  var P = window.PK.CHAR_PALS;
  Object.assign(P, {
    // Festival performers
    dancer1: { head: 'long', dress: 1, h: '#2a1a14', H: '#140a08', s: '#c68a5a', S: '#9a6438', c: '#e83a5a', C: '#a02440' },
    dancer2: { head: 'braids', dress: 1, h: '#c84030', H: '#8a2418', s: '#f0c8a0', S: '#c89870', c: '#2ab8a8', C: '#178070' },
    dancer3: { head: 'short', h: '#141418', H: '#000000', s: '#8a5a38', S: '#6a4024', c: '#f0b030', C: '#b88418', a: '#e83a5a', p: '#fcf8ec', P: '#c8c0b0', f: '#3a2a1a', k: '#e83a5a' },
    drummer: { head: 'bald', hat: 'beanie', b: '#3a8ae0', B: '#265a9a', h: '#3a2a1a', s: '#9a6440', S: '#744626', c: '#fcf8ec', C: '#c8c0b0', a: '#3a8ae0', p: '#243a5c', P: '#16243c', f: '#3a2a1a', k: '#f8d040' },
    fiddler: { head: 'curly', h: '#e8a040', H: '#b87020', s: '#f0c090', S: '#d09868', c: '#4ab890', C: '#2a7a5e', a: '#6a4a2a', p: '#4a4038', P: '#302822', f: '#2a2220', k: '#4ab890' },
    singer: { head: 'ponytail', dress: 1, h: '#141418', H: '#000000', s: '#c68a5a', S: '#9a6438', c: '#e8c050', C: '#a88424' },
    marshal: { head: 'short', hat: 'cap', b: '#243a5c', B: '#16243c', w: '#f8d040', h: '#e0e0e0', H: '#a8a8a8', s: '#e0a878', S: '#b88050', c: '#c8323a', C: '#8a1a26', a: '#f8d040', p: '#243a5c', P: '#16243c', f: '#f8f4ea', k: '#f8d040' },
    // Harbor folk
    harbormaster: { head: 'short', hat: 'cap', b: '#243a5c', B: '#16243c', w: '#f8f4ea', h: '#c8c8c8', H: '#9a9a9a', s: '#e0a878', S: '#b88050', c: '#243a5c', C: '#16243c', a: '#e8c050', p: '#3a4a64', P: '#24304a', f: '#2a2a2a', k: '#e8c050' },
    organizer: { head: 'bun', dress: 1, h: '#5a2a5a', H: '#3a1a3a', s: '#f0c8a0', S: '#c89870', c: '#8a4ac0', C: '#5e2e8a' },
    journalist: { head: 'swept', hat: 'cap', b: '#c8a060', B: '#98783a', w: '#f4f4f4', h: '#4a2a1a', H: '#2a1408', s: '#f0c090', S: '#d09868', c: '#c8a060', C: '#98783a', a: '#3a3a44', p: '#3a4a64', P: '#24304a', f: '#3a2a1a', k: '#e8d8a0' },
    curator: { head: 'long', dress: 1, h: '#3a2a1a', H: '#1a1208', s: '#e8b888', S: '#c08860', c: '#3a9ab8', C: '#22687e' },
    keeper: { head: 'bald', hat: 'beanie', b: '#243a5c', B: '#16243c', h: '#e0e0e0', H: '#a8a8a8', s: '#d8a070', S: '#a87848', c: '#8a2a2a', C: '#5e1a1a', a: '#3a2a1a', p: '#4a4a5a', P: '#2e2e3c', f: '#3a2a1a', k: '#8a2a2a' },
    showman: { head: 'swept', hat: 'cap', b: '#b83a5a', B: '#7a2238', w: '#f8d040', h: '#1a1a24', H: '#000000', s: '#f0c090', S: '#d09868', c: '#c8323a', C: '#8a1a26', a: '#f8d040', p: '#fcf8ec', P: '#c8c0b0', f: '#e8c050', k: '#f8d040' },
    elder2: { head: 'short', h: '#d8d8e4', H: '#a8a8b8', s: '#e8c8a8', S: '#c09878', c: '#f4f0e4', C: '#c8c0a8', a: '#e8c050', p: '#243a5c', P: '#16243c', f: '#f4f0e4', k: '#e8c050' },
    cook: { head: 'short', hat: 'cap', b: '#fcfcfc', B: '#c8c8d0', w: '#fcfcfc', h: '#6a4020', H: '#44260e', s: '#e0a878', S: '#b88050', c: '#fcfcfc', C: '#c8c8d0', a: '#e8483a', p: '#4a5a8a', P: '#303c60', f: '#3a2a1a', k: '#fcfcfc' },
    dockhand: { head: 'short', hat: 'cap', b: '#4a6a8a', B: '#2e4a66', w: '#f4f4f4', h: '#3a2418', H: '#241208', s: '#c68a5a', S: '#9a6438', c: '#8a9098', C: '#5e646c', a: '#6a4a2a', p: '#3a4a64', P: '#24304a', f: '#2a2a2a', k: '#c8a850' },
    tavernkeep: { head: 'curly', h: '#8a3a2a', H: '#5a2418', s: '#e0a878', S: '#b88050', c: '#f4f0e4', C: '#c8c0b0', a: '#8a5a30', p: '#5a4a3a', P: '#3a2e24', f: '#3a2a1a', k: '#f4f0e4' },
    seamstress: { head: 'ponytail', dress: 1, h: '#c84030', H: '#8a2418', s: '#f0c8a0', S: '#c89870', c: '#e83a8a', C: '#a8245e' },
    weatherman: { head: 'short', h: '#4a3a2a', H: '#2a2018', s: '#e0a878', S: '#b88050', c: '#dfe8f0', C: '#a8b4c4', a: '#e8483a', p: '#3a4a64', P: '#24304a', f: '#3a3a44', k: '#8ac8f0' },
    pirate: { head: 'short', hat: 'beanie', b: '#2a2a3a', B: '#16161e', h: '#141418', H: '#000000', s: '#c68a5a', S: '#9a6438', c: '#c8323a', C: '#8a1a26', a: '#e8c050', p: '#3a3a4a', P: '#24242e', f: '#2a2a2a', k: '#e8c050' },
    crabber: { head: 'braids', hat: 'beanie', b: '#e8a030', B: '#b0741a', h: '#6a4020', H: '#44260e', s: '#e0a878', S: '#b88050', c: '#3a78b8', C: '#264e80', a: '#4a3a2a', p: '#3a4a6a', P: '#24304a', f: '#2a2a2a', k: '#e8a030' }
  });
})();
