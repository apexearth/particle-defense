define("game/Buildings/Building", ["game/Settings", "util/General"], function (Settings, General) {
    var Building = function (level, player, blockX, blockY) {
        this.BlockX = (blockX == null ? 0 : blockX);
        this.BlockY = (blockY == null ? 0 : blockY);
        this.Health = 1000;
        this.Width = Settings.BlockSize;
        this.Height = Settings.BlockSize;
        this.Level = level;
        this.Player = player;
        this.ResourceStorage = {
            Energy: 0,
            Metal: 0,
            Ammo: 0
        }
        this.Weapons = [];
        this.Updates = [];
        this.Canvas = null;
        this.draw = function (context) {
            context.drawImage(this.constructor.canvas, this.TopLeft.X, this.TopLeft.Y);
        };
        this.update = Building.prototype.update;
        this.initialize = function (template) {
            if (template !== undefined) General.CopyTo(template, this);
            this.X = this.BlockX * Settings.BlockSize + Settings.BlockSize / 2;
            this.Y = this.BlockY * Settings.BlockSize + Settings.BlockSize / 2;
            this.TopLeft = {
                X: this.BlockX * Settings.BlockSize,
                Y: this.BlockY * Settings.BlockSize
            };
            if (this.Block != null) {           // Reset Block if Reinitializing.
                this.Block.IsBlocked = false;
                this.Block.Building = null;
            }
            this.Block = this.Level.Map.Grid.getBlock(this.BlockX, this.BlockY);
            this.Block.IsBlocked = true;
            this.Block.Building = this;
        }
        this.initialize();
    }

    Building.prototype.update = function () {
        if (this.Health <= 0) {
            this.Level.Buildings.splice(this.Level.Buildings.indexOf(this), 1);
            this.Player.Buildings.splice(this.Player.Buildings.indexOf(this), 1);
            delete this.Block.Building;
            return;
        }

        var i = this.Updates.length;
        while (i--) this.Updates[i]();
        var i = this.Weapons.length;
        while (i--) this.Weapons[i].update();
    };
    Building.prototype.addStorageToPlayer = function () {
        for (var key in this.ResourceStorage) {
            if (this.ResourceStorage.hasOwnProperty(key)) {
                this.Player.ResourceStorage[key] += this.ResourceStorage[key];
            }
        }
    };
    Building.prototype.removeStorageFromPlayer = function () {
        for (var key in this.ResourceStorage) {
            if (this.ResourceStorage.hasOwnProperty(key)) {
                this.Player.ResourceStorage[key] -= this.ResourceStorage[key];
            }
        }
    };
    return Building;
});