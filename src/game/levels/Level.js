var PIXI = require('pixi.js');
var renderer = require('../renderer');
var Map = require('../Map');
var General = require('../../util/General');
var CommandQueue = require('../CommandQueue');
var BlockStatus = require('../../util/grid/block-status');

var input = require('../../util/input');
var Mouse = input.Mouse;
var Keyboard = input.Keyboard;

var common = require('../common');
var Settings = common.Settings;

module.exports = Level;
Level.list = require('./levels');

function Level(options) {
    options = options || {};
    options.width = options.width || 10;
    options.height = options.height || 10;

    this.container = new PIXI.Container();
    renderer.addChild(this.container);
    this.blockSize = Settings.BlockSize;
    this.position = this.container.position;
    this.position.x = -options.width * this.blockSize / 2;
    this.position.y = -options.height * this.blockSize / 2;

    var _map = new Map(this, options.width, options.height, this.blockSize, options.mapTemplate);
    this.container.addChild(_map.container);
    this.spawnPoints = [];

    this.frameCount = 0;
    this.width = _map.pixelWidth;
    this.height = _map.pixelHeight;
    this.bounds = {
        left: 0,
        top: 0,
        right: this.width,
        bottom: this.height
    };

    this.player = null;
    this.players = [];

    this.units = [];
    this.projectiles = [];
    this.buildings = [];
    this.objects = [];

    this.mouse = {
        x: Mouse.x - renderer.position.x,
        y: Mouse.y - renderer.position.y
    };

    /** @returns Number **/
    this.totalWaves = function () {
        var i = this.spawnPoints.length;
        var waveCount = 0;
        while (i--) {
            waveCount = Math.max(this.spawnPoints[i].waves.length, waveCount);
            if (this.spawnPoints[i].currentWave !== null) waveCount++;
        }
        return waveCount;
    };
    this.winConditions = [function () {
        if (this.units.length > 0) return false;
        var i = this.spawnPoints.length;
        while (i--) {
            if (this.spawnPoints[i].hasWaves() === true) return false;
        }
        return true;
    }.bind(this)];
    this.lossConditions = [function () {
        return this.player.homeBase.health <= 0;
    }.bind(this)];

    if (typeof document !== 'undefined') {
        this.canvas = document.createElement('canvas');
        this.canvas.width = _map.pixelWidth;
        this.canvas.height = _map.pixelHeight;
        this.context = this.canvas.getContext('2d');
    }

    this.addBuilding = function (building) {
        var block = this.getBlock(building.blockX, building.blockY);
        if (block.building !== null) throw new Error('A building already exists at ' + building.blockX + ', ' + building.blockY);
        building.block = block;
        building.block.building = this;
        this.container.addChild(building.container);
        this.buildings.push(building);
        if (building.player) {
            building.player.addBuilding(building);
            building.addStorageToPlayer();
        }
        return building;
    };
    this.removeBuilding = function (building) {
        var index = this.buildings.indexOf(building);
        if (index > -1) {
            building.block.building = null;
            building.block = null;
            this.container.removeChild(building.container);
            this.buildings.splice(index, 1);
        }
        if (building.player) {
            building.player.removeBuilding(building);
            building.removeStorageFromPlayer();
        }
        return building;
    };
    this.addProjectile = function (projectile) {
        this.container.addChild(projectile.container);
        this.projectiles.push(projectile);
    };
    this.removeProjectile = function (projectile) {
        var index = this.projectiles.indexOf(projectile);
        if (index > -1) {
            this.container.removeChild(projectile.container);
            this.projectiles.splice(index, 1);
        }
    };
    this.addUnit = function (unit) {
        this.container.addChild(unit);
        this.units.push(unit);
    };
    this.removeUnit = function (unit) {
        var index = this.units.indexOf(unit);
        if (index > -1) {
            unit.level = null;
            this.container.removeChild(unit);
            this.units.splice(index, 1);
        }
    };
    this.containsUnit = function (unit) {
        return this.units.indexOf(unit) >= 0;
    };
    this.addPlayer = function (player) {
        player.level = this;
        this.players.push(player);
        if (!this.player) {
            this.player = player;
        }
        return player;
    };
    this.hitTest = function (vector) {
        return vector.x >= this.bounds.left && vector.x <= this.bounds.right && vector.y >= this.bounds.top && vector.y <= this.bounds.bottom;
    };

    this.beginBuildingPlacement = function (building) {
        if (this.getPlacementBuilding) this.endBuildingPlacement();
        this.getPlacementBuilding = new building(this, null);
    };
    this.finalizeBuildingPlacement = function (block) {
        if (block != null) {
            var buildResult = this.player.createBuilding(this.getPlacementBuilding.constructor, block.x, block.y);
            if (buildResult != null) {
                this.resetBuildableBlocks();
                var i = this.units.length;
                while (i--) this.units[i].findPath();
                if (!Keyboard.CheckKey(Keyboard.Keys.shift)) {
                    this.endBuildingPlacement();
                }
            }
        }
    };
    this.endBuildingPlacement = function () {
        this.removeChild(this.getPlacementBuilding);
        this.getPlacementBuilding = null;
    };
    var _buildableBlocks = [];
    var _notBuildableBlocks = [];
    /** @returns bool **/
    this.isBlockCoordBuildable = function (blockX, blockY) {
        return this.isBlockBuildable(_map.getBlock(blockX, blockY));
    };

    /** @summary The idea behind this is to check if a block is buildable when placing a building. **/
    /** @returns boolean **/
    this.isBlockBuildable = function (block) {
        if (block.status >= BlockStatus.OnlyPassable) return false;       // It's blocked
        if (block.objects.length > 0) return false;                         // The block has an object in it.
        if (_buildableBlocks.indexOf(block) >= 0) return true;              // Is within list of buildable blocks.
        if (_notBuildableBlocks.indexOf(block) >= 0) return false;          // Is within list of not buildable blocks.
        return !this.willBuildingBlockPath(block);                    // Since last two didn't show, we find out.
    };

    /** @returns boolean **/
    this.willBuildingBlockPath = function (block) {
        if (this.spawnPoints.length === 0) return false;
        if (!this.player || !this.player.homeBase) return false;
        var prevStatus = block.status;
        block.status = BlockStatus.NotPassable;
        var i = this.spawnPoints.length;
        while (i--) {
            var spawnPoint = this.spawnPoints[i];
            var spawnPointBlock = this.getBlock(spawnPoint.block.x, spawnPoint.block.y);
            var path = this.getPath(spawnPointBlock, this.player.homeBase.block);
            if (path.length > 0) {
                _buildableBlocks.push(block);
            } else {
                _notBuildableBlocks.push(block);
                block.status = prevStatus;
                return true;
            }
        }
        block.status = prevStatus;
        return false;
    };
    /** @summary Should be called whenever block BlockStatus changes. **/
    this.resetBuildableBlocks = function () {
        _buildableBlocks = [];
        _notBuildableBlocks = [];
    };

    this.selection = null;
    this.selectBuildingAt = function (block) {
        this.deselect();
        this.selection = block.building;
        this.selection.selected = true;
        return this.selection;
    };
    this.deselect = function () {
        if (this.selection !== null) {
            this.selection.selected = false;
            this.selection = null;
        }
    };

    this.getPathForUnit = function (unit) {
        return this.getPath(
            _map.getBlockFromCoords(unit.position.x, unit.position.y),
            _map.getBlockFromCoords(unit.target.position.x, unit.target.position.y)
        );
    };
    this.getPath = function (blockStart, blockTarget) {
        return _map.getPathByBlock(blockStart, blockTarget);
    };

    this.checkWinConditions = function () {
        var i = this.winConditions.length;
        while (i--) if (!this.winConditions[i]()) return false;
        return true;
    };
    this.checkLossConditions = function () {
        var i = this.lossConditions.length;
        while (i--) if (!this.lossConditions[i]()) return false;
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
    this.processKeyboardInput = function () {
        if (Keyboard.CheckKey(Keyboard.Keys.escape)) {
            if (this.getPlacementBuilding != null) {
                this.endBuildingPlacement();
            }
        }
    };
    this.processMouseInput = function () {
        if (Mouse.LeftButton) {
            Mouse.LeftButton = false;
            var clickedBlock = this.getBlockOrNullFromCoords(this.Mouse.x, this.Mouse.y);
            if (this.getPlacementBuilding != null) {
                this.finalizeBuildingPlacement(clickedBlock);
                return;
            }

            if (clickedBlock != null && clickedBlock.building != null) {
                this.selectBuildingAt(clickedBlock);
            } else {
                this.deselect();
            }
        }

        if (Mouse.RightButton) {
            if (this.getPlacementBuilding != null) {
                Mouse.RightButton = false;
                this.endBuildingPlacement();
            }
        }
    };
    this.checkCount = 0;
    this.update = function () {
        this.frameCount++;

        this.mouse = {
            x: (Mouse.x - renderer.position.x) / renderer.scale.x + this.width / 2,
            y: (Mouse.y - renderer.position.y) / renderer.scale.y + this.height / 2
        };


        var i = this.spawnPoints.length;
        while (i--) {
            var spawnPoint = this.spawnPoints[i];
            spawnPoint.update(this);
        }

        i = this.units.length;
        while (i-- > 0) {
            var unit = this.units[i];
            unit.update();
        }

        i = this.buildings.length;
        while (i-- > 0) {
            var building = this.buildings[i];
            building.update();
        }

        i = this.projectiles.length;
        while (i-- > 0) {
            var projectile = this.projectiles[i];
            projectile.update();
        }

        i = this.objects.length;
        while (i-- > 0) {
            var object = this.objects[i];
            if (object.update) object.update();
        }

        i = this.players.length;
        while (i-- > 0) {
            var player = this.players[i];
            player.update();
        }


        if (this.getPlacementBuilding != null) {
            this.getPlacementBuilding.position.x = this.mouse.x - (this.mouse.x % Settings.BlockSize) + Settings.BlockSize / 2;
            this.getPlacementBuilding.position.y = this.mouse.y - (this.mouse.y % Settings.BlockSize) + Settings.BlockSize / 2;
        }


        this.processMouseInput();
        this.processKeyboardInput();

        if (this.checkCount++ > Settings.second) {
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
        if (options.player) {
            this.addPlayer(options.player);
        }
    };
    this.initialize();
}
