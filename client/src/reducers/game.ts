import {
  CLICK_SQUARE,
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
  score: {
    X: 0,
    O: 0,
  },
  opponent: 'player',
};

const reducer = (state = initialState, action: GameActionTypes): GameState => {
  switch (action.type) {
    case CLICK_SQUARE:
      const { square } = action;
      return {
        ...state,
        board: state.board.map((row, i) =>
          i === square.row
            ? row.map((item, j) => (j === square.col ? square.value.toUpperCase() : item))
            : row
        ),
        isTurn: !state.isTurn,
        history: [...state.history.splice(0, state.step), square],
        step: (state.step += 1),
      };

    case SET_WINNER:
      const { winner } = action;
      return {
        ...state,
        winner: { ...winner, name: winner.name, moves: [...winner.moves] },
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
        winner: { ...initialState.winner, name: '', moves: [] },
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
        ...initialState,
        score: { ...state.score },
        opponent: state.opponent,
        winner: { ...initialState.winner, moves: [] },
      };

    case QUIT_GAME:
      return {
        ...initialState,
        score: { ...initialState.score, X: 0, O: 0 },
        winner: { ...initialState.winner, moves: [] },
      };

    default:
      return state;
  }
};

export default reducer;
