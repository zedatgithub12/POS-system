import { useState } from 'react';

// material-ui
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconCircleCheck } from '@tabler/icons';
// project imports

// ==============================|| ADD NEW COMPONENTS ||============================== //

const LowStocks = ({ stocks }) => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                borderRadius: 2,
                borderWidth: 1,
                borderColor: theme.palette.grey[400],
                padding: 1
            }}
        >
            {stocks.length === 0 ? (
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
                stocks.map((item) => (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                        <Typography
                            sx={{
                                fontSize: theme.typography.body2,
                                fontWeight: theme.typography.fontWeightMedium,
                                color: theme.palette.primary.dark
                            }}
                        >
                            {item.name}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: theme.typography.body2,
                                fontWeight: theme.typography.fontWeightMedium,
                                color: theme.palette.primary.dark
                            }}
                        >
                            {item.min_quantity} {item.unit}
                        </Typography>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default LowStocks;
