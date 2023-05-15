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
    Collapse,
    FormControl,
    Select,
    InputLabel
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Connections from 'api';
// ==============================|| PRODUCT PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Products = () => {
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [brandFilter, setBrandFilter] = useState('All');
    const [shopFilter, setShopFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [productData, setProductData] = useState([]);

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

    const filteredData = productData.filter((product) => {
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

    useEffect(() => {
        const getProducts = () => {
            var Api = Connections.api + Connections.viewproduct;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'GET',
                headers: headers
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setProductData(response.data);
                    } else {
                        setProductData(productData);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching product!'
                    });
                });
        };
        getProducts();
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
                                    <Typography variant="h3">Products</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/add-product" variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Box paddingX="2" className="shadow-1 p-4 rounded ">
                        <TextField
                            label="Search"
                            variant="outlined"
                            color="primary"
                            value={searchText}
                            onChange={handleSearchTextChange}
                            className="mb-4"
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
                            <InputLabel>Category</InputLabel>
                            <Select value={categoryFilter} onChange={handleCategoryFilterChange}>
                                <MenuItem value="All">All</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.category))).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2">
                            <InputLabel>Brand</InputLabel>
                            <Select value={brandFilter} onChange={handleBrandFilterChange}>
                                <MenuItem value="All">All</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.brand))).map((brand) => (
                                    <MenuItem key={brand} value={brand}>
                                        {brand}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2">
                            <InputLabel>Shop</InputLabel>
                            <Select value={shopFilter} onChange={handleShopFilterChange}>
                                <MenuItem value="All">All</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.shop))).map((shop) => (
                                    <MenuItem key={shop} value={shop}>
                                        {shop}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2">
                            <InputLabel>Status</InputLabel>
                            <Select value={statusFilter} onChange={handleStatusFilterChange}>
                                <MenuItem value="All">All</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.status))).map((status) => (
                                    <MenuItem key={status} value={status}>
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
        var Api = Connections.api + Connections.deleteproduct + selectedProduct.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        // Make the API call using fetch()
        fetch(Api, {
            method: 'DELETE',
            headers: headers
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
                    setProductData(productData);
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
                    message: 'There is error deleting product!'
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
                <TableCell component="th" scope="row">
                    {product.picture ? (
                        <img
                            src={Connections.images + product.picture}
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
            </Dialog>
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
        picture: PropTypes.string,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        cost: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        shop: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired
};
export default Products;
