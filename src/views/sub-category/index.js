import React, { useState, useEffect } from 'react';
// material-ui
import {
    Typography,
    Grid,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    DialogActions,
    TablePagination,
    Autocomplete,
    FormControl,
    MenuItem,
    Select
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
// ==============================|| CATEGORY PAGE ||============================== //

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const SubCategory = () => {
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

    //category data
    const [mainCategories, setMainCategories] = useState([]);
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
    const [spinner, setSpinner] = useState(false);

    const [categoryFilter, setCategoryFilter] = useState('Main Category');

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const filteredData = CategoryData.filter((category) => {
        let isMatch = true;

        if (categoryFilter !== 'Main Category') {
            isMatch = isMatch && category.main_category === categoryFilter;
        }

        return isMatch;
    });

    const uniqueCategories = new Set();

    // Loop through the CategoryData array and add each main_category value to the Set
    mainCategories.forEach((category) => {
        uniqueCategories.add(category.name);
    });

    // Convert the Set back to an array
    const uniqueCategoryArray = Array.from(uniqueCategories);

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };
    const addNewCategory = () => {
        if (addCategory === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select main category'
            });
        } else if (addCategoryDesc === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please enter sub category name'
            });
        } else {
            setSpinner(true);
            var Api = Connections.api + Connections.addsubcategory;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };

            const data = {
                main: addCategory,
                sub: addCategoryDesc
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
        }
    };
    const handleEditDialogOpen = (category) => {
        setSelectedCategory(category);
        setNewCategoryName(category.main_category);
        setNewCategoryDesc(category.sub_category);
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
        var Api = Connections.api + Connections.editsubcategory + selectedCategory.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            main: newCategoryName,
            sub: newCategoryDesc
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
        var Api = Connections.api + Connections.deletesubcategory + selectedCategory.id;
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
        const getMainCatgeory = () => {
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
                        setMainCategories(response.data);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching categories!'
                    });
                });
        };

        const getSubCatgeory = () => {
            var Api = Connections.api + Connections.viewsubcategory;
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
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error featching category!'
                    });
                });
        };
        getMainCatgeory();
        getSubCatgeory();
        return () => {};
    }, [popup]);

    const filteredCategories = filteredData.filter((category) => category.sub_category.toLowerCase().includes(searchTerm.toLowerCase()));

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
                                        <Typography variant="h3">Sub Category</Typography>
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
                                    Add Sub Category
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
                                className="ms-2 mt-2 "
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
                            <FormControl className="ms-2 mt-2 ">
                                <Select value={categoryFilter} onChange={handleCategoryFilterChange}>
                                    <MenuItem value="Main Category">Main Category</MenuItem>
                                    {Array.from(new Set(CategoryData.map((product) => product.main_category))).map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <List>
                                {categoriesToShow.map((category) => (
                                    <ListItem key={category.id} className="bg-light rounded m-2 py-3">
                                        <ListItemText
                                            primary={category.sub_category}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        {category.main_category}
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        />

                                        <ListItemSecondaryAction>
                                            <IconButton onClick={() => handleEditDialogOpen(category)}>
                                                <IconEdit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteDialogOpen(category)}>
                                                <IconTrash />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
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
                <DialogTitle>Add Sub Category</DialogTitle>

                <DialogContent>
                    <Autocomplete
                        options={uniqueCategoryArray}
                        getOptionLabel={(option) => option}
                        onChange={(event, value) => {
                            if (value) {
                                setAddCategory(value);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Main Category" variant="outlined" fullWidth required />
                        )}
                    />
                    <TextField
                        margin="dense"
                        label="Sub Category"
                        color="primary"
                        value={addCategoryDesc}
                        onChange={(e) => setAddCategoryDesc(e.target.value)}
                        fullWidth
                        required
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
                <DialogTitle>Edit Sub Category</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={uniqueCategoryArray}
                        getOptionLabel={(option) => option}
                        value={newCategoryName}
                        onChange={(event, value) => {
                            if (value) {
                                setNewCategoryName(value);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Main Category" variant="outlined" fullWidth required />
                        )}
                    />
                    <TextField
                        margin="dense"
                        label="Sub Category"
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
                <DialogTitle>Delete Sub Category</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete the Sub category '{selectedCategory?.sub_category}'?</p>
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

export default SubCategory;
