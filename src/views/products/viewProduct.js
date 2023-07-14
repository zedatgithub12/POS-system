// material-ui
import { Grid, Divider, Box, Button, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';
import Connections from 'api';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Barcode from 'react-barcode';

// ==============================|| SAMPLE PAGE ||============================== //

const ViewProduct = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const GoBack = () => {
        navigate(-1);
    };

    // state declarations

    const [product, setProduct] = useState({});
    const [availablity, setAvailablity] = useState([]);
    const [replanishment, setReplanishment] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);

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
            var Api = Connections.api + Connections.productdetail + id;
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
                        setAvailablity(response.items);
                        setReplanishment(response.replanishments);
                        console.log(replanishment);
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
        <>
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
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="h3">Item Detail</Typography>
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
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={7} md={6} sm={12} xs={12}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} padding={3}>
                                    <Table sx={{ width: '100%' }}>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>Product Code</TableCell>
                                                <TableCell>{product.code}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Product Name</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell>Shop</TableCell>
                                                <TableCell>{product.shop}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Category</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Sub Category</TableCell>
                                                <TableCell>{product.sub_category}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>{product.quantity}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Min Quantity</TableCell>
                                                <TableCell>{product.min_quantity}</TableCell>
                                            </TableRow>

                                            <TableRow>
                                                <TableCell> Brand</TableCell>
                                                <TableCell>{product.brand}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Cost</TableCell>
                                                <TableCell>{product.cost}ETB</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Price </TableCell>
                                                <TableCell>{product.price}ETB</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Unit</TableCell>
                                                <TableCell>
                                                    <span className="bg-success bg-opacity-10 text-success px-4 py-1 rounded">
                                                        {product.unit}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>status</TableCell>
                                                <TableCell>{product.status}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Grid>

                            <Grid item lg={5} md={6} sm={12} xs={12} hidden={isMediumScreen}>
                                <Box marginTop={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {product.picture ? (
                                        <LazyLoadImage
                                            alt={product.name}
                                            effect="blur"
                                            delayTime={500}
                                            src={Connections.images + product.picture}
                                            style={{ width: 300, height: 300 }}
                                            className="img-fluid rounded m-auto me-2"
                                        />
                                    ) : (
                                        <LazyLoadImage
                                            alt="product"
                                            effect="blur"
                                            delayTime={500}
                                            src="http://placehold.it/120x120&text=image"
                                            style={{ width: 300, height: 300 }}
                                            className="img-fluid rounded m-auto me-2"
                                        />
                                    )}
                                </Box>
                                {/* <Box paddingX={4} marginTop={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Barcode value={product.code} />
                                </Box> */}
                                <Typography sx={{ fontSize: theme.typography.h4, marginTop: 6, marginLeft: 2 }}>
                                    Replanishment History
                                </Typography>

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Existing</TableCell>
                                            <TableCell>Added</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {replanishment.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{item.created_at.slice(0, 10)}</TableCell>
                                                <TableCell>{item.existing_amount}</TableCell>
                                                <TableCell>{item.added_amount}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </MainCard>

            <MainCard sx={{ marginTop: 1 }}>
                {isLoading ? (
                    <Grid container>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} padding={3}>
                                <Table sx={{ width: '100%' }}>
                                    <TableHead SX={{ background: '#dddddd' }}>
                                        <TableRow>
                                            <TableCell>Shop</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Price</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {availablity.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.shop}</TableCell>
                                                <TableCell>
                                                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded me-1">
                                                        {item.quantity}
                                                    </span>
                                                    <span className="bg-success bg-opacity-10 text-success px-4 py-1 rounded">
                                                        {item.unit}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{item.price} ETB</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </MainCard>
        </>
    );
};
export default ViewProduct;
