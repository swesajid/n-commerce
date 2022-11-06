import * as React from 'react';
import { Button, Card, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { initialSingleRole, createRoleSchema, iSingleRole } from '../../components/validators/roles.validator';
import { createRoleFromAPI } from '../../api_calls/roles.api';
import AdminOnly from '../../components/auth/AdminOnly';
import PrivateRoute from '../../components/auth/PrivateRoute';
import TextInput from '../../components/form/TextInput';
import { CloudDone } from '@mui/icons-material';
import { alertContext } from '../../contexts/alert.context';
import { timedAlert } from '../../components/utils/alert.util';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';

const CreateRole = () => {
    const router = useRouter();
    const alertState = useContext(alertContext);

    const handleSubmit = async (data: iSingleRole) => {
        const created = await createRoleFromAPI(data);
        if (created === 'success') {
            timedAlert(alertState, 'Role created!', 'success');
        } else {
            timedAlert(alertState, 'Error creating role!', 'error');
        }
        router.push('/roles');
    };

    return (
        <PrivateRoute>
            <AdminOnly>
                <DashboardLayout>
                        <Formik
                            initialValues={initialSingleRole}
                            validationSchema={createRoleSchema}
                            onSubmit={handleSubmit}
                        >
                            {(formProps: any) => (
                                <Form>
                                    <Typography variant="h4">Create New Role</Typography>
                                    <Card sx={{ padding: '1rem', margin: '1rem 0', width: '600px' }}>
                                        <TextInput
                                            field_name="name"
                                            label="Name"
                                            formProps={formProps}
                                            fullWidth
                                            onChange={async (e: any) => {
                                                formProps.setFieldValue('name', e.target.value)
                                            }}
                                        />
                                        <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                        <TextInput
                                            field_name="description"
                                            label="Description"
                                            formProps={formProps}
                                            fullWidth
                                            onChange={async (e: any) => {
                                                formProps.setFieldValue('description', e.target.value)
                                            }}
                                        />
                                        </FormControl>
                                        <Button sx={{ margin: '1rem 0' }} variant="contained" type="submit" endIcon={<CloudDone />}>
                                            Create Role
                                        </Button>
                                    </Card>
                                </Form>
                            )}
                        </Formik>
                </DashboardLayout>
            </AdminOnly>
        </PrivateRoute>
    );
};

export default CreateRole;
