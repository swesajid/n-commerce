import { useRouter } from 'next/router';
import { Fragment, useContext, useEffect, useState } from 'react';
import { authContext } from '../../contexts/auth.context';
import profilesValidator, { iSingleProfile } from '../validators/profiles.validator';
import Spinner from '../helpers/Spinner';
import { timedAlert } from '../utils/alert.util';
import { alertContext } from '../../contexts/alert.context';
import { FieldArray, Form, Formik, FormikProps } from 'formik';
import {
    Button,
    Card,
    Radio,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    RadioGroup,
    Typography,
    Autocomplete,
    TextField,
} from '@mui/material';
import TextInput from '../form/TextInput';
import { CloudDone } from '@mui/icons-material';
import { getSingleProfileFromAPI, updateProfilefromAPI } from '../../api_calls/profile.api';
import RichTextEditor from '../form/RichTextEditor';
import FileInput from '../form/FileInput';
import Stack from '@mui/material/Stack';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [profileId, setProfileId] = useState('');
    const [programms, setProgramms] = useState([
        'AdultSkate',
        'CanPowerSkate',
        'CompetitiveSkate',
        'STARSkate',
        'CanSkate',
        'CollegiateSkate',
        'Special Olympics',
        'SunchroSkate',
    ]);
    const [coachCertificateOptions, setCoachCertificateOptions] = useState([
        '​CanSkate: In-training',
        'CanSkate: Trained',
        'CanSkate: Certified',
        'Regional: In-training',
        'Regional: Trained',
        'Regional: Certified',
        'Provincial: In-training',
        'Provincial: Trained',
        'Provincial: Certified',
        'ATTP National: In-training',
        'ATTP National: Trained',
        'ATTP: Certified',
        'CanPowerSkate: In-training',
        'CanPowerSkate: Trained',
        'CanPowerSkate: Certified',
    ]);
    const router = useRouter();
    const [initialProfile, setInitialProfile] = useState(profilesValidator.initialSingleProfile);
    const alertState = useContext(alertContext);
    const { id } = router.query;

    useEffect(() => {
        const getAccount = async () => {
            const data = await getSingleProfileFromAPI(id as string);
            data && setProfileId(data._id as string);

            if (data) {
                setInitialProfile({
                    profile_image: null,
                    club_name: data.club_name,
                    club_logo: null,
                    nccp_number: data.nccp_number,
                    club_number: data.club_number,
                    about_us: data.about_us,
                    contact_name: data.contact_name,
                    address: data.address,
                    offered_programms: data.offered_programms,
                    tel: data.tel,
                    cell: data.cell,
                    email: data.email,
                    website: data.website,
                    job_title: data.job_title,
                    incorporation_number: data.incorporation_number,
                    facebook: data.facebook,
                    twitter: data.twitter,
                    instagram: data.instagram,
                    youtube: data.youtube,
                    linkedin: data.linkedin,
                    canskateexcellence: data.canskateexcellence,
                    excellencedetails: data.excellencedetails,
                    coaches: data.coaches,
                    owners: data.owners,
                    documents: [],
                });
                setLoading(false);
            } else {
                router.push('/');
            }
        };
        getAccount();
    }, [id, router]);

    const handleProfileSubmit = async (profileInfo: iSingleProfile) => {
        console.log({ profileInfo });
        if (profileId.length > 0) {
            const updated = await updateProfilefromAPI(profileId, profileInfo);
            if (updated) {
                timedAlert(alertState, 'Profile updated!', 'success');
            } else {
                setLoading(false);
                timedAlert(alertState, 'Could not update profile!', 'error');
            }
        }
        router.push('/users/members');
    };

    return (
        <Fragment>
            {loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    <Formik
                        initialValues={initialProfile}
                        validationSchema={profilesValidator.SingleProfileSchema}
                        onSubmit={handleProfileSubmit}
                        enableReinitialize
                    >
                        {(formProps) => (
                            <Form>
                                <Typography variant="h4">Update Club/Skating School Profile Information</Typography>
                                <Card
                                    sx={{
                                        padding: '0.5rem 1rem',
                                        margin: '0.5rem 0',
                                        width: '1000px',
                                    }}
                                >
                                    <Typography variant="h5">Basic Information</Typography>
                                    <Grid container spacing={3} sx={{ marginTop: 0.5 }}>
                                        <Grid item md={6}>
                                            <FileInput
                                                field_name="profile_image"
                                                formProps={formProps}
                                                label="Profile Image*"
                                                fillParent
                                            />
                                            {formProps.values.profile_image && (
                                                <small>{formProps.values?.profile_image.name}</small>
                                            )}
                                        </Grid>

                                        <Grid item md={6}>
                                            <FileInput
                                                field_name="club_logo"
                                                formProps={formProps}
                                                label="Club/Skating School Logo"
                                                fillParent
                                            />
                                            {formProps.values.club_logo && (
                                                <small>{formProps.values?.club_logo.name}</small>
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{ marginTop: 2 }}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name="club_name"
                                                    formProps={formProps}
                                                    label="Club/Skating School Name"
                                                    value={formProps.values.club_name}
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name="nccp_number"
                                                    formProps={formProps}
                                                    label="NCCP Number"
                                                    value={formProps.values.nccp_number}
                                                    // fullWidth
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name="club_number"
                                                    formProps={formProps}
                                                    label="Club/Skating School Number"
                                                    value={formProps.values.club_number}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Incorporation Number"
                                                    field_name="incorporation_number"
                                                    formProps={formProps}
                                                    value={formProps.values.incorporation_number}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth>
                                                <FormLabel
                                                    sx={{ margin: '10px 0px 5px 10px' }}
                                                    id="demo-controlled-radio-buttons-group2"
                                                >
                                                    CanSkate Excellence
                                                </FormLabel>
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="demo-controlled-radio-buttons-group"
                                                    name="controlled-radio-buttons-group"
                                                    value={formProps.values.canskateexcellence}
                                                    onChange={(e) =>
                                                        formProps.setFieldValue('canskateexcellence', e.target.value)
                                                    }
                                                    sx={{
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 16,
                                                            marginLeft: '10px',
                                                        },
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        value="engaged"
                                                        control={<Radio />}
                                                        label="Engaged"
                                                    />
                                                    <FormControlLabel
                                                        value="achieved"
                                                        control={<Radio />}
                                                        label="Achieved"
                                                    />
                                                    <FormControlLabel
                                                        value="exceeded"
                                                        control={<Radio />}
                                                        label="Exceeded"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <FileInput
                                                    multiple
                                                    field_name="documents"
                                                    formProps={formProps}
                                                    label="Documents"
                                                    onChange={(event: any) => {
                                                        formProps.setFieldValue('documents', event.target.files);
                                                    }}
                                                />
                                                {formProps.values.documents.length > 0 && (
                                                    <small>Files selected: {formProps.values.documents.length}</small>
                                                )}
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                        <RichTextEditor
                                            field_name="excellencedetails"
                                            formProps={formProps}
                                            label="CanSkate Excellence Details"
                                            value={formProps.values.excellencedetails}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                        <RichTextEditor
                                            field_name="about_us"
                                            formProps={formProps}
                                            label="About Us"
                                            value={formProps.values.about_us}
                                        />
                                    </FormControl>
                                    <Stack spacing={3} sx={{ marginBottom: '20px' }}>
                                        <Autocomplete
                                            multiple
                                            id="tags-outlined"
                                            options={programms}
                                            value={formProps.values.offered_programms}
                                            onChange={(event: any, value: any[]) => {
                                                formProps.setFieldValue('offered_programms', value);
                                            }}
                                            filterSelectedOptions
                                            renderInput={(params) => <TextField {...params} label="Offered Programs" />}
                                        />
                                    </Stack>
                                    <Typography variant="h5" sx={{ margin: '1rem 0' }}>
                                        Contact Information
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name="contact_name"
                                                    formProps={formProps}
                                                    label="Contact Name"
                                                    value={formProps.values.contact_name}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name="address"
                                                    formProps={formProps}
                                                    label="Address"
                                                    value={formProps.values.address}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name="tel"
                                                    formProps={formProps}
                                                    label="Tel"
                                                    value={formProps.values.tel}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name="cell"
                                                    formProps={formProps}
                                                    label="Cell"
                                                    value={formProps.values.cell}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Email"
                                                    field_name="email"
                                                    autoFocus
                                                    formProps={formProps}
                                                    value={formProps.values.email}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Website"
                                                    field_name="website"
                                                    formProps={formProps}
                                                    value={formProps.values.website}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    field_name={`job_title`}
                                                    formProps={formProps}
                                                    label="Job Title"
                                                    value={formProps.values.job_title}
                                                    fullWidth
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h5" sx={{ margin: '1rem 0' }}>
                                        Social Media Links
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Facebook"
                                                    field_name="facebook"
                                                    formProps={formProps}
                                                    value={formProps.values.facebook}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Twitter"
                                                    field_name="twitter"
                                                    formProps={formProps}
                                                    value={formProps.values.twitter}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Instagram"
                                                    field_name="instagram"
                                                    formProps={formProps}
                                                    value={formProps.values.instagram}
                                                />
                                            </FormControl>
                                        </Grid>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Youtube"
                                                    field_name="youtube"
                                                    formProps={formProps}
                                                    value={formProps.values.youtube}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3}>
                                        <Grid item md={6}>
                                            <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                <TextInput
                                                    label="Linkedin"
                                                    field_name="linkedin"
                                                    formProps={formProps}
                                                    value={formProps.values.linkedin}
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h5" sx={{ margin: '1rem 0' }}>
                                        Coaches Information
                                    </Typography>
                                    <FieldArray
                                        name="coaches"
                                        render={(arrayHelpers) => (
                                            <div>
                                                {formProps.values.coaches.map((coach: any, index: number) => (
                                                    <div key={index}>
                                                        <Grid container spacing={3}>
                                                            <Grid item md={6}>
                                                                <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                                    <TextInput
                                                                        field_name={`coaches.${index}.name`}
                                                                        formProps={formProps}
                                                                        label="Name"
                                                                        value={coach.name}
                                                                        fullWidth
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                                    <TextInput
                                                                        label="Email"
                                                                        formProps={formProps}
                                                                        field_name={`coaches.${index}.email`}
                                                                        value={coach.email}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container spacing={3}>
                                                            <Grid item md={9}>
                                                                <FormControl fullWidth sx={{ margin: '1rem 0' }}>
                                                                    <Autocomplete
                                                                        multiple
                                                                        id={`coaches.${index}.certificates`}
                                                                        options={coachCertificateOptions}
                                                                        value={coach?.certificates}
                                                                        onChange={(
                                                                            e: React.SyntheticEvent,
                                                                            value: any[]
                                                                        ) => {
                                                                            let val = coach;
                                                                            val.certificates = value;
                                                                            arrayHelpers.replace(index, val);
                                                                        }}
                                                                        filterSelectedOptions
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                label="Certificates"
                                                                            />
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={3}>
                                                                <FormControl fullWidth>
                                                                    <Button
                                                                        type="button"
                                                                        color="error"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            marginY: '1.4rem',
                                                                        }}
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                ))}
                                                <Button
                                                    sx={{ margin: '1rem 0' }}
                                                    type="button"
                                                    variant="contained"
                                                    onClick={() =>
                                                        arrayHelpers.push({
                                                            name: '',
                                                            email: '',
                                                            certificates: [],
                                                        })
                                                    }
                                                >
                                                    Add Coach
                                                </Button>
                                            </div>
                                        )}
                                    />
                                    <Typography variant="h5" sx={{ margin: '1rem 0' }}>
                                        Owners Information
                                    </Typography>
                                    <FieldArray
                                        name="owners"
                                        render={(arrayHelpers) => (
                                            <div>
                                                {formProps.values.owners.map((owner: any, index: number) => (
                                                    <div key={index}>
                                                        <Grid container spacing={3} sx={{ marginY: '0.5rem' }}>
                                                            <Grid item md={3}>
                                                                <TextInput
                                                                    label="Name"
                                                                    field_name={`owners.${index}.name`}
                                                                    formProps={formProps}
                                                                    value={owner.name}
                                                                />
                                                            </Grid>
                                                            <Grid item md={3}>
                                                                <TextInput
                                                                    label="Email"
                                                                    field_name={`owners.${index}.email`}
                                                                    formProps={formProps}
                                                                    value={owner.email}
                                                                />
                                                            </Grid>
                                                            <Grid item md={3}>
                                                                <TextInput
                                                                    label="Title"
                                                                    field_name={`owners.${index}.title`}
                                                                    formProps={formProps}
                                                                    value={owner.title}
                                                                />
                                                            </Grid>
                                                            <Grid item md={3}>
                                                                <FormControl fullWidth>
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="error"
                                                                        sx={{
                                                                            marginY: '.4rem',
                                                                        }}
                                                                        onClick={() => arrayHelpers.remove(index)}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </FormControl>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                ))}
                                                <Button
                                                    sx={{ margin: '1rem 0' }}
                                                    type="button"
                                                    variant="contained"
                                                    onClick={() =>
                                                        arrayHelpers.push({
                                                            name: '',
                                                            email: '',
                                                            certificates: '',
                                                        })
                                                    }
                                                >
                                                    Add Owner
                                                </Button>
                                            </div>
                                        )}
                                    />
                                    <Button
                                        sx={{ margin: '1rem 0' }}
                                        variant="contained"
                                        type="submit"
                                        endIcon={<CloudDone />}
                                    >
                                        Update Profile
                                    </Button>
                                </Card>
                            </Form>
                        )}
                    </Formik>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Profile;
