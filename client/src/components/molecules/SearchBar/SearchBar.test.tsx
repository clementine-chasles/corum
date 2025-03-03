import { SearchBar } from './SearchBar';
import { render, screen } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';

const Component = () => {
  const method = useForm();
  return (
    <FormProvider {...method}>
      <SearchBar />
    </FormProvider>
  );
};

describe('SearchBar', () => {
  it('should render search bar', () => {
    render(<Component />);
    expect(screen.getByPlaceholderText('Search')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Search' })).toBeVisible();
  });
});
