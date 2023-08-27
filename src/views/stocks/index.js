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
    Menu,
    MenuItem,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Collapse,
    FormControl,
    FormControlLabel,
    Checkbox,
    Select,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconEdit, IconSearch, IconEye, IconPlus, IconTestPipe, IconArrowsTransferDown, IconX, IconCoins } from '@tabler/icons';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Connections from 'api';
import { useTheme } from '@mui/material/styles';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { ActivityIndicators } from 'ui-component/activityIndicator';
import { DateFormatter } from 'utils/functions';
import { MoreVert } from '@mui/icons-material';
import { stock_status } from 'data/stock_statuses';

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';

// ==============================|| PRODUCT PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ITEM_HEIGHT = 20;
const Stock = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const theme = useTheme();

    const navigate = useNavigate();

    const [shopId, setShopId] = useState(null);
    const [shopName, setShopsName] = useState();
    const [shops, setShops] = useState([]);

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
    const [inputValue, setInputValue] = useState('');
    const [updating, setUpdating] = useState(false);

    const [openUpdatePDialog, setOpenUpdatePDialog] = useState(false);
    const [openReplanishDialog, setOpenReplanishDialog] = useState(false);
    const [stockData, setStockData] = useState([]);
    const [selectedStock, setSelectedStock] = useState([]);
    const [addedAmount, setAddedAmount] = useState();
    const [spinner, setSpinner] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stockLoader, setStockLoader] = useState(false);
    const [checked, setChecked] = useState(false);

    const [selectedRows, setSelectedRows] = useState([]);
    const [exportExcel, setexportExcel] = useState(null);

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
        setexportExcel(null);
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

    const filteredData = productData.filter((stock) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(stock.item_name) || searchRegex.test(stock.item_code));
        }

        if (categoryFilter !== 'Category') {
            isMatch = isMatch && stock.item_category === categoryFilter;
        }
        if (subCategoryFilter !== 'Sub Category') {
            isMatch = isMatch && stock.item_sub_category === subCategoryFilter;
        }
        if (brandFilter !== 'Brand') {
            isMatch = isMatch && stock.item_brand === brandFilter;
        }

        if (shopFilter !== 'Shop') {
            isMatch = isMatch && stock.stock_shop.includes(shopFilter);
        }

        if (statusFilter !== 'Status') {
            isMatch = isMatch && stock.stock_status === statusFilter;
        }

        return isMatch;
    });

    // Stock Item Replanishment related codes

    const handleShopSelection = (value) => {
        setShopId(value.id);
        setShopsName(value.name);
        setSelectedStock([]);
        getShopStock(value.name);
    };

    const getShopStock = (shop) => {
        setStockLoader(true);
        var Api = Connections.api + Connections.getShopStocks + shop;
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
                    setStockLoader(false);
                } else {
                    setStockData([]);
                    setStockLoader(false);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching product!'
                });
                setStockLoader(false);
            });
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
        const getStocks = () => {
            setLoading(true);
            var AdminApi = Connections.api + Connections.stocks + `?page=${page}&limit=${rowsPerPage}`;
            var saleApi = Connections.api + Connections.shopStocks + users.store_name + `?page=${page}&limit=${rowsPerPage}`;
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

        getStocks();
        return () => {};
    }, [page, rowsPerPage]);

    //price update dialog functions
    const handleUpdatePriceClick = () => {
        setOpenUpdatePDialog(true);
        getShops();
    };

    const handleUpdateDialogClose = () => {
        setOpenUpdatePDialog(false);
        setShopId(null);
        setShopsName(null);
        setSelectedStock([]);
        setInputValue(null);
        setChecked(false);
        setSpinner(false);
    };

    const handleCheckboxChange = (event) => {
        setChecked(event.target.checked);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handlePUSubmit = (event) => {
        event.preventDefault();

        if (inputValue === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please enter the new price'
            });
        } else if (shopId == null && shopName == null) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select shop'
            });
        } else if (selectedStock.length == 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select stock item first'
            });
        } else {
            setUpdating(true);
            var singleItem = Connections.api + Connections.updateprice;
            var allItems = Connections.api + Connections.updateallprice;
            var Api = checked ? allItems : singleItem;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var data = {
                productid: selectedStock.id,
                productcode: selectedStock.item_code,
                name: selectedStock.stock_shop,
                from: selectedStock.stock_price,
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
                        handleUpdateDialogClose();
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
    //Replanish dialog functions
    const handleReplanishClick = () => {
        setOpenReplanishDialog(true);
        getShops();
    };

    const handleDialogClose = () => {
        setOpenReplanishDialog(false);
        setShopId(null);
        setShopsName(null);
        setSelectedStock([]);
        setAddedAmount(null);
        setSpinner(false);
    };
    const handleReplanishSubmit = (event) => {
        event.preventDefault();

        if (shopId == null && shopName == null) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select shop'
            });
        } else if (selectedStock.length == 0) {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select stock first!'
            });
        } else if (addedAmount == '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please enter the amount to be added!'
            });
        } else {
            // Handle form submission here
            // Declare the data to be sent to the API

            setSpinner(true);

            var Api = Connections.api + Connections.newreplanishment;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                shopid: shopId,
                shopname: shopName,
                stock_id: selectedStock.id,
                stock_name: selectedStock.item_name,
                stock_code: selectedStock.item_code,
                existing_amount: selectedStock.stock_quantity,
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
                        message: 'There is error replanishing stock item!'
                    });
                    setSpinner(false);
                });
        }
    };

    const expand = Boolean(exportExcel);
    const handleClick = (event) => {
        setexportExcel(event.currentTarget);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            setSelectedRows(filteredData.map((sale) => sale.id));
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

    const csvData =
        selectedRows.length > 0
            ? selectedRows.map((id) => {
                  const item = filteredData.find((item) => item.id === id);
                  return {
                      shop: item.stock_shop,
                      item_name: item.item_name,
                      item_code: item.item_code,
                      category: item.item_category,
                      sub_category: item.item_sub_category,
                      brand: item.item_brand,
                      SKU: item.stock_unit,
                      item_min_quantity: item.stock_min_quantity,
                      item_quantity: item.stock_quantity,
                      item_cost: item.stock_cost,
                      item_price: item.stock_price,
                      item_expire_date: item.stock_expire_date,
                      item_status: item.stock_status
                  };
              })
            : filteredData.map((item) => ({
                  shop: item.stock_shop,
                  item_name: item.item_name,
                  item_code: item.item_code,
                  category: item.item_category,
                  sub_category: item.item_sub_category,
                  brand: item.item_brand,
                  SKU: item.stock_unit,
                  item_min_quantity: item.stock_min_quantity,
                  item_quantity: item.stock_quantity,
                  item_cost: item.stock_cost,
                  item_price: item.stock_price,
                  item_expire_date: item.stock_expire_date,
                  item_status: item.stock_status
              }));

    const handleDownloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'stocks');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        const fileData = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });
        saveAs(fileData, 'stocks.xlsx');
    };
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    {users.role === 'Admin' ? (
                                        <Typography variant="h3">Manage Stocks</Typography>
                                    ) : (
                                        <Typography variant="h3">Stocks Items</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {users.role === 'Admin' && (
                    <Grid container spacing={0} paddingX={4} paddingTop={5}>
                        <Grid item xs={12} sm={6} md={3} lg={3} xl={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                onClick={() => navigate('/add-stock')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    backgroundColor: theme.palette.primary.light,
                                    borderRadius: 2,
                                    padding: 2,
                                    paddingX: 3,
                                    margin: 1
                                }}
                            >
                                <IconPlus />
                                <Typography variant="h4">Create Item</Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
                            <Button
                                onClick={() => handleUpdatePriceClick()}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    backgroundColor: theme.palette.primary.light,
                                    borderRadius: 2,
                                    padding: 2,
                                    paddingX: 3,
                                    margin: 1
                                }}
                            >
                                <IconCoins />
                                <Typography variant="h4">Update Price</Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
                            <Button
                                onClick={() => handleReplanishClick()}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    backgroundColor: theme.palette.primary.light,
                                    borderRadius: 2,
                                    padding: 2,
                                    paddingX: 3,
                                    margin: 1
                                }}
                            >
                                <IconTestPipe />
                                <Typography variant="h4">Replenish</Typography>
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} lg={3} xl={2}>
                            <Button
                                onClick={() => navigate('/make-transfer')}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    backgroundColor: theme.palette.primary.light,
                                    borderRadius: 2,
                                    padding: 2,
                                    paddingX: 3,
                                    margin: 1
                                }}
                            >
                                <IconArrowsTransferDown />
                                <Typography variant="h4">Transfer</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box paddingX="2" className="shadow-1  rounded ">
                        <Grid
                            item
                            xs={12}
                            sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <Box>
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
                                            {Array.from(new Set(productData.map((stock) => stock.stock_shop))).map((shop) => (
                                                <MenuItem key={shop} value={shop}>
                                                    {shop}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                <FormControl className="ms-2 mt-2 ">
                                    <Select value={categoryFilter} onChange={handleCategoryFilterChange}>
                                        <MenuItem value="Category">Category</MenuItem>
                                        {Array.from(new Set(productData.map((stock) => stock.item_category))).map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className="ms-2 mt-2 ">
                                    <Select value={subCategoryFilter} onChange={handleSubCategoryFilterChange}>
                                        <MenuItem value="Sub Category">Sub Category</MenuItem>
                                        {Array.from(new Set(productData.map((stock) => stock.item_sub_category))).map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className="ms-2 mt-2 ">
                                    <Select value={brandFilter} onChange={handleBrandFilterChange}>
                                        <MenuItem value="Brand">Brand</MenuItem>
                                        {Array.from(new Set(productData.map((stock) => stock.item_brand))).map((brand) => (
                                            <MenuItem key={brand} value={brand}>
                                                {brand}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl className="ms-2 my-2 ">
                                    <Select value={statusFilter} onChange={handleStatusFilterChange}>
                                        <MenuItem value="Status">Status</MenuItem>
                                        {Array.from(new Set(productData.map((stock) => stock.stock_status))).map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
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
                                anchorEl={exportExcel}
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
                                    <CSVLink data={csvData} filename={'stocks.csv'} className="text-decoration-none text-dark">
                                        Export CSV
                                    </CSVLink>
                                </MenuItem>
                            </Menu>
                        </Grid>

                        <TableContainer component={Paper} className="shadow-sm">
                            <Table aria-label="product table">
                                <TableHead className="bg-light">
                                    <TableRow>
                                        <TableCell>
                                            <Checkbox
                                                indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                                                checked={selectedRows.length === filteredData.length}
                                                onChange={handleSelectAllClick}
                                            />
                                        </TableCell>
                                        <TableCell>Item name</TableCell>
                                        <TableCell>Item code</TableCell>
                                        <TableCell>Shop</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>SKU</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Quantity</TableCell>

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
                                    ) : (
                                        filteredData.map((stock, index) => (
                                            <ProductRow key={index} product={stock} onPress={(event) => handleRowClick(event, stock.id)}>
                                                <Checkbox checked={selectedRows.indexOf(stock.id) !== -1} />
                                            </ProductRow>
                                        ))
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

            <Dialog open={openUpdatePDialog} onClose={handleUpdateDialogClose}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.primary.main
                    }}
                >
                    <DialogTitle sx={{ fontSize: theme.typography.h4, color: theme.palette.background.default }}>Update Price</DialogTitle>
                    <IconButton variant="text" color="dark" onClick={handleUpdateDialogClose} sx={{ marginRight: 1 }}>
                        <IconX />
                    </IconButton>
                </Box>

                <Divider />
                <DialogContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handlePUSubmit}>
                            <Grid container>
                                <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Grid item xs={12} sm={8}>
                                        <Autocomplete
                                            required
                                            disabled={checked ? true : false}
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
                                    <Grid
                                        item
                                        xs={12}
                                        sm={3}
                                        sx={{
                                            backgroundColor: theme.palette.primary.light,
                                            borderRadius: 2,
                                            borderWidth: 1
                                        }}
                                    >
                                        <FormControlLabel
                                            label="Apply to all"
                                            control={
                                                <Checkbox
                                                    checked={checked}
                                                    onChange={handleCheckboxChange}
                                                    name="checked"
                                                    color="primary"
                                                />
                                            }
                                            className="my-1 ms-2 "
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <Autocomplete
                                            required
                                            key={stockData.id}
                                            options={stockData}
                                            getOptionLabel={(option) => option.item_name}
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
                                            noOptionsText={stockLoader ? <CircularProgress size={20} /> : 'No item in this shop'}
                                        />
                                    </Grid>

                                    {stockLoader && (
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
                                        <Typography sx={{ fontSize: theme.typography.h5 }}>Current price</Typography>
                                        <Typography sx={{ fontSize: theme.typography.h4 }}>{selectedStock.stock_price} ETB</Typography>
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginTop: 1
                                    }}
                                >
                                    <Grid item xs={12} sm={8}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="New Price"
                                            variant="outlined"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{ paddingX: 5, paddingY: 1.5 }}
                                        >
                                            {updating ? (
                                                <div className="spinner-border spinner-border-sm text-dark " role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                'Apply'
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </DialogContent>
            </Dialog>

            <Dialog open={openReplanishDialog} onClose={handleDialogClose}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.primary.main
                    }}
                >
                    <DialogTitle sx={{ fontSize: theme.typography.h4, color: theme.palette.background.default }}>
                        Replenish Stock
                    </DialogTitle>

                    <IconButton variant="text" color="dark" onClick={handleDialogClose} sx={{ marginRight: 1 }}>
                        <IconX />
                    </IconButton>
                </Box>

                <Divider />
                <DialogContent>
                    <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleReplanishSubmit}>
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
                                        getOptionLabel={(option) => option.item_name}
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
                                        noOptionsText={stockLoader ? <CircularProgress size={20} /> : 'No item in this shop'}
                                    />
                                </Grid>

                                {stockLoader && (
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
                                        {selectedStock.stock_quantity} - {selectedStock.stock_unit}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        required
                                        fullWidth
                                        type="text"
                                        label="New Amount"
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

const ProductRow = ({ product, onPress, children }) => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const navigate = useNavigate();

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

    // const handleTrashClick = (product) => {
    //     setSelectedProduct(product);
    //     setDialogOpen(true);
    // };
    // const handleDialogClose = () => {
    //     setSelectedProduct(null);
    //     setDialogOpen(false);
    // };

    // const Delete = () => {
    //     // Do something with the deleted category
    //     setSpinner(true);
    //     var Api = Connections.api + Connections.deleteStocks + selectedProduct.id;
    //     var headers = {
    //         accept: 'application/json',
    //         'Content-Type': 'application/json'
    //     };

    //     // Make the API call using fetch()
    //     fetch(Api, {
    //         method: 'DELETE',
    //         headers: headers,
    //         cache: 'no-cache'
    //     })
    //         .then((response) => response.json())
    //         .then((response) => {
    //             if (response.success) {
    //                 setPopup({
    //                     ...popup,
    //                     status: true,
    //                     severity: 'success',
    //                     message: response.message
    //                 });

    //                 setSpinner(false);
    //                 handleDialogClose();
    //             } else {
    //                 setPopup({
    //                     ...popup,
    //                     status: true,
    //                     severity: 'error',
    //                     message: response.message
    //                 });
    //                 setSpinner(false);
    //             }
    //         })
    //         .catch(() => {
    //             setPopup({
    //                 ...popup,
    //                 status: true,
    //                 severity: 'error',
    //                 message: 'There is error deleting product!'
    //             });
    //             setSpinner(false);
    //         });
    // };

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSelectItem = (event) => {
        handleMenuClick(event);
    };

    const handleStatusChange = (status, id) => {
        var Api = Connections.api + Connections.updateStockStatus + id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };
        const data = {
            stock_status: status
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
                    setAnchorEl(null);
                } else {
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
                    message: 'There is error updating stock status!'
                });
            });
    };
    return (
        <>
            <TableRow
                hover
                className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary rounded' : 'border-0 rounded'}
                onClick={onPress}
            >
                <TableCell>
                    {children}
                    <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {product.item_name}
                </TableCell>
                <TableCell>{product.item_code}</TableCell>
                <TableCell>{product.stock_shop}</TableCell>
                <TableCell>{product.item_category}</TableCell>
                <TableCell>{product.item_brand}</TableCell>
                <TableCell>
                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">{product.stock_unit}</span>
                </TableCell>
                <TableCell>{product.stock_price} Birr</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>

                <TableCell sx={{ textTransform: 'capitalize' }}>
                    <span
                        className={
                            product.stock_status === 'In-Stock'
                                ? 'bg-success bg-opacity-10 text-success px-2 py-1 rounded'
                                : product.stock_status === 'Out-Of-Stock'
                                ? 'bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded'
                                : product.stock_status === 'Hold'
                                ? 'bg-info bg-opacity-10 text-info px-2 py-1 rounded'
                                : 'bg-danger bg-opacity-10 text-danger px-2 py-1 rounded'
                        }
                    >
                        {product.stock_status}
                    </span>
                </TableCell>
                <>
                    <TableCell>
                        <IconButton
                            aria-label="Edit row"
                            size="small"
                            onClick={() =>
                                navigate('/view-stock', {
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
                                        navigate('/update-stock', {
                                            state: { ...product }
                                        })
                                    }
                                >
                                    <IconEdit />
                                </IconButton>

                                <IconButton
                                    aria-controls="row-menu"
                                    aria-haspopup="true"
                                    onClick={(event) => handleSelectItem(event, product)}
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
                                    {stock_status
                                        .filter((item) => item.label !== product.stock_status)
                                        .map((item) => (
                                            <MenuItem key={item.id} onClick={() => handleStatusChange(item.label, product.id)}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                </Menu>
                            </>
                        )}
                    </TableCell>
                </>
            </TableRow>
            <TableRow className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-secondary' : 'border-0'}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Grid container>
                            <Grid item xs={12} md={12}>
                                <Box margin={1}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Item detail
                                    </Typography>
                                    <Table size="small" aria-label="product details">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Min Quantity</TableCell>
                                                <TableCell>{product.stock_min_quantity}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Cost</TableCell>
                                                <TableCell>{product.stock_cost ? product.stock_cost : 0} Birr</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>Expire date</TableCell>
                                                <TableCell>{DateFormatter(product.stock_expire_date)}</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>Created at</TableCell>
                                                <TableCell>{DateFormatter(product.created_at)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Grid>
                        </Grid>
                    </Collapse>
                </TableCell>
            </TableRow>

            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </>
    );
};

ProductRow.propTypes = {
    product: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
    children: PropTypes.node
};
export default Stock;
