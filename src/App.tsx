//React Imports
import React from 'react';
import Home from './Pages/Home';

//Material UI Imports
import Theme from './Theme';
import CssBaseline from '@material-ui/core/CssBaseline';

//Router Imports
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import LandingPage from './Pages/Landing';

const App: React.FC = (props) => {
  return (
    <Theme>
      <CssBaseline />
      <Routes />
    </Theme>
  );
};

const Routes: React.FC = (props) => {
  return (
    <Router>
      <Switch>
        <Route path='/'>
          <LandingPage />
        </Route>
      </Switch>
    </Router>
  );
};

//Hot Loader reloads the app when you save changes
export default App;
