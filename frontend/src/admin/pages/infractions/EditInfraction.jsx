import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    Divider,
    CircularProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function EditInfraction() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ticket, setTicket] = useState(null);
    const [location, setLocation] = useState("");
    const [details, setDetails] = useState([]);
    const [newDetails, setNewDetails] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const [selectedInfraction, setSelectedInfraction] = useState("");

    const canEdit = ticket && ticket.status === "Pending";

    useEffect(() => {
        loadTicket();
        loadCatalog();
    }, []);

    const loadTicket = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/tickets/${id}`);
            const data = response.data.message;
            setTicket(data);
            setLocation(data.location);
            setDetails(data.details || []);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar la multa.");
        } finally {
            setLoading(false);
        }
    };

    const loadCatalog = async () => {
        try {
            const response = await api.get("/infractions");
            setCatalog(response.data.message || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddInfraction = () => {
        if (!selectedInfraction) return;

        const infraction = catalog.find(
            item => item.infraction_id === selectedInfraction
        );

        if (!infraction) return;

        const existsInDetails = details.some(
            item => item.infraction_id === infraction.infraction_id
        );

        const existsInNew = newDetails.some(
            item => item.infraction_id === infraction.infraction_id
        );

        if (existsInDetails || existsInNew) {
            alert("Esta infracción ya está asociada a la multa.");
            return;
        }

        setNewDetails([
            ...newDetails,
            infraction
        ]);

        setSelectedInfraction("");
    };

    const handleRemoveNewInfraction = (infractionId) => {
        setNewDetails(
            newDetails.filter(
                item => item.infraction_id !== infractionId
            )
        );
    };

    const handleDeleteDetail = async (id_detail) => {
        try {
            await api.delete(`/ticket-details/${id_detail}`);

            // Actualizar el estado local eliminando el detalle
            setTicket({
                ...ticket,
                details: ticket.details.filter(
                    d => d.id_detail !== id_detail
                )
            });
            // También actualizar el array details si se usa aparte
            setDetails(details.filter(d => d.id_detail !== id_detail));

            alert("Infracción eliminada correctamente.");
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al eliminar la infracción.");
        }
    };

    const handleSave = async () => {
        try {
            const ticketData = {
                ticket_number: ticket.ticket_number,
                id_officer: ticket.id_officer,
                id_driver: ticket.id_driver,
                id_vehicle: ticket.id_vehicle,
                id_condition: ticket.id_condition,
                location,
                issue_timestamp: ticket.issue_timestamp,
                status: ticket.status,
                observations: ticket.observations,
                ut_daily_value_bs: ticket.ut_daily_value_bs,
                total_ut: ticket.total_ut
            };

            await api.put(`/tickets/${ticket.id_ticket}`, ticketData);

            for (const item of newDetails) {
                await api.post("/ticket-details", {
                    id_ticket: ticket.id_ticket,
                    infraction_id: item.infraction_id
                });
            }

            alert("Multa actualizada correctamente.");
            navigate("/admin/infractions/my");
        } catch (err) {
            console.error(err);
            alert("Ocurrió un error al guardar los cambios.");
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h4"
                fontWeight={700}
                mb={3}
            >
                Editar Multa
            </Typography>

            {ticket && !canEdit && (
                <Alert
                    severity="warning"
                    sx={{ mt: 2, mb: 3 }}
                >
                    Esta multa ya no puede modificarse porque su estado es:
                    <strong> {ticket.status}</strong>
                </Alert>
            )}

            <Paper sx={{ p: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="N° Boleta"
                            fullWidth
                            value={ticket.ticket_number}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Estado"
                            fullWidth
                            value={ticket.status}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Conductor"
                            fullWidth
                            value={ticket.driver_name}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Cédula"
                            fullWidth
                            value={ticket.driver_identification}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Vehículo"
                            fullWidth
                            value={ticket.vehicle_plate}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Fecha"
                            fullWidth
                            value={new Date(ticket.issue_timestamp).toLocaleString()}
                            disabled
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Lugar de la infracción
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            label="Lugar"
                            fullWidth
                            value={location}
                            disabled={!canEdit}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Infracciones asociadas
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ mt: 2 }}>
                            {details.length === 0 ? (
                                <Alert severity="info">
                                    Esta multa no posee infracciones asociadas.
                                </Alert>
                            ) : (
                                details.map((detail) => (
                                    <Paper
                                        key={detail.id_detail}
                                        sx={{
                                            p: 2,
                                            mb: 2,
                                            borderLeft: "5px solid #1976d2",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}
                                    >
                                        <Box>
                                            <Typography fontWeight={600}>
                                                {detail.violation_description}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {detail.ut_quantity} UT
                                            </Typography>
                                        </Box>
                                        {canEdit && (
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                size="small"
                                                onClick={() =>
                                                    handleDeleteDetail(detail.id_detail)
                                                }
                                            >
                                                Eliminar
                                            </Button>
                                        )}
                                    </Paper>
                                ))
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 3 }} />
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            mb={2}
                        >
                            Agregar nueva infracción
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>
                                Seleccione una infracción
                            </InputLabel>
                            <Select
                                value={selectedInfraction}
                                label="Seleccione una infracción"
                                disabled={!canEdit}
                                onChange={(e) => setSelectedInfraction(e.target.value)}
                            >
                                {catalog.map((item) => (
                                    <MenuItem
                                        key={item.infraction_id}
                                        value={item.infraction_id}
                                    >
                                        {item.violation_description}
                                        {" "}
                                        ({item.ut_quantity} UT)
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Box
                            sx={{
                                mt: 2,
                                display: "flex",
                                justifyContent: "flex-end"
                            }}
                        >
                            <Button
                                variant="contained"
                                disabled={!canEdit}
                                onClick={handleAddInfraction}
                            >
                                Agregar
                            </Button>
                        </Box>
                    </Grid>

                    {newDetails.length > 0 && (
                        <Grid item xs={12}>
                            <Box mt={3}>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                >
                                    Nuevas infracciones
                                </Typography>
                                {newDetails.map((item) => (
                                    <Paper
                                        key={item.infraction_id}
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            borderLeft: "5px solid green"
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Box>
                                                <Typography>
                                                    {item.violation_description}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {item.ut_quantity} UT
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                color="error"
                                                disabled={!canEdit}
                                                onClick={() =>
                                                    handleRemoveNewInfraction(item.infraction_id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Paper>
                                ))}
                            </Box>
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <Box
                            sx={{
                                mt: 4,
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2
                            }}
                        >
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/admin/infractions/my")}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="contained"
                                disabled={!canEdit}
                                onClick={handleSave}
                            >
                                Guardar cambios
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}