// material-ui
import { Box, Grid, Divider, Typography } from '@mui/material';
import { DataGrid, GridToolbar, GridPagination } from '@mui/x-data-grid';
import Connections from 'api';
import { columns } from 'data/solditemcolumn';
import { useEffect, useState } from 'react';
import { gridSpacing } from 'store/constant';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SOLD ITEM LISTING PAGE ||============================== //

const CustomPagination = (props) => {
    const { state, api } = props;

    return (
        <GridPagination
            {...props}
            page={state.pagination.page}
            pageSize={state.pagination.pageSize}
            rowCount={state.pagination.rowCount}
            onPageChange={(newPage) => api.current.setPage(newPage)}
            onPageSizeChange={(newPageSize) => api.current.setPageSize(newPageSize)}
            siblingCount={2}
            style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}
        />
    );
};

const SoldItems = () => {
    const userString = sessionStorage.getItem('user');
    const users = JSON.parse(userString);

    const [data, setData] = useState([]);
    const [filterShop, setFilterShop] = useState('Shop');
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState();
    const [loading, setLoading] = useState(true);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    useEffect(() => {
        const getSoldItems = () => {
            setLoading(true);
            var Api = Connections.api + Connections.getSoldItem + `?page=${page}&limit=${rowsPerPage}`;

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
                        var selectedShop = response.data.data > 0 ? response.data.data[1].shop : 'Shop';
                        setFilterShop(selectedShop);
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
    }, [rowsPerPage]);
    return (
        <MainCard>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Typography variant="h3">Sold Items</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Divider />
                </Grid>

                <Grid>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: rowsPerPage
                                }
                            }
                        }}
                        pageSizeOptions={[15, 25, 50, 100]}
                        checkboxSelection
                    />
                </Grid>
            </Grid>
        </MainCard>
    );
};

export default SoldItems;
