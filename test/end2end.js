/* eslint-disable no-console */
import {expect} from 'chai';
import App from '../src/app/components/App';

import GameUI from '../src/app/components/GameUI';

describe('end2end', function () {
    it('Start to Finish', function () {
        // Initialization
        var app = new App();
        expect(app).to.exist;

        app.Screen.chooseLevel(app.state.levels[0]);
        app.game.unqueueUpdate(); // Prevent queued (async) updates.
        expect(app.Screen).to.equal(GameUI);
        expect(app.game.level).to.exist;

        var game = app.game;
        var level = game.level;
        var player = game.player;
        var gameUI = new app.Screen();

        function log(message) {
            var frames = '00000' + game.frames.toFixed(0);
            frames = frames.substring(frames.length - 6);
            console.log(frames + ': ' + message);
        }

        log('Initialized');

        // Actions
        createBuilding('defense');
        createBuilding('energy');
        createBuilding('metal');
        createBuilding('ammo');

        // Functions
        function createBuilding(tag, random) {
            function buildingConstructors(tag) {
                return gameUI.buildings.filter(b=>b.tags.indexOf(tag) >= 0);
            }

            function randomBuildingConstructor(tag) {
                var buildings = buildingConstructors(tag);
                return buildings[(Math.random() * buildings.length) ^ 0];
            }

            var constructor = random ? randomBuildingConstructor(tag) : buildingConstructors(tag)[0];

            if (!constructor)
                throw new Error('No buildings found with the ' + tag + ' tag.');
            if (typeof constructor !== 'function')
                throw new Error('The constructor must be a function.\n' + constructor);

            gameUI.startBuildingPlacement(constructor);
            expect(level.placementBuilding).to.exist;
            expect(level.placementBuilding.constructor).to.equal(constructor);

            var block = level.findOpenBlockNear(player.buildings[0]);
            game.moveMouseToBlock(block);

            waitFor(() => player.canBuy(constructor));

            expect(function () {
                gameUI.finishBuildingPlacement();
            }).to.increase(level.player.buildings, 'length');
            log('Created building ' + constructor.name + ' at '
                + app.state.building.block.x + ',' + app.state.building.block.y);
        }

        function waitFor(expectation, timeout = 1000) {
            while (!expectation() && --timeout) {
                game.update();
            }
            if (timeout === 0) {
                throw new Error('.waitFor() timed out.');
            }
        }
    });
});
