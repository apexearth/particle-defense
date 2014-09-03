define("game/Buildings/Building", ["game/Settings", "util/General"], function (Settings, General) {
    var Building = function (level, player, templates) {
        this.BlockX = 0;
        this.BlockY = 0;
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
        this.initialize = function () {
            this.X = this.BlockX * Settings.BlockSize + Settings.BlockSize / 2;
            this.Y = this.BlockY * Settings.BlockSize + Settings.BlockSize / 2;
            this.TopLeft = {
                X: this.BlockX * Settings.BlockSize,
                Y: this.BlockY * Settings.BlockSize
            };
            if (this.Block != null) {           // Reset Block if Reinitializing.
                this.Block.RemoveBuilding();
            }
            this.Block = this.Level.getBlock(this.BlockX, this.BlockY);
            this.Block.SetBuilding(this);
        }
        this.loadTemplate = function (template) {
            General.CopyTo(template, this);
        };
        this.loadTemplates = function () {
            if (templates === undefined)return;
            if (templates instanceof Array)
                for (var template in templates) {
                    if (templates.hasOwnProperty(template))
                        this.loadTemplate(templates[template]);
                }
            else
                this.loadTemplate(templates);
        }

        this.loadTemplates();
        Building.prototype.addStorageToPlayer.call(this);
        this.initialize();
    }

    Building.prototype.update = function () {
        if (this.Health <= 0) {
            Building.prototype.removeStorageFromPlayer.call(this);
            this.Level.Buildings.splice(this.Level.Buildings.indexOf(this), 1);
            this.Player.Buildings.splice(this.Player.Buildings.indexOf(this), 1);
            delete this.Block.Building;
            return;
        }

        var i = this.Updates.length;
        while (i--) this.Updates[i].call(this);
        i = this.Weapons.length;
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