// frontend/src/admin/sections/overview/analytics-recent-tickets.jsx
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function AnalyticsRecentTickets({ title, tickets, sx, ...other }) {
    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'warning',
            'Paid': 'success',
            'Cancelled': 'error'
        };
        return colors[status] || 'default';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'Pending': 'Pendiente',
            'Paid': 'Pagada',
            'Cancelled': 'Anulada'
        };
        return labels[status] || status;
    };

    if (!tickets || tickets.length === 0) {
        return (
            <Card sx={sx} {...other}>
                <CardHeader title={title} />
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        No hay multas registradas
                    </Typography>
                </Box>
            </Card>
        );
    }

    return (
        <Card sx={sx} {...other}>
            <CardHeader title={title} />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>N° Boleta</TableCell>
                            <TableCell>Lugar</TableCell>
                            <TableCell>Conductor</TableCell>
                            <TableCell>Vehículo</TableCell>
                            <TableCell>Total (Bs)</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.map((ticket, index) => (
                            <TableRow key={index}>
                                <TableCell>{ticket.ticket_number}</TableCell>
                                <TableCell>{ticket.location}</TableCell>
                                <TableCell>{ticket.driver_name || 'N/A'}</TableCell>
                                <TableCell>{ticket.vehicle_plate || 'N/A'}</TableCell>
                                <TableCell>
    {typeof ticket.total_bs === 'number' ? ticket.total_bs.toFixed(2) : '0.00'}
</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusLabel(ticket.status)}
                                        color={getStatusColor(ticket.status)}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
}