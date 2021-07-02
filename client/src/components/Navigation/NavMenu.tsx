import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import NavLink from './NavLink';

const useStyles = makeStyles(({ typography }: Theme) =>
  createStyles({
    menu: {
      listStyle: 'none',
      display: 'flex',
      flexGrow: 1,
      gap: '1rem',
      fontSize: typography.subtitle2.fontSize,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      '& span': {
        textTransform: 'lowercase',
      },
    },
  })
);

const NavMenu: React.FC = () => {
  const styles = useStyles();
  return (
    <ul className={styles.menu}>
      <NavLink to='/'>Home</NavLink>
      <NavLink to='/game/player'>
        <span>vs</span>Player
      </NavLink>
      <NavLink to='/game/computer'>
        <span>vs</span>Computer
      </NavLink>
    </ul>
  );
};

export default NavMenu;
