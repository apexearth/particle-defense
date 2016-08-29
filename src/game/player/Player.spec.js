describe('Player', function () {
    var Levels = require('../levels');
    var Level = require('../levels/Level');
    var Buildings = require('../buildings');
    var Building = require('../buildings/Building');
    var Player = require('./Player');
    var expect = require('chai').expect;
    var Gun = Buildings.Gun;

    var level;
    var player;
    beforeEach(function () {
        level = new Level();
        player = new Player();
        level.addPlayer(player);
    });
    function addBuilding() {
        var building = new Building({
            level: level,
            player: player
        });
        player.addBuilding(building);
        return building;
    }

    function removeBuilding(building) {
        player.removeBuilding(building);
    }

    it('initialization', function () {
        var player = new Player();
        expect(player.buildings).to.be.an('array');
        expect(player.color).to.be.a('number');
        expect(player.score).to.be.a('number');
        expect(player.resources).to.be.an('object')
            .and.have.keys(
            [
                'energy',
                'metal',
                'ammo'
            ]);
        expect(player.resourceStorage).to.be.an('object')
            .and.have.keys(
            [
                'energy',
                'metal',
                'ammo'
            ]);
    });
    it('.addBuilding()', function () {
        var building = addBuilding();
        expect(player.buildings.length).to.equal(1);
        expect(player.buildingCount(building)).to.equal(1);
    });
    it('.removeBuilding()', function () {
        var building = addBuilding();
        expect(player.buildings.length).to.equal(1);
        expect(player.buildingCount(building)).to.equal(1);
        removeBuilding(building);
        expect(player.buildings.length).to.equal(0);
        expect(player.buildingCount(building)).to.equal(0);
    });
    it('.buildingCount()', function () {
        var building = addBuilding();
        expect(player.buildings.length).to.equal(1);
        expect(player.buildingCount(building)).to.equal(1);
    });
    it('.tryApplyCost()', function () {
        player.resources.energy = 100;
        player.resources.metal = 100;
        var result = player.tryApplyCost({
            energy: 101,
            metal: 50
        });
        expect(result).to.equal(false);
        expect(player.resources.energy).to.equal(100);
        expect(player.resources.metal).to.equal(100);

        result = player.tryApplyCost({
            energy: 1,
            metal: 2
        });
        expect(result).to.equal(true);
        expect(player.resources.energy).to.equal(99);
        expect(player.resources.metal).to.equal(98);
    });
    describe('.commands', function () {
        it('.createBuilding()', function () {
            var level = new Level();
            var player = new Player();
            level.addPlayer(player);

            level.player.resources.energy = Gun.cost.energy;
            level.player.resources.metal = Gun.cost.metal;
            level.player.commands.createBuilding(Gun, 2, 2);
            expect(level.buildings.length).to.equal(1);
            expect(level.player.buildings.length).to.equal(1);
            expect(level.player.resources.metal).to.equal(0);
            expect(level.player.resources.energy).to.equal(0);

            level.player.resources.energy = Gun.cost.energy - 1;
            level.player.resources.metal = Gun.cost.metal - 1;
            expect(function () {
                level.player.commands.createBuilding(Gun, 2, 3);
            }).to.throw();
            expect(level.buildings.length).to.equal(1);
            expect(level.player.buildings.length).to.equal(1);
            expect(level.player.resources.energy).to.equal(Gun.cost.energy - 1);
            expect(level.player.resources.metal).to.equal(Gun.cost.metal - 1);
        });
        it('.sellBuilding()', function () {
            var level = Levels.LevelTest();
            level.player.resources.energy = Gun.cost.energy;
            level.player.resources.metal = Gun.cost.metal;
            var building = level.player.commands.createBuilding(Gun, 2, 2);
            level.player.commands.sellBuilding(building);
            expect(level.player.resources.metal).to.be.above(0);
        });
    });
});
