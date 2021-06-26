import { Square, Winner, Move } from '../pages/Game/gameTypes';
import { WIN_MOVE_LENGTH } from '../global/globalConstants';

const checkRow = (square: Square, board: string[][]) => {
  const { row, col, value } = square;
  const winMoves: Move[] = [];

  winMoves.push({ row, col });

  let next = col + 1;
  let prev = col - 1;

  while (board[row][next] === value) {
    winMoves.push({ row, col: next });
    next++;
  }

  while (board[row][prev] === value) {
    winMoves.push({ row, col: prev });
    prev--;
  }

  const sort = winMoves.sort((a, b) => a.col - b.col);

  if (sort.length === WIN_MOVE_LENGTH) {
    if (board[row][prev] !== value && board[row][next] !== value) {
      return { sort, win: true };
    }
  }
  return { sort, win: false };
};

const checkColumn = (square: Square, board: string[][]) => {
  const { row, col, value } = square;
  const winMoves: Move[] = [];

  winMoves.push({ row, col });

  let next = row + 1;
  let prev = row - 1;

  while (board[next] && board[next][col] === value) {
    winMoves.push({ row: next, col });
    next++;
  }

  while (board[prev] && board[prev][col] === value) {
    winMoves.push({ row: prev, col });
    prev--;
  }

  const sort = winMoves.sort((a, b) => a.row - b.row);

  if (sort.length === WIN_MOVE_LENGTH) {
    if (
      (!board[prev] || board[prev][col] !== value) &&
      (!board[next] || board[next][col] !== value)
    ) {
      return { sort, win: true };
    }
  }
  return { sort, win: false };
};

const checkDiagonal = (square: Square, board: string[][]) => {
  const { row, col, value } = square;
  const winMoves: Move[] = [];

  winMoves.push({ row, col });

  let nextRow = row + 1;
  let nextCol = col + 1;
  let prevRow = row - 1;
  let prevCol = col - 1;

  while (board[nextRow] && board[nextRow][nextCol] === value) {
    winMoves.push({ row: nextRow, col: nextCol });
    nextRow++;
    nextCol++;
  }

  while (board[prevRow] && board[prevRow][prevCol] === value) {
    winMoves.push({ row: prevRow, col: prevCol });
    prevRow--;
    prevCol--;
  }

  const sort = winMoves.sort((a, b) => a.row - b.row);

  if (sort.length === WIN_MOVE_LENGTH) {
    if (
      (!board[prevRow] || board[prevRow][prevCol] !== value) &&
      (!board[nextRow] || board[nextRow][nextCol] !== value)
    ) {
      return { sort, win: true };
    }
  }
  return { sort, win: false };
};

const checkDiagonal2 = (square: Square, board: string[][]) => {
  const { row, col, value } = square;
  const winMoves: Move[] = [];

  winMoves.push({ row, col });

  let nextRow = row - 1;
  let nextCol = col + 1;
  let prevRow = row + 1;
  let prevCol = col - 1;

  while (board[nextRow] && board[nextRow][nextCol] === value) {
    winMoves.push({ row: nextRow, col: nextCol });
    nextRow--;
    nextCol++;
  }

  while (board[prevRow] && board[prevRow][prevCol] === value) {
    winMoves.push({ row: prevRow, col: prevCol });
    prevRow++;
    prevCol--;
  }

  const sort = winMoves.sort((a, b) => a.col - b.col);

  if (sort.length === WIN_MOVE_LENGTH) {
    if (
      (!board[prevRow] || board[prevRow][prevCol] !== value) &&
      (!board[nextRow] || board[nextRow][nextCol] !== value)
    ) {
      return { sort, win: true };
    }
  }
  return { sort, win: false };
};

const getWinMoves = (square: Square, board: string[][]): Winner => {
  const isEmpty = board.some((row) => row.some((item) => item === ''));

  const { value } = square;
  const moves = [
    checkRow(square, board),
    checkColumn(square, board),
    checkDiagonal(square, board),
    checkDiagonal2(square, board),
  ].sort((a, b) => b.sort.length - a.sort.length)[0];

  if (moves.sort.length === WIN_MOVE_LENGTH && moves.win) {
    return { name: value, moves: moves.sort };
  }

  if (!isEmpty) return { name: 'draw', moves: moves.sort };

  return { name: '', moves: moves.sort };
};

export default getWinMoves;
