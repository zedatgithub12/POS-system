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
import { useNavigate } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, incrementQuantity, decrementQuantity } from 'cart/cartSlice';
import Connections from 'api';
import Quagga from 'quagga';
import { useTheme } from '@mui/material/styles';

// ==============================|| CREATE SALE PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const CreateSale = () => {
    window.addEventListener('offline', listenForNetworkConnectivityChanges);
    window.addEventListener('online', listenForNetworkConnectivityChanges);

    function listenForNetworkConnectivityChanges() {
        // Get the network status.
        var networkStatus = navigator.connection.effectiveType;

        // Check if there is a network connection.
        if (networkStatus === 'cellular' || networkStatus === 'wifi') {
            // Send the data to the online database.
            var data = getIndexDbData();
            updateOnlineDatabase(data);
        } else {
            // Save the data to the local indexdb database.
            saveIndexDbData(data);
            console.log('saving to local database');
            console.log(getIndexDbData());
        }
    }

    function getIndexDbData() {
        // Get the indexdb database.
        var db = window.indexedDB;

        // Open the database.
        var request = db.open('addis_chircharo', 1);

        // Wait for the database to open.
        request.onsuccess = function (event) {
            // Get the data from the database.
            var data = event.target.result.transaction.objectStore('data').getAllKeys();

            // Return the data.
            return data;
        };
    }

    function updateOnlineDatabase(data) {
        setSpinner(true);
        var Api = Connections.api + Connections.createsale;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        fetch(Api, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
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
                    message: 'There is error creating sale!'
                });
                setSpinner(false);
            });
    }

    function saveIndexDbData(data) {
        // Get the indexdb database.
        var db = window.indexedDB;

        // Open the database.
        var request = db.open('addis_chircharo', 1);

        // Wait for the database to open.
        request.onsuccess = function (event) {
            // Save the data to the database.
            var transaction = event.target.result.transaction;
            var objectStore = transaction.objectStore('data');

            objectStore.add(data);
        };
    }

    const theme = useTheme();
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    //redux dispatch
    const dispatch = useDispatch();
    //fetch user info from session storage
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);

    const [shops, setShops] = useState([]);
    const [CustomersData, setCustomersData] = useState([]);
    const [productData, setProductData] = useState([]);
    const items = useSelector((state) => state.cart.items);
    const grandTotal = useSelector((state) => state.cart.grandTotal);
    const [isScanning, setIsScanning] = useState(false);
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

    const handleAddToCart = (product) => {
        dispatch(addItem({ product }));
    };

    const handleRemoveFromCart = (product) => {
        dispatch(removeItem({ id: product.id }));
    };
    const handleIncrement = (id) => {
        dispatch(incrementQuantity({ id }));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity({ id }));
    };
    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const startScanner = () => {
        Quagga.init(
            {
                inputStream: {
                    name: 'Live',
                    type: 'LiveStream',
                    target: document.querySelector('#barcode'),
                    constraints: {
                        width: 40,
                        height: 40,
                        facingMode: 'environment',
                        margin: 10
                    }
                },

                decoder: {
                    readers: ['code_128_reader'] // specify the barcode format
                }
            },
            function (err) {
                if (err) {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is problem with initializing barcode scanner'
                    });
                    return;
                }

                Quagga.start();
                setIsScanning(true);
            }
        );
    };

    Quagga.onDetected((data) => {
        setIsScanning(false);
        Quagga.stop();

        const scannedItem = productData.find((item) => item.code === parseInt(data.codeResult.code));
        if (scannedItem) {
            handleAddToCart(scannedItem);
        } else {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Unable to detect the barcode!'
            });
        }
    });

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
        } else if (items.length === 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please Select Items To be Sold!'
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
            var Api = Connections.api + Connections.createsale;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };

            var Data = {
                user: user.name, //this will be a value featched from session storage user.id
                shop: shopName, //this will be a shop salling user assigned as manager featched from session storage user.shop
                customer: customerName,
                products: items,
                tax: saleTax,
                discount: discount,
                grandTotal: grandTotal,
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
                        message: 'There is error fetching sales!'
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

        const getProducts = () => {
            var AdminApi = Connections.api + Connections.viewproduct;
            var saleApi = Connections.api + Connections.viewstoreproduct + user.store_name;
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
                    if (response.success) {
                        setProductData(response.data);
                    } else {
                        setProductData(productData);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching product!'
                    });
                });
        };
        getCustomers();
        getProducts();

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
                                    <Typography variant="h3">Sell Items</Typography>
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
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                            <Box style={{ display: 'flex', alignItems: 'center' }}>
                                <Button className="mt-2" onClick={() => startScanner()} disabled={isScanning}>
                                    Scan Barcode
                                </Button>
                                <Typography sx={{ color: theme.palette.error.main }}>{isScanning ? 'Scanning...' : ''}</Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Item Code</TableCell>
                                            <TableCell>Brand</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Unit</TableCell>
                                            <TableCell>Unit Price</TableCell>
                                            <TableCell>Subtotal</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.itemName}</TableCell>
                                                <TableCell>{item.itemCode}</TableCell>

                                                <TableCell>{item.brand}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Button onClick={() => handleDecrement(item.id)}>-</Button>
                                                        <Typography>{item.quantity}</Typography>
                                                        <Button onClick={() => handleIncrement(item.id)}>+</Button>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{item.unit}</TableCell>
                                                <TableCell>{item.unitPrice}</TableCell>
                                                <TableCell>{parseInt(item.subtotal)}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemoveFromCart(item)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Grid container>
                                <Grid item xs={2} md={2} lg={2} xl={2}>
                                    <div id="barcode" style={isScanning ? { height: 140 } : {}}></div>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={6} className="m-auto">
                            <Box mt={2} className="border rounded mx-5">
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Tax</TableCell>
                                                <TableCell>{saleTax}%</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Discount</TableCell>
                                                <TableCell>{discount} ETB</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Grand Total</TableCell>
                                                <TableCell className="fw-semibold fs-4">
                                                    {parseInt(grandTotal).toFixed(2)} ETB
                                                    {/* <IconButton className="ms-3" onClick={() => setGrandTotal(grandTotal)}>
                                                        <IconReload />
                                                    </IconButton> */}
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
                                        <TextField label="Sale Tax (%)" onChange={(event) => setSaleTax(event.target.value)} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Discount (ETB)" onChange={(event) => setDiscount(event.target.value)} fullWidth />
                                    </Grid>

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

export default CreateSale;
