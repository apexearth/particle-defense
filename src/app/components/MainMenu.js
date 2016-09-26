import React, {Component} from 'react';
import store from '../store';

class MainMenu extends Component {
    constructor() {
        super();
        this.state = store.getState();
        store.subscribe(() => {
            this.state = store.getState();
        });
    }

    render() {
        var levels = this.state.levels.map((level) =>
            <li key={level.name}
                className='button'
                onClick={() => MainMenu.chooseLevel(level)}>
                {level.name}
            </li>
        );
        return <div>
            <div id='bg'></div>
            <div id='title'>Particle Defense</div>
            <br />
            <ul id='levelList' className='list right-border10'>
                <li className='title'>Choose Level</li>
                {levels}
            </ul>
        </div>;
    }

    static chooseLevel(level) {
        store.dispatch({
            type: 'UI_CHOOSE_LEVEL',
            value: level
        });
    }
}

export default MainMenu;