import React, { ReactNode } from 'react';
import { NavLink as RouterLink, NavLinkProps } from 'react-router-dom';
import { Link } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles(({ palette }: Theme) =>
  createStyles({
    menu__item: {
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: '-5px',
        left: '0',
        width: '100%',
        height: '2px',
        backgroundColor: palette.primary.dark,
        transform: 'scaleX(0%)',
        transformOrigin: 'right',
        transition: 'transform 250ms ease-out',
      },
      '&:hover': {
        textDecoration: 'none',
      },
      '&:hover::after, &:focus::after': {
        transform: 'scaleX(100%)',
        transformOrigin: 'left',
      },
    },
  })
);

interface MyNavLinkProps extends NavLinkProps {
  children: ReactNode;
}

const NavLink: React.FC<MyNavLinkProps> = ({ children, ...props }) => {
  const styles = useStyles();
  return (
    <li>
      <Link {...props} component={RouterLink} className={styles.menu__item} color='inherit' exact>
        {children}
      </Link>
    </li>
  );
};

export default NavLink;
