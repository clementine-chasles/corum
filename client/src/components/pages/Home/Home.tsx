import { useEffect, useState, useTransition } from 'react';
import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { User } from '../../../types/user.ts';

export const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const loadUsers = async () => {
    startTransition(async () => {
      setError(false);
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
        });
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
