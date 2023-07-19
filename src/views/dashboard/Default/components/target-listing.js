import { useState } from 'react';
// material-ui

import { Grid, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { IconCheck, IconChecks, IconCircleCheck, IconList } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { calculatePercentage, formatNumber } from 'utils/functions';
// project imports

// ==============================|| target listing component ||============================== //

const TargetListing = (props) => {
    const theme = useTheme();

    const { lists } = props;

    const thirtydays = lists.thirtydays;

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            {thirtydays ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Collected</TableCell>
                                <TableCell>Difference</TableCell>
                                <TableCell>Achievement</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {thirtydays.length === 0 ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 6
                                    }}
                                >
                                    <IconCircleCheck size={48} color={theme.palette.primary.main} />
                                    <Typography marginTop={1}>All stocks in this shop are above minimum</Typography>
                                </Box>
                            ) : (
                                thirtydays.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell>{formatNumber(lists.target.r_daily)}</TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{ color: theme.palette.primary.dark, fontWeight: theme.typography.fontWeightMedium }}
                                            >
                                                {item.totalRevenue}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{parseInt(item.totalRevenue) - parseInt(lists.target.r_daily)}</TableCell>
                                        <TableCell>
                                            {calculatePercentage(parseInt(item.totalRevenue), parseInt(lists.target.r_daily)) <= 99 ? (
                                                <Typography sx={{ marginLeft: 2, fontWeight: theme.typography.fontWeightMedium }}>
                                                    {calculatePercentage(parseInt(item.totalRevenue), parseInt(lists.target.r_daily))}%
                                                </Typography>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center'
                                                    }}
                                                >
                                                    <IconCircleCheck color={theme.palette.success.dark} size={22} />
                                                    <Typography
                                                        sx={{
                                                            marginLeft: 2,
                                                            color: theme.palette.success.dark,
                                                            fontWeight: theme.typography.fontWeightMedium
                                                        }}
                                                    >
                                                        {calculatePercentage(parseInt(item.totalRevenue), parseInt(lists.target.r_daily))} %{' '}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Grid container component={Paper} sx={{ paddingY: 4, borderRadius: 2 }}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <IconList size={48} color={theme.palette.primary.main} />
                            <Typography>List of target and achievement for selected shop</Typography>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

TargetListing.propTypes = {
    lists: PropTypes.array
};
export default TargetListing;
