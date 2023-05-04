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
    MenuItem,
    TextareaAutosize,
    Grid,
    Divider
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate, useLocation } from 'react-router-dom';
import { Delete } from '@mui/icons-material';
// ==============================|| CREATE SALE PAGE ||============================== //

const CreateSale = () => {
    const navigate = useNavigate();

    const GoBack = () => {
        navigate(-1);
    };
    const [orderItems, setOrderItems] = useState([]);
    const [orderTax, setOrderTax] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [notes, setNotes] = useState('');

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
                            <TextField label="Customer Name" fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Product Search" onChange={handleProductSearch} fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product Name</TableCell>
                                            <TableCell>Unit Price</TableCell>
                                            <TableCell>Stock</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Discount</TableCell>
                                            <TableCell>Tax</TableCell>
                                            <TableCell>Subtotal</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orderItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.productName}</TableCell>
                                                <TableCell>{item.unitPrice}</TableCell>
                                                <TableCell>{item.stock}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Button onClick={(event) => handleQuantityChange(event, index, -1)}>-</Button>
                                                        <Typography>{item.quantity}</Typography>
                                                        <Button onClick={(event) => handleQuantityChange(event, index, 1)}>+</Button>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{item.discount}</TableCell>
                                                <TableCell>{item.tax}</TableCell>
                                                <TableCell>{item.subtotal}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleDeleteProduct(index)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box mt={2}>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Order Tax</TableCell>
                                                <TableCell>{orderTax}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Discount</TableCell>
                                                <TableCell>{discount}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Grand Total</TableCell>
                                                <TableCell>{/* compute grand total */}</TableCell>
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
                                        <TextField label="Order Tax (%)" onChange={(event) => setOrderTax(event.target.value)} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Discount (ETB)" onChange={(event) => setDiscount(event.target.value)} fullWidth />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Select value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)} fullWidth>
                                            <MenuItem value="paid">Paid</MenuItem>
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box mt={2}>
                                <TextareaAutosize
                                    rowsMin={3}
                                    placeholder="Notes"
                                    onChange={(event) => setNotes(event.target.value)}
                                    fullWidth
                                />
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
