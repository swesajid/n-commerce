import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {  useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PrivateRoute from '../../../components/auth/PrivateRoute';
import AdminOnly from '../../../components/auth/AdminOnly';
import Spinner from '../../../components/helpers/Spinner';
import { Formik } from 'formik';
import { DashboardLayout } from '../../../components/layouts/Dashboard.layout';
import resourcesValidator from '../../../components/validators/resources.validator';
import { getSingleResourceFromAPI } from '../../../api_calls/resources.api';
import ReactPlayer from 'react-player'
import { Chip } from '@mui/material';
import Stack from '@mui/material/Stack';
import parse from 'html-react-parser';
import Container from '@mui/material/Container';
import Link from 'next/link';


export default function ImgMediaCard() {

    const router = useRouter();
    const { id } = router.query;
    const [initialResource, setinitialResource] = useState(resourcesValidator.initialResource);
    const [loading, setLoading] = useState(true);
    const [link, setLink] = useState('');
    const [resourceID, setResourceID] = useState('')

    useEffect(() => {
        if (router.isReady) {
            const get = async () => {
                const data = await getSingleResourceFromAPI(id as string);
                setResourceID(id as string)

                if (data) {
                    setinitialResource({
                        name: data.name,
                        description: data.description,
                        tag: data.tag,
                        additionalTags: data.additionalTags,
                        videolink: data.videolink,
                        permalink: data.permalink,
                        publish: data.publish ? true : false,
                        featured_image: data.featured_image,
						resource_files: [],
                        videofile: data.videofile,

                    });
                    if (data.featured_image) {
                        setLink(data.featured_image);
                    }
                    setLoading(false);
                } else {
                    router.push('/resources');
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
                        initialValues={initialResource}
                        validationSchema={resourcesValidator.updateResourceSchema}
                        enableReinitialize
                        onSubmit={() => console.log("Completed")}
                    >
                        {(formProps: any) => {
                            return (

                                <Container sx={{display: 'flex',  justifyContent:'center'}}>

                                    <Card sx={{ width: '90%', marginTop: '50px' }}>

                                    <ReactPlayer width='100%' height='400px' url={ formProps.values.videolink} controls onReady={() => console.log('onReady callback')} onStart={() => console.log('onStart callback')} onPause={() => console.log('onPause callback')} onEnded={() => console.log('onEnded callback')} onError={() => console.log('onError callback')} />

                                    <CardContent>

                                        <Typography gutterBottom variant="h5" component="div">
                                            {formProps.values.name}
                                        </Typography>

                                        <Typography variant="subtitle1" color="text.secondary">
                                            {parse(formProps.values.description)}
                                        </Typography>

                                        <Stack>
                                        <div className="resource-file">
                                            <span>
                                                Download: 
                                                <a 
                                                    href={link}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={{ color: '#5048E5', marginLeft: '10px' }}
                                                >
                                                    Resource File
                                                </a>
                                            </span>
                                        </div>
                                        </Stack>

                                        <Stack direction="row" spacing={1}>
                                            <span style={{margin: '15px 0px 15px 0px'}}>
                                                Main Tag:
                                                <Chip sx={{marginLeft: '10px'}} label={formProps.values.tag} />
                                            </span>
                                        </Stack>

                                        <Stack direction="row" spacing={1}>
                                            <span>
                                                Additional Tags:
                                                {formProps.values.additionalTags.map((singleTag: any, index: any) => (
                                                    <Chip key={index} sx={{marginLeft: '10px'}} label= {singleTag} />
                                                ))}
                                            </span>
                                        </Stack>

                                        <Link href={`/resources/${resourceID}`}>
                                            <a><Button variant="contained" sx={{marginTop: '20px', width: '100px'}}>Edit</Button></a>
                                        </Link>

                                    </CardContent>

                                    </Card>
                              </Container>
                            );
                        }}
                    </Formik>
                )}
            </DashboardLayout>
        </AdminOnly>
    </PrivateRoute>
  );
}