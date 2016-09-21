import React, {Component} from 'react';
import store from '../store';

class App extends Component {
    constructor() {
        super();
        this.state = store.getState();
        store.subscribe(this.unmountedStateUpdate.bind(this));
    }

    componentDidMount() {
        store.unsubscribe(this.unmountedStateUpdate.bind(this));
        store.subscribe(this.mountedStateUpdate.bind(this));
    }

    render() {
        var Screen = this.Screen;
        return (
            <div>
                <Screen />
            </div>
        );
    }

    changeScreen(screen) {
        store.dispatch({
            type: 'UI_CHANGE_SCREEN',
            value: screen
        });
    }

    mountedStateUpdate() {
        this.setState(store.getState());
    }

    unmountedStateUpdate() {
        this.state = store.getState();
    }

    get game() {
        return this.state.game;
    }

    get Screen() {
        return this.state.Screen;
    }
}

export default App;
