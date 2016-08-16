describe('Building Tests', function () {
    var Levels = require("../src/game/Levels");
    var Buildings = require("../src/game/buildings/");
    var Building = require("../src/game/buildings/building");
    var Unit = require("../src/game/units/unit");
    var PlayerCommands = require("../src/game/PlayerCommands");
    var expect = require("chai").expect;
    var Gun = Buildings.Gun;

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
        expect(turret.Weapons[0].Target).not.to.equal(null);
        expect(level.Projectiles.length).to.be.above(0);

        var i = 50;
        while (i--)
            level.update();
        expect(health).to.be.above(unit.Health);
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
        expect(health).to.equal(unit.Health);
    });

    it('can provide energy and metal', function () {
        var level = Levels.LevelTest();
        var energy = level.Player.Resources.Energy = 0;
        var metal = level.Player.Resources.Metal = 0;
        level.update();
        level.update();
        level.update();
        level.update();
        expect(energy).to.be.below(level.Player.Resources.Energy);
        expect(metal).to.be.below(level.Player.Resources.Metal);
    });

    it('can be sold', function () {
        var level = Levels.LevelTest();
        level.Player.Resources.Energy = Gun.Cost.Energy;
        level.Player.Resources.Metal = Gun.Cost.Metal;
        var building = PlayerCommands.CreateBuilding(level.Player, Gun, 1, 1);
        PlayerCommands.SellBuilding(building);
        expect(level.Player.Resources.Metal).to.be.above(0);
    });

    it('buildings can be selected and deselected', function () {
        var level = Levels.LevelTest();
        var block = level.getBlock(5, 5);
        var building = block.GetBuilding();
        expect(building).to.not.equal(null);
        level.SelectBuildingAt(block);
        expect(level.Selection).to.equal(building);
        expect(building.IsSelected()).to.equal(true);

        level.Deselect();
        expect(level.Selection).to.equal(null);
        expect(building.IsSelected()).to.equal(false);
    });

    it('when selected, it\'s menu is available', function () {
        var building = new Buildings.Gun(null, null, {});
        expect(building.Abilities).to.not.be.undefined;
        expect(building.Abilities).to.equal(null);
        building.Select();
        expect(building.Abilities).to.not.equal(null);
        expect(building.Abilities.constructor).to.equal(Building.Abilities);
    });
});
