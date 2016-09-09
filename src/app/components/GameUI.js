import React, {Component} from 'react';
import store from '../store';

class GameUI extends Component {
    constructor() {
        super();
        this.state = store.getState();
        store.subscribe(() => {
            this.state = store.getState();
        });
    }

    render() {
        return <div>GameUI</div>;
    }

    get game() {
        return this.state.game;
    }

    get inputs() {
        return this.state.game.inputs;
    }

    mouse(key, value) {
        if (key === 'x') value = (value - this.state.renderer.position.x) / this.state.renderer.scale.x - this.state.game.level.width / 2;
        if (key === 'y') value = (value - this.state.renderer.position.y) / this.state.renderer.scale.y - this.state.game.level.height / 2;
        return this.inputs.mouse(key, value);
    }

    keyboard(key, value) {
        return this.inputs.keyboard(key, value);
    }


    get buildings() {
        return this.game.buildings;
    }

    startBuildingPlacement(building) {
        store.dispatch({
            type: 'GAME_PLACE_BUILDING_START',
            value: building
        });
    }

    finishBuildingPlacement() {
        store.dispatch({
            type: 'GAME_PLACE_BUILDING_FINISH'
        });
    }
}

export default GameUI;