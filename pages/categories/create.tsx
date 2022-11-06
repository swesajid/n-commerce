/** @format */

import { Box, Button, Card, Typography } from "@mui/material";
import { ErrorMessage, Form, Formik } from "formik";
import Head from "next/head";
import { Fragment, useContext } from "react";
import PrivateRoute from "../../components/auth/PrivateRoute";
import TextInput from "../../components/form/TextInput";
import { DashboardLayout } from "../../components/layouts/Dashboard.layout";
import {
  initialCategorie,
  createCategorieSchema,
  iCategorie,
} from "../../components/validators/categories.validator";
import { createCategorieFromAPI } from "../../api_calls/categories.api";
import { useRouter } from "next/router";
import { timedAlert } from "../../components/utils/alert.util";
import { alertContext } from "../../contexts/alert.context";

const CreateTagPage = () => {
  const alertState = useContext(alertContext);
  const router = useRouter();

  const handleSubmit = async (data: iCategorie) => {
    const created = await createCategorieFromAPI(data);
    if (created === "success") {
      timedAlert(alertState, "Categorie created!", "success");
    } else {
      timedAlert(alertState, "Error creating categorie!", "error");
    }
    router.push("/categories");
  };

  return (
    <Fragment>
      <Head>
        <title>Dashboard | Create Categorie</title>
      </Head>
      <PrivateRoute>
        <DashboardLayout>
          <Typography variant='h4'>Create Categorie</Typography>
          <Box sx={{ maxWidth: "1000px" }}>
            <Card sx={{ p: 3 }} elevation={6}>
              <Formik
                initialValues={initialCategorie}
                validationSchema={createCategorieSchema}
                onSubmit={handleSubmit}>
                {(formProps: any) => {
                  return (
                    <Form>
                      <TextInput
                        field_name='name'
                        label='Categorie Name'
                        formProps={formProps}
                        fullWidth
                        margin='normal'
                        onChange={async (e: any) => {
                          formProps.setFieldValue("name", e.target.value);
                        }}
                      />
                      <TextInput
                        field_name='description'
                        fullWidth
                        formProps={formProps}
                        label='Description'
                        margin='normal'
                      />

                      <Button type='submit' variant='contained'>
                        Create Categorie
                      </Button>
                    </Form>
                  );
                }}
              </Formik>
            </Card>
          </Box>
        </DashboardLayout>
      </PrivateRoute>
    </Fragment>
  );
};

export default CreateTagPage;
