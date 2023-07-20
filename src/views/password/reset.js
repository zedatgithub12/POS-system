import { useState } from 'react';
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
import { IconCircleCheck } from '@tabler/icons';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Connections from 'api';
import AuthWrapper1 from '../pages/authentication/AuthWrapper1';
import AuthCardWrapper from '../pages/authentication/AuthCardWrapper';
import { useLocation } from 'react-router-dom';

// ============================|| RESET PASSWORD ||============================ //

const Reset_Password = ({ ...others }) => {
    const location = useLocation();
    const path = location.pathname;
    const tokenIndex = path.lastIndexOf('/') + 1;
    const token = path.substring(tokenIndex);

    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

    const [logSpinner, setLogSpinner] = useState(false);
    const [sent, setSent] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
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
                                        <Typography variant="h3" className="text-center">
                                            New password set successfully
                                        </Typography>
                                        <Typography variant="body1" className="text-center">
                                            You can now go back and sign in into Addis Chirchro
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
                                                                    Reset Password
                                                                </Typography>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Box sx={{ mb: 2 }}>
                                                    <Typography variant="subtitle1" textAlign={matchDownSM ? 'center' : 'inherit'}>
                                                        Enter and Confirm New Password
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>

                                        <Formik
                                            initialValues={{
                                                newPassword: '',
                                                confirmPassword: '',
                                                submit: null
                                            }}
                                            validationSchema={Yup.object().shape({
                                                newPassword: Yup.string().min(4).max(255).required('new password is required'),
                                                confirmPassword: Yup.string().min(4).max(255).required('please confirm password')
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
                                                var Api = Connections.api + Connections.resetpassword;
                                                var headers = {
                                                    accept: 'application/json',
                                                    'Content-Type': 'application/json'
                                                };

                                                var data = {
                                                    password: values.newPassword,
                                                    token: token
                                                };

                                                fetch(Api, {
                                                    method: 'POST',
                                                    headers: headers,
                                                    body: JSON.stringify(data),
                                                    cache: 'no-cache'
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
                                                    .catch((err) => {
                                                        setStatus({ success: false });
                                                        setErrors({ submit: err.message });
                                                        setSubmitting(false);
                                                        setLogSpinner(false);
                                                    });
                                            }}
                                        >
                                            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                                                <form noValidate onSubmit={handleSubmit} {...others}>
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.password && errors.password)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-password-login">New Password</InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-password-login"
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={values.newPassword}
                                                            name="newPassword"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            label="New Password"
                                                            inputProps={{}}
                                                        />
                                                        {touched.password && errors.password && (
                                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                                {errors.password}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>

                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.password && errors.password)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-password-login">
                                                            Confirm Password
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-adornment-password-login"
                                                            type={showPassword ? 'text' : 'password'}
                                                            value={values.confirmPassword}
                                                            name="confirmPassword"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            endAdornment={
                                                                <InputAdornment position="end">
                                                                    <IconButton
                                                                        aria-label="toggle password visibility"
                                                                        onClick={handleClickShowPassword}
                                                                        onMouseDown={handleMouseDownPassword}
                                                                        edge="end"
                                                                        size="large"
                                                                    >
                                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            }
                                                            label="Confirm Password"
                                                            inputProps={{}}
                                                        />
                                                        {touched.password && errors.password && (
                                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                                {errors.password}
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
                                <Button component="a" href="/" fullWidth size="large" variant="text" color="primary" sx={{ marginTop: 1 }}>
                                    Sign In
                                </Button>
                            </AuthCardWrapper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AuthWrapper1>
    );
};

export default Reset_Password;
