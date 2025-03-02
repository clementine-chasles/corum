import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home/Home';
import fetchMock from 'jest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { Register } from './Register';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const renderRegister = () => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    </LocalizationProvider>,
  );
};

describe('Register', () => {
  it('should register new user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ id: 'id1' }));
    fetchMock.mockResponseOnce(JSON.stringify({ jwt: 'jwt' }));
    fetchMock.mockResponseOnce(JSON.stringify([]));
    renderRegister();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('Password'), '12345678');
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    fireEvent.change(screen.getByLabelText('Date of birth'), { target: { value: '01/01/2020' } });
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({
          email: 'test@test.com',
          password: '12345678',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '2020-01-01T00:00:00.000Z',
        }),
      }),
    );
    await waitFor(() => expect(screen.getByText('Users')).toBeVisible());
  });
  it('should reject user registration', async () => {
    fetchMock.mockReject(new Error('500'));
    renderRegister();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('Password'), '12345678');
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    fireEvent.change(screen.getByLabelText('Date of birth'), { target: { value: '01/01/2020' } });
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(
        screen.getByText(
          "Registration was not successful, please make sure that you don't already have an account with this email.",
        ),
      ).toBeVisible(),
    );
  });
  it('should display form error messages for required fields', async () => {
    renderRegister();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() => expect(within(screen.getByTestId('email')).getByText('This field is required')).toBeVisible());
    await waitFor(() =>
      expect(within(screen.getByTestId('password')).getByText('This field is required')).toBeVisible(),
    );
    await waitFor(() =>
      expect(within(screen.getByTestId('firstName')).getByText('This field is required')).toBeVisible(),
    );
    await waitFor(() =>
      expect(within(screen.getByTestId('lastName')).getByText('This field is required')).toBeVisible(),
    );
    await waitFor(() =>
      expect(within(screen.getByTestId('dateOfBirth')).getByText('This field is required')).toBeVisible(),
    );
  });
  it('should display form error messages for format fields', async () => {
    renderRegister();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    await userEvent.type(screen.getByLabelText('Email'), 'test');
    await userEvent.type(screen.getByLabelText('Password'), '1');
    fireEvent.click(screen.getByText('Register'));
    await waitFor(() =>
      expect(within(screen.getByTestId('email')).getByText('This field must be a valid email')).toBeVisible(),
    );
    await waitFor(() =>
      expect(
        within(screen.getByTestId('password')).getByText('The password must be between 8 and 20 characters long'),
      ).toBeVisible(),
    );
  });
});
