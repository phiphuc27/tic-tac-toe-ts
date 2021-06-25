import { Square } from '../types/game';
import { AI_DEPTH, BOARD_SIZE, OPPONENT, PLAYER, WIN_MOVE_LENGTH } from '../constants/global';
import getWinMoves from './getWinMoves';
import _ from 'lodash';

const SCORE_BASE = BOARD_SIZE * BOARD_SIZE + 10;
let count = 0;

interface EvalBoard {
  square: Square;
  score: number;
}

const getBestMove = (square: Square, board: string[][]) => {
  const evalPlayerBoard = getEmptyBoard(square, board);

  const bestSquare: Square = {
    row: 0,
    col: 0,
    value: OPPONENT,
  };

  const evalComputerBoard = getEmptyBoard(bestSquare, board);
  // console.log(evalComputerBoard);

  let bestEval = -Infinity;

  for (let item of evalComputerBoard) {
    const { square: itemSquare } = item;

    const idx = evalPlayerBoard.findIndex(
      ({ square: i }) => i.row === itemSquare.row && i.col === itemSquare.col
    );
    evalPlayerBoard.splice(idx, 1);

    const tmpBoard = _.cloneDeep(board);
    tmpBoard[itemSquare.row][itemSquare.col] = itemSquare.value;

    const curEval = minimax(item, tmpBoard, evalPlayerBoard, AI_DEPTH, true, -Infinity, Infinity);

    if (curEval > bestEval) {
      bestSquare.row = itemSquare.row;
      bestSquare.col = itemSquare.col;
      bestEval = curEval;
    }
  }
  console.log(bestSquare, bestEval);

  return bestSquare;
};

const minimax = (
  move: EvalBoard,
  board: string[][],
  optimizeArr: EvalBoard[], // X optimize array
  depth: number = 0,
  isMaximize: boolean,
  alpha: number,
  beta: number
): number => {
  const { square, score } = move; //<- O move. need to get X move
  const winner = getWinMoves(square, board);
  const evalPlayerBoard = getEmptyBoard(square, board); // O optimize Array
  if (winner.name || depth === 0) {
    return score;
  }

  if (isMaximize) {
    let maxEval = -Infinity;

    for (let item of optimizeArr) {
      const { square: itemSquare } = item;

      const idx = evalPlayerBoard.findIndex(
        ({ square: i }) => i.row === itemSquare.row && i.col === itemSquare.col
      );
      evalPlayerBoard.splice(idx, 1);

      const boardCopy = _.cloneDeep(board);
      boardCopy[itemSquare.row][itemSquare.col] = OPPONENT;

      const curEval = minimax(item, boardCopy, evalPlayerBoard, depth - 1, false, alpha, beta);
      // console.log(curEval)

      evalPlayerBoard.splice(idx, 0, item);

      maxEval = Math.max(maxEval, curEval);
      alpha = Math.max(alpha, maxEval);
      if (beta <= alpha) break;
    }
    // console.log(maxEval);

    return maxEval;
  } else {
    let minEval = Infinity;

    for (let item of optimizeArr) {
      const { square: itemSquare } = item;

      const idx = evalPlayerBoard.findIndex(
        ({ square: i }) => i.row === itemSquare.row && i.col === itemSquare.col
      );
      evalPlayerBoard.splice(idx, 1);

      const boardCopy = _.cloneDeep(board);
      boardCopy[itemSquare.row][itemSquare.col] = PLAYER;

      const curEval = minimax(item, boardCopy, evalPlayerBoard, depth - 1, true, alpha, beta);
      // console.log(curEval);

      evalPlayerBoard.splice(idx, 0, item);

      minEval = Math.min(minEval, curEval);
      beta = Math.min(beta, minEval);
      if (beta <= alpha) break;
    }
    // console.log(minEval);
    return minEval;
  }
};

const getEmptyBoard = (square: Square, board: string[][]): EvalBoard[] => {
  const evalBoard: EvalBoard[] = [];

  const tmpBoard = _.cloneDeep(board);

  if (!square.value) return evalBoard;

  // Loop all empty spaces and calculate score on that space
  tmpBoard.forEach((row, i) => {
    row.forEach((item, j) => {
      if (!item) {
        item = square.value;
        const curSquare = { row: i, col: j, value: square.value };
        const checkWinner = getWinMoves(curSquare, tmpBoard);

        const playerScore = -checkWinner.moves.length * BOARD_SIZE + Math.max(i, j);
        const computerScore = checkWinner.moves.length * BOARD_SIZE - Math.max(i, j);

        const score = item === PLAYER ? playerScore : computerScore;
        evalBoard.push({ square: curSquare, score });
      }
    });
  });

  // Sort the empty array

  return evalBoard.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
};

export default getBestMove;
