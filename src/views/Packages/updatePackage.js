import { useState, useEffect, forwardRef } from 'react';

// material-ui
import {
    Grid,
    Divider,
    Box,
    Paper,
    Autocomplete,
    InputAdornment,
    Button,
    IconButton,
    Typography,
    TextField,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Menu,
    MenuItem
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Connections from 'api';
import { gridSpacing } from 'store/constant';
import packages from 'assets/images/packages.svg';
import { ActivityIndicators } from 'ui-component/activityIndicator';
import { IconCheck, IconPencil, IconRefresh, IconRotate } from '@tabler/icons';
import { DialogBox } from './components/dialog';
import { Stack } from '@mui/system';

// ==============================|| UPDATE PACKAGE PAGE ||============================== //
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UpdatePackage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { state } = useLocation();
    const item = state ? state : {};

    const GoBack = () => {
        navigate(-1);
    };
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const [shopId, setShopId] = useState(item.shopid);
    const [shopName, setShopsName] = useState(item.shopname);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [Items, setItems] = useState([]);
    const [stockData, setStockData] = useState([]);
    const [selectedStock, setSelectedStock] = useState([]);
    const [addedAmount, setAddedAmount] = useState();
    const [products, setProducts] = useState(item.items);
    const [name, setName] = useState(item.name);
    const [Price, setPrice] = useState(item.price);
    const [date, setDate] = useState(item.expiredate);
    const [spinner, setSpinner] = useState(false);
    const [packageSpinner, setPackageSpinner] = useState(false);
    const [stockLoader, setStockLoader] = useState(false);
    const [itemQuantity, setItemQuantity] = useState();
    const [addItemDialog, setAddItemDialog] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItems] = useState();
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

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setPackageSpinner(true);
        if (!shopName) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select shop!'
            });
            setSpinner(false);
        }
        if (products.length == 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please add items to package first!'
            });
            setSpinner(false);
        } else {
            // Handle form submission here
            // Declare the data to be sent to the API
            var Api = Connections.api + Connections.updatepackage + item.id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                shop: shopName,
                shopid: shopId,
                userid: user.id,
                name: name,
                items: JSON.parse(products),
                price: Price,
                expiredate: date
            };

            // Make the API call using fetch()
            fetch(Api, {
                method: 'put',
                headers: headers,
                body: JSON.stringify(Data),
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
                        setPackageSpinner(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setPackageSpinner(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error updating package!'
                    });
                    setPackageSpinner(false);
                });
        }
    };

    const handleAddnewItem = (event) => {
        event.preventDefault();
        setSpinner(true);

        // Handle form submission here
        // Declare the data to be sent to the API
        var Api = Connections.api + Connections.addPackagedItem + item.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        var Data = {
            id: selectedStock.id,
            item_name: selectedStock.item_name,
            item_code: selectedStock.item_code,
            item_sku: selectedStock.stock_unit,
            item_quantity: addedAmount
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
                    message: 'There is error adding new package!'
                });
                setSpinner(false);
            });
    };

    //delete item functions

    const handleTrashClick = (product) => {
        setSelectedStock(product);
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setSelectedStock([]);
        setDialogOpen(false);
    };
    const DeleteItem = () => {
        // Do something with the deleted category
        setSpinner(true);
        var Api = Connections.api + Connections.deletePackagedItem + selectedStock.id;
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
                    message: 'There is error deleting package item!'
                });
                setSpinner(false);
            });
    };

    useEffect(() => {
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

        const getStocks = () => {
            setLoading(true);
            var Api = Connections.api + Connections.getShopStocks + item.shopname;
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
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching items!'
                    });
                    setLoading(false);
                });
        };
        if (user.role === 'Admin') {
            getShops();

            getStocks();
        }

        return () => {};
    }, []);

    useEffect(() => {
        const getPackageItems = () => {
            setLoading(true);
            var Api = Connections.api + Connections.packagedItems + item.id;
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
                        setItems(response.data);
                        setLoading(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error package items!'
                    });
                    setLoading(false);
                });
        };

        if (user.role === 'Admin') {
            getPackageItems();
        }

        return () => {};
    }, [spinner]);
    const DialogHideController = () => {
        setAddItemDialog(false);
    };
    const DialogShowController = () => {
        setAddItemDialog(true);
    };

    //update quantity mini modal
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

    const handleQuantityUpdate = () => {
        // Do something with the deleted category

        if (itemQuantity == 0 || '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Enter new quantity first!'
            });
        } else {
            setSpinner(true);
            var Api = Connections.api + Connections.quantityUpdate + selectedItem.id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            const data = {
                item_quantity: itemQuantity
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'PUT',
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

                        setSpinner(false);
                        handleMenuClose();
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
                        message: 'There is error updating package item!'
                    });
                    setSpinner(false);
                });
        }
    };
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h4">Update Package</Typography>
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
                    <form style={{ marginBottom: '1rem' }} onSubmit={handleSubmit}>
                        <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <TextField
                                    fullwidth
                                    label="Shop"
                                    variant="outlined"
                                    disabled={true}
                                    value={shopName}
                                    defaultValue={shopName}
                                    sx={{ marginTop: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <TextField
                                    fullwidth
                                    required
                                    label="Package name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    sx={{ marginTop: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <TextField
                                    fullwidth
                                    required
                                    label="Package price"
                                    value={Price}
                                    onChange={(event) => setPrice(event.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Typography> ETB </Typography>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ marginTop: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={4} xl={3}>
                                <TextField
                                    fullwidth
                                    required
                                    id="date"
                                    label="Expire date"
                                    type="date"
                                    value={date}
                                    onChange={handleDateChange}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    sx={{ marginTop: 2 }}
                                />
                            </Grid>
                        </Grid>

                        <Box paddingTop={5} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <Button type="submit" variant="text" color="primary" sx={{ paddingX: 1 }}>
                                {packageSpinner ? (
                                    <div className="spinner-border spinner-border-sm text-dark " role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    'Apply Change'
                                )}
                            </Button>
                        </Box>
                    </form>

                    <Grid item xs={12}>
                        <TableContainer component={Paper} sx={{ bgcolor: theme.palette.primary.light, marginY: 3 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item Code</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Sub Category</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>Item SKU</TableCell>
                                        <TableCell>Quantity</TableCell>

                                        <TableCell align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Box
                                                sx={{
                                                    minHeight: 80,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <ActivityIndicators />
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ) : Items.length > 0 ? (
                                    <TableBody>
                                        {Items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.item_code}</TableCell>
                                                <TableCell>{item.item_category}</TableCell>
                                                <TableCell>{item.item_sub_category}</TableCell>
                                                <TableCell>{item.item_brand}</TableCell>
                                                <TableCell>
                                                    <span className="bg-primary bg-opacity-10 text-primary px-4 py-1 rounded">
                                                        {item.item_sku}
                                                    </span>
                                                </TableCell>

                                                <TableCell sx={{ position: 'relative' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {' '}
                                                        <Typography> {item.item_quantity}</Typography>{' '}
                                                        <IconButton
                                                            aria-controls="update quantity"
                                                            aria-haspopup="true"
                                                            onClick={(event) => handleSelectItem(event, item)}
                                                        >
                                                            <IconRefresh
                                                                size={18}
                                                                sx={{ marginLeft: 2, color: theme.palette.warning.dark }}
                                                            />
                                                        </IconButton>
                                                    </Box>

                                                    <Menu
                                                        id="row-menu"
                                                        anchorEl={anchorEl}
                                                        keepMounted
                                                        open={Boolean(anchorEl)}
                                                        onClose={handleMenuClose}
                                                        anchorOrigin={{
                                                            vertical: 'bottom',
                                                            horizontal: 'right'
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right'
                                                        }}
                                                        getContentAnchorEl={null}
                                                        sx={{
                                                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: 'grid',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                paddingX: 2,
                                                                paddingY: 1
                                                            }}
                                                        >
                                                            <Typography variant="h5" sx={{ marginBottom: 1 }}>
                                                                Update Quantity
                                                            </Typography>

                                                            <TextField
                                                                fullwidth
                                                                required
                                                                label="New Quantity"
                                                                value={itemQuantity}
                                                                onChange={(event) => setItemQuantity(event.target.value)}
                                                                sx={{ marginY: 2 }}
                                                            />
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{ paddingX: 1 }}
                                                                onClick={() => handleQuantityUpdate()}
                                                            >
                                                                Apply Change
                                                            </Button>
                                                        </Box>
                                                    </Menu>
                                                </TableCell>

                                                <TableCell sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <IconButton onClick={() => handleTrashClick(item)}>
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                ) : (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ borderBottom: 0 }}>
                                                <Box padding={3}>
                                                    <img src={packages} alt="Add Item" width="40%" height="40%" />
                                                    <Typography variant="h4" color="textSecondary" sx={{ marginY: 4 }}>
                                                        Add Package Item
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>

                        <Box sx={{ display: 'flex' }}>
                            <Button variant="text" color="primary" sx={{ paddingX: 1 }} onClick={() => DialogShowController()}>
                                Add item to package
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
            <DialogBox title="Add new item" openDialog={addItemDialog} handleDialogClose={() => DialogHideController()}>
                <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleAddnewItem}>
                    <Grid container>
                        <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Grid item xs={12} sm={12}>
                                <Typography>{item.item_name}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    disabled={shopId ? false : true}
                                    options={stockData}
                                    getOptionLabel={(option) => `${option.item_name} - ${option.item_brand} - ${option.stock_unit}`}
                                    onChange={(event, value) => {
                                        if (value) {
                                            setSelectedStock(value);
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Select Stock"
                                            variant="outlined"
                                            sx={{ backgroundColor: theme.palette.background.default }}
                                        />
                                    )}
                                    noOptionsText={stockLoader ? <CircularProgress size={20} /> : 'No item in this shop'}
                                />
                            </Grid>

                            {stockLoader && (
                                <Grid item xs={12} sm={6} sx={{ color: '#ffbb00', display: 'flex', alignItems: 'center', paddingLeft: 1 }}>
                                    <CircularProgress size={20} />
                                </Grid>
                            )}
                        </Grid>

                        <Grid container>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    display: 'grid',
                                    alignItems: 'center',
                                    padding: 2,
                                    marginY: 2,
                                    backgroundColor: theme.palette.primary.light,
                                    borderRadius: 2
                                }}
                            >
                                <Typography sx={{ fontSize: theme.typography.h5 }}>
                                    Item Code {selectedStock.item_code && selectedStock.item_code}
                                </Typography>
                                {/* <Typography sx={{ fontSize: theme.typography.h5, marginTop: 2 }}>
                                    Item SKU{' '}
                                    {selectedStock.stock_unit && (
                                        <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 ms-2 rounded">
                                            {selectedStock.stock_unit}
                                        </span>
                                    )}
                                </Typography> */}
                            </Grid>
                        </Grid>

                        <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Grid item xs={12} sm={8}>
                                <TextField
                                    required
                                    fullWidth
                                    type="text"
                                    label="New Quantity"
                                    value={addedAmount}
                                    onChange={(event) => setAddedAmount(event.target.value)}
                                    sx={{ marginTop: 2, backgroundColor: theme.palette.background.default }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ paddingX: 5, paddingY: 1.5, marginTop: 2 }}
                                >
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Add'
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </DialogBox>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Packages</DialogTitle>
                <DialogContent>Do you want to delete {selectedStock ? selectedStock.item_name : ''} ?</DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="error" onClick={() => DeleteItem(selectedStock.id)}>
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
        </MainCard>
    );
};

export default UpdatePackage;
