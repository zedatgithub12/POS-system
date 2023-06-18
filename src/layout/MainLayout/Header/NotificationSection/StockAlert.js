// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Divider, Grid, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@mui/material';

// assets
import { IconBuildingStore, IconChartInfographic } from '@tabler/icons';
import PropTypes from 'prop-types';
// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
    cursor: 'pointer',
    padding: 16,
    '&:hover': {
        background: theme.palette.primary.light
    },
    '& .MuiListItem-root': {
        padding: 0
    }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const StockAlert = ({ type, title, date, message, status, onPress, salesstatus }) => {
    const theme = useTheme();
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);

    var noticestatus = users.role === 'Admin' ? status : salesstatus;
    // const getTimeSinceReceived = (time) => {
    //     const [hours, minutes, seconds] = time.split(':');
    //     const receivedAt = new Date();
    //     receivedAt.setHours(hours);
    //     receivedAt.setMinutes(minutes);
    //     receivedAt.setSeconds(seconds);

    //     const now = Date.now();
    //     const difference = now - receivedAt.getTime();
    //     const secondsElapsed = Math.floor(difference / 1000);
    //     const minutesElapsed = Math.floor(secondsElapsed / 60);
    //     const hoursElapsed = Math.floor(minutesElapsed / 60);
    //     const daysElapsed = Math.floor(hoursElapsed / 24);

    //     if (daysElapsed > 0) {
    //         const remainingHours = hoursElapsed % 24;
    //         return `${daysElapsed} day${daysElapsed === 1 ? '' : 's'}, ${remainingHours.toString().padStart(2, '0')}`;
    //     } else if (hoursElapsed > 0) {
    //         return `${hoursElapsed.toString().padStart(1, '0')} h`;
    //     } else if (minutesElapsed > 0) {
    //         return `${minutesElapsed.toString().padStart(1, '0')} m`;
    //     } else {
    //         return `${seconds.toString().padStart(1, '0')} s`;
    //     }
    // };
    const DateSlice = (date) => {
        var month = date.slice(5, 7);
        var day = date.slice(8, 10);
        return day + '-' + month;
    };
    return (
        <List
            sx={{
                width: '100%',
                maxWidth: 400,
                py: 0,
                background: noticestatus === 'seen' ? theme.palette.background.default : theme.palette.primary.light,
                [theme.breakpoints.down('md')]: {
                    maxWidth: 400
                },
                '& .MuiListItemSecondaryAction-root': {
                    top: 22
                },
                '& .MuiDivider-root': {
                    my: 0
                },
                '& .list-container': {
                    pl: 7
                }
            }}
            onClick={onPress}
        >
            <ListItemWrapper>
                <ListItem alignItems="center">
                    <ListItemAvatar>
                        <Avatar
                            sx={{
                                color: theme.palette.primary.dark,
                                backgroundColor: theme.palette.primary.light,
                                border: 'none',
                                borderColor: theme.palette.warning.main
                            }}
                        >
                            {type === 'stock' ? (
                                <IconBuildingStore stroke={1.5} size="1.3rem" />
                            ) : type === 'sales' ? (
                                <IconChartInfographic stroke={1.5} size="1.3rem" />
                            ) : (
                                <IconBuildingStore stroke={1.5} size="1.3rem" />
                            )}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={<Typography variant="subtitle1">{title}</Typography>} />
                    <ListItemSecondaryAction>
                        <Grid container justifyContent="flex-end">
                            <Grid item xs={12}>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {DateSlice(date)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </ListItemSecondaryAction>
                </ListItem>
                <Grid container direction="column" className="list-container">
                    <Grid item xs={12}>
                        <Typography
                            variant="subtitle2"
                            noWrap={false}
                            style={{
                                lineHeight: '1.2em',
                                maxHeight: '2.4em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 3
                            }}
                        >
                            {message}
                        </Typography>
                    </Grid>
                </Grid>
            </ListItemWrapper>
            <Divider />
        </List>
    );
};
StockAlert.propTypes = {
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    message: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['seen', 'unseen']).isRequired,
    onPress: PropTypes.func.isRequired,
    salesstatus: PropTypes.oneOf(['seen', 'unseen']).isRequired
};

export default StockAlert;
