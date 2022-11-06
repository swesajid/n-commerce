import { Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import {
    getSingleCategorieFromAPI,
    iAPICategorie,
    updateCategoriefromAPI,
} from '../../../api_calls/categories.api';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import TextInput from '../../../components/form/TextInput';
import Spinner from '../../../components/helpers/Spinner';
import { CloudDone } from '@mui/icons-material';
import { alertContext } from '../../../contexts/alert.context';
import { timedAlert } from '../../../components/utils/alert.util';
import { DashboardLayout } from '../../../components/layouts/Dashboard.layout';
import { iCategorie, initialCategorie, updateCategorieSchema } from '../../../components/validators/categories.validator';

const SingleCategoriePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [getInitialCategorie, setGetInitialCategorie] = useState(initialCategorie);
    const [loading, setLoading] = useState(true);
    const alertState = useContext(alertContext);
    const [categorieID, setCategorieID] = useState('');

    useEffect(() => {
        console.log('router: ', router.isReady);

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleCategorieFromAPI(id as string);
                console.log(data);
                if (data) {
                    setGetInitialCategorie({
                        name: data.name,
                        description: data.description,
                    });
                    setLoading(false);
                   
                } else {
                    router.push('/categories');
                }
            };
             get();
        }
    }, [id, router]);

    const handleSubmit = async (categorie: iCategorie) => {
        const updated = await updateCategoriefromAPI(id as string, categorie);

        if (updated) {
            timedAlert(alertState, 'Updated categorie!', 'success');
        } else {
            setLoading(false);
            timedAlert(alertState, 'Could not update categorie!', 'error');
        }

        router.push('/categories');
    };

    return (
        <PrivateRoute>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Formik
                            initialValues={getInitialCategorie}
                            validationSchema={updateCategorieSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {(formProps: any) => {
                                return (
                                    <Form>
                                        <Typography variant="h4">Update Categorie Info</Typography>
                                        <TextInput
                                            field_name="name"
                                            label="Categorie Name"
                                            formProps={formProps}
                                            value={formProps.values.name}
                                            fullWidth
                                            margin="normal"
                                            onChange={async (e: any) => {
                                                // console.log('ran');
                                                formProps.setFieldValue('name', e.target.value);
                                            }}
                                        />

                                        <TextInput
                                            field_name="description"
                                            formProps={formProps}
                                            fullWidth
                                            margin="normal"
                                            value={formProps.values.description}
                                            label="Description"
                                        />
                                    

                                        <Button variant="contained" type="submit" endIcon={<CloudDone />}>
                                            Update Categorie
                                        </Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    )}
                    </DashboardLayout>
        </PrivateRoute>
    );
};

export default SingleCategoriePage;
