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
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { User } from '../../../types/user.ts';
import { DeleteModal } from '../../molecules/DeleteModal/DeleteModal.tsx';
import useUser from '../../../hooks/useUser.ts';
import { makeCall } from '../../../utils.ts';

export const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { token } = useUser();
  const loadUsers = async () => {
    startTransition(async () => {
      setError(false);
      try {
        const response = await makeCall(
          '/api/users',
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
    loadUsers();
  }, []);

  const openDeleteModal = (user: User) => {
    setCurrentUser(user);
  };

  const handleCloseModal = () => {
    setCurrentUser(undefined);
  };

  const onDelete = () => {
    handleCloseModal();
    loadUsers();
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
      <div className="flex justify-center items-center mt-8">
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className="flex items-start justify-start p-8">
      <div className="w-full">
        <Typography variant="h3" gutterBottom>
          Users
        </Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>First name</TableCell>
                <TableCell>Last name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Link to={`/update/${user.id}`}>Update</Link>
                    <IconButton aria-label="delete" color="error" onClick={() => openDeleteModal(user)}>
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
