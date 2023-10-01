import React, { useState, useEffect } from 'react';
// material-ui
import {
    Grid,
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    MenuItem,
    FormControl,
    Select,
    Dialog,
    DialogTitle,
    DialogContent,
    Divider,
    Autocomplete,
    TextField,
    useTheme
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import Connections from 'api';
import ShopMap from './maps';
import { ActivityIndicators } from 'ui-component/activityIndicator';
import ShopTable from './components/tabular';
import { IconX } from '@tabler/icons';

// ==============================|| SHOP LISTING PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Shops = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const navigate = useNavigate();
    const theme = useTheme();

    const [shops, setShops] = useState([]);
    const [category, setCategory] = useState('Category');
    const [region, setRegion] = useState('Region');
    const [city, setCity] = useState('City');
    const [subcity, setSubsCity] = useState('Subcity');
    const [loading, setLoading] = useState(true);
    const [openTargetDialog, setOpenTargetDialog] = useState(false);
    const [shopId, setShopId] = useState(null);
    const [shopName, setShopsName] = useState();
    const [spinner, setSpinner] = useState(false);
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

    const [value, setValue] = React.useState('1');

    const handleDialogClose = () => {
        setOpenTargetDialog(false);
    };

    const handleShopSelection = (value) => {
        setShopId(value.id);
        setShopsName(value.name);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function getDaysInCurrentMonth() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Adding 1 to make it 1-indexed
        const currentYear = currentDate.getFullYear();
        return new Date(currentYear, currentMonth, 0).getDate();
    }

    function getDaysInCurrentYear() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || currentYear % 400 === 0;
        return isLeapYear ? 366 : 365;
    }

    const handleDailyTarget = (event) => {
        var enteredNumber = event.target.value;
        var monthly = enteredNumber * 12;
        var annually = enteredNumber * getDaysInCurrentYear();

        setTarget({
            ...target,
            daily: event.target.value,
            monthly: monthly,
            annually: annually
        });
    };

    const handleMonthlyTarget = (event) => {
        var enteredNumber = event.target.value;
        var daily = (enteredNumber / getDaysInCurrentMonth()).toFixed(0);
        var annually = enteredNumber * getDaysInCurrentYear();

        setTarget({
            ...target,
            daily: daily,
            monthly: event.target.value,
            annually: annually
        });
    };

    const handleAnnualTarget = (event) => {
        var enteredNumber = event.target.value;
        var monthly = enteredNumber / 12;
        var daily = (monthly / getDaysInCurrentMonth()).toFixed(0);

        setTarget({
            ...target,
            daily: daily,
            monthly: monthly,
            annually: event.target.value
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });
    };

    const handleCategoryFilterChange = (event) => {
        setCategory(event.target.value);
    };

    const handleRegionFilterChange = (event) => {
        setRegion(event.target.value);
    };

    const handleCityFilterChange = (event) => {
        setCity(event.target.value);
    };

    const handleSubcityFilterChange = (event) => {
        setSubsCity(event.target.value);
    };

    const filteredData = shops.filter((shop) => {
        let isMatch = true;

        if (category !== 'Category') {
            isMatch = isMatch && shop.category === category;
        }

        if (region !== 'Region') {
            isMatch = isMatch && shop.region === region;
        }

        if (city !== 'City') {
            isMatch = isMatch && shop.city === city;
        }

        if (subcity !== 'Subcity') {
            isMatch = isMatch && shop.subcity === subcity;
        }

        return isMatch;
    });

    useEffect(() => {
        const getShops = () => {
            const Controller = new AbortController();
            const signal = Controller.signal;
            setLoading(true);
            var Api = Connections.api + Connections.viewstore;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'GET',
                headers: headers,
                signal: signal,
                cache: 'no-cache'
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setShops(response.data);
                        setLoading(false);
                    } else {
                        setShops([]);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching shop!'
                    });
                    setLoading(false);
                });

            return () => {
                Controller.abort();
            };
        };
        getShops();
        return () => {};
    }, []);
    return (
        <MainCard>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                    <Typography variant="h3">Manage Shops</Typography>
                </Grid>
            </Grid>
            <Grid container alignItems="center">
                <Grid item sx={{ paddingY: 1 }}>
                    <Button component={Link} to="/create-shop" variant="text" color="primary" sx={{ textDecoration: 'none' }}>
                        Create Shop
                    </Button>
                </Grid>
                <Grid item>
                    <Button
                        onClick={() => setOpenTargetDialog(true)}
                        variant="text"
                        color="primary"
                        sx={{ marginLeft: 1, textDecoration: 'none' }}
                    >
                        Add Target
                    </Button>
                </Grid>
            </Grid>

            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="Shop Tabs">
                        <Tab label="Tabular View" value="1" />
                        <Tab label="Card View" value="2" />
                        <Tab label="Map View" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <ShopTable shops={filteredData} />
                </TabPanel>
                <TabPanel value="2">
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} className="mt-1"></Grid>
                        <FormControl className="ms-4 mt-2">
                            <Select value={category} onChange={handleCategoryFilterChange}>
                                <MenuItem value="Category">Category</MenuItem>
                                {Array.from(new Set(filteredData.map((shops) => shops.category))).map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 mt-2 ">
                            <Select value={region} onChange={handleRegionFilterChange}>
                                <MenuItem value="Region">Region</MenuItem>
                                {Array.from(new Set(filteredData.map((shops) => shops.region))).map((region) => (
                                    <MenuItem key={region} value={region}>
                                        {region}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 my-2 ">
                            <Select value={city} onChange={handleCityFilterChange}>
                                <MenuItem value="City">City</MenuItem>
                                {Array.from(new Set(filteredData.map((shop) => shop.city))).map((city) => (
                                    <MenuItem key={city} value={city}>
                                        {city}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl className="ms-2 my-2 ">
                            <Select value={subcity} onChange={handleSubcityFilterChange}>
                                <MenuItem value="Subcity">Subcity</MenuItem>
                                {Array.from(new Set(filteredData.map((shop) => shop.subcity))).map((subcity) => (
                                    <MenuItem key={subcity} value={subcity}>
                                        {subcity}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Grid item xs={12}></Grid>

                        {loading ? (
                            <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
                                <ActivityIndicators />
                            </Grid>
                        ) : (
                            <Grid container spacing={gridSpacing} alignItems="center" style={{ paddingLeft: 20 }}>
                                {filteredData.map((shop, index) => (
                                    <Grid
                                        item
                                        sm={3}
                                        key={index}
                                        onClick={() =>
                                            navigate('/view-shop', {
                                                state: { ...shop }
                                            })
                                        }
                                        style={{ textDecoration: 'none' }}
                                    >
                                        <Card variant="outlined">
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    height="140"
                                                    image={
                                                        shop.profile_image
                                                            ? Connections.images + shop.profile_image
                                                            : Connections.images + '646137991fd91.jpg'
                                                    }
                                                    alt={shop.name}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {shop.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {shop.address}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {shop.phone}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </TabPanel>
                <TabPanel value="3">
                    <ShopMap shopData={shops} />
                </TabPanel>
            </TabContext>

            <Dialog open={openTargetDialog} onClose={handleDialogClose}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: theme.palette.primary.main
                    }}
                >
                    <DialogTitle sx={{ fontSize: theme.typography.h4, color: theme.palette.background.default }}>
                        Set New Target
                    </DialogTitle>
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
                                    onChange={(event) => handleMonthlyTarget(event)}
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
                                    onChange={(event) => handleAnnualTarget(event)}
                                    sx={{ marginTop: 2, marginRight: 1, backgroundColor: theme.palette.background.default }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        paddingX: 4,
                                        paddingY: 1.6,
                                        marginTop: 1.8,
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
        </MainCard>
    );
};

export default Shops;
