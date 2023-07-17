import { useState } from 'react';
// material-ui
import { Grid, Typography, Box, Divider, FormControl, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports

// ==============================|| ADD NEW COMPONENTS ||============================== //

const SalesTargets = ({ total, shops }) => {
    const [shopFilter, setShopFilter] = useState();
    const theme = useTheme();

    const handleShopFilterChange = (event) => {
        setShopFilter(event.target.value);
    };
    return (
        <Grid item xs={8.4} sx={{ backgroundColor: '#fff', borderRadius: 2, padding: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 1 }}>
                <FormControl className=" ">
                    <Select value={shopFilter} onChange={handleShopFilterChange}>
                        {Array.from(new Set(shops.map((item) => item.name))).map((shop) => (
                            <MenuItem key={shop} value={shop}>
                                {shop}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                <Grid item xs={3.8}>
                    <Box
                        sx={{
                            backgroundColor: theme.palette.background.default,

                            marginY: 2,
                            borderRadius: 1.5,
                            border: 1,
                            borderColor: theme.palette.grey[300]
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ paddingLeft: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}>Daily</Typography>
                            <Typography
                                sx={{
                                    paddingRight: 1.8,
                                    paddingY: 1,
                                    fontSize: theme.typography.h4,
                                    fontWeight: theme.typography.fontWeightRegular
                                }}
                            >
                                100%
                            </Typography>
                        </Box>

                        <Divider />
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
                                <Typography sx={{ fontSize: theme.typography.h3 }}>30k</Typography>
                                <Typography>Target</Typography>
                            </Grid>

                            <Grid item xs={6} sx={{ padding: 2 }}>
                                <Typography sx={{ fontSize: theme.typography.h3 }}>32k</Typography>
                                <Typography>Collected</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
                <Grid
                    item
                    xs={3.8}
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
                        <Typography
                            sx={{
                                paddingRight: 1.8,
                                paddingY: 1,
                                fontSize: 16,
                                fontWeight: theme.typography.fontWeightRegular,
                                color: theme.palette.background.default
                            }}
                        >
                            86%
                        </Typography>
                    </Box>

                    <Divider />
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
                            <Typography sx={{ fontSize: 24, color: theme.palette.background.default }}>30k</Typography>
                            <Typography sx={{ color: theme.palette.background.default }}>Target</Typography>
                        </Grid>

                        <Grid item xs={6} sx={{ padding: 2 }}>
                            <Typography sx={{ fontSize: 24, color: theme.palette.background.default }}>32k</Typography>
                            <Typography sx={{ color: theme.palette.background.default }}>Collected</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3.8}>
                    <Box
                        sx={{
                            backgroundColor: theme.palette.background.default,

                            marginY: 2,
                            borderRadius: 1.5,
                            border: 1,
                            borderColor: theme.palette.grey[300]
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ paddingLeft: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}>Annually</Typography>
                            <Typography
                                sx={{
                                    paddingRight: 1.8,
                                    paddingY: 1,
                                    fontSize: theme.typography.h4,
                                    fontWeight: theme.typography.fontWeightRegular
                                }}
                            >
                                74%
                            </Typography>
                        </Box>

                        <Divider />
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
                                <Typography sx={{ fontSize: theme.typography.h3 }}>30k</Typography>
                                <Typography>Target</Typography>
                            </Grid>

                            <Grid item xs={6} sx={{ padding: 2 }}>
                                <Typography sx={{ fontSize: theme.typography.h3 }}>32k</Typography>
                                <Typography>Collected</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default SalesTargets;
