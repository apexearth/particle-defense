var math        = require("../util/math")
var Vector      = math.Vector;
var Display     = require("../util/Display")
var Grid        = require("../util/grid")
var Pathfind    = Grid.Pathfind;
var BlockStatus = require("../util/grid/block-status")


module.exports = PathfindExample

PathfindExample.instance = new PathfindExample();
function PathfindExample() {
    this.grid = new Grid(0, 0, 10 + Math.floor(Math.random() * 10), 10 + Math.floor(Math.random() * 10));
    var i     = Math.floor(this.grid.MaxX * this.grid.MaxY * .25);
    while (i--)
        this.grid.SetBlockStatus(Math.round(this.grid.MaxX * Math.random()), Math.round(this.grid.MaxY * Math.random()), BlockStatus.NotPassable);
    this.start = Vector.create(Math.floor(Math.random() * this.grid.MaxX), Math.floor(Math.random() * this.grid.MaxY));
    this.stop  = Vector.create(Math.floor(Math.random() * this.grid.MaxX), Math.floor(Math.random() * this.grid.MaxY));
    this.path  = Pathfind.getPathByVector(this.grid, this.start, this.stop);

    Display.drawOffsetXT = Display.drawOffsetX = -this.grid.MaxX / 2 * 100 - 50;
    Display.drawOffsetYT = Display.drawOffsetY = -this.grid.MaxY / 2 * 100 - 50;

}

PathfindExample.initialize = function (canvas) {
    Display.initialize(canvas);
    Display.clear();

    PathfindExample.drawCanvas();

    setTimeout('PathfindExample.update()', 1000 / 30);
};
PathfindExample.drawCanvas = function () {
    Display.Settings.DisableTranslation = true;
    var blockSize                       = 100;
    Display.createDrawCanvas('Path', PathfindExample.instance.grid.MaxX * blockSize + blockSize, PathfindExample.instance.grid.MaxY * blockSize + blockSize);
    if (pathfind.LastPath.open) {
        Display.setFill('rgb(175,175,175)');
        var c = pathfind.LastPath.closed.length;
        while (c--) {
            var closedBlock = pathfind.LastPath.closed[c];
            Display.fillRect(closedBlock.X * blockSize, closedBlock.Y * blockSize, blockSize, blockSize);
        }
    }

    Display.setFill('rgb(180,225,125)');
    var i = PathfindExample.instance.path.length;
    while (i--) {
        var block = PathfindExample.instance.path[i];
        Display.fillRect(block.X * blockSize, block.Y * blockSize, blockSize, blockSize);
    }
    Display.setFill('rgb(50,185,50)');
    Display.fillRect(PathfindExample.instance.start.X * blockSize + 25, PathfindExample.instance.start.Y * blockSize + 25, blockSize - 50, blockSize - 50);
    Display.setFill('rgb(50,50,255)');
    Display.fillRect(PathfindExample.instance.stop.X * blockSize + 25, PathfindExample.instance.stop.Y * blockSize + 25, blockSize - 50, blockSize - 50);


    if (pathfind.LastPath.open) {
        Display.setFill('rgb(55,55,55)');
        Display.setFont(20, 'sans-serif');
        c = pathfind.LastPath.closed.length;
        while (c--) {
            closedBlock = pathfind.LastPath.closed[c];
            Display.fillText('c' + c.toFixed(0), closedBlock.X * blockSize + 5, closedBlock.Y * blockSize + 21);
        }
    }


    var x = PathfindExample.instance.grid.Block.length;
    while (x--) {
        var y = PathfindExample.instance.grid.Block[x].length;
        while (y--) {
            if (PathfindExample.instance.grid.Block[x][y].Status() >= BlockStatus.NotPassable) {
                Display.setFill('rgba(255,75,75,.5)');
            } else {
                Display.setFill('rgba(75,75,75,.4)');

            }
            Display.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
    }

    Display.setFont(40, 'sans-serif');
    Display.setFill('rgb(255,255,255)');
    if (PathfindExample.instance.grid.BlockStatus(PathfindExample.instance.start.X, PathfindExample.instance.start.Y) >= BlockStatus.NotPassable)
        Display.fillText("The start point is blocked.", 10, 50);
    if (PathfindExample.instance.grid.BlockStatus(PathfindExample.instance.stop.X, PathfindExample.instance.stop.Y) >= BlockStatus.NotPassable)
        Display.fillText("The target is blocked.", 10, 100);
    Display.Settings.DisableTranslation = false;
};

PathfindExample.update = function () {
    Display.setDrawCanvas('Main');
    Display.clear();
    Display.Settings.InverseQuality();
    Display.drawImage(Display.canvasList['Path'], 0, 0);
    Display.Settings.InverseQuality();
    setTimeout(function () {
        PathfindExample.update();
    }, 1000 / 30);
};
