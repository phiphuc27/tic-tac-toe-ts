import { Square } from '../types/game';
import { BOARD_SIZE, OPPONENT, PLAYER, WIN_MOVE_LENGTH } from '../constants/global';
import getWinMoves from './getWinMoves';

const SCORE_BASE = BOARD_SIZE * BOARD_SIZE + 10;
let count = 0;

const getBestMove = (board: string[][]): Square => {
  let bestVal = -Infinity;

  const opponent = PLAYER;
  let opponentMove: Square = { row: -1, col: -1, value: '' };

  board.forEach((row, i) => {
    row.forEach((item, j) => {
      if (board[i][j] === opponent) opponentMove = { row: i, col: j, value: item };
    });
  });

  const emptySpaces = getEmptySpaces(opponentMove, board);

  const bestSquare: Square = {
    row: emptySpaces[0].row,
    col: emptySpaces[0].row,
    value: OPPONENT,
  };

  const winnerOpponent = getWinMoves(bestSquare, board);
  if (winnerOpponent.moves.length < WIN_MOVE_LENGTH - 2) {
    return bestSquare;
  }

  const optimizeArr = getEmptySpaces(bestSquare, board);

  for (let square of optimizeArr) {
    let { row, col } = square;

    square.value = OPPONENT;

    const tmpBoard = [...board].map((row) => [...row]);
    tmpBoard[row][col] = OPPONENT;

    const moveVal = minimax(
      square,
      tmpBoard,
      emptySpaces,
      WIN_MOVE_LENGTH,
      false,
      -Infinity,
      Infinity
    );

    if (moveVal > bestVal) {
      // console.log('move value: ', moveVal);
      bestSquare.row = row;
      bestSquare.col = col;
      bestVal = moveVal;
    }
  }
  console.log(count);
  count = 0;
  return bestSquare;
};

const minimax = (
  square: Square,
  board: string[][],
  optimizeArr: Square[],
  depth: number = 0,
  isMaximize: boolean,
  alpha: number,
  beta: number
): number => {
  const winner = getWinMoves(square, board);
  const emptySpaces = getEmptySpaces(square, board);
  const opponent = square.value === PLAYER ? OPPONENT : PLAYER;
  if (winner.name || depth === 0) {
    count++;
    if (square.value === OPPONENT) {
      return SCORE_BASE * (emptySpaces.length + 1) - depth;
    }
    if (square.value === PLAYER) {
      // console.log(winner);
      return -SCORE_BASE * (emptySpaces.length + 1) + depth;
    }
    if (winner.name === 'draw') return 0;
  }

  if (isMaximize) {
    let maxEval = -Infinity;

    for (let item of optimizeArr) {
      item.value = opponent;
      const { row, col } = item;

      const idx = emptySpaces.findIndex((i) => i.row === item.row && i.col === item.col);
      emptySpaces.splice(idx, 1);

      const boardCopy = [...board].map((row) => [...row]);
      boardCopy[row][col] = opponent;

      const curEval = minimax(item, boardCopy, emptySpaces, depth - 1, false, alpha, beta);
      // console.log(curEval)

      item.value = '_';
      emptySpaces.splice(idx, 0, item);

      maxEval = Math.max(maxEval, curEval);
      alpha = Math.max(alpha, maxEval);
      if (beta <= alpha) break;
    }
    // console.log(maxEval);

    return maxEval;
  } else {
    let minEval = Infinity;

    for (let item of emptySpaces) {
      item.value = opponent;
      const { row, col } = item;

      const idx = emptySpaces.findIndex((i) => i.row === item.row && i.col === item.col);
      emptySpaces.splice(idx, 1);

      const boardCopy = [...board].map((row) => [...row]);
      boardCopy[row][col] = opponent;

      const curEval = minimax(item, boardCopy, emptySpaces, depth - 1, true, alpha, beta);
      // console.log(curEval);

      item.value = '_';
      emptySpaces.splice(idx, 0, item);

      minEval = Math.min(minEval, curEval);
      beta = Math.min(beta, minEval);
      if (beta <= alpha) break;
    }
    // console.log(minEval);
    return minEval;
  }
};

const getEmptySpaces = (square: Square, board: string[][]): Square[] => {
  const emptySpaces: Square[] = [];

  if (!square.value) return emptySpaces;

  // Get all empty spaces
  board.forEach((row, i) => {
    row.forEach((_, j) => {
      if (!board[i][j]) emptySpaces.push({ row: i, col: j, value: '_' });
    });
  });

  // Sort the empty array
  emptySpaces.sort((a: Square, b: Square) => {
    const distanceDiffA = Math.max(Math.abs(a.row - square.row), Math.abs(a.col - square.col));
    const distanceDiffB = Math.max(Math.abs(b.row - square.row), Math.abs(b.col - square.col));

    a.value = square.value;
    b.value = square.value;

    const winCountA = getWinMoves(a, board);
    const winCountB = getWinMoves(b, board);

    a.value = '_';
    b.value = '_';

    // if 2 move are the same win length then sort by the distance between move and the choose square
    if (winCountA.moves.length === winCountB.moves.length) return distanceDiffA - distanceDiffB;

    // sort by win length
    return winCountB.moves.length - winCountA.moves.length;
  });

  return emptySpaces;
};

export default getBestMove;
