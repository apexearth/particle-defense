var PIXI = require('pixi.js');
var Grid = require('../util/grid');
var Settings = require('./Settings');
var Pathfind = require('../util/grid/Pathfind');
var BlockStatus = require('../util/grid/block-status');

module.exports = Map;

function Map(level, width, height, template) {
    this.level = level;
    this.container = new PIXI.Container();
    this.blockSize = Settings.BlockSize;
    var _grid = new Grid(0, 0, width, height);
    this.width = width;
    this.height = height;
    this.pixelWidth = width * this.blockSize;
    this.pixelHeight = height * this.blockSize;


    this.blockStatus = function (x, y) {
        return _grid.blockStatus(x, y);
    };
    this.getBlock = function (x, y) {
        return _grid.getBlock(x, y);
    };
    this.getBlockFromVector = function (vector) {
        return this.getBlockFromCoords(vector.x, vector.y);
    };
    this.getBlockFromCoords = function (x, y) {
        return _grid.getBlock(Math.floor(x / this.blockSize), Math.floor(y / this.blockSize));
    };

    this.getBlockOrNullFromCoords = function (x, y) {
        return _grid.getBlockOrNull(Math.floor(x / this.blockSize), Math.floor(y / this.blockSize));
    };
    this.getBlockOrNullFromVector = function (vector) {
        return this.getBlockOrNull(vector.x, vector.y);
    };
    this.getBlockOrNull = function (x, y) {
        return _grid.getBlockOrNull(x, y);
    };

    this.getPathByBlock = function (blockStart, blockTarget) {
        var path = Pathfind.getPathByBlock(_grid, blockStart, blockTarget);
        var p = path.length;
        while (p--) {
            var coordinate = path[p];
            coordinate.x = coordinate.x * this.blockSize + this.blockSize / 2;
            coordinate.y = coordinate.y * this.blockSize + this.blockSize / 2;
        }
        return path;
    };

    if (template) {
        if (template.buildableBlocks) {
            var yCount = template.buildableBlocks.length;
            while (yCount--) {
                var row = template.buildableBlocks[yCount];
                var xCount = row.length;
                while (xCount--) {
                    _grid.setBlockStatus(xCount, yCount, row[xCount]);
                }
            }
        }
    }

    // Add drawing related functionality.
    if (typeof document !== 'undefined') {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.pixelWidth;
        this.canvas.height = this.pixelHeight;
        this.requiresDraw = true;
        this.draw = function () {
            if (!this.requiresDraw) return;
            this.requiresDraw = false;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            var x = this.width;
            while (x--) {
                var y = this.height;
                while (y--) {
                    var blockStatus = _grid.blockStatus(x, y);
                    if (blockStatus === BlockStatus.IsNothing) {
                        // Do nothing!
                    } else if (blockStatus === BlockStatus.IsEmpty) {
                        this.context.fillStyle = 'rgba(12,12,12,1)';
                        this.context.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                    } else if (blockStatus === BlockStatus.OnlyPassable) {
                        this.context.fillStyle = 'rgba(20,20,20,1)';
                        this.context.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                    }
                    else {
                        this.context.fillStyle = 'rgba(7,7,7,1)';
                        this.context.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                    }
                    if (blockStatus === BlockStatus.NotPassable
                        || blockStatus === BlockStatus.IsEmpty) {
                        this.context.strokeStyle = 'rgba(50,50,50,1)';
                        this.context.lineWidth = 1;
                        this.context.strokeRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);
                    }
                }
            }
        };
        this.draw();
        this.container.addChild(new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas)));
    }
}