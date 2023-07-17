// material-ui
import { Typography, Box, Divider, Button, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// project imports

// ==============================|| ADD NEW COMPONENTS ||============================== //

const AddNew = ({ stockbtn, packagebtn, targetbtn }) => {
    const theme = useTheme();
    return (
        <Grid container sx={{ backgroundColor: theme.palette.background.default, borderRadius: 2, paddingY: 1 }}>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 1.5 }}>
                    <Typography
                        sx={{
                            fontSize: theme.typography.h4,
                            fontWeight: theme.typography.fontWeightMedium,
                            color: theme.palette.primary.dark,
                            marginLeft: 1
                        }}
                    >
                        Add New
                    </Typography>
                </Box>
            </Grid>

            <Divider />

            <Grid
                item
                xs={12}
                sx={{
                    padding: 1.2,
                    borderRadius: 2,
                    borderWidth: 1,
                    borderColor: theme.palette.grey[400],
                    margin: 1,
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}
            >
                <Grid item xs={3}>
                    <Button
                        onClick={stockbtn}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: 2,
                            padding: 1,
                            paddingX: 3
                        }}
                    >
                        <Typography variant="h5">Stock</Typography>
                    </Button>
                </Grid>

                <Grid item xs={3}>
                    <Button
                        onClick={packagebtn}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: 2,
                            padding: 1,
                            paddingX: 3
                        }}
                    >
                        <Typography variant="h5">Package</Typography>
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Button
                        onClick={targetbtn}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            backgroundColor: theme.palette.primary.light,
                            borderRadius: 2,
                            padding: 1,
                            paddingX: 3,
                            marginX: 1
                        }}
                    >
                        <Typography variant="h5">Target</Typography>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AddNew;
