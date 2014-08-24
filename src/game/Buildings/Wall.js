define("game/Buildings/Wall", ["game/Buildings/Building", "game/Settings", "game/Weapons"], function (Building, Settings) {
    var canvas = document.createElement("canvas");
    var building = function (level, player, blockX, blockY) {
        Building.call(this, level, player, blockX, blockY);
        this.Health = 5;
        this.update = function () {
            Building.prototype.update.call(this);
        }
        this.draw = function (context) {
            context.drawImage(canvas, this.TopLeft.X, this.TopLeft.Y);
        };
    }
    building.canvas = canvas;

    building.Cost = {
        Energy: 10,
        Metal: 10
    };

    (function () {
        canvas.width = Settings.BlockSize;
        canvas.height = Settings.BlockSize;
        var context = canvas.getContext("2d");
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
    })();
    return building;
});