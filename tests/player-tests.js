require(["src/game/Levels", "src/game/Buildings/Buildings", "src/game/PlayerCommands"], function (Levels, Buildings, PlayerCommands) {
    describe('Player Tests', function () {
        it('should have commands to buy/create buildings', function () {
            var Turret_Gun = Buildings.Turret_Gun;
            var level = Levels.LevelTest();
            var buildingCount = level.Buildings.length;
            var playerBuildingCount = level.Player.Buildings.length;

            level.Player.Resources.Energy = Turret_Gun.Cost.Energy;
            level.Player.Resources.Metal = Turret_Gun.Cost.Metal;
            PlayerCommands.CreateBuilding(level.Player, Turret_Gun, 0, 0);

            expect(level.Buildings.length).toBe(buildingCount + 1);
            expect(level.Player.Buildings.length).toBe(playerBuildingCount + 1);

            expect(level.Player.Resources.Metal).toBe(0);
            expect(level.Player.Resources.Energy).toBe(0);
        });
        it('should not be able to purchase a building if cost is too high', function () {
            var Turret_Gun = Buildings.Turret_Gun;
            var level = Levels.LevelTest();
            var buildingCount = level.Buildings.length;
            var playerBuildingCount = level.Player.Buildings.length;

            level.Player.Resources.Energy = Turret_Gun.Cost.Energy - 1;
            level.Player.Resources.Metal = Turret_Gun.Cost.Metal - 1;
            PlayerCommands.CreateBuilding(level.Player, Turret_Gun, 0, 0);
            expect(level.Buildings.length).toBe(buildingCount);
            expect(level.Player.Buildings.length).toBe(playerBuildingCount);
        });
        it('should be able to sell buildings for a portion of their cost', function () {
            var Turret_Gun = Buildings.Turret_Gun;
            var level = Levels.LevelTest();
            level.Player.Resources.Energy = Turret_Gun.Cost.Energy;
            level.Player.Resources.Metal = Turret_Gun.Cost.Metal;
            var building = PlayerCommands.CreateBuilding(level.Player, Turret_Gun, 0, 0);
            PlayerCommands.SellBuilding(building);
            expect(level.Player.Resources.Metal).toBeGreaterThan(0);
        });
        it('should have a score and a method to add to it', function () {
            var level = Levels.LevelTest();
            expect(level.Player.Score).toBeDefined();
            level.Player.AddScore(10);
            expect(level.Player.Score).toBe(10);
        });
    });
});
