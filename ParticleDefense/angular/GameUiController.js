/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
/// <reference path="/util/Keyboard.js" />
/// <reference path="/Game/ParticleDefense.js" />
/// <reference path="/Game/PlayerCommands.js" />
/// <reference path="/Game/Level.js" />
/// <reference path="/Game/Levels/LevelTest.js" />
angular.module('ParticleDefense')
    .controller('GameUiController', ['$scope', 'Canvas', function ($scope, canvas) {
        $scope.Level = ParticleDefense.Level;
        $scope.Player = ParticleDefense.Level.Player;
        $scope.CreateBuilding = function (building) {
            building = Turret_Mini;
            $scope.Level.BeginBuildingPlacement(building);
        }


        ParticleDefense.UiScope = $scope;
        setTimeout(ParticleDefense.updateUi, 100);

        $scope.Mouse = Mouse;
        $scope.Display = Display;
    }]);