/** @format */

//import * as React from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  TextField,
  Grid,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Form, Formik } from "formik";
import Head from "next/head";
import { Fragment, useContext, useEffect, useState } from "react";
import PrivateRoute from "../../components/auth/PrivateRoute";
import TextInput from "../../components/form/TextInput";
import { DashboardLayout } from "../../components/layouts/Dashboard.layout";
import {
  initialReceipt,
  createReceiptSchema,
  iReceipt,
} from "../../components/validators/receipts.validator";
import { getAllRatesFromAPI } from "../../api_calls/rates.api";
import CheckBox from "../../components/form/CheckBox";
import { createReceiptFromAPI } from "../../api_calls/receipts.api";
import RichTextEditor from "../../components/form/RichTextEditor";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/router";
import { timedAlert } from "../../components/utils/alert.util";
import { alertContext } from "../../contexts/alert.context";
import { useTheme } from "@mui/material/styles";
import { getAllCategoriesFromAPI } from "../../api_calls/categories.api";

const CreateReceiptPage = () => {
  const [categorieList, setCategorieList] = useState<string[]>([]);
  const [categorieName, setCategorieName] = useState("");
  const alertState = useContext(alertContext);
  const router = useRouter();

  useEffect(() => {
    const getCategories = async () => {
      const categories = await getAllCategoriesFromAPI();
      if (!categories) {
        router.push("/");
      }

      const mapped = categories.map((categorie) => categorie.name);

      setCategorieList(mapped);
    };

    getCategories();
  }, [router]);

  const handleSubmit = async (data: iReceipt) => {
    const created = await createReceiptFromAPI(data);
    if (created === "success") {
      timedAlert(alertState, "Receipt created!", "success");
      router.push("/receipts");
    } else {
      timedAlert(alertState, "Error creating Receipt!", "error");
    }
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const theme = useTheme();

  return (
    <Fragment>
      <Head>
        <title>Dashboard | Create Receipt</title>
      </Head>
      <PrivateRoute>
        <DashboardLayout>
          <Typography variant='h4'>Create Vehicle Receipt</Typography>
          <Box sx={{ maxWidth: "1000px" }}>
            <Card sx={{ p: 3 }} elevation={6}>
              <Formik
                initialValues={initialReceipt}
                // validationSchema={createReceiptSchema}
                onSubmit={handleSubmit}
                enableReinitialize>
                {(formProps: any) => {
                  return (
                    <Form>
                      <FormControl
                        sx={{ margin: "20px 0px 20px 0px" }}
                        fullWidth>
                        <InputLabel id='demo-simple-select-label'>
                          Main Categories
                        </InputLabel>

                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Categorie List'
                          value={formProps.values.categorie}
                          onChange={(event: any) =>
                            formProps.setFieldValue(
                              "categorie",
                              event.target.value
                            )
                          }>
                          {categorieList.map((categorie, index) => (
                            <MenuItem key={index} value={categorie}>
                              {categorie}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextInput
                        field_name='v_number'
                        label='Vehicle Number'
                        formProps={formProps}
                        fullWidth
                        margin='normal'
                        onChange={async (e: any) => {
                          formProps.setFieldValue("v_number", e.target.value);
                        }}
                      />

                      <Grid container sx={{ my: 1 }} spacing={2}>
                        <Grid item md={4}>
                          <TextField
                            name='date'
                            id='datetime-local'
                            label='Event Date'
                            type='datetime-local'
                            defaultValue={formProps.values.date}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e: any) => {
                              formProps.setFieldValue("date", e.target.value);
                            }}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                      <CheckBox
                        field_name='check'
                        formProps={formProps}
                        label='Checked'
                        checked={formProps.values.check}
                      />
                      <Button type='submit' variant='contained'>
                        Create Vehicle Rate
                      </Button>
                      {/* <pre>{JSON.stringify(formProps.values, null, 3)}</pre> */}
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

export default CreateReceiptPage;
