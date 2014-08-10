/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/Unit.js"/>
/// <reference path="~/Game/Buildings/Turret_Gun.js"/>
/// <reference path="~/Game/Levels/LevelEmpty.js"/>
/// <reference path="~/Game/Levels/LevelTest.js"/>
/// <reference path="~/Game/PlayerCommands.js"/>
/// <reference path="~/Game/Level.js"/>
/// <reference path="~/Game/Map.js"/>
/// <reference path="~/util/Keyboard.js"/>
describe('Building Tests', function () {
    it('should attack units in range of any of it\'s weapons', function () {
        var level = Level.LevelEmpty();
        var unit = new Unit(level, level.Width / 2, level.Height / 2);
        level.Units.push(unit);
        var turret = new Turret_Gun(level, level.Player, unit.BlockX, unit.BlockY + 1);
        
        level.Buildings.push(turret);
        var health = unit.Health;

        level.update();
        expect(turret.Weapon.Target).toNotBe(null);
        expect(level.Projectiles.length).toBeGreaterThan(0);

        var i = 20;
        while (i--)
            level.update();
        expect(health).toBeGreaterThan(unit.Health);
    });

    it('should not attack units out of range', function () {
        var level = Level.LevelTest();
        var unit = new Unit(level, level.Player.HomeBase.X - 50, level.Player.HomeBase.Y - 50);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);
        var turret = new Turret_Gun(level, level.Player, 5, 9);
        turret.Weapon.Range = 10;
        level.Buildings.push(turret);

        var health = unit.Health;
        level.update();
        expect(health).toBe(unit.Health);
    });

    it('can provide energy and metal', function () {
        var level = Level.LevelTest();
        var energy = level.Player.Resources.Energy;
        var metal = level.Player.Resources.Metal;
        level.update();
        expect(energy).toBeLessThan(level.Player.Resources.Energy);
        expect(metal).toBeLessThan(level.Player.Resources.Metal);
    });
    it('can be sold', function() {
        var level = Level.LevelEmpty();
        level.Player.Resources.Energy = Turret_Gun.Cost.Energy;
        level.Player.Resources.Metal = Turret_Gun.Cost.Metal;
        var building = PlayerCommands.CreateBuilding(level.Player, Turret_Gun, 1, 1);
        PlayerCommands.SellBuilding(building);
        expect(level.Player.Resources.Metal).toBeGreaterThan(0);
    });
});
