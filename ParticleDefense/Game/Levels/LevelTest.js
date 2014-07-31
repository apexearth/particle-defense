/// <reference path="/Game/Level.js" />
/// <reference path="/Game/Buildings/Turret_Mini.js" />
Level.LevelTest = function () {
    var level = new Level(11, 11);

    var player = new Player(level);
    level.AddPlayer(player);
    level.Player = player;

    level.AddBuilding(new HomeBase(level, player, 5, 5));
    var turret = level.AddBuilding(new Turret_Mini(level, level.Player, 4, 5));
    
    level.WaveDelay = 0;
    level.createWave(Unit.Array(function () { return new Unit(level, turret.X - 50, turret.Y); }, 5), 30);
    level.createWave(Unit.Array(function () { return new Unit(level, turret.X - 50, turret.Y); }, 5), 30);

    return level;
}
Level.LevelTest.Name = "Level Test";