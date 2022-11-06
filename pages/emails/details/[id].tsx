import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { alertContext } from '../../../contexts/alert.context';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import AdminOnly from '../../../components/auth/AdminOnly';
import Spinner from '../../../components/helpers/Spinner';
import { Formik } from 'formik';
import { DashboardLayout } from '../../../components/layouts/Dashboard.layout';
import emailsValidator, { iSingleEmail } from '../../../components/validators/emails.validators';
import { getSingleEmailFromAPI } from '../../../api_calls/email.api';
import ReactPlayer from 'react-player'
import { Chip } from '@mui/material';
import Stack from '@mui/material/Stack';
import parse from 'html-react-parser';
import Container from '@mui/material/Container';
import Link from 'next/link';


export default function ImgMediaCard() {

    const router = useRouter();
    const { id } = router.query;
    const [initialEmail, setinitialEmail] = useState(emailsValidator.initialSingleEmail);
    const [loading, setLoading] = useState(true);
    const [link, setLink] = useState('');
    const [emailID, setEmailID] = useState('')

    useEffect(() => {
        console.log('router: ', router.isReady);

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleEmailFromAPI(id as string);
                setEmailID(id as string)

                if (data) {
                    setinitialEmail({
                        name: data.name,
                        subject: data.subject,
                        description: data.description,
                    });
                    setLoading(false);
                } else {
                    router.push('/emails');
                }
            };
            get();
        }
    }, [id, router]);

  return (

    <PrivateRoute>
        <AdminOnly>
            <DashboardLayout>
                {loading ? (
                    <Spinner />
                ) : (
                    <Formik
                        initialValues={initialEmail}
                        validationSchema={emailsValidator.updateEmailSchema}
                        enableReinitialize
                        onSubmit={() => console.log("Completed")}
                    >
                        {(formProps: any) => {
                            return (
                            
                            <>
                            
                                <Typography gutterBottom variant="h5" component="div">
                                    {formProps.values.name}
                                </Typography>

                                <Container sx={{display: 'flex',  justifyContent:'center'}}>

                                    <Card sx={{ width: '90%'}}>

                                    <CardContent>

                                        <Typography variant="subtitle1" color="text.secondary">
                                            <b>Subject:</b> {parse(formProps.values.subject)}
                                        </Typography>

                                        <Typography variant="subtitle1" color="text.secondary">
                                            {parse(formProps.values.description)}
                                        </Typography>

                                        <Link href={`/emails/${emailID}`}>
                                            <a><Button variant="contained" sx={{marginTop: '20px', width: '100px'}}>Edit</Button></a>
                                        </Link>

                                    </CardContent>

                                    </Card>
                                    
                              </Container>

                            </>
                              
                            );
                        }}
                    </Formik>
                )}
            </DashboardLayout>
        </AdminOnly>
    </PrivateRoute>
  );
}