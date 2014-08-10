/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/Unit.js"/>
/// <reference path="~/Game/Buildings/Turret_Gun.js"/>
/// <reference path="~/Game/Level.js"/>
/// <reference path="~/Game/Levels/LevelTest.js"/>
/// <reference path="~/Game/Projectile.js"/>
/// <reference path="~/Game/Map.js"/>
/// <reference path="~/util/Keyboard.js"/>
describe('Projectile Tests', function () {
    it('should move', function () {
        var level = Level.LevelTest();
        var projectile = new Bullet(level,
            0,
            0,
            General.AngleRad(0, 0, 50, 50),
            5,
            0);
        level.Projectiles.push(projectile);
        level.update();
        expect(projectile.X).toBeGreaterThan(0);
        expect(projectile.Y).toBeGreaterThan(0);
    });

    it('should die on impact, by default', function () {
        var level = Level.LevelTest();
        var unit = new Unit(level, level.Player.HomeBase.X - 50, level.Player.HomeBase.Y);
        level.Units.push(unit);

        var projectile = new Bullet(level,
            unit.X + 20,
            unit.Y,
            General.AngleRad(unit.X + 20, unit.Y, unit.X, unit.Y),
            1,
            0);
        level.Projectiles.push(projectile);

        var i = 30;
        while (i--) level.update();
        expect(level.Projectiles.length).toBe(0);
    });

    it('should die when outside of level', function () {
        var level = new Level(10, 10);
        var projectile = new Bullet(level,
            25,
            25,
            180,
            5,
            0);
        level.Projectiles.push(projectile);

        expect(level.Projectiles.length).toBe(1);
        level.update();
        expect(level.Projectiles.length).toBe(1);

        var i = 20;
        while (i--) level.update();
        expect(level.Projectiles.length).toBe(0);
    });
});
