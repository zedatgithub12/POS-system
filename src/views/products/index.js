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
    FormControlLabel,
    Checkbox,
    Select,
    List,
    ListItem,
    ListItemText,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import {
    IconCheck,
    IconChevronsDown,
    IconChevronsUp,
    IconTrash,
    IconEdit,
    IconSearch,
    IconEye,
    IconPlus,
    IconTestPipe,
    IconArrowsTransferDown,
    IconX,
    IconChargingPile,
    IconCoins
} from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Connections from 'api';
import { useTheme } from '@mui/material/styles';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { ActivityIndicators } from 'ui-component/activityIndicator';

// ==============================|| PRODUCT PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Products = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const theme = useTheme();

    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Category');
    const [subCategoryFilter, setSubCategoryFilter] = useState('Sub Category');
    const [brandFilter, setBrandFilter] = useState('Brand');
    const [shopFilter, setShopFilter] = useState('Shop');
    const [statusFilter, setStatusFilter] = useState('Status');
    const [page, setPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState();
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [productData, setProductData] = useState([]);

    const [loading, setLoading] = useState(true);

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

    const handleSubCategoryFilterChange = (event) => {
        setSubCategoryFilter(event.target.value);
    };

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
            isMatch = isMatch && (searchRegex.test(product.item_name) || searchRegex.test(product.item_code));
        }

        if (categoryFilter !== 'Category') {
            isMatch = isMatch && product.item_category === categoryFilter;
        }
        if (subCategoryFilter !== 'Sub Category') {
            isMatch = isMatch && product.item_sub_category === subCategoryFilter;
        }
        if (brandFilter !== 'Brand') {
            isMatch = isMatch && product.item_brand === brandFilter;
        }

        if (statusFilter !== 'Status') {
            isMatch = isMatch && product.item_status === statusFilter;
        }

        return isMatch;
    });

    useEffect(() => {
        const getProducts = () => {
            setLoading(true);
            var Api = Connections.api + Connections.items + `?page=${page}&limit=${rowsPerPage}`;
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
                        setProductData(response.data.data);
                        setTotalRecords(response.data.last_page);

                        setLoading(false);
                    } else {
                        setProductData(productData);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching product!'
                    });
                    setLoading(false);
                });
        };

        getProducts();
        return () => {};
    }, [page, rowsPerPage]);

    // const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3" sx={{ marginLeft: 2 }}>
                                        Products
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        {users.role === 'Admin' && (
                            <Grid item>
                                <Button
                                    component={Link}
                                    to="/add-product"
                                    variant="outlined"
                                    color="primary"
                                    sx={{ textDecoration: 'none' }}
                                >
                                    Add Product
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Box paddingX="2" className="shadow-1 p-3 rounded ">
                        <TextField
                            label="Search"
                            variant="outlined"
                            color="primary"
                            value={searchText}
                            onChange={handleSearchTextChange}
                            className="mb-2 mt-2"
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

                        <FormControl className="ms-2 mt-2 ">
                            <Select value={categoryFilter} onChange={handleCategoryFilterChange}>
                                <MenuItem value="Category">Category</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.item_category))).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className="ms-2 mt-2 ">
                            <Select value={subCategoryFilter} onChange={handleSubCategoryFilterChange}>
                                <MenuItem value="Sub Category">Sub Category</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.item_sub_category))).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 mt-2 ">
                            <Select value={brandFilter} onChange={handleBrandFilterChange}>
                                <MenuItem value="Brand">Brand</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.item_brand))).map((brand) => (
                                    <MenuItem key={brand} value={brand}>
                                        {brand}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 my-2 ">
                            <Select value={statusFilter} onChange={handleStatusFilterChange}>
                                <MenuItem value="Status">Status</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.item_status))).map((status) => (
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
                                        <TableCell>Code</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Sub Category</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>SKU</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
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
                                    ) : filteredData.length == 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">
                                                <Box
                                                    sx={{ minHeight: 188, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                                                >
                                                    <Typography>No Product</Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((product, index) => <ProductRow key={index} product={product} />)
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50, 100]}
                                component="div"
                                count={parseInt(rowsPerPage * totalRecords)}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

const ProductRow = ({ product }) => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const navigate = useNavigate();
    const [spinner, setSpinner] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };

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
        var Api = Connections.api + Connections.deleteItems + selectedProduct.id;
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
                    message: 'There is error deleting product!'
                });
                setSpinner(false);
            });
    };

    return (
        <>
            <TableRow
                hover
                className={
                    open
                        ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary rounded bg-light'
                        : 'border-0 rounded'
                }
            >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{product.item_name}</TableCell>
                <TableCell>{product.item_code}</TableCell>
                <TableCell>{product.item_category}</TableCell>
                <TableCell>{product.item_sub_category}</TableCell>
                <TableCell>{product.item_brand}</TableCell>
                <TableCell>
                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded"> {product.item_unit}</span>
                </TableCell>
                <TableCell>{product.item_price} ETB</TableCell>
                <TableCell sx={{ textTransform: 'capitalize' }}>
                    <span
                        className={
                            product.item_status === 'active'
                                ? 'bg-success bg-opacity-10 text-success px-2 py-1 rounded'
                                : 'bg-danger bg-opacity-10 text-danger px-2 py-1 rounded'
                        }
                    >
                        {product.item_status}
                    </span>
                </TableCell>
                <>
                    <TableCell>
                        <IconButton
                            aria-label="Edit row"
                            size="small"
                            onClick={() =>
                                navigate('/view-product', {
                                    state: { ...product }
                                })
                            }
                        >
                            <IconEye />
                        </IconButton>

                        {users.role === 'Admin' && (
                            <>
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
                                {/* <IconButton aria-label="Trash row" size="small" onClick={() => handleTrashClick(product)}>
                                    <IconTrash />
                                </IconButton> */}
                            </>
                        )}
                    </TableCell>
                </>
            </TableRow>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>Do you want to delete {selectedProduct ? selectedProduct.item_name : ''} ?</DialogContent>
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
        id: PropTypes.number,
        item_image: PropTypes.string,
        item_name: PropTypes.string.isRequired,
        item_category: PropTypes.string.isRequired,
        item_sub_category: PropTypes.string.isRequired,
        item_brand: PropTypes.string.isRequired,
        item_price: PropTypes.number.isRequired,
        item_status: PropTypes.string.isRequired,
        item_code: PropTypes.string.isRequired,
        item_unit: PropTypes.string.isRequired,
        item_description: PropTypes.string.isRequired
    }).isRequired
};
export default Products;
