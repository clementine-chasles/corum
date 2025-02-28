import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Alert, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage.tsx';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import useUser from '../../../hooks/useUser.ts';

type RegisterForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export const Register = () => {
  const navigate = useNavigate();
  const { logIn } = useUser();
  const [error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterForm>();
  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-center justify-center h-full">
      <div className="w-90">
        <div className="mb-4!">
          <TextField
            className="w-full"
            {...register('email', {
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Entered value does not match email format',
              },
            })}
            type="email"
            label="Email"
            placeholder="Email"
            variant="outlined"
          />
          {errors.email?.type === 'required' && <ErrorMessage label="This field is required" />}
          {errors.email?.type === 'pattern' && <ErrorMessage label="This field must be a valid email" />}
        </div>
        <div className="mb-4!">
          <TextField
            className="w-full"
            {...register('password', { required: true, minLength: 8, maxLength: 20 })}
            type="password"
            label="Password"
            placeholder="Password"
            variant="outlined"
          />
          {errors.password?.type === 'required' && <ErrorMessage label="This field is required" />}
          {['minLength', 'maxLength'].includes(errors.password?.type) && (
            <ErrorMessage label="The password must be between 8 and 20 characters long" />
          )}
        </div>
        <div className="mb-4!">
          <TextField
            className="w-full"
            {...register('firstName', { required: true })}
            label="First name"
            placeholder="First name"
            variant="outlined"
          />
          {errors.firstName?.type === 'required' && <ErrorMessage label="This field is required" />}
        </div>
        <div className="mb-4!">
          <TextField
            className="w-full"
            {...register('lastName', { required: true })}
            label="Last name"
            placeholder="Last name"
            variant="outlined"
          />
          {errors.lastName?.type === 'required' && <ErrorMessage label="This field is required" />}
        </div>
        <div className="mb-4!">
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field: { onChange, value } }) => (
              <DatePicker className="w-full" onChange={onChange} value={value} />
            )}
          />

          {errors.dateOfBirth?.type === 'required' && <ErrorMessage label="This field is required" />}
        </div>
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
  );
};
