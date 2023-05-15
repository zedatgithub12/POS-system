import React, { useState, useEffect } from 'react';

// material-ui
import { Grid, Typography, Divider, Button, TextField, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
//other imports
import { useNavigate } from 'react-router-dom';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import 'views/styles/pages.css';
import { Container } from 'react-bootstrap';
import Connections from 'api';

// ==============================|| ADD CUSTOMER PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AddCustomer = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
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
    const [shop, setShops] = useState([]);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [shopName, setShopName] = useState('');
    const [nameError] = useState(false);
    const [emailError] = useState(false);
    const [roleError] = useState(false);
    const [spinner, setSpinner] = useState(false);
    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        var Api = Connections.api + Connections.addcustomer;
        const data = { name: name, phone: phone, shop: shopName };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch(Api, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                // show success message
                if (response.success) {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'success',
                        message: response.message
                    });
                    setSpinner(false);
                    // clear form
                    setName('');
                    setPhone('');
                    setShopName('');
                } else {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: response.message
                    });
                    setSpinner(false);
                    // clear form
                    setName('');
                    setPhone('');
                    setShopName('');
                }
            })
            .catch(() => {
                // show error message
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: response.message
                });
                setSpinner(false);
            });
    };

    useEffect(() => {
        const getShops = () => {
            var Api = Connections.api + Connections.viewstore;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'GET',
                headers: headers
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setShops(response.data);
                    } else {
                        setShops([]);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error creatng shop!'
                    });
                });
        };
        getShops();
        return () => {};
    }, [popup]);
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
                                    value={phone}
                                    onChange={(event) => setPhone(event.target.value)}
                                    error={emailError}
                                    helperText={emailError ? 'Please enter a valid phne' : ''}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    select
                                    label="Shop"
                                    className="mt-3"
                                    value={shopName}
                                    onChange={(event) => setShopName(event.target.value)}
                                    error={roleError}
                                    helperText={roleError ? 'Please select a role' : ''}
                                >
                                    {shop.map((option) => (
                                        <MenuItem key={option.id} value={option.name}>
                                            {option.name}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <Button variant="contained" className="mt-3 w-100" color="primary" type="submit">
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Add Customer'
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
export default AddCustomer;
