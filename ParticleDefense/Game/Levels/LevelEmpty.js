/// <reference path="/Game/Level.js" />
/// <reference path="/Game/Buildings/Turret_Gun.js" />
Level.LevelEmpty = function () {
    var level = new Level(11, 11);

    var player = new Player(level);
    level.AddPlayer(player);
    level.Player = player;
    level.AddBuilding(new HomeBase(level, player, 5, 5));

    return level;
}
Level.LevelEmpty.Name = "Level Empty";