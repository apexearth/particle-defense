var CommandQueue = require('./CommandQueue');
var Settings = require('./Settings');

var game = {
    initialize: function () {
        this.running = false;
        this.frames = 0;
        if (this.timeoutId)
            clearTimeout(this.timeoutId);
    },
    running: false,
    frames: 0,
    second: 1000 / Settings.second,
    timeoutId: null,
    level: null,

    levels: require('./levels'),
    buildings: require('./buildings'),

    queueUpdate: function () {
        setTimeout(this.update.bind(this), this.second);
    },
    update: function () {
        if (!this.running) return;
        this.queueUpdate();
        this.frames++;
        this.level.update();
        CommandQueue.process(this);
    },
    start: function (levelFn) {
        if (this.running) throw new Error('Game is already running.');
        this.frames = 0;
        this.running = true;
        this.level = levelFn();
        this.queueUpdate();
    },
    stop: function () {
        this.running = false;
    }
};

Object.defineProperties(game, {
    player: {
        get: function () {
            return this.level.player;
        }.bind(game)
    }
});

module.exports = game;

