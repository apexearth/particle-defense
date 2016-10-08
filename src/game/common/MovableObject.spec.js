describe('MovableObject', function () {
    var levels = require('../levels');
    var MovableObject = require('./MovableObject');
    var coverage = require('../../../test/check-coverage');
    var expect = require('chai').expect;

    var level;
    var movable;

    function init() {
        level = levels.list.Test();
        movable = new MovableObject({
            level: level
        });
    }

    beforeEach(init);

    it('.velocity', function () {
        movable.position.x = 100;
        movable.position.y = 100;

        movable.clearMove();
        movable.velocity.x = 10;
        movable.velocity.y = 9;
        movable.moveFriction = .1;
        movable.update(1);
        expect(movable.velocity.x).to.equal(9);
        expect(movable.velocity.y).to.equal(8.1);

        movable.moveTo({x: 0, y: 0});
        movable.update(1);
        expect(movable.velocity.x).to.not.equal(0);
        expect(movable.velocity.y).to.not.equal(0);
    });
    it('.findPath()', function () {
        movable.position.x = 100;
        movable.position.y = 100;
        var path = movable.findPath({x: 0, y: 0});
        expect(path).to.be.an('array');
        expect(path.length).to.be.greaterThan(0);
    });
    it('.moveTo()', function () {
        movable.position.x = 100;
        movable.position.y = 100;
        movable.moveTo({x: 0, y: 0});
        expect(movable.path).to.be.an('array');
        expect(movable.path.length).to.be.greaterThan(0);
    });
    it('.clearMove()', function () {
        movable.position.x = 100;
        movable.position.y = 100;
        movable.moveTo({x: 0, y: 0});
        expect(movable.path).to.be.an('array');
        expect(movable.path.length).to.be.greaterThan(0);

        movable.clearMove();
        expect(movable.path).to.be.an('array');
        expect(movable.path.length).to.equal(0);
    });
    it('.updatePath()', function () {
        movable.position.x = 100;
        movable.position.y = 100;
        movable.moveTo({x: 0, y: 0});
        expect(movable.path).to.be.an('array');
        expect(movable.path.length).to.be.greaterThan(0);
        movable.path = null;
        movable.updatePath();
        expect(movable.path).to.be.an('array');
        expect(movable.path.length).to.be.greaterThan(0);
    });
    it('.update()', function () {
        movable.position.x = level.blockSize / 2;
        movable.position.y = 40;
        movable.moveTo({x: level.blockSize / 2, y: 0});
        expect(movable.path.length).to.not.equal(0);
        expect(movable.velocity.x).to.equal(0);
        expect(movable.velocity.y).to.equal(0);
        movable.update(1);
        expect(movable.path.length).to.not.equal(0);
        expect(movable.position.y).to.be.lessThan(40);
        expect(movable.velocity.y).to.be.lessThan(0);
        var limit = 100;
        while (limit-- > 0 && movable.path.length > 0) {
            movable.update(1);
        }
        expect(movable.path.length).to.equal(0);
    });

    coverage(this, function (done) {
        init();
        done(movable);
    });
});
