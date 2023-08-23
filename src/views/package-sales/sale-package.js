import React, { useState, useEffect } from 'react';

// material-ui
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Grid,
    Divider,
    Autocomplete
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import Connections from 'api';

// ==============================|| CREATE SALE PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const SalePackage = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };

    //fetch user info from session storage
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);

    const [shops, setShops] = useState([]);
    const [CustomersData, setCustomersData] = useState([]);
    const [packageData, setPackagetData] = useState([]);
    const [packageBundle, setPackageBundle] = useState([]);
    const [Items, setItems] = useState(packageData.items ? packageData.items : []);
    const [grandTotal, setGrandTotal] = useState(0);
    const [saleTax, setSaleTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [shopName, setShopsName] = useState(user.role === 'Admin' ? '' : user.store_name);
    const [customerName, setCustomerName] = useState('');
    const [note, setNote] = useState('');
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

    const handleStatusChange = (event) => {
        setPaymentStatus(event.target.value);
    };
    const handleMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleAddToCart = (packages) => {
        setPackageBundle(packages);
        setGrandTotal(parseFloat(packageBundle.price));

        setItems(JSON.parse(packages.items));
    };

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const handleSave = () => {
        // Save sale to database
        setSpinner(true);
        if (shopName === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please Select Shop!'
            });
            setSpinner(false);
        } else if (customerName === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please Select Customer!'
            });
            setSpinner(false);
        } else if (Items.length === 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please Select Package To be Sold!'
            });
            setSpinner(false);
        } else if (paymentStatus === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please Select Payment Status!'
            });
            setSpinner(false);
        } else if (paymentStatus === 'Paid' && paymentMethod === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please Select Payment Method!'
            });
            setSpinner(false);
        } else {
            var Api = Connections.api + Connections.createpackagesale;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };

            var Data = {
                user: user.name, //this will be a value featched from session storage user.id
                shop: shopName, //this will be a shop salling user assigned as manager featched from session storage user.shop
                customer: customerName,
                pname: packageBundle.name,
                products: Items,
                grandTotal: packageBundle.price,
                payment_status: paymentStatus,
                payment_method: paymentMethod,
                note: note
            };

            fetch(Api, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(Data),
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
                        message: 'There is error selling package!'
                    });
                    setSpinner(false);
                });
        }
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
                headers: headers,
                cache: 'no-cache'
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setShops(response.data);
                    } else {
                        setShops(shops);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching shop!'
                    });
                });
        };

        const getCustomers = () => {
            var AdminApi = Connections.api + Connections.viewcustomer;
            var SalesApi = Connections.api + Connections.viewstorecustomer + user.store_name;
            var Api = user.role === 'Admin' ? AdminApi : SalesApi;

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
                        setCustomersData(response.data);
                    } else {
                        setCustomersData(CustomersData);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching customers!'
                    });
                });
        };

        const getPackages = () => {
            var AdminApi = Connections.api + Connections.viewpackages;
            var saleApi = Connections.api + Connections.viewstorepackage + user.store_id;
            var Api = user.role === 'Admin' ? AdminApi : saleApi;
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
                    console.log(response.data);
                    if (response.success) {
                        setPackagetData(response.data.data);
                    } else {
                        setPackagetData(packageData);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching packages!'
                    });
                });
        };
        getCustomers();
        getPackages();

        if (user.role === 'Admin') {
            getShops();
        }

        return () => {};
    }, []);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing} gutterBottom>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Sell Package </Typography>
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
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            {user.role === 'Admin' ? (
                                <Autocomplete
                                    options={shops}
                                    getOptionLabel={(option) => option.name}
                                    onInputChange={(event, value) => {
                                        if (value) {
                                            setShopsName(value);
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Shop" variant="outlined" />}
                                    noOptionsText="Loading..."
                                />
                            ) : (
                                <TextField disabled label="Shop" variant="outlined" value={user.store_name} />
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={CustomersData}
                                getOptionLabel={(option) => option.name}
                                onInputChange={(event, value) => {
                                    setCustomerName(value);
                                }}
                                renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" />}
                                noOptionsText="Loading..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={packageData}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => {
                                    if (value) {
                                        handleAddToCart(value);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Package" variant="outlined" />}
                                noOptionsText="Loading..."
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Item Code</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Unit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.code}</TableCell>

                                                <TableCell>{item.quantity}</TableCell>

                                                <TableCell>{item.unit}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                        <Grid item xs={12} md={6} className="m-auto">
                            <Box mt={2} className=" mx-5">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Grand Total</TableCell>
                                                <TableCell className="fw-semibold fs-4">{parseInt(grandTotal)} ETB</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box mt={2}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth>
                                            <InputLabel id="payment-status-label">Payment Status</InputLabel>
                                            <Select
                                                labelId="payment-status-label"
                                                id="payment-status-select"
                                                value={paymentStatus}
                                                onChange={handleStatusChange}
                                            >
                                                <MenuItem value="Paid">Paid</MenuItem>
                                                <MenuItem value="Unpaid">Unpaid</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        {paymentStatus === 'Paid' && (
                                            <FormControl fullWidth>
                                                <InputLabel id="payment-status-label">Paid With</InputLabel>
                                                <Select
                                                    labelId="payment-status-label"
                                                    id="payment-status-select"
                                                    value={paymentMethod}
                                                    onChange={handleMethodChange}
                                                >
                                                    <MenuItem value="Cash">With Cash</MenuItem>
                                                    <MenuItem value="Mobile Banking">Mobile Banking</MenuItem>
                                                    <MenuItem value="POS">POS</MenuItem>
                                                </Select>
                                            </FormControl>
                                        )}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label="Additional Note"
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            fullWidth
                                            value={note}
                                            onChange={handleNoteChange}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box mt={2} display="flex" justifyContent="flex-end">
                                <Button variant="contained" color="primary" onClick={() => handleSave()}>
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                                <Box ml={1}>
                                    <Button variant="contained" color="secondary" onClick={GoBack}>
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
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

export default SalePackage;
