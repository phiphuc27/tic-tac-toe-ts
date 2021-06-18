import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Wrapper from './components/shared/layout/Wrapper';
import GamePage from './pages/GamePage';

const App: React.FC = () => {
  return (
    <Wrapper>
      <Router>
        <Typography variant='h3' color='primary' align='center'>
          Tic Tac Toe
        </Typography>
        <Switch>
          <Route exact path='/' component={GamePage} />
          <Route exact path='/home' render={() => <h2>Home Page</h2>} />
        </Switch>
      </Router>
    </Wrapper>
  );
};

export default App;
