﻿/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/Levels/LevelTest.js"/>
/// <reference path="~/Game/PlayerCommands.js"/>
/// <reference path="~/Game/Buildings/Turret_Mini.js"/>
describe('Player Tests', function () {
    var level;
    beforeEach(function() {
        level = Level.LevelTest();
    })
    it('should have commands to buy/create buildings', function () {
        var buildingCount = level.Buildings.length;
        var playerBuildingCount = level.Player.Buildings.length;

        level.Player.Resources.Energy = Turret_Mini.Cost.Energy;
        level.Player.Resources.Metal = Turret_Mini.Cost.Metal;
        PlayerCommands.CreateBuilding(level.Player, Turret_Mini, 0, 0);

        expect(level.Buildings.length).toBe(buildingCount + 1);
        expect(level.Player.Buildings.length).toBe(playerBuildingCount + 1);

        expect(level.Player.Resources.Metal).toBe(0);
        expect(level.Player.Resources.Energy).toBe(0);
    });
    it('should not be able to purchase a building if cost is too high', function () {
        var buildingCount = level.Buildings.length;
        var playerBuildingCount = level.Player.Buildings.length;

        level.Player.Resources.Energy = Turret_Mini.Cost.Energy - 1;
        level.Player.Resources.Metal = Turret_Mini.Cost.Metal - 1;
        PlayerCommands.CreateBuilding(level.Player, Turret_Mini, 0, 0);
        expect(level.Buildings.length).toBe(buildingCount);
        expect(level.Player.Buildings.length).toBe(playerBuildingCount);
    });
    it('should be able to sell buildings for a portion of their cost', function () {
        level.Player.Resources.Energy = Turret_Mini.Cost.Energy;
        level.Player.Resources.Metal = Turret_Mini.Cost.Metal;
        var building = PlayerCommands.CreateBuilding(level.Player, Turret_Mini, 0, 0);
        PlayerCommands.SellBuilding(building);
        expect(level.Player.Resources.Metal).toBeGreaterThan(0);
    });
    it('should have a score and a method to add to it', function () {
        expect(level.Player.Score).toBeDefined();
        level.Player.AddScore(10);
        expect(level.Player.Score).toBe(10);
    });
});
