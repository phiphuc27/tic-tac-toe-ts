import React from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBox from '../Form/ButtonBox';
import NavMenu from './NavMenu';
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
      display: 'flex  ',
      '&:hover': {
        textDecoration: 'none',
      },
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
          <Link component={RouterLink} color='inherit' className={styles.link} exact to='/'>
            <img src={logo} alt='tic-tac-toe' />
            TicTacToe
          </Link>
        </Typography>
        <NavMenu />
        <ButtonBox gap={1}>
          <Button variant='contained' color='primary'>
            Login
          </Button>
          <Button variant='outlined' color='primary'>
            Register
          </Button>
        </ButtonBox>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
