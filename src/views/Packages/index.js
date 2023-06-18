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
    Select
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Connections from 'api';
import 'react-lazy-load-image-component/src/effects/blur.css';
// ==============================|| PACKAGES PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Packages = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);

    const [searchText, setSearchText] = useState('');
    const [shopFilter, setShopFilter] = useState('Shop');
    const [statusFilter, setStatusFilter] = useState('Status');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [packages, setPackages] = useState([]);

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
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

    const filteredData = packages.filter((product) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(product.name) || searchRegex.test(product.code));
        }

        if (shopFilter !== 'Shop') {
            isMatch = isMatch && product.shopname.includes(shopFilter);
        }

        if (statusFilter !== 'Status') {
            isMatch = isMatch && product.status === statusFilter;
        }

        return isMatch;
    });

    useEffect(() => {
        const getPackages = () => {
            var AdminApi = Connections.api + Connections.viewpackages;
            var saleApi = Connections.api + Connections.viewstorepackage + users.store_name;
            var Api = users.role === 'Admin' ? AdminApi : saleApi;
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
                        setPackages(response.data);
                    } else {
                        setPackages([]);
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

        getPackages();
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
                                    <Typography variant="h3">Packages</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            {users.role === 'Admin' ? (
                                <>
                                    <Button
                                        component={Link}
                                        to="/create-package"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ textDecoration: 'none', marginRight: 2 }}
                                    >
                                        Create Package
                                    </Button>
                                </>
                            ) : null}
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

                        {users.role === 'Admin' && (
                            <FormControl className="ms-2 my-2 ">
                                <Select value={shopFilter} onChange={handleShopFilterChange}>
                                    <MenuItem value="Shop">Shop</MenuItem>
                                    {Array.from(new Set(packages.map((item) => item.shopname))).map((shop) => (
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
                                {Array.from(new Set(packages.map((item) => item.status))).map((status) => (
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
                                        <TableCell>Shop</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Expire Date</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                {paginatedData.length > 0 ? (
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
                                                    <img src={packages} alt="No Packages" width="40%" height="40%" />
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
        var Api = Connections.api + Connections.deletepackage + selectedProduct.id;
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
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.shopname}</TableCell>

                <TableCell>{product.price} Birr</TableCell>
                <TableCell>{product.expiredate}</TableCell>

                <TableCell>
                    {product.status === 'inactive' ? (
                        <Box
                            sx={{
                                bgcolor: theme.palette.error.light,
                                color: theme.palette.error.dark,
                                textTransform: 'capitalize',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 4,
                                textAlign: 'center'
                            }}
                        >
                            {product.status}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                bgcolor: theme.palette.success.light,
                                color: theme.palette.success.dark,
                                textTransform: 'capitalize',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 4,
                                textAlign: 'center'
                            }}
                        >
                            {product.status}
                        </Box>
                    )}
                </TableCell>
                <>
                    <TableCell>
                        {users.role === 'Admin' ? (
                            <>
                                <IconButton
                                    aria-label="Edit row"
                                    size="small"
                                    onClick={() =>
                                        navigate('/update-package', {
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
                                        Items In Package
                                    </Typography>
                                    <Table size="small" aria-label="product details">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Item Name</TableCell>
                                                <TableCell>Item Code</TableCell>

                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Unit</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {JSON.parse(product.items).map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{item.name}</TableCell>
                                                    <TableCell>{item.code}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{item.unit}</TableCell>
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

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Packages</DialogTitle>
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
        name: PropTypes.string.isRequired,
        shopname: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.number.isRequired,
        status: PropTypes.string.isRequired,
        code: PropTypes.string.isRequired,
        unit: PropTypes.string.isRequired,
        shop: PropTypes.string.isRequired
    }).isRequired
};
export default Packages;
