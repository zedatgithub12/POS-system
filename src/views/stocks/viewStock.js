// material-ui
import { Grid, Box, Button, Typography } from '@mui/material';
import Connections from 'api';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ItemDetail from './tabs/item_detail';
import ReplanishmentHistory from './tabs/replanishment_history';
import ItemAvailablity from './tabs/item_availability';
import PriceUpdate from './tabs/price_update';

// ==============================|| View stock ||============================== //

const ViewStock = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [value, setValue] = useState('1');

    const GoBack = () => {
        navigate(-1);
    };

    // state declarations

    const [stock, setstock] = useState({});
    const [price, setPrice] = useState([]);
    const [availablity, setAvailablity] = useState([]);
    const [replanishment, setReplanishment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        var statusChecked = true;
        var status = state.status ? state.status : '';
        var salesStatus = state.salesstatus ? state.salesstatus : '';
        var notificationStatus = users.role === 'Admin' ? status : salesStatus;

        if (statusChecked && notificationStatus === 'unseen') {
            var AdminApi = Connections.api + Connections.updateStatus + state.id;
            var saleApi = Connections.api + Connections.updateSalesStatus + state.id;
            var Api = users.role === 'Admin' ? AdminApi : saleApi;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'PUT',
                headers: headers
            });
            statusChecked = false;
        }
        //fetch stock informationa when component get mounted
        const FetchstockInfo = () => {
            setIsLoading(true);

            var id = state.itemid ? state.itemid : state.id;
            var Api = Connections.api + Connections.getStock + id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };

            const req = fetch(Api, {
                method: 'GET',
                headers: headers,
                cache: 'no-cache'
            });
            req.then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setstock(response.stock);
                        setReplanishment(response.replanishments);
                        setPrice(response.priceupdates);
                        setAvailablity(response.availablity);
                        setIsLoading(false);
                    } else {
                        setIsLoading(true);
                    }
                })
                .catch(() => {
                    setIsLoading(true);
                });
        };

        FetchstockInfo();

        return () => {};
    }, [state]);
    return (
        <MainCard>
            {isLoading ? (
                <Grid container>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="spinner-border spinner-border-sm text-dark  " role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </Grid>
                </Grid>
            ) : (
                <>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="h3">{state.item_name}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button onClick={GoBack} variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange} aria-label="Item Tabs">
                                <Tab label="Item Detail" value="1" />
                                <Tab label="Availability" value="2" />

                                <Tab label="Price Updates" value="3" />
                                <Tab label="Replenishments" value="4" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <ItemDetail stock={stock} />
                        </TabPanel>

                        <TabPanel value="2">
                            <ItemAvailablity Items={availablity} />
                        </TabPanel>
                        <TabPanel value="3">
                            <PriceUpdate prices={price} />
                        </TabPanel>

                        <TabPanel value="4">
                            <ReplanishmentHistory History={replanishment} />
                        </TabPanel>
                    </TabContext>
                </>
            )}
        </MainCard>
    );
};
export default ViewStock;
