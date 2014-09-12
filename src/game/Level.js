define("game/Level", ["game/Map", "game/PlayerCommands", "util/General", "util/Mouse", "util/Keyboard", "game/CommandQueue", "game/Settings"], function (Map, PlayerCommands, General, Mouse, Keyboard, CommandQueue, Settings) {
    var Level = function (width, height) {
        var me = this;
        var _map = new Map(width, height);

        this.FrameCount = 0;
        this.Width = _map.PixelWidth;
        this.Height = _map.PixelHeight;
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
        this.canvas.width = _map.PixelWidth;
        this.canvas.height = _map.PixelHeight;
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
        };

        var PlacementBuilding = null;
        this.BeginBuildingPlacement = function (building) {
            this.PlacementBuilding = new building(this, null, NaN, NaN);
        };
        var _buildableBlocks = [];
        var _notBuildableBlocks = [];
        /** @returns bool **/
        this.IsBlockCoordBuildable = function (blockX, blockY) {
            return this.IsBlockBuildable(_map.getBlock(blockX, blockY));
        };
        /** @returns bool **/
        this.IsBlockBuildable = function (block) {
            if (block.X === 0 || block.Y === 0) return false;
            if (block.X === this.Width - 1 || block.Y === this.Height - 1) return false;
            if (_buildableBlocks.indexOf(block) !== -1) return true;
            if (_notBuildableBlocks.indexOf(block) !== -1) return true;
            if (block.Objects.length > 0) return false;
            return block.IsBlocked() === false;
        };
        this.ResetBuildableBlocks = function () {
            _buildableBlocks = [];
            _notBuildableBlocks = [];
        };

        this.Selection = null;
        this.SelectBuildingAt = function (blockX, blockY) {
            this.Selection = null;
            var block = _map.getBlockOrNull(blockX, blockY);
            if (block != null)
                this.Selection = block.Building;
            return this.Selection;
        };
        this.Deselect = function () {
            this.Selection = null;
        };

        this.getPathForUnit = function (unit) {
            return this.getPath(
                _map.getBlockFromCoords(unit.X, unit.Y),
                _map.getBlockFromVector(unit.Destination)
            );
        };
        this.getPath = function (blockStart, blockTarget) {
            return _map.getPathByBlock(blockStart, blockTarget)
        };

        this.checkWinConditions = function () {
            var i = this.WinConditions.length;
            while (i--) if (!this.WinConditions[i]()) return false;
            return true;
        };
        this.checkLossConditions = function () {
            var i = this.LossConditions.length;
            while (i--) if (!this.LossConditions[i]()) return false;
            return true;
        };

        this.getBlock = function (x, y) {
            return _map.getBlock(x, y);
        };
        this.getBlockFromCoords = function (x, y) {
            return _map.getBlockFromCoords(x, y);
        };
        this.getBlockOrNull = function (x, y) {
            return _map.getBlockOrNull(x, y);
        };
        this.getBlockOrNullFromCoords = function (x, y) {
            return _map.getBlockOrNullFromCoords(x, y);
        };

        this.update = function () {
            this.FrameCount++;
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
                    var block = this.getBlockOrNullFromCoords(Mouse.DisplayX, Mouse.DisplayY);
                    if (block != null) {
                        var buildResult = PlayerCommands.CreateBuilding(this.Player, this.PlacementBuilding.constructor, block.X, block.Y);
                        if (buildResult != null) {
                            i = this.Units.length;
                            while (i--) this.Units[i].findPath();
                            if (!Keyboard.CheckKey(Keyboard.Keys.Shift)) {
                                this.PlacementBuilding = null;
                            }
                        }
                    }
                } else if (Mouse.RightButton || Keyboard.CheckKey(Keyboard.Keys.Escape)) {
                    this.PlacementBuilding = null;
                }
            }

            if (this.CheckCount++ > Settings.Second) {
                var win = this.checkWinConditions();
                var loss = this.checkLossConditions();
                if (win || loss) {
                    this.Result = {
                        Victory: win
                    };
                    CommandQueue.unshift(CommandQueue.StopGame);
                }
            }

        };
        this.draw = function () {
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
                var block = this.getBlockOrNullFromCoords(Mouse.DisplayX, Mouse.DisplayY);
                if (block != null) {
                    this.context.save();
                    this.context.globalAlpha = .75;
                    this.PlacementBuilding.BlockX = block.X;
                    this.PlacementBuilding.BlockY = block.Y;
                    this.PlacementBuilding.UpdateXY();
                    this.PlacementBuilding.draw(this.context);
                    this.context.fillStyle = (this.IsBlockBuildable(block) ? 'rgba(0,255,0,.5)' : 'rgba(255,0,0,.5)');
                    this.context.fillRect(block.X * Level.Settings.BlockSize, block.Y * Level.Settings.BlockSize, Level.Settings.BlockSize, Level.Settings.BlockSize);
                    this.context.restore();
                }
            }

            this.context.drawImage(_map.canvas, 0, 0);
        };

        this.initialize = function (template) {
            General.CopyTo(template, this);
        };
    };

    Level.Settings = {
        BlockSize: 35
    };


    return Level;
});