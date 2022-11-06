/** @format */

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import PublicRoute from "../../components/auth/PublicRoute";
import {
  Alert,
  Card,
  Container,
  FormControlLabel,
  RadioGroup,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import { useRouter } from "next/router";
import { Form, Formik } from "formik";
import TextInput from "../../components/form/TextInput";
import styled from "@emotion/styled";
import { useContext, useState } from "react";
import RegValidator, {
  iRegister,
} from "../../components/validators/registration.validator";
import { tryRegister } from "../../api_calls/auth.api";
import { alertContext } from "../../contexts/alert.context";
import { timedAlert } from "../../components/utils/alert.util";
import Head from "next/head";
import { AnalyticsUserRegister } from "../../analytics/analytics.useradd";

const NAMESPACE = "Register page";

export default function SignInSide() {
  const router = useRouter();
  const alertState = useContext(alertContext);
  const handleSubmit = async (data: iRegister) => {
    const result = await tryRegister(data);

    if (result === "success") {
      AnalyticsUserRegister(data.email, data.username, data.name);
      router.push("/");
    } else {
      timedAlert(alertState, "Could not sign you up", "error");
    }
  };

  return (
    <PublicRoute>
      <Head>
        <title>Next App | Signup</title>
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
                Sign up
              </Typography>
            </Box>

            <Formik
              initialValues={RegValidator.initialState}
              onSubmit={handleSubmit}
              validationSchema={RegValidator.RegisterUserSchema}>
              {(formProps: any) => (
                <Form>
                  <Box sx={{ mt: 1 }}>
                    <TextInput
                      margin='normal'
                      fullWidth
                      label='Name *'
                      field_name='name'
                      formProps={formProps}
                    />
                    <TextInput
                      margin='normal'
                      fullWidth
                      field_name='username'
                      label='Username *'
                      helperText='Enter your preferable username'
                      autoFocus
                      formProps={formProps}
                    />
                    <TextInput
                      margin='normal'
                      fullWidth
                      field_name='password'
                      label='Password *'
                      type='password'
                      formProps={formProps}
                    />

                    <TextInput
                      margin='normal'
                      fullWidth
                      label='Email *'
                      field_name='email'
                      autoFocus
                      formProps={formProps}
                    />
                    <RadioGroup
                      row
                      aria-labelledby='role'
                      name='role'
                      onChange={(e) => {
                        formProps.setFieldValue("role", e.target.value);
                      }}>
                      {/* <FormControlLabel
                                                value="coach"
                                                control={<Radio />}
                                                label="I am a coach"
                                                checked={formProps.values.role === 'coach'}
                                            />
                                            <FormControlLabel
                                                value="club"
                                                control={<Radio />}
                                                label="I am a club/school member"
                                            /> */}
                    </RadioGroup>

                    <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      sx={{ mt: 3, mb: 2 }}>
                      Register
                    </Button>
                    <Grid container>
                      <Grid item xs>
                        <Link href='#' variant='body2'>
                          Forgot password?
                        </Link>
                      </Grid>
                      <Grid item>
                        <Link href='/auth/login' variant='body2'>
                          {"Already have an account? Sign in"}
                        </Link>
                      </Grid>
                    </Grid>
                  </Box>
                  <br />
                </Form>
              )}
            </Formik>
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
