define("game/ParticleDefense", ["util/Display", "game/CommandQueue"], function (Display, CommandQueue) {
    function ParticleDefense() {
    }

    ParticleDefense.Second = 1000 / Display.Settings.FpsTarget;
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

        Display.update();
        ParticleDefense.draw();
    };
    ParticleDefense.updateUi = function () {
        if (ParticleDefense.View != ParticleDefense.Views.GameUi) return;
        setTimeout(function () {
            ParticleDefense.updateUi()
        }, 1000);
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
    ParticleDefense.draw = function () {
        ParticleDefense.Level.draw();
        Display.setDrawCanvas('Main');
        Display.clear();
        Display.drawImage(ParticleDefense.Level.canvas, 0, 0);
    };

    ParticleDefense.startLevel = function (level, canvas) {
        ParticleDefense.Level = level();

        Display.initialize(canvas);
        Display.drawOffsetX = Display.drawOffsetXT = -ParticleDefense.Level.Width / 2;
        Display.drawOffsetY = Display.drawOffsetYT = -ParticleDefense.Level.Height / 2;

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