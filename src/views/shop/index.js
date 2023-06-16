// material-ui
import {
    Grid,
    Typography,
    Button,
    Divider,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    MenuItem,
    FormControl,
    Select,
    CircularProgress
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Connections from 'api';
// ==============================|| SHOP LISTING PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Shops = () => {
    const navigate = useNavigate();

    const [shops, setShops] = useState([]);
    const [category, setCategory] = useState('Category');
    const [region, setRegion] = useState('Region');
    const [city, setCity] = useState('City');
    const [subcity, setSubsCity] = useState('Subcity');
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
                signal: signal
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
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Shops</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/create-shop" variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                Create Shop
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <FormControl className="ms-4 mt-2 ">
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
                <Grid item xs={12} className="mt-1"></Grid>
                <Grid item lg={4} md={6} sm={6} xs={12} spacing={2}></Grid>

                {loading ? (
                    <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 5 }}>
                        <CircularProgress />
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
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default Shops;
