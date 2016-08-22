var app = require('./app.js');
var ParticleDefense = require('../game/ParticleDefense');

module.exports = app.controller('GameOver', ['$scope', GameOver]);

function GameOver($scope) {
    $scope.level = ParticleDefense.level;
    $scope.player = ParticleDefense.level.player;
    $scope.Result = ParticleDefense.level.result;
    $scope.Title = ($scope.Result.Victory ? 'Victory!' : 'Failure!');
    $scope.MainMenu = function () {
        ParticleDefense.view = ParticleDefense.Views.MainMenu;
        //ParticleDefense.IndexScope.$apply();
    };
}
