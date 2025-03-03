import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

export type Order = 'asc' | 'desc';

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  allowSort: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'firstName',
    numeric: false,
    disablePadding: true,
    label: 'First name',
    allowSort: true,
  },
  {
    id: 'lastName',
    numeric: false,
    disablePadding: true,
    label: 'Last name',
    allowSort: true,
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: true,
    label: 'Email',
    allowSort: true,
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: true,
    label: 'Actions',
    allowSort: false,
  },
];

export function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.allowSort ? (
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
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
