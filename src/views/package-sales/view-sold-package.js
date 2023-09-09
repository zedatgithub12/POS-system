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
import { useTheme } from '@mui/material/styles';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import { IconBuildingStore } from '@tabler/icons';

// ==============================|| VIEW PACKAGE SALE PAGE ||============================== //

const ViewSoldPackage = () => {
    const theme = useTheme();
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
                                <Grid item sx={{ display: 'flex' }}>
                                    <Typography variant="h3">Sold Package {item.reference} ||</Typography>
                                    <Typography
                                        variant="h5"
                                        sx={{ paddingX: 1, textTransform: 'capitalize', color: theme.palette.primary.main }}
                                    >
                                        {item.p_name}
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
                                <Paper sx={{ bgcolor: theme.palette.primary.light }}>
                                    <Box p={2}>
                                        <Typography variant="h4" sx={{ margin: 1.5 }}>
                                            Package Summary
                                        </Typography>

                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Item Code</TableCell>
                                                        <TableCell>Item Name</TableCell>

                                                        <TableCell>Brand</TableCell>
                                                        <TableCell>SKU</TableCell>
                                                        <TableCell>Quantity</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {JSON.parse(item.items).map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.item_code}</TableCell>
                                                            <TableCell>{item.item_name}</TableCell>
                                                            <TableCell>{item.item_brand}</TableCell>
                                                            <TableCell>{item.item_sku}</TableCell>
                                                            <TableCell>{item.item_quantity}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid container xs={12}>
                                <Grid item xs={12} sm={8} lg={6} xl={6} sx={{ paddingY: 4, margin: 4, borderRadius: 4 }}>
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell className="border-bottom-0 fw-semibold">Grand Total</TableCell>
                                                    <TableCell
                                                        className="border-bottom-0 fw-semibold fs-5"
                                                        sx={{ color: theme.palette.primary.main }}
                                                    >
                                                        {parseFloat(item.grandtotal).toFixed(2)} ETB
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
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
        </MainCard>
    );
};

export default ViewSoldPackage;
