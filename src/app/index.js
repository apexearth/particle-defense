import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

if (typeof document !== 'undefined') {
    ReactDOM.render(<App />, document.getElementById('root'));

    const store = require('./store');
    const levels = require('../game/levels');
    // TODO: I'm a hack to auto start a level.
    store.dispatch({
        type: 'UI_CHOOSE_LEVEL',
        value: levels[3]
    });
}
