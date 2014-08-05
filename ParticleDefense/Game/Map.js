Map = function (width, height) {
    this.BlockSize = Level.Settings.BlockSize;
    this.Width = width;
    this.Height = height;
    this.PixelWidth = this.Width * this.BlockSize;
    this.PixelHeight = this.Height * this.BlockSize;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.PixelWidth;
    this.canvas.height = this.PixelHeight;
    this.context = this.canvas.getContext("2d");
    this.Grid = new Grid(0, 0, this.Width, this.Height);
    this.RequiresDraw = true;
    this.draw();
};

Map.prototype.getBlockFromVector = function (vector) {
    return this.getBlock(vector.X, vector.Y);
};
Map.prototype.getBlock = function (x, y) {
    return this.Grid.getBlock(Math.floor(x / this.BlockSize), Math.floor(y / this.BlockSize));
};

Map.prototype.getBlockOrNullFromVector = function (vector) {
    return this.getBlockOrNull(vector.X, vector.Y);
};
Map.prototype.getBlockOrNull = function (x, y) {
    return this.Grid.getBlockOrNull(Math.floor(x / this.BlockSize), Math.floor(y / this.BlockSize));
};
Map.prototype.getPathByBlock = function (blockStart, blockTarget) {
    var path = Pathfind.getPathByBlock(this.Grid, blockStart, blockTarget);
    var p = path.length;
    while (p--) {
        var coordinate = path[p];
        coordinate.X = coordinate.X * this.BlockSize + this.BlockSize / 2;
        coordinate.Y = coordinate.Y * this.BlockSize + this.BlockSize / 2;
    }
    return path;
};

Map.prototype.draw = function () {
    if (!this.RequiresDraw) return;
    this.RequiresDraw = false;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.strokeStyle = '#fff';
    this.context.lineWidth = 2;
    var x = this.Width;
    while (x--) {
        var y = this.Height;
        while (y--)
            this.context.strokeRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
    }
};