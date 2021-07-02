import React from 'react';
import { Alert as MaterialAlert, AlertProps } from '@material-ui/lab';

interface MyAlertProps extends AlertProps {
  severity: 'success' | 'info' | 'warning' | 'error';
}

const Alert: React.FC<MyAlertProps> = ({ severity, children, ...props }) => {
  return (
    <MaterialAlert
      style={{ margin: '1rem 0' }}
      variant='filled'
      severity={severity}>
      {children}
    </MaterialAlert>
  );
};

export default Alert;
