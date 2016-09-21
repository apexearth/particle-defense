module.exports = function (player) {
    return {
        createBuilding: function (buildingConstructor, blockX, blockY) {
            if (!this.level.isBlockCoordBuildable(blockX, blockY))
                throw new Error('You cannot build at location ' + blockX + ', ' + blockY + '.');
            if (!this.tryApplyCost(buildingConstructor.cost))
                throw new Error('Insufficient resource to create building.');

            var building = new buildingConstructor({
                level: this.level,
                player: this,
                blockX: blockX,
                blockY: blockY
            });
            this.level.addBuilding(building);
            return building;
        }.bind(player),
        sellBuilding: function (building) {
            this.level.removeBuilding(building);
            building.player.resources.metal += building.constructor.cost.metal * 4 / 3;
        }.bind(player)
    };
};
