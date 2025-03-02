import { TextField } from '@mui/material';
import { ErrorMessage } from '../../atoms/ErrorMessage/ErrorMessage';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';

export const UserForm = ({ hidePassword = false }) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <div className="mb-4!" data-testid="email">
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
      {!hidePassword && (
        <div className="mb-4!" data-testid="password">
          <TextField
            className="w-full"
            {...register('password', { required: true, minLength: 8, maxLength: 20 })}
            type="password"
            label="Password"
            placeholder="Password"
            variant="outlined"
          />
          {errors.password?.type === 'required' && <ErrorMessage label="This field is required" />}
          {['minLength', 'maxLength'].includes(errors.password?.type as string) && (
            <ErrorMessage label="The password must be between 8 and 20 characters long" />
          )}
        </div>
      )}
      <div className="mb-4!" data-testid="firstName">
        <TextField
          className="w-full"
          {...register('firstName', { required: true })}
          label="First name"
          placeholder="First name"
          variant="outlined"
        />
        {errors.firstName?.type === 'required' && <ErrorMessage label="This field is required" />}
      </div>
      <div className="mb-4!" data-testid="lastName">
        <TextField
          className="w-full"
          {...register('lastName', { required: true })}
          label="Last name"
          placeholder="Last name"
          variant="outlined"
        />
        {errors.lastName?.type === 'required' && <ErrorMessage label="This field is required" />}
      </div>
      <div className="mb-4!" data-testid="dateOfBirth">
        <Controller
          control={control}
          name="dateOfBirth"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <DatePicker label="Date of birth" className="w-full" value={value} timezone="UTC" onChange={onChange} />
          )}
        />
        {errors.dateOfBirth?.type === 'required' && <ErrorMessage label="This field is required" />}
      </div>
    </>
  );
};
