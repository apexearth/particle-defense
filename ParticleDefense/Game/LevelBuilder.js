/// <reference path="~/Game/Level.js" />
var LevelBuilder = {
    Create: function () {
        var level = new Level(10, 10);
        var player = new Player(level);
        level.Players.push(player);
        level.Player = player;
        var homeBase = new HomeBase(level, player, 5, 5);
        level.Buildings.push(homeBase);
        player.HomeBase = homeBase;

        return level;
    }
};