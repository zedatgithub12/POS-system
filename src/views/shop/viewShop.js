import React, { useState, forwardRef, useEffect } from 'react';
// material-ui
import { Grid, Typography, Button, Divider, TextField, MenuItem, FormControl, Select } from '@mui/material';
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
import PopularCard from 'views/dashboard/Default/PopularCard';
import TotalOrderLineChartCard from 'views/dashboard/Default/TotalOrderLineChartCard';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import TotalIncomeLightCard from 'views/dashboard/Default/TotalIncomeLightCard';
import Connections from 'api';
import LowProducts from 'views/dashboard/Default/LowProducts';

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

    const [shops, setShops] = useState([]);
    const [activeShops, setActiveShops] = useState([]);
    const [shopFilter, setShopFilter] = useState(shop.name);
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
            body: JSON.stringify(data)
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
            headers: headers
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

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const response = await fetch(Connections.api + Connections.shopstat + `?shop=${shopFilter}&month=${month}&year=${year}`);
            const data = await response.json();
            if (data.success) {
                setStat(data.data);
                setActiveShops(data.data.shopInfo);
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
                headers: headers
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
                        message: 'There is error creatng shop!'
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
                headers: headers
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

        return () => {};
    }, []);
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
                    <Grid item lg={7} md={6} sm={6} xs={12}>
                        <Grid
                            item
                            xs={12}
                            style={{
                                marginTop: 14,
                                borderRadius: 6,
                                padding: 6,
                                paddingRight: 20,
                                paddingLeft: 14
                            }}
                        >
                            <Grid container spacing={gridSpacing}>
                                <Grid item lg={8} md={12} sm={12} xs={12}>
                                    <TotalOrderLineChartCard
                                        isLoading={isLoading}
                                        dailySales={stat.dailySales ? stat.dailySales : 0}
                                        monthlysales={stat.monthlySales ? stat.monthlySales : 0}
                                        anualsales={stat.annualSales ? stat.annualSales : 0}
                                        todatesales={stat.todatesales ? stat.todatesales : 0}
                                    />
                                </Grid>
                                <Grid item lg={4} md={12} sm={12} xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item sm={12} xs={12} md={12} lg={12}>
                                            <TotalIncomeDarkCard
                                                isLoading={isLoading}
                                                totalProducts={stat.totalProducts ? stat.totalProducts : 0}
                                            />
                                        </Grid>
                                        <Grid item sm={12} xs={12} md={12} lg={12}>
                                            <TotalIncomeLightCard
                                                isLoading={isLoading}
                                                totalcustomers={stat.totalCustomers ? stat.totalCustomers : 0}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            style={{
                                marginTop: 4,
                                marginLeft: 4,
                                borderRadius: 6,
                                padding: 6,
                                paddingRight: 18,
                                paddingLeft: 10
                            }}
                        >
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12} md={6}>
                                    <PopularCard isLoading={isLoading} topProducts={stat.topProducts} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LowProducts isLoading={isLoading} lowProducts={stat.lowProducts} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

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
                            paddingRight: 20,
                            paddingLeft: 20
                        }}
                    >
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
                                <Typography variant="body2">Shop Address</Typography>
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
                                    variant="outlined"
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
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ViewShop;
