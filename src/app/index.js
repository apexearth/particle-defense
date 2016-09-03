import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import App from './components/App';
import Start from './components/Start';
import End from './components/End';

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="particle-defense/" component={App}>
            <Route path="start" component={Start}/>
            <Route path="end" component={End}/>
        </Route>
    </Router>
), document.getElementById('root'));
