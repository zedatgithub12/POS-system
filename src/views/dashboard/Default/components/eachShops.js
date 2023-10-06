// material-ui

import { Grid, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { IconArrowDown, IconArrowUp, IconList } from '@tabler/icons';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { calculatePercentage, Achievement } from 'utils/functions';
import Pagination from '@mui/material/Pagination';
import { Preferences } from 'preferences';
import { ActivityIndicators } from 'ui-component/activityIndicator';

import { useState } from 'react';

// project imports

// ==============================|| target listing component ||============================== //

const EachShops = ({ lists, loading, period, children }) => {
    const theme = useTheme();

    const PeriodSelector = (item) => {
        var target;
        switch (period) {
            case 'monthly':
                target = item.r_monthly;
                break;
            case 'annual':
                target = item.r_yearly;
                break;
            default:
                target = item.r_daily;
        }
        return target;
    };

    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            {children}

            {lists ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Shop</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Achievement</TableCell>
                                <TableCell>Difference</TableCell>
                                <TableCell>Achievement(%)</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Box sx={{ minHeight: 188, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <ActivityIndicators />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : lists.length > 0 ? (
                                lists.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.shopname}</TableCell>
                                        <TableCell>{PeriodSelector(item).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: theme.palette.primary.dark,
                                                    fontWeight: theme.typography.fontWeightMedium
                                                }}
                                            >
                                                {parseFloat(item.sales_sum).toLocaleString()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{(PeriodSelector(item) - parseFloat(item.sales_sum)).toLocaleString()}</TableCell>

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        paddingRight: 1
                                                    }}
                                                >
                                                    {Achievement(parseFloat(item.sales_sum), PeriodSelector(item)) === 'achieved' ? (
                                                        <IconArrowUp size={16} color={theme.palette.success.dark} />
                                                    ) : (
                                                        <IconArrowDown size={16} color={theme.palette.error.main} />
                                                    )}
                                                </Typography>

                                                <Typography sx={{ marginLeft: 2, fontWeight: theme.typography.fontWeightMedium }}>
                                                    {calculatePercentage(
                                                        parseFloat(item.sales_sum),

                                                        period === 'annual'
                                                            ? item.r_yearly
                                                            : period === 'monthly'
                                                            ? item.r_monthly
                                                            : item.r_daily
                                                    )}
                                                    %
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Grid container component={Paper} sx={{ paddingY: 4, borderRadius: 2 }}>
                                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <IconList size={48} color={theme.palette.primary.main} />
                                                    <Typography>List of target and achievement for each shop</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {lists.length > Preferences.numPerPage && (
                        <Box marginY={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Pagination count={numPages} page={page} onChange={handleChangePage} />
                        </Box>
                    )}
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

EachShops.propTypes = {
    lists: PropTypes.array
};
export default EachShops;
