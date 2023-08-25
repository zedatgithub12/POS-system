import { useState } from 'react';
// material-ui
import { Grid, Typography, Box, Divider, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Achievement, calculatePercentage, formatNumber } from 'utils/functions';
import { IconArrowUp, IconTarget, IconTimeline } from '@tabler/icons';

// ==============================|| Sales target Component ||============================== //

const SalesTargets = (targets) => {
    const theme = useTheme();

    return (
        <Grid
            container
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 1
            }}
        >
            {targets.targets.target ? (
                <>
                    <Grid item xs={12} sm={12} md={5.6} lg={3.8} xl={3.8}>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.light,
                                marginY: 2,
                                borderRadius: 1.5,
                                border: 1,
                                borderColor: theme.palette.grey[300]
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography
                                    sx={{
                                        paddingLeft: 1.8,
                                        paddingY: 1,
                                        fontSize: 16,
                                        fontWeight: theme.typography.fontWeightRegular,
                                        color: theme.palette.grey[900]
                                    }}
                                >
                                    Daily
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            paddingRight: 1
                                        }}
                                    >
                                        {Achievement(parseInt(targets.targets.daily), parseInt(targets.targets.target.r_daily)) ===
                                        'achieved' ? (
                                            <IconArrowUp size={18} color={theme.palette.success.dark} />
                                        ) : (
                                            <IconTimeline size={18} color={theme.palette.error.main} />
                                        )}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            paddingRight: 1.8,
                                            fontSize: 16,
                                            fontSize: theme.typography.h4,
                                            fontWeight: theme.typography.fontWeightRegular,
                                            color: theme.palette.grey[800],
                                            textAlign: 'center'
                                        }}
                                    >
                                        {calculatePercentage(parseInt(targets.targets.daily), parseInt(targets.targets.target.r_daily))}%
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid
                                container
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    paddingY: 2
                                }}
                            >
                                <Grid item xs={6} sx={{ padding: 2 }}>
                                    <Typography
                                        sx={{
                                            paddingRight: 1.8,
                                            fontSize: 20,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.grey[900]
                                        }}
                                    >
                                        {formatNumber(parseInt(targets.targets.target.r_daily))}
                                    </Typography>
                                    <Typography>Target</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ padding: 2 }}>
                                    <Typography
                                        sx={{
                                            paddingRight: 1.8,
                                            fontSize: 20,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.grey[900]
                                        }}
                                    >
                                        {formatNumber(parseInt(targets.targets.daily))}
                                    </Typography>
                                    <Typography>Achieved</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={5.6}
                        lg={3.8}
                        xl={3.8}
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            marginY: 1,
                            borderRadius: 1.5
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ paddingLeft: 1.8, paddingY: 1, fontSize: 16, color: theme.palette.background.default }}>
                                Monthly
                            </Typography>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly'
                                }}
                            >
                                <Typography
                                    sx={{
                                        paddingRight: 1
                                    }}
                                >
                                    {Achievement(parseInt(targets.targets.monthly), parseInt(targets.targets.target.r_monthly)) ===
                                    'achieved' ? (
                                        <IconArrowUp size={18} color={theme.palette.success.dark} />
                                    ) : (
                                        <IconTimeline size={18} color={theme.palette.warning.dark} />
                                    )}
                                </Typography>
                                <Typography
                                    sx={{
                                        paddingRight: 1.8,
                                        paddingY: 1,
                                        fontSize: 16,
                                        fontWeight: theme.typography.fontWeightRegular,
                                        color: theme.palette.background.default
                                    }}
                                >
                                    {calculatePercentage(parseInt(targets.targets.monthly), parseInt(targets.targets.target.r_monthly))}%
                                </Typography>
                            </Box>
                        </Box>

                        <Grid
                            container
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                paddingY: 2
                            }}
                        >
                            <Grid item xs={6} sx={{ padding: 2 }}>
                                <Typography sx={{ fontSize: 24, color: theme.palette.background.default }}>
                                    {formatNumber(parseInt(targets.targets.target.r_monthly))}
                                </Typography>
                                <Typography sx={{ color: theme.palette.background.default }}>Target</Typography>
                            </Grid>

                            <Grid item xs={6} sx={{ padding: 2 }}>
                                <Typography sx={{ fontSize: 24, color: theme.palette.background.default }}>
                                    {formatNumber(parseInt(targets.targets.monthly))}
                                </Typography>
                                <Typography sx={{ color: theme.palette.background.default }}>Achieved</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={3.8} xl={3.8}>
                        <Box
                            sx={{
                                backgroundColor: theme.palette.primary.light,
                                marginY: 2,
                                borderRadius: 1.5,
                                border: 1,
                                borderColor: theme.palette.grey[300]
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography
                                    sx={{
                                        paddingLeft: 1.8,
                                        paddingY: 1,
                                        fontSize: theme.typography.h4,
                                        fontWeight: theme.typography.fontWeightRegular
                                    }}
                                >
                                    Annual
                                </Typography>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-evenly'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            paddingRight: 1
                                        }}
                                    >
                                        {Achievement(parseInt(targets.targets.annually), parseInt(targets.targets.target.r_yearly)) ===
                                        'achieved' ? (
                                            <IconArrowUp size={18} color={theme.palette.success.dark} />
                                        ) : (
                                            <IconTimeline size={18} color={theme.palette.error.main} />
                                        )}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            paddingRight: 1.8,
                                            paddingY: 1,
                                            fontSize: theme.typography.h4,
                                            fontWeight: theme.typography.fontWeightRegular
                                        }}
                                    >
                                        {calculatePercentage(parseInt(targets.targets.annually), parseInt(targets.targets.target.r_yearly))}
                                        %
                                    </Typography>
                                </Box>
                            </Box>

                            <Grid
                                container
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                    paddingY: 2
                                }}
                            >
                                <Grid item xs={6} sx={{ padding: 2 }}>
                                    <Typography
                                        sx={{
                                            paddingRight: 1.8,
                                            fontSize: 20,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.grey[900]
                                        }}
                                    >
                                        {formatNumber(parseInt(targets.targets.target.r_yearly))}
                                    </Typography>
                                    <Typography>Target</Typography>
                                </Grid>

                                <Grid item xs={6} sx={{ padding: 2 }}>
                                    <Typography
                                        sx={{
                                            paddingRight: 1.8,
                                            fontSize: 20,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.grey[900]
                                        }}
                                    >
                                        {formatNumber(parseInt(targets.targets.annually))}
                                    </Typography>
                                    <Typography>Achieved</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </>
            ) : (
                <Grid container component={Paper} sx={{ paddingY: 4, borderRadius: 2 }}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <IconTarget size={48} color={theme.palette.primary.main} />
                            <Typography>Sales summary against target</Typography>
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default SalesTargets;
