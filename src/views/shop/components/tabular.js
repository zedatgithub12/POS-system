import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ShopTable = ({ shops }) => {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [regionFilter, setRegionFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [subcityFilter, setSubcityFilter] = useState('');
    const [lastStatusFilter, setLastStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const filteredShops = shops.filter(
        (shop) =>
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            shop.category.includes(categoryFilter) &&
            shop.region.includes(regionFilter) &&
            shop.city.includes(cityFilter) &&
            shop.subcity.includes(subcityFilter) &&
            (shop.last_status ? shop.last_status.includes(lastStatusFilter) : true)
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ minWidth: 200, marginX: 1 }}
                />
                <FormControl sx={{ minWidth: 120, marginX: 1 }}>
                    <InputLabel>Category</InputLabel>
                    <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {Array.from(new Set(shops.map((shops) => shops.category))).map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120, marginX: 1 }}>
                    <InputLabel>Region</InputLabel>
                    <Select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {Array.from(new Set(shops.map((shops) => shops.region))).map((region) => (
                            <MenuItem key={region} value={region}>
                                {region}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120, marginX: 1 }}>
                    <InputLabel>City</InputLabel>
                    <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {Array.from(new Set(shops.map((shop) => shop.city))).map((city) => (
                            <MenuItem key={city} value={city}>
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120, marginX: 1 }}>
                    <InputLabel>Sub City</InputLabel>
                    <Select value={subcityFilter} onChange={(e) => setSubcityFilter(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {Array.from(new Set(shops.map((shop) => shop.subcity))).map((subcity) => (
                            <MenuItem key={subcity} value={subcity}>
                                {subcity}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120, marginX: 1 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={lastStatusFilter} onChange={(e) => setLastStatusFilter(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {Array.from(new Set(shops.map((shop) => shop.last_status))).map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <TableContainer component={Paper} className="shadow-sm mt-4">
                <Table>
                    <TableHead className="bg-light">
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Region</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Subcity</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredShops.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((shop) => (
                            <TableRow
                                key={shop.id}
                                onClick={() =>
                                    navigate('/view-shop', {
                                        state: { ...shop }
                                    })
                                }
                                sx={{ cursor: 'pointer' }}
                            >
                                <TableCell>{shop.name}</TableCell>
                                <TableCell>
                                    <span className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded">{shop.category} </span>
                                </TableCell>
                                <TableCell>{shop.region}</TableCell>
                                <TableCell>{shop.city}</TableCell>
                                <TableCell>{shop.subcity}</TableCell>
                                <TableCell>{shop.address}</TableCell>
                                <TableCell>{shop.phone}</TableCell>
                                <TableCell>
                                    <span
                                        className={
                                            shop.last_status === 'Open'
                                                ? 'bg-success bg-opacity-10 text-success px-2 py-1 rounded'
                                                : shop.last_status === 'Closed'
                                                ? 'bg-secondary bg-opacity-10 text-secondary px-2 py-1 rounded'
                                                : shop.last_status === 'Temporarily Closed'
                                                ? 'bg-info bg-opacity-10 text-info px-2 py-1 rounded'
                                                : 'bg-danger bg-opacity-10 text-danger px-2 py-1 rounded'
                                        }
                                    >
                                        {shop.last_status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredShops.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
};

export default ShopTable;
