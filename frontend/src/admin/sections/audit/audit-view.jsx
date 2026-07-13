import { useState, useCallback, useEffect } from 'react';
import api from 'src/api/axios'; // Nuestra conexión inteligente

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/admin/layouts/dashboard';
import { Scrollbar } from 'src/admin/components/scrollbar';

import { AuditTableHead } from './audit-table-head';
import { AuditToolbar } from './audit-toolbar';
import { AuditTableRow } from './audit-table-row';
import { AuditTableNoData } from './audit-table-no-data';
import { AuditTableEmptyRows } from './audit-table-empty-rows';
import { emptyRows, applyFilter, getComparator } from './audit-utils';

// ----------------------------------------------------------------------

export function AuditView() {
  const table = useTable();

  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      // Simplificado: 'api' ya sabe la URL y ya le pega el token automáticamente
      const response = await api.get('/audit');
      setAudits(response.data.message || []);
    } catch (err) {
      console.error('Error al cargar las auditorías:', err);
    } finally {
      setLoading(false);
    }
  };

  const dataFiltered = applyFilter({
    inputData: audits,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Bitácora de Auditoría
        </Typography>
      </Box>

      <Card>
        <AuditToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Table sx={{ minWidth: 800 }}>
                <AuditTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={audits.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      audits.map((item) => item.id_audit),
                    )
                  }
                  headLabel={[
                    { id: 'id_user', label: 'Usuario' },
                    { id: 'module', label: 'Módulo' },
                    { id: 'action', label: 'Acción' },
                    { id: 'description', label: 'Descripción' },
                    { id: 'created_at', label: 'Fecha' },
                    { id: 'reference_id', label: 'Referencia' },
                  ]}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage,
                    )
                    .map((row) => (
                      <AuditTableRow
                        key={row.id_audit}
                        row={row}
                        selected={table.selected.includes(row.id_audit)}
                        onSelectRow={() => table.onSelectRow(row.id_audit)}
                      />
                    ))}

                  <AuditTableEmptyRows
                    height={68}
                    emptyRows={emptyRows(
                      table.page,
                      table.rowsPerPage,
                      audits.length,
                    )}
                  />

                  {notFound && <AuditTableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            )}
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={audits.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('created_at');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('desc');

  const onSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy],
  );

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected],
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage],
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}