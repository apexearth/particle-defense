define("game/Buildings/Gun", ["game/Buildings/Building", "game/Settings", "game/Weapons"], function (Building, Settings, Weapons) {
    function Gun(level, player, blockX, blockY) {
        Building.call(this, level, player, blockX, blockY);
        this.Health = 5;
        this.Weapon = new Weapons.Gun(this);
        this.update = function () {
            Building.prototype.update.call(this);
            this.Weapon.update();
        }
        this.draw = function (context) {
            context.drawImage(Gun.canvas, this.TopLeft.X, this.TopLeft.Y);
        };
    }


    Gun.Cost = {
        Energy: 50,
        Metal: 25
    };

    Gun.canvas = document.createElement("canvas");
    (function () {
        Gun.canvas.width = Settings.BlockSize;
        Gun.canvas.height = Settings.BlockSize;
        var context = Gun.canvas.getContext("2d");
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
        context.strokeStyle = '#558855';
        context.lineWidth = 4;
        context.strokeRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
    })();
    return Gun;
});