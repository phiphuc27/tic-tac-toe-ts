import React from 'react';
import { Container } from '@material-ui/core';

interface WrapperProps {
  children: React.ReactChild;
  size?: 'lg' | 'md' | 'sm' | 'xl' | 'xs' | false;
}

const Wrapper: React.FC<WrapperProps> = ({ size = 'lg', children }) => {
  return <Container maxWidth={size}>{children}</Container>;
};

export default Wrapper;
