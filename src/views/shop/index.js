// material-ui
import { Grid, Typography, Button, Divider, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Shoplist from 'data/shops';
import { Link, useNavigate } from 'react-router-dom';

// ==============================|| Shopp Listing PAGE ||============================== //

const Shops = () => {
    const navigate = useNavigate();
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
                    {Shoplist.map((shop, index) => (
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
                                    <CardMedia component="img" height="140" image={shop.picture} alt={shop.name} />
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
        </MainCard>
    );
};

export default Shops;
