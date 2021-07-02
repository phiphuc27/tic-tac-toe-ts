import React, { InputHTMLAttributes } from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';
import { useField } from 'formik';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  color,
  size,
  ...props
}) => {
  const [field, { error, touched }] = useField<TextFieldProps>(props);

  return (
    <TextField
      {...props}
      {...field}
      id={field.name}
      error={touched && !!error}
      variant='outlined'
      label={label}
      helperText={touched && error}
      placeholder={label}
      fullWidth
      margin='dense'
      InputLabelProps={{
        shrink: true,
      }}
      style={{ margin: '1rem 0' }}
    />
  );
};

export default InputField;
