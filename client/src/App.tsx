import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Wrapper from './components/shared/layout/Wrapper';
import GamePage from './pages/GamePage';
import Navbar from './components/NavBar/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Wrapper>
        <Switch>
          <Route
            exact
            path='/'
            render={() => (
              <Typography variant='h3' color='primary' align='center'>
                Tic Tac Toe
              </Typography>
            )}
          />
          <Route exact path='/game/:mode' component={GamePage} />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default App;
