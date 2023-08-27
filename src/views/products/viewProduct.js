// material-ui
import { Grid, Divider, Box, Button, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';
import Connections from 'api';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ItemDetail from './tabs/item_detail';
import ReplanishmentHistory from './tabs/replanishment_history';
import ItemAvailablity from './tabs/item_availability';
import PriceUpdate from './tabs/price_update';

// ==============================|| View Product ||============================== //

const ViewProduct = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const [value, setValue] = useState('1');

    const GoBack = () => {
        navigate(-1);
    };

    // state declarations

    const [product, setProduct] = useState({});
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
        //fetch product informationa when component get mounted
        const FetchProductInfo = () => {
            setIsLoading(true);

            var id = state.itemid ? state.itemid : state.id;
            var Api = Connections.api + Connections.getItems + id;
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
                        setProduct(response.product);
                        setReplanishment(response.replanishments);
                        setPrice(response.priceupdates);
                        setAvailablity(response.items);
                        setIsLoading(false);
                    } else {
                        setIsLoading(true);
                    }
                })
                .catch(() => {
                    setIsLoading(true);
                });
        };

        FetchProductInfo();

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
                                        <Typography variant="h3">{state.name}</Typography>
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
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <ItemDetail product={product} />
                        </TabPanel>

                        <TabPanel value="2">
                            <ItemAvailablity Items={availablity} />
                        </TabPanel>
                    </TabContext>
                </>
            )}
        </MainCard>
    );
};
export default ViewProduct;
