import React, { useState } from 'react';
// material-ui
import { Grid, Typography, Button, Divider, Box, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import shop from 'assets/images/placeholder-store.png';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import Connections from 'api';
import GoogleMapReact from 'google-map-react';
import pin from 'assets/images/icons/marker.svg';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// Custom marker component
const Marker = () => (
    <div className="marker">
        <img src={pin} alt="marker" width={30} height={30} />
    </div>
);

const CreateShop = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
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
        shopName: '',
        category: '',
        region: '',
        city: '',
        subcity: '',
        address: '',
        latitude: '',
        longitude: '',
        description: '',
        phone: '',
        shopProfile: null,
        shopProfilePreview: null
    });
    const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null });

    const handleMapClick = ({ lat, lng }) => {
        setSelectedLocation({ lat, lng });
        setFormData({ ...formData, latitude: lat, longitude: lng });
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
    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        // Handle form submission here
        // Declare the data to be sent to the API
        var Api = Connections.api + Connections.createstore;
        const data = new FormData();
        data.append('name', formData.shopName);
        data.append('category', formData.category);
        data.append('region', formData.region);
        data.append('city', formData.city);
        data.append('subcity', formData.subcity);
        data.append('address', formData.address);
        data.append('latitude', formData.latitude);
        data.append('longitude', formData.longitude);
        data.append('description', formData.description);
        data.append('phone', formData.phone);
        data.append('profile_image', formData.shopProfile);

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
                    message: 'There is error creating shop!'
                });
                setSpinner(false);
            });
    };
    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="h3">Create New Shop</Typography>
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
                    <Grid item lg={4} md={6} sm={6} xs={12} spacing={2}></Grid>

                    <Grid container spacing={gridSpacing} alignItems="center" justifyContent="center">
                        <Box sx={{ maxWidth: 500 }}>
                            <Typography variant="h4" gutterBottom guttertop style={{ marginTop: 20 }}></Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <input
                                            type="file"
                                            id="shopProfile"
                                            name="shopProfile"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="shopProfile">
                                            <img
                                                src={formData.shopProfilePreview ? formData.shopProfilePreview : shop}
                                                alt="Shop Profile Preview"
                                                className="img-fluid border  rounded-3"
                                                style={{ width: 220, height: 220, marginTop: 10 }}
                                            />

                                            <Typography variant="text" color={theme.palette.primary.main} sx={{ marginX: 4 }}>
                                                Shop Picture
                                            </Typography>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
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
                                            label="Category"
                                            name="category"
                                            onChange={handleInputChange}
                                            value={formData.category}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            multiline
                                            rows={4}
                                            rowsMax={12}
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
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <TextField
                                            label="Region"
                                            name="region"
                                            onChange={handleInputChange}
                                            value={formData.region}
                                            required
                                            sx={{ width: '48%' }}
                                        />
                                        <TextField
                                            label="City"
                                            name="city"
                                            onChange={handleInputChange}
                                            value={formData.city}
                                            sx={{ width: '48%' }}
                                            required
                                        />
                                    </Grid>

                                    <Grid item xs={12}></Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Sub City"
                                            name="subcity"
                                            onChange={handleInputChange}
                                            value={formData.subcity}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Address"
                                            name="address"
                                            onChange={handleInputChange}
                                            value={formData.address}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography sx={{ paddingBottom: 1 }}>Select location on the map</Typography>
                                        <Box sx={{ height: 400, width: '100%' }}>
                                            <GoogleMapReact
                                                defaultCenter={{ lat: 9.0108, lng: 38.7617 }} // Set the default center of the map
                                                defaultZoom={12} // Set default zoom level
                                                onClick={handleMapClick} // Call handleMapClick function when the map is clicked
                                            >
                                                {/* Marker to show the selected location */}
                                                {selectedLocation.lat && selectedLocation.lng && (
                                                    <Marker lat={selectedLocation.lat} lng={selectedLocation.lng} />
                                                )}
                                            </GoogleMapReact>
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} sx={{ marginTop: 2 }}>
                                        <Button type="submit" variant="contained" color="primary">
                                            {spinner ? (
                                                <div className="spinner-border spinner-border-sm text-dark " role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                'Create Shop'
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>

            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CreateShop;
