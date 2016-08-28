describe('Building', function () {
    var math = require('../../util/math');
    var Player = require('../Player');
    var Levels = require('../levels/');
    var Level = Levels.Level;
    var Buildings = require('./');
    var Building = require('./Building');
    var weapons = require('../weapons');
    var Unit = require('../units/unit');
    var PlayerCommands = require('../PlayerCommands');
    var expect = require('chai').expect;
    var Gun = Buildings.Gun;

    it('initialization', function () {
        var options = {
            level: new Level(),
            player: new Player()
        };
        var building = new Building(options);

        expect(building.level).to.equal(options.level);
        expect(building.player).to.equal(options.player);
        expect(building.container).to.exist;
        expect(building.width).to.be.greaterThan(0);
        expect(building.height).to.be.greaterThan(0);

        expect(building.health).to.be.greaterThan(0);
        expect(building.abilities).to.not.exist;

        expect(building.resourceGeneration).to.exist;
        expect(building.resourceStorage).to.exist;

        expect(building.weapons).to.be.an('array');
        expect(building.updates).to.be.an('array');

        expect(building.position).to.exist;
        expect(building.position.x).to.equal(building.width / 2);
        expect(building.position.y).to.equal(building.height / 2);

        options.level.addBuilding(building);
        expect(building.block).to.exist;
        expect(building.block.x).to.equal(0);
        expect(building.block.y).to.equal(0);
    });

    it('.addWeapon()', function () {
        var options = {
            level: new Level(),
            player: new Player()
        };
        var building = new Building(options);
        var weapon = new weapons.Gun(Object.assign({building: building}, options));
        expect(building.weapons.length).to.equal(0);
        building.addWeapon(weapon);
        expect(building.weapons.length).to.equal(1);
    });

    it('.removeWeapon()', function () {
        var options = {
            level: new Level(),
            player: new Player()
        };
        var building = new Building(options);
        var weapon = new weapons.Gun(Object.assign({building: building}, options));
        expect(building.weapons.length).to.equal(0);
        building.addWeapon(weapon);
        expect(building.weapons.length).to.equal(1);
        building.removeWeapon(weapon);
        expect(building.weapons.length).to.equal(0);
    });

    it('should attack units in range of any of it\'s weapons', function () {
        var level = new Level();
        var player1 = new Player();
        var player2 = new Player();
        level.addPlayer(player1);
        level.addPlayer(player2);
        level.player = player1;
        level.player.resources.ammo = 10;
        var turret = new Gun({
            level: level,
            player: level.player,
            blockX: 3,
            blockY: 5
        });
        turret.weapons[0].range = 1000;
        level.addBuilding(turret);

        var unit = new Unit({
            level: level,
            player: level.players[1],
            position: {
                x: turret.position.x + 15,
                y: turret.position.y
            }
        });
        level.addUnit(unit);

        turret.rotation = math.angle(turret.position.x, turret.position.y, unit.position.x, unit.position.y);

        var initialHealth = unit.health;

        level.update();
        expect(turret.weapons[0].target).not.to.equal(null);
        expect(level.projectiles.length).to.be.above(0);

        // Unit is placed close enough that after the second update it should be hit.
        level.update();
        expect(unit.health).to.be.below(initialHealth);
    });

    it('should not attack units out of range', function () {
        var level = Levels.LevelTest();
        var unit = new Unit({
            level: level,
            player: level.players[1],
            position: {
                x: level.player.homeBase.position.x,
                y: level.player.homeBase.position.y
            }
        });
        level.addUnit(unit);

        var turret = new Gun({
            level: level,
            player: level.player,
            blockX: 5,
            blockY: 9
        });
        turret.weapons[0].range = 10;
        level.buildings.push(turret);

        var initialHealth = unit.health;
        level.update();
        expect(initialHealth).to.equal(unit.health);
    });

    it('can provide energy and metal', function () {
        var level = new Level();
        var player = new Player();
        level.addPlayer(player);
        var building = new Buildings.HomeBase({
            level: level,
            player: player
        });
        level.addBuilding(building);

        var energy = level.player.resources.energy;
        var metal = level.player.resources.metal;
        level.update();
        level.update();
        level.update();
        level.update();
        expect(energy).to.be.below(level.player.resources.energy);
        expect(metal).to.be.below(level.player.resources.metal);
    });

    it('can be sold', function () {
        var level = new Level();
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
        expect(block.building).to.not.equal(null);
        level.selectBuildingAt(block);
        expect(level.selection).to.equal(block.building);
        expect(block.building.selected).to.equal(true);

        level.deselect();
        expect(level.selection).to.equal(null);
        expect(block.building.selected).to.equal(false);
    });

    it('when selected, it\'s menu is available', function () {
        var building = new Buildings.Gun({
            level: new Level(),
            player: new Player()
        });
        expect(building.abilities).to.not.be.undefined;
        expect(building.abilities).to.equal(null);
        building.selected = true;
        expect(building.abilities).to.not.equal(null);
    });
});
