import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const LineChartComponent = ({ data }) => {
    return (
        <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
                {
                    data: [2, 5.5, 2, 8.5, 1.5, 500]
                }
            ]}
            width={600}
            height={400}
            style={{ backgroundColor: 'lightblue', color: 'blue', borderRadius: 10 }}
        />
    );
};

export default LineChartComponent;
