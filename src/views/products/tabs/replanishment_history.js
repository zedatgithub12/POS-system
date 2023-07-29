import { Grid, Typography, Table, TableBody, TableRow, TableCell, TableHead } from '@mui/material';
import { DateFormatter } from 'utils/functions';

const ReplanishmentHistory = ({ History }) => {
    return (
        <Grid item xs={12}>
            {History.length == 0 ? (
                <Typography>There is no replanishment history yet!</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Existing</TableCell>
                            <TableCell>Added</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {History.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{DateFormatter(item.created_at)}</TableCell>
                                <TableCell>{item.existing_amount}</TableCell>
                                <TableCell>{item.added_amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Grid>
    );
};

export default ReplanishmentHistory;
