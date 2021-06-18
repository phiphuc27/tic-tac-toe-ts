import { CLICK_SQUARE, NEW_GAME, SET_WINNER } from '../constants/game';
import { BOARD_SIZE } from '../constants/global';
import { GameActionTypes, GameState } from '../types/game';

const initialState: GameState = {
  board: Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(null)),
  isTurn: true,
  winner: null,
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
      };

    case SET_WINNER:
      return {
        ...state,
        winner: action.winner,
      };

    case NEW_GAME:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
