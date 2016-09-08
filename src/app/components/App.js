import React, {Component} from 'react';
import store from '../store';

class App extends Component {
    constructor() {
        super();
        this.state = store.getState();
        store.subscribe(() => {
            this.state = store.getState();
        });
    }

    render() {
        var Screen = this.Screen;
        return (
            <div>
                <Screen />
            </div>
        );
    }

    get game() {
        return this.state.game;
    }

    get Screen() {
        return this.state.Screen;
    }
}

export default App;
