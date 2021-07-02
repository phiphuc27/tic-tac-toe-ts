import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Wrapper from '../components/Layout/Wrapper';
import GamePage from '../pages/Game/GamePage';
import Navbar from '../components/Navigation/Navbar';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/Auth/RegisterPage';
import LoginPage from '../pages/Auth/LoginPage';
import { setAccessToken } from '../global/accessToken';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch('http://localhost:5000/refresh_token', {
        method: 'POST',
        credentials: 'include',
      });
      const { accessToken } = await res.json();

      setAccessToken(accessToken);
      setLoading(false);
    };

    fetchToken();
  }, []);

  if (loading) return <></>;

  return (
    <Router>
      <Navbar />
      <Wrapper>
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/game/:mode' component={GamePage} />
          <Route exact path='/register' component={RegisterPage} />
          <Route exact path='/login' component={LoginPage} />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default App;
