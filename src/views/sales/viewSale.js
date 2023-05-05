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
import { blue, blueGrey } from '@mui/material/colors';
import { AccountCircleOutlined, ReceiptOutlined, CreditCardOutlined, Warning } from '@mui/icons-material';

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
                                    <Typography variant="h3">Sale Detail</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button onClick={GoBack} variant="outlined" color="secondary" sx={{ textDecoration: 'none' }}>
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Box p={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Paper variant="outlined">
                                    <Typography className="px-3 py-2 fs-6 bg-light rounded-3 m-1 ">Customer Information</Typography>
                                    <Box p={2} display="flex" alignItems="center">
                                        <Avatar>
                                            <AccountCircleOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">{item.customer_name}</Typography>
                                            <Typography color="text.secondary">{item.customer_phone}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Paper variant="outlined">
                                    <Typography className="px-3 py-2 fs-6 bg-light rounded-3 m-1 ">Invoice Info</Typography>
                                    <Box p={2} display="flex" alignItems="center">
                                        <Avatar>
                                            <ReceiptOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">
                                                Sold #{item.date}-{item.time}
                                            </Typography>
                                            <Typography color="text.secondary">{item.shop}</Typography>
                                        </Box>
                                    </Box>
                                    <Box p={2} display="flex" alignItems="center">
                                        <Avatar>
                                            <CreditCardOutlined />
                                        </Avatar>
                                        <Box ml={2}>
                                            <Typography variant="h6">Paid with</Typography>
                                            <Typography color="text.secondary">{item.payment_method}</Typography>
                                        </Box>
                                    </Box>
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
                                                        <TableCell>Product Name</TableCell>
                                                        <TableCell>Product Code</TableCell>
                                                        <TableCell align="right">Unit Price</TableCell>
                                                        <TableCell align="right">Quantity</TableCell>
                                                        <TableCell align="right">Unit Price</TableCell>
                                                        <TableCell align="right">Discount</TableCell>
                                                        <TableCell align="right">Tax</TableCell>
                                                        <TableCell align="right">Subtotal</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>{item.item_name}</TableCell>
                                                        <TableCell>{item.item_code}</TableCell>
                                                        <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                                                        <TableCell align="right">{item.quantity}</TableCell>
                                                        <TableCell align="right">${item.unitPrice * (1 - item.discount / 100)}</TableCell>
                                                        <TableCell align="right">{item.discount.toFixed(2)}%</TableCell>
                                                        <TableCell align="right">${item.tax.toFixed(2)}</TableCell>
                                                        <TableCell align="right">${item.total_amount}</TableCell>
                                                    </TableRow>
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
                                                    <TableCell align="right">${item.tax.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total Discount</TableCell>
                                                    <TableCell align="right">
                                                        ${((item.unitPrice * item.quantity * item.discount) / 100).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Grand Total</TableCell>
                                                    <TableCell align="right">
                                                        $
                                                        {(
                                                            item.total_amount -
                                                            item.tax -
                                                            (item.unitPrice * item.quantity * item.discount) / 100
                                                        ).toFixed(2)}
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
                                        <Typography>{item.additional_note}</Typography>
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
