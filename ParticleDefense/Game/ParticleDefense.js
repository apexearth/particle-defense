///<reference path="~/util/Display.js" />
///<reference path="~/Game/Level.js" />
function ParticleDefense() { }
ParticleDefense.View = "views/mainmenu.html";

ParticleDefense.Level = null;
ParticleDefense.TimeoutId = null;

ParticleDefense.update = function () {
    ParticleDefense.TimeoutId = setTimeout('ParticleDefense.update();', 1000 / Display.Settings.FpsTarget);

    ParticleDefense.Level.update();

    Display.update();
    ParticleDefense.draw();
};
ParticleDefense.stop = function () {
    clearTimeout(ParticleDefense.TimeoutId);
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

    ParticleDefense.update();
};

