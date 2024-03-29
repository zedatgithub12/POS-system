import React, { useEffect, useState } from 'react';
// material-ui
import { Grid, Typography, Button, Divider, Box, TextField, IconButton, Autocomplete } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useLocation } from 'react-router-dom';
import Connections from 'api';
import GoogleMapReact from 'google-map-react';
import pin from 'assets/images/icons/marker.svg';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Marker = () => (
    <div className="marker">
        <img src={pin} alt="marker" width={30} height={30} />
    </div>
);
const UpdateShop = () => {
    const { state } = useLocation();
    const [spinner, setSpinner] = useState(false);
    const [users, setUsers] = useState([]);
    const [managername, setManagerName] = useState(state.manager);
    const [managerId, setManagerId] = useState(state.manager_id);

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

    const ChangeManager = (value) => {
        const selectedName = value.name;
        const selectedId = value.id;
        setManagerName(selectedName);
        setManagerId(selectedId);
    };
    const [formData, setFormData] = useState({
        shopName: state.name ? state.name : '',
        category: state.category ? state.category : '',
        region: state.region ? state.region : '',
        city: state.city ? state.city : '',
        subcity: state.subcity ? state.subcity : '',
        address: state.address ? state.address : '',
        tinnumber: state.tin_number ? state.tin_number : '',
        latitude: state.latitude ? state.latitude : 9.0108,
        longitude: state.longitude ? state.longitude : 38.7617,
        description: state.description ? state.description : '',
        phone: state.phone ? state.phone : '',
        shopProfile: state.profile_image ? state.profile_image : null,
        shopProfilePreview: state.profile_image ? state.profile_image : null
    });

    // const [selectedLocation, setSelectedLocation] = useState({ lat: null, lng: null });

    const handleMapClick = ({ lat, lng }) => {
        setFormData({ ...formData, latitude: lat, longitude: lng });
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        // Declare the data to be sent to the API
        setSpinner(true);
        var Api = Connections.api + Connections.updatestore + state.id;

        const data = new FormData();
        data.append('name', formData.shopName);
        data.append('manager_id', managerId);
        data.append('manager', managername);
        data.append('category', formData.category);
        data.append('region', formData.region);
        data.append('city', formData.city);
        data.append('subcity', formData.subcity);
        data.append('address', formData.address);
        data.append('tin_number', formData.tinnumber);
        data.append('latitude', formData.latitude);
        data.append('longitude', formData.longitude);
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
            .catch(() => {
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

    useEffect(() => {
        const getUsers = () => {
            var Api = Connections.api + Connections.viewuser;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'GET',
                headers: headers,
                cache: 'no-cache'
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setUsers(response.data);
                    } else {
                        setUsers(userData);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error featching  users!'
                    });
                });
        };

        getUsers();

        return () => {};
    }, [spinner, popup]);
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
                                        rows={6}
                                        rowsMax={12}
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        onChange={handleInputChange}
                                        value={formData.description}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={users}
                                        getOptionLabel={(option) => `${option.name} (${option.id})`} // Modified getOptionLabel function
                                        onInputChange={(event, value) => {
                                            ChangeManager(value);
                                        }}
                                        defaultValue={{ name: managername }}
                                        renderInput={(params) => <TextField {...params} label="Manager" variant="outlined" />}
                                        onChange={(event, value) => {
                                            ChangeManager(value); // Pass the selected option to the ChangeManager function
                                        }}
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
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Tin number"
                                        name="tinnumber"
                                        onChange={handleInputChange}
                                        value={formData.tinnumber}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography sx={{ paddingBottom: 1 }}>Location on the map</Typography>
                                    <Box sx={{ height: 400, width: '100%' }}>
                                        <GoogleMapReact
                                            defaultCenter={{ lat: 9.0108, lng: 38.7617 }} // Set the default center of the map
                                            defaultZoom={12} // Set default zoom level
                                            onClick={handleMapClick} // Call handleMapClick function when the map is clicked
                                        >
                                            {/* Marker to show the selected location */}
                                            {formData.latitude && formData.longitude && (
                                                <Marker lat={formData.latitude} lng={formData.longitude} />
                                            )}
                                        </GoogleMapReact>
                                    </Box>
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
