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
        var {
            Screen,
            game
        } = this.state;
        return (
            <div>
                <Screen game={game}/>
            </div>
        );
    }
}

export default App;
