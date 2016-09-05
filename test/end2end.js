import {expect} from 'chai';
import App from '../src/app/components/App';

import Skirmish from '../src/app/components/Skirmish';
import GameUI from '../src/app/components/GameUI';

describe('end2end', function () {
    it('Start to Finish', function () {
        var app = new App();
        expect(app).to.exist;

        app.state.Screen.menuSkirmish();
        expect(app.state.Screen).to.equal(Skirmish);

        app.state.Screen.chooseLevel(app.state.levels[0]);
        expect(app.state.Screen).to.equal(GameUI);

        var screen = new app.state.Screen();
        screen.startBuildingPlacement(app.state.buildings[0]);

    });
});