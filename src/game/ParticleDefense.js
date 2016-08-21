var CommandQueue = require('./CommandQueue')
var Settings = require('./Settings')

var ParticleDefense = module.exports = {};

ParticleDefense.second = 1000 / Settings.second;
ParticleDefense.Views       = {
    MainMenu: 'src/views/main-menu.html',
    GameUi: 'src/views/game-ui.html',
    GameOver: 'src/views/game-over.html'
};
ParticleDefense.view = ParticleDefense.Views.MainMenu;
ParticleDefense.uiScope = null;
ParticleDefense.indexScope = null;
ParticleDefense.level = null;
ParticleDefense.timeoutId = null;
ParticleDefense.timeoutIdUI = null;

ParticleDefense.update          = function () {
    if (ParticleDefense.view != ParticleDefense.Views.GameUi) return;
    setTimeout(function () {
        ParticleDefense.update();
    }, ParticleDefense.second);
    
    ParticleDefense.level.update();
    ParticleDefense.processCommands();
};
ParticleDefense.updateUi        = function () {
    if (ParticleDefense.view != ParticleDefense.Views.GameUi) return;
    setTimeout(function () {
        ParticleDefense.updateUi()
    }, 100);
    ParticleDefense.uiScope.$apply();
};
ParticleDefense.processCommands = function () {
    var i = CommandQueue.length;
    while (i--) {
        if (CommandQueue[i] === CommandQueue.StopGame) {
            ParticleDefense.stop();
            CommandQueue.splice(i, 1);
        }
    }
};

ParticleDefense.startLevel = function (level) {
    ParticleDefense.level = level();
    ParticleDefense.view = ParticleDefense.Views.GameUi;
    ParticleDefense.update();
};
ParticleDefense.stop       = function () {
    ParticleDefense.view = ParticleDefense.Views.GameOver;
    if (ParticleDefense.indexScope != null) ParticleDefense.indexScope.$apply();
};


