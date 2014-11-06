define("app/gameui", ["./app", "game/ParticleDefense", "game/Buildings", "util/Mouse"], function (app, ParticleDefense, Buildings, Mouse) {
    return app.controller('GameUi', ['$scope', GameUi]);
    function GameUi($scope) {
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
        /** @returns String, Number */
        $scope.GetCost = function (cost, key) {
            if (cost == null) return null;
            if (typeof(cost[key]) == "function" && cost[key]($scope.Player) > 0) return -Math.round(cost[key]($scope.Player));
            if (cost[key] > 0) return -Math.round(cost[key]);
        };
        $scope.ToTitle = function (s) {
            return s.replace(/([a-z])([A-Z0-9])/g, '$1 $2');
        };

        var eventCatcher = document.getElementById('event-catcher');
        Mouse.AddEvents(eventCatcher);

        ParticleDefense.UiScope = $scope;
        setTimeout(ParticleDefense.updateUi, 100);
    }
});