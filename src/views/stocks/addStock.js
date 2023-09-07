import React, { useState, useEffect } from 'react';
// material-ui
import { Grid, Typography, Button, Divider, TextField, Container, FormControl, MenuItem, Select, Autocomplete, Box } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';

import Connections from 'api';
// ==============================|| Add Product PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AddStock = () => {
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

    const [items, setItems] = useState([]);
    const [shops, setShops] = useState([]);
    const [itemName, setItemName] = useState();
    const [ItemCode, setItemCode] = useState();
    const [productCost, setProductCost] = useState('');
    const [itemSKU, setItemSKU] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productMinQuantity, setProductMinQuantity] = useState('');
    const [shop, setShop] = useState('Shop');
    const [spinner, setSpinner] = useState(false);
    const [expireDate, setExpireDate] = useState(null);

    const handleItemChange = (value) => {
        setItemName(value.item_name);
        setItemCode(value.item_code);
        setItemSKU(value.item_sku);
    };

    const handleShopChange = (event) => {
        setShop(event.target.value);
    };

    const handleExpireDateChange = (event) => {
        setExpireDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Handle form submission here
        // Declare the data to be sent to the API

        if (itemName === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select product to add'
            });
        } else if (itemName === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select product to add'
            });
        } else {
            setSpinner(true);
            var Api = Connections.api + Connections.createStocks;

            const data = new FormData();
            data.append('item_name', itemName);
            data.append('item_code', ItemCode);
            data.append('stock_cost', productCost);
            data.append('stock_unit', itemSKU);
            data.append('stock_price', productPrice);
            data.append('stock_quantity', productQuantity);
            data.append('stock_min_quantity', productMinQuantity);
            data.append('stock_expire_date', expireDate);
            data.append('stock_shop', shop);

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
                        message: 'There is error creating  stock!'
                    });
                    setSpinner(false);
                });
        }
    };

    useEffect(() => {
        const getItems = () => {
            var Api = Connections.api + Connections.allItems;
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
                        setItems(response.data);
                    } else {
                        setItems(productData);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching product!'
                    });
                    setLoading(false);
                });
        };

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
                        setShops((prevShops) => {
                            // Combine the previous shops with the new ones from the API
                            return [...prevShops, ...response.data];
                        });
                    } else {
                        setShops((prevShops) => {
                            // Combine the previous shops with the new ones from the API
                            return [...prevShops, ...shops];
                        });
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

        getItems();
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
                                    <Typography variant="h3">Create Stock</Typography>
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
            </Grid>
            <Container maxWidth="sm">
                <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <Select value={shop} onChange={handleShopChange}>
                                    <MenuItem value="Shop"> Select Shop</MenuItem>
                                    {Array.from(new Set(shops.map((stores) => stores.name))).map((shop) => (
                                        <MenuItem key={shop} value={shop}>
                                            {shop}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={items}
                                getOptionLabel={(option) => `${option.item_name} - ${option.item_brand} - ${option.item_sku}`}
                                onChange={(event, value) => {
                                    if (value) {
                                        handleItemChange(value);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Item" variant="outlined" />}
                                noOptionsText="Loading..."
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Puchase Price"
                                color="primary"
                                value={productCost}
                                onChange={(event) => setProductCost(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Selling Price"
                                color="primary"
                                value={productPrice}
                                onChange={(event) => setProductPrice(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Stock Quantity"
                                color="primary"
                                value={productQuantity}
                                onChange={(event) => setProductQuantity(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Stock Min Quantity"
                                color="primary"
                                value={productMinQuantity}
                                onChange={(event) => setProductMinQuantity(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Stock Expire date"
                                color="primary"
                                type="date"
                                value={expireDate}
                                onChange={handleExpireDateChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button type="submit" variant="contained" color="primary" sx={{ paddingX: 15, paddingY: 1.4 }}>
                                {spinner ? (
                                    <div className="spinner-border spinner-border-sm text-dark " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default AddStock;
