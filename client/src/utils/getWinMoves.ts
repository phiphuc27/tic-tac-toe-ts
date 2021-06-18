import { Square, Winner, Move } from '../types/game';

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

  console.log(winMoves);
  if (winMoves.length === 5) {
    const sort = winMoves.sort((a, b) => a.col - b.col);
    if (board[row][sort[0].col - 1] === null || board[row][sort[4].col + 1] === null) {
      return sort;
    }
  }
  return null;
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

  if (winMoves.length === 5) {
    const sort = winMoves.sort((a, b) => a.row - b.row);
    if (
      (board[sort[0].row - 1] && board[sort[0].row - 1][col] === null) ||
      (board[sort[4].row + 1] && board[sort[4].row + 1][col] === null)
    ) {
      return sort;
    }
  }
  return null;
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

  if (winMoves.length === 5) {
    const sort = winMoves.sort((a, b) => a.row - b.row);
    if (
      (board[sort[0].row - 1] && board[sort[0].row - 1][sort[0].col - 1] === null) ||
      (board[sort[4].row + 1] && board[sort[4].row + 1][sort[4].col + 1] === null)
    ) {
      return sort;
    }
  }
  return null;
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

  if (winMoves.length === 5) {
    const sort = winMoves.sort((a, b) => a.col - b.col);
    if (
      (board[sort[0].row + 1] && board[sort[0].row + 1][sort[0].col - 1] === null) ||
      (board[sort[4].row - 1] && board[sort[4].row - 1][sort[4].col + 1] === null)
    ) {
      return sort;
    }
  }
  return null;
};

const getWinMoves = (square: Square, board: string[][]): Winner | null => {
  const checkEmpty = board.filter((row) => row.filter((item) => item === null).length > 0);
  if (!checkEmpty) return { name: 'draw', moves: null };

  const { value } = square;
  if (square) {
    const moves =
      checkRow(square, board) ||
      checkColumn(square, board) ||
      checkDiagonal(square, board) ||
      checkDiagonal2(square, board);

    if (moves !== null) {
      return { name: value, moves };
    }
  }
  return null;
};

export default getWinMoves;
