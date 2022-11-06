import * as React from 'react';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getSingleEmailFromAPI, updateEmailFromAPI } from '../../api_calls/email.api';
import RichTextEditor from '../../components/form/RichTextEditor';
import AdminOnly from '../../components/auth/AdminOnly';
import PrivateRoute from '../../components/auth/PrivateRoute';
import TextInput from '../../components/form/TextInput';
import Spinner from '../../components/helpers/Spinner';
import emailsValidator, { iSingleEmail } from '../../components/validators/emails.validators';
import { CloudDone } from '@mui/icons-material';
import { alertContext } from '../../contexts/alert.context';
import { timedAlert } from '../../components/utils/alert.util';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import AgreementModal from '../../components/helpers/AgreementModal';
import parse from 'html-react-parser';

const SingleEmailPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [initialSingleEmail, setinitialSingleEmail] = useState(emailsValidator.initialSingleEmail);
    const [loading, setLoading] = useState(true);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const alertState = useContext(alertContext);

    useEffect(() => {
        console.log('router: ', router.isReady);

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleEmailFromAPI(id as string);

                if (data) {
                    setinitialSingleEmail({name: data.name, subject: data.subject, description: data.description });
                    setLoading(false);
                } else {
                    router.push('/emails');
                }
            };
            get();
        }
    }, [id, router]);

    const handleSubmit = async (emailInfo: iSingleEmail) => {
        if (typeof id === 'undefined') return;
        const updated = await updateEmailFromAPI(id as string, emailInfo);

        if (updated) {
            timedAlert(alertState, 'Updated Email!', 'success');
        } else {
            setLoading(false);
            timedAlert(alertState, 'Could not update email!', 'error');
        }

        router.push('/emails');
    };

    return (
        <PrivateRoute>
            <AdminOnly>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Formik
                            initialValues={initialSingleEmail}
                            validationSchema={emailsValidator.createEmailSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {(formProps: any) => (
                                <Form>
                                    <Typography variant="h4">Update Email Template</Typography>
                                    <Card sx={{ padding: '1rem', margin: '1rem 0', width: '600px' }}>
                                        <FormControl sx={{margin: '0 0 1rem 0', display: 'flex', flexDirection: 'row'}}>
                                            <Typography variant="h6">Name: </Typography>
                                            <Typography sx={{margin: '3px 0px 0px 10px'}} variant="inherit">{formProps.values.name}</Typography>
                                        </FormControl>

                                    <FormControl fullWidth sx={{ margin: '1rem 0 1rem 0' }}>
                                        <TextInput
                                            field_name="subject"
                                            label="Subject"
                                            formProps={formProps}
                                            value={formProps.values.subject}
                                            fullWidth
                                            onChange={async (e: any) => {
                                                formProps.setFieldValue('subject', e.target.value);
                                            }}
                                        />
                                    </FormControl>

                                        <RichTextEditor
                                            field_name="description"
                                            formProps={formProps}
                                            label="Description"
                                            value={formProps.values.description}
                                        />
                                        
                                        <Button
                                            sx={{ margin: '1rem 0' }}
                                            variant="contained"
                                            type="submit"
                                            endIcon={<CloudDone />}
                                        >
                                            Update Email
                                        </Button>
                                    </Card>
                                </Form>
                            )}
                        </Formik>
                    )}
                </DashboardLayout>
            </AdminOnly>
        </PrivateRoute>
    );
};

export default SingleEmailPage;
