import React, { useState, useEffect } from 'react';
// material-ui
import {
    Grid,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    MenuItem,
    TablePagination,
    Button,
    Box,
    Collapse,
    FormControl,
    Select
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { IconEdit } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Connections from 'api';
import 'react-lazy-load-image-component/src/effects/blur.css';
import notransfer from 'assets/images/notransfer.png';
import { DateFormatter } from 'utils/functions';
import { ActivityIndicators } from 'ui-component/activityIndicator';

// ==============================|| TRANSFERS PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Transfers = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);

    const [shopFilter, setShopFilter] = useState('Sender');
    const [receiverFilter, setReceiverFilter] = useState('Receiver');
    const [filterDate, setFilterDate] = useState('Date');
    const [statusFilter, setStatusFilter] = useState('Status');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [stocktransfers, setStockTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleShopFilterChange = (event) => {
        setShopFilter(event.target.value);
    };

    const handleReceiverFilterChange = (event) => {
        setReceiverFilter(event.target.value);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };
    const handleFilterDateChange = (event) => {
        setFilterDate(event.target.value);
    };
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const SliceDate = (date) => {
        const fromattedDate = date.slice(0, 10);
        return fromattedDate;
    };

    const filteredData = stocktransfers.filter((record) => {
        let isMatch = true;

        if (shopFilter !== 'Sender') {
            isMatch = isMatch && record.sendershopname.includes(shopFilter);
        }

        if (receiverFilter !== 'Receiver') {
            isMatch = isMatch && record.receivershopname.includes(receiverFilter);
        }
        if (filterDate !== 'Date') {
            isMatch = isMatch && SliceDate(record.created_at) === filterDate;
        }
        if (statusFilter !== 'Status') {
            isMatch = isMatch && record.status === statusFilter;
        }

        return isMatch;
    });

    useEffect(() => {
        const getTransfers = () => {
            setLoading(true);
            var Api = Connections.api + Connections.alltransfers;
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
                        setStockTransfers(response.data);
                        setLoading(false);
                    } else {
                        setStockTransfers([]);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching transfers!'
                    });
                    setLoading(false);
                });
        };

        getTransfers();
        return () => {};
    }, []);
    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Stock Transfers</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {users.role === 'Admin' && (
                                <>
                                    <Button
                                        component={Link}
                                        to="/make-transfer"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ textDecoration: 'none', marginRight: 2 }}
                                    >
                                        Make New Transfer
                                    </Button>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Box paddingX="2" className="shadow-1 p-2 rounded ">
                        <FormControl className="ms-2 my-2 ">
                            <Select value={shopFilter} onChange={handleShopFilterChange}>
                                <MenuItem value="Sender">Sending Shop</MenuItem>
                                {Array.from(new Set(stocktransfers.map((item) => item.sendershopname))).map((shop) => (
                                    <MenuItem key={shop} value={shop}>
                                        {shop}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 my-2 ">
                            <Select value={receiverFilter} onChange={handleReceiverFilterChange}>
                                <MenuItem value="Receiver">Receiving Shop</MenuItem>
                                {Array.from(new Set(stocktransfers.map((item) => item.receivershopname))).map((shop) => (
                                    <MenuItem key={shop} value={shop}>
                                        {shop}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 my-2">
                            <Select value={filterDate} onChange={handleFilterDateChange}>
                                <MenuItem value="Date">Transfer Date</MenuItem>
                                {Array.from(new Set(stocktransfers.map((transfer) => SliceDate(transfer.created_at)))).map((date) => (
                                    <MenuItem key={date} value={date}>
                                        {DateFormatter(date)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 my-2 ">
                            <Select value={statusFilter} onChange={handleStatusFilterChange} sx={{ textTransform: 'capitalize' }}>
                                <MenuItem value="Status" sx={{ textTransform: 'capitalize' }}>
                                    Status
                                </MenuItem>
                                {Array.from(new Set(stocktransfers.map((item) => item.status))).map((status) => (
                                    <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>
                                        {status}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TableContainer component={Paper} className="shadow-sm">
                            <Table aria-label="product table">
                                <TableHead className="bg-light">
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Sending Shop</TableCell>
                                        <TableCell>Received Shop</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Note</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Box sx={{ minHeight: 188, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <ActivityIndicators />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedData.length > 0 ? (
                                    <TableBody>
                                        {paginatedData.map((product, index) => (
                                            <ProductRow key={index} product={product} />
                                        ))}
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ borderBottom: 0 }}>
                                                <Box padding={3}>
                                                    <img src={notransfer} alt="No Transfer" width="40%" height="40%" />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50]}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
        </MainCard>
    );
};

const ProductRow = ({ product }) => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const theme = useTheme();

    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
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

    const DateCoverter = (day) => {
        const dateTime = new Date(day);
        const date = dateTime.toLocaleDateString();
        return date;
    };
    const TimeCoverter = (time) => {
        const dateTime = new Date(time);
        const date = dateTime.toLocaleTimeString();
        return date;
    };

    const [selectedProduct, setSelectedProduct] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleTrashClick = (product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setSelectedProduct(null);
        setDialogOpen(false);
    };

    const Delete = () => {
        // Do something with the deleted category
        setSpinner(true);
        var Api = Connections.api + Connections.deletetransfer + selectedProduct.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        // Make the API call using fetch()
        fetch(Api, {
            method: 'DELETE',
            headers: headers,
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
                    handleDialogClose();
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
                    message: 'There is error deleting transfer!'
                });
                setSpinner(false);
            });
    };

    useEffect(() => {
        return () => {};
    }, [spinner]);

    return (
        <>
            <TableRow
                hover
                className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary rounded' : 'border-0 rounded'}
            >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{product.sendershopname}</TableCell>
                <TableCell>{product.receivershopname}</TableCell>

                <TableCell>{DateCoverter(product.created_at)}</TableCell>
                <TableCell>{TimeCoverter(product.created_at)}</TableCell>
                <TableCell>{product.note}</TableCell>
                <TableCell>
                    <span
                        className={
                            product.status === 'done'
                                ? 'bg-success bg-opacity-10 text-success px-2 py-1 rounded text-capitalize '
                                : 'bg-danger bg-opacity-10 text-danger px-2 py-1 rounded text-capitalize'
                        }
                    >
                        {product.status}
                    </span>
                </TableCell>
                <>
                    <TableCell>
                        {users.role === 'Admin' && (
                            <>
                                <IconButton
                                    aria-label="Edit row"
                                    size="small"
                                    onClick={() =>
                                        navigate('/update-transfer', {
                                            state: { ...product }
                                        })
                                    }
                                >
                                    <IconEdit />
                                </IconButton>
                                {/* <IconButton aria-label="Trash row" size="small" onClick={() => handleTrashClick(product)}>
                                    <IconTrash />
                                </IconButton> */}
                            </>
                        )}
                    </TableCell>
                </>
            </TableRow>
            <TableRow
                className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary' : 'border-0'}
                sx={{ bgcolor: theme.palette.primary.light }}
            >
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Grid container>
                            <Grid item xs={12}>
                                <Box margin={1}>
                                    <Typography variant="h5" gutterBottom sx={{ paddingLeft: 2, color: theme.palette.primary.dark }}>
                                        Transfered Items
                                    </Typography>
                                    <Table size="small" aria-label="product details">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item Name</TableCell>
                                                <TableCell>Item Code</TableCell>
                                                <TableCell>SKU</TableCell>
                                                <TableCell>Existing</TableCell>
                                                <TableCell>Transfered</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {JSON.parse(product.items).map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.item_name}</TableCell>
                                                    <TableCell>{item.item_code}</TableCell>
                                                    <TableCell>{item.stock_unit}</TableCell>
                                                    <TableCell>{item.existing}</TableCell>
                                                    <TableCell>
                                                        <span className="bg-primary bg-opacity-10 text-primary px-4 py-1 rounded">
                                                            {item.stock_quantity}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>

            {/* <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Record</DialogTitle>
                <DialogContent>Do you want to delete the transfer?</DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="error" onClick={() => Delete(selectedProduct.id)}>
                        {spinner ? (
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Yes'
                        )}
                    </Button>
                </DialogActions>
            </Dialog> */}
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </>
    );
};

ProductRow.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number,
        receivershopname: PropTypes.string.isRequired,
        sendershopname: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
        note: PropTypes.string.isRequired,
        items: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        shop: PropTypes.string.isRequired
    }).isRequired
};
export default Transfers;
