import { createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";

export const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#E3001B",
      },
      secondary: {
        main: green[500],
      },
    },
    typography: {
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
    },
  });
  