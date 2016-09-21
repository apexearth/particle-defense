import App from './App';
import {expect} from 'chai';
import coverage from '../../../test/check-coverage';

import store from '../store';
import MainMenu from './MainMenu';
import GameUI from './GameUI';

describe('App', function () {
    beforeEach(function () {
        store.dispatch({
            type: 'INITIALIZE'
        });
    });
    it('new', function () {
        var app = new App();
        expect(app.state).to.exist;
        expect(app.game).to.exist;
        expect(app.Screen).to.equal(MainMenu);
    });
    it('.changeScreen()', function () {
        var app = new App();
        expect(app.Screen).to.equal(MainMenu);
        app.changeScreen(GameUI);
        expect(app.Screen).to.equal(GameUI);
    });
    coverage(this, new App(), ['setState', 'forceUpdate', 'render',
        'componentDidMount',
        'mountedStateUpdate',
        'unmountedStateUpdate',
        'Screen' // This is a property which returns a function. The function will not be tested here.
    ]);
});
