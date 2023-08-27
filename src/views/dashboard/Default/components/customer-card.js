// material-ui
import { Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { formatNumber } from 'utils/functions';
// project imports

// ==============================|| ADD NEW COMPONENTS ||============================== //

const CustomerCard = ({ total, addedToday }) => {
    const theme = useTheme();

    return (
        <Box sx={{ backgroundColor: theme.palette.background.default, borderRadius: 2, paddingY: 1, marginTop: 1 }}>
            <Box
                sx={{
                    padding: 2,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: theme.palette.grey[400],
                    backgroundColor: theme.palette.background,

                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Typography
                    sx={{
                        fontSize: theme.typography.h4,
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.primary.dark,
                        marginLeft: 1
                    }}
                >
                    Total Customer
                </Typography>

                <Box>
                    {addedToday !== 0 && (
                        <Typography
                            sx={{
                                fontSize: theme.typography.h5,
                                fontWeight: theme.typography.fontWeightMedium,
                                color: theme.palette.success.dark,
                                backgroundColor: theme.palette.success.light,
                                borderRadius: 4,
                                textAlign: 'center'
                            }}
                        >
                            +{formatNumber(parseInt(addedToday))}
                        </Typography>
                    )}

                    <Typography
                        sx={{
                            fontSize: theme.typography.h3,
                            fontWeight: theme.typography.fontWeightMedium,
                            color: theme.palette.primary.dark,
                            marginRight: 3
                        }}
                    >
                        {formatNumber(parseInt(total))}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerCard;
