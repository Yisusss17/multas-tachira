import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Checkbox from "@mui/material/Checkbox";

export function AuditTableRow({
    row,
    selected,
    onSelectRow,
}) {

    return (

        <TableRow hover selected={selected}>

            <TableCell padding="checkbox">
                <Checkbox
                    checked={selected}
                    onChange={onSelectRow}
                />
            </TableCell>

            <TableCell>{row.id_user}</TableCell>

            <TableCell>{row.module}</TableCell>

            <TableCell>{row.action}</TableCell>

            <TableCell>{row.description}</TableCell>

            <TableCell>
                {new Date(row.created_at).toLocaleString()}
            </TableCell>

            <TableCell>
                {row.reference_id ?? "-"}
            </TableCell>

        </TableRow>

    );

}