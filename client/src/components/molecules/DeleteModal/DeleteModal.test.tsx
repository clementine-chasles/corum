import { DeleteModal } from './DeleteModal';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { User } from '../../../types/user';
import fetchMock from 'jest-fetch-mock';

const user: User = {
  id: 'id1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@test.com',
  dateOfBirth: '2020-01-01T00:00:00.000Z',
};

describe('DeleteModal', () => {
  it('should allow deletion of user', async () => {
    const onDelete = jest.fn();
    const onClose = jest.fn();
    render(<DeleteModal user={user} onDelete={onDelete} onClose={onClose} />);
    await waitFor(() => expect(screen.getByText('Are you sure you want to delete this user?')).toBeVisible());
    expect(screen.getByText('test@test.com')).toBeVisible();
    expect(screen.getByText('John Doe')).toBeVisible();
    fireEvent.click(screen.getByText('Yes, confirm'));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith('/api/users/id1', { method: 'DELETE', headers: expect.anything() }),
    );
    expect(onDelete).toHaveBeenCalled();
  });
  it('should close modal', async () => {
    const onDelete = jest.fn();
    const onClose = jest.fn();
    render(<DeleteModal user={user} onDelete={onDelete} onClose={onClose} />);
    await waitFor(() => expect(screen.getByText('Are you sure you want to delete this user?')).toBeVisible());
    expect(screen.getByText('test@test.com')).toBeVisible();
    expect(screen.getByText('John Doe')).toBeVisible();
    fireEvent.click(screen.getByText('No, dismiss'));
    expect(onClose).toHaveBeenCalled();
  });
  it('should reject deletion', async () => {
    const onDelete = jest.fn();
    const onClose = jest.fn();
    fetchMock.mockReject(new Error('500'));
    render(<DeleteModal user={user} onDelete={onDelete} onClose={onClose} />);
    await waitFor(() => expect(screen.getByText('Are you sure you want to delete this user?')).toBeVisible());
    expect(screen.getByText('test@test.com')).toBeVisible();
    expect(screen.getByText('John Doe')).toBeVisible();
    fireEvent.click(screen.getByText('Yes, confirm'));
    await waitFor(() =>
      expect(screen.getByText('Something went wrong while deleting the user. Please try again later.')).toBeVisible(),
    );
  });
});
