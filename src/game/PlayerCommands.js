module.exports = {
    CreateBuilding: function (player, buildingConstructor, blockX, blockY) {
        if (player.level.isBlockCoordBuildable(blockX, blockY) === true
            && player.tryApplyCost(buildingConstructor.cost)) {
            var building = new buildingConstructor(player.level, player, {blockX: blockX, blockY: blockY});
            player.level.addBuilding(building);
            return building;
        }
    },
    SellBuilding:   function (building) {
        building.player.resources.metal += building.constructor.cost.metal * 4 / 3;
        building.player.buildings.splice(building.player.buildings.indexOf(building), 1);
        building.player.level.buildings.splice(building.player.level.buildings.indexOf(building), 1);
    }
};
