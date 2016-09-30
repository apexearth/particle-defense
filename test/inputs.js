var inputs = require('../src/game/inputs');
inputs.mapping.requireUpdates = true; // HACK: Automatic updates in the mapping cause problems when setting custom values during testing.
module.exports = inputs;