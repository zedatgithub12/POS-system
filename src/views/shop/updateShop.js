import React, { useState } from 'react';
// material-ui
import { Grid, Typography, Button, Divider, Box, TextField, IconButton } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useLocation } from 'react-router-dom';

const UpdateShop = () => {
    const { state } = useLocation();

    const [formData, setFormData] = useState({
        shopName: state.name ? state.name : '',
        address: state.address ? state.address : '',
        description: state.description ? state.description : '',
        phone: state.phone ? state.phone : '',
        shopProfile: state.picture ? state.picture : null,
        shopProfilePreview: state.picture ? state.picture : null
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(formData);
        // Handle form submission here
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
                            <Button component={Link} to="/shops" variant="outlined" color="secondary" sx={{ textDecoration: 'none' }}>
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
                        <Typography variant="h4" gutterBottom gutterTop style={{ marginTop: 20 }}></Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    {formData.shopProfilePreview && (
                                        <img
                                            src={formData.shopProfilePreview}
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
                                    <label htmlFor="shopProfile" color="secondary">
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
                                    <Button type="submit" variant="contained" color="secondary">
                                        Update Shop
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default UpdateShop;
