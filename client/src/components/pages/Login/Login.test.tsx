import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home/Home';
import fetchMock from 'jest-fetch-mock';
import { Login } from './Login';
import { userEvent } from '@testing-library/user-event';
import { Register } from '../Register/Register';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const renderLogin = () => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    </LocalizationProvider>,
  );
};

describe('Login', () => {
  it('should login user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ jwt: 'jwt' }));
    fetchMock.mockResponseOnce(JSON.stringify([]));
    renderLogin();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    expect(screen.getByLabelText('Password')).toBeVisible();
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('Password'), '12345678');
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({
          email: 'test@test.com',
          password: '12345678',
        }),
      }),
    );
    await waitFor(() => expect(screen.getByText('Users')).toBeVisible());
  });
  it('should reject user login', async () => {
    fetchMock.mockReject(new Error('500'));
    renderLogin();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    expect(screen.getByLabelText('Password')).toBeVisible();
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('Password'), '12345678');
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/login', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({
          email: 'test@test.com',
          password: '12345678',
        }),
      }),
    );
    await waitFor(() =>
      expect(screen.getByText('Login was not successful, check your username and password.')).toBeVisible(),
    );
  });
  it('should redirect to register page', async () => {
    renderLogin();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    fireEvent.click(screen.getByText("Don't have an account yet? Register!"));
    await waitFor(() => expect(screen.getByTestId('register-form')).toBeVisible());
  });
});
