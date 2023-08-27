import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import { CardContent, Grid, Typography, Avatar, Divider } from '@mui/material';
import Pagination from '@mui/material/Pagination';
// project imports
// import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
// import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
// import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { KeyboardArrowDownOutlined } from '@mui/icons-material';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //

const LowProducts = ({ isLoading, lowProducts = [] }) => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(Math.ceil(lowProducts.length / 10));
    const handleChangePage = (event, value) => {
        setPage(value);
    };
    return (
        <>
            {isLoading ? (
                <SkeletonPopularCard />
            ) : (
                <MainCard content={false}>
                    <CardContent>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <Grid container alignContent="center" justifyContent="space-between">
                                    <Grid item>
                                        <Typography variant="h4">Low Stocks</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                {lowProducts.map((product, index) => (
                                    <Grid container direction="column" key={index}>
                                        <Grid item>
                                            <Grid container alignItems="center" justifyContent="space-between">
                                                <Grid item>
                                                    <Typography variant="subtitle1" color="inherit">
                                                        {product.name}
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Grid container alignItems="center" justifyContent="space-between">
                                                        <Grid item>
                                                            <Typography variant="subtitle1" color="inherit">
                                                                {product.quantity}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item>
                                                            <Avatar
                                                                variant="rounded"
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: '5px',
                                                                    backgroundColor: theme.palette.error.light,
                                                                    color: theme.palette.error.dark,
                                                                    ml: 2
                                                                }}
                                                            >
                                                                <KeyboardArrowDownOutlined fontSize="small" color="error" />
                                                            </Avatar>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 1.5 }} />
                                    </Grid>
                                ))}
                                <Pagination count={numPages} page={page} onChange={handleChangePage} />
                            </Grid>
                        </Grid>
                    </CardContent>
                </MainCard>
            )}
        </>
    );
};

LowProducts.propTypes = {
    isLoading: PropTypes.bool,
    lowProducts: PropTypes.array
};

export default LowProducts;
