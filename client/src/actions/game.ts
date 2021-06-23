import { Dispatch } from 'redux';
import {
  CLICK_SQUARE,
  SET_WINNER,
  NEW_GAME,
  MOVE_JUMP,
  QUIT_GAME,
  SUBTRACT_SCORE,
  SET_OPPONENT,
} from '../constants/game';
import { BOARD_SIZE, OPPONENT } from '../constants/global';
import { AppState } from '../store';
import { AppActions } from '../types';
import { Square, Winner } from '../types/game';
import getBestMove from '../utils/getBestMove';
import getWinMoves from '../utils/getWinMoves';

// ====================== Dispatch Actions ======================
const clickSquareDispatch = (square: Square): AppActions => ({
  type: CLICK_SQUARE,
  square,
});

const newGameDispatch = (): AppActions => ({
  type: NEW_GAME,
});

const quitGameDispatch = (): AppActions => ({
  type: QUIT_GAME,
});

const setWinnerDispatch = (winner: Winner): AppActions => ({
  type: SET_WINNER,
  winner,
});

const moveJumpDispatch = (board: string[][], step: number): AppActions => ({
  type: MOVE_JUMP,
  board,
  step,
});

const subtractScoreDispatch = (name: string, point: number): AppActions => ({
  type: SUBTRACT_SCORE,
  name,
  point,
});

const setOpponentDispatch = (opponent: string): AppActions => ({
  type: SET_OPPONENT,
  opponent,
});

// ====================== Export Actions ======================
export const newGame = () => (dispatch: Dispatch<AppActions>) => {
  dispatch(newGameDispatch());
};

export const quitGame = () => (dispatch: Dispatch<AppActions>) => {
  dispatch(quitGameDispatch());
};

export const setOpponent = (opponent: string) => (dispatch: Dispatch<AppActions>) => {
  dispatch(setOpponentDispatch(opponent));
};

export const clickSquare =
  (square: Square) => (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const {
      game: { board, opponent },
    } = getState();

    dispatch(clickSquareDispatch(square));

    const winner = getWinMoves(square, board);

    if (winner) {
      dispatch(setWinnerDispatch(winner));
    }

    // When player play with computer
    if (opponent === 'computer') {
      const {
        game: { board: newBoard },
      } = getState();

      const bestMove = getBestMove(newBoard, OPPONENT);

      dispatch(clickSquareDispatch(bestMove));

      const winner = getWinMoves(bestMove, newBoard);

      if (winner) {
        dispatch(setWinnerDispatch(winner));
      }
    }
  };

export const moveJump =
  (step: number) => (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const {
      game: { history, winner },
    } = getState();

    if (winner) dispatch(subtractScoreDispatch(winner.name, 1));

    const tmpBoard = Array(BOARD_SIZE)
      .fill(0)
      .map(() => Array(BOARD_SIZE).fill(null));
    const newHistory = [...history].splice(0, step);
    const square = newHistory[step - 1];

    newHistory.forEach((item) => {
      tmpBoard[item.row][item.col] = item.value;
    });

    dispatch(moveJumpDispatch(tmpBoard, step));

    if (square) {
      const winner = getWinMoves(square, tmpBoard);

      if (winner) {
        dispatch(setWinnerDispatch(winner));
      }
    }
  };
