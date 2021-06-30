import { FieldError } from 'src/types/UserResponse';
import { ValidationError } from 'yup';

export const formatValidateErrors = (err: ValidationError) => {
  const errors: FieldError[] = [];

  err.inner.forEach((element: ValidationError) => {
    errors.push({ field: element.path || '', message: element.message });
  });

  return errors;
};
