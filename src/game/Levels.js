define("game/Levels", ["game/Level", "game/Settings", "game/Player", "game/Buildings", "game/Unit"], function (Level, Settings, Player, Buildings, Unit) {
    var LevelEmpty = function () {
        var level = new Level(11, 11);

        var player = new Player(level);
        level.AddPlayer(player);
        level.Player = player;
        level.AddBuilding(new Buildings.HomeBase(level, player, 5, 5));

        return level;
    };
    LevelEmpty.Name = "Level Empty";

    var LevelTest = function () {
        var level = new Level(11, 11);

        var player = new Player(level);
        level.AddPlayer(player);
        level.Player = player;
        player.Resources.Energy = 50;
        player.Resources.Metal = 25;
        level.AddBuilding(new Buildings.HomeBase(level, player, 5, 5));
        var turret = level.AddBuilding(new Buildings.Turret_Gun(level, level.Player, 4, 5));

        level.WaveDelay = 0;
        level.createWave(Unit.Array(function () {
            return new Unit(level, turret.X - 50, turret.Y);
        }, 5), 30);
        level.createWave(Unit.Array(function () {
            return new Unit(level, turret.X - 50, turret.Y);
        }, 5), 30);

        return level;
    };
    LevelTest.Name = "Level Test";

    var LevelOne = function () {
        var level = new Level(21, 21);

        var player = new Player(level);
        level.AddPlayer(player);
        level.Player = player;
        player.Resources.Energy = 100;
        player.Resources.Metal = 50;
        level.AddBuilding(new Buildings.HomeBase(level, player, 10, 10));

        level.WaveDelay = Settings.Second * 2;
        level.createWave(Unit.Array(function () {
            return new Unit(level, level.Width / 2, 0);
        }, 10), Settings.Second * 2);
        level.createWave(Unit.Array(function () {
            return new Unit(level, level.Width / 2, 0);
        }, 20), Settings.Second);
        level.createWave(Unit.Array(function () {
            return new Unit(level, level.Width / 2, 0);
        }, 40), Settings.Second * .5);
        level.createWave(Unit.Array(function () {
            return new Unit(level, level.Width / 2, 0);
        }, 80), Settings.Second * .25);
        level.createWave(Unit.Array(function () {
            return new Unit(level, Math.random() * level.Width, 0);
        }, 80), Settings.Second * .25);
        level.createWave(Unit.Array(function () {
            return new Unit(level, level.Width / 2, 0);
        }, 160), Settings.Second * .25);

        return level;
    };
    LevelOne.Name = "Level One";

    return {
        LevelEmpty: LevelEmpty,
        LevelTest: LevelTest,
        LevelOne: LevelOne
    };
});