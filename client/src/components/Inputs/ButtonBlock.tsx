import React from 'react';
import { Button, ButtonProps } from '@material-ui/core';

type PrimaryButtonProps = ButtonProps;

const ButtonContained: React.FC<PrimaryButtonProps> = ({ children, ...props }) => {
  return (
    <Button {...props} variant='contained' color='primary' fullWidth={true}>
      {children}
    </Button>
  );
};

export default ButtonContained;
