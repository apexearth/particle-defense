/// <reference path="~/util/Display.js" />
/// <reference path="~/Game/Level.js" />
/// <reference path="~/js/angular.min.js" />
function ParticleDefense() { }

ParticleDefense.Second = 1000 / Display.Settings.FpsTarget;
ParticleDefense.Views = {
    MainMenu: "views/mainmenu.html",
    GameUi: "views/gameui.html",
    GameOver: "views/gameover.html"
};
ParticleDefense.View = ParticleDefense.Views.MainMenu;
ParticleDefense.UiScope = null;
ParticleDefense.IndexScope = null;
ParticleDefense.Level = null;
ParticleDefense.TimeoutId = null;
ParticleDefense.TimeoutIdUi = null;

ParticleDefense.update = function () {
    if (ParticleDefense.View != ParticleDefense.Views.GameUi) return;
    setTimeout('ParticleDefense.update();', ParticleDefense.Second);

    ParticleDefense.Level.update();

    Display.update();
    ParticleDefense.draw();
};
ParticleDefense.updateUi = function () {
    if (ParticleDefense.View != ParticleDefense.Views.GameUi) return;
    setTimeout('ParticleDefense.updateUi();', 1000);
    ParticleDefense.UiScope.$apply();
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
    Display.drawOffsetX = Display.drawOffsetXT = -ParticleDefense.Level.Map.PixelWidth / 2;
    Display.drawOffsetY = Display.drawOffsetYT = -ParticleDefense.Level.Map.PixelHeight / 2;

    ParticleDefense.View = ParticleDefense.Views.GameUi;
    ParticleDefense.update();
};
ParticleDefense.stop = function () {
    ParticleDefense.View = ParticleDefense.Views.GameOver;
    ParticleDefense.IndexScope.$apply();
};

(function () {
    if (localStorage.User != null) {
        localStorage.User = {
            LifetimeScore: 0
        }
    }
})();
ParticleDefense.User = localStorage.User