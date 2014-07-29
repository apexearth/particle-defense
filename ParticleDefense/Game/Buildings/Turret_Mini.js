/// <reference path="~/Game/Level.js" />
/// <reference path="~/Game/Unit.js" />
/// <reference path="~/Game/Weapon.js" />
/// <reference path="~/util/General.js" />
/// <reference path="~/Game/Buildings/Building.js" />
function Turret_Mini(level, player, blockX, blockY) {
    Building.call(this, level, player, blockX, blockY);
    this.Health = 1000;
    this.Weapon = new Weapon(this);
    this.update = function () {
        Building.prototype.update.call(this);
        this.Weapon.update();
    }
    this.draw = function (context) {
        context.drawImage(Turret_Mini.canvas, this.TopLeft.X, this.TopLeft.Y);
    };
}
Turret_Mini.Cost = {
    Energy: 1000,
    Metal: 500
};

Turret_Mini.canvas = document.createElement("canvas");
(function () {
    Turret_Mini.canvas.width = Level.Settings.BlockSize;
    Turret_Mini.canvas.height = Level.Settings.BlockSize;
    var context = Turret_Mini.canvas.getContext("2d");
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, Level.Settings.BlockSize, Level.Settings.BlockSize);
    context.strokeStyle = '#558855';
    context.lineWidth = 4;
    context.strokeRect(5, 5, Level.Settings.BlockSize - 10, Level.Settings.BlockSize - 10);
})();
