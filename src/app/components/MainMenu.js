import React, {Component} from 'react';
import store from '../store';
import actions from '../actions';

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
                onClick={() => actions.chooseLevel(level)}>
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
}

export default MainMenu;