import * as React from 'react';
import { Box, Button, Card, Typography, TextField, Grid } from '@mui/material';
import { ErrorMessage, Form, Formik } from 'formik';
import Head from 'next/head';
import { Fragment, useContext, useEffect, useState } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import TextInput from '../../components/form/TextInput';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import { initialSingleEmail, createEmailSchema, iSingleEmail } from '../../components/validators/emails.validators';
import { createEmailFromAPI } from '../../api_calls/email.api';
import RichTextEditor from '../../components/form/RichTextEditor';
import { useRouter } from 'next/router';
import { timedAlert } from '../../components/utils/alert.util';
import { alertContext } from '../../contexts/alert.context';
import { useTheme } from '@mui/material/styles';

const CreateEmailPage = () => {
    const alertState = useContext(alertContext);
    const router = useRouter();

    const handleSubmit = async (data: iSingleEmail) => {
        const created = await createEmailFromAPI(data);
        if (created === 'success') {
            timedAlert(alertState, 'Email template created!', 'success');
        } else {
            timedAlert(alertState, 'Error creating template!', 'error');
        }
        router.push('/emails');
    };

    return (
        <Fragment>
            <Head>
                <title>Dashboard | Create Email</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    <Typography variant="h4">Create Email Template</Typography>
                    <Box sx={{ maxWidth: '1000px' }}>
                        <Card sx={{ p: 3 }} elevation={6}>
                            <Formik
                                initialValues={initialSingleEmail}
                                validationSchema={createEmailSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {(formProps: any) => {

                                    return (
                                        <Form>
                                            <TextInput
                                                field_name="name"
                                                label="Email Title"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                onChange={async (e: any) => {
                                                    formProps.setFieldValue('name', e.target.value);
                                                }}
                                            />

                                            <TextInput
                                                field_name="subject"
                                                label="Subject"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                onChange={async (e: any) => {
                                                    formProps.setFieldValue('subject', e.target.value);
                                                }}
                                            />

                                            <RichTextEditor
                                                field_name="description"
                                                formProps={formProps}
                                                label="Description"
                                            />

                                            <Button sx={{ margin: '1rem 0' }} type="submit" variant="contained">
                                                Create Email
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

export default CreateEmailPage;
