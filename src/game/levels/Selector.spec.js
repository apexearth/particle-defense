var chai = require('chai');
var expect = chai.expect;
chai.use(require('chai-spies'));

var coverage = require('../../../test/check-coverage');

var Selector = require('./Selector');

module.exports = {};

describe('Selector', function () {
    var selector;

    beforeEach(function () {
        selector = new Selector();
    });

    it('.start()', start);
    function start() {
        selector.start({x: 0, y: 2});
        var bounds = selector.bounds;
        expect(bounds.left).to.equal(0);
        expect(bounds.top).to.equal(2);
        expect(bounds.right).to.equal(1);
        expect(bounds.bottom).to.equal(3);
    }

    it('.move()', move);
    function move() {
        start();
        selector.move({x: 5, y: 3});
        var bounds = selector.bounds;
        expect(bounds.left).to.equal(0);
        expect(bounds.top).to.equal(2);
        expect(bounds.right).to.equal(5);
        expect(bounds.bottom).to.equal(3);
    }

    it('.finish()', function () {
        finish();
    });
    function finish() {
        start();
        var selectables = [
            {position: {x: 10, y: 2}, radius: 4}, // Outside
            {position: {x: 10, y: 2}, radius: 5}, // Edge collision
            {position: {x: 2, y: 2}}              // Inside, no radius provided.
        ];
        selector.finish({x: 5, y: 3}, selectables);
        var bounds = selector.bounds;
        expect(bounds.left).to.equal(0);
        expect(bounds.top).to.equal(2);
        expect(bounds.right).to.equal(5);
        expect(bounds.bottom).to.equal(3);

        expect(selector.selection).to.contain(
            selectables[1],
            selectables[2]
        );
        expect(selector.selection).to.not.contain(
            selectables[0]
        );
    }

    it('.checkSelection()', function () {
        finish(); // Everything finish does adequately tests .checkSelection()
    });

    coverage(this, new Selector());
});
