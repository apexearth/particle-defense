function Pathfind() { }

Pathfind.Settings = function () { };
Pathfind.Settings.DiagonalMovement = true;
Pathfind.Settings.BlockedDiagonalMovement = false;
Pathfind.Settings.CleanObjects = false;

Pathfind.LastPath = function () { };
Pathfind.LastPath.path = null;
Pathfind.LastPath.open = null;
Pathfind.LastPath.closed = null;

Pathfind.getPathByBlock = function (grid, blockStart, blockTarget) {
    if (grid.getBlockFromVector(blockStart) == null) return [];
    if (grid.getBlockFromVector(blockTarget) == null) return [];

    var closed = [];
    var open = [];

    var start = blockStart;
    if (start.IsBlocked) return [];
    var current = start;
    var target = blockTarget;
    if (target.IsBlocked) return [];

    Pathfind.calculate(current, null, current, target);
    open.push(current);
    while (
        (open.length > 0 || closed.indexOf(target) === -1)
            && current !== target
        ) {
        if (open.length == 0) current = target;
        Pathfind.processBestScorer(grid, current, start, target, open, closed);
        current = Pathfind.getBestScorer(current, open);
    }
    var path = [];
    current = target;
    if (current.Pathfind != null) {
        while (current.Pathfind.Parent != null) {
            path.splice(0, 0, current);
            current = current.Pathfind.Parent;
        }
        path.splice(0, 0, current);
    }

    Pathfind.LastPath.path = path;
    Pathfind.LastPath.open = open;
    Pathfind.LastPath.closed = closed;

    if (Pathfind.Settings.CleanObjects) {
        Pathfind.cleanList(open);
        Pathfind.cleanList(closed);
    }

    // duplicate path object as vector
    // (this is so the caller can modify it)
    var vectors = [];
    for (var i = 1; i < path.length; i++) {
        var block = path[i];
        vectors.push({ X: block.X, Y: block.Y });
    }
    return vectors;
};
Pathfind.getPathByVector = function (grid, vectorFrom, vectorTo) {
    var start = grid.getBlock(vectorFrom.X, vectorFrom.Y);
    var target = grid.getBlock(vectorTo.X, vectorTo.Y);
    return Pathfind.getPathByBlock(grid, start, target);
};

Pathfind.processBestScorer = function (grid, current, start, target, open, closed) {
    closed.push(open.splice(open.indexOf(current), 1)[0]);
    var adjacentBlocks = grid.getAdjacentBlocks(current.X, current.Y, Pathfind.Settings.DiagonalMovement);
    var i = adjacentBlocks.length;
    while (i--) {
        var adjacentBlock = adjacentBlocks[i];
        if (adjacentBlock != null && !adjacentBlock.IsBlocked && closed.indexOf(adjacentBlock) == -1 && Pathfind.diagonalScreen(current, adjacentBlock)) {
            if (open.indexOf(adjacentBlock) == -1) {
                open.push(adjacentBlock);
                Pathfind.calculate(adjacentBlock, current, start, target);
            } else {
                var cost = Pathfind.calculateScore(current.X, current.Y, adjacentBlock.X, adjacentBlock.Y);
                if (current.Pathfind.ScoreStart + cost < adjacentBlock.Pathfind.ScoreStart) {
                    Pathfind.calculate(adjacentBlock, current, start, target);
                }
            }
        }
    }
};
Pathfind.getBestScorer = function (current, open) {
    var i = open.length, best = null;
    while (i--) {
        var block = open[i];
        if (best == null || best.Pathfind.Score > block.Pathfind.Score) {
            best = block;
        }
    }
    return best;
};

Pathfind.diagonalScreen = function (current, adjacent) {
    return Pathfind.Settings.BlockedDiagonalMovement || adjacent.X == current.X || adjacent.Y == current.Y
        || adjacent.X < current.X && (adjacent.Y < current.Y && (adjacent.BottomBlock == null || !adjacent.BottomBlock.IsBlocked) && (adjacent.RightBlock == null || !adjacent.RightBlock.IsBlocked)
        || current.Y < adjacent.Y && (adjacent.TopBlock == null || !adjacent.TopBlock.IsBlocked) && (adjacent.RightBlock == null || !adjacent.RightBlock.IsBlocked))
        || adjacent.X > current.X && (adjacent.Y < current.Y && (adjacent.BottomBlock == null || !adjacent.BottomBlock.IsBlocked) && (adjacent.LeftBlock == null || !adjacent.LeftBlock.IsBlocked)
            || current.Y < adjacent.Y && (adjacent.TopBlock == null || !adjacent.TopBlock.IsBlocked) && (adjacent.LeftBlock == null || !adjacent.LeftBlock.IsBlocked));
};
Pathfind.calculateScore = function (currentX, currentY, targetX, targetY) {
    var x = Math.abs(targetX - currentX);
    var y = Math.abs(targetY - currentY);
    var straight = Math.max(x, y) - Math.min(x, y);
    var diagonal = Math.max(x, y) - straight;
    return straight * 10 + diagonal * 14;
};

Pathfind.calculate = function (block, parent, start, target) {
    block.Pathfind = function () { };
    if (parent == null || parent.PathFind == null)
        block.Pathfind.ScoreStart = 0;
    else
        block.Pathfind.ScoreStart = Pathfind.calculateScore(block.X, block.Y, parent.X, parent.Y) + parent.Pathfind.ScoreStart;
    block.Pathfind.ScoreTarget = Pathfind.calculateScore(block.X, block.Y, target.X, target.Y);
    block.Pathfind.Score = block.Pathfind.ScoreStart + block.Pathfind.ScoreTarget;
    block.Pathfind.Parent = parent;
};

Pathfind.cleanList = function (list) {
    var i = list.length;
    while (i--) Pathfind.cleanBlock(list[i]);
};
Pathfind.cleanBlock = function (block) {
    delete block.Pathfind;
};