import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Home } from '../Home/Home';
import fetchMock from 'jest-fetch-mock';
import { userEvent } from '@testing-library/user-event';
import { UpdateUser } from './UpdateUser';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { User } from '../../../types/user';

dayjs.extend(utc);

const user: User = {
  id: 'id1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@test.com',
  dateOfBirth: '2020-01-01T00:00:00.000Z',
};

const renderUpdateUser = () => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MemoryRouter initialEntries={['/update/id1']}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </MemoryRouter>
    </LocalizationProvider>,
  );
};

describe('UpdateUser', () => {
  it('should update user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));
    fetchMock.mockResponseOnce(JSON.stringify({}));
    fetchMock.mockResponseOnce(JSON.stringify([]));
    renderUpdateUser();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/users/id1', { method: 'GET', headers: expect.anything() }),
    );
    await userEvent.clear(screen.getByLabelText('Email'));
    await userEvent.clear(screen.getByLabelText('First name'));
    await userEvent.clear(screen.getByLabelText('Last name'));
    await userEvent.clear(screen.getByLabelText('Date of birth'));
    await userEvent.type(screen.getByLabelText('Email'), 'test2@test.com');
    await userEvent.type(screen.getByLabelText('First name'), 'Jane');
    await userEvent.type(screen.getByLabelText('Last name'), 'Smith');
    fireEvent.change(screen.getByLabelText('Date of birth'), { target: { value: '02/02/2020' } });
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/users/id1', {
        method: 'PATCH',
        headers: expect.anything(),
        body: JSON.stringify({
          id: 'id1',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'test2@test.com',
          dateOfBirth: '2020-02-02T00:00:00.000Z',
        }),
      }),
    );
    await waitFor(() => expect(screen.getByText('Users')).toBeVisible());
  });
  it('should reject user modification', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(user));
    fetchMock.mockRejectOnce(new Error('500'));
    renderUpdateUser();
    await waitFor(() => expect(screen.getByLabelText('Email')).toBeVisible());
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => expect(screen.getByText('Update was not successful, please try again later.')).toBeVisible());
  });
});
