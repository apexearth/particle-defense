const app = require('./app');
const game = require('../game');

module.exports = app.controller('GameUi', ['$scope', GameUi]);

function GameUi($scope) {
    $scope.level = game.level;
    $scope.player = game.player;
    $scope.buildings = game.buildings;
    $scope.cost = null;
    $scope.setCost   = function (cost) {
        $scope.cost = cost;
    };
    $scope.hideCost  = function () {
        $scope.cost = $scope.placementBuilding() != null
            ? $scope.placementBuilding().cost
            : null;
    };
    /** @returns String, Number */
    $scope.GetCost = function (cost, key) {
        if (cost == null) return null;
        if (typeof(cost[key]) == 'function' && cost[key]($scope.player) > 0) return -Math.round(cost[key]($scope.player));
        if (cost[key] > 0) return -Math.round(cost[key]);
    };

    $scope.placementBuilding = function () {
        return $scope.level.placementBuilding != null
            ? $scope.level.placementBuilding.constructor
            : null;
    };

    $scope.createBuilding = function (building) {
        $scope.level.startBuildingPlacement(building);
        $scope.cost = building.cost;
    };

    $scope.ToTitle = function (s) {
        return s.replace(/([a-z])([A-Z0-9])/g, '$1 $2');
    };

    game.uiScope = $scope;
    setTimeout(game.updateUi, 100);
}
