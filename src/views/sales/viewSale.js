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
import { AccountCircleOutlined, ReceiptOutlined, CreditCardOutlined, InfoOutlined } from '@mui/icons-material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'store/constant';

// ==============================|| VIEW SALE PAGE ||============================== //

const ViewSale = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const item = state ? state : {};
    const GoBack = () => {
        navigate(-1);
    };

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Sale Detail </Typography>
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
                        <Grid item xs={12} className="">
                            <Typography className="p-2 py-2 fs-6 fw-semibold fst-italic mx-auto" alignSelf="center">
                                Sale Detail : {item.reference}
                            </Typography>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper variant="outlined">
                                    <Typography className="px-3 py-2 fs-6 fw-semibold">Customer Information</Typography>
                                    <Box p={2} display="flex" alignItems="center">
                                        <Avatar className="bg-light">
                                            <AccountCircleOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">{item.customer.name}</Typography>
                                            <Typography color="text.secondary">{item.customer.phone}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper variant="outlined">
                                    <Typography className="px-3 py-2 fs-6  fw-semibold">Invoice Info</Typography>
                                    <Box p={1} ml={2} display="flex" alignItems="center">
                                        <Avatar className="bg-light">
                                            <ReceiptOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">
                                                Sold #{item.date}-{item.time}
                                            </Typography>
                                            <Typography color="text.secondary">{item.shop}</Typography>
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
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper variant="outlined">
                                    <Box p={2}>
                                        <Typography variant="h6">Product Summary</Typography>
                                        <Divider />
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Item Name</TableCell>
                                                        <TableCell>Item Code</TableCell>
                                                        <TableCell>Item Brand</TableCell>
                                                        <TableCell align="right">Unit</TableCell>
                                                        <TableCell align="right">Unit Price</TableCell>
                                                        <TableCell align="right">Quantity</TableCell>
                                                        <TableCell align="right">SubTotal</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {item.items.map((soldItem, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{soldItem.itemName}</TableCell>
                                                            <TableCell>{soldItem.itemCode}</TableCell>
                                                            <TableCell>{soldItem.brand}</TableCell>
                                                            <TableCell align="right">{soldItem.unit}</TableCell>
                                                            <TableCell align="right">{soldItem.unitPrice.toFixed(2)}</TableCell>
                                                            <TableCell align="right">{soldItem.quantity}</TableCell>
                                                            <TableCell align="right">{soldItem.subtotal.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid container xs={12}>
                                <Grid item xs={7}></Grid>
                                <Grid item xs={4} className="py-4 my-5 border shadow-sm rounded">
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>Total Tax</TableCell>
                                                    <TableCell align="right">{item.tax.toFixed(2)}%</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total Discount</TableCell>
                                                    <TableCell align="right">ETB {item.discount.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className="border-bottom-0 fw-semibold">Grand Total</TableCell>
                                                    <TableCell align="right" className="border-bottom-0 fw-semibold fs-5">
                                                        ETB {item.grandtotal.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper variant="outlined">
                                    <Box p={2}>
                                        <Typography variant="h6">Additional Note</Typography>
                                        <Divider />
                                        <Typography className="py-3">{item.note}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ViewSale;
