/// <reference path="/Game/ParticleDefense.js" />
/// <reference path="/Game/Level.js" />
/// <reference path="/Game/Buildings/Turret_Gun.js" />
Level.LevelOne = function () {
    var level = new Level(21, 21);

    var player = new Player(level);
    level.AddPlayer(player);
    level.Player = player;
    player.Resources.Energy = 100;
    player.Resources.Metal = 50;
    level.AddBuilding(new HomeBase(level, player, 10, 10));

    level.WaveDelay = ParticleDefense.Second * 2;
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 10), ParticleDefense.Second * 2);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 20), ParticleDefense.Second * 1);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 40), ParticleDefense.Second * .5);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 80), ParticleDefense.Second * .25);
    level.createWave(Unit.Array(function () { return new Unit(level, Math.random() * level.Width, 0); }, 80), ParticleDefense.Second * .25);
    level.createWave(Unit.Array(function () { return new Unit(level, level.Width / 2, 0); }, 160), ParticleDefense.Second * .25);

    return level;
}
Level.LevelOne.Name = "Level One";