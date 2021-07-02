import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ButtonBox from '../Inputs/ButtonBox';
import Link from './Link';
import NavMenu from './NavMenu';
import logo from '../../logo.svg';
import { useMeQuery } from '../../generated/graphql';

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
  const { data, loading } = useMeQuery();
  const location = useLocation();
  const styles = useStyles();

  let NavAccount = null;

  if (loading) {
  } else if (!data?.me) {
    NavAccount = (
      <ButtonBox gap={1}>
        <Button variant='contained' color='primary'>
          <Link to={{ pathname: '/login', state: { from: location.pathname } }}>
            Login
          </Link>
        </Button>
        <Button variant='outlined' color='primary'>
          <Link
            to={{
              pathname: '/register',
              state: { from: location.pathname },
            }}>
            Register
          </Link>
        </Button>
      </ButtonBox>
    );
  } else {
    NavAccount = (
      <Typography variant='h6' color='textSecondary'>
        {data.me.username}
      </Typography>
    );
  }

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
        {NavAccount}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
