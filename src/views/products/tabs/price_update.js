import { Grid, Box, Table, TableBody, TableRow, TableCell, TableHead, Typography } from '@mui/material';
import { DateFormatter } from 'utils/functions';
import { IconChevronsDown, IconChevronsUp } from '@tabler/icons';

const PriceUpdate = ({ prices }) => {
    return (
        <Grid item xs={12}>
            {prices.length == 0 ? (
                <Typography>There is no price update yet!</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>From</TableCell>
                            <TableCell>Changed to</TableCell>
                            <TableCell>Difference</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {prices.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{DateFormatter(item.date)}</TableCell>
                                <TableCell>{item.from}</TableCell>
                                <TableCell>{item.to}</TableCell>
                                <TableCell>
                                    {item.to > item.from ? (
                                        <>
                                            {item.to - item.from}
                                            <IconChevronsUp size={18} className="text-success" />
                                        </>
                                    ) : (
                                        <>
                                            {item.from - item.to}
                                            <IconChevronsDown size={18} className="text-danger" />
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Grid>
    );
};

export default PriceUpdate;
