describe('Builder', function () {
    var Builder = require('./Builder');
    var coverage = require('../../../test/check-coverage');
    var expect = require('chai').expect;

    function createBuildable() {
        return {
            buildTime: 100
        };
    }

    it('new', function () {
        var builder = new Builder();
        expect(builder).to.have.property('name');
        expect(builder).to.have.property('speed');
        expect(builder).to.have.property('current');
        expect(builder).to.have.property('queue');
        expect(builder).to.have.property('list');
    });

    it('.build()', function () {
        var builder = new Builder();
        var buildable = createBuildable();
        expect(function () {
            builder.build(buildable);
        }).to.throw();
        builder.addBuildable(buildable);
        builder.build(buildable);
        expect(builder.current).to.equal(buildable);
        expect(builder.queue.length).to.equal(1);
        expect(builder.queue[0]).to.equal(buildable);
    });

    it('.addBuildable()', function () {
        var builder = new Builder();
        var buildable = createBuildable();
        builder.addBuildable(buildable);
        expect(function () {
            builder.addBuildable(buildable);
        }).to.throw();
        expect(function () {
            builder.addBuildable({}); // Invalid buildable given.
        }).to.throw();
    });

    describe('.update()', function () {
        it('progresses the build', function () {
            var builder = new Builder();
            var buildable = createBuildable();
            builder.addBuildable(buildable);
            builder.build(buildable);
            expect(builder.progress).to.equal(0);
            builder.update(.1);
            expect(builder.progress).to.equal(.1);
        });
    });

    coverage(this, function (done) {
        var builder = new Builder();
        done(builder);
    });
});
