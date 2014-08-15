define("Turret_Gun", ["./Building"], function (Building) {
    function Turret_Gun(level, player, blockX, blockY) {
        Building.call(this, level, player, blockX, blockY);
        this.Health = 5;
        this.Weapon = new Gun(this);
        this.update = function () {
            Building.prototype.update.call(this);
            this.Weapon.update();
        }
        this.draw = function (context) {
            context.drawImage(Turret_Gun.canvas, this.TopLeft.X, this.TopLeft.Y);
        };
    }

    Building.List.Turret_Gun = Turret_Gun;
    Turret_Gun.Cost = {
        Energy: 50,
        Metal: 25
    };

    Turret_Gun.canvas = document.createElement("canvas");
    (function () {
        Turret_Gun.canvas.width = Level.Settings.BlockSize;
        Turret_Gun.canvas.height = Level.Settings.BlockSize;
        var context = Turret_Gun.canvas.getContext("2d");
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, Level.Settings.BlockSize, Level.Settings.BlockSize);
        context.strokeStyle = '#558855';
        context.lineWidth = 4;
        context.strokeRect(5, 5, Level.Settings.BlockSize - 10, Level.Settings.BlockSize - 10);
    })();
    return Turret_Gun;
});