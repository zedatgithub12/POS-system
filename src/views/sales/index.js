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
    MenuItem,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Collapse
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp, Delete, Edit } from '@mui/icons-material';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import ProductDummy from 'data/products';

// ==============================|| PRODUCT PAGE ||============================== //

const categories = ['All', 'Beverages', 'Accessories', 'Food & Beverage', 'Apparel'];
const brands = ['All', 'Addis Roasters', 'Habesha Leather Co.', 'Taste of Ethiopia', 'Dashen Designs', 'Honeyland'];
const shops = ['All', 'Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Gondar', 'Hawassa'];
const statuses = ['All', 'In stock', 'Out of stock'];

const Sales = () => {
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [brandFilter, setBrandFilter] = useState('All');
    const [shopFilter, setShopFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleBrandFilterChange = (event) => {
        setBrandFilter(event.target.value);
    };

    const handleShopFilterChange = (event) => {
        setShopFilter(event.target.value);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = ProductDummy.filter((product) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(product.name) || searchRegex.test(product.code));
        }

        if (categoryFilter !== 'All') {
            isMatch = isMatch && product.category === categoryFilter;
        }

        if (brandFilter !== 'All') {
            isMatch = isMatch && product.brand === brandFilter;
        }

        if (shopFilter !== 'All') {
            isMatch = isMatch && product.shop.includes(shopFilter);
        }

        if (statusFilter !== 'All') {
            isMatch = isMatch && product.status === statusFilter;
        }

        return isMatch;
    });

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
                            <Button component={Link} to="/create-sale" variant="outlined" color="secondary" sx={{ textDecoration: 'none' }}>
                                Create Sale
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Box paddingX="2" className="shadow-1 p-4 pt-2 rounded ">
                        <TextField
                            label="Search"
                            variant="outlined"
                            color="secondary"
                            value={searchText}
                            onChange={handleSearchTextChange}
                            className="mb-4 w-50 float-end"
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

                        <TextField
                            select
                            label="Category"
                            variant="outlined"
                            color="secondary"
                            value={categoryFilter}
                            onChange={handleCategoryFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Brand"
                            variant="outlined"
                            color="secondary"
                            value={brandFilter}
                            onChange={handleBrandFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {brands.map((brand) => (
                                <MenuItem key={brand} value={brand}>
                                    {brand}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Shop"
                            variant="outlined"
                            color="secondary"
                            value={shopFilter}
                            onChange={handleShopFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {shops.map((shop) => (
                                <MenuItem key={shop} value={shop}>
                                    {shop}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Status"
                            variant="outlined"
                            color="secondary"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TableContainer component={Paper} className="shadow-sm">
                            <Table aria-label="product table">
                                <TableHead className="bg-light">
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Brand</TableCell>

                                        <TableCell>Price</TableCell>
                                        <TableCell>Quantity</TableCell>

                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((product, index) => (
                                        <ProductRow key={index} product={product} />
                                    ))}
                                </TableBody>
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
                className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary rounded' : 'border-0 rounded'}
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
            <TableRow className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary' : 'border-0'}>
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
                    <Button variant="text" color="secondary" onClick={handleDialogClose}>
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
