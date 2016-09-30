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

    it('.start()', start.bind(null, {x: 0, y: 2}));
    function start(position) {
        selector.start(position);
        expect(selector.started).to.equal(true);
        var bounds = selector.bounds;
        expect(bounds.left).to.equal(0);
        expect(bounds.top).to.equal(2);
        expect(bounds.right).to.equal(1);
        expect(bounds.bottom).to.equal(3);
    }

    it('.move()', move);
    function move() {
        start({x: 0, y: 2});
        var move = {x: 5, y: 3};
        selector.move(move);
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
        start({x: 0, y: 2});
        var selectables = [
            {position: {x: 10, y: 2}, radius: 4}, // Outside
            {position: {x: 2, y: 2}}              // Inside, no radius provided.
        ];
        var finish = {x: 5, y: 3};
        var selection = selector.finish(finish, selectables);

        expect(selector.started).to.equal(false);
        expect(selection).to.contain(
            selectables[1],
            selectables[2]
        );
        expect(selection).to.not.contain(
            selectables[0]
        );
    }

    it('.checkSelection()', function () {
        start({x: 0, y: 2});
        var selectables = [
            {position: {x: 10, y: 2}, radius: 4}, // Outside
            {position: {x: 2, y: 2}}              // Inside, no radius provided.
        ];
        selector.move({x: 5, y: 3});
        var selection = selector.checkSelection(selectables);

        expect(selector.started).to.equal(true);
        expect(selection).to.contain(
            selectables[1],
            selectables[2]
        );
        expect(selection).to.not.contain(
            selectables[0]
        );
    });

    coverage(this, new Selector());
});
