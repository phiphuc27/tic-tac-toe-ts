import { Square } from '../types/game';
import { AI_DEPTH, BOARD_SIZE, OPPONENT, PLAYER } from '../constants/global';
import getWinMoves from './getWinMoves';
import _ from 'lodash';

interface EvalBoard {
  square: Square;
  score: number;
}

const getBestMove = (board: string[][]) => {
  const bestSquare: Square = {
    row: 0,
    col: 0,
    value: OPPONENT,
  };

  const evalComputerBoard = getEmptyBoard(bestSquare, board);

  let bestEval = -Infinity;

  for (let item of evalComputerBoard) {
    const { square: itemSquare } = item;

    const tmpBoard = _.cloneDeep(board);
    tmpBoard[itemSquare.row][itemSquare.col] = itemSquare.value;

    const curEval = minimax(item, tmpBoard, 0, false, -Infinity, Infinity);

    if (curEval >= bestEval) {
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
  depth: number = 0,
  isMaximize: boolean,
  alpha: number,
  beta: number
): number => {
  const { square, score } = move; //<- O move. need to get X move
  const winner = getWinMoves(square, board);
  const evalPlayerBoard = getEmptyBoard(square, board); // O optimize Array
  console.log(evalPlayerBoard);
  if (winner.name || depth === 0) {
    if (winner.name === PLAYER) return score + depth;
    if (winner.name === OPPONENT) return score - depth;
    return score;
  }

  if (isMaximize) {
    let maxEval = -Infinity;

    for (let item of evalPlayerBoard) {
      const { square: itemSquare } = item;

      const boardCopy = _.cloneDeep(board);
      boardCopy[itemSquare.row][itemSquare.col] = OPPONENT;

      const curEval = minimax(item, boardCopy, depth + 1, true, alpha, beta);
      // console.log(curEval)

      maxEval = Math.max(maxEval, curEval);
      alpha = Math.max(alpha, maxEval);
      if (beta <= alpha) break;
    }
    // console.log(maxEval);

    return maxEval;
  } else {
    let minEval = Infinity;

    for (let item of evalPlayerBoard) {
      const { square: itemSquare } = item;

      const boardCopy = _.cloneDeep(board);
      boardCopy[itemSquare.row][itemSquare.col] = PLAYER;

      const curEval = minimax(item, boardCopy, depth + 1, true, alpha, beta);
      // console.log(curEval);

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
  let maxScore = -Infinity;

  const tmpBoard = _.cloneDeep(board);

  if (!square.value) return evalBoard;

  const opponent = square.value === PLAYER ? OPPONENT : PLAYER;

  // Loop all empty spaces and calculate score on that space
  tmpBoard.forEach((row, i) => {
    row.forEach((item, j) => {
      if (!item) {
        item = square.value;

        const curSquare = { row: i, col: j, value: square.value };
        const curOpponentSquare = { row: i, col: j, value: opponent };

        // Check if the current square is the winner
        const checkWinner = getWinMoves(curSquare, tmpBoard);
        const checkOpponentWinner = getWinMoves(curOpponentSquare, tmpBoard);

        const playerWinPoints = checkWinner.moves.length;
        const opponentWinPoints = checkOpponentWinner.moves.length;

        // if current square is opponent and is about to win, set the score higher
        // to choose that move to prevent the win
        let tmpScore = Math.abs(playerWinPoints - opponentWinPoints) * BOARD_SIZE - Math.max(i, j);

        maxScore = Math.max(tmpScore, maxScore);

        const score = item === PLAYER ? -tmpScore : tmpScore;
        evalBoard.push({ square: curSquare, score });
      }
    });
  });

  // Sort the empty array

  return evalBoard.filter((item) => item.score === maxScore || item.score === -maxScore);
};

export default getBestMove;
