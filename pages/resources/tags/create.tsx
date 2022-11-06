import { Box, Button, Card, Typography } from '@mui/material';
import { ErrorMessage, Form, Formik } from 'formik';
import Head from 'next/head';
import { Fragment, useContext } from 'react';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import TextInput from '../../../components/form/TextInput';
import { DashboardLayout } from '../../../components/layouts/Dashboard.layout';
import { initialTag, createTagSchema, iTag } from '../../../components/validators/tags.validator';
import { createTagFromAPI } from '../../../api_calls/tags.api';
import RichTextEditor from '../../../components/form/RichTextEditor';
import { useRouter } from 'next/router';
import { timedAlert } from '../../../components/utils/alert.util';
import { alertContext } from '../../../contexts/alert.context';

const CreateTagPage = () => {
    const alertState = useContext(alertContext);
    const router = useRouter();

    const handleSubmit = async (data: iTag) => {
        const created = await createTagFromAPI(data);
        if (created === 'success') {
            timedAlert(alertState, 'Tag created!', 'success');
        } else {
            timedAlert(alertState, 'Error creating tag!', 'error');
        }
        router.push('/resources/tags');
    };

    return (
        <Fragment>
            <Head>
                <title>Dashboard | Create Tag</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    <Typography variant="h4">Create Tag</Typography>
                    <Box sx={{ maxWidth: '1000px' }}>
                        <Card sx={{ p: 3 }} elevation={6}>
                            <Formik
                                initialValues={initialTag}
                                validationSchema={createTagSchema}
                                onSubmit={handleSubmit}
                            >
                                {(formProps: any) => {

                                    return (
                                        <Form>
                                            <TextInput
                                                field_name="name"
                                                label="Tag Name"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                onChange={async (e: any) => {
                                                    formProps.setFieldValue('name', e.target.value);
                                                }}
                                            />
                                            <RichTextEditor
                                                field_name="description"
                                                formProps={formProps}
                                                label="Description"
                                            />
                                            <TextInput
                                                field_name="slug"
                                                label="Slug"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                onChange={async (e: any) => {
                                                    formProps.setFieldValue('slug', e.target.value);
                                                }}
                                            />

                                            <Button type="submit" variant="contained">
                                                Create Tag
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
