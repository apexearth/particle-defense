define("game/Buildings/MetalFab",["game/Buildings/Building","game/Settings"], function (Building, Settings) {
    function MetalFab(level, player, blockX, blockY) {
        Building.call(this, level, player, blockX, blockY);
        this.Health = 15;
        this.ResourceStorage.Metal = 50;
        Building.prototype.addStorageToPlayer.call(this);

        this.update = function () {
            Building.prototype.update.call(this);
            this.Player.Resources.Metal += .025;
        };
        this.draw = function (context) {
            context.drawImage(MetalFab.canvas, this.TopLeft.X, this.TopLeft.Y);
        };
    }

    MetalFab.Cost = {
        Energy: 100,
        Metal: 100
    };

    MetalFab.canvas = document.createElement("canvas");
    (function () {
        MetalFab.canvas.width = Settings.BlockSize;
        MetalFab.canvas.height = Settings.BlockSize;
        var context = MetalFab.canvas.getContext("2d");
        context.fillStyle = '#ccd0ff';
        context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
        context.fillStyle = '#558855';
        context.fillRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
    })();
    return MetalFab;
});