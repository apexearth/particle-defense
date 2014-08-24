define("game/Buildings/Shotgun", ["game/Buildings/Building", "game/Settings", "game/Weapons"], function (Building, Settings, Weapons) {
    var canvas = document.createElement("canvas");
    var building = function (level, player, blockX, blockY) {
        Building.call(this, level, player, blockX, blockY);
        this.Health = 5;
        this.Weapon = new Weapons.Shotgun(this);
        this.update = function () {
            Building.prototype.update.call(this);
            this.Weapon.update();
        }
        this.draw = function (context) {
            context.drawImage(canvas, this.TopLeft.X, this.TopLeft.Y);
        };
    }
    building.canvas = canvas;

    building.Cost = {
        Energy: 50,
        Metal: 25
    };

    (function () {
        canvas.width = Settings.BlockSize;
        canvas.height = Settings.BlockSize;
        var context = canvas.getContext("2d");
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
        context.strokeStyle = '#228822';
        context.lineWidth = 6;
        context.strokeRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
    })();
    return building;
});