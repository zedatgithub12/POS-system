import React, { useState, useEffect } from 'react';
// material-ui
import {
    Grid,
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TextField,
    InputAdornment,
    MenuItem,
    TablePagination,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Collapse
} from '@mui/material';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons';
import PropTypes from 'prop-types';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';
// import ProductDummy from 'data/products';
// import UsersData from 'data/users';
import Connections from 'api';

// ==============================|| USERS PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const categories = ['All', 'Admin', 'Sales'];

const Users = () => {
    const [userData, setUserData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
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
    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleCategoryFilterChange = (event) => {
        setRoleFilter(event.target.value);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredData = userData.filter((user) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(user.name) || searchRegex.test(user.email));
        }

        if (roleFilter !== 'All') {
            isMatch = isMatch && user.role === roleFilter;
        }

        return isMatch;
    });

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    useEffect(() => {
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
                        setUserData(response.data);
                    } else {
                        setUserData(userData);
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
        return () => {};
    }, [popup, userData]);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Users</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/add-user" variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
                                Add User
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Box paddingX="2" className="shadow-1 p-4 pt-2 rounded ">
                        <TextField
                            label="Search"
                            variant="outlined"
                            color="primary"
                            value={searchText}
                            onChange={handleSearchTextChange}
                            className="mb-4  "
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <IconSearch />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            select
                            label="Role"
                            variant="outlined"
                            color="primary"
                            value={roleFilter}
                            onChange={handleCategoryFilterChange}
                            style={{ marginRight: '1rem', marginLeft: 6 }}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TableContainer component={Paper} className="shadow-sm">
                            <Table aria-label="product table">
                                <TableHead className="bg-light">
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>

                                        <TableCell>Created At</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((user, index) => (
                                        <UserRow key={index} user={user} />
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[15, 25, 50]}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </TableContainer>
                    </Box>
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

const UserRow = ({ user }) => {
    // const navigate = useNavigate();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const [spinner, setSpinner] = useState(false);
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
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(!open);
    };
    const [selectedProduct, setSelectedProduct] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleTrashClick = (product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const DateSlice = (date) => {
        var year = date.slice(0, 4);
        var month = date.slice(5, 7);
        var day = date.slice(8, 10);
        return day + '/' + month + '/' + year;
    };

    const UpdateUser = () => {
        setSpinner(true);
        var Api = Connections.api + Connections.updateuser + user.id;
        const data = { name: name, email: email, role: role };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };
        fetch(Api, requestOptions)
            .then((response) => response.json())
            .then((response) => {
                // show success message
                if (response.success) {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'success',
                        message: response.message
                    });
                    setSpinner(false);
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
                // show error message
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: response.message
                });
                setSpinner(false);
            });
    };
    const handleDelete = (id) => {
        // Do something with the deleted category
        setSpinner(true);
        var Api = Connections.api + Connections.deleteuser + id;
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
                    setSpinner(false);
                    handleDialogClose();
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
                    message: response.message
                });
                setSpinner(false);
            });
    };

    useEffect(() => {
        return () => {};
    }, [spinner]);

    return (
        <>
            <TableRow
                hover
                className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-primary rounded' : 'border-0 rounded'}
            >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={handleOpen}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {user.profile ? (
                        <img
                            src={Connections.images + user.profile}
                            alt="user"
                            style={{ width: 40, height: 40 }}
                            className="rounded-circle m-auto me-2 border"
                        />
                    ) : (
                        <img
                            src="http://placehold.it/120x120&text=image"
                            alt="user"
                            style={{ width: 40, height: 40 }}
                            className="img-fluid rounded-circle m-auto me-2"
                        />
                    )}
                    {user.name}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{DateSlice(user.created_at)}</TableCell>
                <TableCell>
                    <IconButton aria-label="Edit row" size="small" onClick={handleOpen}>
                        <IconEdit />
                    </IconButton>
                    <IconButton aria-label="Trash row" size="small" onClick={() => handleTrashClick(user)}>
                        <IconTrash />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow className={open ? 'border border-5 border-top-0 border-bottom-0 border-end-0 border-primary' : 'border-0'}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={3}>
                            <Typography variant="h5" gutterBottom component="div" className="ms-2 my-3 ">
                                Update User
                            </Typography>

                            <Grid container gridSpacing>
                                <Grid item xs={12} sm={3} className="ms-0">
                                    <TextField
                                        fullWidth
                                        placeholder="Name"
                                        type="text"
                                        color="primary"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3} className="ms-3">
                                    <TextField
                                        fullWidth
                                        color="primary"
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={2} className="ms-3">
                                    <TextField
                                        select
                                        fullWidth
                                        label="User Role"
                                        color="primary"
                                        value={role}
                                        onChange={(event) => setRole(event.target.value)}
                                    >
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Sales">Sales</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => UpdateUser()}
                                    variant="contained"
                                    color="primary"
                                    className="text-decoration-none mt-3 ms-1"
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
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>Do you want to delete {selectedProduct ? selectedProduct.name : ''} ?</DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="error" onClick={() => handleDelete(selectedProduct.id)}>
                        {spinner ? (
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Yes'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </>
    );
};
UserRow.propTypes = {
    user: PropTypes.shape({
        profile: PropTypes.bool,
        picture: PropTypes.string,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired
    }).isRequired
};
export default Users;
