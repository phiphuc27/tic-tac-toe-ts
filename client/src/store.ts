import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { AppActions } from './types';
import gameReducer from './reducers/game';

export const rootReducer = combineReducers({ game: gameReducer });

const initialState = {};

export type AppState = ReturnType<typeof rootReducer>;

const middleware = [thunk as ThunkMiddleware<AppState, AppActions>];

export const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
