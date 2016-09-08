import async from 'async';
import {expect} from 'chai';
import App from '../src/app/components/App';

import Skirmish from '../src/app/components/Skirmish';
import GameUI from '../src/app/components/GameUI';

describe('end2end', function () {
    it('Start to Finish', function (done) {
        // Initialization
        var app = new App();
        expect(app).to.exist;

        app.Screen.menuSkirmish();
        expect(app.state.Screen).to.equal(Skirmish);

        app.Screen.chooseLevel(app.state.levels[0]);
        app.game.unqueueUpdate(); // Prevent queued (async) updates.
        expect(app.Screen).to.equal(GameUI);
        expect(app.game.level).to.exist;

        var game = app.game;
        var level = game.level;
        var gameUI = new app.Screen();

        // For sharing state between tasks.
        var state = {};

        // Set up tasks
        var tasks = [
            createBuilding.bind(null, findBuildingsSync('defense')[0])
            // TODO: Choose/search a defensive building.
            // TODO: Wait for building to be built.

            // TODO: Pick a resource building.
            // TODO: Wait for enough resources.
            // TODO: Build the building.
        ];

        // Execute
        async.waterfall(tasks, function (err) {
            return err
                ? done(new Error(err))
                : done();
        });

        function findBuildingsSync(tag) {
            return gameUI.buildings.filter(b=>b.tags.indexOf(tag) >= 0);
        }

        // eslint-disable-next-line
        function findRandomBuildingSync(tag) {
            var buildings = findBuildingsSync(tag);
            return buildings[(Math.random() * buildings.length) ^ 0];
        }

        function createBuilding(constructor, done) {
            if (typeof constructor !== 'function')
                throw new Error('The constructor must be a function.\n' + constructor);

            gameUI.startBuildingPlacement(constructor);
            expect(level.placementBuilding).to.exist;
            expect(level.placementBuilding.constructor).to.equal(constructor);

            gameUI.mouse('x', 125);
            gameUI.mouse('y', 125);

            expect(function () {
                state.building = gameUI.finishBuildingPlacement();
            }).to.increase(level.player.buildings, 'length');
            done();
        }
    });
});
