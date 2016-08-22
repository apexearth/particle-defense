var BlockStatus = require('./block-status');
var Block = require('./block');
var Pathfind = require('./Pathfind');

module.exports = Grid;

function Grid(minX, minY, maxX, maxY) {
    var blocks = [];
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    var x            = maxX - minX;
    while (x--) {
        blocks[x] = [];
        var y         = maxY - minY;
        while (y--) {
            var block        = new Block(x, y);
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

    this.getBlockFromVector = function (vector) {
        return this.getBlock(vector.x, vector.y);
    };
    this.getBlock = function (x, y) {
        x -= this.minX;
        y -= this.minY;
        var block = blocks[x][y];
        if (block === undefined)
            throw new Error();
        return block;
    };
    this.getBlockOrNull = function (x, y) {
        x -= this.minX;
        y -= this.minY;
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
                    && x >= this.minX && x <= this.maxX
                    && y >= this.minY && y <= this.maxY) {
                    var block = this.getBlockOrNull(x, y);
                    if (block !== null) adjacentBlocks.push(block);
                }
            }
        }
        return adjacentBlocks;
    };
}

Grid.Pathfind    = Pathfind;
Grid.BlockStatus = BlockStatus;
