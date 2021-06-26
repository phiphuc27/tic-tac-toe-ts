import { combineReducers } from '@reduxjs/toolkit';
import gameReducer from '../pages/Game/gameSlice';

const rootReducers = combineReducers({
  game: gameReducer,
});

export type AppState = ReturnType<typeof rootReducers>;

export default rootReducers;
