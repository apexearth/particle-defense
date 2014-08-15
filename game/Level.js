define("Level", function () {
    var Level = function (width, height) {
        var me = this;
        this.Map = new Map(width, height);

        this.Width = this.Map.PixelWidth;
        this.Height = this.Map.PixelHeight;
        this.Bounds = {
            Left: 0,
            Top: 0,
            Right: this.Width,
            Bottom: this.Height
        };

        this.Player = null;
        this.Players = [];

        this.Units = [];
        this.Projectiles = [];
        this.Buildings = [];
        this.Waves = [];
        this.CurrentWave = null;
        this.WaveDelay = 30;
        this.WaveDelayCount = 0;
        this.WinConditions = [function () {
            return (me.CurrentWave === null || me.CurrentWave.Units.length === 0)
                && me.Waves.length === 0
                && me.Units.length === 0;
        }];
        this.LossConditions = [function () {
            return me.Player.HomeBase.Health <= 0;
        }];
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.Map.PixelWidth;
        this.canvas.height = this.Map.PixelHeight;
        this.context = this.canvas.getContext("2d");

        this.CheckCount = 0;

        this.AddBuilding = function (building) {
            this.Buildings.push(building);
            building.Player.Buildings.push(building);
            return building;
        };
        this.AddPlayer = function (player) {
            this.Players.push(player);
            return player;
        };
        this.createWave = function (unitArray, unitDelay) {
            var wave = {
                Units: unitArray,
                UnitDelay: unitDelay,
                UnitDelayCount: 0
            };
            this.Waves.unshift(wave);
            return wave;
        };
        this.hitTest = function (vector) {
            return vector.X >= this.Bounds.Left && vector.X <= this.Bounds.Right && vector.Y >= this.Bounds.Top && vector.Y <= this.Bounds.Bottom;
        }

        this.PlacementBuilding = null;
        this.BeginBuildingPlacement = function (building) {
            this.PlacementBuilding = building;
        };

        this.Selection = null;
        this.SelectBuildingAt = function (blockX, blockY) {
            this.Selection = null;
            var block = this.Map.getBlockOrNullFromBlock(blockX, blockY);
            if (block != null)
                this.Selection = block.Building;
            return this.Selection;
        };
        this.Deselect = function () {
            this.Selection = null;
        }
    }

    Level.Settings = {
        BlockSize: 35
    };


    Level.prototype.GetBlockOrNull = function (x, y) {
        return this.Map.getBlockOrNullFromVector({ X: x, Y: y });
    }

    Level.prototype.update = function () {
        if (this.Units.length === 0
            && (this.CurrentWave === null || this.CurrentWave.Units.length === 0)
            && this.Waves.length !== 0
            && this.WaveDelayCount++ >= this.WaveDelay) {
            this.CurrentWave = this.Waves.pop();
            this.WaveDelayCount = 0;
        }
        var unit;
        if (this.CurrentWave !== null
            && this.CurrentWave.Units.length > 0
            && this.CurrentWave.UnitDelayCount++ >= this.CurrentWave.UnitDelay) {
            unit = this.CurrentWave.Units.pop();
            this.Units.push(unit);
            if (this.Player.HomeBase.Health > 0)
                unit.setDestination(this.Player.HomeBase);
            this.CurrentWave.UnitDelayCount = 0;
        }

        var i = this.Units.length;
        while (i-- > 0) {
            unit = this.Units[i];
            unit.update();
        }

        i = this.Buildings.length;
        while (i-- > 0) {
            var building = this.Buildings[i];
            building.update();
        }

        i = this.Projectiles.length;
        while (i-- > 0) {
            var projectile = this.Projectiles[i];
            projectile.update();
        }

        i = this.Players.length;
        while (i-- > 0) {
            var player = this.Players[i];
            player.update();
        }

        if (this.PlacementBuilding != null) {
            if (Mouse.LeftButton) {
                var block = this.GetBlockOrNull(Mouse.DisplayX, Mouse.DisplayY);
                if (block != null) {
                    var buildResult = PlayerCommands.CreateBuilding(this.Player, this.PlacementBuilding, block.X, block.Y);
                    if (buildResult != null) {
                        i = this.Units.length;
                        while (i--) this.Units[i].findPath();
                        if (!Keyboard.CheckKey(Keys.Shift)) {
                            this.PlacementBuilding = null;
                        }
                    }
                }
            } else if (Mouse.RightButton || Keyboard.CheckKey(Keys.Escape)) {
                this.PlacementBuilding = null;
            }
        }

        if (this.CheckCount++ > ParticleDefense.Second) {
            var win = this.checkWinConditions();
            var loss = this.checkLossConditions();
            if (win || loss) {
                this.Result = {
                    Victory: win
                };
                ParticleDefense.stop();
            }
        }

    };

    Level.prototype.draw = function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var b = this.Buildings.length;
        while (b--)
            this.Buildings[b].draw(this.context);

        var u = this.Units.length;
        while (u--)
            this.Units[u].draw(this.context);

        var p = this.Projectiles.length;
        while (p-- > 0) {
            var projectile = this.Projectiles[p];
            projectile.draw(this.context);
        }

        if (this.PlacementBuilding != null) {
            var block = this.GetBlockOrNull(Mouse.DisplayX, Mouse.DisplayY);
            if (block != null) {
                this.context.globalAlpha = .75;
                this.context.drawImage(this.PlacementBuilding.canvas, block.X * Level.Settings.BlockSize, block.Y * Level.Settings.BlockSize);
                this.context.globalAlpha = 1;
            }
        }

        this.context.drawImage(this.Map.canvas, 0, 0);
    };


    Level.prototype.getPath = function (unit) {
        return this.Map.getPathByBlock(
            this.Map.getBlock(unit.X, unit.Y),
            this.Map.getBlockFromVector(unit.Destination)
        );
    };

    Level.prototype.checkWinConditions = function () {
        var i = this.WinConditions.length;
        while (i--) if (!this.WinConditions[i]()) return false;
        return true;
    };

    Level.prototype.checkLossConditions = function () {
        var i = this.LossConditions.length;
        while (i--) if (!this.LossConditions[i]()) return false;
        return true;
    };
    return Level;
});