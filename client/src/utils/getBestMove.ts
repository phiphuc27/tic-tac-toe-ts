import { Square } from '../types/game';

const getBestMove = (board: string[][], player: string): Square => {
  const emptySpaces = getEmptySpaces(board);
  let bestVal = -Infinity;

  const bestSquare: Square = {
    row: -1,
    col: -1,
    value: player,
  };

  emptySpaces.forEach((square) => {
    square.value = player;

    const moveVal = minimax(square, board, 0, false);

    square.value = '_';

    if (moveVal > bestVal) {
      bestSquare.row = square.row;
      bestSquare.col = square.col;
      bestVal = moveVal;
    }
  });

  return bestSquare;
};

const getEmptySpaces = (board: string[][]): Square[] => {
  const emptySpaces: Square[] = [];

  board.forEach((row, i) => {
    row.forEach((_, j) => {
      if (!board[i][j]) emptySpaces.push({ row: i, col: j, value: '_' });
    });
  });

  return emptySpaces;
};

const minimax = (square: Square, board: string[][], depth: number = 0, isMax: boolean): number => {
  return 0;
};

export default getBestMove;
