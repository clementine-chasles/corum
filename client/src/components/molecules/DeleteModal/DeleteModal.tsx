import { Alert, Button, Dialog, DialogTitle } from '@mui/material';
import { useState, useTransition } from 'react';
import { User } from '../../../types/user.ts';
import useUser from '../../../hooks/useUser.ts';
import { makeCall } from '../../../utils.ts';

interface Props {
  user?: User;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteModal = ({ user, onClose, onDelete }: Props) => {
  const [error, setError] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { token } = useUser();
  const deleteUser = async () => {
    startTransition(async () => {
      setError(false);
      try {
        const response = await makeCall(
          `/api/users/${user?.id}`,
          {
            method: 'DELETE',
          },
          token,
        );
        if (response.ok) {
          onDelete();
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
    });
  };
  return (
    <Dialog onClose={onClose} open={Boolean(user)}>
      <div className="p-8">
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <div>
          <span className="font-bold">Email:</span> {user?.email}
        </div>
        <div>
          <span className="font-bold">Name:</span> {user?.firstName} {user?.lastName}
        </div>
        <div className="flex justify-center mt-4 gap-2">
          <Button variant="outlined" onClick={onClose} disabled={isPending}>
            No, dismiss
          </Button>
          <Button variant="outlined" onClick={deleteUser} disabled={isPending}>
            Yes, confirm
          </Button>
        </div>
        {error && (
          <Alert className="m-8" severity="error">
            Something went wrong while deleting the user. Please try again later.
          </Alert>
        )}
      </div>
    </Dialog>
  );
};
