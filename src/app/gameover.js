const app = require('./app.js');
const game = require('../game');

module.exports = app.controller('GameOver', ['$scope', GameOver]);

function GameOver($scope) {
    $scope.level = game.level;
    $scope.player = game.player;
    $scope.result = game.result;
    $scope.title = ($scope.result.Victory ? 'Victory!' : 'Failure!');
    $scope.MainMenu = function () {
        game.view = './mainmenu.html';
    };
}
