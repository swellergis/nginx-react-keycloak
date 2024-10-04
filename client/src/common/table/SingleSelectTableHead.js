import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

// a table head for tables we don't want to allow multiple rows to be selected in
export default function SingleSelectTableHead(props) {
    const { order, orderBy, onRequestSort, headCells, fetchMethod, id } =
        props;
    const createSortHandler = (property) => (event) => {
        fetchMethod(true);
        onRequestSort(event, property);
    };

    return (
        <TableHead id={id}>
            <TableRow>
                <TableCell padding="checkbox">
                    {/* intentionally empty div */}
                    <div />
                </TableCell>
                {headCells.map((headCell) => {
                    if (headCell.hide) {
                        return "";
                    }
                    return (
                        <TableCell
                            key={headCell.id}
                            align={'left'}
                            // align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'normal'}
                            sortDirection={orderBy === headCell.id ? order : false}
                        >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                                {orderBy === headCell.id ? (
                                    <Box component="span" sx={visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </Box>
                                ) : null}
                            </TableSortLabel>
                        </TableCell>
                    )
                })}
            </TableRow>
        </TableHead>
    );
}
