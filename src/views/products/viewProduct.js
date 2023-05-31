// material-ui
import { Grid, Divider, Box, Paper, Button, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';
import Connections from 'api';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const FetchProductInfo = () => {
            setIsLoading(true);
            var Api = Connections.api + Connections.productdetail + state.id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };

            const req = fetch(Api, {
                method: 'GET',
                headers: headers
            });
            req.then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setProduct(response.product);
                        setAvailablity(response.items);
                        setIsLoading(false);
                    } else {
                        setIsLoading(true);
                    }
                })
                .catch((error) => {
                    setIsLoading(true);
                });
        };

        FetchProductInfo();

        return () => {};
    }, []);
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
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>{product.quantity}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>Category</TableCell>
                                                <TableCell>{product.category}</TableCell>
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
                                <Box marginTop={9} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
