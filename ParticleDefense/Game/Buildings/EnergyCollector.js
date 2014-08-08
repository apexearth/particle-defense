/// <reference path="~/Game/Level.js" />
/// <reference path="~/Game/Buildings/Building.js" />
/// <reference path="~/Game/Player.js" />
/// <reference path="~/Game/Level.js" />
function EnergyCollector(level, player, blockX, blockY) {
    Building.call(this, level, player, blockX, blockY);
    this.Health = 15;
    this.update = function () {
        Building.prototype.update.call(this);
        this.Player.Resources.Energy += .05;
    };
    this.draw = function (context) {
        context.drawImage(EnergyCollector.canvas, this.TopLeft.X, this.TopLeft.Y);
    };
}
Building.List.EnergyCollector = EnergyCollector;
EnergyCollector.Cost = {
    Energy: 100,
    Metal: 50
};

EnergyCollector.canvas = document.createElement("canvas");
(function () {
    EnergyCollector.canvas.width = Level.Settings.BlockSize;
    EnergyCollector.canvas.height = Level.Settings.BlockSize;
    var context = EnergyCollector.canvas.getContext("2d");
    context.fillStyle = '#ccd0ff';
    context.fillRect(0, 0, Level.Settings.BlockSize, Level.Settings.BlockSize);
    context.fillStyle = '#558855';
    context.fillRect(5, 5, Level.Settings.BlockSize - 10, Level.Settings.BlockSize - 10);
})();
