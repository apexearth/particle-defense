describe('Player Tests', function () {
    var Levels = require("../src/game/Levels");
    var Buildings = require("../src/game/buildings/");
    var PlayerCommands = require("../src/game/PlayerCommands");
    var Player = require("../src/game/Player");
    var expect = require("chai").expect;
    var Gun = Buildings.Gun;

    it('should have commands to buy/create buildings', function () {
        var level = Levels.LevelTest();
        var buildingCount = level.Buildings.length;
        var playerBuildingCount = level.Player.Buildings.length;

        level.Player.Resources.Energy = Gun.Cost.Energy;
        level.Player.Resources.Metal = Gun.Cost.Metal;
        PlayerCommands.CreateBuilding(level.Player, Gun, 2, 2);

        expect(level.Buildings.length).to.equal(buildingCount + 1);
        expect(level.Player.Buildings.length).to.equal(playerBuildingCount + 1);

        expect(level.Player.Resources.Metal).to.equal(0);
        expect(level.Player.Resources.Energy).to.equal(0);
    });
    it('should not be able to purchase a building if cost is too high', function () {
        var level = Levels.LevelTest();
        var buildingCount = level.Buildings.length;
        var playerBuildingCount = level.Player.Buildings.length;

        level.Player.Resources.Energy = Gun.Cost.Energy - 1;
        level.Player.Resources.Metal = Gun.Cost.Metal - 1;
        PlayerCommands.CreateBuilding(level.Player, Gun, 2, 2);
        expect(level.Buildings.length).to.equal(buildingCount);
        expect(level.Player.Buildings.length).to.equal(playerBuildingCount);
    });
    it('should be able to sell buildings for a portion of their cost', function () {
        var level = Levels.LevelTest();
        level.Player.Resources.Energy = Gun.Cost.Energy;
        level.Player.Resources.Metal = Gun.Cost.Metal;
        var building = PlayerCommands.CreateBuilding(level.Player, Gun, 2, 2);
        PlayerCommands.SellBuilding(building);
        expect(level.Player.Resources.Metal).to.be.above(0);
    });
    it('should have a score and a method to add to it', function () {
        var level = Levels.LevelTest();
        expect(level.Player.Score).to.not.be.undefined;
        level.Player.AddScore(10);
        expect(level.Player.Score).to.equal(10);
    });

    describe('cost handling', function () {
        it('can process requests to apply costs', function () {
            var player = new Player();
            player.Resources.Energy = 100;
            player.Resources.Metal = 100;
            var result = player.TryApplyCost({
                Energy: 101,
                Metal: 50
            });
            expect(result).to.equal(false);
            expect(player.Resources.Energy).to.equal(100);
            expect(player.Resources.Metal).to.equal(100);

            result = player.TryApplyCost({
                Energy: 1,
                Metal: 2
            });
            expect(result).to.equal(true);
            expect(player.Resources.Energy).to.equal(99);
            expect(player.Resources.Metal).to.equal(98);
        });
    });
});
