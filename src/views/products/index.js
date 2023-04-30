// material-ui
import { Grid, Typography, Button, Divider } from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
// ==============================|| SAMPLE PAGE ||============================== //

const Products = () => (
    <MainCard>
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Grid container direction="column" spacing={1}>
                            <Grid item>
                                <Typography variant="h3">Products</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Button>Add Product</Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={12}>
                <Typography> Product Listing</Typography>
            </Grid>
        </Grid>
    </MainCard>
);

export default Products;
