/** @format */

import * as React from "react";
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
  initialRate,
  createRateSchema,
  iRate,
} from "../../components/validators/rates.validator";
import { getAllCategoriesFromAPI } from "../../api_calls/categories.api";
import FileInput from "../../components/form/FileInput";
import CheckBox from "../../components/form/CheckBox";
import { createRateFromAPI } from "../../api_calls/rates.api";
import RichTextEditor from "../../components/form/RichTextEditor";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { useRouter } from "next/router";
import { timedAlert } from "../../components/utils/alert.util";
import { alertContext } from "../../contexts/alert.context";
import { useTheme } from "@mui/material/styles";
import LinearProgressWithLabel from "../../components/form/LinearProgressWithLabel";

const CreateRatePage = () => {
  const [categorieList, setCategorieList] = useState<string[]>([]);
  const [categorieName, setCategorieName] = useState("");
  const alertState = useContext(alertContext);
  const [recordingActive, setRecordingActive] = useState(true);
  const [linkActive, setLinkActive] = useState(true);
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

  const handleSubmit = async (data: iRate) => {
    const created = await createRateFromAPI(data);
    if (created === "success") {
      timedAlert(alertState, "Rate created!", "success");
      router.push("/rates");
    } else {
      timedAlert(alertState, "Error creating rate!", "error");
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
        <title>Dashboard | Create Rate</title>
      </Head>
      <PrivateRoute>
        <DashboardLayout>
          <Typography variant='h4'>Create Vehicle Price Rate</Typography>
          <Box sx={{ maxWidth: "1000px" }}>
            <Card sx={{ p: 3 }} elevation={6}>
              <Formik
                initialValues={initialRate}
                validationSchema={createRateSchema}
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
                          label='Main Tag Categories'
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
                      {/* <TextInput
                        field_name='name'
                        label='Receipt Name'
                        formProps={formProps}
                        fullWidth
                        margin='normal'
                        onChange={async (e: any) => {
                          formProps.setFieldValue("name", e.target.value);
                        }}
                      /> */}
                      <TextInput
                        field_name='first_rate'
                        label='1st 2Hours Rate'
                        formProps={formProps}
                        fullWidth
                        margin='normal'
                        onChange={async (e: any) => {
                          formProps.setFieldValue("first_rate", e.target.value);
                        }}
                      />
                      <TextInput
                        field_name='all_rate'
                        label='All Hours Rate'
                        formProps={formProps}
                        fullWidth
                        margin='normal'
                        onChange={async (e: any) => {
                          formProps.setFieldValue("all_rate", e.target.value);
                        }}
                      />

                      <TextInput
                        field_name='allday_rate'
                        label='24 Hours Rate'
                        formProps={formProps}
                        fullWidth
                        margin='normal'
                        onChange={async (e: any) => {
                          formProps.setFieldValue(
                            "allday_rate",
                            e.target.value
                          );
                        }}
                      />

                      {/* <RichTextEditor
                                                field_name="description"
                                                formProps={formProps}
                                                label="Description"
                                            /> */}
                      <Button type='submit' variant='contained'>
                        Create Vehicle Rate
                      </Button>
                      {/* <pre>{ JSON.stringify( formProps.values, null, 3) }</pre> */}
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

export default CreateRatePage;
