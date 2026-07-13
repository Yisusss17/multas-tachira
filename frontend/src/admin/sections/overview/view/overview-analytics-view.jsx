// frontend/src/admin/sections/overview/view/overview-analytics-view.jsx
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { DashboardContent } from 'src/admin/layouts/dashboard';

// Componentes
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// Nuevos componentes (los crearemos después)
import { AnalyticsRecentTickets } from '../analytics-recent-tickets';
import { AnalyticsTicketsByOfficer } from '../analytics-tickets-by-officer';

// Servicio API
import {
    getDashboardStats,
    getTicketsByMonth,
    getTicketsByStatus,
    getTicketsByOfficer,
    getTicketsByInfraction,
    getRecentTickets
} from 'src/admin/api/dashboard';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [ticketsByMonth, setTicketsByMonth] = useState({ months: [], data: [] });
    const [ticketsByStatus, setTicketsByStatus] = useState({ pending: 0, paid: 0, cancelled: 0 });
    const [ticketsByOfficer, setTicketsByOfficer] = useState({ officers: [], data: [] });
    const [ticketsByInfraction, setTicketsByInfraction] = useState({ infractions: [], data: [] });
    const [recentTickets, setRecentTickets] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [
                    statsRes,
                    monthRes,
                    statusRes,
                    officerRes,
                    infractionRes,
                    recentRes
                ] = await Promise.all([
                    getDashboardStats(),
                    getTicketsByMonth(),
                    getTicketsByStatus(),
                    getTicketsByOfficer(),
                    getTicketsByInfraction(),
                    getRecentTickets()
                ]);

                setStats(statsRes.data.message);
                setTicketsByMonth(monthRes.data.message);
                setTicketsByStatus(statusRes.data.message);
                setTicketsByOfficer(officerRes.data.message);
                setTicketsByInfraction(infractionRes.data.message);
                setRecentTickets(recentRes.data.message);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <DashboardContent maxWidth="xl">
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Cargando estadísticas...
                    </Typography>
                </Box>
            </DashboardContent>
        );
    }

    // Preparar datos para gráficos
    const statusData = [
        { label: 'Pendientes', value: ticketsByStatus.pending || 0 },
        { label: 'Pagadas', value: ticketsByStatus.paid || 0 },
        { label: 'Anuladas', value: ticketsByStatus.cancelled || 0 }
    ];

    // Calcular total de multas
    const totalTickets = stats?.totalTickets || 0;

    return (
        <DashboardContent maxWidth="xl">
            <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                Panel de Control 🚓
            </Typography>

            <Grid container spacing={3}>
                {/* Tarjetas de resumen */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="Total Multas"
                        total={stats?.totalTickets || 0}
                        icon={
                            <img
                                alt="Total tickets"
                                src="/assets/icons/glass/ic-glass-bag.svg"
                            />
                        }
                        chart={{
                            categories: ticketsByMonth.months.slice(0, 8),
                            series: ticketsByMonth.data.slice(0, 8)
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="Pendientes"
                        total={stats?.pendingTickets || 0}
                        color="warning"
                        icon={
                            <img
                                alt="Pending"
                                src="/assets/icons/glass/ic-glass-clock.svg"
                            />
                        }
                        chart={{
                            categories: ['Pendientes'],
                            series: [stats?.pendingTickets || 0]
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="Pagadas"
                        total={stats?.paidTickets || 0}
                        color="success"
                        icon={
                            <img
                                alt="Paid"
                                src="/assets/icons/glass/ic-glass-buy.svg"
                            />
                        }
                        chart={{
                            categories: ['Pagadas'],
                            series: [stats?.paidTickets || 0]
                        }}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <AnalyticsWidgetSummary
                        title="Oficiales Activos"
                        total={stats?.totalOfficers || 0}
                        color="primary"
                        icon={
                            <img
                                alt="Officers"
                                src="/assets/icons/glass/ic-glass-users.svg"
                            />
                        }
                        chart={{
                            categories: ['Oficiales'],
                            series: [stats?.totalOfficers || 0]
                        }}
                    />
                </Grid>

                {/* Gráfico: Distribución por estado */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <AnalyticsCurrentVisits
                        title="Distribución por Estado"
                        chart={{
                            series: statusData
                        }}
                    />
                </Grid>

                {/* Gráfico: Multas por mes */}
                <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                    <AnalyticsWebsiteVisits
                        title="Multas por Mes"
                        subheader={`Total: ${totalTickets} multas`}
                        chart={{
                            categories: ticketsByMonth.months,
                            series: [
                                { name: 'Multas', data: ticketsByMonth.data }
                            ]
                        }}
                    />
                </Grid>

                {/* Gráfico: Multas por oficial */}
                <Grid size={{ xs: 12, md: 6, lg: 8 }}>
                    <AnalyticsTicketsByOfficer
                        title="Multas por Oficial (Top 5)"
                        chart={{
                            officers: ticketsByOfficer.officers,
                            data: ticketsByOfficer.data
                        }}
                    />
                </Grid>

                {/* Gráfico: Multas por infracción */}
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <AnalyticsConversionRates
                        title="Infracciones más Comunes"
                        subheader="Top 5 infracciones"
                        chart={{
                            categories: ticketsByInfraction.infractions,
                            series: [
                                { name: 'Cantidad', data: ticketsByInfraction.data }
                            ]
                        }}
                    />
                </Grid>

                {/* Últimas multas */}
                <Grid size={{ xs: 12, md: 12, lg: 12 }}>
                    <AnalyticsRecentTickets
                        title="Últimas Multas"
                        tickets={recentTickets}
                    />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}