import React from 'react';
import Chart from 'react-apexcharts';

const MonthlyRevenueChart = ({ monthlyTotal }) => {
    const chartOptions = {
        chart: {
            type: 'bar'
        },
        xaxis: {
            categories: monthlyTotal.map((item) => item.month)
        }
    };

    const chartSeries = [
        {
            name: 'Revenue',
            data: monthlyTotal.map((item) => item.totalRevenue)
        }
    ];

    return <Chart options={chartOptions} series={chartSeries} type="bar" />;
};

export default MonthlyRevenueChart;
