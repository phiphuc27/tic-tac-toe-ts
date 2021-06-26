import _ from 'lodash';
import { BOARD_SIZE } from '../../global/globalConstants';
import { AppThunk } from '../../app/store';
import { Square } from './gameTypes';
import getBestMove from '../../utils/getBestMove';
import getWinMoves from '../../utils/getWinMoves';
import { clickSquare, moveJump, setWinner, subtractScore } from './gameSlice';

// ====================== Export Actions ======================
export const clickSquareAction =
  (square: Square): AppThunk =>
  (dispatch, getState) => {
    const {
      game: { board },
    } = getState();

    const tmpBoard = _.cloneDeep(board);
    tmpBoard[square.row][square.col] = square.value;

    dispatch(clickSquare({ square, board: tmpBoard }));

    const winner = getWinMoves(square, tmpBoard);

    if (winner.name) {
      dispatch(setWinner({ winner }));
    }
  };

export const clickSquareComputerAction = (): AppThunk => (dispatch, getState) => {
  const {
    game: { board },
  } = getState();

  const tmpBoard = _.cloneDeep(board);

  const bestMove = getBestMove(tmpBoard);

  tmpBoard[bestMove.row][bestMove.col] = bestMove.value;

  dispatch(clickSquare({ square: bestMove, board: tmpBoard }));

  const winner = getWinMoves(bestMove, tmpBoard);

  if (winner.name) {
    dispatch(setWinner({ winner }));
  }
};

export const moveJumpAction =
  (step: number): AppThunk =>
  (dispatch, getState) => {
    const {
      game: { history, winner },
    } = getState();

    if (winner.name && winner.name !== 'draw')
      dispatch(subtractScore({ name: winner.name, point: 1 }));

    const tmpBoard = Array(BOARD_SIZE)
      .fill(0)
      .map(() => Array(BOARD_SIZE).fill(''));
    const newHistory = [...history].splice(0, step);
    const square = newHistory[step - 1];

    newHistory.forEach((item) => {
      tmpBoard[item.row][item.col] = item.value;
    });

    dispatch(moveJump({ board: tmpBoard, step }));

    if (square) {
      const winner = getWinMoves(square, tmpBoard);

      if (winner.name) {
        dispatch(setWinner({ winner }));
      }
    }
  };
