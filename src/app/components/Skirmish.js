import React, {Component} from 'react';
import store from '../store';

class Skirmish extends Component {
    render() {
        return <div>Skirmish</div>;
    }

    static
    chooseLevel(level) {
        store.dispatch({
            type: 'UI_CHOOSE_LEVEL',
            value: level
        });
    }
}

export default Skirmish;