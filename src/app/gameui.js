var app = require('./app')
var ParticleDefense = require('../game/ParticleDefense')
var Buildings = require('../game/buildings')
var input = require('../util/input')

var Mouse = input.Mouse;
return app.controller('GameUi', ['$scope', GameUi]);

function GameUi($scope) {
    $scope.level = ParticleDefense.level;
    $scope.player = ParticleDefense.level.player;
    $scope.buildings = Buildings;
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
        if (typeof(cost[key]) == 'function' && cost[key]($scope.player) > 0) return -Math.round(cost[key]($scope.player));
        if (cost[key] > 0) return -Math.round(cost[key]);
    };


    $scope.getPlacementBuilding = function () {
        return $scope.level.getPlacementBuilding != null
            ? $scope.level.getPlacementBuilding.constructor
            : null;
    };

    $scope.CreateBuilding = function (building) {
        $scope.level.beginBuildingPlacement(building);
        $scope.Cost = building.Cost;
    };

    $scope.ToTitle = function (s) {
        return s.replace(/([a-z])([A-Z0-9])/g, '$1 $2');
    };

    var eventCatcher = document.getElementById('event-catcher');
    Mouse.AddEvents(eventCatcher);
    
    ParticleDefense.uiScope = $scope;
    setTimeout(ParticleDefense.updateUi, 100);
}
