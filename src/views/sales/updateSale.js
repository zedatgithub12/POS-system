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

// ==============================||     UPDATE SALE PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UpdateSale = () => {
    const navigate = useNavigate();
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
    const [spinner, setSpinner] = useState(false);
    //
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

    // function handleAddToCart(itemToAdd) {
    //     let newItem = {
    //         id: itemToAdd.id,
    //         itemName: itemToAdd.name,
    //         itemCode: itemToAdd.code,
    //         brand: itemToAdd.brand,
    //         unit: itemToAdd.unit,
    //         unitPrice: itemToAdd.price,
    //         quantity: 1,
    //         subtotal: itemToAdd.price
    //     };

    //     // Parse the items string into a JavaScript array
    //     const itemsArray = JSON.parse(salesData.items);

    //     // Find the index of the object that needs to be updated (if it already exists in the array)
    //     const index = itemsArray.find((item) => item.id === newItem.id);

    //     if (index) {
    //         // If the item already exists in the array, update its quantity and subtotal
    //         itemsArray[index].quantity++;
    //         itemsArray[index].subtotal = itemsArray[index].quantity * itemToAdd.price;
    //     } else {
    //         // If the item doesn't exist in the array, add it to the end
    //         itemsArray.push(newItem);
    //     }

    //     // Stringify the array back into a JSON string
    //     const updatedItems = JSON.stringify(itemsArray);

    //     const updatedSalesData = {
    //         ...salesData,
    //         items: updatedItems,
    //         grandtotal: itemsArray.reduce((total, item) => total + item.subtotal, 0) + -salesData.discount
    //     };

    //     setSalesData(updatedSalesData);
    // }

    // Handle incrementing item quantity
    function handleIncrement(itemId) {
        let itemsArray = JSON.parse(salesData.items);

        // Find the index of the object that needs to be updated
        let index = itemsArray.findIndex((item) => item.id === itemId);

        if (index !== -1) {
            // If the item exists in the array, update its quantity and subtotal
            itemsArray[index].quantity += 1;
            itemsArray[index].subtotal = itemsArray[index].unitPrice * itemsArray[index].quantity;

            // Stringify the array back into a JSON string
            let updatedItems = JSON.stringify(itemsArray);

            let updatedSalesData = {
                ...salesData,
                items: updatedItems,
                grandtotal: itemsArray.reduce((total, item) => total + item.subtotal, 0)
            };

            setSalesData(updatedSalesData);
        }
    }

    // Handle decrementing item quantity
    function handleDecrement(itemId) {
        let itemsArray = JSON.parse(salesData.items);

        // Find the index of the object that needs to be updated
        let index = itemsArray.findIndex((item) => item.id === itemId);

        if (index !== -1) {
            // If the item exists in the array and its quantity is greater than 1, update its quantity and subtotal
            if (itemsArray[index].quantity > 1) {
                itemsArray[index].quantity -= 1;
                itemsArray[index].subtotal = itemsArray[index].unitPrice * itemsArray[index].quantity;

                // Stringify the array back into a JSON string
                let updatedItems = JSON.stringify(itemsArray);

                let updatedSalesData = {
                    ...salesData,
                    items: updatedItems,
                    grandtotal: itemsArray.reduce((total, item) => total + item.subtotal, 0)
                };

                setSalesData(updatedSalesData);
            }
        }
    }

    // Handle removing item from cart
    function handleRemoveFromCart(itemToRemove) {
        let itemsArray = JSON.parse(salesData.items);

        // Filter out the item to be removed
        itemsArray = itemsArray.filter((item) => item.id !== itemToRemove.id);

        // Stringify the array back into a JSON string
        let updatedItems = JSON.stringify(itemsArray);

        let updatedSalesData = {
            ...salesData,
            items: updatedItems,
            grandtotal: itemsArray.reduce((total, item) => (total += item.subtotal), 0)
        };

        setSalesData(updatedSalesData);
    }
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
            products: JSON.parse(salesData.items),
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
                                        {JSON.parse(salesData.items).map((item, index) => (
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
                                                <TableCell>{parseInt(item.unitPrice)}</TableCell>
                                                <TableCell>{parseInt(item.subtotal).toFixed(2)}</TableCell>
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
