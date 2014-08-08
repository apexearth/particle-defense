/// <reference path="/Game/ParticleDefense.js" />
/// <reference path="/Game/Level.js" />
/// <reference path="/Game/Buildings/Turret_Mini.js" />
Level.LevelOne = function () {
    var level = new Level(11, 11);

    var player = new Player(level);
    level.AddPlayer(player);
    level.Player = player;
    player.Resources.Energy = 50;
    player.Resources.Metal = 25;
    level.AddBuilding(new HomeBase(level, player, 5, 10));
    var turret = level.AddBuilding(new Turret_Mini(level, level.Player, 4, 5));

    level.WaveDelay = ParticleDefense.Second * 10;
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 160), ParticleDefense.Second * .125);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 10), ParticleDefense.Second * 2);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 20), ParticleDefense.Second * 1);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 40), ParticleDefense.Second * .5);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 80), ParticleDefense.Second * .25);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 160), ParticleDefense.Second * .125);

    level.Player.HomeBase.Health = 0;

    return level;
}
Level.LevelOne.Name = "Level One";