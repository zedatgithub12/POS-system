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
    IconX
} from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Connections from 'api';
import { useTheme } from '@mui/material/styles';
import 'react-lazy-load-image-component/src/effects/blur.css';
// ==============================|| PRODUCT PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Products = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const theme = useTheme();

    const GoBack = () => {
        navigate(-1);
    };

    const [shopId, setShopId] = useState(null);
    const [shopName, setShopsName] = useState();
    const [shops, setShops] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Category');
    const [subCategoryFilter, setSubCategoryFilter] = useState('Sub Category');
    const [brandFilter, setBrandFilter] = useState('Brand');
    const [shopFilter, setShopFilter] = useState('Shop');
    const [statusFilter, setStatusFilter] = useState('In-stock');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [productData, setProductData] = useState([]);
    const [openReplanishDialog, setOpenReplanishDialog] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [selectedStock, setSelectedStock] = useState([]);
    const [addedAmount, setAddedAmount] = useState();
    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

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
    const handleReplanishClick = () => {
        setOpenReplanishDialog(true);
        getShops();
    };

    const handleDialogClose = () => {
        setOpenReplanishDialog(false);
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
            isMatch = isMatch && (searchRegex.test(product.name) || searchRegex.test(product.code));
        }

        if (categoryFilter !== 'Category') {
            isMatch = isMatch && product.category === categoryFilter;
        }
        if (subCategoryFilter !== 'Sub Category') {
            isMatch = isMatch && product.sub_category === subCategoryFilter;
        }
        if (brandFilter !== 'Brand') {
            isMatch = isMatch && product.brand === brandFilter;
        }

        if (shopFilter !== 'Shop') {
            isMatch = isMatch && product.shop.includes(shopFilter);
        }

        if (statusFilter !== 'Status') {
            isMatch = isMatch && product.status === statusFilter;
        }

        return isMatch;
    });

    // Stock Item Replanishment related codes

    const handleShopSelection = (value) => {
        setShopId(value.id);
        setShopsName(value.name);
        setSelectedStock([]);
        getStock(value.name);
    };
    const getStock = (shop) => {
        setLoading(true);
        var Api = Connections.api + Connections.viewstoreproduct + shop;
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
                    setStockData(response.data);
                    setLoading(false);
                } else {
                    setStockData([]);
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

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        if (!shopName) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select shop!'
            });
            setSpinner(false);
        }
        if (!selectedStock) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select stock first!'
            });
            setSpinner(false);
        }
        if (!addedAmount) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please enter the amount to be added!'
            });
            setSpinner(false);
        } else {
            // Handle form submission here
            // Declare the data to be sent to the API
            var Api = Connections.api + Connections.newreplanishment;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                shopid: shopId,
                shopname: shopName,
                stock_id: selectedStock.id,
                stock_name: selectedStock.name,
                stock_code: selectedStock.code,
                existing_amount: selectedStock.quantity,
                added_amount: addedAmount,
                userid: users.id
            };

            // Make the API call using fetch()
            fetch(Api, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(Data)
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
                        message: 'There is error replanishing stock item!'
                    });
                    setSpinner(false);
                });
        }
    };

    const getShops = () => {
        var Api = Connections.api + Connections.viewstore;
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
                    setShops(response.data);
                } else {
                    setShops(shops);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching shop!'
                });
            });
    };

    useEffect(() => {
        const getProducts = () => {
            var AdminApi = Connections.api + Connections.viewproduct;
            var saleApi = Connections.api + Connections.viewstoreproduct + users.store_name;
            var Api = users.role === 'Admin' ? AdminApi : saleApi;
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
                                    <Typography variant="h3">Stocks</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <>
                    {users.role === 'Admin' && (
                        <Grid container paddingX={6} paddingTop={5}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Button
                                    component={Link}
                                    to="/add-product"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly',
                                        backgroundColor: theme.palette.primary.light,
                                        borderRadius: 2,
                                        padding: 2,
                                        marginRight: 1
                                    }}
                                >
                                    <IconPlus />
                                    <Typography variant="h4">Add New</Typography>
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <Button
                                    onClick={() => handleReplanishClick()}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly',
                                        backgroundColor: theme.palette.primary.light,
                                        borderRadius: 2,
                                        padding: 2,
                                        marginX: 1
                                    }}
                                >
                                    <IconTestPipe />
                                    <Typography variant="h4">Replanish</Typography>
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={12} md={6} lg={4} xl={2}>
                                <Button
                                    component={Link}
                                    to="/make-transfer"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly',
                                        backgroundColor: theme.palette.primary.light,
                                        borderRadius: 2,
                                        padding: 2,
                                        marginX: 1
                                    }}
                                >
                                    <IconArrowsTransferDown />
                                    <Typography variant="h4">Transfer</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </>

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
                                {Array.from(new Set(productData.map((product) => product.category))).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className="ms-2 mt-2 ">
                            <Select value={subCategoryFilter} onChange={handleSubCategoryFilterChange}>
                                <MenuItem value="Sub Category">Sub Category</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.sub_category))).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 mt-2 ">
                            <Select value={brandFilter} onChange={handleBrandFilterChange}>
                                <MenuItem value="Brand">Brand</MenuItem>
                                {Array.from(new Set(productData.map((product) => product.brand))).map((brand) => (
                                    <MenuItem key={brand} value={brand}>
                                        {brand}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {users.role === 'Admin' && (
                            <FormControl className="ms-2 my-2 ">
                                <Select value={shopFilter} onChange={handleShopFilterChange}>
                                    <MenuItem value="Shop">Shop</MenuItem>
                                    {Array.from(new Set(productData.map((product) => product.shop))).map((shop) => (
                                        <MenuItem key={shop} value={shop}>
                                            {shop}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl className="ms-2 my-2 ">
                            <Select value={statusFilter} onChange={handleStatusFilterChange}>
                                <MenuItem value="Status">Status</MenuItem>
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
                                        <TableCell>Sub Category</TableCell>
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
            <Dialog open={openReplanishDialog} onClose={handleDialogClose}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <DialogTitle sx={{ fontSize: theme.typography.h3 }}>Replanish Stock </DialogTitle>
                    <Button variant="text" color="dark" onClick={handleDialogClose}>
                        <IconX />
                    </Button>
                </Box>

                <Divider />
                <DialogContent>
                    <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleSubmit}>
                        <Grid container>
                            <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Grid item xs={12} sm={12}>
                                    <Autocomplete
                                        required
                                        options={shops}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(event, value) => {
                                            if (value) {
                                                handleShopSelection(value);
                                            }
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Shop" variant="outlined" />}
                                        noOptionsText="Loading..."
                                    />
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item xs={12} sm={12}>
                                    <Autocomplete
                                        key={stockData.id}
                                        disabled={shopId ? false : true}
                                        options={stockData}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(event, value) => {
                                            if (value) {
                                                setSelectedStock(value);
                                            }
                                        }}
                                        sx={{ marginTop: 2 }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Stock"
                                                variant="outlined"
                                                sx={{ backgroundColor: theme.palette.background.default }}
                                            />
                                        )}
                                        noOptionsText={loading ? <CircularProgress size={20} /> : 'No item in this shop'}
                                    />
                                </Grid>

                                {loading && (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        sx={{ color: '#ffbb00', display: 'flex', alignItems: 'center', paddingLeft: 1 }}
                                    >
                                        <CircularProgress size={20} />
                                    </Grid>
                                )}
                            </Grid>

                            <Grid container>
                                <Grid
                                    item
                                    xs={12}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: 2,
                                        marginY: 2,
                                        backgroundColor: theme.palette.primary.light,
                                        borderRadius: 2
                                    }}
                                >
                                    <Typography sx={{ fontSize: theme.typography.h5 }}>Current amount</Typography>
                                    <Typography sx={{ fontSize: theme.typography.h4 }}>
                                        {selectedStock.quantity} - {selectedStock.unit}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        type="text"
                                        label="New Amount"
                                        value={addedAmount}
                                        onChange={(event) => setAddedAmount(event.target.value)}
                                        sx={{ marginTop: 2, backgroundColor: theme.palette.background.default }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ paddingX: 4, paddingY: 1.6, marginTop: 2 }}
                                    >
                                        {spinner ? (
                                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                        ) : (
                                            'Submit'
                                        )}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>

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
    const [checked, setChecked] = useState(false);
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

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
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

    const [prices, setPrices] = useState([]);

    const [inputValue, setInputValue] = React.useState('');
    const [updating, setUpdating] = useState(false);
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (inputValue === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please enter the new price'
            });
        } else if (checked) {
            setUpdating(true);
            var Api = Connections.api + Connections.updateallprice;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var data = {
                productid: product.id,
                productcode: product.code,
                name: product.shop,
                from: product.price,
                to: inputValue
            };

            fetch(Api, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
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
                        setUpdating(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setUpdating(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error updating price'
                    });
                    setUpdating(false);
                });
        } else {
            setUpdating(true);
            var Api = Connections.api + Connections.updateprice;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var data = {
                productid: product.id,
                name: product.shop,
                from: product.price,
                to: inputValue
            };

            fetch(Api, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
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
                        setUpdating(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setUpdating(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error updating price'
                    });
                    setUpdating(false);
                });
        }
    };

    useEffect(() => {
        const FetchPrices = () => {
            var Api = Connections.api + Connections.priceupdates + product.id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            fetch(Api, {
                method: 'GET',
                headers: headers,
                cache: 'no-cache'
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setPrices(response.data);
                    } else {
                        setPrices(prices);
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: response.message
                    });
                });
        };
        FetchPrices();
        return () => {};
    }, [spinner, popup, open]);
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
                    {product.name}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.sub_category}</TableCell>
                <TableCell>{product.brand}</TableCell>

                <TableCell>{product.price} Birr</TableCell>
                <TableCell>{product.quantity}</TableCell>

                <TableCell>{product.status}</TableCell>
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

                        {users.role === 'Admin' ? (
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
                                <IconButton aria-label="Trash row" size="small" onClick={() => handleTrashClick(product)}>
                                    <IconTrash />
                                </IconButton>
                            </>
                        ) : null}
                    </TableCell>
                </>
            </TableRow>
            <TableRow className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary' : 'border-0'}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Grid container>
                            <Grid item xs={12} md={6}>
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
                                                <TableCell>Origional Quantity</TableCell>
                                                <TableCell>{product.origional_quantity}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Min Quantity</TableCell>
                                                <TableCell>{product.min_quantity}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Unit</TableCell>
                                                <TableCell>{product.unit}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Cost</TableCell>
                                                <TableCell>{product.cost}</TableCell>
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
                            </Grid>

                            <Grid item xs={12} md={6} className="border border-start-1 border-top-0 border-bottom-0 border-end-0">
                                <Box margin={1}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Price Updates
                                    </Typography>
                                    {users.role === 'Admin' && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={checked}
                                                        onChange={handleCheckboxChange}
                                                        name="checked"
                                                        color="primary"
                                                    />
                                                }
                                                label="All"
                                                className="mt-2 ms-2"
                                            />
                                            <form onSubmit={handleSubmit}>
                                                <TextField
                                                    label="Change to"
                                                    variant="outlined"
                                                    size="small"
                                                    value={inputValue}
                                                    className="mt-2 me-4"
                                                    onChange={handleInputChange}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <IconButton type="submit">
                                                                {updating ? (
                                                                    <div
                                                                        className="spinner-border spinner-border-sm text-dark "
                                                                        role="status"
                                                                    >
                                                                        <span className="visually-hidden">Loading...</span>
                                                                    </div>
                                                                ) : (
                                                                    <IconCheck />
                                                                )}
                                                            </IconButton>
                                                        )
                                                    }}
                                                />
                                            </form>
                                        </Box>
                                    )}

                                    {prices ? (
                                        <List>
                                            {prices.map((item) => (
                                                <ListItem key={item.id}>
                                                    <ListItemText primary={item.date} />
                                                    <ListItemText secondary={item.from} />
                                                    <ListItemText secondary={item.to} />
                                                    <ListItemText
                                                        primary={
                                                            item.to > item.from ? (
                                                                <>
                                                                    {item.to - item.from}
                                                                    <IconChevronsUp size={18} className="text-success" />
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {item.from - item.to}
                                                                    <IconChevronsDown size={18} className="text-danger" />
                                                                </>
                                                            )
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        <Typography>No price update yet!</Typography>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
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
        id: PropTypes.number,
        picture: PropTypes.string,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        min_quantity: PropTypes.number.isRequired,
        origional_quantity: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        cost: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        shop: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired
};
export default Products;
