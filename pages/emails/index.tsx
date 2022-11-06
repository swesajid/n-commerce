import { Button, ButtonGroup, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { getAllEmailsFromAPI, getSingleEmailFromAPI, iAPIEmail } from '../../api_calls/email.api';
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
import { formatDateToLocal } from '../../components/utils/date.util';
import parse from 'html-react-parser';
import { TableHeaderStyles } from '../../components/helpers/Table.helper';

const StyledSpan = styled.span((props: any) => ({
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    background: props.bgColor,
}));

const Emails = () => {
    const [emailList, setEmailList] = useState<iAPIEmail[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const userInfo = useContext(authContext);
    const alertState = useContext(alertContext);

    useEffect(() => {
        const getEmails = async () => {
            const emails = await getAllEmailsFromAPI();
            if (!emails) {
                router.push('/');
            }

            console.log('Here are all the emails', emails);
            // console.log('Here are all the emails', emails.createdAt);
            setEmailList(emails);
            setLoading(false);
        };

        getEmails();
    }, [router]);

    const columns = [
        { name: 'name', label: 'Name', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        }  },
        { name: 'date', label: 'Last Updated', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
        { name: 'actions', label: 'Actions', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        }  },
    ];

    const tableData = emailList.map((email) => ({
        name: email.name,
        // date: formatDateToLocal({ oldDate: new Date(email.createdAt), dateTime: false }),
        date: formatDateToLocal({oldDate: new Date(email.updatedAt), dateTime: false}),
        actions: (
            <Fragment>
                <>
                    <Button variant="outlined" color="primary">
                        <Link href={`/emails/details/${email._id}`}>
                            <a>View</a>
                        </Link>
                    </Button>
                    <Button variant="outlined" color="primary" sx={{ marginLeft: '5px' }}>
                        <Link href={`/emails/${email._id}`}>
                            <a>Edit</a>
                        </Link>
                    </Button>
                </>
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
                                <title>Dashboard | All Emails</title>
                            </Head>
                            <MUIDataTable
                                title="All Email Templates"
                                columns={columns}
                                data={tableData}
                                options={{ print: false, selectableRows: undefined }}
                            />
                        </Fragment>
                    )}
                </DashboardLayout>
            </AdminOnly>
        </PrivateRoute>
    );
};

export default Emails;
