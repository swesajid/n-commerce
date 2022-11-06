import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import {
    getAllRatesFromAPI,
    getSingleRateFromAPI,
    iAPIRate,
    updateRatefromAPI,
} from '../../../api_calls/rates.api';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import TextInput from '../../../components/form/TextInput';
import Spinner from '../../../components/helpers/Spinner';
import { CloudDone } from '@mui/icons-material';
import { alertContext } from '../../../contexts/alert.context';
import { timedAlert } from '../../../components/utils/alert.util';
import { DashboardLayout } from '../../../components/layouts/Dashboard.layout';
import ratesValidator, { iRate, initialRate, updateRateSchema } from '../../../components/validators/rates.validator';
import { getAllCategoriesFromAPI } from '../../../api_calls/categories.api';

const SingleRatePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [initialRate, setinitialRate] = useState(ratesValidator.initialRate);
    const [loading, setLoading] = useState(true);
    const alertState = useContext(alertContext);
    const [categorieList, setCategorieList] = useState<string[]>([]);

    useEffect(() => {
        console.log('router: ', router.isReady);

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleRateFromAPI(id as string);

                if (data) {
                    console.log(data)
                    setinitialRate({
                        categorie:data.categorie,
                        first_rate:data.first_rate,
                        allday_rate:data.allday_rate,
                        all_rate:data.all_rate,
                    });
                    setLoading(false);
                } else {
                    router.push('/rates');
                }
            };
            get();

            const getCategories = async () => {
                const categories = await getAllCategoriesFromAPI();
                if (!categories) {
                    router.push('/');
                }
    
                const mapped = categories.map(categorie => categorie.name)
    
                setCategorieList(mapped);
            };
    
            getCategories();
        }
    }, [id, router]);

    const handleSubmit = async (rate: iRate) => {
        const updated = await updateRatefromAPI(id as string, rate);

        if (updated) {
            timedAlert(alertState, 'Updated Rate!', 'success');
			router.push('/rates');
        } else {
            setLoading(false);
            timedAlert(alertState, 'Could not update rate!', 'error');
        }

    };

    return (
		<Fragment>
            <Head>
                <title>Dashboard | Update Rate</title>
            </Head>
        <PrivateRoute>
            <DashboardLayout>
			  <Box sx={{ maxWidth: '1000px' }}>
            	 <Card sx={{ p: 3 }} elevation={6}>
                   {loading ? (
                     <Spinner />
                  ) : (
                    <Formik
                        initialValues={initialRate}
                        validationSchema={ratesValidator.updateRateSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {(formProps: any) => {
                            return (
                                <Form>
                                    <Typography variant="h4">Update Rate Info</Typography>

                                    <FormControl sx={{ margin: '20px 0px 20px 0px' }} fullWidth>
                                        <InputLabel id="demo-simple-select-label">Main Categorie</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Main Categorie"
                                                value={formProps.values.categorie}
                                                onChange={(event: any) => formProps.setFieldValue('categorie', event.target.value)}
                                            >
                                                {categorieList.map((categorie, index) => (
                                                    <MenuItem key={index} value={categorie}>
                                                        {categorie}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                    </FormControl>
                                    <TextInput
                                        field_name="first_rate"
                                        label="1st 2Hours Rate"
                                        formProps={formProps}
                                        value={formProps.values.first_rate}
                                        fullWidth
                                        margin="normal"
                                        onChange={async (e: any) => {
                                            formProps.setFieldValue('first_rate', e.target.value);
                                        }}
                                    /> 
                                     <TextInput
                                        field_name="allday_rate"
                                        label="All Hours Rate"
                                        formProps={formProps}
                                        value={formProps.values.allday_rate}
                                        fullWidth
                                        margin="normal"
                                        onChange={async (e: any) => {
                                            formProps.setFieldValue('allday_rate', e.target.value);
                                        }}
                                    />
                                    <TextInput
                                        field_name="all_rate"
                                        label="24 Hours Rate"
                                        formProps={formProps}
                                        value={formProps.values.all_rate}
                                        fullWidth
                                        margin="normal"
                                        onChange={async (e: any) => {
                                            formProps.setFieldValue('all_rate', e.target.value);
                                        }}
                                    />
                                          
                                    <Button type="submit" variant="contained">
                                        Update Vehicle Rate
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

export default SingleRatePage;
