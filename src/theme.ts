import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Outfit', sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html, body {
          font-family: 'Outfit', sans-serif !important;
        }
      `,
    },
  },
});

export default theme;
