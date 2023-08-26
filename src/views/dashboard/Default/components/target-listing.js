import { useState, forwardRef } from 'react';
// material-ui

import {
    Grid,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from '@mui/material';
import {
    IconArrowBigDownLines,
    IconArrowBigUpLines,
    IconArrowDown,
    IconArrowUp,
    IconChevronLeft,
    IconChevronRight,
    IconCircleCheck,
    IconList
} from '@tabler/icons';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { calculatePercentage, formatNumber, DateFormatter, Achievement } from 'utils/functions';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Pagination from '@mui/material/Pagination';
import { Preferences } from 'preferences';
import { useEffect } from 'react';
import Connections from 'api';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { ActivityIndicators } from 'ui-component/activityIndicator';

// project imports

// ==============================|| target listing component ||============================== //
const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ITEM_HEIGHT = 20;
const TargetListing = (props) => {
    const theme = useTheme();

    const { lists, shopname } = props;

    const thirtydays = lists.thirtydays;

    const datalength = thirtydays ? thirtydays.length : 1;
    const [days, setThirtydays] = useState(thirtydays ? thirtydays : []);
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [numPages] = useState(Math.ceil(datalength / Preferences.numPerPage));
    const [popup, setPopup] = useState({
        status: false,
        severity: 'info',
        message: ''
    });
    const handlePopUpClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });
    };

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const [currentDate, setCurrentDate] = useState(new Date());
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const monthShortName = monthName.slice(0, 3);

    const handleNextMonth = async () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    const handlePreviousMonth = async () => {
        setCurrentDate((prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const csvExport = () => {
        handleClose();
    };

    const handleChangePage = (event, value) => {
        setPage(value);
    };

    const getTargets = () => {
        setLoading(true);
        var Api = Connections.api + Connections.monthlytarget + monthName + `?shop=${shopname}`;
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
                    setThirtydays(response.data);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'error fetching monthly summary'
                });
                setLoading(false);
            });
    };
    useEffect(() => {
        getTargets();
        return () => {};
    }, [currentDate]);

    useEffect(() => {
        setThirtydays(lists.thirtydays);
        return () => {};
    }, [lists]);

    const handleDownloadExcel = () => {
        const sheetData = days.map((item) => [
            item.date,
            lists.target.r_daily,
            item.totalRevenue,
            parseInt(item.totalRevenue) - parseInt(lists.target.r_daily),
            calculatePercentage(parseInt(item.totalRevenue), parseInt(lists.target.r_daily)) + '%'
        ]);

        const sheet = XLSX.utils.aoa_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet 1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'excel-report.xlsx');
    };

    const sustract = (first, second) => {
        return first - second;
    };
    return (
        <Grid container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            {shopname && lists.target && (
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginY: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', paddingX: 2 }}>
                        <IconButton
                            aria-label="previous"
                            id="long-button"
                            disabled={loading ? true : false}
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handlePreviousMonth}
                            marginX={2}
                        >
                            <IconChevronLeft size={16} />
                        </IconButton>
                        <Typography variant="subtitle1" sx={{ marginX: 1 }}>
                            {monthShortName}
                        </Typography>

                        <IconButton
                            aria-label="next"
                            id="long-button"
                            disabled={loading ? true : false}
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleNextMonth}
                            marginX={2}
                        >
                            <IconChevronRight size={16} />
                        </IconButton>
                    </Box>

                    <div>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button'
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch'
                                }
                            }}
                        >
                            <MenuItem onClick={handleDownloadExcel}>Export Excel </MenuItem>
                            {/* <MenuItem onClick={handleDownloadCSV}>CSV</MenuItem> */}
                        </Menu>
                    </div>
                </Grid>
            )}

            {days ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Achievement</TableCell>
                                <TableCell>Difference</TableCell>
                                <TableCell>Achievement(%)</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Box sx={{ minHeight: 188, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <ActivityIndicators />
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : days.length > 0 ? (
                                days.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{DateFormatter(item.date)}</TableCell>
                                        <TableCell>{formatNumber(lists.target.r_daily)}</TableCell>
                                        <TableCell>
                                            <Typography
                                                sx={{
                                                    color: theme.palette.primary.dark,
                                                    fontWeight: theme.typography.fontWeightMedium
                                                }}
                                            >
                                                {formatNumber(item.totalRevenue)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{formatNumber(parseInt(item.totalRevenue) - parseInt(lists.target.r_daily))}</TableCell>

                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        paddingRight: 1
                                                    }}
                                                >
                                                    {Achievement(parseInt(item.totalRevenue), parseInt(lists.target.r_daily)) ===
                                                    'achieved' ? (
                                                        <IconArrowUp size={16} color={theme.palette.success.dark} />
                                                    ) : (
                                                        <IconArrowDown size={16} color={theme.palette.error.main} />
                                                    )}
                                                </Typography>

                                                <Typography sx={{ marginLeft: 2, fontWeight: theme.typography.fontWeightMedium }}>
                                                    {calculatePercentage(parseInt(item.totalRevenue), parseInt(lists.target.r_daily))}%
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Grid container component={Paper} sx={{ paddingY: 4, borderRadius: 2 }}>
                                            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <IconList size={48} color={theme.palette.primary.main} />
                                                    <Typography>List of target and achievement for selected shop</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    {days.length > Preferences.numPerPage && (
                        <Box marginY={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Pagination count={numPages} page={page} onChange={handleChangePage} />
                        </Box>
                    )}
                </TableContainer>
            ) : (
                <Grid container component={Paper} sx={{ paddingY: 4, borderRadius: 2 }}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <IconList size={48} color={theme.palette.primary.main} />
                            <Typography>List of target and achievement for selected shop</Typography>
                        </Box>
                    </Grid>
                </Grid>
            )}
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handlePopUpClose}>
                <Alert onClose={handlePopUpClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

TargetListing.propTypes = {
    lists: PropTypes.array
};
export default TargetListing;
