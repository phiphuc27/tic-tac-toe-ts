import React from 'react';
import { Box, Paper } from '@material-ui/core';
import Wrapper from './Wrapper';

interface FormWrapperProps {}

const FormWrapper: React.FC<FormWrapperProps> = ({ children }) => {
  return (
    <Wrapper size='sm'>
      <Paper elevation={2}>
        <Box padding={2}>{children}</Box>
      </Paper>
    </Wrapper>
  );
};

export default FormWrapper;
