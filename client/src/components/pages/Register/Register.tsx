import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Alert, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUser from '../../../hooks/useUser.ts';
import { UserForm } from '../../organisms/UserForm/UserForm.tsx';
import { FullUserForm } from '../../../types/user.ts';

export const Register = () => {
  const navigate = useNavigate();
  const { logIn } = useUser();
  const [error, setError] = useState(false);
  const formProviderMethods = useForm<FullUserForm>();
  const { handleSubmit } = formProviderMethods;
  const onSubmit: SubmitHandler<FullUserForm> = async (data) => {
    setError(false);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: { 'Content-Type': 'application/json' },
        });
        if (loginResponse.ok) {
          const { jwt } = await loginResponse.json();
          logIn(jwt);
          navigate('/home');
        } else {
          navigate('/login');
        }
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  return (
    <FormProvider {...formProviderMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-center h-full">
        <div className="w-90">
          <UserForm />
          <Button type="submit" variant="outlined">
            Register
          </Button>
          {error && (
            <Alert className="my-4" severity="error">
              Registration was not successful, please make sure that you don't already have an account with this email.
            </Alert>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
