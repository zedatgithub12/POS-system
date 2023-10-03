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
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import Connections from 'api';
import { Delete } from '@mui/icons-material';
import Transfering from 'assets/images/transfering.png';

// ==============================|| Transfer Stock ||============================== //

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const TransferStock = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    const theme = useTheme();

    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const [shopId, setShopId] = useState(null);
    const [shopName, setShopsName] = useState();
    const [receivingShopId, setReceivingShopId] = useState(null);
    const [receivingshopName, setReceivingShopsName] = useState();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([]);
    const [Items, setItems] = useState([]);
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

    const handleShopSelection = (value) => {
        if (shopId != null && value.id != shopId) {
            setShopId(value.id);
            setShopsName(value.name);
            setItems([]);
            getShopStock(value.name);
        } else {
            setShopId(value.id);
            setShopsName(value.name);
            getShopStock(value.name);
        }
    };

    const handleReceivingShopSelection = (value) => {
        setReceivingShopId(value.id);
        setReceivingShopsName(value.name);
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
                    return { ...item, stock_quantity: item.stock_quantity + 1 };
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
                    stock_unit: product.stock_unit,
                    stock_price: product.stock_price,
                    existing: product.stock_quantity,
                    stock_quantity: 1
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
                return { ...item, stock_quantity: parseInt(item.stock_quantity) + 1 };
            }
            return item;
        });
        setItems(updatedItems);
    };

    const handleDecrement = (id) => {
        const updatedItems = Items.map((item) => {
            if (item.id === id && item.stock_quantity > 0) {
                return { ...item, stock_quantity: parseInt(item.stock_quantity) - 1 };
            }
            return item;
        });
        setItems(updatedItems);
    };
    const DirectInput = (event, id) => {
        const updatedItems = Items.map((item) => {
            if (item.id === id) {
                return { ...item, stock_quantity: event.target.value };
            }
            return item;
        });
        setItems(updatedItems);
    };
    //submit data to api

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!shopName) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please sending shop'
            });
        } else if (!receivingShopId) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select receiving shop'
            });
        } else if (shopId == receivingShopId) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'You cannot make transfer to same shop'
            });
        } else if (Items.length == 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please add items to the list first!'
            });
        } else {
            // Handle form submission here
            // Declare the data to be sent to the API
            setSpinner(true);
            var Api = Connections.api + Connections.transfer;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                sendershopid: shopId,
                sendershopname: shopName,
                receivershopid: receivingShopId,
                receivershopname: receivingshopName,
                items: Items,
                note: note,
                userid: user.id
            };

            // Make the API call using fetch()
            fetch(Api, {
                method: 'POST',
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
                        message: 'There is error making transfer!'
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
                                    <Typography variant="h3">Make Transfer</Typography>
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
                            <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                        renderInput={(params) => <TextField {...params} label="Sending Shop" variant="outlined" />}
                                        noOptionsText="Loading..."
                                    />
                                </Grid>

                                <Grid item xs={12} sm={5}>
                                    <Autocomplete
                                        required
                                        options={shops}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(event, value) => {
                                            if (value) {
                                                handleReceivingShopSelection(value);
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Receiving Shop" variant="outlined" />}
                                        noOptionsText="Loading..."
                                    />
                                </Grid>
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
                                        noOptionsText={loading ? <CircularProgress size={20} /> : 'No stock in this shop'}
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
                                                <TableCell>Item code</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Sub Category</TableCell>
                                                <TableCell> Brand</TableCell>
                                                <TableCell>SKU</TableCell>
                                                <TableCell width={240} align="center">
                                                    Transfered amount
                                                </TableCell>

                                                <TableCell>Price</TableCell>
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
                                                        <TableCell>{item.stock_unit}</TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center">
                                                                <Button onClick={() => handleDecrement(item.id)}>-</Button>

                                                                <TextField
                                                                    type="number"
                                                                    value={item.stock_quantity}
                                                                    onChange={(event) => DirectInput(event, item.id)}
                                                                />
                                                                <Button onClick={() => handleIncrement(item.id)}>+</Button>
                                                            </Box>
                                                        </TableCell>

                                                        <TableCell>{item.stock_price} ETB</TableCell>
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
                                                            <img src={Transfering} alt="Add Item" width="30%" height="30%" />
                                                            <Typography variant="h4" color="textSecondary" sx={{ marginY: 4 }}>
                                                                Add item to transfer list
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
                                        fullWidth
                                        type="text"
                                        label="Note"
                                        value={note}
                                        multiline
                                        rows={6}
                                        onChange={(event) => setNote(event.target.value)}
                                        sx={{ marginTop: 2 }}
                                    />
                                </Grid>
                            </Grid>
                            <Box paddingTop={5}>
                                <Button type="submit" variant="contained" color="primary" sx={{ paddingX: 4 }}>
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Start Transfer'
                                    )}
                                </Button>

                                <Button onClick={GoBack} variant="text" color="error" sx={{ paddingX: 4, marginRight: 2 }}>
                                    Cancel
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

export default TransferStock;
