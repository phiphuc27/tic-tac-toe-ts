import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { CssBaseline } from '@material-ui/core';
import { Provider } from 'react-redux';
import store from './app/store';
import client from './app/apolloClient';
import { ApolloProvider } from '@apollo/client';

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <React.StrictMode>
        <CssBaseline>
          <App />
        </CssBaseline>
      </React.StrictMode>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
