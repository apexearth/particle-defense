/// <reference path="~/Game/Level.js" />
/// <reference path="~/Game/Buildings/Building.js" />
/// <reference path="~/Game/Player.js" />
/// <reference path="~/Game/Level.js" />
function HomeBase(level, player, blockX, blockY) {
    Building.call(this, level, player, blockX, blockY);
    this.Health = 50;
    player.HomeBase = this;

    this.ResourceStorage.Ammo = 200;
    this.ResourceStorage.Energy = 200;
    this.ResourceStorage.Metal = 100;
    Building.prototype.addStorageToPlayer.call(this);

    this.update = function () {
        Building.prototype.update.call(this);
        this.Player.Resources.Energy += .1;
        this.Player.Resources.Metal += .05;
        this.Player.Resources.Ammo += .2;
    };
    this.draw = function (context) {
        context.drawImage(HomeBase.canvas, this.TopLeft.X, this.TopLeft.Y);
    };
}
Building.List.HomeBase = HomeBase;
HomeBase.Cost = {
    Energy: 1000,
    Metal: 500
};

HomeBase.canvas = document.createElement("canvas");
(function () {
    HomeBase.canvas.width = Level.Settings.BlockSize;
    HomeBase.canvas.height = Level.Settings.BlockSize;
    var context = HomeBase.canvas.getContext("2d");
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, Level.Settings.BlockSize, Level.Settings.BlockSize);
    context.fillStyle = '#558855';
    context.fillRect(5, 5, Level.Settings.BlockSize - 10, Level.Settings.BlockSize - 10);
})();
