import _ from 'lodash';
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
import { BOARD_SIZE } from '../constants/global';
import { GameActionTypes, GameState } from '../types/game';

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

const reducer = (state = initialState, action: GameActionTypes): GameState => {
  switch (action.type) {
    case CLICK_SQUARE:
    case CLICK_SQUARE_COMPUTER:
      const { square, board } = action;
      return {
        ...state,
        board: board,
        isTurn: !state.isTurn,
        history: [...state.history.splice(0, state.step), square],
        step: (state.step += 1),
      };

    case SET_WINNER:
      const { winner } = action;
      return {
        ...state,
        winner: _.cloneDeep(winner),
        score: {
          ...state.score,
          [winner.name]: (state.score[winner.name] += 1),
        },
      };

    case MOVE_JUMP:
      return {
        ...state,
        board: action.board,
        step: action.step,
        isTurn: action.step % 2 === 0,
        winner: _.cloneDeep(initialState.winner),
      };

    case SUBTRACT_SCORE:
      return {
        ...state,
        score: {
          ...state.score,
          [action.name]: (state.score[action.name] -= action.point),
        },
      };

    case SET_OPPONENT: {
      return {
        ...state,
        opponent: action.opponent,
      };
    }

    case NEW_GAME:
      return {
        ..._.cloneDeep(initialState),
        score: { ...state.score },
        opponent: state.opponent,
      };

    case QUIT_GAME:
      return _.cloneDeep(initialState);

    default:
      return state;
  }
};

export default reducer;
