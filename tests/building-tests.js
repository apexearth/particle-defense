describe('Building Tests', function () {
    var Player = require('../src/game/Player');
    var Level = require('../src/game/Level');
    var Levels = require('../src/game/Levels');
    var Buildings = require('../src/game/buildings/');
    var Building = require('../src/game/buildings/building');
    var Unit = require('../src/game/units/unit');
    var PlayerCommands = require('../src/game/PlayerCommands');
    var expect = require('chai').expect;
    var Gun = Buildings.Gun;

    it('should attack units in range of any of it\'s weapons', function () {
        var level = Levels.LevelTest();
        level.player.resources.ammo = 10;
        var unit = new Unit(level, {x: level.width / 2, y: level.height / 2});
        level.units.push(unit);
        var turret = new Gun(level, level.player, {blockX: unit.blockX, blockY: unit.blockY + 2});
        turret.weapons[0].range = 1000;

        level.buildings.push(turret);
        level.player.buildings.push(turret);
        var health = unit.health;

        level.update();
        expect(turret.weapons[0].target).not.to.equal(null);
        expect(level.projectiles.length).to.be.above(0);

        var i = 50;
        while (i--)
            level.update();
        expect(health).to.be.above(unit.health);
    });

    it('should not attack units out of range', function () {
        var level = Levels.LevelTest();
        var unit = new Unit(level, {x: level.player.homeBase.x - 50, y: level.player.homeBase.y - 50});
        unit.setDestination(level.player.homeBase);
        level.units.push(unit);
        var turret = new Gun(level, level.player, 5, 9);
        turret.weapons[0].range = 10;
        level.buildings.push(turret);

        var health = unit.health;
        level.update();
        expect(health).to.equal(unit.health);
    });

    it('can provide energy and metal', function () {
        var level = Levels.LevelTest();
        var energy = level.player.resources.energy = 0;
        var metal = level.player.resources.metal = 0;
        level.update();
        level.update();
        level.update();
        level.update();
        expect(energy).to.be.below(level.player.resources.energy);
        expect(metal).to.be.below(level.player.resources.metal);
    });

    it('can be sold', function () {
        var level = new Level(10, 10);
        level.addPlayer(new Player());
        for (var resource in Gun.cost) {
            if (Gun.cost.hasOwnProperty(resource)) {
                level.player.resources[resource] += Gun.cost[resource];
            }
        }
        var building = PlayerCommands.CreateBuilding(level.player, Gun, 1, 1);
        PlayerCommands.SellBuilding(building);
        expect(level.player.resources.metal).to.be.above(0);
    });

    it('buildings can be selected and deselected', function () {
        var level = Levels.LevelTest();
        var block = level.getBlock(5, 5);
        var building = block.GetBuilding();
        expect(building).to.not.equal(null);
        level.selectBuildingAt(block);
        expect(level.selection).to.equal(building);
        expect(building.selected).to.equal(true);

        level.deselect();
        expect(level.selection).to.equal(null);
        expect(building.selected).to.equal(false);
    });

    it('when selected, it\'s menu is available', function () {
        var building = new Buildings.Gun(null, null, {});
        expect(building.abilities).to.not.be.undefined;
        expect(building.abilities).to.equal(null);
        building.selected = true;
        expect(building.abilities).to.not.equal(null);
    });
});
