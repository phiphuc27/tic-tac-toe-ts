import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { BOARD_SIZE } from '../../global/globalConstants';
import { AppState } from '../../app/rootReducer';
import {
  ClickSquarePayload,
  GameState,
  MoveJumpPayload,
  SetOpponentPayload,
  SetWinnerPayload,
  SubTractScorePayload,
} from './gameTypes';

const initialState: GameState = {
  board: Array(BOARD_SIZE)
    .fill(0)
    .map(() => Array(BOARD_SIZE).fill('')),
  isTurn: true,
  winner: { name: '', moves: [] },
  history: [],
  step: 0,
  score: { X: 0, O: 0 },
  opponent: 'player',
};

const slice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    clickSquare: (state, { payload }: PayloadAction<ClickSquarePayload>) => {
      const { board, square } = payload;
      state.board = board;
      state.isTurn = !state.isTurn;
      state.history = [...state.history.splice(0, state.step), square];
      state.step += 1;
    },

    setWinner: (state, { payload }: PayloadAction<SetWinnerPayload>) => {
      const { winner } = payload;
      state.winner = _.cloneDeep(winner);
      state.score[winner.name] += 1;
    },

    moveJump: (state, { payload }: PayloadAction<MoveJumpPayload>) => {
      const { board, step } = payload;
      state.board = board;
      state.isTurn = step % 2 === 0;
      state.step = step;
      state.winner = _.cloneDeep(initialState.winner);
    },

    subtractScore: (state, { payload }: PayloadAction<SubTractScorePayload>) => {
      const { name, point } = payload;
      state.score[name] -= point;
    },

    setOpponent: (state, { payload }: PayloadAction<SetOpponentPayload>) => {
      const { opponent } = payload;
      state.opponent = opponent;
    },

    newGame: ({ score, opponent }) => {
      return { ...initialState, score, opponent };
    },

    quitGame: () => initialState,
  },
});

const { actions, reducer } = slice;

export const { clickSquare, moveJump, newGame, quitGame, setOpponent, setWinner, subtractScore } =
  actions;

export const gameSelector = (state: AppState) => state.game;

export default reducer;
