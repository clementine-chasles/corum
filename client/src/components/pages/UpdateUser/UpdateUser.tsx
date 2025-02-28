import { useParams } from 'react-router';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { FullUserForm, User } from '../../../types/user.ts';
import { Alert, Button, CircularProgress } from '@mui/material';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { UserForm } from '../../organisms/UserForm/UserForm.tsx';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

export const UpdateUser = () => {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [user, setUser] = useState<User>();
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const formProviderMethods = useForm<FullUserForm>({
    defaultValues: useMemo(() => {
      return user;
    }, [user]),
  });
  const { handleSubmit, reset } = formProviderMethods;
  const loadUser = async () => {
    startTransition(async () => {
      setError(false);
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'GET',
        });
        if (response.ok) {
          const userById = await response.json();
          const formattedUser = { ...userById, dateOfBirth: dayjs(userById.dateOfBirth) };
          setUser(formattedUser);
          reset(formattedUser);
        } else {
          setError(true);
        }
      } catch (e) {
        console.log(e);
        setError(true);
      }
    });
  };
  useEffect(() => {
    loadUser();
  }, []);
  const onSubmit: SubmitHandler<FullUserForm> = async (data) => {
    setSubmitError(false);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        navigate('/home');
      } else {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    }
  };
  if (error) {
    return (
      <Alert className="m-8" severity="error">
        Something went wrong while fetching the user. Please try again later.
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
    <FormProvider {...formProviderMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-center h-full">
        <div className="w-90">
          <UserForm hidePassword />
          <Button type="submit" variant="outlined">
            Update
          </Button>
          {submitError && (
            <Alert className="my-4" severity="error">
              Update was not successful, please try again later.
            </Alert>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
