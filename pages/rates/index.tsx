import Head from 'next/head';
import { Button, ButtonGroup, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { deleteRateFromAPI, getAllRatesFromAPI, iAPIRate } from '../../api_calls/rates.api';
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
import { iAPIUSer } from '../../api_calls/users.api';
//import { shortenText } from '../../components/utils/misc.util';
import { TableHeaderStyles } from '../../components/helpers/Table.helper';
import Link from 'next/link';
import { getAllCategoriesFromAPI } from '../../api_calls/categories.api';

const StyledSpan = styled.span((props: any) => ({
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    background: props.bgColor,
}));

const RatePage = () => {
    const [userList, setUserList] = useState<iAPIUSer[]>([]);
    const [rateList, setRateList] = useState<iAPIRate[]>([]);
    const [rateID,setRateID] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const router = useRouter();
    const userInfo = useContext(authContext);
    const alertState = useContext(alertContext);
	const [tempId, setTempId] = useState('');
    const [categorieName, setCategorieName] = useState('');
    const [categorieList, setCategorieList] = useState<string[]>([]);

    useEffect(() => {
        const getRates = async () => {
            const rates = await getAllRatesFromAPI();
            if (!rates) {
                router.push('/');
            }

            setRateList(rates);
            setLoading(false);
        };

        getRates();
    }, [router]);
    const handleAgreeToDelete = async () => {
        const result = await deleteRateFromAPI(tempId);

        if (result === 'success') {
            const rates = await getAllRatesFromAPI();
            setRateList(rates);
            setShowDeletePrompt(false);
            timedAlert(alertState, 'Deleted Rate!', 'success');
        } else {
            setShowDeletePrompt(false);
        }
    };

    const columns = [
        { name: 'categorie', label: 'Vehicle Rate Title', options: {
            filter: true,
            sort: true,
            setCellHeaderProps: () => ({ style: TableHeaderStyles }),
        } },
        { name: 'date', label: 'Created', options: {
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
        const tableData = rateList.map((rate, user) => ({
        categorie:rate.categorie,
        date: formatDateToLocal({ oldDate: new Date(rate.createdAt), dateTime: false }),
        actions: (
            <Fragment>
                {/* <Button variant="text" color="secondary">
                    Activity
                </Button> */}
                       {/* <Button variant="outlined" color="primary">
                            <Link href={`/rates/details/${rate._id}`}>
                                <a>View</a>
                            </Link>
                        </Button> */}
                        <Button variant="outlined" color="primary" sx={{ marginLeft: '5px' }}>
                            <Link href={`/rates/edit/${rate._id}`}>
                                <a>Edit</a>
                            </Link>
                        </Button>
                        <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                        setTempId(rate._id);
                        setShowDeletePrompt(true);
                    }}
                    sx={{ marginLeft: '5px' }}
                >
                    Delete
                </Button>
                <AgreementModal
                    title="Delete Vehicle Rate?"
                    description="Vehicle Rate will be deleted permanently."
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
                <title>Dashboard | Vehicle Rate</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    {loading ? (
                        <Spinner />
                    ) : (
                        <Fragment>
                            <MUIDataTable
                                title="All Vehicle Rates"
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

export default RatePage;
