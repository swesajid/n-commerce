import { Button, ButtonGroup, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { deleteRoleFromAPI, getAllRolesFromAPI, getSingleRoleFromAPI, iAPIROle } from '../../api_calls/roles.api';
import AdminOnly from '../../components/auth/AdminOnly';
import PrivateRoute from '../../components/auth/PrivateRoute';
import Spinner from '../../components/helpers/Spinner';
import MUIDataTable from 'mui-datatables';
import styled from '@emotion/styled';
import AgreementModal from '../../components/helpers/AgreementModal';
import { authContext } from '../../contexts/auth.context';
import { alertContext } from '../../contexts/alert.context';
import { timedAlert } from '../../components/utils/alert.util';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import Head from 'next/head';
import { TableHeaderStyles } from '../../components/helpers/Table.helper';

const StyledSpan = styled.span((props: any) => ({
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    background: props.bgColor,
}));

const Roles = () => {
    const [roleList, setRoleList] = useState<iAPIROle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [roleID, setRoleID] = useState('');
    const router = useRouter();
    const userInfo = useContext(authContext);
    const alertState = useContext(alertContext);
    

    useEffect(() => {
        const getRoles = async () => {
            const roles = await getAllRolesFromAPI();
            if (!roles) {
                router.push('/');
            }

            console.log('Here are all the roles', roles);
            setRoleList(roles);
            setLoading(false);
        };

        getRoles();
    }, [router]);

    const handleAgreeToDelete = async () => {
        const result = await deleteRoleFromAPI(roleID);

        if (result === 'success') {
            const roles = await getAllRolesFromAPI();
            setRoleList(roles);
            setShowDeletePrompt(false);
            timedAlert(alertState, 'Deleted Role!', 'success');
        } else {
            setShowDeletePrompt(false);
        }
    };

    const columns = [
        { name: 'name', label: 'Name', options: { filter: true, sort: true, setCellHeaderProps: () => ({ style: TableHeaderStyles }), } },
        { name: 'description', label: 'Description', options: { filter: true, sort: true, setCellHeaderProps: () => ({ style: TableHeaderStyles }), } },
        { name: 'actions', label: 'Actions', options: { filter: true, sort: false, setCellHeaderProps: () => ({ style: TableHeaderStyles }), } },
    ];

    const tableData = roleList.map((role) => ({
        name: role.name,
        description: role.description,
        actions: (
            <Fragment>
                <>
                    <Button variant="outlined" color="primary">
                        <Link href={`/roles/${role._id}`}>
                            <a>Edit</a>
                        </Link>
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => {
                            setShowDeletePrompt(true), setRoleID(role._id);
                        }}
						sx={{ marginLeft: '5px' }}
                    >
                        Delete
                    </Button>
                </>
                <AgreementModal
                    title="Delete Role?"
                    description="The role will be deleted permanently."
                    open={showDeletePrompt}
                    onClose={() => setShowDeletePrompt(false)}
                    onAgree={() => handleAgreeToDelete()}
                />
            </Fragment>
        ),
    }));

    return (
        <PrivateRoute>
            <AdminOnly>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <Head>
                                <title>Dashboard | All Roles</title>
                            </Head>
                            <MUIDataTable
                                title="All Roles"
                                columns={columns}
                                data={tableData}
                                options={{ print: false, selectableRows: undefined }}
                            />
                            <Button
                                sx={{ backgroundColor: '#121828', marginTop: '1rem', width: '150px' }}
                                size="medium"
                                variant="contained"
                            >
                                <Link href={'/roles/create-role'}>
                                    <a>Create Role</a>
                                </Link>
                            </Button>
                        </Fragment>
                    )}
                </DashboardLayout>
            </AdminOnly>
        </PrivateRoute>
    );
};

export default Roles;
