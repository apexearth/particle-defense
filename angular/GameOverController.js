/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
/// <reference path="/util/Keyboard.js" />
/// <reference path="/game/ParticleDefense.js" />
/// <reference path="/game/PlayerCommands.js" />
/// <reference path="/game/Level.js" />
/// <reference path="/game/Levels/LevelTest.js" />
angular.module('ParticleDefense')
    .controller('GameOverController', ['$scope', function ($scope) {
        $scope.Level = ParticleDefense.Level;
        $scope.Player = ParticleDefense.Level.Player;
        $scope.Result = ParticleDefense.Level.Result;
        $scope.Title = ($scope.Result.Victory ? "Victory!" : "Failure!");
        $scope.MainMenu = function () {
            ParticleDefense.View = ParticleDefense.Views.MainMenu;
            ParticleDefense.IndexScope.$apply();
        };
    }]);