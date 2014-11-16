describe('Projectile Tests', function () {
    var Levels, Projectiles, math, Unit;
    beforeEach(function () {
        runs(function () {
            require(["game/Levels", "../src/game/projectiles/index", "util/math!", "game/Unit"], function (levels, projectiles, customMath, unit) {
                Levels = levels;
                Projectiles = projectiles;
                math = customMath;
                Unit = unit;
            });
        });
        waitsFor(function () {
            return Levels != null
                && Projectiles != null
                && Unit != null
                && math != null;
        }, 300);
    });
    it('should move', function () {
        var level = Levels.LevelTest();
        var building = level.Buildings[1];
        var projectile = new Projectiles.Bullet(
            building.Weapons[0],
            math.angle(0, 0, 50, 50),
            2);
        level.Projectiles.push(projectile);
        level.update();
        expect(projectile.X).toBeGreaterThan(0);
        expect(projectile.Y).toBeGreaterThan(0);
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
        expect(level.Projectiles.length).toBe(0);
    });

    it('should die when outside of level', function () {
        var level = Levels.LevelTest();
        level.Waves = [];
        var building = level.Buildings[1];
        var projectile = new Projectiles.Bullet(building.Weapons[0],
            0,
            5);
        level.Projectiles.push(projectile);

        expect(level.Projectiles.length).toBe(1);
        level.update();
        expect(level.Projectiles.length).toBe(1);

        var i = 200;
        while (i-->0 && level.Projectiles.length > 0) level.update();
        expect(level.Projectiles.length).toBe(0);
    });
});
