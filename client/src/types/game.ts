import {
  CLICK_SQUARE,
  CLICK_SQUARE_COMPUTER,
  MOVE_JUMP,
  NEW_GAME,
  QUIT_GAME,
  SET_OPPONENT,
  SET_WINNER,
  SUBTRACT_SCORE,
} from '../constants/game';

export interface Square {
  row: number;
  col: number;
  value: string;
}

export interface Move {
  row: number;
  col: number;
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

export interface ClickSquareAction {
  type: typeof CLICK_SQUARE;
  square: Square;
  board: string[][];
}

export interface ClickSquareComputerAction {
  type: typeof CLICK_SQUARE_COMPUTER;
  square: Square;
  board: string[][];
}

export interface SetWinnerAction {
  type: typeof SET_WINNER;
  winner: Winner;
}

export interface NewGameAction {
  type: typeof NEW_GAME;
}

export interface QuitGameAction {
  type: typeof QUIT_GAME;
}

export interface MoveJumpAction {
  type: typeof MOVE_JUMP;
  board: string[][];
  step: number;
}

export interface SubTractScoreAction {
  type: typeof SUBTRACT_SCORE;
  name: string;
  point: number;
}

export interface SetOpponentAction {
  type: typeof SET_OPPONENT;
  opponent: string;
}

export type GameActionTypes =
  | ClickSquareAction
  | ClickSquareComputerAction
  | SetWinnerAction
  | NewGameAction
  | MoveJumpAction
  | QuitGameAction
  | SubTractScoreAction
  | SetOpponentAction;
