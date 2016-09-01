describe('Building', function () {
    var math = require('../../util/math');
    var Player = require('../Player');
    var Levels = require('../levels/');
    var Level = Levels.Level;
    var Buildings = require('./');
    var Building = require('./Building');
    var weapons = require('../weapons');
    var Unit = require('../units/unit');
    var coverage = require('../../../tests/check-coverage');
    var expect = require('chai').expect;
    var Gun = Buildings.Gun;

    module.exports = {
        createBuilding
    };

    function createBuilding(level, player) {
        level = level || new Level();
        player = level.player || level.addPlayer(new Player());
        var options = {
            level: level,
            player: player,
            resourceGeneration: {
                energy: 1,
                metal: 1,
                ammo: 1
            },
            resourceStorage: {
                energy: 1,
                metal: 1,
                ammo: 1
            }
        };
        return new Building(options);
    }

    it('new', function () {
        var building = createBuilding();
        expect(building.level).to.exist;
        expect(building.player).to.exist;
        expect(building.container).to.exist;
        expect(building.width).to.be.greaterThan(0);
        expect(building.height).to.be.greaterThan(0);

        expect(building.health).to.be.greaterThan(0);
        expect(building.abilities).to.not.exist;

        expect(building.resourceGeneration).to.exist;
        expect(building.resourceGeneration.energy).to.equal(1);
        expect(building.resourceGeneration.metal).to.equal(1);
        expect(building.resourceGeneration.ammo).to.equal(1);

        expect(building.resourceStorage).to.exist;
        expect(building.resourceStorage.energy).to.equal(1);
        expect(building.resourceStorage.metal).to.equal(1);
        expect(building.resourceStorage.ammo).to.equal(1);

        // The attributes object will contain Attribute instances which can upgrade properties on the object.
        expect(building.attributes).to.be.an('object');
        // Has attributes for resource generation.
        for (var key in building.resourceGeneration) {
            expect(building.attributes.resourceGeneration[key]).to.exist;
            expect(building.attributes.resourceGeneration[key].constructor.name).to.equal('Attribute');
        }
        // Has attributes for resource storage.
        for (key in building.resourceStorage) {
            expect(building.attributes.resourceStorage[key]).to.exist;
            expect(building.attributes.resourceStorage[key].constructor.name).to.equal('Attribute');
        }

        expect(building.weapons).to.be.an('array');
        expect(building.updates).to.be.an('array');

        expect(building.position).to.exist;
        expect(building.position.x).to.equal(building.width / 2);
        expect(building.position.y).to.equal(building.height / 2);

        building.level.addBuilding(building);
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
    describe('.update()', function () {
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
    });
    it('.resourceGeneration', function () {
        var level = new Level();
        var player = new Player();
        player.resourceStorage.energy = 1;
        player.resourceStorage.metal = 1;
        player.resourceStorage.ammo = 1;
        level.addPlayer(player);
        var building = new Building({
            level: level,
            player: player,
            resourceGeneration: {
                energy: 1,
                metal: 1,
                ammo: 1
            }
        });
        level.addBuilding(building);

        var energy = level.player.resources.energy;
        var metal = level.player.resources.metal;
        var ammo = level.player.resources.ammo;
        level.update();
        level.update();
        level.update();
        level.update();
        expect(energy).to.be.below(level.player.resources.energy);
        expect(metal).to.be.below(level.player.resources.metal);
        expect(ammo).to.be.below(level.player.resources.ammo);
    });
    it('.selectBuildingAt()', function () {
        var level = Levels.LevelTest();
        var block = level.getBlock(5, 5);
        expect(block.building).to.not.equal(null);
        level.selectBuildingAt(block);
        expect(level.selection).to.equal(block.building);
        expect(block.building.selected).to.equal(true);
    });
    it('.deselect()', function () {
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
    it('.abilities', function () {
        var building = new Buildings.Gun({
            level: new Level(),
            player: new Player()
        });
        expect(building.abilities).to.not.be.undefined;
        expect(building.abilities).to.equal(null);
        building.selected = true;
        expect(building.abilities).to.not.equal(null);
    });

    coverage(this, function (done) {
        var options = {
            level: new Level(),
            player: new Player()
        };
        var building = new Building(options);
        done(building);
    });
});
