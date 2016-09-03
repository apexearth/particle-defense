var CommandQueue = require('./CommandQueue');
var Settings = require('./Settings');

var game = {
    running: false,
    frames: 0,
    second: 1000 / Settings.second,
    level: null,
    timeoutId: null,

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
    },
    levels: require('./levels')
};

Object.defineProperties(game, {
    player: {
        get: function () {
            return this.level.player;
        }.bind(game)
    }
});

module.exports = game;


// ----------------------------
// TODO: Move me somewhere else
// ----------------------------
game.Views = {
    MainMenu: 'src/views/main-menu.html',
    GameUi: 'src/views/game-ui.html',
    GameOver: 'src/views/game-over.html'
};
game.view = game.Views.MainMenu;
game.uiScope = null;
game.updateUi = function () {
    if (game.view != game.Views.GameUi) return;
    setTimeout(function () {
        game.updateUi();
    }, 100);
    game.uiScope.$apply();
};
game.indexScope = null;
game.timeoutIdUI = null;
// ----------------------------
