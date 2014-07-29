/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/Unit.js"/>
/// <reference path="~/Game/Buildings/Turret_Mini.js"/>
/// <reference path="~/Game/Levels/LevelOne.js"/>
/// <reference path="~/Game/Level.js"/>
/// <reference path="~/Game/Map.js"/>
/// <reference path="~/util/Keyboard.js"/>
describe('Building Tests', function () {
    it('should attack units in range of any of it\'s weapons', function () {
        var level = Level.LevelOne();
        level.Waves = [];
        var unit = new Unit(level, level.Width / 2, level.Height / 2);
        level.Units.push(unit);
        var turret = new Turret_Mini(level, level.Player, unit.BlockX, unit.BlockY + 1);
        level.Buildings.push(turret);
        var health = unit.Health;

        level.update();
        expect(turret.Weapon.Target).toNotBe(null);
        expect(level.Projectiles.length).toBe(1);

        var i = 20;
        while (i--)
            level.update();
        expect(health).toBeGreaterThan(unit.Health);
    });

    it('should not attack units out of range', function () {
        var level = Level.LevelOne();
        var unit = new Unit(level, level.Width / 2, level.Height / 2);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);
        var turret = new Turret_Mini(level, level.Player, 5, 9);
        level.Buildings.push(turret);

        var health = unit.Health;
        level.update();
        expect(health).toBe(unit.Health);
    });

    it('can provide energy and metal', function () {
        var level = Level.LevelOne();
        var energy = level.Player.Resources.Energy;
        var metal = level.Player.Resources.Metal;
        level.update();
        expect(energy).toBeLessThan(level.Player.Resources.Energy);
        expect(metal).toBeLessThan(level.Player.Resources.Metal);
    });
});
