require('./app.core');
var app = require('./app');
require('./gameover');
require('./gameui');
require('./index');
require('./mainmenu');

var ParticleDefense = require('../game/ParticleDefense');

module.exports = app.controller('Index', ['$scope', Index]);

function Index($scope) {
    $scope.ParticleDefense     = ParticleDefense;
    ParticleDefense.indexScope = $scope;
}
