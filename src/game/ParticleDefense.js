define("game/ParticleDefense", ["./CommandQueue", "./Settings"], function (CommandQueue, Settings) {
    function ParticleDefense() {
    }

    ParticleDefense.Second = 1000 / Settings.Second;
    ParticleDefense.Views = {
        MainMenu: "views/main-menu.html",
        GameUi: "views/game-ui.html",
        GameOver: "views/game-over.html"
    };
    ParticleDefense.View = ParticleDefense.Views.MainMenu;
    ParticleDefense.UiScope = null;
    ParticleDefense.IndexScope = null;
    ParticleDefense.Level = null;
    ParticleDefense.TimeoutId = null;
    ParticleDefense.TimeoutIdUi = null;

    ParticleDefense.update = function () {
        if (ParticleDefense.View != ParticleDefense.Views.GameUi) return;
        setTimeout(function () {
            ParticleDefense.update();
        }, ParticleDefense.Second);

        ParticleDefense.Level.update();
        ParticleDefense.processCommands();
    };
    ParticleDefense.updateUi = function () {
        if (ParticleDefense.View != ParticleDefense.Views.GameUi) return;
        setTimeout(function () {
            ParticleDefense.updateUi()
        }, 100);
        ParticleDefense.UiScope.$apply();
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
        ParticleDefense.Level = level();

        ParticleDefense.View = ParticleDefense.Views.GameUi;
        ParticleDefense.update();
    };
    ParticleDefense.stop = function () {
        ParticleDefense.View = ParticleDefense.Views.GameOver;
        if (ParticleDefense.IndexScope != null) ParticleDefense.IndexScope.$apply();
    };

    (function () {
        if (localStorage.User != null) {
            localStorage.User = {
                LifetimeScore: 0
            }
        }
    })();
    ParticleDefense.User = localStorage.User;

    return ParticleDefense;
});