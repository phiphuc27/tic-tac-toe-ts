import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk';
import { AppActions } from './types';
import gameReducer from './reducers/game';

export const rootReducer = combineReducers({ game: gameReducer });

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<AppState, any, AppActions>;

const middleware = [thunk as ThunkMiddleware<AppState, AppActions>];

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middleware)));
