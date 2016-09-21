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