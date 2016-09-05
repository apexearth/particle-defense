import {createStore} from 'redux';
import game, {levels, buildings} from '../game';
import MainMenu from './components/MainMenu';
import GameUI from './components/GameUI';

function createInitialState() {
    return {
        game,
        Screen: MainMenu,
        levels,
        buildings
    };
}

export default createStore((state = createInitialState(), action) => {
    switch (action.type) {
    case 'INITIALIZE':
        game.initialize();
        return createInitialState();
    case 'UI_CHANGE_SCREEN':
        return Object.assign({}, state, {
            Screen: action.value
        });
    case 'UI_CHOOSE_LEVEL':
        game.start(action.value);
        return Object.assign({}, state, {
            Screen: GameUI
        });
    }
    return state;
});