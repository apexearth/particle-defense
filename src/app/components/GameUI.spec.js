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
    coverage(this, new GameUI(), ['setState', 'forceUpdate']);
});
