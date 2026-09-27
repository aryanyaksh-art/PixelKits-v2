// Willow Trail (placeholder until the full route is built)
(function () {
  'use strict';
  var PK = window.PK = window.PK || {};
  PK.defMap('willow_trail', {
    name: 'Willow Trail', theme: 'vale', music: 'route', region: 'Verdant Vale',
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TTTTTTTT~~~TTTTTTTTTTTTTTRRRRTTTTTTTTTTT',
      'TTTTTTTT~~~TTTTTTTTTTTTT..::..TTTTTTTTTT',
      'TTTTTTTT~~~TTTTTTTTTTTTT..::..TTTTTTTTTT',
      'TTTTTTTT~~~TTTTTTTTTTTTTT.::.TTTTTTTTTTT',
      'TTTTTTTT~~~TTTTTTTTTTTTTT.::.TTTTTTTTTTT',
      'TTTTTTTT~~~TTTTTTTTTTTTTTTT::TTTTTTTTTTT',
      'TTTTTTTT~~~TTTTTTTTTTTTTTTT::TTTTTTTTTTT'
    ],
    edges: { s: { to: 'brookhollow', off: 0 } }
  });
})();
