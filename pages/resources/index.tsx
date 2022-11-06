import Head from 'next/head';
import { Button, ButtonGroup, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { deleteResourceFromAPI, getAllResourcesFromAPI, iAPIResource } from '../../api_calls/resources.api';
import AdminOnly from '../../components/auth/AdminOnly';
import Spinner from '../../components/helpers/Spinner';
import MUIDataTable from 'mui-datatables';
import styled from '@emotion/styled';
import AgreementModal from '../../components/helpers/AgreementModal';
import { authContext } from '../../contexts/auth.context';
import { alertContext } from '../../contexts/alert.context';
import { timedAlert } from '../../components/utils/alert.util';
import PrivateRoute from '../../components/auth/PrivateRoute';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import { formatDateToLocal } from '../../components/utils/date.util';
import { TableHeaderStyles } from '../../components/helpers/Table.helper';

const StyledSpan = styled.span((props: any) => ({
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    background: props.bgColor,
}));

const ResourcesPage = () => {
    const [resourceList, setResourceList] = useState<iAPIResource[]>([]);
    const [loading, setLoading] = useState(true);
    const [resourceID, setResourceID] = useState('');
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const router = useRouter();
    const userInfo = useContext(authContext);
    const alertState = useContext(alertContext);
    const [tempId, setTempId] = useState('');

    useEffect(() => {
        const getResources = async () => {
            const resources = await getAllResourcesFromAPI();
            if (!resources) {
                router.push('/');
            }

            setResourceList(resources);
            setLoading(false);
        };

        getResources();
    }, [router]);

    const handleAgreeToDelete = async () => {
        const result = await deleteResourceFromAPI(tempId);

        if (result === 'success') {
            const resources = await getAllResourcesFromAPI();
            setResourceList(resources);
            setShowDeletePrompt(false);
            timedAlert(alertState, 'Deleted Resource!', 'success');
        } else {
            setShowDeletePrompt(false);
        }
    };

    const columns = [
        { name: 'name', label: 'Resource Title', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
        { name: 'date', label: 'Created', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
        { name: 'publish', label: 'Publish', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
        { name: 'actions', label: 'Actions', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
    ];
    const tableData = resourceList.map((resource) => ({
        name: resource.name,
        date: formatDateToLocal({ oldDate: new Date(resource.createdAt), dateTime: false }),
        publish: resource.publish ? 'Published' : 'Unpublished',
        actions: (
            <Fragment>
                <Button variant="outlined" color="primary">
                    <Link href={`/resources/details/${resource._id}`}>
                        <a>View</a>
                    </Link>
                </Button>
                <Button variant="outlined" color="primary" sx={{ marginLeft: '5px' }}>
                    <Link href={`/resources/${resource._id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                        setTempId(resource._id);
                        setShowDeletePrompt(true);
                    }}
                    sx={{ marginLeft: '5px' }}
                >
                    Delete
                </Button>
                <AgreementModal
                    title="Delete Resource?"
                    description="Resource will be deleted permanently."
                    open={showDeletePrompt}
                    onClose={() => setShowDeletePrompt(false)}
                    onAgree={() => handleAgreeToDelete()}
                />
            </Fragment>
        ),
    }));
    return (
        <Fragment>
            <Head>
                <title>Dashboard | Resources</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <MUIDataTable
                                title="All Resources"
                                columns={columns}
                                data={tableData}
                                options={{ print: false, selectableRows: undefined }}
                            />
                        </Fragment>
                    )}
                </DashboardLayout>
            </PrivateRoute>
        </Fragment>
    );
};

export default ResourcesPage;
