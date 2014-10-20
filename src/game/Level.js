define("game/Level", ["game/Map", "game/PlayerCommands", "util/General", "util/Mouse", "util/Keyboard", "game/CommandQueue", "game/Settings", "util/BlockStatus"], function (Map, PlayerCommands, General, Mouse, Keyboard, CommandQueue, Settings, BlockStatus) {
    var Level = function (width, height, mapTemplate) {
        var me = this;
        var _map = new Map(width, height, mapTemplate);

        this.SpawnPoints = [];

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
        this.Objects = [];

        /** @returns Number **/
        this.TotalWaves = function () {
            var i = me.SpawnPoints.length;
            var waveCount = 0;
            while (i--) {
                waveCount = Math.max(me.SpawnPoints[i].Waves.length, waveCount);
                if (me.SpawnPoints[i].CurrentWave !== null) waveCount++;
            }
            return waveCount;
        };
        this.WinConditions = [function () {
            if (me.Units.length > 0) return false;
            var i = me.SpawnPoints.length;
            while (i--) {
                if (me.SpawnPoints[i].HasWaves() === true) return false;
            }
            return true;
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
        this.hitTest = function (vector) {
            return vector.X >= this.Bounds.Left && vector.X <= this.Bounds.Right && vector.Y >= this.Bounds.Top && vector.Y <= this.Bounds.Bottom;
        };

        this.BeginBuildingPlacement = function (building) {
            this.PlacementBuilding = new building(this, null);
        };
        this.FinalizeBuildingPlacement = function (block) {
            if (block != null) {
                var buildResult = PlayerCommands.CreateBuilding(this.Player, this.PlacementBuilding.constructor, block.X, block.Y);
                if (buildResult != null) {
                    this.ResetBuildableBlocks();
                    var i = this.Units.length;
                    while (i--) this.Units[i].findPath();
                    if (!Keyboard.CheckKey(Keyboard.Keys.Shift)) {
                        this.PlacementBuilding = null;
                    }
                }
            }
        };
        var _buildableBlocks = [];
        var _notBuildableBlocks = [];
        /** @returns bool **/
        this.IsBlockCoordBuildable = function (blockX, blockY) {
            return this.IsBlockBuildable(_map.getBlock(blockX, blockY));
        };

        /** @summary The idea behind this is to check if a block is buildable when placing a building. **/
        /** @returns bool **/
        this.IsBlockBuildable = function (block) {
            if (block.Status() == BlockStatus.OnlyPassable) return false;       // It's blocked
            if (block.Objects.length > 0) return false;                         // The block has an object in it.
            if (_buildableBlocks.indexOf(block) >= 0) return true;              // Is within list of buildable blocks.
            if (_notBuildableBlocks.indexOf(block) >= 0) return false;          // Is within list of not buildable blocks.
            return this.CheckIfBuildingWillBlockPath(block);                    // Since last two didn't show, we find out.
        };

        /** @returns bool **/
        this.CheckIfBuildingWillBlockPath = function (block) {
            var prevStatus = block.Status();
            block.SetStatus(BlockStatus.NotPassable);
            var i = this.SpawnPoints.length;
            while (i--) {
                var spawnPoint = this.SpawnPoints[i];
                var spawnPointBlock = this.getBlock(spawnPoint.X, spawnPoint.Y);
                var path = this.getPath(spawnPointBlock, this.Player.HomeBase.Block);
                if (path.length > 0) {
                    _buildableBlocks.push(block);
                } else {
                    _notBuildableBlocks.push(block);
                    block.SetStatus(prevStatus);
                    return false;
                }
            }
            block.SetStatus(prevStatus);
            return true;
        };
        /** @summary Should be called whenever block BlockStatus changes. **/
        this.ResetBuildableBlocks = function () {
            _buildableBlocks = [];
            _notBuildableBlocks = [];
        };

        this.Selection = null;
        this.SelectBuildingAt = function (block) {
            this.Deselect();
            this.Selection = block.GetBuilding();
            this.Selection.Select();
            return this.Selection;
        };
        this.Deselect = function () {
            if (this.Selection !== null) {
                this.Selection.Deselect();
                this.Selection = null;
            }
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
        this.ProcessKeyboardInput = function () {
            if (Keyboard.CheckKey(Keyboard.Keys.Escape)) {
                if (this.PlacementBuilding != null) {
                    this.PlacementBuilding = null;
                    return;
                }
            }
        };
        this.ProcessMouseInput = function () {
            if (Mouse.LeftButton) {
                Mouse.LeftButton = false;
                var clickedBlock = this.getBlockOrNullFromCoords(Mouse.DisplayX, Mouse.DisplayY);
                if (this.PlacementBuilding != null) {
                    this.FinalizeBuildingPlacement(clickedBlock);
                    return;
                }

                if (clickedBlock != null && clickedBlock.GetBuilding() != null) {
                    this.SelectBuildingAt(clickedBlock);
                } else {
                    this.Deselect();
                }
            }

            if (Mouse.RightButton) {
                Mouse.RightButton = false;
                if (this.PlacementBuilding != null) {
                    this.PlacementBuilding = null;
                    return;
                }
            }
        };
        this.update = function () {
            this.FrameCount++;
            var i = this.SpawnPoints.length;
            while (i--) {
                var spawnPoint = this.SpawnPoints[i];
                spawnPoint.update(this);
            }

            i = this.Units.length;
            while (i-- > 0) {
                var unit = this.Units[i];
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

            i = this.Objects.length;
            while (i-- > 0) {
                var object = this.Objects[i];
                if (object.update) object.update();
            }

            i = this.Players.length;
            while (i-- > 0) {
                var player = this.Players[i];
                player.update();
            }

            this.ProcessMouseInput();
            this.ProcessKeyboardInput();

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
            this.context.drawImage(_map.canvas, 0, 0);

            var i = this.Buildings.length;
            while (i--)
                this.Buildings[i].draw(this.context);

            i = this.Units.length;
            while (i--)
                this.Units[i].draw(this.context);

            i = this.Projectiles.length;
            while (i-- > 0)
                this.Projectiles[i].draw(this.context);

            i = this.Objects.length;
            while (i-- > 0) {
                var object = this.Objects[i];
                object.draw(this.context);
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
                    this.context.fillRect(block.X * Settings.BlockSize, block.Y * Settings.BlockSize, Settings.BlockSize, Settings.BlockSize);
                    this.context.restore();
                }
            }

        };

        this.initialize = function (template) {
            General.CopyTo(template, this);
        };
    };


    return Level;
})
;