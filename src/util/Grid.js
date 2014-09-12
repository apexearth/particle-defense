define("util/Grid", function () {
    var Block = function (x, y) {
        var _isBlocked = false;
        var _building = null;
        this.X = x;
        this.Y = y;
        this.Objects = [];


        this.SetIsBlocked = function(bool){
            _isBlocked = bool;
        };
        /** @return bool **/
        this.IsBlocked = function () {
            if (_isBlocked !== null) return _isBlocked;
            return false;
        };
        this.RemoveBuilding = function () {
            _isBlocked = false;
            _building = null;
        };
        this.SetBuilding = function (building) {
            _isBlocked = true;
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
        var x = maxX - minX + 1;
        while (x--) {
            this.Block[x] = [];
            var y = maxY - minY + 1;
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

    Grid.prototype.SetIsBlocked = function (x, y, bool) {
        this.getBlock(x, y).SetIsBlocked(bool);
    };
    Grid.prototype.IsBlocked = function (x, y) {
        return this.getBlock(x, y).IsBlocked();
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
                    var block = this.getBlock(x, y);
                    adjacentBlocks.push(block);
                }
            }
        }
        return adjacentBlocks;
    };
    return Grid;
});