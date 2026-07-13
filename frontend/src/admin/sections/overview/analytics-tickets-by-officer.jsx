// frontend/src/admin/sections/overview/analytics-tickets-by-officer.jsx
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme } from '@mui/material/styles';
import { Chart, useChart } from 'src/admin/components/chart';

export function AnalyticsTicketsByOfficer({ title, chart, sx, ...other }) {
    const theme = useTheme();
    const chartColors = [theme.palette.primary.main];

    const chartOptions = useChart({
        colors: chartColors,
        chart: { type: 'bar' },
        xaxis: { categories: chart.officers },
        legend: { show: false },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '40%',
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => `${val} multas`,
        },
    });

    return (
        <Card sx={sx} {...other}>
            <CardHeader title={title} />
            <Chart
                type="bar"
                series={[{ data: chart.data }]}
                options={chartOptions}
                sx={{
                    py: 2,
                    px: 1,
                    height: 320,
                }}
            />
        </Card>
    );
}