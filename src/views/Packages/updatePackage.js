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
import { useNavigate, useLocation } from 'react-router-dom';
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

// ==============================|| UPDATE PACKAGE PAGE ||============================== //
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UpdatePackage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { state } = useLocation();
    const item = state ? state : {};

    const GoBack = () => {
        navigate(-1);
    };
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const [shopId, setShopId] = useState(item.shopid);
    const [shopName, setShopsName] = useState(item.shopname);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([]);
    const [products, setProducts] = useState(item.items);
    const [name, setName] = useState(item.name);
    const [Price, setPrice] = useState(item.price);
    const [date, setDate] = useState(item.date);
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
        getProducts(value.name);
    };
    const getProducts = (shop) => {
        setLoading(true);
        var Api = Connections.api + Connections.viewstoreproduct + shop;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };
        // Make the API call using fetch()
        fetch(Api, {
            method: 'GET',
            headers: headers
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
        const existingItem = JSON.parse(products).find((item) => item.id === product.id);

        if (existingItem) {
            // If it does, update the quantity of the existing item
            const updatedItems = JSON.parse(products).map((item) => {
                if (item.id === product.id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            setProducts(JSON.stringify(updatedItems));
        } else {
            var newProduct = JSON.parse(products);
            setProducts(
                JSON.stringify([...newProduct, { id: product.id, name: product.name, code: product.code, unit: product.unit, quantity: 1 }])
            );
        }
    };

    const handleRemoveFromCart = (product) => {
        const updatedItems = JSON.parse(products).filter((item) => item.id !== product.id);
        setProducts(JSON.stringify(updatedItems));
    };
    const handleIncrement = (id) => {
        const updatedItems = JSON.parse(products).map((item) => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setProducts(JSON.stringify(updatedItems));
    };

    const handleDecrement = (id) => {
        const updatedItems = JSON.parse(products).map((item) => {
            if (item.id === id && item.quantity > 0) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setProducts(JSON.stringify(updatedItems));
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        if (!shopName) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select shop!'
            });
            setSpinner(false);
        }
        if (products.length == 0) {
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
            var Api = Connections.api + Connections.updatepackage + item.id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                shop: shopName,
                shopid: shopId,
                userid: user.id,
                name: name,
                items: JSON.parse(products),
                price: Price,
                expiredate: date
            };

            // Make the API call using fetch()
            fetch(Api, {
                method: 'put',
                headers: headers,
                body: JSON.stringify(Data)
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
                        message: 'There is error updating package!'
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
                headers: headers
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
                                    <Typography variant="h4">
                                        Update <span className="text-primary">{name}</span>
                                    </Typography>
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
                                    renderInput={(params) => (
                                        <TextField {...params} label="Shop" variant="outlined" value={shopName} defaultValue={shopName} />
                                    )}
                                    noOptionsText="Loading..."
                                />
                            </Grid>

                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        required
                                        key={productData.id}
                                        disabled={shopId ? false : true}
                                        options={productData}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(event, value) => {
                                            if (value) {
                                                handleAddToCart(value);
                                            }
                                        }}
                                        sx={{ marginTop: 2 }}
                                        renderInput={(params) => <TextField {...params} label="Select Product" variant="outlined" />}
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
                                                <TableCell>Item Name</TableCell>
                                                <TableCell>Item Code</TableCell>

                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Unit</TableCell>
                                                <TableCell>Action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {products.length > 0 ? (
                                            <TableBody>
                                                {JSON.parse(products).map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.code}</TableCell>

                                                        <TableCell>
                                                            <Box display="flex" alignItems="center">
                                                                <Button onClick={() => handleDecrement(item.id)}>-</Button>
                                                                <Typography>{item.quantity}</Typography>
                                                                <Button onClick={() => handleIncrement(item.id)}>+</Button>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{item.unit}</TableCell>

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
                                                    <TableCell colSpan={5} align="center" sx={{ borderBottom: 0 }}>
                                                        <Box padding={3}>
                                                            <img src={packages} alt="Add Item" width="40%" height="40%" />
                                                            <Typography variant="h4" color="textSecondary" sx={{ marginY: 4 }}>
                                                                Add Package Item
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
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: 1 }}
                                >
                                    <TextField
                                        required
                                        fullWidth
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
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: 1 }}
                                >
                                    <TextField
                                        required
                                        fullWidth
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

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        fullWidth
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
                            <Box paddingTop={5}>
                                <Button variant="text" color="error" sx={{ paddingX: 4, marginRight: 2 }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" sx={{ paddingX: 4 }}>
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                            </Box>
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

export default UpdatePackage;
