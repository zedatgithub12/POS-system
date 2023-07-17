// material-ui
import { Typography, Box, Divider, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports

// ==============================|| ADD NEW COMPONENTS ||============================== //

const CustomerCard = ({ total }) => {
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
                <Typography
                    sx={{
                        fontSize: theme.typography.h4,
                        fontWeight: theme.typography.fontWeightMedium,
                        color: theme.palette.primary.dark
                    }}
                >
                    2342
                </Typography>
            </Box>
        </Box>
    );
};

export default CustomerCard;
