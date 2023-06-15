// material-ui
import { Grid, Typography, Button, Divider, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
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
                headers: headers
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setShops(response.data);
                    } else {
                        setShops([]);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error creatng shop!'
                    });
                });
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

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12} spacing={2}></Grid>

                <Grid container spacing={gridSpacing} alignItems="center" style={{ paddingLeft: 20 }}>
                    {shops.map((shop, index) => (
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
