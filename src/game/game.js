﻿var CommandQueue = require('./CommandQueue');
var Settings = require('./Settings');

var game = {
    initialize: function () {
        this.frames = 0;
        this.level = null;
        this.unqueueUpdate();
    },
    frames: 0,
    second: 1000 / Settings.second,
    timeoutId: null,
    level: null,

    inputs: require('./inputs'),

    levels: require('./levels'),
    buildings: require('./buildings'),

    queueUpdate: function () {
        this.timeoutId = setTimeout(function () {
            this.update();
        }.bind(this), this.second);
    },
    unqueueUpdate: function () {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.timeoutId = null;
    },
    update: function () {
        this.frames++;
        this.level.update();
        CommandQueue.process(this);
    },
    start: function (levelFn) {
        if (this.running) throw new Error('Game is already running.');
        this.frames = 0;
        this.startLevel(levelFn);
        this.queueUpdate();
    },
    startLevel: function (levelFn) {
        this.level = levelFn();
    },
    stop: function () {
        this.unqueueUpdate();
    },
    fastForward: function (iterations) {
        while (iterations--) {
            this.update();
        }
    },
    startBuildingPlacement: function () {
        return this.level.startBuildingPlacement.apply(this.level, arguments);
    },
    finishBuildingPlacement: function () {
        return this.level.finishBuildingPlacement.apply(this.level, arguments);
    },
    cancelBuildingPlacement: function () {
        return this.level.cancelBuildingPlacement.apply(this.level, arguments);
    },
};

Object.defineProperties(game, {
    running: {
        get: function () {
            return this.timeoutId !== null;
        }.bind(game)
    },
    player: {
        get: function () {
            return this.level.player;
        }.bind(game)
    }
});

module.exports = game;

