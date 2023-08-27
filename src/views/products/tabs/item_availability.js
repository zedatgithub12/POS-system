import { Grid, Typography, Box, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ItemAvailablity = ({ Items }) => {
    return (
        <Grid item xs={12}>
            {Items.length == 0 ? (
                <Typography>Item is not available anywhere!</Typography>
            ) : (
                <Table sx={{ width: '100%' }}>
                    <TableHead SX={{ background: '#dddddd' }}>
                        <TableRow>
                            <TableCell>Shop</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.stock_shop}</TableCell>
                                <TableCell>
                                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded me-1">
                                        {item.stock_quantity}
                                    </span>
                                    <span className="bg-success bg-opacity-10 text-success px-4 py-1 rounded">{item.stock_unit}</span>
                                </TableCell>
                                <TableCell>{item.stock_price} ETB</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Grid>
    );
};

export default ItemAvailablity;
