var math = require('../util/math');
var Vector      = math.Vector;
var Display = require('../util/Display');
var Grid = require('../util/grid');
var Pathfind    = Grid.Pathfind;
var BlockStatus = require('../util/grid/block-status');


module.exports = PathfindExample;

PathfindExample.instance = new PathfindExample();
function PathfindExample() {
    this.grid = new Grid(0, 0, 10 + Math.floor(Math.random() * 10), 10 + Math.floor(Math.random() * 10));
    var i = Math.floor(this.grid.maxX * this.grid.maxY * .25);
    while (i--)
        this.grid.setBlockStatus(Math.round(this.grid.maxX * Math.random()), Math.round(this.grid.maxY * Math.random()), BlockStatus.NotPassable);
    this.start = Vector.create(Math.floor(Math.random() * this.grid.maxX), Math.floor(Math.random() * this.grid.maxY));
    this.stop = Vector.create(Math.floor(Math.random() * this.grid.maxX), Math.floor(Math.random() * this.grid.maxY));
    this.path  = Pathfind.getPathByVector(this.grid, this.start, this.stop);

    Display.drawOffsetXT = Display.drawOffsetX = -this.grid.maxX / 2 * 100 - 50;
    Display.drawOffsetYT = Display.drawOffsetY = -this.grid.maxY / 2 * 100 - 50;

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
    Display.createDrawCanvas('Path', PathfindExample.instance.grid.maxX * blockSize + blockSize, PathfindExample.instance.grid.maxY * blockSize + blockSize);
    if (Pathfind.LastPath.open) {
        Display.setFill('rgb(175,175,175)');
        var c = Pathfind.LastPath.closed.length;
        while (c--) {
            var closedBlock = Pathfind.LastPath.closed[c];
            Display.fillRect(closedBlock.x * blockSize, closedBlock.y * blockSize, blockSize, blockSize);
        }
    }

    Display.setFill('rgb(180,225,125)');
    var i = PathfindExample.instance.path.length;
    while (i--) {
        var block = PathfindExample.instance.path[i];
        Display.fillRect(block.x * blockSize, block.y * blockSize, blockSize, blockSize);
    }
    Display.setFill('rgb(50,185,50)');
    Display.fillRect(PathfindExample.instance.start.x * blockSize + 25, PathfindExample.instance.start.y * blockSize + 25, blockSize - 50, blockSize - 50);
    Display.setFill('rgb(50,50,255)');
    Display.fillRect(PathfindExample.instance.stop.x * blockSize + 25, PathfindExample.instance.stop.y * blockSize + 25, blockSize - 50, blockSize - 50);


    if (Pathfind.LastPath.open) {
        Display.setFill('rgb(55,55,55)');
        Display.setFont(20, 'sans-serif');
        c = Pathfind.LastPath.closed.length;
        while (c--) {
            closedBlock = Pathfind.LastPath.closed[c];
            Display.fillText('c' + c.toFixed(0), closedBlock.x * blockSize + 5, closedBlock.y * blockSize + 21);
        }
    }


    var x = PathfindExample.instance.grid.Block.length;
    while (x--) {
        var y = PathfindExample.instance.grid.Block[x].length;
        while (y--) {
            if (PathfindExample.instance.grid.Block[x][y].status >= BlockStatus.NotPassable) {
                Display.setFill('rgba(255,75,75,.5)');
            } else {
                Display.setFill('rgba(75,75,75,.4)');

            }
            Display.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
    }

    Display.setFont(40, 'sans-serif');
    Display.setFill('rgb(255,255,255)');
    if (PathfindExample.instance.grid.blockStatus(PathfindExample.instance.start.x, PathfindExample.instance.start.y) >= BlockStatus.NotPassable)
        Display.fillText('The start point is blocked.', 10, 50);
    if (PathfindExample.instance.grid.blockStatus(PathfindExample.instance.stop.x, PathfindExample.instance.stop.y) >= BlockStatus.NotPassable)
        Display.fillText('The target is blocked.', 10, 100);
    Display.Settings.DisableTranslation = false;
};

PathfindExample.update = function () {
    Display.setDrawCanvas('Main');
    Display.clear();
    Display.Settings.InverseQuality();
    Display.drawImage(Display.canvasList['path'], 0, 0);
    Display.Settings.InverseQuality();
    setTimeout(function () {
        PathfindExample.update();
    }, 1000 / 30);
};
