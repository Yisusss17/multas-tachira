// src/admin/pages/infractions/InfractionDetails.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";

import api from "../../../api/axios";

const InfractionDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ticket, setTicket] = useState(null);
  const [details, setDetails] = useState([]);

  useEffect(() => {
    fetchInfractionDetails();
  }, [id]);



  

    const fetchInfractionDetails = async () => {

    setLoading(true);
    setError("");

    try {

      const response = await api.get(`/tickets/${id}`);

      if (response.data.status !== 200) {
        throw new Error("No se encontró la multa");
      }

      const ticketData = response.data.message;

      setTicket(ticketData);

      setDetails(ticketData.details || []);

    } catch (err) {

      console.error("Error cargando multa:", err);

      setError(
        err.response?.data?.message ||
        "Error al cargar la información de la multa"
      );

    } finally {

      setLoading(false);

    }

  };

  const getStatusColor = (status) => {

    switch (status) {

      case "Pending":
        return "warning";

      case "Paid":
        return "success";

      case "Cancelled":
        return "error";

      default:
        return "default";

    }

  };

  const handlePrint = () => {

    window.print();

  };









  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Cargando detalles...
        </Typography>
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Multa no encontrada'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/infractions/my')}
          sx={{ mt: 2 }}
        >
          Volver a mis multas
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }} id="print-area">
      {/* Botones de acción */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/infractions/my')}
        >
          Volver
        </Button>
        <Button
          startIcon={<PrintIcon />}
          variant="contained"
          onClick={handlePrint}
          sx={{ bgcolor: '#1976d2' }}
        >
          Imprimir
        </Button>
      </Box>

      {/* Cabecera de la multa */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
    Multa N° {ticket.ticket_number}
</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Chip
    label={ticket.status}
    color={getStatusColor(ticket.status)}
    sx={{ fontSize: "1rem", py: 2 }}
/>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={2}>

    <Grid item xs={12} md={4}>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            Fecha
        </Typography>

        <Typography
            variant="body1"
            sx={{ fontWeight: 500 }}
        >
            {new Date(ticket.issue_timestamp).toLocaleDateString("es-ES")}
        </Typography>

    </Grid>

    <Grid item xs={12} md={4}>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            Hora
        </Typography>

        <Typography
            variant="body1"
            sx={{ fontWeight: 500 }}
        >
            {new Date(ticket.issue_timestamp).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
            })}
        </Typography>

    </Grid>

    <Grid item xs={12} md={4}>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            Lugar
        </Typography>

        <Typography
            variant="body1"
            sx={{ fontWeight: 500 }}
        >
            {ticket.location}
        </Typography>

    </Grid>

</Grid>
      </Paper>

      {/* Información del infractor y vehículo */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
  <CardContent>

    <Typography
      variant="h6"
      sx={{ fontWeight: 600, mb: 2 }}
    >
      👤 Infractor
    </Typography>

    <Stack spacing={1}>

      <Typography variant="body2">
        <strong>Cédula:</strong>{" "}
        {ticket.driver_identification}
      </Typography>

      <Typography variant="body2">
        <strong>Nombre:</strong>{" "}
        {ticket.driver_name}
      </Typography>

      <Typography variant="body2">
        <strong>Condición:</strong>{" "}
        {ticket.condition_name}
      </Typography>

      <Typography variant="body2">
        <strong>Funcionario:</strong>{" "}
        {ticket.officer_name}
      </Typography>

    </Stack>

  </CardContent>
</Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>

  <CardContent>

    <Typography
      variant="h6"
      sx={{ fontWeight: 600, mb: 2 }}
    >
      🚗 Vehículo
    </Typography>

    <Stack spacing={1}>

      <Typography variant="body2">
        <strong>Placa:</strong>{" "}
        {ticket.vehicle_plate}
      </Typography>

      <Typography variant="body2">
        <strong>Marca:</strong>{" "}
        {ticket.vehicle_brand}
      </Typography>

      <Typography variant="body2">
        <strong>Modelo:</strong>{" "}
        {ticket.vehicle_model}
      </Typography>

    </Stack>

  </CardContent>

</Card>
        </Grid>
      </Grid>

      {/* Detalle de artículos */}
      <Paper sx={{ p: 3 }}>
        <Typography
    variant="h6"
    sx={{ fontWeight: 600, mb: 2 }}
>
    Infracciones Aplicadas
</Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: "grey.100" }}>
    <TableRow>

        <TableCell width={70}>
            <strong>#</strong>
        </TableCell>

        <TableCell>
            <strong>Descripción</strong>
        </TableCell>

        <TableCell align="right">
            <strong>UT</strong>
        </TableCell>

    </TableRow>
</TableHead>
            <TableBody>

    {
        details.length === 0 ?

            (

                <TableRow>

                    <TableCell
                        colSpan={3}
                        align="center"
                    >

                        <Typography color="text.secondary">

                            No existen infracciones registradas.

                        </Typography>

                    </TableCell>

                </TableRow>

            )

            :

            details.map((detail, index) => (

                <TableRow key={detail.id_detail}>

                    <TableCell>

                        {index + 1}

                    </TableCell>

                    <TableCell>

                        {detail.violation_description}

                    </TableCell>

                    <TableCell align="right">

                        {Number(detail.ut_quantity).toFixed(2)} UT

                    </TableCell>

                </TableRow>

            ))

    }

</TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 2 }} />

<Box
    sx={{
        display: "flex",
        justifyContent: "flex-end"
    }}
>

    <Box sx={{ textAlign: "right" }}>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            <strong>Total de infracciones:</strong> {details.length}
        </Typography>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            <strong>Total UT:</strong>{" "}
            {Number(ticket.total_ut).toFixed(2)}
        </Typography>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            <strong>Valor UT:</strong>{" "}
            Bs {Number(ticket.ut_daily_value_bs).toFixed(2)}
        </Typography>

        <Typography
            variant="h5"
            sx={{
                fontWeight: 700,
                color: "primary.main",
                mt: 1
            }}
        >
            Total Bs{" "}
            {(
                Number(ticket.total_ut) *
                Number(ticket.ut_daily_value_bs)
            ).toFixed(2)}
        </Typography>

    </Box>

</Box>

        {ticket.observations && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              <strong>Observaciones:</strong>

{ticket.observations}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default InfractionDetails;