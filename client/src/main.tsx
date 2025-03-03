import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './index.css';
import App from './App';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { createTheme, ThemeProvider } from '@mui/material';
import { amber, deepPurple } from '@mui/material/colors';

dayjs.extend(utc);

const theme = createTheme({
  palette: {
    primary: deepPurple,
    secondary: amber,
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <App />
      </LocalizationProvider>
    </ThemeProvider>
  </StrictMode>,
);
