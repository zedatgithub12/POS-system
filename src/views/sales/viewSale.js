// material-ui

import {
    Avatar,
    Box,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { AccountCircleOutlined, ReceiptOutlined, CreditCardOutlined, InfoOutlined } from '@mui/icons-material';
import { IconBuildingStore, IconCoins } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import { useEffect, useState, forwardRef } from 'react';
import Connections from 'api';
import { ActivityIndicators } from 'ui-component/activityIndicator';

// ==============================|| VIEW SALE PAGE ||============================== //
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ViewSale = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state } = useLocation();

    const item = state ? state : {};
    const GoBack = () => {
        navigate(-1);
    };

    const [loading, setLoading] = useState(false);
    const [Items, setItems] = useState([]);
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

    useEffect(() => {
        const getSoldItems = () => {
            setLoading(true);
            var Api = Connections.api + Connections.getSoldItem + item.id;
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
                        setLoading(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error getting sold items!'
                    });
                    setLoading(false);
                });
        };

        getSoldItems();

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
                                    <Typography variant="h3">{item.reference} Detail </Typography>
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
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper variant="outlined">
                                    <Typography className="px-3 py-2 fs-6  fw-semibold">Invoice Info</Typography>
                                    <Box p={1} ml={2} display="flex" alignItems="center">
                                        <Avatar className="bg-light">
                                            <IconBuildingStore />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">Shop</Typography>
                                            <Typography color="text.secondary">{item.shop}</Typography>
                                        </Box>
                                    </Box>
                                    <Box p={1} ml={2} display="flex" alignItems="center">
                                        <Avatar className="bg-light">
                                            <ReceiptOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">Sold at</Typography>
                                            <Typography color="text.secondary">
                                                Date {item.date} | Time {item.time.slice(0, 5)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box p={1} ml={2} display="flex" alignItems="center">
                                        <Avatar className="bg-light">
                                            <InfoOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">Payment Status</Typography>
                                            <Typography color="text.secondary">{item.payment_status}</Typography>
                                        </Box>
                                    </Box>
                                    {item.payment_status === 'Paid' && (
                                        <Box p={1} ml={2} display="flex" alignItems="center">
                                            <Avatar className="bg-light">
                                                <CreditCardOutlined />
                                            </Avatar>
                                            <Box ml={2}>
                                                <Typography variant="h6">Payment Method</Typography>
                                                <Typography color="text.secondary">{item.payment_method}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    <Box p={1} ml={2} display="flex" alignItems="center">
                                        <Avatar className="bg-light">
                                            <IconCoins />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">Grand Total</Typography>
                                            <Typography color="text.secondary"> {parseInt(item.grandtotal).toFixed(2)} ETB</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper variant="outlined">
                                    <Typography className="px-3 py-2 fs-6 fw-semibold">Customer Information</Typography>
                                    <Box p={2} display="flex" alignItems="center">
                                        <Avatar className="bg-light">
                                            <AccountCircleOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">{item.customer}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper>
                                    <Box p={2}>
                                        <Typography variant="h5" sx={{ marginY: 2 }}>
                                            Summary
                                        </Typography>

                                        <TableContainer sx={{ bgcolor: theme.palette.primary.light, borderRadius: 2, padding: 2 }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Item Name</TableCell>
                                                        <TableCell>Item Code</TableCell>
                                                        <TableCell align="right">SKU</TableCell>
                                                        <TableCell align="right">Quantity</TableCell>
                                                        <TableCell align="right">Unit Price</TableCell>
                                                        <TableCell align="right">SubTotal</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                {loading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={6} align="center">
                                                            <Box
                                                                sx={{
                                                                    minHeight: 80,
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <ActivityIndicators />
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ) : Items.length > 0 ? (
                                                    <TableBody>
                                                        {Items.map((soldItem, index) => (
                                                            <TableRow key={index}>
                                                                <TableCell>{soldItem.item_name}</TableCell>
                                                                <TableCell>{soldItem.item_code}</TableCell>
                                                                <TableCell align="right">
                                                                    {' '}
                                                                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">
                                                                        {soldItem.stock_unit}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell align="right">{soldItem.quantity}</TableCell>
                                                                <TableCell align="right">{parseInt(soldItem.price).toFixed(2)}</TableCell>
                                                                <TableCell align="right">{parseInt(soldItem.price).toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                ) : (
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell colSpan={6} align="center" sx={{ borderBottom: 0 }}>
                                                                <Box padding={3}>
                                                                    {/* <img src={packages} alt="Add Item" width={300} height={300} /> */}
                                                                    <Typography variant="h4" color="textSecondary" sx={{ marginY: 4 }}>
                                                                        sold item record is not found
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                )}
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper>
                                    <Box p={2}>
                                        <Typography variant="h5">Additional Note</Typography>
                                        <Divider />
                                        <Typography className="py-3">{item.note}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
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

export default ViewSale;
