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
        var topBar = (
            <ul id="top-bar" className="grad-down">
                <li>
                    <div>Score</div>
                    <div>{this.player.score}</div>
                    <div></div>
                </li>
            </ul>
        );

        var buildingList = (
            <ul id="building-list" className="list">
                <li className="title">Buildings</li>
                {
                    this.buildings.map(building => {
                        var classes = 'button right smaller';
                        return (
                            <li key={building.name} className={classes}
                                onClick={this.startBuildingPlacement.bind(this, building)}>
                                {titleCase(building.name)}
                            </li>
                        );
                    })
                }
            </ul>
        );

        var statBar = (
            <ul className="stat-bar">

            </ul>
        );
        return <div>
            {topBar}
            {buildingList}
            {statBar}
        </div>;
    }

    get game() {
        return this.state.game;
    }

    get player() {
        return this.state.game.player;
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


function titleCase(s) {
    return s.replace(/([a-z])([A-Z0-9])/g, '$1 $2');
}