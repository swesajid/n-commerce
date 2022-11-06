/** @format */

import {
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import {
  getSingleResourceFromAPI,
  updateResourcefromAPI,
  getPermalinkFromAPI,
} from "../../api_calls/resources.api";
import PrivateRoute from "../../components/auth/PrivateRoute";
import TextInput from "../../components/form/TextInput";
import Spinner from "../../components/helpers/Spinner";
import resourcesValidator, {
  iResource,
} from "../../components/validators/resources.validator";
import { getAllTagsFromAPI } from "../../api_calls/tags.api";
import { alertContext } from "../../contexts/alert.context";
import { timedAlert } from "../../components/utils/alert.util";
import { DashboardLayout } from "../../components/layouts/Dashboard.layout";
import RichTextEditor from "../../components/form/RichTextEditor";
import FileInput from "../../components/form/FileInput";
import CheckBox from "../../components/form/CheckBox";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { Box } from "@mui/system";
import Head from "next/head";
import LinearProgressWithLabel from "../../components/form/LinearProgressWithLabel";

const SingleEventPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialResource, setinitialResource] = useState(
    resourcesValidator.initialResource
  );
  const [loading, setLoading] = useState(true);
  const alertState = useContext(alertContext);
  const [recordingActive, setRecordingActive] = useState(true);
  const [linkActive, setLinkActive] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tagList, setTagList] = useState<string[]>([]);

  useEffect(() => {
    console.log("router: ", router.isReady);

    if (router.isReady) {
      const get = async () => {
        const data = await getSingleResourceFromAPI(id as string);

        if (data) {
          setinitialResource({
            name: data.name,
            description: data.description,
            tag: data.tag,
            additionalTags: data.additionalTags,
            videolink: data.videolink,
            videofile: data.videofile,
            permalink: data.permalink,
            publish: data.publish ? true : false,
            featured_image: null,
            resource_files: [],
          });

          if (data.videofile) {
            setLinkActive(false);
            setRecordingActive(true);
          }

          if (data.videolink) {
            setLinkActive(true);
            setRecordingActive(false);
          }

          setLoading(false);
        } else {
          router.push("/resources");
        }
      };
      get();

      const getTags = async () => {
        const tags = await getAllTagsFromAPI();
        if (!tags) {
          router.push("/");
        }

        const mapped = tags.map((tag) => tag.name);

        setTagList(mapped);
      };

      getTags();
    }
  }, [id, router]);

  const handleSubmit = async (resource: iResource) => {
    const updated = await updateResourcefromAPI(id as string, resource);

    if (updated) {
      timedAlert(alertState, "Updated Resource!", "success");
      router.push("/resources");
    } else {
      setLoading(false);
      timedAlert(alertState, "Could not update resource!", "error");
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Dashboard | Update Resource</title>
      </Head>
      <PrivateRoute>
        <DashboardLayout>
          <Box sx={{ maxWidth: "1000px" }}>
            <Card sx={{ p: 3 }} elevation={6}>
              {loading ? (
                <Spinner />
              ) : (
                <Formik
                  initialValues={initialResource}
                  validationSchema={resourcesValidator.updateResourceSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize>
                  {(formProps: any) => {
                    return (
                      <Form>
                        <Typography variant='h4'>
                          Update Resource Info
                        </Typography>
                        <TextInput
                          field_name='name'
                          label='Resource Name'
                          formProps={formProps}
                          value={formProps.values.name}
                          fullWidth
                          margin='normal'
                          onChange={async (e: any) => {
                            formProps.setFieldValue("name", e.target.value);
                            const permalink = await getPermalinkFromAPI(
                              e.target.value
                            );
                            formProps.setFieldValue("permalink", permalink);
                          }}
                        />

                        <RichTextEditor
                          field_name='description'
                          formProps={formProps}
                          value={formProps.values.description}
                          label='Description'
                        />

                        <FormControl
                          sx={{ margin: "20px 0px 20px 0px" }}
                          fullWidth>
                          <InputLabel id='demo-simple-select-label'>
                            Main Tag
                          </InputLabel>
                          <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            label='Main Tag'
                            value={formProps.values.tag}
                            onChange={(event: any) =>
                              formProps.setFieldValue("tag", event.target.value)
                            }>
                            {tagList.map((tag, index) => (
                              <MenuItem key={index} value={tag}>
                                {tag}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Stack spacing={3} sx={{ marginBottom: "20px" }}>
                          <Autocomplete
                            multiple
                            id='tags-outlined'
                            options={tagList}
                            getOptionLabel={(tag) => tag}
                            value={formProps.values.additionalTags}
                            onChange={(event: any, value: any[]) => {
                              formProps.setFieldValue("additionalTags", value);
                            }}
                            filterSelectedOptions
                            renderInput={(params) => (
                              <TextField {...params} label='Additional Tags' />
                            )}
                          />
                        </Stack>
                        <Grid container sx={{ my: 1 }} spacing={2}>
                          <Grid item md={6}>
                            <FileInput
                              field_name='featured_image'
                              formProps={formProps}
                              label='Update Featured Image'
                              fillParent
                              //required
                            />
                            {formProps.values.featured_image && (
                              <small>
                                {formProps.values?.featured_image.name}
                              </small>
                            )}
                          </Grid>
                          <Grid item md={6}>
                            <FileInput
                              multiple={true}
                              field_name='resource_files'
                              formProps={formProps}
                              label='Add Resource Files'
                              fillParent
                              onChange={(event: any) => {
                                formProps.setFieldValue(
                                  "resource_files",
                                  event.target.files
                                );
                              }}
                            />
                            {formProps.values.resource_files.length > 0 && (
                              <small>
                                Files selected:{" "}
                                {formProps.values.resource_files.length}
                              </small>
                            )}
                          </Grid>
                        </Grid>
                        <Card sx={{ minWidth: 275 }}>
                          <CardContent>
                            <Typography
                              sx={{ fontSize: 14 }}
                              color='text.secondary'
                              gutterBottom>
                              Provide either recording or external video
                              resources
                            </Typography>

                            <FileInput
                              field_name='videofile'
                              formProps={formProps}
                              label='Choose a Recording'
                              //fillParent
                              onChange={(event: any) => {
                                formProps.setFieldValue(
                                  "videofile",
                                  event.target.files[0]
                                );
                                setLinkActive(false);
                              }}
                              width={"50%"}
                              disabled={!recordingActive}
                              //required
                            />
                            <br />
                            {uploadProgress > 0 && (
                              <LinearProgressWithLabel value={uploadProgress} />
                            )}
                            {recordingActive && (
                              <Button
                                type='button'
                                onClick={() => {
                                  formProps.setFieldValue("videofile", null);
                                  setLinkActive(true);
                                  setRecordingActive(true);
                                }}
                                color='info'>
                                Remove Recording
                              </Button>
                            )}

                            <TextInput
                              field_name='videolink'
                              label='Video URL'
                              formProps={formProps}
                              fullWidth
                              value={formProps.values.videolink}
                              margin='normal'
                              disabled={!linkActive}
                              onChange={(event: any) => {
                                formProps.setFieldValue(
                                  "videolink",
                                  event.target.value
                                );
                                setRecordingActive(false);
                              }}
                            />
                            {linkActive && (
                              <Button
                                type='button'
                                onClick={() => {
                                  formProps.setFieldValue("videolink", "");
                                  setLinkActive(true);
                                  setRecordingActive(true);
                                }}
                                color='info'>
                                Remove Video Resources
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                        <TextInput
                          field_name='permalink'
                          label='Permalink'
                          formProps={formProps}
                          fullWidth
                          margin='normal'
                          disabled
                          value={formProps.values.permalink}
                        />
                        <CheckBox
                          field_name='publish'
                          formProps={formProps}
                          label='Publish'
                          checked={formProps.values.publish ? true : false}
                        />
                        <Button type='submit' variant='contained'>
                          Update Resource
                        </Button>
                      </Form>
                    );
                  }}
                </Formik>
              )}
            </Card>
          </Box>
        </DashboardLayout>
      </PrivateRoute>
    </Fragment>
  );
};

export default SingleEventPage;
