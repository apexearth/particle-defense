/// <reference path="~/Game/Level.js" />
PlayerCommands = {
    CreateBuilding: function (player, buildingConstructor, blockX, blockY) {
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
        building.Player.Resources.Metal += building.constructor.Cost.Metal / 2;
        building.Player.Resources.Energy += building.constructor.Cost.Energy / 4;
        building.Player.Buildings.splice(building.Player.Buildings.indexOf(building), 1);
        building.Player.Level.Buildings.splice(building.Player.Level.Buildings.indexOf(building), 1);
    }
};