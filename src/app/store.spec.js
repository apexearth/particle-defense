import {expect} from 'chai';
import store from './store';

import GameUI from './components/GameUI';

describe('store', function () {
    beforeEach(function () {
        store.dispatch({
            type: 'INITIALIZE'
        });
    });
    it('INITIALIZE', function () {
        expect(store.getState()).to.include.keys([
            'Screen',
            'game',
            'levels',
            'buildings'
        ]);
    });
    describe('UI', function () {
        it('UI_CHANGE_SCREEN', function () {
            var initialState = store.getState();
            store.dispatch({
                type: 'UI_CHANGE_SCREEN',
                value: 'test value'
            });
            var newState = store.getState();
            expect(initialState).to.not.equal(newState);
            expect(newState.Screen).to.equal('test value');
        });
        it('UI_CHOOSE_LEVEL', function () {
            var initialState = store.getState();
            store.dispatch({
                type: 'UI_CHOOSE_LEVEL',
                value: initialState.levels[0]
            });
            var newState = store.getState();
            expect(initialState).to.not.equal(newState);
            expect(newState.Screen).to.equal(GameUI);
            expect(newState.game.level).to.not.equal(null);
        });
    });
    describe('GAME', function () {
        it('GAME_PLACE_BUILDING_START', GAME_PLACE_BUILDING_START);
        function GAME_PLACE_BUILDING_START() {
            store.dispatch({
                type: 'UI_CHOOSE_LEVEL',
                value: store.getState().levels[0]
            });
            store.dispatch({
                type: 'GAME_PLACE_BUILDING_START',
                value: store.getState().buildings[0]
            });
        }

        it('GAME_PLACE_BUILDING_FINISH', function () {
            GAME_PLACE_BUILDING_START();
            store.dispatch({
                type: 'GAME_PLACE_BUILDING_FINISH'
            });
        });
    });
});