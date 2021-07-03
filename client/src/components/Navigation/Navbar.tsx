import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Link from './Link';
import NavMenu from './NavMenu';
import NavAccount from './NavAccount';
import logo from '../../logo.svg';

const useStyles = makeStyles(({ palette, typography }: Theme) =>
  createStyles({
    appBar: {
      background: palette.common.white,
      color: palette.primary.dark,
      flexGrow: 1,
      marginBottom: '2rem',
    },
    link: {
      display: 'flex',
      '& > img': {
        width: '30px',
        height: '30px',
        objectFit: 'cover',
        marginRight: '.8rem',
      },
    },
    title: {
      fontWeight: 500,
      marginRight: '3rem',
    },
  })
);

const Navbar: React.FC = () => {
  const styles = useStyles();

  return (
    <AppBar position='static' className={styles.appBar}>
      <Toolbar>
        <Typography variant='h6' className={styles.title}>
          <Link className={styles.link} to='/'>
            <img src={logo} alt='tic-tac-toe' />
            TicTacToe
          </Link>
        </Typography>
        <NavMenu />
        <NavAccount />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
