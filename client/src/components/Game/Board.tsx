import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, AppState } from '../../store';
import { BOARD_SIZE, OPPONENT, PLAYER } from '../../constants/global';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Square as SquareType } from '../../types/game';
import { clickSquare, quitGame, setOpponent } from '../../actions/game';
import Square from './Square';
import { useParams } from 'react-router-dom';

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

  const handleClick = (row: number, col: number) => {
    if (winner || board[row][col]) return;

    const clickedSquare = {
      row,
      col,
      value: isTurn ? PLAYER : OPPONENT,
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
