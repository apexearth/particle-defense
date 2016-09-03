var coverage = require('../../test/check-coverage');
// var expect = require('chai').expect;
describe('game', function () {
    var game = require('./game');
    coverage(this, game);
});