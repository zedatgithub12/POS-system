import React, { useState, forwardRef, useEffect } from 'react';
// material-ui
import { Grid, Typography, Button, Divider, TextField, MenuItem } from '@mui/material';
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
import EarningCard from 'views/dashboard/Default/EarningCard';
import TotalOrderLineChartCard from 'views/dashboard/Default/TotalOrderLineChartCard';
import TotalIncomeDarkCard from 'views/dashboard/Default/TotalIncomeDarkCard';
import TotalIncomeLightCard from 'views/dashboard/Default/TotalIncomeLightCard';
import Connections from 'api';

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
    const DateSlice = (date) => {
        var year = date.slice(0, 4);
        var month = date.slice(5, 7);
        var day = date.slice(8, 10);
        return day + '/' + month + '/' + year;
    };

    const AddManager = () => {
        setSpinner(true);
        var Api = Connections.api + Connections.addmanager + shop.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            manager: managername
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
            const response = await fetch(Connections.api + Connections.shopstat + `?shop=${shop.name}&month=${month}&year=${year}`);
            const data = await response.json();
            if (data.success) {
                setStat(data.data);
            }
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
        fetchData();
        setLoading(false);
    }, [month, year, spinner, popup, shop]);

    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="h3">{shop.name}</Typography>
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

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12} spacing={2}></Grid>

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
                                <Grid item lg={5} md={6} sm={6} xs={12}>
                                    <EarningCard isLoading={isLoading} earnings={stat.monthlyEarnings ? stat.monthlyEarnings : 0} />
                                </Grid>

                                <Grid item lg={4} md={6} sm={6} xs={12}>
                                    <TotalOrderLineChartCard
                                        isLoading={isLoading}
                                        monthlysales={stat.monthlySales ? stat.monthlySales : 0}
                                        anualsales={stat.annualSales ? stat.annualSales : 0}
                                    />
                                </Grid>
                                <Grid item lg={3} md={12} sm={12} xs={12}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item sm={6} xs={12} md={6} lg={12}>
                                            <TotalIncomeDarkCard
                                                isLoading={isLoading}
                                                totalcategories={stat.totalCategories ? stat.totalCategories : 0}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12} md={6} lg={12}>
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
                                <Grid item xs={12} md={12}>
                                    <PopularCard isLoading={isLoading} topProducts={stat.topProducts} />
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
                                    src={Connections.images + shop.profile_image}
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
                                <Typography variant="h4">{shop.address}</Typography>
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
                                <Typography variant="body2">Shop Manager</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4">
                                    {shop.manager ? shop.manager : <Button onClick={() => handleAddDialogOpen()}>Add</Button>}
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
                                <Typography variant="body2">Shop Phone</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="h4">{shop.phone}</Typography>
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
                            <Grid item>
                                <Typography variant="h4">{DateSlice(shop.created_at)}</Typography>
                            </Grid>
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
                                            state: { ...shop }
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
                        value={managername}
                        onChange={(event) => setManagerName(event.target.value)}
                    >
                        {users.map((option) => (
                            <MenuItem key={option.id} value={option.name}>
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
