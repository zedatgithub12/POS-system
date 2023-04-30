// material-ui
import { Grid, Typography, Button, Divider, Box, capitalize } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { gridSpacing } from 'store/constant';

// ==============================|| SHOP DETAIL PAGE ||============================== //

const ViewShop = () => {
    const { state } = useLocation();
    const shop = state;

    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">{shop.name}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button onClick={GoBack} variant="outlined" color="secondary" sx={{ textDecoration: 'none' }}>
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
            </Grid>
            <Grid item lg={4} md={6} sm={6} xs={12} spacing={2}></Grid>

            <Grid container justifyContent="space-between">
                <Grid item lg={7} md={6} sm={6} xs={12}>
                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                        style={{
                            marginTop: 10,
                            backgroundColor: '#eee',
                            borderRadius: 6,
                            padding: 6,
                            paddingRight: 20,
                            paddingLeft: 14
                        }}
                    >
                        <Grid item>
                            <img
                                src={shop.picture}
                                alt="Shop Profile Preview"
                                style={{ width: '100%', marginTop: 10, marginBottom: 10, borderRadius: 8 }}
                            />
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        style={{ marginTop: 10, backgroundColor: '#eee', borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                    >
                        <Grid item>
                            <Typography variant="body2">Shop Address</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4">{shop.address}</Typography>
                        </Grid>
                    </Grid>

                    <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        style={{ marginTop: 10, backgroundColor: '#eee', borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                    >
                        <Grid item>
                            <Typography variant="body2">Shop Phone</Typography>
                        </Grid>
                        <Grid item>
                            <Typography variant="h4">{shop.phone}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ marginTop: 10, backgroundColor: '#eee', borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                >
                    <Grid item>
                        <Typography variant="body2">Status</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="h4" style={{ marginLeft: 5, textTransform: 'capitalize' }}>
                            {shop.status}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default ViewShop;
