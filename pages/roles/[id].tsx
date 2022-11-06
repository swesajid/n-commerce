import * as React from 'react';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getSingleRoleFromAPI, updateRoleFromAPI, deleteRoleFromAPI } from '../../api_calls/roles.api';
import AdminOnly from '../../components/auth/AdminOnly';
import PrivateRoute from '../../components/auth/PrivateRoute';
import TextInput from '../../components/form/TextInput';
import Spinner from '../../components/helpers/Spinner';
import rolesValidator, { iSingleRole } from '../../components/validators/roles.validator';
import { CloudDone } from '@mui/icons-material';
import { alertContext } from '../../contexts/alert.context';
import { timedAlert } from '../../components/utils/alert.util';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import AgreementModal from '../../components/helpers/AgreementModal';

const SingleRolePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [initialSingleRole, setinitialSingleRole] = useState(rolesValidator.initialSingleRole);
    const [loading, setLoading] = useState(true);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const alertState = useContext(alertContext);

    useEffect(() => {
        console.log('router: ', router.isReady);

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleRoleFromAPI(id as string);

                if (data) {
                    setinitialSingleRole({ name: data.name, description: data.description });
                    setLoading(false);
                } else {
                    router.push('/roles');
                }
            };
            get();
        }
    }, [id, router]);

    const handleAgreeToDelete = async () => {
        const result = await deleteRoleFromAPI(id as string);

        if (result === 'success') {
            setShowDeletePrompt(false);
            router.push('/roles');
            timedAlert(alertState, 'Deleted Role!', 'success');
        } else {
            setShowDeletePrompt(false);
        }
    };

    const handleSubmit = async (roleInfo: iSingleRole) => {
        if (typeof id === 'undefined') return;
        const updated = await updateRoleFromAPI(id as string, roleInfo);

        if (updated) {
            timedAlert(alertState, 'Updated Role!', 'success');
        } else {
            setLoading(false);
            timedAlert(alertState, 'Could not update role!', 'error');
        }

        router.push('/roles');
    };

    return (
        <PrivateRoute>
            <AdminOnly>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Formik
                            initialValues={initialSingleRole}
                            validationSchema={rolesValidator.createRoleSchema}
                            onSubmit={handleSubmit}
                            enableReinitialize
                        >
                            {(formProps: any) => (
                                <Form>
                                    <Typography variant="h4">Update Role Info</Typography>
                                    <Card sx={{ padding: '1rem', margin: '1rem 0', width: '600px' }}>
                                        <TextInput
                                            field_name="name"
                                            label="Name"
                                            formProps={formProps}
                                            value={formProps.values.name}
                                            fullWidth
                                            onChange={async (e: any) => {
                                                formProps.setFieldValue('name', e.target.value);
                                            }}
                                        />
                                        <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                            <TextInput
                                                field_name="description"
                                                label="Description"
                                                formProps={formProps}
                                                value={formProps.values.description}
                                                fullWidth
                                                onChange={async (e: any) => {
                                                    formProps.setFieldValue('description', e.target.value);
                                                }}
                                            />
                                        </FormControl>
                                        <Button
                                            sx={{ margin: '1rem 0' }}
                                            variant="contained"
                                            type="submit"
                                            endIcon={<CloudDone />}
                                        >
                                            Update Role
                                        </Button>
                                        <Button
                                            sx={{ margin: '1rem 1rem' }}
                                            color="error"
                                            variant="contained"
                                            onClick={() => {
                                                setShowDeletePrompt(true);
                                            }}
                                            endIcon={<CloudDone />}
                                        >
                                            Delete Role
                                        </Button>
                                        <AgreementModal
                                            title="Delete Role?"
                                            description="The role will be deleted permanently."
                                            open={showDeletePrompt}
                                            onClose={() => setShowDeletePrompt(false)}
                                            onAgree={() => handleAgreeToDelete()}
                                        />
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

export default SingleRolePage;
