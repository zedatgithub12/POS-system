import { useState } from 'react';
// material-ui
import { Grid, Divider, Button } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';
import StockScreen from './screens/stock-screen';
import PackageScreen from './screens/package-screen';

// ==============================|| SALES PAGE ||============================== //

const Sales = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);

    const [active, setActive] = useState(true);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="row" spacing={1}>
                                <Grid item>
                                    <Button onClick={() => setActive(true)} variant={active ? 'contained' : 'text'}>
                                        Stocks
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button onClick={() => setActive(false)} variant={active ? 'text' : 'contained'}>
                                        Packages
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        {user.role === 'Sales' &&
                            (active ? (
                                <Grid item sx={{ display: 'flex' }}>
                                    <Button
                                        component={Link}
                                        to="/create-sale"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ textDecoration: 'none' }}
                                    >
                                        Create Sell
                                    </Button>
                                </Grid>
                            ) : (
                                <Grid item sx={{ display: 'flex' }}>
                                    <Button
                                        component={Link}
                                        to="/sale-package"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ textDecoration: 'none' }}
                                    >
                                        Create Sell
                                    </Button>
                                </Grid>
                            ))}
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                {active ? <StockScreen /> : <PackageScreen />}
            </Grid>
        </MainCard>
    );
};

export default Sales;
