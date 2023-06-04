import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    Badge,
    Button,
    ButtonBase,
    CardActions,
    Chip,
    ClickAwayListener,
    Divider,
    Grid,
    Paper,
    Popper,
    Stack,
    TextField,
    Typography,
    useMediaQuery
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
// assets
import { IconBell } from '@tabler/icons';
import StockAlert from './StockAlert';
import Connections from 'api';

// notification status options

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [notifications, setNotifications] = useState([]);

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
    const unseenCount = notifications.filter((item) => item.status === 'unseen');

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
                // setPopup({
                //     ...popup,
                //     status: true,
                //     severity: 'error',
                //     message: 'There is error fetching product!'
                // });
            });
    };

    const handleOpenNotification = (id) => {
        var Api = Connections.api + Connections.updateStatus + id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };
        // Make the API call using fetch()
        fetch(Api, {
            method: 'PUT',
            headers: headers
        }).catch((error) => {
            console.log(error);
        });
    };

    useEffect(() => {
        getNotification();
        return () => {};
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
                            background: theme.palette.warning.light,
                            color: theme.palette.warning.dark,
                            '&[aria-controls="menu-list-grow"],&:hover': {
                                background: theme.palette.warning.dark,
                                color: theme.palette.background.default
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
                                                {notifications.map((notice, index) => (
                                                    <StockAlert
                                                        key={index}
                                                        type={notice.type}
                                                        title={notice.title}
                                                        date={notice.created_at}
                                                        message={notice.message}
                                                        status={notice.status}
                                                        onPress={() => handleOpenNotification(notice.id)}
                                                    />
                                                ))}
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
