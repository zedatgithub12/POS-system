import { useState } from 'react';

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

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate, useLocation } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
// import { useDispatch } from 'react-redux';
// import { addItem, removeItem, incrementQuantity, decrementQuantity } from 'cart/cartSlice';
import forSale from 'data/itemsfosale';
import Connections from 'api';

// ==============================|| CREATE SALE PAGE ||============================== //
const dummyNames = [{ customer: 'John Doe' }, { customer: 'Jane Doe' }, { customer: 'Bob Smith' }, { customer: 'Mary Johnson' }];

const UpdateSale = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const item = state ? state : {};
    const GoBack = () => {
        navigate(-1);
    };
    const [salesData, setSalesData] = useState(item);
    const [grandTotal] = useState(item.grandtotal);
    const [saleTax, setSaleTax] = useState(item.tax);
    const [discount, setDiscount] = useState(item.discount);
    const [paymentStatus, setPaymentStatus] = useState(item.payment_status);
    const [paymentMethod, setPaymentMethod] = useState(item.payment_method);
    const [shop] = useState(item.shop);
    const [customerName, setCustomerName] = useState(item.customer.name);
    const [note, setNote] = useState(item.note);

    // const dispatch = useDispatch();

    const handleStatusChange = (event) => {
        setPaymentStatus(event.target.value);
    };
    const handleMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    function handleAddToCart(itemToAdd) {
        let newItem = {
            id: itemToAdd.id,
            itemName: itemToAdd.itemName,
            itemCode: itemToAdd.itemCode,
            brand: itemToAdd.brand,
            unit: itemToAdd.unit,
            unitPrice: itemToAdd.unitPrice,
            quantity: 1,
            subtotal: itemToAdd.unitPrice
        };
        let updatedSalesData = {
            ...salesData,
            items: [...salesData.items, newItem],
            grandtotal:
                salesData.items.reduce((total, item) => total + item.subtotal, 0) + itemToAdd.unitPrice + salesData.tax - salesData.discount
        };
        setSalesData(updatedSalesData);
    }

    // Handle incrementing item quantity
    function handleIncrement(itemId) {
        let itemToUpdate = salesData.items.find((item) => item.id === itemId);
        itemToUpdate.quantity++;
        itemToUpdate.subtotal = itemToUpdate.unitPrice * itemToUpdate.quantity;
        let updatedSalesData = {
            ...salesData,
            items: salesData.items.map((item) => (item.id === itemId ? itemToUpdate : item)),
            grandtotal: salesData.items.reduce((total, item) => total + item.subtotal, 0) + salesData.tax - salesData.discount
        };
        setSalesData(updatedSalesData);
    }

    // Handle decrementing item quantity
    function handleDecrement(itemId) {
        let itemToUpdate = salesData.items.find((item) => item.id === itemId);
        if (itemToUpdate.quantity > 1) {
            itemToUpdate.quantity--;
            itemToUpdate.subtotal = itemToUpdate.unitPrice * itemToUpdate.quantity;
            let updatedSalesData = {
                ...salesData,
                items: salesData.items.map((item) => (item.id === itemId ? itemToUpdate : item)),
                grandtotal: salesData.items.reduce((total, item) => total + item.subtotal, 0) + -salesData.discount
            };
            setSalesData(updatedSalesData);
        }
    }

    // Handle removing item from cart
    function handleRemoveFromCart(itemToRemove) {
        let updatedSalesData = {
            ...salesData,
            items: salesData.items.filter((item) => item.id !== itemToRemove.id),
            grandtotal: salesData.items.reduce((total, item) => total + item.subtotal, 0)
        };
        setSalesData(updatedSalesData);
    }
    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    const handleSave = () => {
        // Save sale to database
        // alert('you make a sale');
        var Api = Connections.url + Connections.createSale;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };
        var Data = {
            userid: 12, //this will be a value featched from session storage user.id
            shop: 'shop', //this will be a shop salling user assigned as manager featched from session storage user.shop
            customer: 'Kebede Nanno',
            products: salesData.items,
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
            body: JSON.stringify(Data)
        })
            .then((response) => response.json())
            .then((response) => {
                console.log('Created sale', response);
            })
            .catch((e) => {
                console.log(e);
            });
    };
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
                            <TextField label="Shop" fullWidth value={shop} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={dummyNames}
                                getOptionLabel={(option) => option.customer}
                                onInputChange={(event, newValue) => {
                                    setCustomerName(newValue);
                                }}
                                defaultValue={{ customer: customerName }}
                                renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={forSale}
                                getOptionLabel={(option) => option.itemName}
                                onChange={(event, value) => {
                                    if (value) {
                                        handleAddToCart(value);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Search Product" variant="outlined" />}
                            />
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
                                        {salesData.items.map((item, index) => (
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
                                                <TableCell>{item.subtotal.toFixed(2)}</TableCell>
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
                                                <TableCell>Tax</TableCell>
                                                <TableCell>{saleTax}%</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Discount</TableCell>
                                                <TableCell>{discount} ETB</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Grand Total</TableCell>
                                                <TableCell className="fw-semibold fs-4">{salesData.grandtotal.toFixed(2)} ETB</TableCell>
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
                                        <TextField
                                            label="Sale Tax (%)"
                                            onChange={(event) => setSaleTax(event.target.value)}
                                            fullWidth
                                            value={saleTax}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Discount (ETB)"
                                            onChange={(event) => setDiscount(event.target.value)}
                                            fullWidth
                                            value={discount}
                                        />
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
                                    Save
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
        </MainCard>
    );
};

export default UpdateSale;
