import store from '../store';
import GameUI from './GameUI';
import {expect} from 'chai';
import coverage from '../../../test/check-coverage';


describe('GameUI', function () {
    beforeEach(function () {
        store.dispatch({
            type: 'INITIALIZE'
        });
    });
    it('new', function () {
        var gameui = new GameUI();
        expect(gameui.state).to.exist;
        expect(gameui.game).to.exist;
        expect(gameui.inputs).to.exist;
    });
    it('.startBuildingPlacement()', startBuildingPlacement);
    function startBuildingPlacement() {
        var gameui = new GameUI();
        var game = gameui.game;
        game.startLevel(game.levels[0]);
        gameui.startBuildingPlacement(gameui.buildings[0]);
        expect(game.level.placementBuilding.constructor).to.equal(gameui.buildings[0]);
        return gameui;
    }

    it('.finishBuildingPlacement()', function () {
        var gameui = startBuildingPlacement();
        var game = gameui.game;
        expect(game.player.buildings.length).to.equal(1);
        gameui.finishBuildingPlacement(gameui.buildings[0]);
        expect(game.level.placementBuilding).to.equal(null);
        expect(game.player.buildings.length).to.equal(2);
    });
    coverage(this, new GameUI(), ['setState', 'forceUpdate', 'render',
        'inputs'
    ]);
});
