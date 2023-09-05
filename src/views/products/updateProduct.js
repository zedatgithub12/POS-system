// material-ui
import { Grid, Box, Typography, Button, Divider, TextField, Container, MenuItem, Autocomplete, FormControl, Select } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Connections from 'api';
import { IconBox } from '@tabler/icons';
import { Item_Sku } from 'data/sku';
import { useTheme } from '@mui/material/styles';
// ==============================|| UPDATE PRODUCT PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UpdateProduct = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
    const theme = useTheme();
    const { state } = useLocation();

    //category data
    const [CategoryData, setCategoryData] = useState([]);
    //shops data
    const [shops, setShops] = useState([]);
    //

    const [productPicture, setProductPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState(state.item_image ? state.item_image : null);
    const [productName, setProductName] = useState(state.item_name ? state.item_name : '');
    const [productCategory, setProductCategory] = useState(state.item_category ? state.item_category : 'Main Category');
    const [productSubCategory, setProductSubCategory] = useState(state.item_sub_category ? state.item_sub_category : 'Sub Category');
    const [brand, setBrand] = useState(state.item_brand ? state.item_brand : '');
    const [productUnit, setProductUnit] = useState(state.item_unit ? state.item_unit : '');
    const [productSKU, setProductSKU] = useState(state.item_sku ? state.item_sku : '');
    const [productDescription, setProductDescription] = useState(state.item_description ? state.item_description : '');
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

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setPopup({
            ...popup,
            status: false
        });
    };

    const handleUnitChange = (value) => {
        setProductUnit(value.name);
    };

    const handleUnitInput = (unit) => {
        setProductUnit(unit);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        // Handle form submission here
        // Declare the data to be sent to the API
        var Api = Connections.api + Connections.updateItems + state.id;

        const data = new FormData();
        data.append('item_image', productPicture);
        data.append('item_name', brand);
        data.append('item_category', productCategory);
        data.append('item_sub_category', productSubCategory);
        data.append('item_brand', brand);
        data.append('item_unit', productUnit);
        data.append('item_sku', productSKU);
        data.append('item_price', 1);
        data.append('item_description', productDescription);

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
                                    <Typography variant="h3">
                                        Update Product |{' '}
                                        <strong style={{ color: theme.palette.primary.dark, fontSize: theme.typography.h4 }}>
                                            {state.item_code}{' '}
                                        </strong>{' '}
                                    </Typography>
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
                                <Box fullWidth>
                                    {picturePreview ? (
                                        <img
                                            src={productPicture ? picturePreview : Connections.images + picturePreview}
                                            alt="Product"
                                            style={{ width: '100%' }}
                                            className="img-fluid rounded m-auto"
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <IconBox size={24} />
                                            <Typography
                                                variant="contained"
                                                color="primary"
                                                component="span"
                                                fullWidth
                                                style={{ height: '100%' }}
                                            >
                                                Upload Picture
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </label>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <Select value={productCategory} onChange={handleCategoryChange}>
                                    <MenuItem value={productCategory}>{productCategory}</MenuItem>
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
                                    <MenuItem value={productSubCategory}>{productSubCategory}</MenuItem>
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
                            <Autocomplete
                                freeSolo
                                options={Item_Sku}
                                getOptionLabel={(option) => option.name}
                                defaultValue={{ name: productUnit }}
                                onChange={(event, value) => {
                                    if (value !== null) {
                                        handleUnitChange(value);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Item Unit"
                                        value={productUnit}
                                        onChange={(event) => handleUnitInput(event.target.value)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Item SKU"
                                color="primary"
                                value={productSKU}
                                onChange={(event) => setProductSKU(event.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Item Description"
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
