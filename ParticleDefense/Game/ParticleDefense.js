/// <reference path="~/util/Display.js" />
/// <reference path="~/Game/Level.js" />
/// <reference path="~/js/angular.min.js" />
function ParticleDefense() { }

ParticleDefense.Views = {
    MainMenu: "views/mainmenu.html",
    GameUi: "views/gameui.html"
};
ParticleDefense.View = ParticleDefense.Views.MainMenu;
ParticleDefense.UiScope = null;
ParticleDefense.Level = null;
ParticleDefense.TimeoutId = null;
ParticleDefense.TimeoutIdUi = null;

ParticleDefense.update = function () {
    ParticleDefense.TimeoutId = setTimeout('ParticleDefense.update();', 1000 / Display.Settings.FpsTarget);

    ParticleDefense.Level.update();

    Display.update();
    ParticleDefense.draw();
};
ParticleDefense.updateUi = function () {
    ParticleDefense.TimeoutIdUi = setTimeout('ParticleDefense.updateUi();', 250);
    ParticleDefense.UiScope.$apply();
};

ParticleDefense.stop = function () {
    clearTimeout(ParticleDefense.TimeoutId);
    clearTimeout(ParticleDefense.TimeoutIdUi);
};
ParticleDefense.draw = function () {
    ParticleDefense.Level.draw();
    Display.setDrawCanvas('Main');
    Display.clear();
    Display.drawImage(ParticleDefense.Level.canvas, 0, 0);
};

ParticleDefense.startLevel = function (level, canvas) {
    ParticleDefense.stop();
    ParticleDefense.Level = level();

    Display.initialize(canvas);
    Display.drawOffsetX = Display.drawOffsetXT = -ParticleDefense.Level.Map.PixelWidth / 2;
    Display.drawOffsetY = Display.drawOffsetYT = -ParticleDefense.Level.Map.PixelHeight / 2;

    ParticleDefense.View = ParticleDefense.Views.GameUi;
    ParticleDefense.update();
};
