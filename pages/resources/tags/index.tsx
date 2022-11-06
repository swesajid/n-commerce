import Head from 'next/head';
import { Button, ButtonGroup, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
// import { deleteEventFromAPI, getAllEventsFromAPI, iAPIEvent } from '../../../api_calls/events.api';
import { deleteTagFromAPI, getAllTagsFromAPI, iAPITag } from '../../../api_calls/tags.api';
import AdminOnly from '../../../components/auth/AdminOnly';
import Spinner from '../../../components/helpers/Spinner';
import AdminLayout from '../../../components/layouts/Admin.layout';
import MUIDataTable from 'mui-datatables';
import styled from '@emotion/styled';
import AgreementModal from '../../../components/helpers/AgreementModal';
import { authContext } from '../../../contexts/auth.context';
import { alertContext } from '../../../contexts/alert.context';
import { timedAlert } from '../../../components/utils/alert.util';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import { DashboardLayout } from '../../../components/layouts/Dashboard.layout';
import { formatDateToLocal } from '../../../components/utils/date.util';
import parse from 'html-react-parser';

const StyledSpan = styled.span((props: any) => ({
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    background: props.bgColor,
}));

const TagsPage = () => {
    const [tagList, setTagList] = useState<iAPITag[]>([]);
    const [tagID, setTagID] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const router = useRouter();
    const userInfo = useContext(authContext);
    const alertState = useContext(alertContext);
    const [tempId, setTempId] = useState('');

    useEffect(() => {
        const getTags = async () => {
            const tags = await getAllTagsFromAPI();
            if (!tags) {
                router.push('/');
            }

            setTagList(tags);
            setLoading(false);
        };

        getTags();
    }, [router]);

    const handleAgreeToDelete = async () => {
        const result = await deleteTagFromAPI(tempId);

        if (result === 'success') {
            const tags = await getAllTagsFromAPI();
            setTagList(tags);
            setShowDeletePrompt(false);
            timedAlert(alertState, 'Deleted Tag!', 'success');
        } else {
            setShowDeletePrompt(false);
        }
    };

    const columns = [
        { name: 'name', label: 'Name', options: { filter: true, sort: true } },
        { name: 'description', label: 'Description', options: { filter: true, sort: true } },
        { name: 'date', label: 'Created', options: { filter: true, sort: true } },
        // { name: 'permalink', label: 'Permalink', options: { filter: true, sort: true } },
        // { name: 'publish', label: 'Publish', options: { filter: true, sort: true } },
        // {
        //     name: 'active',
        //     label: 'Status',
        //     options: {
        //         filter: true,
        //         sort: true,
        //         customBodyRenderLite: (dataIndex: number) => {
        //             let active = userList[dataIndex].active;

        //             if (active) {
        //                 return <StyledSpan bgColor="green">Active</StyledSpan>;
        //             } else {
        //                 return <StyledSpan bgColor="red">Inactive</StyledSpan>;
        //             }
        //         },
        //     },
        // },
        { name: 'actions', label: 'Actions', options: { filter: true, sort: false } },
    ];
    const tableData = tagList.map((tag) => ({
        name: tag.name,
        description: parse(tag.description),
        date: formatDateToLocal({ oldDate: new Date(tag.createdAt), dateTime: false }),
        // permalink: event.permalink,
        // publish: tag.publish ? 'Published' : 'Unpublished',
        // active: user.active ? 'Active' : 'Inactive',
        actions: (
            <Fragment>
                {/* <Button variant="text" color="secondary">
                    Activity
                </Button> */}
                <Button variant="outlined" color="primary">
                    <Link href={`/resources/tags/${tag._id}`}><a>Edit</a></Link>
                </Button>
                {/* <Button variant="text" color="error" onClick={() => setShowDeletePrompt(true)}> */}
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                        setTempId(tag._id);
                        setShowDeletePrompt(true);
                    }}
                    sx={{ marginLeft: '5px' }}
                >
                    Delete
                </Button>
                <AgreementModal
                    title="Delete Tag?"
                    description="Tag will be deleted permanently."
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
                <title>Dashboard | Tags</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <MUIDataTable
                                title="All Tags"
                                columns={columns}
                                data={tableData}
                                options={{ print: false }}
                            />
                        </Fragment>
                    )}
                </DashboardLayout>
            </PrivateRoute>
        </Fragment>
    );
};

export default TagsPage;
