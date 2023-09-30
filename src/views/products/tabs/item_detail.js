import { Grid, Box, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Connections from 'api';

const ItemDetail = ({ product }) => {
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Grid container spacing={2}>
            <Grid item lg={7} md={6} sm={12} xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} padding={3}>
                    <Table sx={{ width: '100%' }}>
                        <TableBody>
                            <TableRow>
                                <TableCell>Item code</TableCell>
                                <TableCell>{product.item_code}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>{product.item_category}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sub category</TableCell>
                                <TableCell>{product.item_sub_category}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.item_name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Unit</TableCell>
                                <TableCell>{product.item_unit}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> SKU</TableCell>
                                <TableCell>
                                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded"> {product.item_sku}</span>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Packaging</TableCell>
                                <TableCell>{product.item_packaging}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell sx={{ textTransform: 'capitalize' }}>
                                    <span
                                        className={
                                            product.item_status === 'active'
                                                ? 'bg-success bg-opacity-10 text-success px-2 py-1 rounded'
                                                : 'bg-danger bg-opacity-10 text-danger px-2 py-1 rounded'
                                        }
                                    >
                                        {product.item_status === 'deactivate' ? product.item_status + 'd' : product.item_status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Grid>

            <Grid item lg={5} md={6} sm={12} xs={12} hidden={isMediumScreen}>
                <Box marginTop={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {product.item_image ? (
                        <LazyLoadImage
                            alt={product.name}
                            effect="blur"
                            delayTime={500}
                            src={Connections.images + product.item_image}
                            style={{ width: 300, height: 300, objectFit: 'contain' }}
                            className="img-fluid rounded m-auto me-2"
                        />
                    ) : (
                        <LazyLoadImage
                            alt="product"
                            effect="blur"
                            delayTime={500}
                            src="http://placehold.it/120x120&text=image"
                            style={{ width: 300, height: 300, objectFit: 'contain' }}
                            className="img-fluid rounded m-auto me-2"
                        />
                    )}
                </Box>
            </Grid>
        </Grid>
    );
};

export default ItemDetail;
