const app = require('./app');
const game = require('../game');

app.controller('MainMenu', ['$scope', MainMenu]);
module.exports = MainMenu;

function MainMenu($scope) {
    $scope.title = 'Particle Defense';
    $scope.levels = game.levels;
    $scope.start = function (level) {
        game.start(level);
    };
}

