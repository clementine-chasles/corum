import { Home } from './Home';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import fetchMock from 'jest-fetch-mock';
import { User } from '../../../types/user';
import { UpdateUser } from '../UpdateUser/UpdateUser';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const user: User = {
  id: 'id1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@test.com',
  dateOfBirth: '2020-01-01T00:00:00.000Z',
};

const renderHome = () => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/update/:id" element={<UpdateUser />} />
        </Routes>
      </MemoryRouter>
    </LocalizationProvider>,
  );
};

describe('Home', () => {
  it('should display the list of users', async () => {
    fetchMock.mockResponse(JSON.stringify([user, { ...user, id: 'id2', firstName: 'Jane' }]));
    renderHome();
    await waitFor(() => expect(within(screen.getByTestId('row-id1')).getByText('John')).toBeVisible());
    expect(within(screen.getByTestId('row-id1')).getByText('Doe')).toBeVisible();
    expect(within(screen.getByTestId('row-id2')).getByText('Jane')).toBeVisible();
    expect(within(screen.getByTestId('row-id2')).getByText('Doe')).toBeVisible();
  });
  it('should display the spinner while loading', () => {
    fetchMock.mockResponse(JSON.stringify([user, { ...user, id: 'id2', firstName: 'Jane' }]));
    renderHome();
    expect(screen.getByTestId('spinner')).toBeVisible();
  });
  it('should display error message if loading of users was not successful', async () => {
    fetchMock.mockReject(new Error('500'));
    renderHome();
    await waitFor(() =>
      expect(screen.getByText('Something went wrong while fetching the users. Please try again later.')).toBeVisible(),
    );
  });
  it('should redirect to update page', async () => {
    fetchMock.mockResponse(JSON.stringify([user]));
    renderHome();
    await waitFor(() => expect(within(screen.getByTestId('row-id1')).getByText('John')).toBeVisible());
    fireEvent.click(screen.getByText('Update'));
    await waitFor(() => expect(screen.getByTestId('update-user-form')).toBeVisible());
  });
  it('should delete user', async () => {
    fetchMock.mockResponse(JSON.stringify([user]));
    renderHome();
    await waitFor(() => expect(within(screen.getByTestId('row-id1')).getByText('John')).toBeVisible());
    fireEvent.click(screen.getByLabelText('delete'));
    await waitFor(() => expect(screen.getByTestId('delete-user-modal')).toBeVisible());
    fireEvent.click(screen.getByText('Yes, confirm'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/users/id1', { method: 'DELETE', headers: expect.anything() }),
    );
  });
  it('should sort by first name', async () => {
    fetchMock.mockResponse(JSON.stringify([user, { ...user, id: 'id2', firstName: 'Jane' }]));
    renderHome();
    await waitFor(() => expect(within(screen.getByTestId('row-id1')).getByText('John')).toBeVisible());
    fireEvent.click(screen.getByText('First name'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/users?order=asc&orderBy=firstName', {
        method: 'GET',
        headers: expect.anything(),
      }),
    );
  });
});
