import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FormGroup, FormControl, Button, FormFloating, FormLabel,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import SignupComponent from '../components/signupComponent.jsx';
import avatar from '../assets/signupPage/avatar.png';
import AuthContext from '../context/auth/authContext.js';

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setAuth } = useContext(AuthContext);

  const signupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('signupPage.errors.shortUserName'))
      .max(20, t('signupPage.errors.longUserName'))
      .required(t('signupPage.errors.requiredField')),
    password: Yup.string().min(6, t('signupPage.errors.shortPassword')).required(t('signupPage.errors.requiredField')),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], t('signupPage.errors.passwordMatch')),
  });

  const handleSignup = async (values) => axios.post('/api/v1/signup', { ...values });

  const handleFormSubmit = (values, { setSubmitting, setErrors }) => {
    handleSignup(values)
      .then(({ data }) => {
        const { token, username } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setSubmitting(false);
        setAuth(true);
        navigate('/');
      })
      .catch((error) => {
        setSubmitting(false);
        const { status } = error.response;

        switch (status) {
          case 0: {
            setErrors({ username: ' ', password: ' ', confirmPassword: t('signupPage.errors.network') });
            break;
          }
          case 409: {
            setErrors({ username: ' ', password: ' ', confirmPassword: t('signupPage.errors.userExists') });
            break;
          }
          default: {
            setErrors({ username: ' ', password: ' ', confirmPassword: t('signupPage.errors.unknown') });
            break;
          }
        }
      });
  };

  return (
    <SignupComponent avatar={avatar}>
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        onSubmit={handleFormSubmit}
        validationSchema={signupSchema}
        validateOnChange={false}
        validateOnBlur
      >
        {({
          errors, values, handleChange, handleBlur, isSubmitting,
        }) => (
          <Form className="w-50">
            <h1 className="text-center mb-4">{t('signupPage.form.header')}</h1>

            <FormFloating className="mb-3">
              <FormControl
                name="username"
                id="username"
                value={values.username}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={!!errors.username}
                autoFocus
              />
              <FormLabel htmlFor="username">{t('signupPage.form.username')}</FormLabel>
              <FormGroup className="invalid-tooltip">{errors.username}</FormGroup>
            </FormFloating>

            <FormFloating className="mb-3">
              <FormControl
                type="password"
                name="password"
                id="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <FormLabel htmlFor="password">{t('signupPage.form.password')}</FormLabel>
              <FormGroup className="invalid-tooltip">{errors.password}</FormGroup>
            </FormFloating>

            <FormFloating className=" mb-4">
              <FormControl
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={values.confirmPassword}
                onBlur={handleBlur}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
              />
              <FormLabel htmlFor="confirmPassword">{t('signupPage.form.passwordConfirm')}</FormLabel>
              <FormGroup className="invalid-tooltip">{errors.confirmPassword}</FormGroup>
            </FormFloating>
            <Button type="submit" variant="outline-primary" className="w-100" disabled={isSubmitting}>
              {t('signupPage.form.registrationButton')}
            </Button>
          </Form>
        )}
      </Formik>
    </SignupComponent>
  );
};

export default SignUp;
