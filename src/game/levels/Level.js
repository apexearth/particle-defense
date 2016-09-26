var PIXI = require('pixi.js');
var renderer = require('../renderer');
var Map = require('../Map');
var General = require('../../util/General');
var CommandQueue = require('../CommandQueue');
var BlockStatus = require('../../util/grid/block-status');
var inputs = require('../inputs');
var common = require('../common');
var Settings = common.Settings;

module.exports = Level;
Level.list = require('./levels');

function Level(options) {
    options = options || {};
    options.width = options.width || 10;
    options.height = options.height || 10;

    Object.defineProperties(this, {
        position: {
            get: function () {
                return this.container.position;
            }.bind(this)
        },
        mouse: {
            get: function () {
                return {
                    x: (this.inputs('mouseX') - renderer.position.x) / renderer.scale.x + this.width / 2,
                    y: (this.inputs('mouseY') - renderer.position.y) / renderer.scale.y + this.height / 2
                };
            }.bind(this)
        }
    });
    this.container = new PIXI.Container();
    this.blockSize = Settings.BlockSize;
    this.position.x = -options.width * this.blockSize / 2;
    this.position.y = -options.height * this.blockSize / 2;

    var _map = new Map(this, options.width, options.height, this.blockSize, options.mapTemplate);
    this.container.addChild(_map.container);

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

    this.inputs = inputs;

    this.winConditions = [function () {
        for (var player of this.players) {
            if (player.buildings.length > 0)
                return false;
        }
        return true;
    }.bind(this)];
    this.lossConditions = [function () {
        return this.player.buildings.length === 0;
    }.bind(this)];

    if (typeof document !== 'undefined') {
        this.canvas = document.createElement('canvas');
        this.canvas.width = _map.pixelWidth;
        this.canvas.height = _map.pixelHeight;
        this.context = this.canvas.getContext('2d');
    }

    this.addBuilding = function (building) {
        var block = this.getBlock(building.blockX, building.blockY);
        if (block.building) throw new Error('A building already exists at ' + building.blockX + ', ' + building.blockY);
        building.block = block;
        building.block.building = building;
        building.block.add(building);
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
            building.block.remove(building);
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
        return projectile;
    };
    this.removeProjectile = function (projectile) {
        var index = this.projectiles.indexOf(projectile);
        if (index > -1) {
            this.container.removeChild(projectile.container);
            this.projectiles.splice(index, 1);
        }
        return projectile;
    };
    this.addUnit = function (unit) {
        this.container.addChild(unit.container);
        this.units.push(unit);
    };
    this.removeUnit = function (unit) {
        var index = this.units.indexOf(unit);
        if (index > -1) {
            unit.level = null;
            this.container.removeChild(unit.container);
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

    this.startBuildingPlacement = function (constructor) {
        if (!constructor) throw new Error('A building constructor is required.');
        if (this.placementBuilding) this.cancelBuildingPlacement();
        this.placementBuilding = new constructor({
            level: this,
            player: this.player,
            blockX: 0,
            blockY: 0
        });
        this.container.addChild(this.placementBuilding.container);
        return this.placementBuilding;
    };
    this.finishBuildingPlacement = function (block) {
        block = block || this.getBlockFromCoords(this.mouse.x, this.mouse.y);
        var building = this.player.actions.createBuilding(this.placementBuilding.constructor, block.x, block.y);
        this.cancelBuildingPlacement();
        this.updatePaths();
        if (this.inputs('<shift>')) {
            this.startBuildingPlacement(building.constructor);
        }
        return building;
    };
    this.updatePaths = function () {
        var i = this.units.length;
        while (i--) this.units[i].findPath();
    };
    this.cancelBuildingPlacement = function () {
        this.container.removeChild(this.placementBuilding.container);
        var placementBuilding = this.placementBuilding;
        this.placementBuilding = null;
        return placementBuilding;
    };
    /** @returns bool **/
    this.isBlockCoordBuildable = function (blockX, blockY) {
        return this.isBlockBuildable(_map.getBlock(blockX, blockY));
    };

    /** @summary The idea behind this is to check if a block is buildable when placing a building. **/
    /** @returns boolean **/
    this.isBlockBuildable = function (block) {
        if (block.status >= BlockStatus.OnlyPassable) return false; // It's blocked
        if (block.objects.length > 0) return false;                 // The block has an object in it.
        return true;                                                // Since last two didn't show, we find out.
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

    // Returns true if all win conditions are true.
    this.checkWinConditions = function () {
        var i = this.winConditions.length;
        while (i--) if (!this.winConditions[i]()) return false;
        return true;
    };
    // Returns true if all loss conditions are true.
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
    this.findOpenBlockNear = function (blocks) {
        if (blocks.block) blocks = blocks.block;
        blocks = [].concat(blocks);
        let rejectedBlocks = [].concat(blocks);
        for (let block of blocks) {
            var adjacentBlocks = _map.getAdjacentBlocks(block.x, block.y, true);
            for (let adjacentBlock of adjacentBlocks) {
                if (rejectedBlocks.indexOf(adjacentBlock) >= 0) continue;
                if (this.isBlockBuildable(adjacentBlock)) {
                    return adjacentBlock;
                }
                if (blocks.indexOf(adjacentBlock) === -1) {
                    rejectedBlocks.push(adjacentBlock);
                }
            }
        }
        if (rejectedBlocks.length === 0) return null;
        return this.findOpenBlockNear(rejectedBlocks);
    };
    this.processKeyboardInput = function () {
        if (this.inputs('cancel')) {
            if (this.placementBuilding != null) {
                this.inputs('cancel', 0);
                this.cancelBuildingPlacement();
            }
        }
    };
    this.processMouseInput = function () {
        if (this.inputs('mouse0')) {
            this.inputs('mouse0', 0);
            var clickedBlock = this.getBlockOrNullFromCoords(this.mouse.x, this.mouse.y);
            if (this.placementBuilding != null) {
                this.finishBuildingPlacement(clickedBlock);
                return;
            }

            if (clickedBlock != null && clickedBlock.building != null) {
                this.selectBuildingAt(clickedBlock);
            } else {
                this.deselect();
            }
        }

        if (this.inputs('mouse2')) {
            if (this.placementBuilding != null) {
                this.inputs('mouse2', 0);
                this.cancelBuildingPlacement();
            }
        }
    };
    this.checkCount = 0;
    this.update = function () {
        this.frameCount++;

        var i;
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


        if (this.placementBuilding != null) {
            this.placementBuilding.position.x = this.mouse.x - (this.mouse.x % Settings.BlockSize) + Settings.BlockSize / 2;
            this.placementBuilding.position.y = this.mouse.y - (this.mouse.y % Settings.BlockSize) + Settings.BlockSize / 2;
        }


        this.processMouseInput();
        this.processKeyboardInput();

        if (++this.checkCount >= Settings.second) {
            var win = this.checkWinConditions();
            var loss = this.checkLossConditions();
            if (win || loss) {
                this.result = {
                    Victory: win
                };
                CommandQueue.unshift(CommandQueue.StopGame);
            }
        }

    };

    this.initialize = function (template) {
        General.NestedCopyTo(template, this);
    };

    if (options.player) {
        this.addPlayer(options.player);
    }
}
