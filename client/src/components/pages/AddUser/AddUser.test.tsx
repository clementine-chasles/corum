import { render, waitFor, screen, fireEvent, within } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home/Home';
import fetchMock from 'jest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { AddUser } from './AddUser';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const renderAddUser = () => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MemoryRouter initialEntries={['/add']}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/add" element={<AddUser />} />
        </Routes>
      </MemoryRouter>
    </LocalizationProvider>,
  );
};

describe('AddUser', () => {
  it('should add a new user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ id: 'id1' }));
    fetchMock.mockResponseOnce(JSON.stringify([]));
    renderAddUser();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    await waitFor(() => expect(screen.queryByLabelText('Password')).not.toBeInTheDocument());
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    fireEvent.change(screen.getByLabelText('Date of birth'), { target: { value: '01/01/2020' } });
    fireEvent.click(screen.getByText('Add user'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/users', {
        method: 'POST',
        headers: expect.anything(),
        body: JSON.stringify({
          email: 'test@test.com',
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '2020-01-01T00:00:00.000Z',
          password: null,
        }),
      }),
    );
    await waitFor(() => expect(screen.getByText('Users')).toBeVisible());
  });
  it('should reject user creation', async () => {
    fetchMock.mockReject(new Error('500'));
    renderAddUser();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    await userEvent.type(screen.getByLabelText('Email'), 'test@test.com');
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    fireEvent.change(screen.getByLabelText('Date of birth'), { target: { value: '01/01/2020' } });
    fireEvent.click(screen.getByText('Add user'));
    await waitFor(() =>
      expect(
        screen.getByText(
          "Creation was not successful, please make sure that a user with the same email address doesn't already exist.",
        ),
      ).toBeVisible(),
    );
  });
});
