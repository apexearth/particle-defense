import {expect} from 'chai';
import store from './store';

import GameUI from './components/GameUI';

describe('store', function () {
    beforeEach(function () {
        store.dispatch({
            type: 'INITIALIZE'
        });
    });
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