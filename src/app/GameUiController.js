define("app/GameUiController", ["app/App", "game/ParticleDefense", "game/Buildings"], function (app, ParticleDefense, Buildings) {
    return app.controller('GameUiController', ['$scope', 'Canvas', function ($scope, canvas) {
        $scope.Level = ParticleDefense.Level;
        $scope.Player = ParticleDefense.Level.Player;

        $scope.Buildings = Buildings;

        $scope.CreateBuilding = function (building) {
            $scope.Level.BeginBuildingPlacement(building);
        }

        ParticleDefense.UiScope = $scope;
        setTimeout(ParticleDefense.updateUi, 100);
    }]);
});