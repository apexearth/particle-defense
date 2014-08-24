describe('Building Tests', function () {
    var Levels, Buildings, Unit, PlayerCommands;
    var Gun;
    beforeEach(function () {
        runs(function () {
            require(["game/Levels", "game/Buildings", "game/Unit", "game/PlayerCommands"], function (levels, buildings, unit, playerCommands) {
                Levels = levels;
                Buildings = buildings;
                Unit = unit;
                PlayerCommands = playerCommands;
                Gun = Buildings.Gun;
            });
        });
        waitsFor(function () {
            return Levels;
        }, 300);
        waitsFor(function () {
            return Buildings;
        }, 300);
        waitsFor(function () {
            return Unit;
        }, 300);
        waitsFor(function () {
            return PlayerCommands;
        }, 300);
    });

    it('should attack units in range of any of it\'s weapons', function () {
        var level = Levels.LevelEmpty();
        level.Player.Resources.Ammo = 10;
        var unit = new Unit(level, level.Width / 2, level.Height / 2);
        level.Units.push(unit);
        var turret = new Gun(level, level.Player, unit.BlockX, unit.BlockY + 2);
        turret.Weapon.Range = 1000;

        level.Buildings.push(turret);
        level.Player.Buildings.push(turret);
        var health = unit.Health;

        level.update();
        expect(turret.Weapon.Target).not.toBe(null);
        expect(level.Projectiles.length).toBeGreaterThan(0);

        var i = 50;
        while (i--)
            level.update();
        expect(health).toBeGreaterThan(unit.Health);
    });

    it('should not attack units out of range', function () {
        var level = Levels.LevelEmpty();
        var unit = new Unit(level, level.Player.HomeBase.X - 50, level.Player.HomeBase.Y - 50);
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);
        var turret = new Gun(level, level.Player, 5, 9);
        turret.Weapon.Range = 10;
        level.Buildings.push(turret);

        var health = unit.Health;
        level.update();
        expect(health).toBe(unit.Health);
    });

    it('can provide energy and metal', function () {
        var level = Levels.LevelEmpty();
        var energy = level.Player.Resources.Energy;
        var metal = level.Player.Resources.Metal;
        level.update();
        expect(energy).toBeLessThan(level.Player.Resources.Energy);
        expect(metal).toBeLessThan(level.Player.Resources.Metal);
    });

    it('can be sold', function () {
        var level = Levels.LevelEmpty();
        level.Player.Resources.Energy = Gun.Cost.Energy;
        level.Player.Resources.Metal = Gun.Cost.Metal;
        var building = PlayerCommands.CreateBuilding(level.Player, Gun, 1, 1);
        PlayerCommands.SellBuilding(building);
        expect(level.Player.Resources.Metal).toBeGreaterThan(0);
    });

    it('can be selected', function () {
        var level = Levels.LevelEmpty();
        var building = level.Player.HomeBase;
        var selection = level.SelectBuildingAt(building.BlockX, building.BlockY);
        expect(selection).toBe(building);
        expect(level.Selection).toBe(building);
    });
});
