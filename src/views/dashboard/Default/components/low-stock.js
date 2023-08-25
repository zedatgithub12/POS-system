import { useState } from 'react';
import Pagination from '@mui/material/Pagination';
// material-ui
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconCircleCheck } from '@tabler/icons';
import { Preferences } from 'preferences';
// project imports

// ==============================|| ADD NEW COMPONENTS ||============================== //

const LowStocks = ({ stocks }) => {
    const theme = useTheme();
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(Math.ceil(stocks.length / Preferences.numPerPage));
    const handleChangePage = (event, value) => {
        setPage(value);
    };

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
                stocks.slice((page - 1) * Preferences.numPerPage, page * Preferences.numPerPage).map((item) => (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 1 }}>
                        <Typography
                            sx={{
                                fontSize: theme.typography.body2,
                                fontWeight: theme.typography.fontWeightMedium,
                                color: theme.palette.primary.dark
                            }}
                        >
                            {item.item_name}
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: theme.typography.body2,
                                fontWeight: theme.typography.fontWeightMedium,
                                color: theme.palette.primary.dark
                            }}
                        >
                            <span className="bg-danger bg-opacity-10 text-danger px-3 py-1 mx-2 rounded text-capitalize">
                                {item.stock_quantity}
                            </span>
                            {item.stock_unit}
                        </Typography>
                    </Box>
                ))
            )}
            {stocks.length > Preferences.numPerPage && (
                <Box marginTop={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Pagination count={numPages} page={page} onChange={handleChangePage} />
                </Box>
            )}
        </Box>
    );
};

export default LowStocks;
