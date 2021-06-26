import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Wrapper from '../components/Layout/Wrapper';
import GamePage from '../pages/Game/GamePage';
import Navbar from '../components/NavBar/Navbar';
import HomePage from '../pages/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Wrapper>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/game/:mode' component={GamePage} />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default App;
