// material-ui
import {
    Grid,
    Typography,
    Button,
    Divider,
    TextField,
    Container,
    // Box,
    // FormControlLabel,
    // Checkbox,
    // InputLabel,
    // Select,
    MenuItem
    // FormHelperText
} from '@mui/material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
// ==============================|| Add Product PAGE ||============================== //

const AddProduct = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };

    const [productPicture, setProductPicture] = useState(null);
    const [productName, setProductName] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [productCode, setProductCode] = useState('');
    const [productCost, setProductCost] = useState('');
    const [productUnit, setProductUnit] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productQuantity, setProductQuantity] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [warehouses, setWarehouses] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
    };

    const handlePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setProductPicture(reader.result);
            };
        }
    };
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Add Product</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button onClick={GoBack} variant="outlined" color="secondary" sx={{ textDecoration: 'none' }}>
                                Back
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12} spacing={2}></Grid>
            </Grid>
            <Container maxWidth="sm">
                <form style={{ marginTop: '1rem', marginBottom: '1rem' }} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePictureChange}
                                style={{ display: 'none' }}
                                id="product-picture"
                            />
                            <label htmlFor="product-picture">
                                <Button variant="contained" color="secondary" component="span" fullWidth style={{ height: '100%' }}>
                                    {productPicture ? (
                                        <img
                                            src={productPicture}
                                            alt="Product"
                                            style={{ width: '100%' }}
                                            className="img-fluid rounded m-auto"
                                        />
                                    ) : (
                                        'Upload Picture'
                                    )}
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                color="secondary"
                                fullWidth
                                label="Product Name"
                                value={productName}
                                onChange={(event) => setProductName(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Product Category"
                                color="secondary"
                                value={productCategory}
                                onChange={(event) => setProductCategory(event.target.value)}
                                required
                            >
                                <MenuItem value="category1">Category 1</MenuItem>
                                <MenuItem value="category2">Category 2</MenuItem>
                                <MenuItem value="category3">Category 3</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Brand"
                                color="secondary"
                                value={brand}
                                onChange={(event) => setBrand(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Code"
                                value={productCode}
                                color="secondary"
                                onChange={(event) => setProductCode(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Cost"
                                color="secondary"
                                value={productCost}
                                onChange={(event) => setProductCost(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Unit"
                                color="secondary"
                                value={productUnit}
                                onChange={(event) => setProductUnit(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Price"
                                color="secondary"
                                value={productPrice}
                                onChange={(event) => setProductPrice(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Quantity"
                                color="secondary"
                                value={productQuantity}
                                onChange={(event) => setProductQuantity(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Description"
                                color="secondary"
                                value={productDescription}
                                onChange={(event) => setProductDescription(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Add to Shop"
                                color="secondary"
                                value={warehouses}
                                onChange={(event) => setWarehouses(event.target.value)}
                            >
                                <MenuItem value="Shop">Shop One</MenuItem>
                                <MenuItem value="Shop">Shop Two</MenuItem>
                                <MenuItem value="Shop">Shop Three</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                color="secondary"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                            >
                                <MenuItem value="Market">Market</MenuItem>
                                <MenuItem value="Store">Store</MenuItem>
                            </TextField>
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="secondary" style={{ margin: '1rem 0' }}>
                        Submit
                    </Button>
                </form>
            </Container>
        </MainCard>
    );
};

export default AddProduct;
