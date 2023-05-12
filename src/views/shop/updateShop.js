import React, { useState } from 'react';
// material-ui
import { Grid, Typography, Button, Divider, Box, TextField, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useLocation } from 'react-router-dom';
import Connections from 'api';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UpdateShop = () => {
    const { state } = useLocation();

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

    const [formData, setFormData] = useState({
        shopName: state.name ? state.name : '',
        address: state.address ? state.address : '',
        description: state.description ? state.description : '',
        phone: state.phone ? state.phone : '',
        shopProfile: state.profile_image ? state.profile_image : null,
        shopProfilePreview: state.profile_image ? state.profile_image : null
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        // Declare the data to be sent to the API
        setSpinner(true);
        var Api = Connections.api + Connections.updatestore + state.id;
        var headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };

        const data = new FormData();
        data.append('name', formData.shopName);
        data.append('address', formData.address);
        data.append('description', formData.description);
        data.append('phone', formData.phone);
        data.append('profile_image', formData.shopProfile);

        // Make the API call using fetch()
        fetch(Api, {
            method: 'POST',
            body: data
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
            .catch((error) => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error updating shop!'
                });
                setSpinner(false);
            });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFormData((prevState) => ({ ...prevState, shopProfile: file }));

        // Preview the uploaded image
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData((prevState) => ({ ...prevState, shopProfilePreview: reader.result }));
        };
    };

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Update Shop</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/shops" variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12} spacing={2}></Grid>

                <Grid container spacing={gridSpacing} alignItems="center" justifyContent="center">
                    <Box sx={{ maxWidth: 500 }}>
                        <Typography variant="h4" gutterBottom guttertop style={{ marginTop: 20 }}></Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {formData.shopProfilePreview && (
                                        <img
                                            src={
                                                Connections.images + formData.shopProfile
                                                    ? Connections.images + formData.shopProfile
                                                    : formData.shopProfile
                                            }
                                            alt="Shop Profile Preview"
                                            className="img-fluid border  rounded-3"
                                            style={{ width: '100%', marginTop: 10 }}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        id="shopProfile"
                                        name="shopProfile"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label htmlFor="shopProfile" color="primary">
                                        <IconButton component="span">
                                            <AddPhotoAlternateIcon />
                                        </IconButton>
                                        Update Shop Profile
                                    </label>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Shop Name"
                                        name="shopName"
                                        onChange={handleInputChange}
                                        value={formData.shopName}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        onChange={handleInputChange}
                                        value={formData.address}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        onChange={handleInputChange}
                                        value={formData.description}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        onChange={handleInputChange}
                                        value={formData.phone}
                                        required
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">
                                        {spinner ? (
                                            <div className="spinner-border spinner-border-sm text-light " role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            'Update Shop'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default UpdateShop;
