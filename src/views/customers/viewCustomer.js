import React, { useEffect, useState } from 'react';
import {
    Grid,
    Box,
    Card,
    Paper,
    CardContent,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import Connections from 'api';
import { useLocation, useNavigate } from 'react-router';
import { DateFormatter, formatNumber } from 'utils/functions';
import { IconCoins, IconRepeat, IconShoppingBag } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import Empty from 'assets/images/icons/empty_cart.svg';
import { ActivityIndicators } from 'ui-component/activityIndicator';

const CustomerDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    const theme = useTheme();
    const customer = state ? state : {};

    const [totalSpend, setTotalSpend] = useState(0);
    const [numberOfPurchases, setNumberOfPurchases] = useState(0);
    const [frequentItems, setFrequentItems] = useState([]);
    const [buyingRecord, setBuyingRecord] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        // Fetch customer purchase details from API
        const fetchCustomerInfo = () => {
            setLoading(true);

            var ApiUrl = Connections.api + Connections.customerdetails + customer.id;
            fetch(ApiUrl, {
                method: 'GET'
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setTotalSpend(response.total_spend);
                        setNumberOfPurchases(response.number_of_purchases);
                        setFrequentItems(response.frequent_items);
                        setBuyingRecord(response.data);
                        setLoading(false);
                    } else {
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setLoading(false);
                });
        };

        fetchCustomerInfo();

        return () => {};
    }, [customer.id]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Grid container>
            <Grid item xs={12} sx={{ paddingTop: 1 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Grid container direction="column">
                            <Grid item sx={{ paddingLeft: 1 }}>
                                <Typography variant="h3">{customer.name}</Typography>
                                <Typography variant="body1" sx={{ marginY: 1 }}>
                                    {customer.shop}
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
            <Grid container>
                <Grid item xs={12} md={12} sx={{ display: 'grid', alignItems: 'center' }}>
                    <Grid container sx={{ display: 'flex', alignItems: 'center', paddingY: 2 }}>
                        <Card sx={{ minWidth: 200 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <IconCoins size={32} color={theme.palette.warning.dark} />
                                <Box>
                                    <Typography variant="h3">{formatNumber(totalSpend)}</Typography>
                                    <Typography>Total Spend </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                        <Box sx={{ margin: 3 }}> </Box>
                        <Card sx={{ minWidth: 200 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <IconShoppingBag size={32} color={theme.palette.primary.dark} />
                                <Box>
                                    <Typography variant="h3">{formatNumber(numberOfPurchases)}</Typography>
                                    <Typography>Purchases </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Box component={Paper} className="shadow-sm">
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Reference</TableCell>
                                        <TableCell>Total Price (ETB)</TableCell>
                                        <TableCell>Payment Status</TableCell>
                                        <TableCell>Paid with</TableCell>
                                    </TableRow>
                                </TableHead>

                                {loading ? (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                <Box
                                                    sx={{
                                                        minHeight: 188,
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <ActivityIndicators />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : buyingRecord.length === 0 ? (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ borderBottom: 0 }}>
                                                <Box padding={3}>
                                                    <img src={Empty} alt="No Data" width="20%" height="20%" />
                                                    <Typography sx={{ marginTop: 3 }}>Doesn't have purchase history yet!</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ) : (
                                    buyingRecord.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{DateFormatter(record.date)}</TableCell>
                                            <TableCell>{record.reference}</TableCell>
                                            <TableCell>{formatNumber(record.grandtotal)} </TableCell>
                                            <TableCell>
                                                {record.payment_status === 'Paid' ? (
                                                    <span className="bg-success bg-opacity-10 text-success px-4 py-1 rounded text-capitalize">
                                                        {record.payment_status}
                                                    </span>
                                                ) : (
                                                    <span className="bg-danger bg-opacity-10 text-danger px-4 py-1 rounded text-capitalize">
                                                        {record.payment_status}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>{record.payment_method}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            component="div"
                            count={buyingRecord.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={12} sx={{ paddingY: 2 }}>
                    {frequentItems.length > 0 && (
                        <Card>
                            <CardContent>
                                <Typography variant="h3">
                                    {' '}
                                    <IconRepeat color={theme.palette.secondary.main} /> Frequently Bought Items{' '}
                                </Typography>
                                <List>
                                    {frequentItems.map((item) => (
                                        <ListItem key={item.product_id}>
                                            <ListItemText
                                                primary={item.item_name}
                                                secondary={item.totalQuantity}
                                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CustomerDetails;
