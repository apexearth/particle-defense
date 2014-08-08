/// <reference path="~/Game/Level.js" />
/// <reference path="~/Game/Buildings/Building.js" />
/// <reference path="~/Game/Player.js" />
/// <reference path="~/Game/Level.js" />
function AmmoFab(level, player, blockX, blockY) {
    Building.call(this, level, player, blockX, blockY);
    this.Health = 15;
    this.update = function () {
        Building.prototype.update.call(this);
        this.Player.Resources.Ammo += .2;
    };
    this.draw = function (context) {
        context.drawImage(AmmoFab.canvas, this.TopLeft.X, this.TopLeft.Y);
    };
}
Building.List.AmmoFab = AmmoFab;
AmmoFab.Cost = {
    Energy: 150,
    Metal: 75
};

AmmoFab.canvas = document.createElement("canvas");
(function () {
    AmmoFab.canvas.width = Level.Settings.BlockSize;
    AmmoFab.canvas.height = Level.Settings.BlockSize;
    var context = AmmoFab.canvas.getContext("2d");
    context.fillStyle = '#ffcccc';
    context.fillRect(0, 0, Level.Settings.BlockSize, Level.Settings.BlockSize);
    context.fillStyle = '#558855';
    context.fillRect(5, 5, Level.Settings.BlockSize - 10, Level.Settings.BlockSize - 10);
})();
