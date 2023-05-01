import React, { useState, forwardRef } from 'react';
// material-ui
import { Grid, Typography, Button, Divider } from '@mui/material';

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

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
// ==============================|| SHOP DETAIL PAGE ||============================== //

const ViewShop = () => {
    const { state } = useLocation();
    const shop = state;

    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };

    const [open, setOpen] = useState(false);
    const [alerttype, setAlertType] = useState('close');

    const handleClickOpen = (type) => {
        setOpen(true);
        setAlertType(type);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const OpenShop = () => {
        setOpen(false);
        console.log('Opened');
    };
    const CloseShop = () => {
        setOpen(false);
        console.log('Closed');
    };
    const DeleteShop = () => {
        setOpen(false);
        console.log('Deleted');
    };
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
                                <Button onClick={GoBack} variant="outlined" color="secondary" sx={{ textDecoration: 'none' }}>
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
                            container
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                            className="bg-light"
                            style={{
                                marginTop: 10,
                                borderRadius: 6,
                                padding: 6,
                                paddingRight: 20,
                                paddingLeft: 14
                            }}
                        >
                            <Grid item>
                                <img
                                    src={shop.picture}
                                    alt="Shop Profile Preview"
                                    style={{ width: '100%', marginTop: 10, marginBottom: 10, borderRadius: 8 }}
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
                                <Typography variant="h4">{shop.manager}</Typography>
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
                                <Typography variant="h4">{shop.created_at}</Typography>
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
                                <Button variant="text" color="error" className="me-3 w-25 " onClick={() => handleClickOpen('delete')}>
                                    Delete
                                </Button>
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
                            marginTop: 10,
                            marginLeft: 10,
                            borderRadius: 6,
                            padding: 6,
                            paddingRight: 20,
                            paddingLeft: 20
                        }}
                    >
                        <Grid
                            item
                            container
                            direction="row"
                            className="bg-light p-2 ps-3 rounded"
                            style={{
                                borderRadius: 6,
                                padding: 6
                            }}
                        >
                            <Typography variant="body2">Status</Typography>
                            <Typography variant="h4" style={{ marginLeft: 5, textTransform: 'capitalize' }}>
                                {shop.status}
                            </Typography>
                        </Grid>

                        <Grid
                            item
                            container
                            direction="row"
                            justifyContent=""
                            className=" pt-3 rounded"
                            style={{
                                borderRadius: 6
                            }}
                        >
                            <Button
                                variant="outlined"
                                color="secondary"
                                className="me-3 w-25"
                                onClick={() =>
                                    navigate('/update-shop', {
                                        state: { ...shop }
                                    })
                                }
                            >
                                Update
                            </Button>
                            {shop.status === 'close' ? (
                                <Button variant="text" color="secondary" className="me-3" onClick={() => handleClickOpen('open')}>
                                    Open
                                </Button>
                            ) : (
                                <Button variant="text" color="secondary" className="me-3" onClick={() => handleClickOpen('close')}>
                                    Close
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </MainCard>

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
                            ? 'Do you want to delete this Shop?'
                            : 'Do you want to close this Shop?'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {alerttype === 'open' ? (
                        <Button onClick={OpenShop}>Yes</Button>
                    ) : alerttype === 'delete' ? (
                        <Button onClick={DeleteShop}>Yes</Button>
                    ) : (
                        <Button onClick={CloseShop}>Yes</Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ViewShop;