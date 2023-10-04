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
    Autocomplete,
    FormControl,
    MenuItem,
    Select,
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
const Brands = () => {
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
    const [brand, setBrand] = useState([]);
    const [CategoryData, setCategoryData] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [addCategory, setAddCategory] = useState('');
    const [newBrand, setNewBrand] = useState('');
    const [parentCode, setParentCode] = useState();
    const [addCategoryDesc, setAddCategoryDesc] = useState('');

    const [editCategory, setEditCategory] = useState();
    const [editSubCategory, setEditSubCategory] = useState();
    const [editBrand, setEditBrand] = useState();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [spinner, setSpinner] = useState(false);

    const [categoryFilter, setCategoryFilter] = useState('Sub Category');

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const filteredData = brand.filter((category) => {
        let isMatch = true;

        if (searchTerm) {
            const searchRegex = new RegExp(searchTerm, 'i');
            isMatch = isMatch && searchRegex.test(category.brand);
        }

        if (categoryFilter !== 'Sub Category') {
            isMatch = isMatch && category.sub_category === categoryFilter;
        }

        return isMatch;
    });

    const uniqueCategories = new Set();

    // Loop through the CategoryData array and add each main_category value to the Set
    CategoryData.forEach((category) => {
        uniqueCategories.add(category.name);
    });

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };

    const handlesubcategory = (value) => {
        setAddCategory(value.main_category);
        setAddCategoryDesc(value.sub_category);
        setParentCode(value.code);
    };

    const handlesubcategoryUpdate = (value) => {
        setEditCategory(value.main_category);
        setEditSubCategory(value.sub_category);
    };

    const CreateBrand = () => {
        if (addCategoryDesc === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Please select sub category name'
            });
        } else {
            setSpinner(true);
            var Api = Connections.api + Connections.createbrand;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };

            const data = {
                subcatcode: parentCode,
                main: addCategory,
                sub: addCategoryDesc,
                brand: newBrand
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
        setEditCategory(category.main_category);
        setEditSubCategory(category.sub_category);
        setEditBrand(category.brand);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setSelectedCategory(null);
        setEditCategory('');
        setEditSubCategory('');
        setEditBrand('');
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
        var Api = Connections.api + Connections.editbrand + selectedCategory.id;
        var headers = {
            accept: 'application/json',
            'Content-Type': 'application/json'
        };

        const data = {
            main: editCategory,
            sub: editSubCategory,
            brand: editBrand
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

    const removeDeletedBrand = async () => {
        const Leftover = brand.filter((item) => item.id != selectedCategory.id);
        setCategoryData(Leftover);
    };

    const handleDeleteCategory = () => {
        // Do something with the deleted category
        setSpinner(true);
        var Api = Connections.api + Connections.deletebrand + selectedCategory.id;
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
                    removeDeletedBrand();
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
        const getSubCatgeory = () => {
            setLoading(true);
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
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error featching sub category!'
                    });
                    setLoading(false);
                });
        };

        const getBrands = () => {
            setLoading(true);
            var Api = Connections.api + Connections.viewbrand;
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
                        setBrand(response.data);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error featching brands!'
                    });
                    setLoading(false);
                });
        };

        getSubCatgeory();
        getBrands();
        return () => {};
    }, []);

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
                                        <Typography variant="h3">Brands</Typography>
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
                                    Create Brand
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
                                label="Search brand"
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
                                    <MenuItem value="Sub Category">Sub Category</MenuItem>
                                    {Array.from(new Set(CategoryData.map((product) => product.sub_category))).map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TableContainer sx={{ marginTop: 2 }}>
                                <Table>
                                    <TableHead className="bg-light">
                                        <TableRow>
                                            <TableCell>Code</TableCell>
                                            <TableCell>Brand</TableCell>
                                            <TableCell>Sub Category</TableCell>
                                            <TableCell>Main Category</TableCell>
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
                                                    <TableCell>{category.code}</TableCell>
                                                    <TableCell>{category.brand}</TableCell>
                                                    <TableCell>{category.sub_category}</TableCell>
                                                    <TableCell>{category.main_category}</TableCell>

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
                <DialogTitle>Create Brand</DialogTitle>

                <DialogContent>
                    <Autocomplete
                        options={CategoryData}
                        getOptionLabel={(option) => option.sub_category}
                        onChange={(event, value) => {
                            if (value) {
                                handlesubcategory(value);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Sub Category" variant="outlined" fullWidth required />
                        )}
                    />
                    <TextField
                        margin="dense"
                        label="Brand name"
                        color="primary"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        fullWidth
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => CreateBrand()} color="primary" variant="container">
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
                <DialogTitle>Edit Brand</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={CategoryData}
                        getOptionLabel={(option) => option.sub_category}
                        defaultValue={{ sub_category: editSubCategory }}
                        onChange={(event, value) => {
                            if (value) {
                                handlesubcategoryUpdate(value);
                            }
                        }}
                        renderInput={(params) => (
                            <TextField {...params} margin="dense" label="Sub Category" variant="outlined" fullWidth required />
                        )}
                    />
                    <TextField
                        margin="dense"
                        label="Brand"
                        color="primary"
                        value={editBrand}
                        onChange={(e) => setEditBrand(e.target.value)}
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
                <DialogTitle>Delete Brand</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete the brand '{selectedCategory?.brand}'?</p>
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

export default Brands;
