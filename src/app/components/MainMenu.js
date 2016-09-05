import React, {Component} from 'react';
import store from '../store';
import Skirmish from './Skirmish';

class MainMenu extends Component {
    constructor() {
        super();
        this.state = {};
        store.subscribe(() => {
            this.state = store.getState();
        });
    }

    render() {
        return <div>
            <div id='bg'></div>
            <div id='title'>Particle Defense</div>
            <br />
            <ul id='levelList' className='list right-border10'>
                <li className='title'>Choose Level</li>

            </ul>
        </div>;
    }

    static
    menuSkirmish() {
        store.dispatch({
            type: 'UI_CHANGE_SCREEN',
            value: Skirmish
        });
    }
}

export default MainMenu;