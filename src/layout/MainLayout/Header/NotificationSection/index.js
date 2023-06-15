import { useState, useRef, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Badge,
    ButtonBase,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    Typography,
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { IconBell, IconBellRinging } from '@tabler/icons';
import StockAlert from './StockAlert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import Connections from 'api';

// notification status options

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    //unseen comment filtering
    const unseenCount =
        users.role === 'Admin'
            ? notifications.filter((item) => item.status === 'unseen')
            : notifications.filter((item) => item.salesstatus === 'unseen');

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const getNotification = () => {
        var AdminApi = Connections.api + Connections.adminnotification;
        var saleApi = Connections.api + Connections.salesnotification + users.store_id;
        var Api = users.role === 'Admin' ? AdminApi : saleApi;
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
                    setNotifications(response.data);
                } else {
                    setNotifications(notifications);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleOpenNotification = (notificationInfo) => {
        navigate('/view-product', { state: { ...notificationInfo } });
        setOpen(false);
    };

    useEffect(() => {
        var AdminApi = Connections.api + Connections.adminnotification;
        var saleApi = Connections.api + Connections.salesnotification + users.store_id;
        var Api = users.role === 'Admin' ? AdminApi : saleApi;

        const eventSource = new EventSource(Api);

        eventSource.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            setNotifications((notifications) => [...notifications, data]); // append new post to the existing array
        });

        const intervalId = setInterval(() => {
            getNotification();
        }, 5000);
        return () => {
            eventSource.close();
            clearInterval(intervalId);
        };
    }, []);
    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    mr: 3,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    {unseenCount.length > 0 && (
                        <Badge
                            badgeContent={unseenCount.length}
                            color="error"
                            sx={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                zIndex: 1
                            }}
                        />
                    )}

                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            color: theme.palette.primary.light,
                            background: theme.palette.primary.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                color: theme.palette.primary.dark,
                                background: theme.palette.background.default
                            }
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                        color="inherit"
                    >
                        <IconBell stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 2, px: 2 }}>
                                                <Grid item>
                                                    <Stack direction="row" spacing={2}>
                                                        <Typography variant="subtitle1">Notifications</Typography>
                                                    </Stack>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <PerfectScrollbar
                                                style={{ height: '100%', maxHeight: 'calc(100vh - 205px)', overflowX: 'hidden' }}
                                            >
                                                <Grid container direction="column" spacing={2}>
                                                    <Grid item xs={12} p={0}>
                                                        <Divider sx={{ my: 0 }} />
                                                    </Grid>
                                                </Grid>
                                                {notifications.length > 0 ? (
                                                    notifications.map((notice, index) => (
                                                        <StockAlert
                                                            key={index}
                                                            type={notice.type}
                                                            title={notice.title}
                                                            date={notice.created_at}
                                                            message={notice.message}
                                                            status={notice.status}
                                                            salesstatus={notice.salesstatus}
                                                            onPress={() => handleOpenNotification(notice)}
                                                        />
                                                    ))
                                                ) : (
                                                    <Box
                                                        padding={6}
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexDirection: 'column',
                                                            color: theme.palette.grey[500]
                                                        }}
                                                    >
                                                        <IconBellRinging size={30} />
                                                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                                                            No Notification!
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </PerfectScrollbar>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default NotificationSection;
