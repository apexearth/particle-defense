describe('Projectile Tests', function () {
    var Levels = require('../src/game/Levels');
    var Projectiles = require('../src/game/projectiles');
    var math = require('../src/util/math');
    var Unit = require('../src/game/units/Unit');
    var expect = require('chai').expect;

    it('should move', function () {
        var level = Levels.LevelTest();
        var building = level.buildings[1];
        var projectile = new Projectiles.Bullet(
            building.weapons[0],
            math.angle(0, 0, 50, 50),
            2);
        level.projectiles.push(projectile);
        level.update();
        expect(projectile.x).to.be.above(0);
        expect(projectile.y).to.be.above(0);
    });

    it('should die on impact, by default', function () {
        var level = Levels.LevelTest();
        var building = level.buildings[1];
        var unit = new Unit(level, {x: building.x - 50, y: building.y});
        level.units.push(unit);

        var projectile = new Projectiles.Bullet(
            building.weapons[0],
            math.angle(building.x, building.y, unit.x, unit.y),
            3);
        level.projectiles.push(projectile);

        var i = 30;
        while (i--) level.update();
        expect(level.projectiles.length).to.equal(0);
    });

    it('should die when outside of level', function () {
        var level = Levels.LevelTest();
        level.waves = [];
        var building = level.buildings[1];
        var projectile = new Projectiles.Bullet(building.weapons[0],
            0,
            5);
        level.projectiles.push(projectile);
    
        expect(level.projectiles.length).to.equal(1);
        level.update();
        expect(level.projectiles.length).to.equal(1);

        var i = 200;
        while (i-- > 0 && level.projectiles.length > 0) level.update();
        expect(level.projectiles.length).to.equal(0);
    });
});
