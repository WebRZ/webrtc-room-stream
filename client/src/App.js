import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

// Pages
import Stream from './routes/Stream';

// Url
import routes from './url';

function App() {
    useEffect(() => {
        // store.dispatch(loadUser());
    }, []);
    return (
        <div>
            <Router>
                <Switch>
                    <Route exact path={routes.routes.stream()} component={Stream} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
