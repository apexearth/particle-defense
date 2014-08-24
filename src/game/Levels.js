define("game/Levels", ["game/Level", "game/Settings", "game/Player", "game/Buildings", "game/Units"], function (Level, Settings, Player, Buildings, Units) {
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
        var turret = level.AddBuilding(new Buildings.Gun(level, level.Player, 4, 5));

        level.WaveDelay = 0;
        level.createWave(Units.Array(function () {
            var unit = new Units.UnitCircle(level, turret.X - 50, turret.Y);
            unit.Radius = 3;
            unit.Health = 10;
            unit.MoveSpeed = 1;
            return unit;
        }, 5), 30);
        level.createWave(Unit.Array(function () {
            var unit = new Units.UnitCircle(level, turret.X - 50, turret.Y);
            unit.Radius = 3;
            unit.Health = 20;
            unit.MoveSpeed = .5;
            return unit;
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
        level.createWave(Units.Array(function () {
            var unit = new Units.UnitCircle(level, level.Width / 2, 0);
            unit.Radius = 3;
            unit.Health = 10;
            unit.MoveSpeed = 1;
            return unit;
        }, 10), Settings.Second * 2);
        level.createWave(Units.Array(function () {
            var unit = new Units.UnitCircle(level, level.Width / 2, 0);
            unit.Radius = 6;
            unit.Health = 30;
            unit.MoveSpeed = .5;
            unit.FillColor = '#afa';
            return unit;
        }, 20), Settings.Second * 2);
        level.createWave(Units.Array(function () {
            var unit = new Units.UnitCircle(level, level.Width / 2, 0);
            unit.Radius = 4;
            unit.Health = 15;
            unit.MoveSpeed = 1;
            unit.FillColor = '#aff';
            return unit;
        }, 40), Settings.Second);
        level.createWave(Units.Array(function () {
            var unit = new Units.UnitCircle(level, level.Width / 2, 0);
            unit.Radius = 3;
            unit.Health = 10;
            unit.MoveSpeed = 1;
            return unit;
        }, 80), Settings.Second * .25);
        level.createWave(Units.Array(function () {
            var unit = new Units.UnitCircle(level, Math.random() * level.Width, 0);
            unit.Radius = 3;
            unit.Health = 12;
            unit.MoveSpeed = 1;
            unit.FillColor = '#faa';
            return unit;
        }, 80), Settings.Second * .25);
        level.createWave(Units.Array(function () {
            var unit = new Units.UnitCircle(level, Math.random() * level.Width, 0);
            unit.Radius = 3 + Math.ceil(Math.random() * 3);
            unit.Health = unit.Radius * 5;
            unit.MoveSpeed = unit.Radius / 10;
            unit.FillColor = '#ffa';
            return unit;
        }, 160), Settings.Second * .35);

        return level;
    };
    LevelOne.Name = "Level One";

    return {
        LevelEmpty: LevelEmpty,
        LevelTest: LevelTest,
        LevelOne: LevelOne
    };
});