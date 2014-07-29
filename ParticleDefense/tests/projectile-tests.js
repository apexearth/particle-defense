/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/Unit.js"/>
/// <reference path="~/Game/Buildings/Turret_Mini.js"/>
/// <reference path="~/Game/Level.js"/>
/// <reference path="~/Game/Levels/LevelOne.js"/>
/// <reference path="~/Game/Projectile.js"/>
/// <reference path="~/Game/Map.js"/>
/// <reference path="~/util/Keyboard.js"/>
describe('Projectile Tests', function () {
    it('should move', function () {
        var level = Level.LevelOne();
        var projectile = new Projectile(level,
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
        var level = Level.LevelOne();
        var unit = new Unit(level, level.Width / 2, level.Height / 2);
        level.Units.push(unit);

        var projectile = new Projectile(level,
            unit.X + 20,
            unit.Y,
            General.AngleRad(unit.X + 20, unit.Y, unit.X, unit.Y),
            1,
            0);
        level.Projectiles.push(projectile);

        var i = 18;
        while (i--) level.update();
        expect(level.Projectiles.length).toBe(0);
    });
});
