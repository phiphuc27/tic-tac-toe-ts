import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { ClearRounded, FiberManualRecordOutlined } from '@material-ui/icons';
import { AppState } from '../../store';

interface SquareProps {
  value: string | null;
  handleClick: () => void;
}

interface BgProps {
  bgColor: string;
}

const useStyles = makeStyles(({ palette }) => ({
  square: ({ bgColor }: BgProps) => ({
    background: bgColor,
    border: '1px solid #999',
    width: '36px',
    height: '36px',
    marginRight: '-1px',
    marginTop: '-1px',
    padding: 0,
    cursor: 'pointer',
    transition: 'background 300ms ease-in',
  }),
  square_x: {
    color: palette.info.main,
  },
  square_o: {
    color: palette.error.main,
  },
}));

const Square: React.FC<SquareProps> = ({ value, handleClick }) => {
  const { palette } = useTheme();
  const { winner } = useSelector((state: AppState) => state.game);

  let bgColor = '#fff';

  if (winner?.name === value) {
    if (winner.name === 'X') bgColor = palette.info.main;
    if (winner.name === 'O') bgColor = palette.error.main;
  }

  const styles = useStyles({ bgColor });
  return (
    <div onClick={handleClick} className={styles.square}>
      {value === 'X' ? (
        <ClearRounded fontSize='large' className={styles.square_x} />
      ) : (
        value === 'O' && <FiberManualRecordOutlined fontSize='large' className={styles.square_o} />
      )}
    </div>
  );
};

export default Square;
