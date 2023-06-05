import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

import ChartDataMonth from './chart-data/total-order-month-line-chart';
import ChartDataYear from './chart-data/total-order-year-line-chart';

// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import { backgroundColor } from '@mui/system/palette';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.warning.light,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&>div': {
        position: 'relative',
        zIndex: 5
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.warning.dark,
        borderRadius: '50%',
        zIndex: 1,
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        width: 210,
        height: 210,
        background: theme.palette.warning.dark,
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading, dailySales, monthlysales, anualsales, todatesales }) => {
    const theme = useTheme();

    const [timeValue, setTimeValue] = useState('day');
    const handleChangeTime = (event, newValue) => {
        setTimeValue(newValue);
    };

    return (
        <>
            {isLoading ? (
                <SkeletonTotalOrderCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.warning.dark,
                                                color: '#222',
                                                mt: 1
                                            }}
                                        >
                                            <LocalMallOutlinedIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            disableElevation
                                            variant={timeValue === 'day' ? 'contained' : 'text'}
                                            size="small"
                                            color="inherit"
                                            sx={{
                                                color: '#222',
                                                backgroundColor:
                                                    timeValue === 'day' ? theme.palette.warning.light : theme.palette.warning.dark
                                            }}
                                            onClick={(e) => handleChangeTime(e, 'day')}
                                        >
                                            Today
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={timeValue === 'month' ? 'contained' : 'text'}
                                            size="small"
                                            color="inherit"
                                            sx={{
                                                color: '#222',
                                                backgroundColor:
                                                    timeValue === 'month' ? theme.palette.warning.light : theme.palette.warning.dark
                                            }}
                                            onClick={(e) => handleChangeTime(e, 'month')}
                                        >
                                            Month
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={!timeValue === 'year' ? 'contained' : 'text'}
                                            size="small"
                                            color="inherit"
                                            sx={{
                                                color: '#222',
                                                backgroundColor:
                                                    timeValue === 'year' ? theme.palette.warning.light : theme.palette.warning.dark
                                            }}
                                            onClick={(e) => handleChangeTime(e, 'year')}
                                        >
                                            Year
                                        </Button>
                                        <Button
                                            disableElevation
                                            variant={!timeValue === 'todate' ? 'contained' : 'text'}
                                            size="small"
                                            color="inherit"
                                            sx={{
                                                color: '#222',
                                                backgroundColor:
                                                    timeValue === 'todate' ? theme.palette.warning.light : theme.palette.warning.dark
                                            }}
                                            onClick={(e) => handleChangeTime(e, 'todate')}
                                        >
                                            To Date
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sx={{ mb: 0.75 }}>
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Grid container alignItems="center">
                                            <Grid item>
                                                {timeValue === 'day' ? (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '2.125rem',
                                                            fontWeight: 500,
                                                            mr: 1,
                                                            mt: 1.75,
                                                            mb: 0.75,
                                                            color: '#222'
                                                        }}
                                                    >
                                                        {dailySales}
                                                    </Typography>
                                                ) : timeValue === 'month' ? (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '2.125rem',
                                                            fontWeight: 500,
                                                            mr: 1,
                                                            mt: 1.75,
                                                            mb: 0.75,
                                                            color: '#222'
                                                        }}
                                                    >
                                                        {monthlysales}
                                                    </Typography>
                                                ) : timeValue === 'year' ? (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '2.125rem',
                                                            fontWeight: 500,
                                                            mr: 1,
                                                            mt: 1.75,
                                                            mb: 0.75,
                                                            color: '#222'
                                                        }}
                                                    >
                                                        {anualsales}
                                                    </Typography>
                                                ) : (
                                                    <Typography
                                                        sx={{
                                                            fontSize: '2.125rem',
                                                            fontWeight: 500,
                                                            mr: 1,
                                                            mt: 1.75,
                                                            mb: 0.75,
                                                            color: '#222'
                                                        }}
                                                    >
                                                        {todatesales}
                                                    </Typography>
                                                )}
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '1rem',
                                                        fontWeight: 500,
                                                        color: theme.palette.dark.main
                                                    }}
                                                >
                                                    Total Sales
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6}>
                                        {timeValue === 'day' ? (
                                            <Chart {...ChartDataMonth} />
                                        ) : timeValue === 'month' ? (
                                            <Chart {...ChartDataYear} />
                                        ) : timeValue === 'year' ? (
                                            <Chart {...ChartDataMonth} />
                                        ) : (
                                            <Chart {...ChartDataYear} />
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

TotalOrderLineChartCard.propTypes = {
    isLoading: PropTypes.bool,
    dailySales: PropTypes.number,
    monthlysales: PropTypes.number,
    anualsales: PropTypes.number
};

export default TotalOrderLineChartCard;
