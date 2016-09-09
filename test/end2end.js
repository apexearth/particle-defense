/* eslint-disable no-console */
import {expect} from 'chai';
import App from '../src/app/components/App';

import Skirmish from '../src/app/components/Skirmish';
import GameUI from '../src/app/components/GameUI';

describe('end2end', function () {
    it('Start to Finish', function () {
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
        var player = game.player;
        var gameUI = new app.Screen();

        function log(message) {
            var frames = '00000' + game.frames.toFixed(0);
            frames = frames.substring(frames.length - 6);
            console.log(frames + ': ' + message);
        }

        log('Initialized');

        // Actions
        action('defense', getRandomBuilding, createBuilding);
        action('energy', getRandomBuilding, createBuilding);
        action('metal', getRandomBuilding, createBuilding);
        action('ammo', getRandomBuilding, createBuilding);

        // Functions
        function getBuildings(tag) {
            return gameUI.buildings.filter(b=>b.tags.indexOf(tag) >= 0);
        }

        // eslint-disable-next-line
        function getRandomBuilding(tag) {
            var buildings = getBuildings(tag);
            return buildings[(Math.random() * buildings.length) ^ 0];
        }

        function createBuilding(constructor) {
            if (typeof constructor !== 'function')
                throw new Error('The constructor must be a function.\n' + constructor);

            gameUI.startBuildingPlacement(constructor);
            expect(level.placementBuilding).to.exist;
            expect(level.placementBuilding.constructor).to.equal(constructor);

            var block = level.findOpenBlockNear(player.buildings[0]);
            gameUI.mouse('x', block.position.x);
            gameUI.mouse('y', block.position.y);

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

function action() {
    var previousResult = undefined;
    for (var arg of arguments) {
        if (typeof arg === 'function') {
            previousResult = arg(previousResult);
        } else {
            previousResult = arg;
        }
    }
}
