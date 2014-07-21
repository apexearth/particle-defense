/// <reference path="~/js/jasmine.js" />
/// <reference path="~/Game/LevelBuilder.js"/>
/// <reference path="~/Game/PlayerCommands.js"/>
/// <reference path="~/Game/Buildings/Turret_Mini.js"/>
describe('Player Tests', function () {
    it('should have commands to buy/create buildings', function () {
        var level = LevelBuilder.Create();
        expect(level.Buildings.length).toBe(1);
        expect(level.Player.Buildings.length).toBe(1);

        level.Player.Resources.Energy = Turret_Mini.Cost.Energy;
        level.Player.Resources.Metal = Turret_Mini.Cost.Metal;
        PlayerCommands.CreateBuilding(level.Player, Turret_Mini, 0, 0);
        expect(level.Buildings.length).toBe(2);
        expect(level.Player.Buildings.length).toBe(2);

        expect(level.Player.Resources.Metal).toBe(0);
        expect(level.Player.Resources.Energy).toBe(0);
    });
    it('should not be able to purchase a building if cost is too high', function () {
        var level = LevelBuilder.Create();
        expect(level.Buildings.length).toBe(1);
        expect(level.Player.Buildings.length).toBe(1);

        level.Player.Resources.Energy = Turret_Mini.Cost.Energy - 1;
        level.Player.Resources.Metal = Turret_Mini.Cost.Metal - 1;
        PlayerCommands.CreateBuilding(level.Player, Turret_Mini, 0, 0);
        expect(level.Buildings.length).toBe(1);
        expect(level.Player.Buildings.length).toBe(1);
    });
    it('should be able to sell buildings for a portion of their cost', function () {
        var level = LevelBuilder.Create();
        level.Player.Resources.Energy = Turret_Mini.Cost.Energy;
        level.Player.Resources.Metal = Turret_Mini.Cost.Metal;
        var building = PlayerCommands.CreateBuilding(level.Player, Turret_Mini, 0, 0);
        PlayerCommands.SellBuilding(building);
        expect(level.Player.Resources.Metal).toBeGreaterThan(0);
    });
});
