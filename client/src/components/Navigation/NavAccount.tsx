import React, { MouseEvent, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useLogoutMutation, useMeQuery } from '../../generated/graphql';
import {
  Button,
  Popover,
  MenuItem,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { ExpandMore, MeetingRoom, AccountBox } from '@material-ui/icons';
import ButtonBox from '../Inputs/ButtonBox';
import Link from './Link';
import { setAccessToken } from '../../global/accessToken';

interface NavAccountProps {}

const NavAccount: React.FC<NavAccountProps> = (props) => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  const location = useLocation();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    setAccessToken('');
    await client.resetStore();
    setAnchorEl(null);
    history.push('/');
  };

  if (loading) {
    return <CircularProgress />;
  } else if (data && data.me) {
    return (
      <>
        <Button
          aria-controls='simple-menu'
          aria-haspopup='true'
          onClick={handleClick}>
          {data.me.username} <ExpandMore />
        </Button>
        <Popover
          id='simple-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountBox fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Profile' />
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <MeetingRoom fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Log Out' />
          </MenuItem>
        </Popover>
      </>
    );
  } else {
    return (
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
  }
};

export default NavAccount;
