import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { BOARD_SIZE } from '../../constants/global';
import { Square as SquareType } from '../../types/game';
import { AppState } from '../../store';
import { clickSquare } from '../../actions/game';
import Square from './Square';

const useStyles = makeStyles({
  board: {
    display: 'flex',
  },
});

const Board: React.FC = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const { board, winner, isTurn } = useSelector((state: AppState) => state.game);

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
    <div>
      {board.map((row, i) => (
        <div key={i} className={styles.board}>
          {row.map((item, j) => (
            <Square key={i * BOARD_SIZE + j} value={item} handleClick={() => handleClick(i, j)} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
