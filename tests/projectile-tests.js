describe('Projectile Tests', function () {
    var Levels = require("../src/game/Levels");
    var Projectiles = require("../src/game/projectiles");
    var math = require("../src/util/math");
    var Unit = require("../src/game/units/Unit")
    var expect = require("chai").expect;

    it('should move', function () {
        var level = Levels.LevelTest();
        var building = level.Buildings[1];
        var projectile = new Projectiles.Bullet(
            building.Weapons[0],
            math.angle(0, 0, 50, 50),
            2);
        level.Projectiles.push(projectile);
        level.update();
        expect(projectile.X).to.be.above(0);
        expect(projectile.Y).to.be.above(0);
    });

    it('should die on impact, by default', function () {
        var level = Levels.LevelTest();
        var building = level.Buildings[1];
        var unit = new Unit(level, {X: building.X - 50, Y: building.Y});
        level.Units.push(unit);

        var projectile = new Projectiles.Bullet(
            building.Weapons[0],
            math.angle(building.X, building.Y, unit.X, unit.Y),
            3);
        level.Projectiles.push(projectile);

        var i = 30;
        while (i--) level.update();
        expect(level.Projectiles.length).to.equal(0);
    });

    it('should die when outside of level', function () {
        var level = Levels.LevelTest();
        level.Waves = [];
        var building = level.Buildings[1];
        var projectile = new Projectiles.Bullet(building.Weapons[0],
            0,
            5);
        level.Projectiles.push(projectile);

        expect(level.Projectiles.length).to.equal(1);
        level.update();
        expect(level.Projectiles.length).to.equal(1);

        var i = 200;
        while (i-->0 && level.Projectiles.length > 0) level.update();
        expect(level.Projectiles.length).to.equal(0);
    });
});
