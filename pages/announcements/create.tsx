import { Box, Button, Card, Typography, TextField, Grid } from '@mui/material';
import { ErrorMessage, Form, Formik } from 'formik';
import Head from 'next/head';
import { Fragment, useContext } from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import PrivateRoute from '../../components/auth/PrivateRoute';
import TextInput from '../../components/form/TextInput';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import { initialAnnouncement, createAnnouncementSchema, iAnnouncement } from '../../components/validators/announcements.validator';
import SelectField from '../../components/form/SelectField';
import TimezoneSelect, { allTimezones } from 'react-timezone-select';
import TimeZonePicker from '../../components/form/TimeZonePicker';

import FileInput from '../../components/form/FileInput';
import CheckBox from '../../components/form/CheckBox';
import { createAnnouncementFromAPI, getPermalinkFromAPI } from '../../api_calls/announcements.api';
import RichTextEditor from '../../components/form/RichTextEditor';

import { useRouter } from 'next/router';
import { timedAlert } from '../../components/utils/alert.util';
import { alertContext } from '../../contexts/alert.context';

const CreateAnnouncementPage = () => {
    const alertState = useContext(alertContext);
    const router = useRouter();

    const handleSubmit = async (data: iAnnouncement) => {

        const created = await createAnnouncementFromAPI(data);
        if (created === 'success') {
            timedAlert(alertState, 'Announcement created!', 'success');
        } else {
            timedAlert(alertState, 'Error creating announcement!', 'error');
        }
        router.push('/announcements');
    };

    return (
        <Fragment>
            <Head>
                <title>Dashboard | Create Announcement</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    <Typography variant="h4">Create Announcement</Typography>
                    <Box sx={{ maxWidth: '1000px' }}>
                        <Card sx={{ p: 3 }} elevation={6}>
                            <Formik
                                initialValues={initialAnnouncement}
                                validationSchema={createAnnouncementSchema}
                                onSubmit={handleSubmit}
                            >
                                {(formProps: any) => {

                                    return (
                                        <Form>
                                            <TextInput
                                                field_name="name"
                                                label="Announcement Name"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                onChange={async (e: any) => {
                                                    const permalink = await getPermalinkFromAPI(e.target.value);
                                                    formProps.setFieldValue('name', e.target.value);
                                                    formProps.setFieldValue('permalink', permalink);
                                                }}
                                            />

                                            <RichTextEditor
                                                field_name="description"
                                                formProps={formProps}
                                                label="Description"
                                            />

											<Grid container sx={{ my: 1 }} spacing={2}>
												<Grid item md={6}>
													<TextField
														name="publication_date"
														id="datetime-local"
														label="Publication Date"
														type="datetime-local"
														defaultValue={formProps.values.publication_date}
														InputLabelProps={{
															shrink: true,
														}}
														onChange={(e: any) => {
															formProps.setFieldValue('publication_date', e.target.value);
														}}
														fullWidth
													/>
												</Grid>
												<Grid item md={6}>
													<TextField
														name="expiration_date"
														id="datetime-local"
														label="Expiration Date"
														type="datetime-local"
														defaultValue={formProps.values.expiration_date}
														InputLabelProps={{
															shrink: true,
														}}
														onChange={(e: any) => {
															formProps.setFieldValue('expiration_date', e.target.value);
														}}
														fullWidth
													/>
												</Grid>
                                        	</Grid>

                                            <TextInput
                                                field_name="permalink"
                                                label="Permalink"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                disabled
                                                value={formProps.values.permalink}
                                            />

                                            <CheckBox
                                                field_name="publish"
                                                formProps={formProps}
                                                label="Publish"
                                                checked={formProps.values.publish}
                                            />

                                            <Button type="submit" variant="contained">
                                                Create Announcement
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

export default CreateAnnouncementPage;
