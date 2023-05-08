import { useState } from 'react';
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
    TablePagination
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { IconTrash, IconEdit } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import CategoryData from 'data/category';
import { gridSpacing } from 'store/constant';

// ==============================|| CATEGORY PAGE ||============================== //

const Category = () => {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [addCategory, setAddCategory] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddDialogOpen = () => {
        setAddDialogOpen(true);
    };

    const handleAddDialogClose = () => {
        setAddDialogOpen(false);
    };
    const addNewCategory = () => {
        alert(addCategory + 'category added');
    };
    const handleEditDialogOpen = (category) => {
        setSelectedCategory(category);
        setNewCategoryName(category.name);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setSelectedCategory(null);
        setNewCategoryName('');
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
        // Do something with the edited category
        console.log(`Edited category ${selectedCategory.id} to ${newCategoryName}`);
        handleEditDialogClose();
    };

    const handleDeleteCategory = () => {
        // Do something with the deleted category
        console.log(`Deleted category ${selectedCategory.id}`);
        handleDeleteDialogClose();
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

    const filteredCategories = CategoryData.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                                        <Typography variant="h3">Product Categories</Typography>
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
                                className="ms-2"
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
                            <List>
                                {categoriesToShow.map((category) => (
                                    <ListItem key={category.id} className="bg-light rounded m-2 py-3">
                                        <ListItemText primary={category.name} />
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => addNewCategory()} color="primary">
                        Save
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditCategory} color="primary">
                        Save
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
                    <Button onClick={handleDeleteCategory} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Category;
