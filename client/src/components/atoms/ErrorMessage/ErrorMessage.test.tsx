import { ErrorMessage } from './ErrorMessage';
import { render, screen } from '@testing-library/react';

describe('ErrorMessage', () => {
  it('should render the error message', () => {
    render(<ErrorMessage label="test" />);
    expect(screen.getByText('test')).toBeVisible();
  });
});
