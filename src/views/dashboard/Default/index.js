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
    MenuItem
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import { gridSpacing } from 'store/constant';
import Connections from 'api';
import { useTheme } from '@mui/material/styles';
import AddNew from './components/add-new';
import LowStocks from './components/low-stock';
import CustomerCard from './components/customer-card';
import SalesTargets from './components/sales-against-target';
import { IconX, IconBuildingStore, IconChartInfographic } from '@tabler/icons';
import TargetListing from './components/target-listing';
import { useNavigate } from 'react-router-dom';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Dashboard = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const theme = useTheme();

    const navigate = useNavigate();

    const [shopId, setShopId] = useState(null);
    const [shopName, setShopsName] = useState();
    const [shops, setShops] = useState([]);
    const [revenueTarget, setRevenueTarget] = useState([]);
    const [shopFilter, setShopFilter] = useState('Select Shop');
    const [targetShopFilter, setTargetShopFilter] = useState('Select Shop');
    const [spinner, setSpinner] = useState(false);
    const [lowstock, setLowStock] = useState([]);
    const [totalCustomer, setTotalCustomer] = useState();
    const [todaycustomers, setTodayCustomers] = useState();
    const [openTargetDialog, setOpenTargetDialog] = useState(false);

    const [target, setTarget] = useState({
        daily: '',
        monthly: '',
        annually: ''
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

    const handleTargetClick = () => {
        setOpenTargetDialog(true);
        getShops();
    };

    const handleDialogClose = () => {
        setOpenTargetDialog(false);
    };

    const handleShopSelection = (value) => {
        setShopId(value.id);
        setShopsName(value.name);
    };

    const handleDailyTarget = (event) => {
        // var dailytarget = event.target.value;
        // const numDaysInMonth = getDaysInMonth();

        setTarget({
            ...target,
            daily: event.target.value
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
        } else {
            // Handle form submission here
            // Declare the data to be sent to the API
            var Api = Connections.api + Connections.addtarget;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            var Data = {
                userid: user.id,
                shopid: shopId,
                shopname: shopName,
                r_daily: target.daily,
                r_monthly: target.monthly,
                r_yearly: target.annually
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
                        message: 'There is error setting target!'
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
    const getTargets = (name) => {
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
                    console.log(response.data);
                } else {
                    setRevenueTarget([]);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching targets!'
                });
            });
    };

    const getLowStocks = (name) => {
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
                } else {
                    setLowStock(lowstock);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching low stocks!'
                });
            });
    };

    const getCustomerCount = () => {
        var Api = Connections.api + Connections.customercount;
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
                    setTotalCustomer(response.data.totalcustomers);
                    setTodayCustomers(response.data.todaycustomers);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is an error fetching customers count'
                });
            });
    };
    useEffect(() => {
        user.role === 'Admin' ? (getShops(), getCustomerCount()) : (getTargets(user.store_name), getLowStocks(user.store_name));
    }, [user.role, user.store_name]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Box paddingX={4} paddingY={3}>
                        <Typography className="fs-3 fw-semibold">Dashboard</Typography>
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

                                <SalesTargets targets={revenueTarget} />
                            </Grid>
                            <TargetListing lists={revenueTarget} />
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
                                {shopFilter ? (
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
                            {user.role === 'Admin' && (
                                <>
                                    <CustomerCard total={totalCustomer} addedToday={todaycustomers} />
                                    <AddNew
                                        stockbtn={() => navigate('/add-product')}
                                        packagebtn={() => navigate('/create-package')}
                                        targetbtn={() => handleTargetClick()}
                                    />
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            <Dialog open={openTargetDialog} onClose={handleDialogClose}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.primary.main
                    }}
                >
                    <DialogTitle sx={{ fontSize: theme.typography.h4 }}>Set New Target</DialogTitle>
                    <Button variant="text" color="dark" onClick={handleDialogClose}>
                        <IconX />
                    </Button>
                </Box>

                <Divider />
                <DialogContent>
                    <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleSubmit}>
                        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 500 }}>
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

                            <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    required
                                    type="text"
                                    label="Daily"
                                    value={target.daily}
                                    onChange={(event) => handleDailyTarget(event)}
                                    sx={{ marginTop: 2, marginRight: 1, backgroundColor: theme.palette.background.default }}
                                />
                                <TextField
                                    fullWidth
                                    required
                                    type="text"
                                    label="Monthly"
                                    value={target.monthly}
                                    onChange={(event) => setTarget({ ...target, monthly: event.target.value })}
                                    sx={{ marginTop: 2, marginLeft: 1, backgroundColor: theme.palette.background.default }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    required
                                    type="text"
                                    label="Annually"
                                    value={target.annually}
                                    onChange={(event) => setTarget({ ...target, annually: event.target.value })}
                                    sx={{ marginTop: 2, marginRight: 1, backgroundColor: theme.palette.background.default }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        paddingX: 4,
                                        paddingY: 1.6,

                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.background.default
                                    }}
                                >
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Set'
                                    )}
                                </Button>
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
        </Grid>
    );
};

export default Dashboard;
