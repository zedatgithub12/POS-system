// material-ui
import { Grid, Typography, Button, Divider, TextField, Container, FormControl, MenuItem, Select, Autocomplete } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
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
    const [itemName, setItemName] = useState('Select Item');
    const [ItemCode, setItemCode] = useState();
    const [productCost, setProductCost] = useState('');
    const [productUnit, setProductUnit] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productMinQuantity, setProductMinQuantity] = useState('');
    const [warehouses, setWarehouses] = useState('Shops');
    const [spinner, setSpinner] = useState(false);
    const [expireDate, setExpireDate] = useState(null);

    const handleItemChange = (event) => {
        setItemName(event.target.value.item_name);
        setItemCode(event.target.value.item_code);
    };

    const handleShopChange = (event) => {
        setWarehouses(event.target.value);
    };

    const handleExpireDateChange = (event) => {
        setExpireDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        // Handle form submission here
        // Declare the data to be sent to the API
        var Api = Connections.api + Connections.createStocks;

        const data = new FormData();
        data.append('item_name', itemName);
        data.append('item_code', ItemCode);
        data.append('stock_cost', productCost);
        data.append('stock_unit', productUnit);
        data.append('stock_price', productPrice);
        data.append('stock_quantity', productQuantity);
        data.append('stock_min_quantity', productMinQuantity);
        data.append('stock_expire_date', expireDate);
        data.append('stock_shop', warehouses);

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
                    message: 'There is error adding  product!'
                });
                setSpinner(false);
            });
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
                                    <Typography variant="h3">Create Item</Typography>
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
                                <Select value={warehouses} onChange={handleShopChange}>
                                    <MenuItem value="Shops"> Select Shop</MenuItem>
                                    {Array.from(new Set(shops.map((stores) => stores.name))).map((shop) => (
                                        <MenuItem key={shop} value={shop}>
                                            {shop}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <Select value={itemName} onChange={(event) => handleItemChange(event)}>
                                    <MenuItem value={itemName}>{itemName}</MenuItem>
                                    {items.map((item, index) => (
                                        <MenuItem
                                            key={index}
                                            value={item}
                                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                        >
                                            <span>{item.item_name} </span>
                                            <span>{item.item_code} </span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Unit"
                                color="primary"
                                value={productUnit}
                                onChange={(event) => setProductUnit(event.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Cost"
                                color="primary"
                                value={productCost}
                                onChange={(event) => setProductCost(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Price"
                                color="primary"
                                value={productPrice}
                                onChange={(event) => setProductPrice(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item Quantity"
                                color="primary"
                                value={productQuantity}
                                onChange={(event) => setProductQuantity(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Min Quantity"
                                color="primary"
                                value={productMinQuantity}
                                onChange={(event) => setProductMinQuantity(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth color="primary" type="date" value={expireDate} onChange={handleExpireDateChange} />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" style={{ margin: '1rem 0' }}>
                        {spinner ? (
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Save'
                        )}
                    </Button>
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
