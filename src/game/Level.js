define("game/Level", ["./PIXI", "./Map", "./PlayerCommands", "../util/General", "../util/input!", "./CommandQueue", "./common", "../util/grid/block-status"], function (PIXI, Map, PlayerCommands, General, input, CommandQueue, common, BlockStatus) {
    var Settings = common.Settings;
    var Mouse = input.Mouse;
    var Keyboard = input.Keyboard;

    var Level = function (width, height, mapTemplate) {
        PIXI.DisplayObjectContainer.call(this);
        this.position.x = -width * Settings.BlockSize / 2;
        this.position.y = -height * Settings.BlockSize / 2;
        PIXI.MainContainer.addChild(this);


        var me = this;
        var _map = new Map(this, width, height, mapTemplate);

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

        this.Mouse = {
            x: Mouse.x - PIXI.MainContainer.position.x,
            y: Mouse.y - PIXI.MainContainer.position.y
        };

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

        this.addBuilding = function (building) {
            this.Buildings.push(building);
            building.Player.Buildings.push(building);
            return building;
        };
        this.addPlayer = function (player) {
            this.Players.push(player);
            return player;
        };
        this.hitTest = function (vector) {
            return vector.x >= this.Bounds.Left && vector.x <= this.Bounds.Right && vector.y >= this.Bounds.Top && vector.y <= this.Bounds.Bottom;
        };

        this.beginBuildingPlacement = function (building) {
            if(this.getPlacementBuilding) this.endBuildingPlacement();
            this.getPlacementBuilding = new building(this, null);
        };
        this.finalizeBuildingPlacement = function (block) {
            if (block != null) {
                var buildResult = PlayerCommands.CreateBuilding(this.Player, this.getPlacementBuilding.constructor, block.x, block.y);
                if (buildResult != null) {
                    this.resetBuildableBlocks();
                    var i = this.Units.length;
                    while (i--) this.Units[i].findPath();
                    if (!Keyboard.CheckKey(Keyboard.Keys.Shift)) {
                        this.endBuildingPlacement();
                    }
                }
            }
        };
        this.endBuildingPlacement = function(){
            this.removeChild(this.getPlacementBuilding);
            this.getPlacementBuilding = null;
        };
        var _buildableBlocks = [];
        var _notBuildableBlocks = [];
        /** @returns bool **/
        this.isBlockCoordBuildable = function (blockX, blockY) {
            return this.isBlockBuilding(_map.getBlock(blockX, blockY));
        };

        /** @summary The idea behind this is to check if a block is buildable when placing a building. **/
        /** @returns bool **/
        this.isBlockBuilding = function (block) {
            if (block.Status() >= BlockStatus.OnlyPassable) return false;       // It's blocked
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
                var spawnPointBlock = this.getBlock(spawnPoint.x, spawnPoint.y);
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
        this.resetBuildableBlocks = function () {
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
                _map.getBlockFromCoords(unit.position.x, unit.position.y),
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
                if (this.getPlacementBuilding != null) {
                    this.endBuildingPlacement();
                }
            }
        };
        this.ProcessMouseInput = function () {
            if (Mouse.LeftButton) {
                Mouse.LeftButton = false;
                var clickedBlock = this.getBlockOrNullFromCoords(this.Mouse.x, this.Mouse.y);
                if (this.getPlacementBuilding != null) {
                    this.finalizeBuildingPlacement(clickedBlock);
                    return;
                }

                if (clickedBlock != null && clickedBlock.GetBuilding() != null) {
                    this.SelectBuildingAt(clickedBlock);
                } else {
                    this.Deselect();
                }
            }

            if (Mouse.RightButton) {
                if (this.getPlacementBuilding != null) {
                    Mouse.RightButton = false;
                    this.endBuildingPlacement();
                    return;
                }
            }
        };
        this.update = function () {
            this.FrameCount++;

            this.Mouse = {
                x: (Mouse.x - PIXI.MainContainer.position.x) / PIXI.MainContainer.scale.x + this.Width / 2,
                y: (Mouse.y - PIXI.MainContainer.position.y) / PIXI.MainContainer.scale.y + this.Height / 2
            };


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


            if (this.getPlacementBuilding != null) {
                this.getPlacementBuilding.position.x = this.Mouse.x - (this.Mouse.x % Settings.BlockSize) + Settings.BlockSize / 2;
                this.getPlacementBuilding.position.y = this.Mouse.y - (this.Mouse.y % Settings.BlockSize) + Settings.BlockSize / 2;
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

        this.initialize = function (template) {
            General.NestedCopyTo(template, this);
        };
    };
    Level.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
    Level.prototype.constructor = Level;

    return Level;
})
;