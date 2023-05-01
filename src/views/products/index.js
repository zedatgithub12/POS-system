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
    Button
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IconTrash, IconEdit } from '@tabler/icons';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { Link } from 'react-router-dom';
import ProductDummy from 'data/products';

// ==============================|| PRODUCT PAGE ||============================== //

const useStyles = makeStyles({
    table: {
        minWidth: 650
    },
    searchField: {
        marginBottom: '1rem'
    }
});

const categories = ['All', 'Beverages', 'Accessories', 'Food & Beverage', 'Apparel'];
const brands = ['All', 'Addis Roasters', 'Habesha Leather Co.', 'Taste of Ethiopia', 'Dashen Designs', 'Honeyland'];
const shops = ['All', 'Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Gondar', 'Hawassa'];
const statuses = ['All', 'In stock', 'Out of stock'];
const Products = () => {
    const [searchText, setSearchText] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [brandFilter, setBrandFilter] = useState('All');
    const [shopFilter, setShopFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleSearchTextChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleCategoryFilterChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    const handleBrandFilterChange = (event) => {
        setBrandFilter(event.target.value);
    };

    const handleShopFilterChange = (event) => {
        setShopFilter(event.target.value);
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleIconEditClick = (product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    };

    const handleIconTrashClick = (productId) => {
        // TODO: Implement IconTrash functionality
    };

    const handleDialogClose = () => {
        setSelectedProduct(null);
        setDialogOpen(false);
    };

    const filteredData = ProductDummy.filter((product) => {
        let isMatch = true;

        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            isMatch = isMatch && (searchRegex.test(product.name) || searchRegex.test(product.code));
        }

        if (categoryFilter !== 'All') {
            isMatch = isMatch && product.category === categoryFilter;
        }

        if (brandFilter !== 'All') {
            isMatch = isMatch && product.brand === brandFilter;
        }

        if (shopFilter !== 'All') {
            isMatch = isMatch && product.warehouses.includes(shopFilter);
        }

        if (statusFilter !== 'All') {
            isMatch = isMatch && product.status === statusFilter;
        }

        return isMatch;
    });

    const paginatedData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Products</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button component={Link} to="/add-product" variant="outlined" color="secondary" sx={{ textDecoration: 'none' }}>
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <div>
                        <TextField
                            className={classes.searchField}
                            label="Search"
                            variant="outlined"
                            fullWidth
                            value={searchText}
                            onChange={handleSearchTextChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton>
                                            <IconEdit />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            select
                            label="Category"
                            variant="outlined"
                            value={categoryFilter}
                            onChange={handleCategoryFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Brand"
                            variant="outlined"
                            value={brandFilter}
                            onChange={handleBrandFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {brands.map((brand) => (
                                <MenuItem key={brand} value={brand}>
                                    {brand}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Shop"
                            variant="outlined"
                            value={shopFilter}
                            onChange={handleShopFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {shops.map((shop) => (
                                <MenuItem key={shop} value={shop}>
                                    {shop}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Status"
                            variant="outlined"
                            value={statusFilter}
                            onChange={handleStatusFilterChange}
                            style={{ marginRight: '1rem' }}
                        >
                            {statuses.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TableContainer component={Paper}>
                            <Table className={classes.table} aria-label="Products table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Picture</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Category</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Cost</TableCell>
                                        <TableCell>Unit</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Warehouses</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((product) => (
                                        <React.Fragment key={product.id}>
                                            <TableRow>
                                                <TableCell component="th" scope="row">
                                                    <img src={product.picture} alt={product.name} width="100" height="67" />
                                                </TableCell>
                                                <TableCell>{product.name}</TableCell>
                                                <TableCell>{product.category}</TableCell>
                                                <TableCell>{product.brand}</TableCell>
                                                <TableCell>{product.code}</TableCell>
                                                <TableCell>{product.cost}</TableCell>
                                                <TableCell>{product.unit}</TableCell>
                                                <TableCell>{product.price}</TableCell>
                                                <TableCell>{product.quantity}</TableCell>
                                                <TableCell>{product.description}</TableCell>
                                                <TableCell>{product.warehouses.join(', ')}</TableCell>
                                                <TableCell>{product.status}</TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleIconEditClick(product)}>
                                                        <IconEdit />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleIconTrashClick(product.id)}>
                                                        <IconTrash />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div style={{ marginRight: '1rem' }}>Details:</div>
                                                        <div>{product.description}</div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            component="div"
                            count={filteredData.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handlePageChange}
                            onChangeRowsPerPage={handleRowsPerPageChange}
                        />

                        <Dialog open={dialogOpen} onClose={handleDialogClose}>
                            <DialogTitle>IconEdit Product</DialogTitle>
                            <DialogContent>{/* TODO: Implement IconEdit form */}</DialogContent>
                            <DialogActions>
                                <Button onClick={handleDialogClose}>Cancel</Button>
                                <Button color="primary">Save</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default Products;
