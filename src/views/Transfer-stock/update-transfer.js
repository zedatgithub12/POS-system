import { useState, useEffect, forwardRef } from 'react';

// material-ui
import {
    Grid,
    Divider,
    Box,
    Paper,
    Button,
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
import Transfering from 'assets/images/transfering.png';
import { IconArrowRight } from '@tabler/icons';

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
    const [shopName] = useState(item.sendershopname);
    const [receivingshopName] = useState(item.receivershopname);
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
                                    <Typography variant="h3">Update Transfer </Typography>
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
                    <form style={{ marginBottom: '1rem' }} onSubmit={handleSubmit}>
                        <Grid container>
                            <Grid item sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h4">{shopName}</Typography>

                                <Box sx={{ marginX: 2 }}>
                                    <IconArrowRight size={22} />
                                </Box>
                                <Typography variant="h4" color={theme.palette.primary.main}>
                                    {receivingshopName}
                                </Typography>
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
                                                <TableCell>Item Code</TableCell>
                                                <TableCell>Category</TableCell>
                                                <TableCell>Sub Category</TableCell>
                                                <TableCell>Brand</TableCell>
                                                <TableCell>SKU</TableCell>
                                                <TableCell>Existing</TableCell>
                                                <TableCell>Quantity</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {Items.length > 0 ? (
                                            <TableBody>
                                                {JSON.parse(Items).map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>{item.item_code}</TableCell>
                                                        <TableCell>{item.item_category}</TableCell>
                                                        <TableCell>{item.item_sub_category}</TableCell>
                                                        <TableCell>{item.item_brand}</TableCell>
                                                        <TableCell>{item.stock_unit}</TableCell>
                                                        <TableCell>{item.existing}</TableCell>
                                                        <TableCell>
                                                            <Box display="flex" alignItems="center">
                                                                {/* <Button onClick={() => handleDecrement(item.id)}>-</Button> */}
                                                                <Typography>
                                                                    <span className="bg-success bg-opacity-10 text-success px-3 py-1 rounded">
                                                                        {item.stock_quantity}
                                                                    </span>
                                                                </Typography>
                                                                {/* <Button onClick={() => handleIncrement(item.id)}>+</Button> */}
                                                            </Box>
                                                        </TableCell>

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
