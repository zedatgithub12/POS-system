import { useEffect, useState } from 'react';
import './DonutChart.css';
// material-ui
import { Grid, Typography, Box, Divider } from '@mui/material';

// project imports

import { gridSpacing } from 'store/constant';
import Connections from 'api';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    const theme = useTheme();
    const [isLoading, setLoading] = useState(true);
    const [stat, setStat] = useState([]);
    const [month] = useState('');
    const [year] = useState('');

    const [chartOptions, setChartOptions] = useState({
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: true,
                            fontSize: '16px',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 600,
                            color: '#333',
                            offsetY: -10
                        },
                        value: {
                            show: true,
                            fontSize: '14px',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 400,
                            color: '#888',
                            offsetY: 10
                        },
                        total: {
                            show: true,
                            label: 'Total',
                            fontSize: '16px',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 600,
                            color: '#333'
                        }
                    }
                }
            }
        }
    });

    const [chartSeries, setChartSeries] = useState([
        {
            data: [10, 20, 30],
            labels: ['Label 1', 'Label 2', 'Label 3']
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            var AdminApi = Connections.api + Connections.adminstat + `?month=${month}&year=${year}`;
            var SalesApi = Connections.api + Connections.shopstat + `?shop=${user.store_name}&month=${month}&year=${year}`;
            var Api = user.role === 'Admin' ? AdminApi : SalesApi;

            const response = await fetch(Api, { method: 'GET', cache: 'no-cache' });
            const data = await response.json();
            if (data.success) {
                setStat(data.data);
            }
        };
        fetchData();
        setLoading(false);
    }, [month, year]);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Box paddingX={4} paddingY={4}>
                        <Typography className="fs-3 fw-semibold">Dashboard</Typography>
                    </Box>
                    <Grid container className="ms-4 me-3" justifyContent="space-between" alignItems="center">
                        <Grid item xs={8.4} sx={{ backgroundColor: '#fff', borderRadius: 2, padding: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                                <Typography className="fs-5 fw-regular">Sales summary against target</Typography>
                                <Typography>Shops</Typography>
                            </Box>
                            <Divider />

                            <Grid
                                container
                                sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}
                            >
                                <Grid item xs={3.8}>
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.background.default,

                                            marginY: 2,
                                            borderRadius: 1.5,
                                            border: 1,
                                            borderColor: theme.palette.grey[300]
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ paddingLeft: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}>
                                                Daily
                                            </Typography>
                                            <Typography sx={{ paddingRight: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}>
                                                +2.1k
                                            </Typography>
                                        </Box>

                                        <Divider />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                                paddingY: 2
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 60,
                                                    width: 60,
                                                    borderRadius: 30,
                                                    backgroundColor: theme.palette.success.light,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: theme.typography.h3,
                                                        marginTop: 0.5,
                                                        marginRight: 1
                                                    }}
                                                    className="text-success text-center m-auto"
                                                >
                                                    100%
                                                </Typography>
                                            </Box>

                                            <Box sx={{ padding: 2 }}>
                                                <Typography sx={{ fontSize: theme.typography.h3 }}>30k</Typography>
                                                <Typography>Target</Typography>
                                            </Box>

                                            <Box sx={{ padding: 2 }}>
                                                <Typography sx={{ fontSize: theme.typography.h3 }}>32k</Typography>
                                                <Typography>Collected</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={3.8}>
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.background.default,

                                            marginY: 2,
                                            borderRadius: 1.5,
                                            border: 1,
                                            borderColor: theme.palette.grey[300]
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ paddingLeft: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}>
                                                Monthly
                                            </Typography>
                                            <Typography sx={{ paddingRight: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}></Typography>
                                        </Box>

                                        <Divider />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                                paddingY: 2
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 60,
                                                    width: 60,
                                                    borderRadius: 30,
                                                    backgroundColor: theme.palette.primary.light,
                                                    display: 'flex',
                                                    justifyContent: '',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: theme.typography.h3,
                                                        marginTop: 0.5,
                                                        marginRight: 1
                                                    }}
                                                    className="text-primary text-center m-auto"
                                                >
                                                    86%
                                                </Typography>
                                            </Box>

                                            <Box sx={{ padding: 2 }}>
                                                <Typography sx={{ fontSize: theme.typography.h3 }}>360k</Typography>
                                                <Typography>Target</Typography>
                                            </Box>

                                            <Box sx={{ padding: 2 }}>
                                                <Typography sx={{ fontSize: theme.typography.h3 }}>282k</Typography>
                                                <Typography>Collected</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={3.8}>
                                    <Box
                                        sx={{
                                            backgroundColor: theme.palette.background.default,

                                            marginY: 2,
                                            borderRadius: 1.5,
                                            border: 1,
                                            borderColor: theme.palette.grey[300]
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ paddingLeft: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}>
                                                Yearly
                                            </Typography>
                                            <Typography sx={{ paddingRight: 1.8, paddingY: 1, fontSize: theme.typography.h4 }}></Typography>
                                        </Box>

                                        <Divider />
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                                paddingY: 2
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    height: 60,
                                                    width: 60,
                                                    borderRadius: 30,
                                                    backgroundColor: theme.palette.primary.light,
                                                    display: 'flex',
                                                    justifyContent: '',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: theme.typography.h3,
                                                        marginTop: 0.5,
                                                        marginRight: 1
                                                    }}
                                                    className="text-primary text-center m-auto"
                                                >
                                                    74%
                                                </Typography>
                                            </Box>

                                            <Box sx={{ padding: 2 }}>
                                                <Typography sx={{ fontSize: theme.typography.h3 }}>30k</Typography>
                                                <Typography>Target</Typography>
                                            </Box>

                                            <Box sx={{ padding: 2 }}>
                                                <Typography sx={{ fontSize: theme.typography.h3 }}>32k</Typography>
                                                <Typography>Collected</Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={3.4}>
                            <Box sx={{ backgroundColor: theme.palette.background.default, borderRadius: 2, paddingY: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 1.5 }}>
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Add New
                                    </Typography>
                                </Box>
                                <Divider />

                                <Box
                                    sx={{
                                        padding: 1.2,
                                        borderRadius: 2,
                                        borderWidth: 1,
                                        borderColor: theme.palette.grey[400],
                                        margin: 2,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Stock
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Package
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Target
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: theme.palette.background.default, borderRadius: 2, paddingY: 1, marginTop: 1 }}>
                                <Box
                                    sx={{
                                        padding: 2,
                                        borderRadius: 2,
                                        borderWidth: 1,
                                        borderColor: theme.palette.grey[400],
                                        backgroundColor: theme.palette.background,

                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Total Customer
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        2342
                                    </Typography>
                                </Box>
                            </Box>

                            <Box sx={{ backgroundColor: theme.palette.background.default, borderRadius: 2, paddingY: 1, marginTop: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 1.5 }}>
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Low Stocks
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.h3,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Shops
                                    </Typography>
                                </Box>
                                <Divider />

                                <Box
                                    sx={{
                                        padding: 1.2,
                                        borderRadius: 2,
                                        borderWidth: 1,
                                        borderColor: theme.palette.grey[400],
                                        margin: 2,
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.body2,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        Rice
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: theme.typography.body2,
                                            fontWeight: theme.typography.fontWeightMedium,
                                            color: theme.palette.primary.dark
                                        }}
                                    >
                                        12 KG
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
