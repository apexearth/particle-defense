const expect = require('chai').expect;
const coverage = require('../../../test/check-coverage');

const Player = require('../Player');
const Level = require('../levels/Level');
const BuilderModule = require('./BuilderModule');

describe('BuilderModule', function () {
    let player = new Player();
    let level = new Level({
        player
    });
    let parent = {
        level,
        player,
        position: {}
    };
    let options = {
        parent,
        level,
        player,
    };

    it('.build()', () => {
        let {Engineer} = require('../units');
        let module = new BuilderModule(options);
        module.build(Engineer);
        expect(module.current).to.equal(Engineer);
        expect(module.progress).to.equal(0);
    });

    it('.update()', () => {
        let {Engineer} = require('../units');
        let module = new BuilderModule(options);
        module.build(Engineer);
        expect(module.current).to.equal(Engineer);
        expect(module.progress).to.equal(0);

        module.update(Engineer.buildTime / 2);
        expect(module.progress).to.equal(.5);
    });

    it('.complete()', () => {
        let {Engineer} = require('../units');
        let module = new BuilderModule(options);
        module.build(Engineer);
        expect(module.current).to.equal(Engineer);
        expect(module.progress).to.equal(0);

        module.update(Engineer.buildTime / 2);
        expect(module.progress).to.equal(.5);

        expect(level.units.length).to.equal(0);

        module.update(Engineer.buildTime / 2);
        expect(module.progress).to.equal(0);
        expect(module.current).to.equal(null);

        expect(level.units.length).to.equal(1);
    });


    coverage(this, function (done) {
        let builder = new BuilderModule(options);
        done(builder);
    });
});