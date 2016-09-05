import App from './App';
import {expect} from 'chai';

import store from '../store';
import MainMenu from './MainMenu';

var coverage = require('../../../test/check-coverage');
describe('App', function () {
    beforeEach(function () {
        store.dispatch({
            type: 'INITIALIZE'
        });
    });
    it('new', function () {
        var app = new App();
        var state = app.state;
        expect(state.Screen).to.equal(MainMenu);
    });
    it('state changes', function () {
        var app = new App();
        var initialState = app.state;
        expect(initialState).to.equal(store.getState());
        store.dispatch({
            type: 'UI_CHANGE_SCREEN',
            value: null
        });
        expect(initialState).to.not.equal(store.getState());
    });
    coverage(this, new App());
});
