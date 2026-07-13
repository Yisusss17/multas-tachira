import React from 'react';
import { Chip } from '@mui/material';

const StatusChip = ({ status }) => {
  let color = 'default';
  let label = status || 'Pendiente';
  let customStyle = {};

  switch (status?.toLowerCase()) {
    case 'pagada':
    case 'paid':
      color = 'success';
      label = 'Pagada';
      customStyle = { backgroundColor: '#2E7D32', color: '#FFF' };
      break;
    case 'pendiente':
    case 'pending':
      color = 'warning';
      label = 'Pendiente';
      customStyle = { backgroundColor: '#FFB800', color: '#1A1A1A' };
      break;
    case 'no pagada':
    case 'unpaid':
    case 'active': // In DB, sometimes status is Active/Inactive
      color = 'error';
      label = 'No pagada';
      customStyle = { backgroundColor: '#D32F2F', color: '#FFF' };
      break;
    case 'anulada':
    case 'cancelled':
      color = 'default';
      label = 'Anulada';
      break;
    default:
      color = 'info';
      break;
  }

  return (
    <Chip 
      label={label} 
      size="small" 
      color={color}
      style={{ fontWeight: 600, ...customStyle }}
    />
  );
};

export default StatusChip;
