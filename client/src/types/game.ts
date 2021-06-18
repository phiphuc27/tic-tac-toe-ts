import { CLICK_SQUARE, NEW_GAME, SET_WINNER } from '../constants/game';

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
  moves: Move[] | null;
}

export interface GameState {
  board: string[][];
  isTurn: boolean;
  winner: Winner | null;
}

export interface ClickSquareAction {
  type: typeof CLICK_SQUARE;
  square: Square;
}

export interface SetWinnerAction {
  type: typeof SET_WINNER;
  winner: Winner;
}

export interface NewGameAction {
  type: typeof NEW_GAME;
}

export type GameActionTypes = ClickSquareAction | SetWinnerAction | NewGameAction;
