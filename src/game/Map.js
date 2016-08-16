var PIXI        = require("pixi.js")
var General     = require("../util/General")
var Grid        = require("../util/grid")
var Settings    = require("./Settings")
var Pathfind    = require("../util/grid/Pathfind")
var BlockStatus = require("../util/grid/block-status")

module.exports = function (level, width, height, template) {
    var map = new PIXI.Container();
    level.addChild(map);
    Map.call(map, level, width, height, template);

    if(typeof document !== 'undefined') {
        var mapSprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(map.canvas));
        map.addChild(mapSprite);
    }

    return map;
};

function Map(level, width, height, template) {
    this.Level         = level;
    this.BlockSize     = Settings.BlockSize;
    this.Width         = width;
    this.Height        = height;
    var _grid          = new Grid(0, 0, this.Width, this.Height);
    this.PixelWidth    = this.Width * this.BlockSize;
    this.PixelHeight   = this.Height * this.BlockSize;

    if(typeof document !== 'undefined') {
        this.canvas        = document.createElement('canvas');
        this.context      = this.canvas.getContext("2d");
        this.canvas.width  = this.PixelWidth;
        this.canvas.height = this.PixelHeight;
    }

    this.RequiresDraw = true;

    this.BlockStatus        = function (x, y) {
        return _grid.BlockStatus(x, y);
    };
    this.getBlock           = function (x, y) {
        return _grid.getBlock(x, y);
    };
    this.getBlockFromVector = function (vector) {
        return this.getBlockFromCoords(vector.x, vector.y);
    };
    this.getBlockFromCoords = function (x, y) {
        return _grid.getBlock(Math.floor(x / this.BlockSize), Math.floor(y / this.BlockSize));
    };

    this.getBlockOrNullFromCoords = function (x, y) {
        return _grid.getBlockOrNull(Math.floor(x / this.BlockSize), Math.floor(y / this.BlockSize));
    };
    this.getBlockOrNullFromVector = function (vector) {
        return this.getBlockOrNull(vector.x, vector.y);
    };
    this.getBlockOrNull           = function (x, y) {
        return _grid.getBlockOrNull(x, y);
    };

    this.getPathByBlock = function (blockStart, blockTarget) {
        var path = Pathfind.getPathByBlock(_grid, blockStart, blockTarget);
        var p    = path.length;
        while (p--) {
            var coordinate = path[p];
            coordinate.x   = coordinate.x * this.BlockSize + this.BlockSize / 2;
            coordinate.y   = coordinate.y * this.BlockSize + this.BlockSize / 2;
        }
        return path;
    };

    this.draw = function () {
        if (!this.RequiresDraw) return;
        this.RequiresDraw = false;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var x = this.Width;
        while (x--) {
            var y = this.Height;
            while (y--) {
                var blockStatus = _grid.BlockStatus(x, y);
                if (blockStatus === BlockStatus.IsNothing) {
                    // Do nothing!
                } else if (blockStatus === BlockStatus.IsEmpty) {
                    this.context.fillStyle = 'rgba(12,12,12,1)';
                    this.context.fillRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
                } else if (blockStatus === BlockStatus.OnlyPassable) {
                    this.context.fillStyle = 'rgba(20,20,20,1)';
                    this.context.fillRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
                }
                else {
                    this.context.fillStyle = 'rgba(7,7,7,1)';
                    this.context.fillRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
                }
                if (blockStatus === BlockStatus.NotPassable
                    || blockStatus === BlockStatus.IsEmpty) {
                    this.context.strokeStyle = 'rgba(50,50,50,1)';
                    this.context.lineWidth   = 1;
                    this.context.strokeRect(x * this.BlockSize, y * this.BlockSize, this.BlockSize, this.BlockSize);
                }
            }
        }
    };

    if (template) {
        if (template.BuildableBlocks) {
            var yCount = template.BuildableBlocks.length;
            while (yCount--) {
                var row    = template.BuildableBlocks[yCount];
                var xCount = row.length;
                while (xCount--) {
                    _grid.SetBlockStatus(xCount, yCount, row[xCount]);
                }
            }
        }
    }

    this.draw();
}
