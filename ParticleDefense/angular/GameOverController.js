/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
/// <reference path="/util/Keyboard.js" />
/// <reference path="/Game/ParticleDefense.js" />
/// <reference path="/Game/PlayerCommands.js" />
/// <reference path="/Game/Level.js" />
/// <reference path="/Game/Levels/LevelTest.js" />
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