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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconSearch } from '@tabler/icons';
// project imports
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import Connections from 'api';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { ActivityIndicators } from 'ui-component/activityIndicator';

// ==============================|| SALES PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ITEM_HEIGHT = 20;
const StockScreen = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [exportSales, setExportSales] = useState(null);
    //stock states
    const [salesData, setSalesData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterDate, setFilterDate] = useState('Date');
    const [filterShop, setFilterShop] = useState('Shop');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('Payment_Status');
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedItem, setSelectedItems] = useState();
    const [loading, setLoading] = useState(true);
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
        setExportSales(null);
    };
    const expand = Boolean(exportSales);
    const handleClick = (event) => {
        setExportSales(event.currentTarget);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const handleSelectItem = (event, item) => {
        handleMenuClick(event);
        setSelectedItems({ ...item });
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelectedRows(salesData.map((sale) => sale.id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowClick = (event, id) => {
        const selectedIndex = selectedRows.indexOf(id);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = newSelectedRows.concat(selectedRows, id);
        } else if (selectedIndex === 0) {
            newSelectedRows = newSelectedRows.concat(selectedRows.slice(1));
        } else if (selectedIndex === selectedRows.length - 1) {
            newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelectedRows = newSelectedRows.concat(selectedRows.slice(0, selectedIndex), selectedRows.slice(selectedIndex + 1));
        }

        setSelectedRows(newSelectedRows);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    //Stock sale filtering methods
    const handleFilterDateChange = (event) => {
        setFilterDate(event.target.value);
        setPage(0);
    };

    const handleFilterShopChange = (event) => {
        setFilterShop(event.target.value);
        setPage(0);
    };

    const handleFilterPaymentMethodChange = (event) => {
        setFilterPaymentStatus(event.target.value);
        setPage(0);
    };
    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
        setPage(0);
    };
    //stock filtering function
    const filteredSalesData = salesData.filter((sale) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(sale.reference) || searchRegex.test(sale.shop));
        }
        if (filterDate !== 'Date') {
            isMatch = isMatch && sale.date === filterDate;
        }

        if (filterShop !== 'Shop') {
            isMatch = isMatch && sale.shop === filterShop;
        }
        if (filterPaymentStatus !== 'Payment_Status') {
            isMatch = isMatch && sale.payment_status === filterPaymentStatus;
        }
        return isMatch;
    });

    // const displayedSalesData = filteredSalesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleTrashClick = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setDialogOpen(false);
        handleMenuClose();
        setExportSales(null);
    };

    const handleDelete = (id) => {
        // Do something with the deleted category
        setSpinner(true);
        var Api = Connections.api + Connections.deletesale + id;
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
        const getSales = () => {
            setLoading(true);
            var AdminApi = Connections.api + Connections.viewsale + `?page=${page}&limit=${rowsPerPage}`;
            var SalesApi = Connections.api + Connections.viewstoresale + users.store_name + `?page=${page}&limit=${rowsPerPage}`;
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
                        var selectedShop = response.data.data > 0 ? response.data.data[1].shop : 'Shop';
                        setFilterShop(selectedShop);
                        setSalesData(response.data.data);
                        setLastPage(response.data.last_page);
                        setLoading(false);
                    } else {
                        setSalesData(salesData);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching Sales!'
                    });
                    setLoading(false);
                });
        };
        getSales();
        return () => {};
    }, [page, rowsPerPage]);

    const csvData =
        selectedRows.length > 0
            ? selectedRows.map((id) => {
                  const sale = salesData.find((item) => item.id === id);
                  return {
                      Shop: sale.shop,
                      SoldOn: sale.date,
                      Reference: sale.reference,
                      customer: sale.customer,
                      GrandTotal: sale.grandtotal,
                      Payment_Status: sale.payment_status,
                      Payment_method: sale.payment_method,
                      Note: sale.note,
                      Time: sale.time
                  };
              })
            : filteredSalesData.map((sale) => ({
                  Shop: sale.shop,
                  SoldOn: sale.date,
                  Reference: sale.reference,
                  customer: sale.customer,
                  GrandTotal: sale.grandtotal,
                  Payment_Status: sale.payment_status,
                  payment_method: sale.payment_method,
                  Note: sale.note,

                  Time: sale.time
              }));

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        const fileData = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });
        saveAs(fileData, 'sales.xlsx');
    };
    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Box paddingX={2} className="shadow-1 p-4 pt-2 rounded">
                        <Grid
                            item
                            xs={12}
                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <Box>
                                <TextField
                                    label="Search stock sales"
                                    variant="outlined"
                                    color="primary"
                                    value={searchText}
                                    onChange={handleSearchTextChange}
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

                                {users.role === 'Admin' && (
                                    <FormControl className="ms-2 my-1">
                                        <Select value={filterShop} onChange={handleFilterShopChange}>
                                            <MenuItem value="Shop">Shop</MenuItem>
                                            {Array.from(new Set(salesData.map((sale) => sale.shop))).map((shop) => (
                                                <MenuItem key={shop} value={shop}>
                                                    {shop}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                <FormControl className="ms-2 my-1">
                                    <Select value={filterDate} onChange={handleFilterDateChange}>
                                        <MenuItem value="Date">Date</MenuItem>
                                        {Array.from(new Set(salesData.map((sale) => sale.date))).map((date) => (
                                            <MenuItem key={date} value={date}>
                                                {date}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className="ms-2 my-1">
                                    <Select value={filterPaymentStatus} onChange={handleFilterPaymentMethodChange}>
                                        <MenuItem value="Payment_Status">Payment_Status</MenuItem>
                                        {Array.from(new Set(salesData.map((sale) => sale.payment_status))).map((paymentstatus) => (
                                            <MenuItem key={paymentstatus} value={paymentstatus}>
                                                {paymentstatus}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <IconButton
                                aria-label="more"
                                id="long-button"
                                aria-controls={expand ? 'long-menu' : undefined}
                                aria-expanded={expand ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="long-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'long-button'
                                }}
                                anchorEl={exportSales}
                                open={expand}
                                onClose={handleClose}
                                PaperProps={{
                                    style: {
                                        maxHeight: ITEM_HEIGHT * 4.5,
                                        width: '20ch'
                                    }
                                }}
                            >
                                <MenuItem onClick={handleDownloadExcel}>Export Excel </MenuItem>
                                <MenuItem>
                                    <CSVLink data={csvData} filename={'sales.csv'} className="text-decoration-none text-dark">
                                        Export CSV
                                    </CSVLink>
                                </MenuItem>
                            </Menu>
                        </Grid>
                        <TableContainer component={Paper}>
                            <Table className="" aria-label="Sales Table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedRows.length > 0 && selectedRows.length < salesData.length}
                                                checked={selectedRows.length === salesData.length}
                                                onChange={handleSelectAllClick}
                                            />
                                        </TableCell>
                                        <TableCell>Reference</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Shop</TableCell>
                                        <TableCell>Total Price(ETB)</TableCell>
                                        <TableCell>Payment Status</TableCell>
                                        <TableCell>Payment Method</TableCell>
                                        <TableCell>Sold On</TableCell>
                                        <TableCell>Actions </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">
                                                <Box
                                                    sx={{ minHeight: 188, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                >
                                                    <ActivityIndicators />
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSalesData.map((soldItem) => (
                                            <TableRow key={soldItem.id} hover onClick={(event) => handleRowClick(event, soldItem.id)}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedRows.indexOf(soldItem.id) !== -1} />
                                                </TableCell>
                                                <TableCell>{soldItem.reference}</TableCell>
                                                <TableCell>{soldItem.customer}</TableCell>
                                                <TableCell>{soldItem.shop}</TableCell>

                                                <TableCell>
                                                    {' '}
                                                    <span className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded text-capitalize">
                                                        {parseInt(soldItem.grandtotal).toFixed(2)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {soldItem.payment_status === 'Unpaid' ? (
                                                        <span className="bg-danger bg-opacity-10 text-danger px-4 py-1 rounded text-capitalize">
                                                            {soldItem.payment_status}
                                                        </span>
                                                    ) : (
                                                        <span className="bg-success bg-opacity-10 text-success px-4 py-1 rounded text-capitalize">
                                                            {soldItem.payment_status}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{soldItem.payment_method}</TableCell>
                                                <TableCell>{soldItem.date}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        aria-controls="row-menu"
                                                        aria-haspopup="true"
                                                        onClick={(event) => handleSelectItem(event, soldItem)}
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
                                                        <MenuItem onClick={() => navigate('/view-sale', { state: { ...selectedItem } })}>
                                                            View Sale
                                                        </MenuItem>

                                                        {users.role === 'Admin' && (
                                                            <>
                                                                <MenuItem
                                                                    onClick={() => navigate('/update-sale', { state: { ...selectedItem } })}
                                                                >
                                                                    Edit Sale
                                                                </MenuItem>
                                                                {/* <MenuItem onClick={() => handleTrashClick(selectedItem)}>
                                                                    Delete Sale
                                                                </MenuItem> */}
                                                            </>
                                                        )}
                                                    </Menu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50, 75, 100]}
                                component="div"
                                count={parseInt(rowsPerPage * lastPage)}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Sale</DialogTitle>
                <DialogContent>Do you want to delete {selectedItem ? selectedItem.reference : ''} ?</DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="error" onClick={() => handleDelete(selectedItem.id)}>
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

export default StockScreen;
