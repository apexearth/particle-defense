const PIXI = require('pixi.js');
const Grid = require('../util/grid');
const BlockStatus = require('../util/grid/block-status');

module.exports = Map;

function Map(level, width, height, blockSize, template) {
    this.level = level;
    this.container = new PIXI.Container();
    this.blockSize = blockSize;
    this.width = width;
    this.height = height;
    this.pixelWidth = width * this.blockSize;
    this.pixelHeight = height * this.blockSize;

    let _grid = new Grid({
        bounds: {
            left: 0,
            top: 0,
            right: width,
            bottom: height
        },
        blockSize: this.blockSize,
        template: template ? template.grid : null
    });

    this.blockStatus = function (x, y) {
        return _grid.blockStatus(x, y);
    };
    this.getAdjacentBlocks = function (blockX, blockY, diagonal) {
        return _grid.getAdjacentBlocks(blockX, blockY, diagonal);
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

    this.getPath = function (start, finish) {
        var path = _grid.getPath(
            this.getBlockFromVector(start),
            this.getBlockFromVector(finish)
        );
        for (var step = 0; step < path.length; step++) {
            path[step][0] = path[step][0] * _grid.blockSize + _grid.blockSize / 2;
            path[step][1] = path[step][1] * _grid.blockSize + _grid.blockSize / 2;
        }
        return path;
    };

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