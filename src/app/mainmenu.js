var app = require('./app');
var ParticleDefense = require('../game/ParticleDefense');
var Levels = require('../game/Levels');

app.controller('MainMenu', ['$scope', MainMenu]);
module.exports = MainMenu;

function MainMenu($scope) {
    $scope.Title = 'Particle Defense';
    $scope.Levels     = [
        Levels.LevelTest,
        Levels.LevelOne,
        Levels.LevelTwo,
        Levels.LevelThree,
        Levels.Random
    ];
    $scope.BeginLevel = function (level) {
        ParticleDefense.startLevel(level);
    };
    //$scope.BeginLevel($scope.Levels[0]);
}

