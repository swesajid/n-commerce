/** @format */

import { FormEvent, useContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { tryLogin } from "../../api_calls/auth.api";
import PublicRoute from "../../components/auth/PublicRoute";
import { Card, Container } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Head from "next/head";

const NAMESPACE = "Login page";

export default function SignInSide() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState("/");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const response = await tryLogin(username, password, router, redirectTo);
    if (response) {
      if (response !== "fail") {
        setErrorText(response);
      } else {
        setErrorText("Something went wrong! Please try again");
      }
      setUsername("");
      setPassword("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.query.path) {
      setRedirectTo(router.query.path as string);
    }
  }, [router]);

  return (
    <PublicRoute>
      <Head>
        <title>Next App | Login</title>
      </Head>
      <Box
        component='main'
        sx={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          minHeight: "100vh",
        }}>
        <Container maxWidth='sm'>
          <Card sx={{ p: 3 }} elevation={6}>
            <Box sx={{ my: 3, textAlign: "center" }}>
              <Typography color='textPrimary' variant='h4'>
                Sign in
              </Typography>
              <Typography color='textSecondary' gutterBottom variant='body2'>
                Welcome
              </Typography>
              {errorText.length > 0 && (
                <Typography variant='body2' color='brown'>
                  {errorText}
                </Typography>
              )}
            </Box>
            <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin='normal'
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
                autoComplete='username'
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                value={username}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <FormControlLabel
                control={<Checkbox value='remember' color='primary' />}
                label='Remember me'
              />
              {/* <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                Sign In
                            </Button> */}
              <LoadingButton
                loading={loading}
                type='submit'
                fullWidth
                variant='contained'
                sx={{ mt: 3, mb: 2 }}>
                Sign In
              </LoadingButton>
              <Grid container>
                <Grid item xs>
                  <Link href='#' variant='body2'>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href='/auth/register' variant='body2'>
                    {"Not Yet a Member?"}
                  </Link>
                </Grid>
              </Grid>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Card>
        </Container>
      </Box>
    </PublicRoute>
  );
}

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;
