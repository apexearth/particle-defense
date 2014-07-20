///<reference path="~/util/Display.js" />
///<reference path="~/Game/Level.js" />
function ParticleDefense() { }

ParticleDefense.Level = null;
ParticleDefense.update = function () {
    setTimeout('ParticleDefense.update();', 1000 / Display.Settings.FpsTarget);

    ParticleDefense.Level.update();

    ParticleDefense.draw();
};
ParticleDefense.draw = function () {
    ParticleDefense.Level.draw();
    Display.setDrawCanvas('Main');
    Display.clear();
    Display.drawImage(ParticleDefense.Level.canvas, 0, 0);
};

ParticleDefense.initialize = function (canvas) {
    Display.initialize(canvas);
    ParticleDefense.Level = Level.create();

    Display.drawOffsetX = Display.drawOffsetXT = -ParticleDefense.Level.Map.PixelWidth / 2;
    Display.drawOffsetY = Display.drawOffsetYT = -ParticleDefense.Level.Map.PixelHeight / 2;

    ParticleDefense.update();
};