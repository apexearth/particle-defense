define("util/Grid", ["util/BlockStatus"], function (BlockStatus) {
    var Block = function (x, y) {
        var _status = BlockStatus.IsNothing;
        var _building = null;
        this.X = x;
        this.Y = y;
        this.Objects = [];

        this.SetStatus = function (status) {
            _status = status;
        };
        /** @return String **/
        this.Status = function () {
            if (_status !== null) return _status;
            return null;
        };
        this.RemoveBuilding = function () {
            _status = BlockStatus.IsEmpty;
            _building = null;
        };
        this.SetBuilding = function (building) {
            _status = BlockStatus.NotBuildable;
            _building = building;
        };
        this.GetBuilding = function () {
            return _building;
        };
        this.Add = function (object) {
            this.Objects.push(object);
        };
        this.Remove = function (object) {
            this.Objects.splice(this.Objects.indexOf(object), 1);
        };
    };

    var Grid = function (minX, minY, maxX, maxY) {
        this.Block = [];
        this.MinX = minX;
        this.MinY = minY;
        this.MaxX = maxX;
        this.MaxY = maxY;
        this.LeftBlock = null;
        this.TopBlock = null;
        this.RightBlock = null;
        this.BottomBlock = null;
        var x = maxX - minX;
        while (x--) {
            this.Block[x] = [];
            var y = maxY - minY;
            while (y--) {
                var block = new Block(x, y);
                this.Block[x][y] = block;
                if (x + 1 < this.Block.length && this.Block[x + 1].indexOf(y)) {
                    block.RightBlock = this.Block[x + 1][y];
                    this.Block[x + 1][y].LeftBlock = block;
                }
                if (x < this.Block.length && y + 1 < this.Block[x].length) {
                    block.BottomBlock = this.Block[x][y + 1];
                    this.Block[x][y + 1].TopBlock = block;
                }
            }
        }
    };

    Grid.prototype.SetBlockStatus = function (x, y, status) {
        this.getBlock(x, y).SetStatus(status);
    };
    Grid.prototype.BlockStatus = function (x, y) {
        return this.getBlock(x, y).Status();
    };

    Grid.prototype.getBlockFromVector = function (vector) {
        return this.getBlock(vector.X, vector.Y);
    };
    Grid.prototype.getBlock = function (x, y) {
        x -= this.MinX;
        y -= this.MinY;
        var block = this.Block[x][y];
        if (block === undefined)
            throw new Error();
        return block;
    };
    Grid.prototype.getBlockOrNull = function (x, y) {
        x -= this.MinX;
        y -= this.MinY;
        if (x >= 0 && y >= 0 && x < this.Block.length) {
            var subarr = this.Block[x];
            if (y < subarr.length)
                return subarr[y];
        }
        return null;
    };
    Grid.prototype.getAdjacentBlocks = function (blockX, blockY, diagonal) {
        var adjacentBlocks = [];
        for (var x = blockX - 1; x <= blockX + 1; x++) {
            for (var y = blockY - 1; y <= blockY + 1; y++) {
                if ((x != blockX || y != blockY)
                    && (diagonal || (x == blockX || y == blockY))
                    && x >= this.MinX && x <= this.MaxX
                    && y >= this.MinY && y <= this.MaxY) {
                    var block = this.getBlockOrNull(x, y);
                    if (block !== null) adjacentBlocks.push(block);
                }
            }
        }
        return adjacentBlocks;
    };
    return Grid;
});