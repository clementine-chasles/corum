import { useEffect, useState, useTransition } from 'react';
import {
  Alert,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { User } from '../../../types/user';
import { DeleteModal } from '../../molecules/DeleteModal/DeleteModal';
import useUser from '../../../hooks/useUser';
import { makeCall } from '../../../utils';
import { SearchBar } from '../../molecules/SearchBar/SearchBar';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { EnhancedTableHead, Order } from './Table.utils';

type SearchForm = {
  search?: string;
};

type LoadUserProps = {
  search?: string;
  orderBy: string;
  order: Order;
};

export const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [error, setError] = useState(false);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<string>('email');
  const [isPending, startTransition] = useTransition();
  const formProviderMethods = useForm();
  const search = formProviderMethods.watch('search');
  const { token } = useUser();
  const loadUsers = async (props?: LoadUserProps) => {
    const { search, order, orderBy } = props || {};
    startTransition(async () => {
      setError(false);
      try {
        const response = await makeCall(
          `/api/users?order=${order}&orderBy=${orderBy}${search ? `&search=${search}` : ''}`,
          {
            method: 'GET',
          },
          token,
        );
        if (response.ok) {
          const listOfUsers = await response.json();
          setUsers(listOfUsers);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    });
  };

  useEffect(() => {
    loadUsers({ order, orderBy, search });
  }, []);

  const openDeleteModal = (user: User) => {
    setCurrentUser(user);
  };

  const handleCloseModal = () => {
    setCurrentUser(undefined);
  };

  const onDelete = () => {
    handleCloseModal();
    loadUsers({ order, orderBy, search });
  };

  const handleRequestSort = (_event: React.MouseEvent<unknown>, property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setOrder(newOrder);
    setOrderBy(property);
    loadUsers({ order: newOrder, orderBy: property, search });
  };

  if (error) {
    return (
      <Alert className="m-8" severity="error">
        Something went wrong while fetching the users. Please try again later.
      </Alert>
    );
  }
  if (isPending) {
    return (
      <div data-testid="spinner" className="flex justify-center items-center mt-8">
        <CircularProgress />
      </div>
    );
  }

  const onSubmit: SubmitHandler<SearchForm> = async (data) => {
    await loadUsers({ order, orderBy, search: data.search });
  };
  return (
    <div className="flex items-start justify-start p-8">
      <div className="w-full">
        <Typography variant="h3" gutterBottom>
          Users
        </Typography>
        <div className="flex justify-end my-2">
          <Link to="/add">Add user</Link>
        </div>
        <FormProvider {...formProviderMethods}>
          <form onSubmit={formProviderMethods.handleSubmit(onSubmit)} data-testid="search-bar">
            <SearchBar />
          </form>
        </FormProvider>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small">
            <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
            <TableBody>
              {users.map((user: User) => (
                <TableRow
                  key={user.id}
                  data-testid={`row-${user.id}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Link to={`/update/${user.id}`}>Update</Link>
                    <IconButton
                      aria-label="delete"
                      data-testid="delete-button"
                      color="secondary"
                      onClick={() => openDeleteModal(user)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <DeleteModal user={currentUser} onClose={handleCloseModal} onDelete={onDelete} />
    </div>
  );
};
