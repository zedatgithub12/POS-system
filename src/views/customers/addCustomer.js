import { useState } from 'react';

// material-ui
import { Grid, Typography, Divider, Button, TextField, MenuItem } from '@mui/material';

//other imports
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import 'views/styles/pages.css';
import { Container } from 'react-bootstrap';

// ==============================|| ADD USER PAGE ||============================== //
const shop = [
    {
        value: 'admin',
        label: 'Admin'
    },
    {
        value: 'user',
        label: 'User'
    }
];

const AddCustomer = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };

    const [profile, setProfile] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [profileError, setProfileError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [roleError, setRoleError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (profile && name && email && role) {
            console.log({ profile, name, email, role });
            setProfile('');
            setName('');
            setEmail('');
            setRole('');
            setProfileError(false);
            setNameError(false);
            setEmailError(false);
            setRoleError(false);
        } else {
            if (!profile) {
                setProfileError(true);
            }
            if (!name) {
                setNameError(true);
            }
            if (!email) {
                setEmailError(true);
            }
            if (!role) {
                setRoleError(true);
            }
        }
    };

    const handleProfileImageChange = (event) => {
        setProfileImage(event.target.files[0]);
    };

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Add Customer</Typography>
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
                                    label="Phone"
                                    type="phone"
                                    className="mt-3"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    error={emailError}
                                    helperText={emailError ? 'Please enter a valid email' : ''}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    select
                                    label="Shop"
                                    className="mt-3"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    error={roleError}
                                    helperText={roleError ? 'Please select a role' : ''}
                                >
                                    {shop.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button variant="contained" className="mt-3 w-100" color="primary" type="submit">
                                    Add Customer
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </Grid>
        </MainCard>
    );
};
export default AddCustomer;
