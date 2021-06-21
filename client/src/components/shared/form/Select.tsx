import React from 'react';
import {
  FormControl,
  Select as MaterialSelect,
  InputLabel,
  SelectProps,
  MenuItemProps,
} from '@material-ui/core';

type MySelectProps = SelectProps & {
  name: string;
  variant?: 'filled' | 'outlined' | 'standard';
  children: MenuItemProps;
};

const Select: React.FC<MySelectProps> = ({ name, variant = 'standard', children, ...props }) => {
  return (
    <FormControl variant={variant} style={{ minWidth: '10rem' }}>
      <InputLabel id={`${name.toLowerCase()}-label`}>{name}</InputLabel>
      <MaterialSelect
        {...props}
        labelId={`${name.toLowerCase()}-label`}
        label={name}
        id={`${name.toLowerCase()}-select`}
      >
        {children}
      </MaterialSelect>
    </FormControl>
  );
};

export default Select;
