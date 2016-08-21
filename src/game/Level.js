var PIXI = require('pixi.js')
var renderer = require('./renderer');
var Map = require('./Map')
var PlayerCommands = require('./PlayerCommands')
var General = require('../util/General')
var CommandQueue = require('./CommandQueue')
var BlockStatus = require('../util/grid/block-status')

var input = require('../util/input')
var Mouse    = input.Mouse;
var Keyboard = input.Keyboard;

var common = require('./common')
var Settings = common.Settings;

module.exports = Level;

function Level(width, height, mapTemplate) {
    PIXI.Container.call(this);
    this.position.x = -width * Settings.BlockSize / 2;
    this.position.y = -height * Settings.BlockSize / 2;
    renderer.addChild(this);


    var me   = this;
    var _map = new Map(this, width, height, mapTemplate);
    
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
        var i = me.spawnPoints.length;
        var waveCount = 0;
        while (i--) {
            waveCount = Math.max(me.spawnPoints[i].waves.length, waveCount);
            if (me.spawnPoints[i].currentWave !== null) waveCount++;
        }
        return waveCount;
    };
    this.winConditions = [function () {
        if (me.units.length > 0) return false;
        var i = me.spawnPoints.length;
        while (i--) {
            if (me.spawnPoints[i].hasWaves() === true) return false;
        }
        return true;
    }];
    this.lossConditions = [function () {
        return me.player.homeBase.health <= 0;
    }];

    if (typeof document !== 'undefined') {
        this.canvas = document.createElement('canvas');
        this.canvas.width = _map.pixelWidth;
        this.canvas.height = _map.pixelHeight;
        this.context = this.canvas.getContext('2d');
    }
    
    this.checkCount = 0;

    this.addBuilding = function (building) {
        this.buildings.push(building);
        building.player.buildings.push(building);
        return building;
    };
    this.addPlayer   = function (player) {
        this.players.push(player);
        return player;
    };
    this.hitTest     = function (vector) {
        return vector.x >= this.bounds.left && vector.x <= this.bounds.right && vector.y >= this.bounds.top && vector.y <= this.bounds.bottom;
    };

    this.beginBuildingPlacement    = function (building) {
        if (this.getPlacementBuilding) this.endBuildingPlacement();
        this.getPlacementBuilding = new building(this, null);
    };
    this.finalizeBuildingPlacement = function (block) {
        if (block != null) {
            var buildResult = PlayerCommands.CreateBuilding(this.player, this.getPlacementBuilding.constructor, block.x, block.y);
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
    this.endBuildingPlacement      = function () {
        this.removeChild(this.getPlacementBuilding);
        this.getPlacementBuilding = null;
    };
    var _buildableBlocks           = [];
    var _notBuildableBlocks        = [];
    /** @returns bool **/
    this.isBlockCoordBuildable = function (blockX, blockY) {
        return this.isBlockBuilding(_map.getBlock(blockX, blockY));
    };

    /** @summary The idea behind this is to check if a block is buildable when placing a building. **/
    /** @returns bool **/
    this.isBlockBuilding = function (block) {
        if (block.status >= BlockStatus.OnlyPassable) return false;       // It's blocked
        if (block.objects.length > 0) return false;                         // The block has an object in it.
        if (_buildableBlocks.indexOf(block) >= 0) return true;              // Is within list of buildable blocks.
        if (_notBuildableBlocks.indexOf(block) >= 0) return false;          // Is within list of not buildable blocks.
        return this.willBuildingBlockPath(block);                    // Since last two didn't show, we find out.
    };

    /** @returns bool **/
    this.willBuildingBlockPath = function (block) {
        var prevStatus = block.status;
        block.status = BlockStatus.NotPassable;
        var i = this.spawnPoints.length;
        while (i--) {
            var spawnPoint = this.spawnPoints[i];
            var spawnPointBlock = this.getBlock(spawnPoint.blockX, spawnPoint.blockY);
            var path = this.getPath(spawnPointBlock, this.player.homeBase.Block);
            if (path.length > 0) {
                _buildableBlocks.push(block);
            } else {
                _notBuildableBlocks.push(block);
                block.status = prevStatus;
                return false;
            }
        }
        block.status = prevStatus;
        return true;
    };
    /** @summary Should be called whenever block BlockStatus changes. **/
    this.resetBuildableBlocks = function () {
        _buildableBlocks    = [];
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
            _map.getBlockFromVector(unit.destination)
        );
    };
    this.getPath        = function (blockStart, blockTarget) {
        return _map.getPathByBlock(blockStart, blockTarget)
    };

    this.checkWinConditions  = function () {
        var i = this.winConditions.length;
        while (i--) if (!this.winConditions[i]()) return false;
        return true;
    };
    this.checkLossConditions = function () {
        var i = this.lossConditions.length;
        while (i--) if (!this.lossConditions[i]()) return false;
        return true;
    };

    this.getBlock                 = function (x, y) {
        return _map.getBlock(x, y);
    };
    this.getBlockFromCoords       = function (x, y) {
        return _map.getBlockFromCoords(x, y);
    };
    this.getBlockOrNull           = function (x, y) {
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
                return;
            }
        }
    };
    this.update                   = function () {
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

        i = this.Projectiles.length;
        while (i-- > 0) {
            var projectile = this.Projectiles[i];
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
            var win  = this.checkWinConditions();
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
level.prototype = Object.create(PIXI.Container.prototype);
level.prototype.constructor = level;

