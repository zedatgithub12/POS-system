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
    IconButton,
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
import { useNavigate, useLocation } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import Connections from 'api';
import { useTheme } from '@mui/material/styles';
import { ActivityIndicators } from 'ui-component/activityIndicator';

// ==============================||     UPDATE SALE PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UpdateSale = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { state } = useLocation();

    //fetch user info from session storage
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const item = state ? state : {};
    const GoBack = () => {
        navigate(-1);
    };

    const [shops, setShops] = useState([]);
    const [shopName, setShopsName] = useState('');
    const [CustomersData, setCustomersData] = useState([]);
    const [salesData, setSalesData] = useState(item);
    const [paymentStatus, setPaymentStatus] = useState(item.payment_status);
    const [paymentMethod, setPaymentMethod] = useState(item.payment_method);
    const [shop] = useState(item.shop);
    const [customerName, setCustomerName] = useState(item.customer);
    const [note, setNote] = useState(item.note);

    const [loading, setLoading] = useState(false);
    const [Items, setItems] = useState([]);
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

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const handleUpdate = () => {
        // Save sale to database
        setSpinner(true);
        var Api = Connections.api + Connections.updatesale + salesData.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        var Data = {
            user: user.name, //this will be a value featched from session storage user.id
            shop: shopName, //this will be a shop salling user assigned as manager featched from session storage user.shop
            customer: customerName,
            grandTotal: salesData.grandtotal,
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
                    message: 'There is error updating sale!'
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
                        message: 'There is error creatng shop!'
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
        const getSoldItems = () => {
            setLoading(true);
            var Api = Connections.api + Connections.getSoldItem + item.id;
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
                        setItems(response.data.data);
                        setLoading(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error getting sold items!'
                    });
                    setLoading(false);
                });
        };

        getSoldItems();
        getCustomers();
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
                                    <Typography variant="h3">Update Sale #{item.reference}</Typography>
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
                            <Autocomplete
                                options={shops}
                                getOptionLabel={(option) => option.name}
                                onInputChange={(event, value) => {
                                    if (value) {
                                        setShopsName(value);
                                    }
                                }}
                                defaultValue={{ name: shop }}
                                renderInput={(params) => <TextField {...params} label="Shop" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={CustomersData}
                                getOptionLabel={(option) => option.name}
                                onInputChange={(event, value) => {
                                    setCustomerName(value);
                                }}
                                defaultValue={{ name: customerName }}
                                renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" />}
                            />
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Autocomplete
                                options={productData}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => {
                                    if (value) {
                                        handleAddToCart(value);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Search Product" variant="outlined" />}
                            />
                        </Grid> */}
                        <Grid item xs={12}>
                            <TableContainer sx={{ bgcolor: theme.palette.primary.light, borderRadius: 2, padding: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Code</TableCell>
                                            <TableCell>Category</TableCell>
                                            <TableCell>Sub Category</TableCell>
                                            <TableCell>Brand</TableCell>
                                            <TableCell align="right">SKU</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">SubTotal</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Box
                                                    sx={{
                                                        minHeight: 80,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <ActivityIndicators />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : Items.length > 0 ? (
                                        <TableBody>
                                            {Items.map((soldItem, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{soldItem.item_code}</TableCell>
                                                    <TableCell>{soldItem.item_category}</TableCell>
                                                    <TableCell>{soldItem.item_sub_category}</TableCell>
                                                    <TableCell>{soldItem.item_brand}</TableCell>
                                                    <TableCell align="right">
                                                        {' '}
                                                        <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                                                            {soldItem.stock_unit}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell align="right">{soldItem.quantity}</TableCell>

                                                    <TableCell align="right">{parseInt(soldItem.price).toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    ) : (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ borderBottom: 0 }}>
                                                    <Box padding={3}>
                                                        {/* <img src={packages} alt="Add Item" width={300} height={300} /> */}
                                                        <Typography variant="h4" color="textSecondary" sx={{ marginY: 4 }}>
                                                            sold item record is not found
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    )}
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} md={6} className="m-auto">
                            <Box mt={2} className="border rounded mx-5">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Grand Total</TableCell>
                                                <TableCell className="fw-semibold fs-4">
                                                    {parseInt(salesData.grandtotal).toFixed(2)} ETB
                                                </TableCell>
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
                                <Button variant="contained" color="primary" onClick={() => handleUpdate()}>
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

export default UpdateSale;
