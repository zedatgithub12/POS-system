import React, { useState, forwardRef, useEffect } from 'react';
// material-ui
import {
    Grid,
    Box,
    Typography,
    Button,
    Divider,
    TextField,
    MenuItem,
    FormControl,
    Select,
    CircularProgress,
    InputLabel
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useLocation, useNavigate } from 'react-router-dom';
import { gridSpacing } from 'store/constant';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Connections from 'api';
import SalesTargets from 'views/dashboard/Default/components/sales-against-target';
import { useTheme } from '@mui/material/styles';
import { ShopStatus } from 'data/shopStatus';
import LineChartComponent from './components/linechart';
import TargetListing from 'views/dashboard/Default/components/target-listing';
import { SparkLineChart } from '@mui/x-charts';
import MonthlyRevenueChart from './components/monthlyChart';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
// ==============================|| SHOP DETAIL PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ViewShop = () => {
    const { state } = useLocation();
    const shop = state;
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);

    const theme = useTheme();
    const [shops, setShops] = useState([]);
    const [activeShops, setActiveShops] = useState([]);
    const [shopFilter, setShopFilter] = useState(shop.name);
    const [revenueTarget, setRevenueTarget] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [stat, setStat] = useState([]);
    const [month] = useState('');
    const [year] = useState('');
    const [users, setUsers] = useState([]);
    const [managername, setManagerName] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [open, setOpen] = useState(false);
    const [alerttype, setAlertType] = useState('close');
    const [spinner, setSpinner] = useState(false);
    const [shopStatus, setShopStatus] = useState('Pending');
    const [statusDialog, setStatusDialog] = useState(false);
    const [statusLoader, setStatusLoader] = useState(false);

    const [popup, setPopup] = useState({
        status: false,
        severity: 'info',
        message: ''
    });

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handleStatusOpen = (event) => {
        setShopStatus(event.target.value);
        setStatusDialog(true);
    };

    const handleStatusClose = () => {
        setStatusDialog(false);
    };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });
    };

    const handleClickOpen = (type) => {
        setOpen(true);
        setAlertType(type);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const OpenShop = () => {
        setOpen(false);
    };
    const CloseShop = () => {
        setOpen(false);
    };

    const handleShopFilterChange = (event) => {
        setShopFilter(event.target.value);
        getTargets(event.target.value);
    };

    const AddManager = () => {
        setSpinner(true);
        var Api = Connections.api + Connections.addmanager + shop.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            manager_id: managername.id,
            manager: managername.name
        };
        // Make the API call using fetch()
        fetch(Api, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
            cache: 'no-cache'
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'success',
                        message: response.message
                    });
                    setSpinner(false);
                    handleAddDialogClose();
                } else {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: response.message
                    });
                    setSpinner(false);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error adding manager!'
                });
                setSpinner(false);
            });
    };
    const DeleteShop = () => {
        setOpen(false);

        // Handle form submission here
        // Declare the data to be sent to the API
        var Api = Connections.api + Connections.deletestore + shop.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        // Make the API call using fetch()
        fetch(Api, {
            method: 'DELETE',
            headers: headers,
            cache: 'no-cache'
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'success',
                        message: response.message
                    });
                    GoBack();
                } else {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: response.message
                    });
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error deleting shop!'
                });
            });
    };

    const getTargets = (name) => {
        var Api = Connections.api + Connections.againsttarget + name;
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
                    setRevenueTarget(response.data);
                } else {
                    setRevenueTarget([]);
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching targets!'
                });
            });
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await fetch(Connections.api + Connections.shopstat + `?shop=${shopFilter}&month=${month}&year=${year}`, {
                cache: 'no-cache'
            });
            const data = await response.json();
            if (data.success) {
                setStat(data.data);
                setActiveShops(data.data.shopInfo);
                setShopStatus(data.data.shopInfo.last_status ? data.data.shopInfo.last_status : 'Pending');
                setLoading(false);
            }
        };

        fetchData();
    }, [month, year, popup, shopFilter]);

    useEffect(() => {
        const getShops = () => {
            var Api = Connections.api + Connections.viewstore;
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
                        setShops(response.data);
                    } else {
                        setShops(shops);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error getting shop!'
                    });
                });
        };
        const getUsers = () => {
            var Api = Connections.api + Connections.viewuser;
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
                        setUsers(response.data);
                    } else {
                        setUsers(userData);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error featching  users!'
                    });
                });
        };

        getUsers();
        getShops();
        getTargets(shop.name);

        return () => {};
    }, []);

    const handleStatusUpdate = () => {
        setStatusLoader(true);
        var ApiUrl = Connections.api + Connections.changeStatus;
        const headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };
        const data = {
            shop_id: activeShops.id,
            user_id: user.id,
            status: shopStatus
        };

        fetch(ApiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.success) {
                    setStatusLoader(false);
                    setStatusDialog(false);
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'success',
                        message: 'Successfully done!'
                    });
                } else {
                    setStatusLoader(false);
                    setStatusDialog(false);
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'Unable to change status'
                    });
                }
            })
            .catch(() => {
                setStatusLoader(false);
                setStatusDialog(false);
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error changing shop status!'
                });
            });
    };
    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <FormControl className="ms-2 my-2 ">
                                        <Select value={shopFilter} onChange={handleShopFilterChange}>
                                            {Array.from(new Set(shops.map((item) => item.name))).map((shop) => (
                                                <MenuItem key={shop} value={shop}>
                                                    {shop}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button onClick={GoBack} variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                    Back
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12} spacing={2}></Grid>

                <Grid container justifyContent="center">
                    <Grid
                        item
                        container
                        direction="column"
                        lg={4}
                        md={6}
                        sm={6}
                        xs={12}
                        style={{
                            marginTop: 4,
                            marginLeft: 4,
                            borderRadius: 6,
                            padding: 6,
                            paddingX: 8
                        }}
                    >
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">Status</Typography>
                            </Grid>
                            <Grid item>
                                <Select value={shopStatus} onChange={handleStatusOpen}>
                                    {ShopStatus.map((status, index) => (
                                        <MenuItem key={index} value={status.label}>
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                            className="bg-light"
                            style={{
                                marginTop: 2,
                                borderRadius: 6,
                                padding: 6,
                                paddingRight: 10,
                                paddingLeft: 8
                            }}
                        >
                            <Grid item>
                                <img
                                    src={
                                        activeShops.profile_image
                                            ? Connections.images + activeShops.profile_image
                                            : Connections.images + '646137991fd91.jpg'
                                    }
                                    alt="Shop Profile Preview"
                                    style={{ width: '100%', borderRadius: 8 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">Shop ID</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4">{activeShops.id}</Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">Shop Address</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{activeShops.address}</Typography>
                            </Grid>
                        </Grid>
                        {activeShops.tin_number != 0 && (
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                                justifyContent="space-between"
                                spacing={1}
                                className="bg-light"
                                style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                            >
                                <Grid item>
                                    <Typography variant="body2">TIN Number</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h5">{activeShops.tin_number}</Typography>
                                </Grid>
                            </Grid>
                        )}

                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">Category</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{activeShops.category}</Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">Region</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{activeShops.region}</Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">City</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{activeShops.city}</Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">Subcity</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{activeShops.address}</Typography>
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2"> Manager</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">
                                    {activeShops.manager ? activeShops.manager : <Button onClick={() => handleAddDialogOpen()}>Add</Button>}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2"> Phone</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h5">{activeShops.phone}</Typography>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                            className="bg-light"
                            style={{ marginTop: 10, borderRadius: 6, padding: 6, paddingRight: 20, paddingLeft: 20 }}
                        >
                            <Grid item>
                                <Typography variant="body2">Created at</Typography>
                            </Grid>
                            {activeShops.created_at && (
                                <Grid item>
                                    <Typography variant="h5">
                                        {activeShops.created_at.slice(8, 10) +
                                            '/' +
                                            activeShops.created_at.slice(5, 7) +
                                            '/' +
                                            activeShops.created_at.slice(0, 4)}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>

                        <Grid
                            container
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            style={{ marginTop: 10, borderRadius: 6, paddingRight: 20 }}
                        >
                            <Grid item>
                                <Button
                                    variant="text"
                                    color="primary"
                                    className="me-3 w-25"
                                    onClick={() =>
                                        navigate('/update-shop', {
                                            state: { ...activeShops }
                                        })
                                    }
                                >
                                    {spinner ? (
                                        <div className="spinner-border spinner-border-sm text-dark " role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    ) : (
                                        'Update'
                                    )}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="text" color="error" className="me-3 w-25 " onClick={() => handleClickOpen('delete')}>
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item lg={7} md={6} sm={6} xs={12}>
                        <Grid
                            item
                            xs={12}
                            style={{
                                marginTop: 4,
                                marginLeft: 4,
                                borderRadius: 6,
                                padding: 6
                            }}
                        >
                            {isLoading ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 6
                                    }}
                                >
                                    <CircularProgress size={24} />
                                    <Typography
                                        sx={{
                                            marginLeft: 2,

                                            justifyContent: 'center',
                                            fontSize: theme.typography.h4,
                                            fontWeight: theme.typography.fontWeightRegular
                                        }}
                                    >
                                        Loading...
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <SalesTargets targets={revenueTarget} />
                                    {/* <TargetListing lists={revenueTarget} />
                                    <LineChartComponent data={revenueTarget.thirtydays} /> */}
                                    {revenueTarget.monthlytotal && <MonthlyRevenueChart monthlyTotal={revenueTarget.monthlytotal} />}
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>

            <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
                <DialogTitle>Add Manager</DialogTitle>

                <DialogContent>
                    <TextField
                        required
                        fullWidth
                        select
                        label="Manager"
                        className="mt-3"
                        value={managername.id}
                        onChange={(event) => setManagerName(event.target.value)}
                    >
                        {users.map((option) => (
                            <MenuItem key={option.id} value={option}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => AddManager()} color="primary" variant="container">
                        {spinner ? (
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Save'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{alerttype === 'open' ? 'Open Shop' : alerttype === 'delete' ? 'Delete Shop' : 'Close Shop'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {alerttype === 'open'
                            ? 'Do you want to reopen ' + shop.name + ' ?'
                            : alerttype === 'delete'
                            ? 'Do you want to delete ' + shop.name + ' Shop?'
                            : 'Do you want to close this Shop?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {alerttype === 'open' ? (
                        <Button onClick={OpenShop}>Yes</Button>
                    ) : alerttype === 'delete' ? (
                        <Button onClick={() => DeleteShop()}>Yes</Button>
                    ) : (
                        <Button onClick={CloseShop}>Yes</Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={statusDialog} onClose={handleStatusClose}>
                <DialogContent>
                    Does {shop.name ? shop.name : ''} is <strong>{shopStatus} </strong> ?
                </DialogContent>
                <DialogActions>
                    <Button variant="text" sx={{ color: theme.palette.primary.main }} onClick={handleStatusClose}>
                        No
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => handleStatusUpdate()}>
                        {statusLoader ? (
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Yes'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ViewShop;
