import { useEffect, useState, forwardRef } from 'react';
import './DonutChart.css';
// material-ui
import {
    Grid,
    Typography,
    Box,
    Divider,
    Button,
    TextField,
    FormControl,
    Select,
    Menu,
    MenuItem,
    ButtonGroup,
    IconButton
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import { gridSpacing } from 'store/constant';
import Connections from 'api';
import { useTheme } from '@mui/material/styles';
import LowStocks from './components/low-stock';
import SalesTargets from './components/sales-against-target';
import { IconBuildingStore, IconChartInfographic, IconDotsVertical, IconFilter } from '@tabler/icons';
import TargetListing from './components/target-listing';
import { useNavigate } from 'react-router-dom';
import { Preferences } from 'preferences';
import { ActivityIndicators } from 'ui-component/activityIndicator';
import EachShops from './components/eachShops';

//import extraction packages
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { formatDate } from 'utils/functions';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ITEM_HEIGHT = 20;

const Dashboard = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);

    const theme = useTheme();
    const navigate = useNavigate();

    const defaultShop = Preferences.defaultshop;

    const [shops, setShops] = useState([]);
    const [lowstock, setLowStock] = useState([]);
    const [revenueTarget, setRevenueTarget] = useState([]);
    const [eachShopsAchievement, setEachShopsAchievement] = useState([]);
    const [Category, setCategory] = useState([]);
    const [soldItemExport, setSolItemExport] = useState([]);

    const [shopFilter, setShopFilter] = useState('Select Shop');
    const [targetShopFilter, setTargetShopFilter] = useState('Select Shop');
    const [targetLoader, setTargetLoader] = useState(true);
    const [eachLoader, setEachLoader] = useState(false);
    const [selectedButton, setSelectedButton] = useState('daily');

    const [filter, setFilter] = useState(false);
    const [shop, setShop] = useState('All');
    const [startingFrom, setStartingFrom] = useState('');
    const [to, setTo] = useState('');
    const [TotalSales, setTotalSales] = useState(0);

    const [loading, setLoading] = useState(true);
    const [categoryLoader, setCategoryLoader] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [exportExcel, setexportExcel] = useState(null);

    const [popup, setPopup] = useState({
        status: false,
        severity: 'info',
        message: ''
    });

    const handleTargetShopFilter = (event) => {
        if (event.target.value !== 'Select Shop') {
            setTargetShopFilter(event.target.value);
            getTargets(event.target.value);
        }
    };

    const handleCategoryShop = (event) => {
        setShop(event.target.value);
    };

    //low stock shop drop down filter
    const handleShopFilterChange = (event) => {
        if (event.target.value !== 'Select Shop') {
            setShopFilter(event.target.value);
            getLowStocks(event.target.value);
        }
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });

        setFilter(false);
        setexportExcel(null);
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
                    setShopFilter(response.data[defaultShop].name);
                    setTargetShopFilter(response.data[defaultShop].name);
                    getLowStocks(response.data[defaultShop].name);
                    getTargets(response.data[defaultShop].name);
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

    const getTargets = (name) => {
        setTargetLoader(true);
        var Api = Connections.api + Connections.againsttarget + name;
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
                    setRevenueTarget(response.data);
                    setTargetLoader(false);
                } else {
                    setTargetLoader(false);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching targets!'
                });
                setTargetLoader(false);
            });
    };

    const periods = [
        { id: 1, name: 'daily' },
        { id: 2, name: 'monthly' },
        { id: 3, name: 'annual' }
    ];

    const handlePeriodFilter = (option) => {
        setSelectedButton(option);
        getEachAchievement(option);
    };

    const getEachAchievement = (period) => {
        setEachLoader(true);
        var Api = Connections.api + Connections.eachShops + `?period=${period}`;
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
                    setEachShopsAchievement(response.data);
                    setEachLoader(false);
                } else {
                    setEachLoader(false);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error getting each shop achievement!'
                });
                setEachLoader(false);
            });
    };

    const getLowStocks = (name) => {
        setLoading(true);
        var Api = Connections.api + Connections.lowstock + name;
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
                    setLowStock(response.data);
                    setLoading(false);
                } else {
                    setLowStock(lowstock);
                    setLoading(false);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching low stocks!'
                });
                setLoading(false);
            });
    };

    //sales filtering panel submission handler
    const FilterSales = async () => {
        setFilter(false);
        setCategoryLoader(true);
        var Api = Connections.api + Connections.filterSoldItem + `?shop=${shop}&startingfrom=${startingFrom}&to=${to}`;

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
                    setCategory(response.data);
                    setCategoryLoader(false);
                    const totalSales = response.data.reduce((total, item) => total + parseFloat(item.sum), 0);
                    setTotalSales(totalSales);
                }
            })
            .catch(() => {
                setCategoryLoader(false);
            });
    };

    //export sales filtered sales
    const expand = Boolean(exportExcel);
    const handleClick = (event) => {
        setexportExcel(event.currentTarget);
    };

    const ExportSoldItems = async () => {
        setFilter(false);
        setExporting(true);
        var Api = Connections.api + Connections.ExportSoldItems + `?shop=${shop}&startingfrom=${startingFrom}&to=${to}`;

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
                    setSolItemExport(response.data);
                    setExporting(false);
                }
            })
            .catch(() => {
                setExporting(false);
            });
    };

    const csvData = soldItemExport.map((item) => ({
        Shop: item.stock_shop,
        Month: formatDate(item.created_at).monthName,
        Date: formatDate(item.created_at).formattedDate,
        Item: item.item_name,
        Code: item.item_code,
        Category: item.item_category,
        Brand: item.item_brand,
        UOM: item.item_unit,
        SKU: item.item_sku,
        Count: item.quantity,
        Price: item.price
    }));

    const handleExtractExcel = async () => {
        const worksheet = XLSX.utils.json_to_sheet(csvData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'soldItem');
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });
        const fileData = new Blob([excelBuffer], {
            type: 'application/octet-stream'
        });
        saveAs(fileData, 'soldItem.xlsx');
    };

    const handleDownloadExcel = async () => {
        try {
            await ExportSoldItems(); // Fetch data from the database

            // Check if data is fetched successfully
            if (soldItemExport.length > 0) {
                await handleExtractExcel(); // Prepare and download the Excel file
            } else {
                // Handle case when no data is fetched

                setPopup({
                    ...popup,
                    status: true,
                    severity: 'warning',
                    message: 'Press Again'
                });
            }
        } catch (error) {
            // Handle any errors that occur during the process

            setPopup({
                ...popup,
                status: true,
                severity: 'warning',
                message: `Error fetching data or preparing Excel file, ${error}`
            });
        }
    };

    useEffect(() => {
        user.role === 'Admin' ? getShops() : (getTargets(user.store_name), getLowStocks(user.store_name));
    }, [user.role, user.store_name]);

    useEffect(() => {
        getEachAchievement(selectedButton);
        return () => {};
    }, []);

    useEffect(() => {
        const categoryCard = async () => {
            await FilterSales();
        };
        const totalSales = Category.reduce((total, item) => total + parseFloat(item.sum), 0);
        setTotalSales(totalSales);
        categoryCard();
        return () => {};
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Box paddingX={4} paddingY={3}>
                        <Typography variant="h3" className=" fw-semibold">
                            Home
                        </Typography>
                    </Box>
                    <Grid container className="mx-2" justifyContent="space-between" alignItems="start">
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={8.6}
                            xl={8.6}
                            sx={{ borderRadius: 2, padding: 1, paddingLeft: 2, paddingTop: 0 }}
                        >
                            <Grid
                                item
                                xs={12}
                                sx={{ padding: 2, borderRadius: 3, marginBottom: 1, backgroundColor: theme.palette.background.default }}
                            >
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: 1
                                    }}
                                >
                                    <IconChartInfographic size={32} color={theme.palette.primary.dark} />
                                    {user.role === 'Admin' ? (
                                        <FormControl>
                                            <Select
                                                value={targetShopFilter}
                                                onChange={handleTargetShopFilter}
                                                sx={{ backgroundColor: theme.palette.background.default }}
                                            >
                                                <MenuItem value="Select Shop">Select Shop</MenuItem>
                                                <MenuItem value="All">All</MenuItem>
                                                {Array.from(new Set(shops.map((item) => item.name))).map((shop) => (
                                                    <MenuItem
                                                        key={shop}
                                                        value={shop}
                                                        sx={{ backgroundColor: theme.palette.background.default }}
                                                    >
                                                        {shop}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Typography sx={{ fontSize: theme.typography.h5, marginRight: 2 }}>{user.store_name}</Typography>
                                    )}
                                </Box>
                                {targetLoader ? (
                                    <Box sx={{ minHeight: 188, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicators />
                                    </Box>
                                ) : (
                                    <SalesTargets targets={revenueTarget} />
                                )}
                            </Grid>
                            {user.role === 'Sales' && revenueTarget.target && (
                                <TargetListing lists={revenueTarget} shopname={user.store_name} />
                            )}

                            {user.role === 'Admin' && (
                                <EachShops lists={eachShopsAchievement} loading={eachLoader} period={selectedButton}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 1 }}>
                                        <ButtonGroup variant="outlined" aria-label="outlined primary button group">
                                            {periods.map((button) => (
                                                <Button
                                                    key={button.id}
                                                    sx={{
                                                        backgroundColor: selectedButton === button.name ? theme.palette.primary.main : null,
                                                        color:
                                                            selectedButton === button.name
                                                                ? theme.palette.background.default
                                                                : theme.palette.primary.main,
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.primary.main,
                                                            color: theme.palette.background.default
                                                        }
                                                    }}
                                                    onClick={() => handlePeriodFilter(button.name)}
                                                >
                                                    {button.name}
                                                </Button>
                                            ))}
                                        </ButtonGroup>
                                    </Box>{' '}
                                </EachShops>
                            )}
                        </Grid>

                        <Grid item xs={12} sm={12} md={12} lg={3.4} xl={3.4} sx={{ borderRadius: 2, padding: 1, paddingTop: 0 }}>
                            <Box
                                sx={{
                                    backgroundColor: theme.palette.background.default,
                                    borderRadius: 2,
                                    paddingY: 1
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 1.5 }}>
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h4,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark,
                                            marginLeft: 1
                                        }}
                                    >
                                        Low Stocks
                                    </Typography>

                                    {user.role === 'Admin' ? (
                                        <FormControl>
                                            <Select value={shopFilter} onChange={handleShopFilterChange}>
                                                <MenuItem value="Select Shop">Select Shop</MenuItem>

                                                {Array.from(new Set(shops.map((item) => item.name))).map((shop) => (
                                                    <MenuItem key={shop} value={shop}>
                                                        {shop}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <Typography sx={{ fontSize: theme.typography.h5, marginRight: 2 }}>{user.store_name}</Typography>
                                    )}
                                </Box>
                                <Divider />
                                {loading ? (
                                    <Box sx={{ minHeight: 205, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicators />
                                    </Box>
                                ) : shopFilter ? (
                                    <LowStocks stocks={lowstock} />
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: 6
                                        }}
                                    >
                                        <IconBuildingStore size={48} color={theme.palette.primary.main} />
                                        <Typography marginTop={1}>First select store to check</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        lg={4}
                        xl={4}
                        sx={{ backgroundColor: theme.palette.background.default, paddingY: 1, borderRadius: 2 }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingY: 0.5,
                                paddingX: 1
                            }}
                        >
                            <Typography variant="subtitle1">Categories</Typography>{' '}
                            <Box sx={{ position: 'relative' }}>
                                <IconButton onClick={() => setFilter(!filter)}>
                                    <IconFilter size={20} />
                                </IconButton>

                                {filter && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 40,
                                            right: 2,
                                            backgroundColor: theme.palette.background.default,
                                            borderRadius: 2,
                                            padding: 2,
                                            boxShadow: 1,
                                            flexWrap: 'wrap',
                                            minWidth: 360
                                        }}
                                    >
                                        <Typography>Shop</Typography>

                                        <FormControl>
                                            <Select
                                                value={shop}
                                                onChange={handleCategoryShop}
                                                sx={{ backgroundColor: theme.palette.background.default, marginY: 1 }}
                                            >
                                                <MenuItem value="All">All</MenuItem>
                                                {Array.from(new Set(shops.map((item) => item.name))).map((shop) => (
                                                    <MenuItem
                                                        key={shop}
                                                        value={shop}
                                                        sx={{ backgroundColor: theme.palette.background.default }}
                                                    >
                                                        {shop}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box sx={{ marginY: 1.5 }}>
                                            <Typography>Starting from</Typography>
                                            <TextField
                                                fullWidth
                                                type="date"
                                                value={startingFrom}
                                                onChange={(event) => setStartingFrom(event.target.value)}
                                            />
                                        </Box>
                                        <Box sx={{ marginY: 1.5 }}>
                                            <Typography>To</Typography>
                                            <TextField fullWidth type="date" value={to} onChange={(event) => setTo(event.target.value)} />
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginY: 1 }}>
                                            <Button variant="text" onClick={() => FilterSales()}>
                                                Done
                                            </Button>
                                        </Box>
                                    </Box>
                                )}

                                {Category.length > 0 && (
                                    <IconButton
                                        aria-label="more"
                                        id="long-button"
                                        aria-controls={expand ? 'long-menu' : undefined}
                                        aria-expanded={expand ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={handleClick}
                                    >
                                        <IconDotsVertical size={20} />
                                    </IconButton>
                                )}

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
                                    <MenuItem onClick={handleDownloadExcel} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography> Export Excel </Typography>
                                        {exporting && <ActivityIndicators size={16} />}{' '}
                                    </MenuItem>
                                    <MenuItem>
                                        <CSVLink data={csvData} filename={'SoldItems.csv'} className="text-decoration-none text-dark">
                                            Export CSV
                                        </CSVLink>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>
                        <Divider />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                padding: 1,
                                paddingY: 1.4,
                                marginBottom: 2,
                                boxShadow: 0.2,
                                backgroundColor: theme.palette.warning.dark
                            }}
                        >
                            <Typography>{shop}</Typography>

                            {startingFrom && <Typography>{startingFrom} </Typography>}
                            {to && <Typography>{to}</Typography>}
                        </Box>
                        <Box>
                            {categoryLoader ? (
                                <Box sx={{ minHeight: 205, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicators />
                                </Box>
                            ) : (
                                <>
                                    <Box sx={{ paddingX: 1 }}>
                                        {Category.length < 1 ? (
                                            <Box sx={{ minHeight: 205, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <Typography>There is no record of sold item!</Typography>
                                            </Box>
                                        ) : (
                                            Category.length > 0 &&
                                            Category.map((item, index) => (
                                                <Box
                                                    key={index}
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        padding: 1.4
                                                    }}
                                                >
                                                    <Typography>{item.category}</Typography>
                                                    <Typography>{item.sum.toLocaleString()}</Typography>
                                                </Box>
                                            ))
                                        )}
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            marginRight: 2,
                                            paddingY: 2
                                        }}
                                    >
                                        {Category.length > 0 && (
                                            <Typography variant="h4">Total {TotalSales ? TotalSales.toLocaleString() : 0}</Typography>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default Dashboard;
