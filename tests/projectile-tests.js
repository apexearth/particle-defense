describe('Projectile Tests', function () {
    var Levels = require('../src/game/levels');
    var Level = require('../src/game/levels/Level');
    var Player = require('../src/game/Player');
    var Projectiles = require('../src/game/projectiles');
    var math = require('../src/util/math');
    var Unit = require('../src/game/units/Unit');
    var expect = require('chai').expect;

    it('should move', function () {
        var level = Levels.LevelTest();
        var projectile = new Projectiles.Bullet({
            level: level,
            player: level.players[0],

            damage: 1,
            velocity: 10,
            position: {x: 100, y: 100},
            direction: math.angle(0, 0, 50, 50)
        });

        level.addProjectile(projectile);
        level.update();
        expect(projectile.position.x).to.be.above(100);
        expect(projectile.position.y).to.be.above(100);
    });

    it('should die on impact, by default', function () {
        var level = Levels.LevelTest();
        var unit = new Unit({
            level: level,
            player: level.players[0],
            position: {
                x: 100,
                y: 100
            }
        });
        level.addUnit(unit);

        var projectile = new Projectiles.Bullet({
            level: level,
            player: level.players[0],
            direction: math.angle(110, 100, unit.position.x, unit.position.y),
            position: {
                x: 110,
                y: 100
            },
            damage: 1,
            velocity: 10
        });
        level.addProjectile(projectile);

        level.update();
        expect(level.projectiles.length).to.equal(0);
    });

    it('should die when outside of level', function () {
        var level = new Level();
        var player = new Player();
        level.addPlayer(player);
        var projectile = new Projectiles.Bullet({
            level: level,
            player: player,
            direction: Math.PI,
            position: {x: 1, y: 1},
            damage: 1,
            velocity: 3
        });
        level.addProjectile(projectile);

        expect(level.projectiles.length).to.equal(1);
        level.update();
        expect(level.projectiles.length).to.equal(0);
    });
});
