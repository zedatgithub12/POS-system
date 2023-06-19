import React, { useState } from 'react';

// material-ui
import { Grid, Typography, Divider, Button, TextField, MenuItem, IconButton, InputAdornment } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Visibility, VisibilityOff } from '@mui/icons-material';
//other imports
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import 'views/styles/pages.css';
import { Container } from 'react-bootstrap';
import Connections from 'api';
// ==============================|| ADD USER PAGE ||============================== //
const roles = [
    {
        value: 'Admin',
        label: 'Admin'
    },
    {
        value: 'Sales',
        label: 'Sales'
    }
];

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AddUsers = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [nameError] = useState(false);
    const [emailError] = useState(false);
    const [roleError] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const [popup, setPopup] = useState({
        status: false,
        severity: 'info',
        message: ''
    });
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setConfirmPasswordError(true);
            return;
        } else {
            setSpinner(true);
            // Handle form submission here
            // Declare the data to be sent to the API
            var Api = Connections.api + Connections.adduser;
            // var headers = {
            //     accept: 'application/json',
            //     'Content-Type': 'application/json'
            // };

            const data = new FormData();
            data.append('profile', profileImage);
            data.append('name', name);
            data.append('email', email);
            data.append('password', password);
            data.append('role', role);

            // Make the API call using fetch()
            fetch(Api, {
                method: 'POST',
                body: data,
                cache: 'no-cache'
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'success',
                            message: response.message
                        });
                        setSpinner(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setSpinner(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error creatng shop!'
                    });
                    setSpinner(false);
                });
        }
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError(event.target.value.length < 4);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError(event.target.value !== password);
    };

    const handleShowConfirmPasswordClick = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        setProfileImage(file);
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPicturePreview(reader.result);
            };
        }
    };

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Add User</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button onClick={GoBack} variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Container maxWidth="sm">
                    <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleSubmit}>
                        <Grid container spacing={2} className="d-flex justify-content-center align-items-center">
                            <Grid item alignItems="center" xs={4}>
                                <div className="form-group shadow-sm rounded text-center p-3">
                                    <div className="d-flex align-items-center ">
                                        <div className="profile-image">
                                            {picturePreview ? (
                                                <img src={picturePreview} alt="Profile" />
                                            ) : (
                                                <div className="profile-placeholder">
                                                    <i className="fas fa-camera"></i>
                                                </div>
                                            )}
                                        </div>
                                        <div className="custom-file ml-3">
                                            <input
                                                type="file"
                                                hidden
                                                className="custom-file-input border border-3"
                                                id="profile-image"
                                                accept="image/*"
                                                onChange={handleProfileImageChange}
                                            />

                                            <label color="primary" className="custom-file-label ms-3 fw-bold fs-5" htmlFor="profile-image">
                                                Upload Profile
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <TextField
                                    required
                                    fullWidth
                                    label="Name"
                                    color="primary"
                                    fullWidth
                                    className="mt-3"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    error={nameError}
                                    helperText={nameError ? 'Please enter a name' : ''}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    className="mt-3"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    error={emailError}
                                    helperText={emailError ? 'Please enter a valid email' : ''}
                                />
                                <TextField
                                    id="password"
                                    label="Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={handlePasswordChange}
                                    error={passwordError}
                                    helperText={passwordError && 'Password must be at least 4 characters long'}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    id="confirm-password"
                                    label="Confirm Password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    error={confirmPasswordError}
                                    helperText={confirmPasswordError && 'Passwords do not match'}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={handleShowConfirmPasswordClick}>
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                                <TextField
                                    required
                                    fullWidth
                                    select
                                    label="Role"
                                    className="mt-3"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    error={roleError}
                                    helperText={roleError ? 'Please select a role' : ''}
                                >
                                    {roles.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button type="submit" variant="contained" className="mt-3 w-100" color="primary">
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Add User'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Grid>
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};
export default AddUsers;
