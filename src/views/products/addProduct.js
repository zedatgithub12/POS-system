// material-ui
import {
    Grid,
    Box,
    Typography,
    Button,
    Divider,
    TextField,
    Container,
    FormControl,
    MenuItem,
    Select,
    InputLabel,
    Autocomplete
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Connections from 'api';
import { IconBox } from '@tabler/icons';
import { Item_Sku } from 'data/sku';

// ==============================|| Add Product PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AddProduct = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };

    const theme = useTheme();

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
    const [CategoryData, setCategoryData] = useState([]);
    const [SubCategoryData, setSubCategoryData] = useState([]);
    //shops data
    const [shops, setShops] = useState([]);
    const [productPicture, setProductPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
    const [productCategory, setProductCategory] = useState('Main Category');
    const [categoryId, setCategoryId] = useState(null);
    const [productSubCategory, setProductSubCategory] = useState('Sub Category');
    const [brand, setBrand] = useState('');
    const [productUnit, setProductUnit] = useState('');
    const [productpackaging, setProductPackaging] = useState('');
    const [productsku, setProductSKU] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [spinner, setSpinner] = useState(false);

    const handleCategoryChange = (event) => {
        setProductCategory(event.target.value);
        var selectedName = event.target.value;
        if (selectedName !== 'Main Category') {
            var cat = CategoryData.find((cat) => cat.name === selectedName);
            setCategoryId(cat.id);

            getSubCatgeory(event.target.value);
        }
    };

    const handleSubCategoryChange = (value) => {
        setProductSubCategory(value.name);
    };

    const handleSubCategoryInput = (sub_category) => {
        setProductSubCategory(sub_category);
    };

    const handleUnitChange = (value) => {
        setProductUnit(value.name);
    };

    const handleUnitInput = (unit) => {
        setProductUnit(unit);
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

    const getSubCatgeory = (name) => {
        var Api = Connections.api + Connections.subcategory + name;
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
                    setSubCategoryData((prevCat) => {
                        // Combine the previous shops with the new ones from the API
                        return [...prevCat, ...response.data];
                    });
                }
            })
            .catch(() => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error fetching sub categories!'
                });
            });
    };
    useEffect(() => {
        const getCatgeory = () => {
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
                        setCategoryData((prevCat) => {
                            // Combine the previous shops with the new ones from the API
                            return [...prevCat, ...response.data];
                        });
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
                        setShops((prevShops) => {
                            // Combine the previous shops with the new ones from the API
                            return [...prevShops, ...response.data];
                        });
                    } else {
                        setShops((prevShops) => {
                            // Combine the previous shops with the new ones from the API
                            return [...prevShops, ...shops];
                        });
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
        getShops();
        getCatgeory();
        return () => {};
    }, [popup]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (productCategory === 'Main Category') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Select Category'
            });
        } else if (brand === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Select Brand'
            });
        } else if (productUnit === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Select Item Unit'
            });
        } else if (productsku === '') {
            setPopup({
                ...popup,
                status: true,
                severity: 'error',
                message: 'Select Item SKU'
            });
        } else {
            setSpinner(true);
            // Handle form submission here
            // Declare the data to be sent to the API
            var Api = Connections.api + Connections.addItems;

            const data = new FormData();
            data.append('item_image', productPicture);
            data.append('item_name', productSubCategory);
            data.append('item_category', productCategory);
            data.append('category_id', categoryId);
            data.append('item_sub_category', productSubCategory);
            data.append('item_brand', brand);
            data.append('item_unit', productUnit);
            data.append('item_sku', productsku);
            data.append('item_packaging', productpackaging);
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
                        message: 'There is error adding  product!'
                    });
                    setSpinner(false);
                });
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
                    <Grid container spacing={1}>
                        <Grid
                            item
                            xs={12}
                            sm={6}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                backgroundColor: theme.palette.primary.light,
                                borderRadius: 2
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handlePictureChange}
                                style={{ display: 'none' }}
                                id="product-picture"
                            />
                            <label htmlFor="product-picture">
                                <div>
                                    {picturePreview ? (
                                        <img
                                            src={picturePreview}
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
                                </div>
                            </label>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <Select value={productCategory} onChange={handleCategoryChange}>
                                    <MenuItem value="Main Category">Main Category</MenuItem>
                                    {Array.from(new Set(CategoryData.map((product) => product.name))).map((category) => (
                                        <MenuItem key={category} value={category}>
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
                            <Autocomplete
                                freeSolo
                                options={SubCategoryData}
                                getOptionLabel={(option) => option.sub_category}
                                onChange={(event, value) => {
                                    if (value) {
                                        handleSubCategoryChange(value);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Sub Category"
                                        variant="outlined"
                                        value={productSubCategory}
                                        onChange={(event) => handleSubCategoryInput(event.target.value)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
                            <TextField
                                fullWidth
                                label="Item Brand"
                                color="primary"
                                value={brand}
                                onChange={(event) => setBrand(event.target.value)}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
                            <Autocomplete
                                freeSolo
                                options={Item_Sku}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => {
                                    if (value) {
                                        handleUnitChange(value);
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required
                                        label="Item Unit"
                                        variant="outlined"
                                        value={productUnit}
                                        onChange={(event) => handleUnitInput(event.target.value)}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
                            <TextField
                                fullWidth
                                label="Item SKU"
                                color="primary"
                                value={productsku}
                                onChange={(event) => setProductSKU(event.target.value)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} sx={{ marginTop: 1 }}>
                            <TextField
                                fullWidth
                                label="Item Packaging"
                                color="primary"
                                value={productpackaging}
                                onChange={(event) => setProductPackaging(event.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ marginTop: 1 }}>
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
                            'Save'
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

export default AddProduct;
