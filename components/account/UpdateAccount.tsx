/** @format */

import { CloudDone } from "@mui/icons-material";
import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  getSingleUserFromAPI,
  updateUserAccountfromAPI,
} from "../../api_calls/users.api";
import { alertContext } from "../../contexts/alert.context";
import { authContext } from "../../contexts/auth.context";
import PrivateRoute from "../auth/PrivateRoute";
import TextInput from "../form/TextInput";
import Spinner from "../helpers/Spinner";
import { DashboardLayout } from "../layouts/Dashboard.layout";
import { timedAlert } from "../utils/alert.util";
import accountsValidator, {
  iSingleAccount,
} from "../validators/accounts.validator";

const UpdateAccount = () => {
  const userInfo = useContext(authContext);
  const [loading, setLoading] = useState(true);
  const [userRole, setuserRole] = useState("");
  const router = useRouter();
  const [initialAccount, setInitialAccount] = useState(
    accountsValidator.initialSingleAccount
  );
  const alertState = useContext(alertContext);

  const id = userInfo?.user?._id;

  useEffect(() => {
    const getAccount = async () => {
      const data = await getSingleUserFromAPI(id as string);
      if (data) {
        setuserRole(data.role);
        setInitialAccount({
          name: data.name,
          username: data.username,
          email: data.email,
          role: data.role,
        });
        setLoading(false);
      } else {
        router.push("/");
      }
    };
    getAccount();
  }, [id, router]);

  const handleAccountSubmit = async (userDetails: iSingleAccount) => {
    const updated = await updateUserAccountfromAPI(id as string, userDetails);

    if (updated) {
      timedAlert(alertState, "Updated account!", "success");
    } else {
      setLoading(false);
      timedAlert(alertState, "Could not update account!", "error");
    }

    router.push("/account");
  };

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Formik
          initialValues={initialAccount}
          validationSchema={accountsValidator.SingleAccountSchema}
          onSubmit={handleAccountSubmit}
          enableReinitialize>
          {(formProps: any) => (
            <Form>
              <Card
                sx={{
                  padding: "0.5rem 1rem",
                  margin: "0.5rem 0",
                  width: "600px",
                }}>
                <Typography variant='h6' sx={{ marginBottom: "2rem" }}>
                  Update Account
                </Typography>
                <TextInput
                  field_name='name'
                  formProps={formProps}
                  label='Name'
                  value={formProps.values.name}
                  fullWidth
                />
                <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                  <TextInput
                    field_name='username'
                    formProps={formProps}
                    label='Username'
                    helperText='If you change please write'
                    value={formProps.values.username}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                  <TextInput
                    field_name='email'
                    formProps={formProps}
                    label='Email'
                    value={formProps.values.email}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ margin: "1rem 0" }}>
                  <RadioGroup
                    row
                    aria-labelledby='role'
                    name='role'
                    onChange={(e) => {
                      formProps.setFieldValue("role", e.target.value);
                    }}>
                    {userRole === "admin" && (
                      <FormControlLabel
                        value='admin'
                        control={<Radio />}
                        label='Admin'
                        checked={formProps.values.role === "admin"}
                      />
                    )}
                    <FormControlLabel
                      value='coach'
                      control={<Radio />}
                      label='I am a admin'
                      checked={formProps.values.role === "coach"}
                    />
                    <FormControlLabel
                      value='club'
                      control={<Radio />}
                      label='I am a member'
                      checked={formProps.values.role === "club"}
                    />
                  </RadioGroup>
                </FormControl>
                <Button
                  sx={{ margin: "1rem 0" }}
                  variant='contained'
                  type='submit'
                  endIcon={<CloudDone />}>
                  Update Account
                </Button>
              </Card>
            </Form>
          )}
        </Formik>
      )}
    </Fragment>
  );
};

export default UpdateAccount;
