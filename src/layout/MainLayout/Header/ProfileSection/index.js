import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Chip,
    ClickAwayListener,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Popper,
    Stack,
    Typography,
    TextField,
    Button,
    IconButton,
    InputAdornment
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import { Formik, Form, Field } from 'formik';
// import UpgradePlanCard from './UpgradePlanCard';

// assets
import { IconChevronDown, IconChevronRight, IconLogout, IconReload, IconSettings } from '@tabler/icons';
import { AuthContext } from 'context/context';
import Connections from 'api';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as Yup from 'yup';

// other imports

// ==============================|| PROFILE MENU ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ProfileSection = () => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);
    const navigate = useNavigate();
    const { SignOut } = useContext(AuthContext);
    const LogOut = (status) => {
        SignOut(status);
        navigate('/');
    };
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const prevOpen = useRef(open);

    // a code related to updating user password will go down here
    const [changepass, setChangePass] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const [popup, setPopup] = useState({
        status: false,
        severity: 'info',
        message: ''
    });
    const handlePopupClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });
    };

    const handleSubmit = (values) => {
        setSpinner(true);
        var Api = Connections.api + Connections.changepass + user.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };
        var data = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
        };

        fetch(Api, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setSpinner(false);
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'success',
                        message: response.message
                    });
                } else {
                    setSpinner(false);
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: response.message
                    });
                }
            })
            .catch(() => {
                setSpinner(false);
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: response.message
                });
            });
    };

    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <>
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    color: theme.palette.primary.dark,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        color: theme.palette.warning.light
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={Connections.images + user.profile}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 8px 8px 8px !important',
                            cursor: 'pointer',
                            color: theme.palette.primary.light,
                            background: theme.palette.primary.dark
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                    />
                }
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 14]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Box sx={{ p: 2 }}>
                                        <Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="h4">Howdy,</Typography>
                                                <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                    {user.name}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="subtitle2">
                                                {user.store_name ? user.store_name + ',' : ''} {user.role}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    {/* <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}> */}
                                    <Box sx={{ p: 2 }}>
                                        {/* <UpgradePlanCard /> */}

                                        <Divider />
                                        <List
                                            component="nav"
                                            sx={{
                                                width: '100%',
                                                maxWidth: 350,
                                                minWidth: 300,
                                                backgroundColor: theme.palette.background.paper,
                                                borderRadius: '10px',
                                                [theme.breakpoints.down('md')]: {
                                                    minWidth: '100%'
                                                },
                                                '& .MuiListItemButton-root': {
                                                    mt: 0.5
                                                }
                                            }}
                                        >
                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 0}
                                                onClick={() => setChangePass(!changepass)}
                                            >
                                                <ListItemIcon>
                                                    <IconReload stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Change Password</Typography>} />
                                                <ListItemIcon>
                                                    {changepass ? (
                                                        <IconChevronDown stroke={1.5} size="1.3rem" />
                                                    ) : (
                                                        <IconChevronRight stroke={1.5} size="1.3rem" />
                                                    )}
                                                </ListItemIcon>
                                            </ListItemButton>

                                            {changepass && (
                                                <Box marginX={4}>
                                                    <Paper>
                                                        <Formik
                                                            initialValues={{
                                                                oldPassword: '',
                                                                newPassword: '',
                                                                confirmPassword: ''
                                                            }}
                                                            validationSchema={ChangePasswordSchema}
                                                            onSubmit={handleSubmit}
                                                        >
                                                            {({
                                                                values,
                                                                errors,
                                                                touched,
                                                                handleChange,
                                                                handleBlur,
                                                                handleSubmit,
                                                                isSubmitting,
                                                                dirty
                                                            }) => (
                                                                <Form onSubmit={handleSubmit}>
                                                                    <Field
                                                                        as={TextField}
                                                                        name="oldPassword"
                                                                        label="Old Password"
                                                                        type="password"
                                                                        fullWidth
                                                                        className="mt-2"
                                                                        error={Boolean(errors.oldPassword && touched.oldPassword)}
                                                                        helperText={touched.oldPassword && errors.oldPassword}
                                                                        autoComplete="nope"
                                                                    />
                                                                    <Field
                                                                        as={TextField}
                                                                        name="newPassword"
                                                                        label="New Password"
                                                                        type={showPassword ? 'text' : 'password'}
                                                                        className="mt-2"
                                                                        fullWidth
                                                                        error={Boolean(errors.newPassword && touched.newPassword)}
                                                                        helperText={touched.newPassword && errors.newPassword}
                                                                        autoComplete="nope"
                                                                    />
                                                                    <Field
                                                                        as={TextField}
                                                                        name="confirmPassword"
                                                                        label="Confirm Password"
                                                                        type={showPassword ? 'text' : 'password'}
                                                                        className="mt-2"
                                                                        fullWidth
                                                                        error={Boolean(errors.confirmPassword && touched.confirmPassword)}
                                                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                                                        autoComplete="nope"
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <InputAdornment position="end">
                                                                                    <IconButton
                                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                                    >
                                                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            )
                                                                        }}
                                                                    />
                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="primary"
                                                                        className="my-3"
                                                                    >
                                                                        {spinner ? (
                                                                            <div
                                                                                className="spinner-border spinner-border-sm text-dark "
                                                                                role="status"
                                                                            >
                                                                                <span className="visually-hidden">Loading...</span>
                                                                            </div>
                                                                        ) : (
                                                                            'Change Password'
                                                                        )}
                                                                    </Button>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                    </Paper>
                                                </Box>
                                            )}

                                            <ListItemButton
                                                sx={{ borderRadius: `${customization.borderRadius}px` }}
                                                selected={selectedIndex === 4}
                                                onClick={() => LogOut('Signout')}
                                            >
                                                <ListItemIcon>
                                                    <IconLogout stroke={1.5} size="1.3rem" />
                                                </ListItemIcon>
                                                <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                                            </ListItemButton>
                                        </List>
                                    </Box>
                                    {/* </PerfectScrollbar> */}
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                        <Snackbar open={popup.status} autoHideDuration={6000} onClose={handlePopupClose}>
                            <Alert onClose={handlePopupClose} severity={popup.severity} sx={{ width: '100%' }}>
                                {popup.message}
                            </Alert>
                        </Snackbar>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};
const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string().required('New password is required').min(8, 'New password must be at least 8 characters long'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
});
export default ProfileSection;
