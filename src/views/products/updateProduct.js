// material-ui
import { Grid, Typography, Button, Divider, TextField, Container, MenuItem, Autocomplete, FormControl, Select } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Connections from 'api';

// ==============================|| UPDATE PRODUCT PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UpdateProduct = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    const { state } = useLocation();

    //category data
    const [CategoryData, setCategoryData] = useState([]);
    //shops data
    const [shops, setShops] = useState([]);
    //

    const [productPicture, setProductPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState(state.picture ? state.picture : null);
    const [productName, setProductName] = useState(state.name ? state.name : '');
    const [productCategory, setProductCategory] = useState(state.category ? state.category : '');
    const [productSubCategory, setProductSubCategory] = useState(state.sub_category ? state.sub_category : '');
    const [brand, setBrand] = useState(state.brand ? state.brand : '');
    const [productCode, setProductCode] = useState(state.code ? state.code : '');
    const [productCost, setProductCost] = useState(state.cost ? state.cost : '');
    const [productUnit, setProductUnit] = useState(state.unit ? state.unit : '');
    const [productPrice, setProductPrice] = useState(state.price ? state.price : '');
    const [productQuantity, setProductQuantity] = useState(state.quantity ? state.quantity : '');
    const [productMinQuantity, setProductMinQuantity] = useState(state.min_quantity ? state.min_quantity : '');
    const [productDescription, setProductDescription] = useState(state.description ? state.description : '');
    const [warehouses, setWarehouses] = useState(state.shop ? state.shop : '');
    const [spinner, setSpinner] = useState(false);
    const [popup, setPopup] = useState({
        status: false,
        severity: 'info',
        message: ''
    });

    const handleCategoryChange = (event) => {
        setProductCategory(event.target.value);
    };

    const handleSubCategoryChange = (event) => {
        setProductSubCategory(event.target.value);
    };

    const handleShopChange = (event) => {
        setWarehouses(event.target.value);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        // Handle form submission here
        // Declare the data to be sent to the API
        var Api = Connections.api + Connections.updateproduct + state.id;
        // var headers = {
        //     accept: 'application/json',
        //     'Content-Type': 'application/json'
        // };

        const data = new FormData();
        data.append('picture', productPicture);
        data.append('name', productName);
        data.append('category', productCategory);
        data.append('sub_category', productSubCategory);
        data.append('brand', brand);
        data.append('code', productCode);
        data.append('cost', productCost);
        data.append('unit', productUnit);
        data.append('price', productPrice);
        data.append('quantity', productQuantity);
        data.append('min_quantity', productMinQuantity);
        data.append('description', productDescription);
        data.append('shop', warehouses);
        data.append('status', 'In-stock');

        // Make the API call using fetch()
        fetch(Api, {
            method: 'POST',
            body: data,
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
                    message: 'There is error updating stock item!'
                });
                setSpinner(false);
            });
    };

    const handlePictureChange = (event) => {
        const file = event.target.files[0];
        setProductPicture(file);
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPicturePreview(reader.result);
            };
        }
    };
    useEffect(() => {
        const getCatgeory = () => {
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
                        message: 'There is error creatng shop!'
                    });
                });
        };
        const getShops = () => {
            var Api = Connections.api + Connections.viewstore;
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
                        setShops(response.data);
                    } else {
                        setShops(shops);
                    }
                })
                .catch(() => {
                    setPopup({
                        ...popup,
                        status: true,
                        severity: 'error',
                        message: 'There is error fetching shop!'
                    });
                });
        };
        getShops();
        getCatgeory();
        return () => {};
    }, [popup]);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Update Product</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Button onClick={GoBack} variant="outlined" color="primary" sx={{ textDecoration: 'none' }}>
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
                                <Button variant="contained" color="primary" component="span" fullWidth style={{ height: '100%' }}>
                                    {picturePreview ? (
                                        <img
                                            src={Connections.images + picturePreview}
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
                                color="primary"
                                fullWidth
                                label="Product Name"
                                value={productName}
                                onChange={(event) => setProductName(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <Select value={productCategory} onChange={handleCategoryChange}>
                                    <MenuItem value="Main Category">Main Category</MenuItem>
                                    {Array.from(new Set(CategoryData.map((product) => product.main_category))).map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <Select value={productSubCategory} onChange={handleSubCategoryChange}>
                                    <MenuItem value="Sub Category">Sub Category</MenuItem>
                                    {Array.from(new Set(CategoryData.map((product) => product.sub_category))).map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Brand"
                                color="primary"
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
                                color="primary"
                                onChange={(event) => setProductCode(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Cost"
                                color="primary"
                                value={productCost}
                                onChange={(event) => setProductCost(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Unit"
                                color="primary"
                                value={productUnit}
                                onChange={(event) => setProductUnit(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Price"
                                color="primary"
                                value={productPrice}
                                onChange={(event) => setProductPrice(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Product Quantity"
                                color="primary"
                                value={productQuantity}
                                onChange={(event) => setProductQuantity(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Min Quantity"
                                color="primary"
                                value={productMinQuantity}
                                onChange={(event) => setProductMinQuantity(event.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Autocomplete
                                options={shops}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => {
                                    if (value) {
                                        setWarehouses(value.name);
                                    }
                                }}
                                defaultValue={{ name: warehouses }}
                                renderInput={(params) => <TextField {...params} label="Select Shop" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Description"
                                color="primary"
                                value={productDescription}
                                onChange={(event) => setProductDescription(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" style={{ margin: '1rem 0' }}>
                        {spinner ? (
                            <div className="spinner-border spinner-border-sm text-dark " role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </form>
            </Container>
            <Snackbar open={popup.status} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={popup.severity} sx={{ width: '100%' }}>
                    {popup.message}
                </Alert>
            </Snackbar>
        </MainCard>
    );
};

export default UpdateProduct;
