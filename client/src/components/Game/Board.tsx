import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { BOARD_SIZE, OPPONENT, PLAYER } from '../../constants/global';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Square as SquareType } from '../../types/game';
import { clickSquare, clickSquareComputer, quitGame, setOpponent } from '../../actions/game';
import Square from './Square';
import { useParams } from 'react-router-dom';
import _ from 'lodash';

const useStyles = makeStyles({
  board: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Board: React.FC = () => {
  const styles = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const { board, winner, isTurn, history, step } = useSelector((state: AppState) => state.game);
  const mode = useParams()['mode'];

  const curSquare = history[step - 1];

  useEffect(() => {
    dispatch(setOpponent(mode));

    return () => {
      dispatch(quitGame());
    };
  }, [dispatch, mode]);

  useEffect(() => {
    if (!isTurn && mode === 'computer' && !winner.name) {
      dispatch(clickSquareComputer());
    }
  }, [dispatch, isTurn, mode, winner]);

  const handleClick = (row: number, col: number) => {
    if (winner.name || board[row][col]) return;

    const clickedSquare = {
      row,
      col,
      value: isTurn ? PLAYER : OPPONENT,
    } as SquareType;

    dispatch(clickSquare(clickedSquare));
  };

  return (
    <Box>
      {board.map((rowArr, row) => (
        <div key={row} className={styles.board}>
          {rowArr.map((item, col) => (
            <Square
              key={row * BOARD_SIZE + col}
              winner={winner.name && _.some(winner.moves, { row, col }) ? winner : null}
              value={item}
              current={curSquare && _.isEqual(curSquare, { row, col })}
              handleClick={() => handleClick(row, col)}
            />
          ))}
        </div>
      ))}
    </Box>
  );
};

export default Board;
