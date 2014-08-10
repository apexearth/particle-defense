/// <reference path="~/Game/Level.js" />
/// <reference path="~/Game/Player.js" />
/// <reference path="~/Angular/GameUiController.js" />
/// <reference path="~/tests/unit-tests.js" />
PlayerCommands = {
    CreateBuilding: function (player, buildingConstructor, blockX, blockY) {
        if (player.Level.Map.Grid.getBlock(blockX, blockY).IsBlocked) return null;
        if (player.Resources.Metal >= buildingConstructor.Cost.Metal
            && player.Resources.Energy >= buildingConstructor.Cost.Energy) {
            var building = new buildingConstructor(player.Level, player, blockX, blockY);
            player.Resources.Metal -= buildingConstructor.Cost.Metal;
            player.Resources.Energy -= buildingConstructor.Cost.Energy;
            player.Buildings.push(building);
            player.Level.Buildings.push(building);
            return building;
        }
    },
    SellBuilding: function (building) {
        building.Player.Resources.Metal += building.constructor.Cost.Metal * 4 / 3;
        building.Player.Buildings.splice(building.Player.Buildings.indexOf(building), 1);
        building.Player.Level.Buildings.splice(building.Player.Level.Buildings.indexOf(building), 1);
    }
};