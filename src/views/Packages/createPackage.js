import { useState, useEffect, forwardRef } from 'react';

// material-ui
import {
    Grid,
    Divider,
    Box,
    Paper,
    Autocomplete,
    InputAdornment,
    Button,
    IconButton,
    Typography,
    TextField,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Connections from 'api';
import { gridSpacing } from 'store/constant';
import packages from 'assets/images/packages.svg';
// ==============================|| CREATE PACKAGE PAGE ||============================== //
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const CreatePackage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const GoBack = () => {
        navigate(-1);
    };
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const [shopId, setShopId] = useState(null);
    const [shopName, setShopsName] = useState();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([]);
    const [Items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [Price, setPrice] = useState();
    const [date, setDate] = useState();
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

    const handleShopSelection = (value) => {
        setShopId(value.id);
        setShopsName(value.name);
        getShopStock(value.name);
    };
    const getShopStock = (shop) => {
        setLoading(true);
        var Api = Connections.api + Connections.getShopStocks + shop;
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
                    setLoading(false);
                } else {
                    setProductData([]);
                    setLoading(false);
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
    const handleAddToCart = (product) => {
        const existingItem = Items.find((item) => item.id === product.id);

        if (existingItem) {
            // If it does, update the quantity of the existing item
            const updatedItems = Items.map((item) => {
                if (item.id === product.id) {
                    return { ...item, item_quantity: item.item_quantity + 1 };
                }
                return item;
            });
            setItems(updatedItems);
        } else {
            setItems([
                ...Items,
                {
                    id: product.id,
                    item_name: product.item_name,
                    item_code: product.item_code,
                    item_category: product.item_category,
                    item_sub_category: product.item_sub_category,
                    item_brand: product.item_brand,
                    item_sku: product.stock_unit,
                    item_quantity: 1
                }
            ]);
        }
    };

    const handleRemoveFromCart = (product) => {
        const updatedItems = Items.filter((item) => item.id !== product.id);
        setItems(updatedItems);
    };
    const handleIncrement = (id) => {
        const updatedItems = Items.map((item) => {
            if (item.id === id) {
                return { ...item, item_quantity: parseInt(item.item_quantity) + 1 };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleDecrement = (id) => {
        const updatedItems = Items.map((item) => {
            if (item.id === id && item.item_quantity > 0) {
                return { ...item, item_quantity: parseInt(item.item_quantity) - 1 };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const DirectInput = (event, id) => {
        const updatedItems = Items.map((item) => {
            if (item.id === id) {
                return { ...item, item_quantity: event.target.value };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };
    //submit data to api

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        if (shopName && shopId !== null) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select shop!'
            });
            setSpinner(false);
        }
        if (Items.length == 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please add items to package first!'
            });
            setSpinner(false);
        } else {
            // Handle form submission here
            // Declare the data to be sent to the API
            var Api = Connections.api + Connections.addpackage;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                shop: shopName,
                shopid: shopId,
                userid: user.id,
                name: name,
                items: Items,
                price: Price,
                expiredate: date
            };

            // Make the API call using fetch()
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
                        message: 'There is error creating package!'
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

        if (user.role === 'Admin') {
            getShops();
        }

        return () => {};
    }, []);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Create Package</Typography>
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
                    <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleSubmit}>
                        <Grid container>
                            <Grid item xs={12} sm={6}>
                                <Autocomplete
                                    required
                                    options={shops}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, value) => {
                                        if (value) {
                                            handleShopSelection(value);
                                        }
                                    }}
                                    renderInput={(params) => <TextField {...params} label="Shop" variant="outlined" />}
                                    noOptionsText="Loading..."
                                />
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        disabled={shopId ? false : true}
                                        options={productData}
                                        getOptionLabel={(option) => `${option.item_name} - ${option.item_brand} - ${option.stock_unit}`}
                                        onChange={(event, value) => {
                                            if (value) {
                                                handleAddToCart(value);
                                            }
                                        }}
                                        sx={{ marginTop: 2 }}
                                        renderInput={(params) => <TextField {...params} label="Select Stock" variant="outlined" />}
                                        noOptionsText={loading ? <CircularProgress size={20} /> : 'No item in this shop'}
                                    />
                                </Grid>
                                {loading && (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        sx={{ color: '#ffbb00', display: 'flex', alignItems: 'center', paddingLeft: 1 }}
                                    >
                                        <CircularProgress size={20} />
                                    </Grid>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TableContainer component={Paper} sx={{ bgcolor: theme.palette.primary.light, marginY: 3 }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item Code</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Sub Category</TableCell>
                                                <TableCell>Brand</TableCell>
                                                <TableCell>SKU</TableCell>
                                                <TableCell align="center">Quantity</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {Items.length > 0 ? (
                                            <TableBody>
                                                {Items.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.item_code}</TableCell>
                                                        <TableCell>{item.item_category}</TableCell>
                                                        <TableCell>{item.item_sub_category}</TableCell>
                                                        <TableCell>{item.item_brand}</TableCell>
                                                        <TableCell>{item.item_sku}</TableCell>
                                                        <TableCell
                                                            alignItems="center"
                                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                        >
                                                            <Button onClick={() => handleDecrement(item.id)}>-</Button>

                                                            <TextField
                                                                type="number"
                                                                value={item.item_quantity}
                                                                onChange={(event) => DirectInput(event, item.id)}
                                                            />
                                                            <Button onClick={() => handleIncrement(item.id)}>+</Button>
                                                        </TableCell>

                                                        <TableCell>
                                                            <IconButton onClick={() => handleRemoveFromCart(item)}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        ) : (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell colSpan={6} align="center" sx={{ borderBottom: 0 }}>
                                                        <Box padding={3}>
                                                            <img src={packages} alt="Add Item" width="40%" height="40%" />
                                                            <Typography variant="h4" color="textSecondary" sx={{ marginY: 4 }}>
                                                                Add Item to Package
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={5}
                                    lg={4}
                                    xl={4}
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: 1 }}
                                >
                                    <TextField
                                        fullWidth
                                        required
                                        type="text"
                                        label="Package Name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        sx={{ marginTop: 2 }}
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={5}
                                    lg={4}
                                    xl={4}
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginLeft: 2 }}
                                >
                                    <TextField
                                        fullWidth
                                        required
                                        type="number"
                                        label="Package Price"
                                        value={Price}
                                        onChange={(event) => setPrice(event.target.value)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Typography> ETB </Typography>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{ marginTop: 2 }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={5} lg={4} xl={4}>
                                    <TextField
                                        fullWidth
                                        required
                                        id="date"
                                        label="Expire Date"
                                        type="date"
                                        value={date}
                                        onChange={handleDateChange}
                                        InputLabelProps={{
                                            shrink: true
                                        }}
                                        sx={{ marginTop: 2 }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={5}
                                lg={4}
                                xl={4}
                                sx={{
                                    display: 'flex',
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    padding: 0.5,
                                    paddingTop: 4
                                }}
                            >
                                <Button type="submit" variant="contained" color="primary" sx={{ paddingX: 6, paddingY: 1 }}>
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Create'
                                    )}
                                </Button>
                                <Button onClick={GoBack} variant="text" color="error" sx={{ paddingX: 4, marginRight: 2 }}>
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
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

export default CreatePackage;
