// material-ui
import { Grid, Divider, Typography, FormControl, Select, useTheme, MenuItem, Box } from '@mui/material';
import { DataGrid, GridParamsApi } from '@mui/x-data-grid';
import Connections from 'api';
import { columns } from 'data/solditemcolumn';
import { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SOLD ITEM LISTING PAGE ||============================== //

const SoldItems = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const theme = useTheme();

    const [data, setData] = useState([]);
    const [shopFilter, setShopFilter] = useState('All');
    const [shops, setShops] = useState([]);

    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [rowCountState, setRowCountState] = useState(lastPage);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 25,
        page: 0,
        pageCount: 0,
        pageStartIndex: 0,
        pageEndIndex: 0
    });

    const handleShopSelection = (event) => {
        setShopFilter(event.target.value);
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
                    message: 'There is error fetching shops!'
                });
            });
    };

    useEffect(() => {
        const getSoldItems = () => {
            setLoading(true);
            var Api =
                Connections.api +
                Connections.getSoldItem +
                `?page=${paginationModel.page}&limit=${paginationModel.pageSize}&shop=${shopFilter}`;

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
                        setData(response.data.data);
                        setLastPage(response.data.last_page);
                        setLoading(false);
                    } else {
                        setData(data);
                        setLoading(false);
                    }
                })
                .catch(() => {
                    setLoading(false);
                });
        };
        getSoldItems();
        return () => {};
    }, [paginationModel, shopFilter]);

    useEffect(() => {
        setRowCountState((prevRowCountState) =>
            paginationModel.pageSize !== undefined ? paginationModel.pageSize * lastPage : prevRowCountState
        );
    }, [paginationModel.pageSize, setRowCountState]);

    useEffect(() => {
        getShops();
        return () => {};
    }, []);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h3">Sold Items</Typography>

                    <Box>
                        {user.role === 'Admin' ? (
                            <FormControl>
                                <Select value={shopFilter} onChange={(event) => handleShopSelection(event)}>
                                    <MenuItem value="All">All</MenuItem>

                                    {Array.from(new Set(shops.map((item) => item.name))).map((shop) => (
                                        <MenuItem key={shop} value={shop}>
                                            {shop}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        ) : (
                            <Typography sx={{ fontSize: theme.typography.h5, marginRight: 2 }}>{user.store_name}</Typography>
                        )}
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid container>
                    <DataGrid
                        rows={data}
                        {...data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: paginationModel.pageSize,
                                    pageCount: lastPage,
                                    pageEndIndex: lastPage
                                }
                            }
                        }}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pagination={true}
                        rowCount={rowCountState}
                        pageSizeOptions={[10, 25, 50, 100]}
                        onPageChange={(newPage) => {
                            setPaginationModel({
                                ...paginationModel,
                                page: newPage
                            });
                        }}
                        onPageSizeChange={(newPageSize) => {
                            setPaginationModel({
                                ...paginationModel,
                                pageSize: newPageSize
                            });
                        }}
                        paginationMode="server"
                        density="standard"
                        hideFooterSelectedRowCount={true}
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default SoldItems;
