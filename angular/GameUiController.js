/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
/// <reference path="/util/Keyboard.js" />
/// <reference path="/game/ParticleDefense.js" />
/// <reference path="/game/PlayerCommands.js" />
/// <reference path="/game/Level.js" />
/// <reference path="/game/Levels/LevelTest.js" />
angular.module('ParticleDefense')
    .controller('GameUiController', ['$scope', 'Canvas', function ($scope, canvas) {
        $scope.Level = ParticleDefense.Level;
        $scope.Player = ParticleDefense.Level.Player;

        $scope.Buildings = Building.List;

        $scope.CreateBuilding = function (building) {
            $scope.Level.BeginBuildingPlacement(building);
        }

        ParticleDefense.UiScope = $scope;
        setTimeout(ParticleDefense.updateUi, 100);
    }]);