import { useState, useEffect, forwardRef } from 'react';

// material-ui
import {
    Grid,
    Divider,
    Box,
    Paper,
    Autocomplete,
    InputAdornment,
    Button,
    IconButton,
    Typography,
    TextField,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHead
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Delete } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Connections from 'api';
import { gridSpacing } from 'store/constant';
import packages from 'assets/images/Empty.svg';
import { DateFormatter } from 'utils/functions';
import { ActivityIndicators } from 'ui-component/activityIndicator';
// ==============================|| CREATE PACKAGE PAGE ||============================== //
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const PackageDetail = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const { state } = useLocation();
    const item = state ? state : {};

    const GoBack = () => {
        navigate(-1);
    };

    const [loading, setLoading] = useState(false);
    const [Items, setItems] = useState([]);
    const [popup, setPopup] = useState({
        status: false,
        severity: 'info',
        message: ''
    });
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setPopup({
            ...popup,
            status: false
        });
    };

    useEffect(() => {
        const getPackageItems = () => {
            setLoading(true);
            var Api = Connections.api + Connections.packagedItems + item.id;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'GET',
                headers: headers,
                cache: 'no-cache'
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setItems(response.data);
                        setLoading(false);
                    } else {
                        setPopup({
                            ...popup,
                            status: true,
                            severity: 'error',
                            message: response.message
                        });
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error package items!'
                    });
                    setLoading(false);
                });
        };

        getPackageItems();

        return () => {};
    }, []);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column">
                                <Grid item>
                                    <Typography variant="h3">Package Detail</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button onClick={GoBack} variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} xl={4} sx={{ paddingX: 6, marginX: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                        <Typography variant="body2" sx={{ marginRight: 4 }}>
                            Name
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {item.name}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                        <Typography variant="body2" sx={{ marginRight: 4 }}>
                            Shop
                        </Typography>
                        <Typography variant="h4">{item.shopname}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                        <Typography variant="body2" sx={{ marginRight: 4 }}>
                            Price
                        </Typography>
                        <Typography variant="h4">{item.price} ETB</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', paddingY: 1 }}>
                        <Typography variant="body2" sx={{ marginRight: 4 }}>
                            Expire date
                        </Typography>
                        <Typography variant="h4">{DateFormatter(item.expiredate)}</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <TableContainer component={Paper} sx={{ bgcolor: theme.palette.primary.light, marginY: 1 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Item Code</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell>Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Box sx={{ minHeight: 80, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <ActivityIndicators />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : Items.length > 0 ? (
                                <TableBody>
                                    {Items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.item_name}</TableCell>
                                            <TableCell>{item.item_code}</TableCell>

                                            <TableCell>
                                                <span className="bg-primary bg-opacity-10 text-primary px-4 py-1 rounded">
                                                    {item.item_sku}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="bg-success bg-opacity-10 text-success px-4 py-1 rounded">
                                                    {item.item_quantity}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            ) : (
                                <TableBody>
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ borderBottom: 0 }}>
                                            <Box padding={3}>
                                                <img src={packages} alt="Add Item" width={300} height={300} />
                                                <Typography variant="h4" color="textSecondary" sx={{ marginY: 4 }}>
                                                    No Item in this Package
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            )}
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default PackageDetail;
