var app             = require("./app")
var ParticleDefense = require("../game/ParticleDefense")
var Buildings       = require("../game/buildings")
var input           = require("../util/input")

var Mouse = input.Mouse;
return app.controller('GameUi', ['$scope', GameUi]);

function GameUi($scope) {
    $scope.Level     = ParticleDefense.Level;
    $scope.Player    = ParticleDefense.Level.Player;
    $scope.Buildings = Buildings;
    $scope.Cost      = null;
    $scope.setCost   = function (cost) {
        $scope.Cost = cost;
    };
    $scope.hideCost  = function () {
        $scope.Cost = $scope.getPlacementBuilding() != null
            ? $scope.getPlacementBuilding().Cost
            : null;
    };
    /** @returns String, Number */
    $scope.GetCost = function (cost, key) {
        if (cost == null) return null;
        if (typeof(cost[key]) == "function" && cost[key]($scope.Player) > 0) return -Math.round(cost[key]($scope.Player));
        if (cost[key] > 0) return -Math.round(cost[key]);
    };


    $scope.getPlacementBuilding = function () {
        return $scope.Level.getPlacementBuilding != null
            ? $scope.Level.getPlacementBuilding.constructor
            : null;
    };

    $scope.CreateBuilding = function (building) {
        $scope.Level.beginBuildingPlacement(building);
        $scope.Cost = building.Cost;
    };

    $scope.ToTitle = function (s) {
        return s.replace(/([a-z])([A-Z0-9])/g, '$1 $2');
    };

    var eventCatcher = document.getElementById('event-catcher');
    Mouse.AddEvents(eventCatcher);

    ParticleDefense.UiScope = $scope;
    setTimeout(ParticleDefense.updateUi, 100);
}
