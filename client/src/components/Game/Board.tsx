import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { BOARD_SIZE } from '../../constants/global';
import { Square as SquareType } from '../../types/game';
import { AppState } from '../../store';
import { clickSquare, quitGame } from '../../actions/game';
import Square from './Square';
import { Box } from '@material-ui/core';

const useStyles = makeStyles({
  board: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const Board: React.FC = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const { board, winner, isTurn, history, step } = useSelector((state: AppState) => state.game);

  const curSquare = history[step - 1];

  useEffect(() => {
    return () => {
      dispatch(quitGame());
    };
  }, [dispatch]);

  const handleClick = (row: number, col: number) => {
    if (winner || board[row][col]) return;

    const clickedSquare = {
      row,
      col,
      value: isTurn ? 'X' : 'O',
    } as SquareType;

    dispatch(clickSquare(clickedSquare));
  };

  return (
    <Box>
      {board.map((row, i) => (
        <div key={i} className={styles.board}>
          {row.map((item, j) => (
            <Square
              key={i * BOARD_SIZE + j}
              winner={
                winner?.moves?.some((move) => move.row === i && move.col === j) ? winner : null
              }
              value={item}
              current={curSquare && i === curSquare.row && j === curSquare.col}
              handleClick={() => handleClick(i, j)}
            />
          ))}
        </div>
      ))}
    </Box>
  );
};

export default Board;
