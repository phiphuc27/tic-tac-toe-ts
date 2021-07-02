import React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { useRegisterMutation } from '../../generated/graphql';
import { setAccessToken } from '../../global/accessToken';
import Alert from '../../components/Utils/Alert';
import FormWrapper from '../../components/Layout/FormWrapper';
import InputField from '../../components/Inputs/InputField';
import ButtonBlock from '../../components/Inputs/ButtonBlock';
import Link from '../../components/Navigation/Link';

const initialValues = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const registerSchema = Yup.object().shape({
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Password do not match'
  ),
});

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ from: string }>();
  const prevPath = location.state?.from || '/';

  const [register, { data }] = useRegisterMutation();
  const error = data?.register.error;

  return (
    <FormWrapper>
      <Typography variant='h4' align='center'>
        Sign up
      </Typography>
      {error && <Alert severity='error'>{error.message}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={async ({ username, email, password }, { resetForm }) => {
          const formData = {
            username,
            email,
            password,
          };

          const { data } = await register({ variables: formData });

          if (data?.register.accessToken) {
            setAccessToken(data?.register.accessToken);
            resetForm();
            history.push(prevPath);
          }
        }}>
        {({ handleChange, isSubmitting }) => (
          <Form>
            <InputField
              name='username'
              label='Username'
              onChange={handleChange}
            />
            <InputField
              name='email'
              label='Email'
              type='email'
              onChange={handleChange}
            />
            <InputField
              name='password'
              label='Password'
              type='password'
              onChange={handleChange}
            />
            <InputField
              name='confirmPassword'
              label='Confirm Password'
              type='password'
              onChange={handleChange}
            />
            <Box mt={2} mb={2}>
              <ButtonBlock type='submit' disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress /> : 'Sign up'}
              </ButtonBlock>
            </Box>
          </Form>
        )}
      </Formik>
      <Typography variant='body1' align='center'>
        Already have an account?{' '}
        <Link
          color='primary'
          underline='hover'
          to={{
            pathname: '/login',
            state: { from: prevPath },
          }}>
          Login
        </Link>
      </Typography>
    </FormWrapper>
  );
};

export default RegisterPage;
