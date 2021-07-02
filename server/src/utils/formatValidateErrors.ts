import { FieldError } from 'src/types/UserResponse';
import { ValidationError } from 'yup';

export const formatValidateErrors = (err: ValidationError) => {
  const error: FieldError = {
    field: err.path || '',
    message: err.message,
  };

  return error;
};
