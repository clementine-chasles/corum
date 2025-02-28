import { useForm, SubmitHandler } from 'react-hook-form';
import { Alert, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage.tsx';
import { useState } from 'react';
import useUser from '../../../hooks/useUser.ts';

type LoginForm = {
  email: string;
  password: string;
};

export const Login = () => {
  const { logIn } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    console.log(data);
    setError(false);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const { jwt } = await response.json();
        logIn(jwt);
        navigate('/home');
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
          <Link to="/register">Don't have an account yet? Register!</Link>
        </div>
        <Button type="submit" variant="outlined">
          Submit
        </Button>
        {error && (
          <Alert className="my-4" severity="error">
            Login was not successful, check your username and password.
          </Alert>
        )}
      </div>
    </form>
  );
};
