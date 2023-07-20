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
import { useNavigate, useLocation } from 'react-router-dom';
import Connections from 'api';
import { Delete } from '@mui/icons-material';
import Transfering from 'assets/images/transfering.png';

// ==============================|| Transfer Stock ||============================== //

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UpdateStockTransfer = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    const theme = useTheme();
    const { state } = useLocation();
    const item = state ? state : {};

    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const [shopId, setShopId] = useState(item.sendershopid);
    const [shopName, setShopsName] = useState(item.sendershopname);
    const [receivingShopId, setReceivingShopId] = useState(item.receivershopid);
    const [receivingshopName, setReceivingShopsName] = useState(item.receivershopname);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState([]);
    const [Items, setItems] = useState(item.items);
    const [note, setNote] = useState(item.note);
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

    const handleReceivingShopSelection = (value) => {
        setReceivingShopId(value.id);
        setReceivingShopsName(value.name);
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
        const existingItem = JSON.parse(Items).find((item) => item.id === product.id);

        if (existingItem) {
            // If it does, update the quantity of the existing item
            const updatedItems = JSON.parse(Items).map((item) => {
                if (item.id === product.id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
            setItems(JSON.stringify(updatedItems));
        } else {
            const newItem = {
                id: product.id,
                name: product.name,
                code: product.code,
                unit: product.unit,
                existing: product.quantity,
                quantity: 1
            };
            var existing = JSON.parse(Items);
            const updatedItems = [...existing, newItem];

            setItems(JSON.stringify(updatedItems));
        }
    };

    const handleRemoveFromCart = (product) => {
        const updatedItems = JSON.parse(Items).filter((item) => item.id !== product.id);
        setItems(JSON.stringify(updatedItems));
    };
    const handleIncrement = (id) => {
        const updatedItems = JSON.parse(Items).map((item) => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + 1 };
            }
            return item;
        });
        setItems(JSON.stringify(updatedItems));
    };

    const handleDecrement = (id) => {
        const updatedItems = JSON.parse(Items).map((item) => {
            if (item.id === id && item.quantity > 0) {
                return { ...item, quantity: item.quantity - 1 };
            }
            return item;
        });
        setItems(JSON.stringify(updatedItems));
    };

    //submit data to api

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
        if (Items.length == 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please add items to list first!'
            });
            setSpinner(false);
        } else {
            // Handle form submission here
            // Declare the data to be sent to the API
            var Api = Connections.api + Connections.updatetransfer + item.id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                sendershopid: shopId,
                sendershopname: shopName,
                receivershopid: receivingShopId,
                receivershopname: receivingshopName,

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
                                    <Typography variant="h3">Transfer Stock</Typography>
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
                                        defaultValue={{ name: shopName }}
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
                                        defaultValue={{ name: receivingshopName }}
                                        renderInput={(params) => <TextField {...params} label="Receiving Shop" variant="outlined" />}
                                        noOptionsText="Loading..."
                                    />
                                </Grid>
                            </Grid>

                            <Grid container>
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
                                                <TableCell>Existing</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Unit</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {Items.length > 0 ? (
                                            <TableBody>
                                                {JSON.parse(Items).map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.name}</TableCell>
                                                        <TableCell>{item.code}</TableCell>
                                                        <TableCell>{item.existing}</TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center">
                                                                {/* <Button onClick={() => handleDecrement(item.id)}>-</Button> */}
                                                                <Typography>{item.quantity}</Typography>
                                                                {/* <Button onClick={() => handleIncrement(item.id)}>+</Button> */}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>{item.unit}</TableCell>
                                                        {/* 
                                                        <TableCell>
                                                            <IconButton onClick={() => handleRemoveFromCart(item)}>
                                                                <Delete />
                                                            </IconButton>
                                                        </TableCell> */}
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
                                                                Add item to list
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
                                        'Update Transfer'
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

export default UpdateStockTransfer;
