import React, { useState, useEffect } from 'react';
// material-ui
import {
    Typography,
    Grid,
    Box,
    Divider,
    List,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    DialogActions,
    TablePagination,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Search } from '@mui/icons-material';
import { IconTrash, IconEdit } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
// import CategoryData from 'data/category';
import { gridSpacing } from 'store/constant';
import Connections from 'api';
import { ActivityIndicators } from 'ui-component/activityIndicator';

// ==============================|| CATEGORY PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Category = () => {
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
    const [CategoryData, setCategoryData] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [addCategory, setAddCategory] = useState('');
    const [addCategoryDesc, setAddCategoryDesc] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDesc, setNewCategoryDesc] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [spinner, setSpinner] = useState(false);

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };
    const addNewCategory = () => {
        setSpinner(true);
        var Api = Connections.api + Connections.addcategory;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            name: addCategory,
            description: addCategoryDesc
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
                    setCategoryData(CategoryData);
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
                    message: 'There is error adding category!'
                });
                setSpinner(false);
            });
    };
    const handleEditDialogOpen = (category) => {
        setSelectedCategory(category);
        setNewCategoryName(category.name);
        setNewCategoryDesc(category.description);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setSelectedCategory(null);
        setNewCategoryName('');
        setNewCategoryDesc('');
        setEditDialogOpen(false);
    };

    const handleDeleteDialogOpen = (category) => {
        setSelectedCategory(category);
        setDeleteDialogOpen(true);
    };

    const handleDeleteDialogClose = () => {
        setSelectedCategory(null);
        setDeleteDialogOpen(false);
    };

    const handleEditCategory = () => {
        setSpinner(true);
        var Api = Connections.api + Connections.editcategory + selectedCategory.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            name: newCategoryName,
            description: newCategoryDesc
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
                    handleEditDialogClose();
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
                    message: 'There is error adding category!'
                });
                setSpinner(false);
            });
    };

    const handleDeleteCategory = () => {
        // Do something with the deleted category
        setSpinner(true);
        var Api = Connections.api + Connections.deletecategory + selectedCategory.id;
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
                    setCategoryData(CategoryData);
                    setSpinner(false);
                    handleDeleteDialogClose();
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
                    message: 'There is error adding category!'
                });
                setSpinner(false);
            });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    //useffect which fetches list of categories when component get mounted

    useEffect(() => {
        const getCatgeory = () => {
            setLoading(true);
            var Api = Connections.api + Connections.viewcategory;
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
                        setCategoryData(response.data);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error featching category!'
                    });
                    setLoading(false);
                });
        };
        getCatgeory();
        return () => {};
    }, [popup]);

    const filteredCategories = CategoryData.filter(
        (category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()) || category.id == searchTerm
    );

    const categoriesToShow = filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <MainCard>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                                <Grid container direction="column" spacing={1}>
                                    <Grid item>
                                        <Typography variant="h3">Main Category</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    sx={{ textDecoration: 'none' }}
                                    onClick={() => handleAddDialogOpen()}
                                >
                                    Add Category
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                    <Grid item xs={12}>
                        <Box className="shadow-1 p-4 pt-1 rounded ">
                            <TextField
                                label="Search Categories"
                                color="primary"
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                InputProps={{
                                    endAdornment: (
                                        <IconButton>
                                            <Search />
                                        </IconButton>
                                    )
                                }}
                            />
                            <TableContainer sx={{ marginTop: 2 }}>
                                <Table>
                                    <TableHead className="bg-light">
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {loading ? (
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={4} align="center" sx={{ paddingY: 6 }}>
                                                    <ActivityIndicators />
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    ) : (
                                        <TableBody>
                                            {categoriesToShow.map((category) => (
                                                <TableRow>
                                                    <TableCell>{category.id}</TableCell>
                                                    <TableCell>{category.name}</TableCell>
                                                    <TableCell>{category.description}</TableCell>
                                                    <TableCell>
                                                        {' '}
                                                        <IconButton onClick={() => handleEditDialogOpen(category)}>
                                                            <IconEdit />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDeleteDialogOpen(category)}>
                                                            <IconTrash />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    )}
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={filteredCategories.length}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </MainCard>

            <Dialog open={addDialogOpen} onClose={handleAddDialogClose}>
                <DialogTitle>Add Category</DialogTitle>

                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Category Name"
                        color="primary"
                        value={addCategory}
                        onChange={(e) => setAddCategory(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Category Description"
                        color="primary"
                        value={addCategoryDesc}
                        onChange={(e) => setAddCategoryDesc(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => addNewCategory()} color="primary" variant="container">
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

            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Category Name"
                        color="primary"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Category Description"
                        color="primary"
                        value={newCategoryDesc}
                        onChange={(e) => setNewCategoryDesc(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleEditCategory()} color="primary">
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

            <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete the category '{selectedCategory?.name}'?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleDeleteCategory()} color="error">
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

export default Category;
