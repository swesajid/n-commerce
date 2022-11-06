import Head from 'next/head';
import { Button, ButtonGroup, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { deleteAnnouncementFromAPI, getAllAnnouncementsFromAPI, iAPIAnnouncement } from '../../api_calls/announcements.api';
import AdminOnly from '../../components/auth/AdminOnly';
import Spinner from '../../components/helpers/Spinner';
import AdminLayout from '../../components/layouts/Admin.layout';
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

const AnnouncementsPage = () => {
    const [announcementList, setAnnouncementList] = useState<iAPIAnnouncement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const router = useRouter();
    const userInfo = useContext(authContext);
    const alertState = useContext(alertContext);
    const [tempId, setTempId] = useState('');

    useEffect(() => {
		if (router.isReady) {
			const getAnnouncements = async () => {
				const announcements = await getAllAnnouncementsFromAPI();
				if (!announcements) {
					router.push('/');
				}

				setAnnouncementList(announcements);
				setLoading(false);
			};

			getAnnouncements();
		}
    }, [ router ]);

    const handleAgreeToDelete = async () => {
        const result = await deleteAnnouncementFromAPI(tempId);

        if (result === 'success') {
            const announcements = await getAllAnnouncementsFromAPI();
            setAnnouncementList(announcements);
            setShowDeletePrompt(false);
            timedAlert(alertState, 'Deleted Announcement!', 'success');
        } else {
            setShowDeletePrompt(false);
        }
    };

    const columns = [
        { name: 'name', label: 'Announcement Title', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
        { name: 'date', label: 'Created', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
        // { name: 'permalink', label: 'Permalink', options: { filter: true, sort: true } },
        { name: 'publish', label: 'Publish', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
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
        { name: 'actions', label: 'Actions', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
    ];
    const tableData = announcementList.map((announcement) => ({
        name: (
            <Link href={`/announcements/${announcement._id}`}>
                <a>{announcement.name}</a>
            </Link>
        ),
        date: formatDateToLocal({ oldDate: new Date(announcement.createdAt), dateTime: false }),
        // permalink: announcement.permalink,
        publish: announcement.publish ? 'Published' : 'Unpublished',
        // active: user.active ? 'Active' : 'Inactive',
        actions: (
            <Fragment>
                {/* <Button variant="text" color="secondary">
                    Activity
                </Button> */}
				<Button variant="outlined" color="primary">
                    <Link href={`/announcements/${announcement._id}`}>
                        <a>Edit</a>
                    </Link>
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                        setTempId(announcement._id);
                        setShowDeletePrompt(true);
                    }}
                    sx={{ marginLeft: '5px' }}
                >
                    Delete
                </Button>
                <AgreementModal
                    title="Delete Announcement?"
                    description="Announcement will be deleted permanently."
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
                <title>Dashboard | Announcements</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <MUIDataTable
                                title="All Announcements"
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

export default AnnouncementsPage;
