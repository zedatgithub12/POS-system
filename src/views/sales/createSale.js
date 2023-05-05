import React, { useState } from 'react';

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
    Menu,
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
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, incrementQuantity, decrementQuantity } from 'cart/cartSlice';
import forSale from 'data/itemsfosale';

// ==============================|| CREATE SALE PAGE ||============================== //
const dummyNames = [{ customer: 'John Doe' }, { customer: 'Jane Doe' }, { customer: 'Bob Smith' }, { customer: 'Mary Johnson' }];

const CreateSale = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    const items = useSelector((state) => state.cart.items);
    const grandTotal = useSelector((state) => state.cart.grandTotal);
    const [orderTax, setOrderTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [notes, setNotes] = useState('');
    const [customerName, setCustomerName] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [suggestedNames, setSuggestedNames] = useState(dummyNames);
    const [value, setValue] = useState(null);
    const dispatch = useDispatch();
    const handleCustomerNameChange = (event) => {
        const value = event.target.value;
        setCustomerName(value);
        const filteredNames = dummyNames.filter((name) => name.toLowerCase().startsWith(value.toLowerCase()));

        // Set suggested names based on the filtered names
        setSuggestedNames(filteredNames);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSuggestedNameClick = (name) => {
        setCustomerName(name);
        setSuggestedNames([]);
        setAnchorEl(null);
    };
    const handleStatusChange = (event) => {
        setPaymentStatus(event.target.value);
    };
    const handleMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    const handleProductSearch = (event) => {
        // Add product to orderItems
    };

    const handleQuantityChange = (event, index) => {
        // Update quantity of product in orderItems
    };

    const handleDeleteProduct = (index) => {
        // Remove product from orderItems
    };

    const handleSave = () => {
        // Save sale to database
    };

    const handleCancel = () => {
        // Clear form inputs
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
    React.useEffect(() => {
        // Add event listener to document to close menu when clicking away
        const handleDocumentClick = (event) => {
            if (anchorEl && !anchorEl.contains(event.target)) {
                setAnchorEl(null);
            }
        };

        document.addEventListener('click', handleDocumentClick);
        console.log(items);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [anchorEl]);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Create Sale</Typography>
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
                            <TextField label="Shop" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={dummyNames}
                                getOptionLabel={(option) => option.customer}
                                onInputChange={(event, newValue) => {
                                    setCustomerName(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                options={forSale}
                                getOptionLabel={(option) => option.itemName}
                                onChange={(event, value) => {
                                    if (value) {
                                        setValue(value);
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
                                        {items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.product.itemName}</TableCell>
                                                <TableCell>{item.product.itemCode}</TableCell>

                                                <TableCell>{item.product.brand}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Button onClick={() => handleDecrement(item.product.id)}>-</Button>
                                                        <Typography>{item.quantity}</Typography>
                                                        <Button onClick={() => handleIncrement(item.product.id)}>+</Button>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{item.product.unit}</TableCell>
                                                <TableCell>{item.product.unitPrice}</TableCell>
                                                <TableCell>{item.subtotal.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleRemoveFromCart(item.product)}>
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
                                                <TableCell>{orderTax}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Discount</TableCell>
                                                <TableCell>{discount}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Grand Total</TableCell>
                                                <TableCell className="fw-semibold fs-4">{grandTotal.toFixed(2)} ETB</TableCell>
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
                                        <TextField label="Sale Tax (%)" onChange={(event) => setOrderTax(event.target.value)} fullWidth />
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
                                                    <MenuItem value="cash">With Cash</MenuItem>
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
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <Box mt={2} display="flex" justifyContent="flex-end">
                                <Button variant="contained" color="primary" onClick={handleSave}>
                                    Save
                                </Button>
                                <Box ml={1}>
                                    <Button variant="contained" color="secondary" onClick={handleCancel}>
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

export default CreateSale;
