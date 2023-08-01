import React, { useState, useEffect } from 'react';
// material-ui
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    TablePagination,
    Button,
    Box,
    FormControl,
    Checkbox,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { MoreVert } from '@mui/icons-material';
import { IconSearch } from '@tabler/icons';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import Connections from 'api';

// ==============================|| SALES PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const PackageScreen = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    //package states
    const [soldPackage, setSoldPackage] = useState([]);
    const [searchPText, setSearchPText] = useState('');
    const [filterPDate, setFilterPDate] = useState('Date');
    const [filterPShop, setFilterPShop] = useState('Shop');
    const [filterPPaymentStatus, setFilterPPaymentStatus] = useState('Payment_Status');
    const [ppage, setPPage] = useState(0);
    const [pLastPage, setLastPPage] = useState();
    const [prowsPerPage, setRowsPPerPage] = useState(15);
    const [selectedPRows, setSelectedPRows] = useState([]);
    const [selectedPItem, setSelectedPItems] = useState();
    const [spinner, setSpinner] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    //stock sales related code
    //goes here
    // the package sell related code will be continue after stock sale code completed
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
    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePFilterDateChange = (event) => {
        setFilterPDate(event.target.value);
        setPPage(0);
    };

    const handlePFilterShopChange = (event) => {
        setFilterPShop(event.target.value);
        setPPage(0);
    };

    const handlePFilterPaymentMethodChange = (event) => {
        setFilterPPaymentStatus(event.target.value);
        setPPage(0);
    };
    const handlePSearchTextChange = (event) => {
        setSearchPText(event.target.value);
        setPPage(0);
    };

    //package filtering function
    const filteredPSalesData = soldPackage.filter((sale) => {
        let isMatch = true;

        if (searchPText) {
            const searchRegex = new RegExp(searchPText, 'i');
            isMatch = isMatch && (searchRegex.test(sale.reference) || searchRegex.test(sale.p_name));
        }
        if (filterPDate !== 'Date') {
            isMatch = isMatch && sale.date === filterPDate;
        }

        if (filterPShop !== 'Shop') {
            isMatch = isMatch && sale.shop === filterPShop;
        }
        if (filterPPaymentStatus !== 'Payment_Status') {
            isMatch = isMatch && sale.payment_status === filterPPaymentStatus;
        }
        return isMatch;
    });

    const handleSelectPItem = (event, item) => {
        handleMenuClick(event);
        setSelectedPItems({ ...item });
    };
    const handleSelectPAllClick = (event) => {
        if (event.target.checked) {
            setSelectedPRows(soldPackage.map((sale) => sale.id));
        } else {
            setSelectedPRows([]);
        }
    };

    const handlePRowClick = (event, id) => {
        const selectedIndex = selectedPRows.indexOf(id);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = newSelectedRows.concat(selectedPRows, id);
        } else if (selectedIndex === 0) {
            newSelectedRows = newSelectedRows.concat(selectedPRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelectedRows = newSelectedRows.concat(selectedPRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedRows = newSelectedRows.concat(selectedPRows.slice(0, selectedIndex), selectedPRows.slice(selectedIndex + 1));
        }

        setSelectedPRows(newSelectedRows);
    };
    const handleChangeRowsPPerPage = (event) => {
        setRowsPPerPage(parseInt(event.target.value, 10));
        setPPage(0);
    };

    const handlePPageChange = (event, newPage) => {
        setPPage(newPage);
    };

    const handlePTrashClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDialogOpen(false);
        handleMenuClose();
    };

    const handlePDelete = (id) => {
        // Do something with the deleted category
        setSpinner(true);
        var Api = Connections.api + Connections.deletepackagesale + id;
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
                    message: 'There is error deleting sale!'
                });
                setSpinner(false);
            });
    };

    useEffect(() => {
        const getSoldPackage = () => {
            var AdminApi = Connections.api + Connections.viewpackagesale + `?page=${ppage}&limit=${prowsPerPage}`;
            var SalesApi = Connections.api + Connections.viewstorepackagesale + users.store_name + `?page=${ppage}&limit=${prowsPerPage}`;
            var Api = users.role === 'Admin' ? AdminApi : SalesApi;

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
                        setSoldPackage(response.data.data);
                        setLastPPage(response.data.last_page);
                    } else {
                        setSoldPackage(soldPackage);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching sold packages!'
                    });
                });
        };
        getSoldPackage();
        return () => {};
    }, [popup, ppage, prowsPerPage]);

    // const displayedPSalesData = filteredPSalesData.slice(ppage * prowsPerPage, ppage * prowsPerPage + prowsPerPage);

    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Box paddingX={2} className="shadow-1 p-4 pt-2 rounded">
                        <TextField
                            label="Search sold package"
                            variant="outlined"
                            color="primary"
                            value={searchPText}
                            onChange={handlePSearchTextChange}
                            className="mb-2 mt-1  "
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <IconSearch />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <FormControl className="ms-2 my-1">
                            <Select value={filterPDate} onChange={handlePFilterDateChange}>
                                <MenuItem value="Date">Date</MenuItem>
                                {Array.from(new Set(soldPackage.map((sale) => sale.date))).map((date) => (
                                    <MenuItem key={date} value={date}>
                                        {date}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {users.role === 'Admin' && (
                            <FormControl className="ms-2 my-1">
                                <Select value={filterPShop} onChange={handlePFilterShopChange}>
                                    <MenuItem value="Shop">Shop</MenuItem>
                                    {Array.from(new Set(soldPackage.map((sale) => sale.shop))).map((shop) => (
                                        <MenuItem key={shop} value={shop}>
                                            {shop}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <FormControl className="ms-2 my-1">
                            <Select value={filterPPaymentStatus} onChange={handlePFilterPaymentMethodChange}>
                                <MenuItem value="Payment_Status">Payment_Status</MenuItem>
                                {Array.from(new Set(soldPackage.map((sale) => sale.payment_status))).map((paymentStatus) => (
                                    <MenuItem key={paymentStatus} value={paymentStatus}>
                                        {paymentStatus}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TableContainer component={Paper}>
                            <Table aria-label="Sales Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedPRows.length > 0 && selectedPRows.length < soldPackage.length}
                                                checked={selectedPRows.length === soldPackage.length}
                                                onChange={handleSelectPAllClick}
                                            />
                                        </TableCell>
                                        <TableCell>Shop</TableCell>
                                        <TableCell>Reference</TableCell>
                                        <TableCell>Package Name</TableCell>
                                        <TableCell>Customer</TableCell>

                                        <TableCell>Total Price</TableCell>
                                        <TableCell>Payment Status</TableCell>
                                        <TableCell>Payment Method</TableCell>

                                        <TableCell>Actions </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPSalesData.map((soldItem) => (
                                        <TableRow key={soldItem.id} hover onClick={(event) => handlePRowClick(event, soldItem.id)}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedPRows.indexOf(soldItem.id) !== -1} />
                                            </TableCell>
                                            <TableCell>{soldItem.shop}</TableCell>
                                            <TableCell>{soldItem.reference}</TableCell>
                                            <TableCell>{soldItem.p_name}</TableCell>
                                            <TableCell>{soldItem.customer}</TableCell>
                                            <TableCell>{parseInt(soldItem.grandtotal).toFixed(2)}</TableCell>
                                            <TableCell>{soldItem.payment_status}</TableCell>
                                            <TableCell>{soldItem.payment_method}</TableCell>

                                            <TableCell>
                                                <IconButton
                                                    aria-controls="row-menu"
                                                    aria-haspopup="true"
                                                    onClick={(event) => handleSelectPItem(event, soldItem)}
                                                >
                                                    <MoreVert />
                                                </IconButton>
                                                <Menu
                                                    id="row-menu"
                                                    anchorEl={anchorEl}
                                                    keepMounted
                                                    open={Boolean(anchorEl)}
                                                    onClose={handleMenuClose}
                                                    className="shadow-sm"
                                                >
                                                    <MenuItem
                                                        onClick={() => navigate('/view-sold-package', { state: { ...selectedPItem } })}
                                                    >
                                                        View Sale
                                                    </MenuItem>

                                                    {users.role === 'Admin' && (
                                                        <>
                                                            <MenuItem
                                                                onClick={() =>
                                                                    navigate('/update-sold-package', { state: { ...selectedPItem } })
                                                                }
                                                            >
                                                                Edit Sale
                                                            </MenuItem>
                                                            <MenuItem onClick={() => handlePTrashClick(selectedPItem)}>
                                                                Delete Sale
                                                            </MenuItem>
                                                        </>
                                                    )}
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50, 75, 100]}
                                component="div"
                                count={parseInt(pLastPage * prowsPerPage)}
                                rowsPerPage={prowsPerPage}
                                page={ppage}
                                onPageChange={handlePPageChange}
                                onRowsPerPageChange={handleChangeRowsPPerPage}
                            />
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Sale</DialogTitle>
                <DialogContent>Do you want to delete {selectedPItem ? selectedPItem.reference : ''} ?</DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="error" onClick={() => handlePDelete(selectedPItem.id)}>
                        {spinner ? (
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Yes'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PackageScreen;
