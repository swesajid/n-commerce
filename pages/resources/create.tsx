import * as React from 'react';
import { Box, Button, Card, Typography, TextField, Grid, CardContent } from '@mui/material';
import { Form, Formik } from 'formik';
import Head from 'next/head';
import { Fragment, useContext, useEffect, useState } from 'react';
import PrivateRoute from '../../components/auth/PrivateRoute';
import TextInput from '../../components/form/TextInput';
import { DashboardLayout } from '../../components/layouts/Dashboard.layout';
import { initialResource, createResourceSchema, iResource } from '../../components/validators/resources.validator';
import { getAllTagsFromAPI } from '../../api_calls/tags.api';
import FileInput from '../../components/form/FileInput';
import CheckBox from '../../components/form/CheckBox';
import { createResourceFromAPI, getPermalinkFromAPI } from '../../api_calls/resources.api';
import RichTextEditor from '../../components/form/RichTextEditor';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { useRouter } from 'next/router';
import { timedAlert } from '../../components/utils/alert.util';
import { alertContext } from '../../contexts/alert.context';
import { useTheme } from '@mui/material/styles';
import LinearProgressWithLabel from '../../components/form/LinearProgressWithLabel';

const CreateResourcePage = () => {
    const [tagList, setTagList] = useState<string[]>([]);
    const [tagName, setTagName] = useState('');
    const alertState = useContext(alertContext);
    const [recordingActive, setRecordingActive] = useState(true);
    const [linkActive, setLinkActive] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const getTags = async () => {
            const tags = await getAllTagsFromAPI();
            if (!tags) {
                router.push('/');
            }

            const mapped = tags.map(tag => tag.name)

            setTagList(mapped);
        };

        getTags();
    }, [router]);

    const handleSubmit = async (data: iResource) => {	
        const created = await createResourceFromAPI(data);
        if (created === 'success') {
            timedAlert(alertState, 'Resource created!', 'success');
			router.push('/resources');
		} else {
			timedAlert(alertState, 'Error creating resource!', 'error');
		}
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const theme = useTheme();

    return (
        <Fragment>
            <Head>
                <title>Dashboard | Create Resource</title>
            </Head>
            <PrivateRoute>
                <DashboardLayout>
                    <Typography variant="h4">Create Resource</Typography>
                    <Box sx={{ maxWidth: '1000px' }}>
                        <Card sx={{ p: 3 }} elevation={6}>
                            <Formik
                                initialValues={initialResource}
                                validationSchema={createResourceSchema}
                                onSubmit={handleSubmit}
                                enableReinitialize
                            >
                                {(formProps: any) => {

                                    return (
                                        <Form>
                                            <TextInput
                                                field_name="name"
                                                label="Resource Name"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                onChange={async (e: any) => {
                                                    const permalink = await getPermalinkFromAPI(e.target.value);
                                                    formProps.setFieldValue('name', e.target.value);
                                                    formProps.setFieldValue('permalink', permalink);
                                                }}
                                            />

                                            <RichTextEditor
                                                field_name="description"
                                                formProps={formProps}
                                                label="Description"
                                            />

                                            <FormControl sx={{ margin: '20px 0px 20px 0px' }} fullWidth>
                                                <InputLabel id="demo-simple-select-label">Main Tag</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    label="Main Tag"
                                                    value={formProps.values.tag}
                                                    onChange={(event: any) => formProps.setFieldValue('tag', event.target.value)}
                                                >
                                                    {tagList.map((tag, index) => (
                                                        <MenuItem key={index} value={tag}>
                                                            {tag}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <Stack spacing={3} sx={{ marginBottom: '20px' }}>
                                                <Autocomplete
                                                    multiple
                                                    id="tags-outlined"
                                                    options={tagList}
                                                    getOptionLabel={(tag) => tag}
                                                    onChange={(event: any, value: any[]) => {
                                                        formProps.setFieldValue('additionalTags', value)
                                                    }}
                                                    // onChange={(value: any) => {
                                                    //     formProps.setFieldValue('additionalTags', value)
                                                    // }}
                                                    filterSelectedOptions
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Additional Tags"
                                                            onClick={(e: any) => console.log('ran on textField')}
                                                        />
                                                    )}
                                                />
                                            </Stack>
											<Grid container sx={{ my: 1 }} spacing={2}>
											<Grid item md={6}>
											<FileInput
												field_name="featured_image"
												formProps={formProps}
												label="Choose a Featured Image"
												fillParent
												//required
											/>
											{formProps.values.featured_image && <small>{formProps.values?.featured_image.name}</small>}
											</Grid>
											<Grid item md={6}>
                                            <FileInput
                                                multiple={true}
                                                field_name="resource_files"
                                                formProps={formProps}
                                                label="Add Resource Files"
                                                fillParent
												onChange={(event: any) => {
                                                    formProps.setFieldValue(
                                                        "resource_files",
                                                        event.target.files
                                                    );
                                                }}
                                            />
											{formProps.values.resource_files.length > 0 && <small>Files selected: { formProps.values.resource_files.length }</small>}
											</Grid>
											</Grid>

											<Card sx={{ minWidth: 275 }}>
                                                <CardContent>
                                                    <Typography
                                                        sx={{ fontSize: 14 }}
                                                        color="text.secondary"
                                                        gutterBottom
                                                    >
                                                        Provide either recording or external video resources
                                                    </Typography>

                                                    <FileInput
                                                        field_name="videofile"
                                                        formProps={formProps}
                                                        label="Choose a Recording"
                                                        //fillParent
                                                        onChange={(event: any) => {
                                                            formProps.setFieldValue('videofile', event.target.files[0]);
                                                            setLinkActive(false);
                                                        }}
                                                        width={'50%'}
                                                        disabled={!recordingActive}
                                                        //required
                                                    />
                                                    <br />
                                                    {uploadProgress > 0 && (
                                                        <LinearProgressWithLabel value={uploadProgress} />
                                                    )}
                                                    {recordingActive && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                formProps.setFieldValue('videofile', null);
                                                                setLinkActive(true);
                                                                setRecordingActive(true);
                                                            }}
                                                            color="info"
                                                        >
                                                            Remove Recording
                                                        </Button>
                                                    )}

                                                    <TextInput
                                                        field_name="videolink"
                                                        label="Video URL"
                                                        formProps={formProps}
                                                        fullWidth
                                                        value={formProps.values.videolink}
                                                        margin="normal"
                                                        disabled={!linkActive}
                                                        onChange={(event: any) => {
                                                            formProps.setFieldValue('videolink', event.target.value);
                                                            setRecordingActive(false);
                                                        }}
                                                    />
                                                    {linkActive && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => {
                                                                formProps.setFieldValue('videolink', '');
                                                                setLinkActive(true);
                                                                setRecordingActive(true);
                                                            }}
                                                            color="info"
                                                        >
                                                           Remove Video Resources
                                                        </Button>
                                                    )}
                                                </CardContent>
                                            </Card>
                                            
                                            <TextInput
                                                field_name="permalink"
                                                label="Permalink"
                                                formProps={formProps}
                                                fullWidth
                                                margin="normal"
                                                disabled
                                                value={formProps.values.permalink}
                                            />

                                            <CheckBox
                                                field_name="publish"
                                                formProps={formProps}
                                                label="Publish"
                                                checked={formProps.values.publish}
                                            />

                                            <Button type="submit" variant="contained">
                                                Create Resource
                                            </Button>
											<pre>{ JSON.stringify( formProps.values, null, 3) }</pre>
                                        </Form>
                                    );
                                }}
                            </Formik>
                        </Card>
                    </Box>
                </DashboardLayout>
            </PrivateRoute>
        </Fragment>
    );
};

export default CreateResourcePage;
