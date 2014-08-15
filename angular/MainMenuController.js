/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
/// <reference path="/util/Keyboard.js" />
/// <reference path="/game/ParticleDefense.js" />
/// <reference path="/game/Level.js" />
/// <reference path="/game/Levels/LevelTest.js" />
/// <reference path="/game/Levels/LevelOne.js" />
angular.module('ParticleDefense')
    .controller('MainMenuController', ['$scope', 'Canvas', function ($scope, canvas) {
        $scope.Title = "Particle Defense";
        $scope.Levels = [
            Level.LevelTest,
            Level.LevelOne
        ];
        $scope.BeginLevel = function (level) {
            ParticleDefense.startLevel(level, canvas);
        };
        //$scope.BeginLevel($scope.Levels[0]);
    }]);