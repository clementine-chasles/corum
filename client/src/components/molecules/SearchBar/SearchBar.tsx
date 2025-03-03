import { Button, TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';

export const SearchBar = () => {
  const { register } = useFormContext();
  return (
    <div className="mb-4! flex">
      <TextField
        className="w-full"
        {...register('search')}
        type="text"
        label="Search"
        placeholder="Search"
        variant="outlined"
      />
      <Button className="ml-4!" type="submit" variant="contained">
        Search
      </Button>
    </div>
  );
};
