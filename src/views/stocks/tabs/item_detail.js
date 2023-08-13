import { Grid, Box, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Connections from 'api';
import Barcode from 'react-barcode';

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
                                <TableCell>{product.code}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Item name</TableCell>
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
                                <TableCell>Sub category</TableCell>
                                <TableCell>{product.sub_category}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Min quantity</TableCell>
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
                                    <span className="bg-success bg-opacity-10 text-success px-4 py-1 rounded">{product.unit}</span>
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
                <Box paddingX={2} marginTop={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Barcode value={product.id} />
                </Box>
            </Grid>
        </Grid>
    );
};

export default ItemDetail;
