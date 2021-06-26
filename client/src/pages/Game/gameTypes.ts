export interface Move {
  row: number;
  col: number;
}

export interface Square extends Move {
  value: string;
}
export interface Winner {
  name: string;
  moves: Move[];
}

export interface Score {
  [index: string]: number;
  X: number;
  O: number;
}

export interface GameState {
  board: string[][];
  isTurn: boolean;
  winner: Winner;
  history: Square[];
  step: number;
  score: Score;
  opponent: string;
}

export interface ClickSquarePayload {
  square: Square;
  board: string[][];
}

export interface SetWinnerPayload {
  winner: Winner;
}

export interface MoveJumpPayload {
  board: string[][];
  step: number;
}

export interface SubTractScorePayload {
  name: string;
  point: number;
}

export interface SetOpponentPayload {
  opponent: string;
}
