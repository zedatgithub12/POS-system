import { useState, useContext } from 'react';
// import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    // Checkbox,
    FormControl,
    // FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Connections from 'api';
import AuthWrapper1 from '../pages/authentication/AuthWrapper1';
import AuthCardWrapper from '../pages/authentication/AuthCardWrapper';
import { IconCircleCheck } from '@tabler/icons';

// import Google from 'assets/images/icons/social-google.svg';

// ============================|| FIREBASE - LOGIN ||============================ //

const Forgot_Password = ({ ...others }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const [logSpinner, setLogSpinner] = useState(false);
    const [sent, setSent] = useState(false);

    return (
        <AuthWrapper1>
            <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 28px)' }}>
                        <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
                            <AuthCardWrapper>
                                {sent ? (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <IconCircleCheck size={66} variant="success" className="text-success mb-3 mx-auto" />
                                        <Typography variant="body1" className="text-center">
                                            A link to reset password is successfully sent to your email address, check your inbox.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Grid container direction="column" justifyContent="center" spacing={2}>
                                            <Grid item xs={12} container alignItems="center" justifyContent="center">
                                                <Grid item xs={12}>
                                                    <Grid
                                                        container
                                                        direction={matchDownSM ? 'column-reverse' : 'row'}
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Grid item>
                                                            <Stack alignItems="center" justifyContent="center" spacing={1}>
                                                                <Typography
                                                                    color={theme.palette.primary.main}
                                                                    gutterBottom
                                                                    variant={matchDownSM ? 'h3' : 'h2'}
                                                                >
                                                                    Forgot Password
                                                                </Typography>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle1" textAlign={matchDownSM ? 'center' : 'inherit'}>
                                                        Enter Email address Associated with your account
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Formik
                                            initialValues={{
                                                email: '',
                                                submit: null
                                            }}
                                            validationSchema={Yup.object().shape({
                                                email: Yup.string().email('Must be a valid email').max(255).required('Email is required')
                                            })}
                                            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                                                try {
                                                    if (scriptedRef.current) {
                                                        setStatus({ success: true });
                                                        setSubmitting(false);
                                                    }
                                                } catch (err) {
                                                    if (scriptedRef.current) {
                                                        setStatus({ success: false });
                                                        setErrors({ submit: err.message });
                                                        setSubmitting(false);
                                                    }
                                                }
                                                setLogSpinner(true);
                                                var Api = Connections.api + Connections.forgotpassword;
                                                var headers = {
                                                    accept: 'application/json',
                                                    'Content-Type': 'application/json'
                                                };

                                                var data = {
                                                    email: values.email
                                                };

                                                fetch(Api, {
                                                    method: 'POST',
                                                    headers: headers,
                                                    body: JSON.stringify(data)
                                                })
                                                    .then((response) => response.json())
                                                    .then((response) => {
                                                        if (response.success) {
                                                            setStatus({ success: true });
                                                            setSubmitting(false);
                                                            setLogSpinner(false);
                                                            setSent(true);
                                                        } else {
                                                            setStatus({ success: false });
                                                            setErrors({ submit: response.message });
                                                            setSubmitting(false);
                                                            setLogSpinner(false);
                                                        }
                                                    })
                                                    .catch(() => {
                                                        setStatus({ success: false });
                                                        setErrors({ submit: response.message });
                                                        setSubmitting(false);
                                                        setLogSpinner(false);
                                                    });
                                            }}
                                        >
                                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                                <form noValidate onSubmit={handleSubmit} {...others}>
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.email && errors.email)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-email-login"
                                                            type="email"
                                                            value={values.email}
                                                            name="email"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            label="Email Address"
                                                            inputProps={{}}
                                                        />
                                                        {touched.email && errors.email && (
                                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                                {errors.email}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>

                                                    {errors.submit && (
                                                        <Box sx={{ mt: 3 }}>
                                                            <FormHelperText error>{errors.submit}</FormHelperText>
                                                        </Box>
                                                    )}

                                                    <Box sx={{ mt: 2 }}>
                                                        <AnimateButton>
                                                            <Button
                                                                disableElevation
                                                                disabled={isSubmitting}
                                                                fullWidth
                                                                size="large"
                                                                type="submit"
                                                                variant="contained"
                                                                color="primary"
                                                            >
                                                                {logSpinner ? (
                                                                    <div
                                                                        className="spinner-border spinner-border-sm text-light "
                                                                        role="status"
                                                                    >
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                ) : (
                                                                    'Send'
                                                                )}
                                                            </Button>
                                                        </AnimateButton>
                                                    </Box>
                                                </form>
                                            )}
                                        </Formik>
                                    </>
                                )}
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Forgot_Password;
