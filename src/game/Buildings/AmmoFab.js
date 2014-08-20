define("game/Buildings/AmmoFab",["game/Buildings/Building","game/Settings"], function (Building, Settings) {
    function AmmoFab(level, player, blockX, blockY) {
        Building.call(this, level, player, blockX, blockY);
        this.Health = 15;
        this.ResourceStorage.Ammo = 50;
        Building.prototype.addStorageToPlayer.call(this);

        this.update = function () {
            Building.prototype.update.call(this);
            this.Player.Resources.Ammo += .2;
        };
        this.draw = function (context) {
            context.drawImage(AmmoFab.canvas, this.TopLeft.X, this.TopLeft.Y);
        };
    }

    AmmoFab.Cost = {
        Energy: 150,
        Metal: 75
    };

    AmmoFab.canvas = document.createElement("canvas");
    (function () {
        AmmoFab.canvas.width = Settings.BlockSize;
        AmmoFab.canvas.height = Settings.BlockSize;
        var context = AmmoFab.canvas.getContext("2d");
        context.fillStyle = '#ffcccc';
        context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
        context.fillStyle = '#558855';
        context.fillRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
    })();
    return AmmoFab;
});