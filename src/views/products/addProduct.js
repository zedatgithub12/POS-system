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
    MenuItem,
    Autocomplete
    // FormHelperText
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Connections from 'api';
// ==============================|| Add Product PAGE ||============================== //
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AddProduct = () => {
    const navigate = useNavigate();
    const GoBack = () => {
        navigate(-1);
    };
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
    //shops data
    const [shops, setShops] = useState([]);
    //

    const [productPicture, setProductPicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
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
    const [spinner, setSpinner] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSpinner(true);
        // Handle form submission here
        // Declare the data to be sent to the API
        var Api = Connections.api + Connections.addproduct;
        // var headers = {
        //     accept: 'application/json',
        //     'Content-Type': 'application/json'
        // };

        const data = new FormData();
        data.append('picture', productPicture);
        data.append('name', productName);
        data.append('category', productCategory);
        data.append('brand', brand);
        data.append('code', productCode);
        data.append('cost', productCost);
        data.append('unit', productUnit);
        data.append('price', productPrice);
        data.append('quantity', productQuantity);
        data.append('description', productDescription);
        data.append('shop', warehouses);
        data.append('status', status);

        // Make the API call using fetch()
        fetch(Api, {
            method: 'POST',
            body: data
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
            .catch((error) => {
                setPopup({
                    ...popup,
                    status: true,
                    severity: 'error',
                    message: 'There is error creatng shop!'
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
            var Api = Connections.api + Connections.viewcategory;
            var headers = {
                accept: 'application/json',
                'Content-Type': 'application/json'
            };
            // Make the API call using fetch()
            fetch(Api, {
                method: 'GET',
                headers: headers
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setCategoryData(response.data);
                    }
                })
                .catch((error) => {
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
                headers: headers
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.success) {
                        setShops(response.data);
                    } else {
                        setShops(shops);
                    }
                })
                .catch((error) => {
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
    }, []);
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
                                            src={picturePreview}
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
                            <Autocomplete
                                options={CategoryData}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, value) => {
                                    if (value) {
                                        setProductCategory(value.name);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params} label="Select Category" variant="outlined" />}
                            />
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
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Description"
                                color="primary"
                                value={productDescription}
                                onChange={(event) => setProductDescription(event.target.value)}
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
                                renderInput={(params) => <TextField {...params} label="Select Shop" variant="outlined" />}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                label="Status"
                                color="primary"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                            >
                                <MenuItem value="Store">Store</MenuItem>
                            </TextField>
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
