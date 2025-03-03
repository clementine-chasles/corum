import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { UserForm } from '../../organisms/UserForm/UserForm';
import { FullUserForm } from '../../../types/user';

export const AddUser = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const formProviderMethods = useForm<FullUserForm>({ mode: 'onChange' });
  const { handleSubmit } = formProviderMethods;
  const onSubmit: SubmitHandler<FullUserForm> = async (data) => {
    setError(false);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ ...data, password: null }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        navigate('/home');
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <FormProvider {...formProviderMethods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        data-testid="register-form"
        className="flex items-center justify-center h-full"
      >
        <div className="w-90">
          <UserForm hidePassword />
          <Button type="submit" variant="outlined">
            Add user
          </Button>
          {error && (
            <Alert className="my-4" severity="error">
              Creation was not successful, please make sure that a user with the same email address doesn't already
              exist.
            </Alert>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
