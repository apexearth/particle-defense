var PF = require('pathfinding');
var BlockStatus = require('./block-status');
var Block = require('./block');

module.exports = Grid;

function Grid(options) {
    options = options
        || {
            bounds: {
                left: 0,
                right: 10,
                top: 0,
                bottom: 10
            },
            blockSize: 25
        };
    var blocks = [];

    var bounds = Object.assign({}, options.bounds);
    var blockSize = options.blockSize;

    Object.defineProperties(this, {
        bounds: {
            get: function () {
                return bounds;
            }
        },
        blockSize: {
            get: function () {
                return blockSize;
            }
        }
    });

    for (var y = bounds.top; y <= bounds.bottom; y++) {
        blocks[y] = [];
        for (var x = bounds.left; x <= bounds.right; x++) {
            blocks[y][x] = new Block(x, y, blockSize);
        }
    }

    this.setBlockStatus = function (x, y, status) {
        this.getBlock(x, y).status = status;
    };
    this.blockStatus = function (x, y) {
        return this.getBlock(x, y).status;
    };

    this.getBlockAtPosition = function (position) {
        var blockX = (position.x / blockSize) ^ 0;
        var blockY = (position.y / blockSize) ^ 0;
        return this.getBlock(blockX, blockY);
    };
    this.getBlockFromVector = function (vector) {
        return this.getBlock(vector.x, vector.y);
    };
    this.getBlock = function (x, y) {
        var block = blocks[y][x];
        if (block === undefined)
            throw new Error();
        return block;
    };
    this.getBlockOrNull = function (x, y) {
        var row = blocks[y];
        if (!row) return null;
        var block = row[x];
        if (!block) return null;
        return block;
    };
    this.getAdjacentBlocks = function (blockX, blockY, diagonal) {
        var adjacentBlocks = [];
        for (var x = blockX - 1; x <= blockX + 1; x++) {
            for (var y = blockY - 1; y <= blockY + 1; y++) {
                if ((x != blockX || y != blockY)
                    && (diagonal || (x == blockX || y == blockY))
                    && x >= bounds.left && x <= bounds.right
                    && y >= bounds.top && y <= bounds.bottom) {
                    var block = this.getBlockOrNull(x, y);
                    if (block !== null) adjacentBlocks.push(block);
                }
            }
        }
        return adjacentBlocks;
    };
    this.generateWalkabilityGrid = function () {
        return blocks.map(function (column) {
            return column.map(function (block) {
                return block.status < BlockStatus.NotPassable ? 0 : 1;
            });
        });
    };
    this.getPath = function (start, finish) {
        var grid = new PF.Grid(this.generateWalkabilityGrid());
        var finder = new PF.AStarFinder({
            allowDiagonal: true,
            dontCrossCorners: true
        });
        return finder.findPath(start.x, start.y, finish.x, finish.y, grid);
    };


    if (options.template) {
        var yCount = options.template.length;
        while (yCount--) {
            var row = options.template[yCount];
            var xCount = row.length;
            while (xCount--) {
                this.setBlockStatus(xCount, yCount, row[xCount]);
            }
        }
    }
}

Grid.BlockStatus = BlockStatus;
