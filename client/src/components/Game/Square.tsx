import React from 'react';
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { ClearRounded, FiberManualRecordOutlined } from '@material-ui/icons';
import { Winner } from '../../types/game';
import { OPPONENT, PLAYER, SQUARE_SIZE } from '../../constants/global';

interface SquareProps {
  value: string | null;
  winner: Winner | null;
  current: boolean;
  handleClick: () => void;
}

interface StyleProps {
  color: string;
  bgColor: string;
  current: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    square: ({ bgColor, current }: StyleProps) => ({
      background: bgColor,
      border: `1px solid #999`,
      width: `${SQUARE_SIZE}px`,
      height: `${SQUARE_SIZE}px`,
      marginRight: '-1px',
      marginTop: '-1px',
      padding: 0,
      cursor: 'pointer',
      filter: current ? 'brightness(90%)' : '',
      transition: 'background 300ms ease-in',
    }),
    square__text: ({ color }: StyleProps) => ({
      color,
      width: `${SQUARE_SIZE}px`,
      height: `${SQUARE_SIZE}px`,
    }),
  })
);

const Square: React.FC<SquareProps> = ({ winner, value, handleClick, current }) => {
  const { palette } = useTheme();
  const squareColor = { X_COLOR: palette.primary.main, O_COLOR: palette.secondary.main };
  const myStyle: StyleProps = {
    color: '',
    bgColor: '#fff',
    current,
  };

  if (value === PLAYER) {
    myStyle.color = squareColor.X_COLOR;
  } else if (value === OPPONENT) {
    myStyle.color = squareColor.O_COLOR;
  }

  if (winner?.name === value) {
    myStyle.color = '#fff';
    if (winner.name === PLAYER) myStyle.bgColor = squareColor.X_COLOR;
    if (winner.name === OPPONENT) myStyle.bgColor = squareColor.O_COLOR;
  }

  const styles = useStyles(myStyle);

  return (
    <div onClick={handleClick} className={styles.square}>
      {value === 'X' ? (
        <ClearRounded fontSize='large' className={styles.square__text} />
      ) : (
        value === 'O' && (
          <FiberManualRecordOutlined fontSize='large' className={styles.square__text} />
        )
      )}
    </div>
  );
};

export default Square;
