import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import Connections from 'api';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);

    const [isLoading, setLoading] = useState(true);
    const [stat, setStat] = useState([]);
    const [month] = useState('');
    const [year] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            var AdminApi = Connections.api + Connections.adminstat + `?month=${month}&year=${year}`;
            var SalesApi = Connections.api + Connections.shopstat + `?shop=${user.store_name}&month=${month}&year=${year}`;
            var Api = user.role === 'Admin' ? AdminApi : SalesApi;

            const response = await fetch(Api);
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
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} earnings={stat.monthlyEarnings ? stat.monthlyEarnings : 0} />
                    </Grid>

                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard
                            isLoading={isLoading}
                            monthlysales={stat.monthlySales ? stat.monthlySales : 0}
                            anualsales={stat.annualSales ? stat.annualSales : 0}
                        />
                    </Grid>
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeDarkCard isLoading={isLoading} totalProducts={stat.totalProducts ? stat.totalProducts : 0} />
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                <TotalIncomeLightCard
                                    isLoading={isLoading}
                                    totalcustomers={stat.totalCustomers ? stat.totalCustomers : 0}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} topProducts={stat.topProducts} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Dashboard;
