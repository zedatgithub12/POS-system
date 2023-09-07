import { Grid, Box, Table, TableBody, TableRow, TableCell } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Connections from 'api';
import PropTypes from 'prop-types';

const ItemDetail = ({ stock }) => {
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
                                <TableCell>{stock.item_code}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Shop</TableCell>
                                <TableCell>{stock.stock_shop}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>{stock.item_category}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Sub category</TableCell>
                                <TableCell>{stock.item_sub_category}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell> Brand</TableCell>
                                <TableCell>{stock.item_brand}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>
                                    {' '}
                                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">{stock.stock_unit}</span>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity</TableCell>
                                <TableCell>{stock.stock_quantity}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Min quantity</TableCell>
                                <TableCell>{stock.stock_min_quantity}</TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Purchase price</TableCell>
                                <TableCell>{stock.stock_cost} ETB</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Selling Price </TableCell>
                                <TableCell>
                                    {stock.stock_price} {''}ETB
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell>Status</TableCell>
                                <TableCell>
                                    <span
                                        className={
                                            stock.stock_status === 'In-Stock'
                                                ? 'bg-success bg-opacity-10 text-success px-2 py-1 rounded'
                                                : stock.stock_status === 'Out-Of-Stock'
                                                ? 'bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded'
                                                : stock.stock_status === 'Hold'
                                                ? 'bg-info bg-opacity-10 text-info px-2 py-1 rounded'
                                                : 'bg-danger bg-opacity-10 text-danger px-2 py-1 rounded'
                                        }
                                    >
                                        {stock.stock_status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Grid>

            <Grid item lg={5} md={6} sm={12} xs={12} hidden={isMediumScreen}>
                <Box marginTop={7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stock.item_image ? (
                        <LazyLoadImage
                            alt={stock.item_name}
                            effect="blur"
                            delayTime={500}
                            src={Connections.images + stock.item_image}
                            style={{ width: 300, height: 300 }}
                            className="img-fluid rounded m-auto me-2"
                        />
                    ) : (
                        <LazyLoadImage
                            alt="stock"
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
    );
};

ItemDetail.propTypes = {
    stock: PropTypes.arrayOf(PropTypes.string).isRequired
};
export default ItemDetail;
