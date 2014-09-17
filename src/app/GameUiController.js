define("app/GameUiController", ["app/App", "game/ParticleDefense", "game/Buildings", "util/Mouse", "util/Display"], function (app, ParticleDefense, Buildings, Mouse, Display) {
    return app.controller('GameUiController', ['$scope', 'Canvas', function ($scope, canvas) {
        $scope.Level = ParticleDefense.Level;
        $scope.Player = ParticleDefense.Level.Player;
        $scope.Buildings = Buildings;
        $scope.PlacementBuilding = function () {
            return $scope.Level.PlacementBuilding != null
                ? $scope.Level.PlacementBuilding.constructor
                : null;
        };
        $scope.Cost = null;

        $scope.CreateBuilding = function (building) {
            $scope.Level.BeginBuildingPlacement(building);
            $scope.Cost = building.Cost;
        };
        $scope.ShowCost = function (cost) {
            $scope.Cost = cost;
        };
        $scope.HideCost = function () {
            $scope.Cost = $scope.PlacementBuilding() != null
                ? $scope.PlacementBuilding().Cost
                : null;
        };
        var eventCatcher = document.getElementById('event-catcher')
        Mouse.AddEvents(eventCatcher);
        Display.AddEvents(eventCatcher);

        ParticleDefense.UiScope = $scope;
        setTimeout(ParticleDefense.updateUi, 100);
    }]);
});