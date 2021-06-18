import { Dispatch } from 'redux';
import { CLICK_SQUARE, SET_WINNER, NEW_GAME } from '../constants/game';
import { AppState } from '../store';
import { AppActions } from '../types';
import { Square, Winner } from '../types/game';
import getWinMoves from '../utils/getWinMoves';

const clickSquareDispatch = (square: Square): AppActions => ({
  type: CLICK_SQUARE,
  square,
});

const newGameDispatch = (): AppActions => ({
  type: NEW_GAME,
});

const setWinnerDispatch = (winner: Winner): AppActions => ({
  type: SET_WINNER,
  winner,
});

export const newGame = () => (dispatch: Dispatch) => {
  dispatch(newGameDispatch());
};

export const clickSquare =
  (square: Square) => (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const {
      game: { board },
    } = getState();

    dispatch(clickSquareDispatch(square));

    const winner = getWinMoves(square, board);

    if (winner) {
      dispatch(setWinnerDispatch(winner));
    }
  };
