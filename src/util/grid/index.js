var BlockStatus = require('./block-status');
var Block = require('./block');
var Pathfind = require('./Pathfind');

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
    })
    ;
    for (var x = bounds.left; x <= bounds.right; x++) {
        blocks[x] = [];
        for (var y = bounds.top; y <= bounds.bottom; y++) {
            var block = new Block(x, y, blockSize);
            blocks[x][y] = block;
            if (x + 1 < blocks.length && blocks[x + 1].indexOf(y)) {
                block.rightBlock = blocks[x + 1][y];
                blocks[x + 1][y].leftBlock = block;
            }
            if (x < blocks.length && y + 1 < blocks[x].length) {
                block.bottomBlock = blocks[x][y + 1];
                blocks[x][y + 1].topBlock = block;
            }
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
        var block = blocks[x][y];
        if (block === undefined)
            throw new Error();
        return block;
    };
    this.getBlockOrNull = function (x, y) {
        if (x >= 0 && y >= 0 && x < blocks.length) {
            var sub = blocks[x];
            if (y < sub.length)
                return sub[y];
        }
        return null;
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
}

Grid.Pathfind = Pathfind;
Grid.BlockStatus = BlockStatus;
