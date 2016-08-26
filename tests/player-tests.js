describe('Player Tests', function () {
    var Levels = require('../src/game/level').list;
    var Buildings = require('../src/game/buildings/');
    var PlayerCommands = require('../src/game/PlayerCommands');
    var Player = require('../src/game/Player');
    var expect = require('chai').expect;
    var Gun = Buildings.Gun;

    it('should have commands to buy/create buildings', function () {
        var level = Levels.LevelTest();
        var buildingCount = level.buildings.length;
        var playerBuildingCount = level.player.buildings.length;

        level.player.resources.energy = Gun.cost.energy;
        level.player.resources.metal = Gun.cost.metal;
        PlayerCommands.CreateBuilding(level.player, Gun, 2, 2);
    
        expect(level.buildings.length).to.equal(buildingCount + 1);
        expect(level.player.buildings.length).to.equal(playerBuildingCount + 1);
    
        expect(level.player.resources.metal).to.equal(0);
        expect(level.player.resources.energy).to.equal(0);
    });
    it('should not be able to purchase a building if cost is too high', function () {
        var level = Levels.LevelTest();
        var buildingCount = level.buildings.length;
        var playerBuildingCount = level.player.buildings.length;

        level.player.resources.energy = Gun.cost.energy - 1;
        level.player.resources.metal = Gun.cost.metal - 1;
        PlayerCommands.CreateBuilding(level.player, Gun, 2, 2);
        expect(level.buildings.length).to.equal(buildingCount);
        expect(level.player.buildings.length).to.equal(playerBuildingCount);
    });
    it('should be able to sell buildings for a portion of their cost', function () {
        var level = Levels.LevelTest();
        level.player.resources.energy = Gun.cost.energy;
        level.player.resources.metal = Gun.cost.metal;
        var building = PlayerCommands.CreateBuilding(level.player, Gun, 2, 2);
        PlayerCommands.SellBuilding(building);
        expect(level.player.resources.metal).to.be.above(0);
    });
    it('should have a score and a method to add to it', function () {
        var level = Levels.LevelTest();
        expect(level.player.score).to.not.be.undefined;
        level.player.addScore(10);
        expect(level.player.score).to.equal(10);
    });

    describe('cost handling', function () {
        it('can process requests to apply costs', function () {
            var player = new Player();
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
    });
});
