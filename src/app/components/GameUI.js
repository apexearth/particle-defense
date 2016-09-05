import React, {Component} from 'react';
import store from '../store';

class GameUI extends Component {
    render() {
        return <div>GameUI</div>;
    }

    startBuildingPlacement(building) {
        store.dispatch({
            type: 'GAME_PLACE_BUILDING_START',
            value: building
        })
    }
}

export default GameUI;