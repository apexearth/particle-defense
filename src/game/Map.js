define("game/Map", ["util/Grid", "game/Settings", "util/Pathfind"], function (Grid, Settings, Pathfind) {
    function Map(width, height) {
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

        this.IsBlocked = function(x, y){
            return _grid.IsBlocked(x, y);
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
            this.context.strokeStyle = 'rgba(50,50,50,.5)';
            this.context.lineWidth = 1;
            var x = this.Width;
            while (x--) {
                var y = this.Height;
                while (y--)
                    this.context.strokeRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
            }
            this.context.strokeStyle = 'rgba(50,50,50,1)';
            this.context.lineWidth = 2;
            this.context.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        };

        this.draw();
    };

    return Map;
});