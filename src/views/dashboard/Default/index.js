import { useEffect, useState, forwardRef } from 'react';
import './DonutChart.css';
// material-ui
import {
    Grid,
    Typography,
    Box,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Autocomplete,
    TextField,
    FormControl,
    Select,
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
import { IconX, IconBuildingStore, IconChartInfographic, IconSearch, IconFilter, IconDots, IconDotsVertical } from '@tabler/icons';
import TargetListing from './components/target-listing';
import { useNavigate } from 'react-router-dom';
import { Preferences } from 'preferences';
import { ActivityIndicators } from 'ui-component/activityIndicator';
import EachShops from './components/eachShops';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
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

    const [shopFilter, setShopFilter] = useState('Select Shop');
    const [targetShopFilter, setTargetShopFilter] = useState('Select Shop');
    const [targetLoader, setTargetLoader] = useState(true);
    const [eachLoader, setEachLoader] = useState(false);
    const [selectedButton, setSelectedButton] = useState('daily');

    const [filter, setFilter] = useState(false);
    const [shop, setShop] = useState('All');
    const [startingFrom, setStartingFrom] = useState();
    const [to, setTo] = useState();

    const [loading, setLoading] = useState(true);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
        pageCount: 0,
        pageStartIndex: 0,
        pageEndIndex: 0
    });

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
        if (event.target.value !== 'All') {
            setShop(event.target.value);
        }
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

    function getCategorySum(data) {
        const categorySum = {};

        data.forEach((item) => {
            const { item_category, price } = item;

            if (categorySum[item_category]) {
                categorySum[item_category] += parseFloat(price);
            } else {
                categorySum[item_category] = parseFloat(price);
            }
        });

        const result = Object.entries(categorySum).map(([category, sum]) => ({
            category,
            sum
        }));

        return result;
    }

    // Usage example
    const categorySumArray = getCategorySum(Category);

    useEffect(() => {
        user.role === 'Admin' ? getShops() : (getTargets(user.store_name), getLowStocks(user.store_name));
    }, [user.role, user.store_name]);

    useEffect(() => {
        getEachAchievement(selectedButton);
        return () => {};
    }, []);

    useEffect(() => {
        const getSoldItems = () => {
            var Api =
                Connections.api +
                Connections.getSoldItem +
                `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&shop=${shopFilter}`;

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
                        setCategory(response.data.data);
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        };
        getSoldItems();
        return () => {};
    }, [paginationModel, shopFilter]);
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
                                paddingX: 2
                            }}
                        >
                            <Typography variant="subtitle1">Categories</Typography>{' '}
                            <Box sx={{ position: 'relative' }}>
                                <IconButton onClick={() => setFilter(!filter)}>
                                    <IconFilter />
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
                                        <Typography variant="subtitle1">Filter</Typography>

                                        <FormControl>
                                            <Select
                                                value={shop}
                                                onChange={handleCategoryShop}
                                                sx={{ backgroundColor: theme.palette.background.default, marginY: 1 }}
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
                                            <Button variant="text">Done</Button>{' '}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Divider />
                        <Box sx={{ paddingX: 1 }}>
                            {categorySumArray.map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 1 }}
                                >
                                    <Typography>{item.category}</Typography>
                                    <Typography>{item.sum}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box></Box>
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
