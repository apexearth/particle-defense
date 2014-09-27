describe('Building Tests', function () {
    var Levels, Buildings, Building, Unit, PlayerCommands;
    var Gun;
    beforeEach(function () {
        runs(function () {
            require(["game/Levels", "game/Buildings", "game/Building", "game/Unit", "game/PlayerCommands"], function (levels, buildings, building, unit, playerCommands) {
                Levels = levels;
                Buildings = buildings;
                Building = building;
                Unit = unit;
                PlayerCommands = playerCommands;
                Gun = Buildings.Gun;
            });
        });
        waitsFor(function () {
            return Levels != null
                && Buildings != null
                && Building != null
                && Unit != null
                && PlayerCommands != null;
        }, 300);
    });

    it('should attack units in range of any of it\'s weapons', function () {
        var level = Levels.LevelTest();
        level.Player.Resources.Ammo = 10;
        var unit = new Unit(level, {X: level.Width / 2, Y: level.Height / 2});
        level.Units.push(unit);
        var turret = new Gun(level, level.Player, {BlockX: unit.BlockX, BlockY: unit.BlockY + 2});
        turret.Weapons[0].Range = 1000;

        level.Buildings.push(turret);
        level.Player.Buildings.push(turret);
        var health = unit.Health;

        level.update();
        expect(turret.Weapons[0].Target).not.toBe(null);
        expect(level.Projectiles.length).toBeGreaterThan(0);

        var i = 50;
        while (i--)
            level.update();
        expect(health).toBeGreaterThan(unit.Health);
    });

    it('should not attack units out of range', function () {
        var level = Levels.LevelTest();
        var unit = new Unit(level, {X: level.Player.HomeBase.X - 50, Y: level.Player.HomeBase.Y - 50});
        unit.setDestination(level.Player.HomeBase);
        level.Units.push(unit);
        var turret = new Gun(level, level.Player, 5, 9);
        turret.Weapons[0].Range = 10;
        level.Buildings.push(turret);

        var health = unit.Health;
        level.update();
        expect(health).toBe(unit.Health);
    });

    it('can provide energy and metal', function () {
        var level = Levels.LevelTest();
        var energy = level.Player.Resources.Energy = 0;
        var metal = level.Player.Resources.Metal = 0;
        level.update();
        level.update();
        level.update();
        level.update();
        expect(energy).toBeLessThan(level.Player.Resources.Energy);
        expect(metal).toBeLessThan(level.Player.Resources.Metal);
    });

    it('can be sold', function () {
        var level = Levels.LevelTest();
        level.Player.Resources.Energy = Gun.Cost.Energy;
        level.Player.Resources.Metal = Gun.Cost.Metal;
        var building = PlayerCommands.CreateBuilding(level.Player, Gun, 1, 1);
        PlayerCommands.SellBuilding(building);
        expect(level.Player.Resources.Metal).toBeGreaterThan(0);
    });

    it('buildings can be selected and deselected', function () {
        var level = Levels.LevelTest();
        var block = level.getBlock(5, 5);
        var building = block.GetBuilding();
        expect(building).not.toBeNull();
        level.SelectBuildingAt(block);
        expect(level.Selection).toBe(building);
        expect(building.IsSelected()).toBe(true);

        level.Deselect();
        expect(level.Selection).toBeNull();
        expect(building.IsSelected()).toBe(false);
    });

    it('when selected, it\'s menu is available', function () {
        var building = new Buildings.Gun(null, null, {});
        expect(building.Abilities).toBeDefined();
        expect(building.Abilities).toBeNull();
        building.Select();
        expect(building.Abilities).not.toBeNull();
        expect(building.Abilities.constructor).toBe(Building.Abilities);
    });
});
