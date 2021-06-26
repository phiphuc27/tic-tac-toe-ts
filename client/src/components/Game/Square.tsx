import React from 'react';
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import { ClearRounded, FiberManualRecordOutlined } from '@material-ui/icons';
import { Winner } from '../../pages/Game/gameTypes';
import { OPPONENT, PLAYER, SQUARE_SIZE } from '../../global/globalConstants';

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

const useStyles = makeStyles(({ palette }: Theme) =>
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
    square__text: {
      width: `${SQUARE_SIZE}px`,
      height: `${SQUARE_SIZE}px`,
      transition: 'color 300ms ease-in',
    },
    square__text__x: ({ color }: StyleProps) => ({
      color: color || palette.primary.main,
    }),
    square__text__o: ({ color }: StyleProps) => ({
      color: color || palette.secondary.main,
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

  if (winner?.name === value) {
    myStyle.color = '#fff';
    if (winner.name === PLAYER) myStyle.bgColor = squareColor.X_COLOR;
    if (winner.name === OPPONENT) myStyle.bgColor = squareColor.O_COLOR;
  }

  const styles = useStyles(myStyle);

  return (
    <div onClick={handleClick} className={styles.square}>
      {value === 'X' ? (
        <ClearRounded
          fontSize='large'
          className={`${styles.square__text} ${styles.square__text__x}`}
        />
      ) : (
        value === 'O' && (
          <FiberManualRecordOutlined
            fontSize='large'
            className={`${styles.square__text} ${styles.square__text__o}`}
          />
        )
      )}
    </div>
  );
};

export default Square;
