import {createStore} from 'redux';
import game, {renderer, levels, buildings} from '../game';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';

function createInitialState() {
    return {
        Screen: MainMenu,
        game,
        renderer,
        levels,
        buildings
    };
}

let store = createStore((state = createInitialState(), action) => {
    if (action.type === 'INITIALIZE') {
        game.initialize();
        return createInitialState();
    }
    else if (action.type.startsWith('GAME_')) {
        return gameReducer(state, action);
    }
    else if (action.type.startsWith('UI_')) {
        return uiReducer(state, action);
    }
    else if (action.type === '@@redux/INIT') {
        return state;
    }
    throw new Error('Action ' + action.type + ' is undefined.');
});

export default store;

var uiReducer = (state, action) => {
    switch (action.type) {
    case 'UI_CHANGE_SCREEN':
        return Object.assign({}, state, {
            Screen: action.value
        });
    case 'UI_CHOOSE_LEVEL':
        game.start(action.value);
        return Object.assign({}, state, {
            Screen: GameUI
        });
    default:
        throw new Error('Action ' + action + ' is undefined.');
    }
};

var gameReducer = (state, action) => {
    switch (action.type) {
    case 'GAME_PLACE_BUILDING_START':
        game.startBuildingPlacement(action.value);
        return Object.assign({}, state);
    case 'GAME_PLACE_BUILDING_FINISH':
        var building = game.finishBuildingPlacement();
        return Object.assign({}, state, {
            building
        });
    default:
        throw new Error('Action ' + action + ' is undefined.');
    }
};
