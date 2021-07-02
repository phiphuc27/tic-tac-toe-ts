import { Box, BoxProps } from '@material-ui/core';
import React from 'react';

interface ButtonBoxProps {
  gap?: number;
}

const ButtonBox: React.FC<ButtonBoxProps & BoxProps> = ({ children, gap = 0, ...props }) => {
  const gapLength = gap * 8;
  return (
    <Box
      {...props}
      display='flex'
      style={{ gap: `${gapLength}px`, marginBottom: `${gapLength}px` }}
    >
      {children}
    </Box>
  );
};

export default ButtonBox;
