import React, { useState } from 'react';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Collapse,
    FormControl,
    Checkbox,
    Select,
    InputLabel
} from '@mui/material';

import { KeyboardArrowDown, KeyboardArrowUp, Delete, Edit, MoreVert, Search } from '@mui/icons-material';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import salesData from 'data/sales';
import { addItem } from 'cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
// ==============================|| SALES PAGE ||============================== //

const Sales = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [page, setPage] = useState(0);
    const [filterDate, setFilterDate] = useState('All');
    const [filterShop, setFilterShop] = useState('All');
    const [filterPaymentMethod, setFilterPaymentMethod] = useState('All');
    const [searchText, setSearchText] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addItem({ product }));
    };

    const handleRemoveFromCart = () => {
        dispatch(removeItem({ code: product.code }));
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelectedRows(salesData.map((sale) => sale.item_code));
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowClick = (event, item_code) => {
        const selectedIndex = selectedRows.indexOf(item_code);
        let newSelectedRows = [];

        if (selectedIndex === -1) {
            newSelectedRows = newSelectedRows.concat(selectedRows, item_code);
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
    const filteredSalesData = salesData.filter((sale) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(sale.item_name) || searchRegex.test(sale.item_code));
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
                                        <TableCell>Product Name</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Total Price</TableCell>
                                        <TableCell>Shop</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedSalesData.map((sale) => (
                                        <TableRow key={sale.item_code} hover onClick={(event) => handleRowClick(event, sale.item_code)}>
                                            <TableCell padding="checkbox">
                                                <Checkbox checked={selectedRows.indexOf(sale.item_code) !== -1} />
                                            </TableCell>
                                            <TableCell>{sale.item_code}</TableCell>
                                            <TableCell>{sale.item_name}</TableCell>
                                            <TableCell>{sale.quantity}</TableCell>
                                            <TableCell>{`ETB ${sale.total_amount.toFixed(2)}`}</TableCell>
                                            <TableCell>{sale.shop}</TableCell>
                                            <TableCell>{sale.date}</TableCell>
                                            <TableCell>
                                                <IconButton aria-controls="row-menu" aria-haspopup="true" onClick={handleMenuClick}>
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
                                                        onClick={() =>
                                                            navigate('/view-sale', {
                                                                state: { ...sale }
                                                            })
                                                        }
                                                    >
                                                        View Sale
                                                    </MenuItem>
                                                    <MenuItem onClick={() => handleAddToCart(sale)}>Edit Sale</MenuItem>
                                                    <MenuItem onClick={handleMenuClose}>Delete Sale</MenuItem>
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
        </MainCard>
    );
};

const ProductRow = ({ product }) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
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
    const Delete = (id) => {
        alert(id + 'will be deleted');
    };
    return (
        <>
            <TableRow
                hover
                className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-primary rounded' : 'border-0 rounded'}
            >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {product.picture ? (
                        <img
                            src={product.picture}
                            alt="product"
                            style={{ width: 60, height: 60 }}
                            className="img-fluid rounded m-auto me-2"
                        />
                    ) : (
                        <img
                            src="http://placehold.it/120x120&text=image"
                            alt="product"
                            style={{ width: 60, height: 60 }}
                            className="img-fluid rounded m-auto me-2"
                        />
                    )}
                    {product.name}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>

                <TableCell>{product.price} Birr</TableCell>
                <TableCell>{product.quantity}</TableCell>

                <TableCell>{product.status}</TableCell>
                <TableCell>
                    <IconButton
                        aria-label="Edit row"
                        size="small"
                        onClick={() =>
                            navigate('/update-product', {
                                state: { ...product }
                            })
                        }
                    >
                        <IconEdit />
                    </IconButton>
                    <IconButton aria-label="Trash row" size="small" onClick={() => handleTrashClick(product)}>
                        <IconTrash />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-primary' : 'border-0'}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Product details
                            </Typography>
                            <Table size="small" aria-label="product details">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Code</TableCell>
                                        <TableCell>{product.code}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Cost</TableCell>
                                        <TableCell>{product.cost}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Unit</TableCell>
                                        <TableCell>{product.unit}</TableCell>
                                    </TableRow>

                                    <TableRow>
                                        <TableCell>Shop</TableCell>
                                        <TableCell>{product.shop}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="border-0">Description</TableCell>
                                        <TableCell className="border-0">{product.description}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>Do you want to delete {selectedProduct ? selectedProduct.name : ''} ?</DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="error" onClick={() => Delete(selectedProduct ? selectedProduct.code : '0')}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Sales;
