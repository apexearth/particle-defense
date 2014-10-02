define("game/Map", ["util/Grid", "game/Settings", "util/Pathfind", "util/BlockStatus"], function (Grid, Settings, Pathfind, BlockStatus) {
    function Map(width, height, template) {
        this.BlockSize = Settings.BlockSize;
        this.Width = width;
        this.Height = height;
        this.PixelWidth = this.Width * this.BlockSize;
        this.PixelHeight = this.Height * this.BlockSize;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.PixelWidth;
        this.canvas.height = this.PixelHeight;
        this.context = this.canvas.getContext("2d");
        var _grid = new Grid(0, 0, this.Width, this.Height);
        this.RequiresDraw = true;

        this.BlockStatus = function (x, y) {
            return _grid.BlockStatus(x, y);
        };
        this.getBlock = function (x, y) {
            return _grid.getBlock(x, y);
        };
        this.getBlockFromVector = function (vector) {
            return this.getBlockFromCoords(vector.X, vector.Y);
        };
        this.getBlockFromCoords = function (x, y) {
            return _grid.getBlock(Math.floor(x / this.BlockSize), Math.floor(y / this.BlockSize));
        };

        this.getBlockOrNullFromCoords = function (x, y) {
            return _grid.getBlockOrNull(Math.floor(x / this.BlockSize), Math.floor(y / this.BlockSize));
        };
        this.getBlockOrNullFromVector = function (vector) {
            return this.getBlockOrNull(vector.X, vector.Y);
        };
        this.getBlockOrNull = function (x, y) {
            return _grid.getBlockOrNull(x, y);
        };

        this.getPathByBlock = function (blockStart, blockTarget) {
            var path = Pathfind.getPathByBlock(_grid, blockStart, blockTarget);
            var p = path.length;
            while (p--) {
                var coordinate = path[p];
                coordinate.X = coordinate.X * this.BlockSize + this.BlockSize / 2;
                coordinate.Y = coordinate.Y * this.BlockSize + this.BlockSize / 2;
            }
            return path;
        };

        this.draw = function () {
            if (!this.RequiresDraw) return;
            this.RequiresDraw = false;

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.strokeStyle = 'rgba(30,30,30,1)';
            this.context.lineWidth = 1;
            var x = this.Width;
            while (x--) {
                var y = this.Height;
                while (y--) {
                    if (_grid.BlockStatus(x, y) === BlockStatus.IsNothing) {
                        // Do nothing!
                    } else if (_grid.BlockStatus(x, y) == BlockStatus.OnlyPassable) {
                        this.context.fillStyle = 'rgba(20,20,20,1)';
                        this.context.fillRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
                    } else {
                        this.context.fillStyle = 'rgba(7,7,7,1)';
                        this.context.fillRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
                        this.context.strokeRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
                    }
                }
            }
        };

        (function () {
            if (template) {
                if (template.BuildableBlocks) {
                    var yCount = template.BuildableBlocks.length;
                    while (yCount--) {
                        var row = template.BuildableBlocks[yCount];
                        var xCount = row.length;
                        while (xCount--) {
                            _grid.SetBlockStatus(xCount, yCount, row[xCount]);
                        }
                    }
                }
            }
        })();

        this.draw();
    }

    return Map;
});