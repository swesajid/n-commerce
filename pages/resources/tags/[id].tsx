import { Button, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getSingleTagFromAPI, iAPITag, updateTagfromAPI } from '../../../api_calls/tags.api';
import AdminOnly from '../../../components/auth/AdminOnly';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import TextInput from '../../../components/form/TextInput';
import Spinner from '../../../components/helpers/Spinner';
import { iTag, initialTag, updateTagSchema } from '../../../components/validators/tags.validator';
import { CloudDone } from '@mui/icons-material';
import { alertContext } from '../../../contexts/alert.context';
import { timedAlert } from '../../../components/utils/alert.util';
import { DashboardLayout } from '../../../components/layouts/Dashboard.layout';
import RichTextEditor from '../../../components/form/RichTextEditor';

const SingleTagPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [getInitialTag, setGetInitialTag] = useState(initialTag);
    const [loading, setLoading] = useState(true);
    const alertState = useContext(alertContext);

    useEffect(() => {
        console.log('router: ', router.isReady);

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleTagFromAPI(id as string);

                if (data) {
                    setGetInitialTag({
                        name: data.name,
                        description: data.description,
                        slug: data.slug,
                    });
                    setLoading(false);
                } else {
                    router.push('/resources/tags');
                }
            };
            get();
        }
    }, [id, router]);

    const handleSubmit = async (tag: iTag) => {
        const updated = await updateTagfromAPI(id as string, tag);

        if (updated) {
            timedAlert(alertState, 'Updated Tag!', 'success');
        } else {
            setLoading(false);
            timedAlert(alertState, 'Could not update tag!', 'error');
        }

        router.push('/resources/tags');
    };

    return (
        <PrivateRoute>
            <AdminOnly>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Formik
                            initialValues={getInitialTag}
                            validationSchema={updateTagSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {(formProps: any) => {
                                return (
                                    <Form>
                                        <Typography variant="h4">Update Tag Info</Typography>

                                        <TextInput
                                            field_name="name"
                                            label="Name"
                                            formProps={formProps}
                                            value={formProps.values.name}
                                            fullWidth
                                            margin="normal"
                                            onChange={async (e: any) => {
                                                formProps.setFieldValue('name', e.target.value);
                                            }}
                                        />

                                        <RichTextEditor
                                            field_name="description"
                                            formProps={formProps}
                                            value={formProps.values.description}
                                            label="Description"
                                        />

                                        <TextInput
                                            field_name="slug"
                                            label="Slug"
                                            formProps={formProps}
                                            value={formProps.values.slug}
                                            fullWidth
                                            margin="normal"
                                        />
                                        
                                        <Button variant="contained" type="submit" endIcon={<CloudDone />}>
                                            Update Tag
                                        </Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    )}
                </DashboardLayout>
            </AdminOnly>
        </PrivateRoute>
    );
};

export default SingleTagPage;
