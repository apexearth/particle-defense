define("game/Buildings/EnergyCollector", ["game/Buildings/Building","game/Settings"], function (Building, Settings) {
    function EnergyCollector(level, player, blockX, blockY) {
        Building.call(this, level, player, blockX, blockY);
        this.Health = 15;
        this.ResourceStorage.Energy = 100;
        Building.prototype.addStorageToPlayer.call(this);

        this.update = function () {
            Building.prototype.update.call(this);
            this.Player.Resources.Energy += .05;
        };
        this.draw = function (context) {
            context.drawImage(EnergyCollector.canvas, this.TopLeft.X, this.TopLeft.Y);
        };
    }

    EnergyCollector.Cost = {
        Energy: 100,
        Metal: 50
    };

    EnergyCollector.canvas = document.createElement("canvas");
    (function () {
        EnergyCollector.canvas.width = Settings.BlockSize;
        EnergyCollector.canvas.height = Settings.BlockSize;
        var context = EnergyCollector.canvas.getContext("2d");
        context.fillStyle = '#ccd0ff';
        context.fillRect(0, 0, Settings.BlockSize, Settings.BlockSize);
        context.fillStyle = '#558855';
        context.fillRect(5, 5, Settings.BlockSize - 10, Settings.BlockSize - 10);
    })();
    return EnergyCollector;
});