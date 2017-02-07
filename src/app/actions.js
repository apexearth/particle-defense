import store from './store';

module.exports = {
    chooseLevel: (level) => {
        store.dispatch({
            type: 'UI_CHOOSE_LEVEL',
            value: level
        });
    }
};