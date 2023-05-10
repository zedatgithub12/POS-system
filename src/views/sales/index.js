import { useState } from 'react';
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
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';

import { MoreVert } from '@mui/icons-material';
import { IconSearch } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import salesData from 'data/sales';

// ==============================|| SALES PAGE ||============================== //

const Sales = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedItem, setSelectedItems] = useState();
    const [page, setPage] = useState(0);
    const [filterDate, setFilterDate] = useState('All');
    const [filterShop, setFilterShop] = useState('All');
    const [filterPaymentMethod, setFilterPaymentMethod] = useState('All');
    const [searchText, setSearchText] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);

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

    const handleFilterDateChange = (event) => {
        setFilterDate(event.target.value);
        setPage(0);
    };

    const handleFilterShopChange = (event) => {
        setFilterShop(event.target.value);
        setPage(0);
    };

    const handleFilterPaymentMethodChange = (event) => {
        setFilterPaymentMethod(event.target.value);
        setPage(0);
    };
    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
        setPage(0);
    };

    // const handleViewClick = (soldItem) => {
    //     navigate('/view-sale', { state: { ...soldItem } });
    // };

    const filteredSalesData = salesData.filter((sale) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(sale.reference) || searchRegex.test(sale.shop));
        }
        if (filterDate !== 'All') {
            isMatch = isMatch && sale.date === filterDate;
        }

        if (filterShop !== 'All') {
            isMatch = isMatch && sale.shop === filterShop;
        }
        if (filterPaymentMethod !== 'All') {
            isMatch = isMatch && sale.payment_method === filterPaymentMethod;
        }
        return isMatch;
    });

    const displayedSalesData = filteredSalesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const [dialogOpen, setDialogOpen] = useState(false);

    const handleTrashClick = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleDelete = (id) => {
        alert(id + 'will be deleted');
    };

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Sales</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/create-sale" variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                Create Sale
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Box paddingX={2} className="shadow-1 p-4 pt-2 rounded">
                        <TextField
                            label="Search"
                            variant="outlined"
                            color="primary"
                            value={searchText}
                            onChange={handleSearchTextChange}
                            className="mb-4  "
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
                        <FormControl className="ms-2">
                            <InputLabel>Date</InputLabel>
                            <Select value={filterDate} onChange={handleFilterDateChange}>
                                <MenuItem value="All">All</MenuItem>
                                {Array.from(new Set(salesData.map((sale) => sale.date))).map((date) => (
                                    <MenuItem key={date} value={date}>
                                        {date}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className="ms-2">
                            <InputLabel>Shop</InputLabel>
                            <Select value={filterShop} onChange={handleFilterShopChange}>
                                <MenuItem value="All">All</MenuItem>
                                {Array.from(new Set(salesData.map((sale) => sale.shop))).map((shop) => (
                                    <MenuItem key={shop} value={shop}>
                                        {shop}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className="ms-2">
                            <InputLabel>Payment Method</InputLabel>
                            <Select value={filterPaymentMethod} onChange={handleFilterPaymentMethodChange}>
                                <MenuItem value="All">All</MenuItem>
                                {Array.from(new Set(salesData.map((sale) => sale.payment_method))).map((paymentMethod) => (
                                    <MenuItem key={paymentMethod} value={paymentMethod}>
                                        {paymentMethod}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                                        <TableCell>Total Price</TableCell>
                                        <TableCell>Payment Status</TableCell>
                                        <TableCell>Payment Method</TableCell>
                                        <TableCell>Sold On</TableCell>
                                        <TableCell>Actions </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedSalesData.map((soldItem) => (
                                        <TableRow key={soldItem.id} hover onClick={(event) => handleRowClick(event, soldItem.id)}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedRows.indexOf(soldItem.id) !== -1} />
                                            </TableCell>
                                            <TableCell>{soldItem.reference}</TableCell>
                                            <TableCell>{soldItem.customer.name}</TableCell>
                                            <TableCell>{soldItem.shop}</TableCell>
                                            <TableCell>{soldItem.grandtotal.toFixed(2)}</TableCell>
                                            <TableCell>{soldItem.payment_status}</TableCell>
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
                                                    <MenuItem onClick={() => navigate('/update-sale', { state: { ...selectedItem } })}>
                                                        Edit Sale
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleTrashClick(selectedItem)}>Delete Sale</MenuItem>
                                                </Menu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50, 75, 100]}
                                component="div"
                                count={filteredSalesData.length}
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
                    <Button variant="text" color="error" onClick={() => handleDelete(selectedItem ? selectedItem.id : '0')}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </MainCard>
    );
};

export default Sales;
