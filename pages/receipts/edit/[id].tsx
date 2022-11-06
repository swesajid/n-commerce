/** @format */

import {
  Box,
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import Head from "next/head";
import {
  getAllReceiptsFromAPI,
  getSingleReceiptFromAPI,
  iAPIReceipt,
  updateReceiptfromAPI,
} from "../../../api_calls/receipts.api";
import PrivateRoute from "../../../components/auth/PrivateRoute";
import TextInput from "../../../components/form/TextInput";
import Spinner from "../../../components/helpers/Spinner";
import { CloudDone } from "@mui/icons-material";
import { alertContext } from "../../../contexts/alert.context";
import { timedAlert } from "../../../components/utils/alert.util";
import { DashboardLayout } from "../../../components/layouts/Dashboard.layout";
import receiptsValidator, {
  iReceipt,
  initialReceipt,
  updateReceiptSchema,
} from "../../../components/validators/receipts.validator";
import { getAllRatesFromAPI } from "../../../api_calls/rates.api";
import { formatDateForInput } from "../../../components/utils/date.util";
import CheckBox from "../../../components/form/CheckBox";
import { getAllCategoriesFromAPI } from "../../../api_calls/categories.api";

const SingleReceiptPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialReceipt, setinitialReceipt] = useState(
    receiptsValidator.initialReceipt
  );
  const [loading, setLoading] = useState(true);
  const alertState = useContext(alertContext);
  const [categorieList, setCategorieList] = useState<string[]>([]);
  const [categorieName, setCategorieName] = useState("");

  useEffect(() => {
    console.log("router: ", router.isReady);

    if (router.isReady) {
      const get = async () => {
        const data = await getSingleReceiptFromAPI(id as string);

        if (data) {
          console.log(data);
          setinitialReceipt({
            categorie: data.categorie,
            v_number: data.v_number,
            date: `${data.date}`,
            check: data.check ? true : false,
          });
          setLoading(false);
        } else {
          router.push("/receipts");
        }
      };
      get();

      const getCategories = async () => {
        const categories = await getAllCategoriesFromAPI();
        if (!categories) {
          router.push("/");
        }

        const mapped = categories.map((categorie) => categorie.name);

        setCategorieList(mapped);
      };

      getCategories();
    }
  }, [id, router]);

  const handleSubmit = async (receipt: iReceipt) => {
    const updated = await updateReceiptfromAPI(id as string, receipt);

    if (updated) {
      timedAlert(alertState, "Updated Rate!", "success");
      router.push("/receipts");
    } else {
      setLoading(false);
      timedAlert(alertState, "Could not update rate!", "error");
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Dashboard | Update Rate</title>
      </Head>
      <PrivateRoute>
        <DashboardLayout>
          <Box sx={{ maxWidth: "1000px" }}>
            <Card sx={{ p: 3 }} elevation={6}>
              {loading ? (
                <Spinner />
              ) : (
                <Formik
                  initialValues={initialReceipt}
                  validationSchema={receiptsValidator.updateReceiptSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize>
                  {(formProps: any) => {
                    return (
                      <Form>
                        <Typography variant='h4'>
                          Update Receipt Info
                        </Typography>

                        <FormControl
                          sx={{ margin: "20px 0px 20px 0px" }}
                          fullWidth>
                          <InputLabel id='demo-simple-select-label'>
                            Main Categorie
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Main Categorie'
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
                          value={formProps.values.v_number}
                          fullWidth
                          margin='normal'
                          onChange={async (e: any) => {
                            formProps.setFieldValue("v_number", e.target.value);
                          }}
                        />
                        <Grid container sx={{ my: 1 }} spacing={2}>
                          <Grid item md={6}>
                            <TextField
                              name='date'
                              id='datetime-local'
                              label='Event Date'
                              type='datetime-local'
                              value={formatDateForInput(formProps.values.date)}
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
                          label='checked'
                          formProps={formProps}
                          checked={formProps.values.check ? true : false}
                        />

                        <Button type='submit' variant='contained'>
                          Update Vehicle Receipt
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </Card>
          </Box>
        </DashboardLayout>
      </PrivateRoute>
    </Fragment>
  );
};

export default SingleReceiptPage;
