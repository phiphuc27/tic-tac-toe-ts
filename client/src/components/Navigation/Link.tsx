import React from 'react';
import * as H from 'history';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import {
  Link as MaterialLink,
  LinkProps as MaterialLinkProps,
} from '@material-ui/core';

type MyLinkProps = LinkProps &
  MaterialLinkProps & {
    to: H.LocationDescriptor<unknown>;
  };

const Link: React.FC<MyLinkProps> = ({
  to,
  children,
  underline = 'none',
  color = 'inherit',
  ...props
}) => {
  return (
    <MaterialLink
      {...props}
      component={RouterLink}
      color={color}
      underline={underline}
      to={to}>
      {children}
    </MaterialLink>
  );
};

export default Link;
