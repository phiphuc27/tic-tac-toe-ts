import { Dispatch } from 'redux';
import _ from 'lodash';
import {
  CLICK_SQUARE,
  SET_WINNER,
  NEW_GAME,
  MOVE_JUMP,
  QUIT_GAME,
  SUBTRACT_SCORE,
  SET_OPPONENT,
  CLICK_SQUARE_COMPUTER,
} from '../constants/game';
import { BOARD_SIZE } from '../constants/global';
import { AppState } from '../store';
import { AppActions } from '../types';
import { Square, Winner } from '../types/game';
import getBestMove from '../utils/getBestMove';
import getWinMoves from '../utils/getWinMoves';

// ====================== Dispatch Actions ======================
const clickSquareDispatch = (square: Square, board: string[][]): AppActions => ({
  type: CLICK_SQUARE,
  square,
  board,
});

const clickSquareComputerDispatch = (square: Square, board: string[][]): AppActions => ({
  type: CLICK_SQUARE_COMPUTER,
  square,
  board,
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
      game: { board },
    } = getState();

    const tmpBoard = _.cloneDeep(board);
    tmpBoard[square.row][square.col] = square.value;

    dispatch(clickSquareDispatch(square, tmpBoard));

    const winner = getWinMoves(square, tmpBoard);

    if (winner.name) {
      dispatch(setWinnerDispatch(winner));
    }
  };

export const clickSquareComputer =
  () => (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const {
      game: { board },
    } = getState();

    const tmpBoard = _.cloneDeep(board);

    const bestMove = getBestMove(tmpBoard);

    tmpBoard[bestMove.row][bestMove.col] = bestMove.value;

    dispatch(clickSquareComputerDispatch(bestMove, tmpBoard));

    const winner = getWinMoves(bestMove, tmpBoard);

    if (winner.name) {
      dispatch(setWinnerDispatch(winner));
    }
  };

export const moveJump =
  (step: number) => (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const {
      game: { history, winner },
    } = getState();

    if (winner.name && winner.name !== 'draw') dispatch(subtractScoreDispatch(winner.name, 1));

    const tmpBoard = Array(BOARD_SIZE)
      .fill(0)
      .map(() => Array(BOARD_SIZE).fill(''));
    const newHistory = [...history].splice(0, step);
    const square = newHistory[step - 1];

    newHistory.forEach((item) => {
      tmpBoard[item.row][item.col] = item.value;
    });

    dispatch(moveJumpDispatch(tmpBoard, step));

    if (square) {
      const winner = getWinMoves(square, tmpBoard);

      if (winner.name) {
        dispatch(setWinnerDispatch(winner));
      }
    }
  };
