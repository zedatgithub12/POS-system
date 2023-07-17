import { useState } from 'react';

// material-ui
import { Grid, Typography, Box, Divider, FormControl, Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports

// ==============================|| ADD NEW COMPONENTS ||============================== //

const LowStocks = ({ stocks, shops }) => {
    const [shopFilter, setShopFilter] = useState();
    const theme = useTheme();

    const handleShopFilterChange = (event) => {
        setShopFilter(event.target.value);
    };
    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, borderRadius: 2, paddingY: 1, marginTop: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 1.5 }}>
                <Typography
                    sx={{
                        fontSize: theme.typography.h4,
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.primary.dark,
                        marginLeft: 1
                    }}
                >
                    Low Stocks
                </Typography>
                <FormControl>
                    <Select value={shopFilter} onChange={handleShopFilterChange}>
                        {Array.from(new Set(shops.map((item) => item.name))).map((shop) => (
                            <MenuItem key={shop} value={shop}>
                                {shop}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Divider />

            <Box
                sx={{
                    padding: 1.2,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: theme.palette.grey[400],
                    margin: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Typography
                    sx={{
                        fontSize: theme.typography.body2,
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.primary.dark
                    }}
                >
                    Rice
                </Typography>

                <Typography
                    sx={{
                        fontSize: theme.typography.body2,
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.primary.dark
                    }}
                >
                    12 KG
                </Typography>
            </Box>
        </Box>
    );
};

export default LowStocks;
