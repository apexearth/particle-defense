/// <reference path="/js/angular.min.js" />
/// <reference path="/Angular/App.js" />
/// <reference path="/util/Keyboard.js" />
/// <reference path="/Game/ParticleDefense.js" />
/// <reference path="/Game/Level.js" />
/// <reference path="/Game/Levels/LevelTest.js" />
angular.module('ParticleDefense')
    .controller('MainMenuController', ['$scope', 'Canvas', function ($scope, canvas) {
        $scope.Title = "Particle Sandbox";
        $scope.Levels = [
            Level.LevelTest
        ];
        $scope.BeginLevel = function (level) {
            ParticleDefense.startLevel(level, canvas);
            ParticleDefense.View = "";
        };
    }]);