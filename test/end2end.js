import {expect} from 'chai';
import App from '../src/app/components/App';

import Skirmish from '../src/app/components/Skirmish';
import GameUI from '../src/app/components/GameUI';

describe('end2end', function () {
    it('Start to Finish', function () {
        var app = new App();
        expect(app).to.exist;

        app.Screen.menuSkirmish();
        expect(app.state.Screen).to.equal(Skirmish);

        app.Screen.chooseLevel(app.state.levels[0]);
        expect(app.state.Screen).to.equal(GameUI);
        expect(app.game.level).to.exist;

        var game = app.game;
        var level = game.level;
        var gameUI = new app.Screen();
        gameUI.startBuildingPlacement(gameUI.buildings[0]);
        expect(level.placementBuilding).to.exist;
        expect(level.placementBuilding.constructor).to.equal(gameUI.buildings[0]);

        gameUI.mouse('x', 125);
        gameUI.mouse('y', 125);

        expect(level.player.buildings.length).to.equal(1);
        gameUI.finishBuildingPlacement();
        expect(level.player.buildings.length).to.equal(2);
    });
});