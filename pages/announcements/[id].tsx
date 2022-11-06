import { Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import {
    getSingleAnnouncementFromAPI,
    iAPIAnnouncement,
    updateAnnouncementfromAPI,
    getPermalinkFromAPI,
} from '../../api_calls/announcements.api';
import AdminOnly from '../../components/auth/AdminOnly';
import PrivateRoute from '../../components/auth/PrivateRoute';
import TextInput from '../../components/form/TextInput';
import Spinner from '../../components/helpers/Spinner';
import AdminLayout from '../../components/layouts/Admin.layout';
import announcementsValidator, { iAnnouncement } from '../../components/validators/announcements.validator';
import { CloudDone } from '@mui/icons-material';
import { alertContext } from '../../contexts/alert.context';
import { timedAlert } from '../../components/utils/alert.util';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import { format as formatDate, parseISO } from 'date-fns';
import RichTextEditor from '../../components/form/RichTextEditor';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import SelectField from '../../components/form/SelectField';
import FileInput from '../../components/form/FileInput';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckBox from '../../components/form/CheckBox';
import { formatDateForInput } from '../../components/utils/date.util';

const SingleUserPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [initialAnnouncement, setInitialAnnouncement] = useState(announcementsValidator.initialAnnouncement);
    const [loading, setLoading] = useState(true);
    const alertState = useContext(alertContext);

    useEffect(() => {

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleAnnouncementFromAPI(id as string);

                if (data) {
                    setInitialAnnouncement({
                        name: data.name,
                        description: data.description,
                        publication_date: `${data.publication_date}`,
                        expiration_date: `${data.expiration_date}`,
                        permalink: data.permalink,
                        publish: data.publish ? true : false,
                    });
                    setLoading(false);
                } else {
                    router.push('/announcements');
                }
            };
            get();
        }
    }, [id, router] );

    const handleSubmit = async (announcement: iAnnouncement) => {
        const updated = await updateAnnouncementfromAPI(id as string, announcement);

        if (updated) {
            timedAlert(alertState, 'Updated Announcement!', 'success');
        } else {
            setLoading(false);
            timedAlert(alertState, 'Could not update announcement!', 'error');
        }

        router.push('/announcements');
    };

    return (
        <PrivateRoute>
            <AdminOnly>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Formik
                            initialValues={initialAnnouncement}
                            validationSchema={announcementsValidator.updateAnnouncementSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {(formProps: any) => {
                                return (
                                    <Form>
                                        <Typography variant="h4">Update Announcement Info</Typography>
                                        <TextInput
                                            field_name="name"
                                            label="Announcement Title"
                                            formProps={formProps}
                                            value={formProps.values.name}
                                            fullWidth
                                            margin="normal"
                                            onChange={async (e: any) => {
                                                formProps.setFieldValue('name', e.target.value);
                                                const permalink = await getPermalinkFromAPI(e.target.value);
                                                formProps.setFieldValue('permalink', permalink);
                                            }}
                                        />

                                        <RichTextEditor
                                            field_name="description"
                                            formProps={formProps}
                                            value={formProps.values.description}
                                            label="Description"
                                        />
                                        <Grid container sx={{ my: 1 }} spacing={2}>
                                            <Grid item md={6}>
                                                <TextField
                                                    name="publication_date"
                                                    id="datetime-local"
                                                    label="Publication Date"
                                                    type="datetime-local"
                                                    value={formatDateForInput(formProps.values.publication_date)}
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
                                                    value={formatDateForInput(formProps.values.expiration_date)}
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
                                            value={formProps.values.permalink}
                                            fullWidth
                                            margin="normal"
                                            disabled
                                        />
                                        <CheckBox
                                            field_name="publish"
                                            label="Publish"
                                            formProps={formProps}
                                            checked={formProps.values.publish ? true : false}
                                        />
                                        <Button variant="contained" type="submit" endIcon={<CloudDone />}>
                                            Update Announcement
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

export default SingleUserPage;
