import { useState } from 'react';
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
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconTrash, IconEdit, IconSearch } from '@tabler/icons';
import PropTypes from 'prop-types';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';
// import ProductDummy from 'data/products';
import UsersData from 'data/users';

// ==============================|| USERS PAGE ||============================== //

const categories = ['All', 'admin', 'manager'];

const Users = () => {
    const [searchText, setSearchText] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);

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

    const filteredData = UsersData.filter((user) => {
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
        </MainCard>
    );
};

const UserRow = ({ user }) => {
    // const navigate = useNavigate();
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
        setSelectedProduct(null);
        setDialogOpen(false);
    };
    const DateSlice = (date) => {
        var year = date.slice(0, 4);
        var month = date.slice(5, 7);
        var day = date.slice(8, 10);
        return day + '/' + month + '/' + year;
    };

    const UpdateUser = () => {
        alert('User will be Updated');
    };
    const Delete = (id) => {
        alert(id + 'will be deleted');
    };

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
                        <img src={user.picture} alt="user" style={{ width: 60, height: 60 }} className="img-fluid rounded m-auto me-2" />
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
                                    <TextField fullWidth placeholder="Name" color="primary" value={user.name} />
                                </Grid>
                                <Grid item xs={12} sm={3} className="ms-3">
                                    <TextField fullWidth color="primary" placeholder="Email" value={user.email} />
                                </Grid>
                                <Grid item xs={12} sm={2} className="ms-3">
                                    <TextField select fullWidth label="User Role" color="primary" defaultValue={user.role}>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
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
                                    Update
                                </Button>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>Do you want to delete {selectedProduct ? selectedProduct.name : ''} ?</DialogContent>
                <DialogActions>
                    <Button variant="text" color="primary" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button variant="text" color="error" onClick={() => Delete(selectedProduct ? selectedProduct.id : '0')}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
UserRow.propTypes = {
    user: PropTypes.shape({
        profile: PropTypes.bool,
        picture: PropTypes.string,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired
    }).isRequired
};
export default Users;
