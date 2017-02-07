const assert = require('assert');
class Module {
    constructor(options) {
        assert.ok(options.parent, 'A parent is required for Module.');
        this.parent = options.parent;
        assert.ok(options.level, 'A level is required for Module.');
        this.level = options.level;
        assert.ok(options.player, 'A player is required for Module.');
        this.player = options.player;
    }

}

module.exports = Module;
