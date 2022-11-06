/** @format */

import "../styles/globals.css";
// import 'bootstrap/dist/css/bootstrap.css';
// import '../styles/homepage/homepage.css';

import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/auth.context";
import { ThemeProvider } from "@mui/material";
import { theme } from "../config/theme.config";
import { AlertProvider } from "../contexts/alert.context";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default MyApp;
