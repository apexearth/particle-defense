define("game/Building", ["game/Settings", "util/General", "util/Display", "game/Attribute"], function (Settings, General, Display, Attribute) {
    var arcCircle = 2 * Math.PI;


    var Building = function (level, player, templates) {
        var me = this;
        this.BlockX = NaN;
        this.BlockY = NaN;
        this.Block = null;
        this.Health = 1000;
        this.Width = Settings.BlockSize;
        this.Height = Settings.BlockSize;
        this.Level = level;
        this.Player = player;
        this.Abilities = null;
        this.ResourceGeneration = {};
        this.ResourceStorage = {
            Energy: 0,
            Metal: 0,
            Ammo: 0
        };
        this.Weapons = [];
        this.Updates = [];
        this.Canvas = null;

        this.NumberOfUpgrades = 0;
        this.Attributes = {  };
        this.UpdateAttributes = function () {

            var createAttributeForStorage = function (resourceName, energyFactor, metalFactor) {
                if (me.ResourceStorage[resourceName] > 0) {
                    me.Attributes[resourceName + 'Storage'] = new Attribute(me,
                        function () {
                            return me.ResourceStorage[resourceName];
                        },
                        function () {
                            me.ResourceStorage[resourceName] += 25;
                        },
                        null,
                        {
                            /** @returns Number **/
                            Energy: function () {
                                return me.ResourceStorage[resourceName] * energyFactor;
                            },
                            /** @returns Number **/
                            Metal: function () {
                                return me.ResourceStorage[resourceName] * metalFactor;
                            }
                        }
                    )
                }
            };
            var createAttributeForGeneration = function (resourceName, energyFactor, metalFactor) {
                if (me.ResourceGeneration[resourceName] > 0) {
                    me.Attributes[resourceName + 'Generation'] = new Attribute(me,
                        function () {
                            return me.ResourceGeneration[resourceName];
                        },
                        function () {
                            me.ResourceGeneration[resourceName] *= 1.25;
                        },
                        null,
                        {
                            /** @returns Number **/
                            Energy: function () {
                                return me.ResourceGeneration[resourceName] * energyFactor;
                            },
                            /** @returns Number **/
                            Metal: function () {
                                return me.ResourceGeneration[resourceName] * metalFactor;
                            }
                        }
                    )
                }
            };

            createAttributeForStorage("Ammo", .5, .25);
            createAttributeForStorage("Energy", .5, .25);
            createAttributeForStorage("Metal", 1, .5);

            createAttributeForGeneration("Ammo", 2, 4);
            createAttributeForGeneration("Energy", 8, 3);
            createAttributeForGeneration("Metal", 8, 13);

        };

        var _isSelected = false;
        /** @returns bool **/
        this.IsSelected = function () {
            return _isSelected;
        };
        this.Select = function () {
            this.Abilities = new Building.Abilities(this);
            _isSelected = true;
        };
        this.Deselect = function () {
            this.Abilities = null;
            _isSelected = false;
        };

        this.draw = function (context) {
            context.drawImage(this.constructor.canvas, this.TopLeft.X, this.TopLeft.Y);
            if (this.IsSelected()) {
                context.strokeStyle = 'rgba(100,255,100,.5)';
                context.lineWidth = 4;
                context.strokeRect(this.TopLeft.X, this.TopLeft.Y, this.Width, this.Height);
                context.fillStyle = 'rgba(0,0,0,.25)';
                context.fillRect(this.TopLeft.X, this.TopLeft.Y, this.Width, this.Height);
            }
            if (this.IsSelected() || level.PlacementBuilding === this) {
                var i = this.Weapons.length;
                while (i--) {
                    context.fillStyle = 'rgba(0,0,255,.05)';
                    context.beginPath();
                    context.arc(this.X, this.Y, this.Weapons[i].Range, 0, arcCircle, false);
                    context.closePath();
                    context.fill();
                }
            }
        };
        this.update = function () {
            if (this.Health <= 0) {
                Building.prototype.removeStorageFromPlayer.call(this);
                this.Level.Buildings.splice(this.Level.Buildings.indexOf(this), 1);
                this.Player.Buildings.splice(this.Player.Buildings.indexOf(this), 1);
                delete this.Block.Building;
                return;
            }

            for (var r in this.ResourceGeneration) {
                if (this.ResourceGeneration.hasOwnProperty(r)) {
                    this.Player.Resources[r] += this.ResourceGeneration[r] / Settings.Second;
                }
            }

            var i = this.Updates.length;
            while (i--) this.Updates[i].call(this);
            i = this.Weapons.length;
            while (i--) this.Weapons[i].update();
        };
        this.UpdateXY = function () {
            this.X = this.BlockX * Settings.BlockSize + Settings.BlockSize / 2;
            this.Y = this.BlockY * Settings.BlockSize + Settings.BlockSize / 2;

            this.TopLeft = {
                X: this.BlockX * Settings.BlockSize,
                Y: this.BlockY * Settings.BlockSize
            };
            var displayCoords = Display.translateCoordinate(this.TopLeft.X, this.TopLeft.Y);
            this.TopLeft.DisplayX = displayCoords.x;
            this.TopLeft.DisplayY = displayCoords.y;
        };
        this.initialize = function () {
            this.UpdateXY();
            if (this.Block != null) {           // Reset Block if Reinitializing.
                this.Block.RemoveBuilding();
            }
            if (this.Level !== null) this.Block = this.Level.getBlockOrNull(this.BlockX, this.BlockY);
            if (this.Block !== null) this.Block.SetBuilding(this);
        };
        this.loadTemplate = function (template, ignoreArray) {
            General.CopyTo(template, this, ignoreArray);
            this.UpdateAttributes();
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
        };

        if(player){
            player.AddBuildingCount(this.Name);
        }
        this.loadTemplates();
        Building.prototype.addStorageToPlayer.call(this);
        this.initialize();
    };
    Building.prototype.addStorageToPlayer = function () {
        if (this.Player === null) return;
        for (var key in this.ResourceStorage) {
            if (this.ResourceStorage.hasOwnProperty(key)) {
                this.Player.ResourceStorage[key] += this.ResourceStorage[key];
            }
        }
    };
    Building.prototype.removeStorageFromPlayer = function () {
        if (this.Player === null) return;
        for (var key in this.ResourceStorage) {
            if (this.ResourceStorage.hasOwnProperty(key)) {
                this.Player.ResourceStorage[key] -= this.ResourceStorage[key];
            }
        }
    };

    Building.Abilities = function (building) {
        this.Building = building;
        // Add Weapon Upgrades
        this.Upgrades = {};
        var i = building.Weapons.length;
        while (i--) {
            this.Upgrades['Weapon' + (i === 0 ? "" : i)] = building.Weapons[i].Attributes;
        }
        this.Upgrades.Building = this.Building.Attributes;
    };

    return Building;
});