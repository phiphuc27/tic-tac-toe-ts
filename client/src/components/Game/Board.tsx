import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { BOARD_SIZE, OPPONENT, PLAYER } from '../../global/globalConstants';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Square as SquareType } from '../../pages/Game/gameTypes';
import { clickSquareAction, clickSquareComputerAction } from '../../pages/Game/gameActions';
import { quitGame, setOpponent } from '../../pages/Game/gameSlice';
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
  const dispatch = useAppDispatch();
  const { board, winner, isTurn, history, step } = useAppSelector((state) => state.game);
  const mode = useParams()['mode'];

  const curSquare = history[step - 1];

  useEffect(() => {
    dispatch(setOpponent({ opponent: mode }));

    return () => {
      dispatch(quitGame());
    };
  }, [dispatch, mode]);

  useEffect(() => {
    if (!isTurn && mode === 'computer' && !winner.name) {
      dispatch(clickSquareComputerAction());
    }
  }, [dispatch, isTurn, mode, winner]);

  const handleClick = (row: number, col: number) => {
    if (winner.name || board[row][col]) return;

    const clickedSquare = {
      row,
      col,
      value: isTurn ? PLAYER : OPPONENT,
    } as SquareType;

    dispatch(clickSquareAction(clickedSquare));
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
