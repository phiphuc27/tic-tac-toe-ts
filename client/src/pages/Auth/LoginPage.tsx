import React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@material-ui/core';
import { MeDocument, MeQuery, useLoginMutation } from '../../generated/graphql';
import { setAccessToken } from '../../global/accessToken';
import Alert from '../../components/Utils/Alert';
import FormWrapper from '../../components/Layout/FormWrapper';
import InputField from '../../components/Inputs/InputField';
import ButtonBlock from '../../components/Inputs/ButtonBlock';
import Link from '../../components/Navigation/Link';

const initialValues = {
  email: '',
  password: '',
};

const registerSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const LoginPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ from: string }>();
  const prevPath = location.state?.from || '/';

  const [login, { data }] = useLoginMutation();
  const error = data?.login.error;

  return (
    <FormWrapper>
      <Typography variant='h4' align='center'>
        Log In
      </Typography>
      {error && <Alert severity='error'>{error.message}</Alert>}
      <Formik
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={async ({ email, password }, { resetForm }) => {
          const formData = {
            email,
            password,
          };

          const { data } = await login({
            variables: formData,
            update: (cache, { data: cacheData }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: cacheData?.login.user,
                },
              });
            },
          });

          if (data?.login.accessToken) {
            setAccessToken(data?.login.accessToken);
            resetForm();
            history.push(prevPath);
          }
        }}>
        {({ handleChange, isSubmitting }) => (
          <Form>
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
            <Link
              color='primary'
              underline='hover'
              to={{
                pathname: '/forgot_password',
                state: { from: prevPath },
              }}>
              Forgot your password?
            </Link>

            <Box mt={2} mb={2}>
              <ButtonBlock type='submit' disabled={isSubmitting}>
                {isSubmitting ? <CircularProgress /> : 'Log In'}
              </ButtonBlock>
            </Box>
          </Form>
        )}
      </Formik>
      <Typography variant='body1' align='center'>
        Don't have an account?{' '}
        <Link
          color='primary'
          underline='hover'
          to={{
            pathname: '/register',
            state: { from: prevPath },
          }}>
          Signup
        </Link>
      </Typography>
    </FormWrapper>
  );
};

export default LoginPage;
