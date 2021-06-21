import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ClearRounded, FiberManualRecordOutlined } from '@material-ui/icons';
import { Winner } from '../../types/game';

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

const useStyles = makeStyles(() => ({
  square: ({ bgColor, current }: StyleProps) => ({
    background: bgColor,
    border: `1px solid #999`,
    width: '35px',
    height: '35px',
    marginRight: '-1px',
    marginTop: '-1px',
    padding: 0,
    cursor: 'pointer',
    filter: current ? 'brightness(90%)' : '',
    transition: 'background 300ms ease-in',
  }),
  square__text: ({ color }: StyleProps) => ({
    color,
  }),
}));

const Square: React.FC<SquareProps> = ({ winner, value, handleClick, current }) => {
  const { palette } = useTheme();

  const squareColor = { X_COLOR: palette.primary.main, O_COLOR: palette.error.main };

  const myStyle: StyleProps = {
    color: '',
    bgColor: '#fff',
    current,
  };

  if (value === 'X') {
    myStyle.color = squareColor.X_COLOR;
  } else if (value === 'O') {
    myStyle.color = squareColor.O_COLOR;
  }

  if (winner?.name === value) {
    myStyle.color = '#fff';
    if (winner.name === 'X') myStyle.bgColor = squareColor.X_COLOR;
    if (winner.name === 'O') myStyle.bgColor = squareColor.O_COLOR;
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
