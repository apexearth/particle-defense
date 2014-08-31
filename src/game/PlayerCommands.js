﻿define("game/PlayerCommands", function () {
    var PlayerCommands = {
        CreateBuilding: function (player, buildingConstructor, blockX, blockY) {
            if (player.Level.Map.Grid.getBlock(blockX, blockY).IsBlocked) return null;
            if (player.Resources.Metal >= buildingConstructor.Cost.Metal
                && player.Resources.Energy >= buildingConstructor.Cost.Energy) {
                var building = new buildingConstructor(player.Level, player, {BlockX: blockX, BlockY: blockY});
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
    return PlayerCommands;
});