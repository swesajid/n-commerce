import { CloudDone } from "@mui/icons-material";
import { Button, Card, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Fragment, useContext, useEffect, useState } from "react";
import { getAllRolesFromAPI, iAPIROle } from "../../api_calls/roles.api";
import { deleteUserFromAPI, getSingleUserFromAPI, updateUserfromAPI } from "../../api_calls/users.api";
import { alertContext } from "../../contexts/alert.context";
import TextInput from "../form/TextInput";
import AgreementModal from "../helpers/AgreementModal";
import Spinner from "../helpers/Spinner";
import { timedAlert } from "../utils/alert.util";
import usersValidator, { iSingleUser } from "../validators/users.validator";

const Account = () => {
    const router = useRouter();
    const { id } = router.query;
    const [initialUser, setInitialUser] = useState(usersValidator.initialSingleUser);
    const [loading, setLoading] = useState(true);
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [allRoles, setAllRoles] = useState<iAPIROle[]>([]);
    const alertState = useContext(alertContext);

    useEffect(() => {

        if (router.isReady) {
            const get = async () => {
                const data = await getSingleUserFromAPI(id as string);

                if (data) {
                    setInitialUser({
                        name: data.name,
                        email: data.email,
                        username: data.username,
                        role: data.role,
                        active: data.active === 'Active' ? 'Active' : 'Disabled',
                    });
                    setLoading(false);
                } else {
                    router.push('/users');
                }
            };
            get();
        }

        const getRoles = async () => {
            const roles = await getAllRolesFromAPI();
            setAllRoles(roles);
            setLoading(false);
        };

        getRoles();
    }, [id, router]);

    const handleAgreeToDelete = async () => {
        const result = await deleteUserFromAPI(id as string);

        if (result === 'success') {
            setShowDeletePrompt(false);
            router.push('/users/members');
            timedAlert(alertState, 'Deleted User!', 'success');
        } else {
            setShowDeletePrompt(false);
        }
    };

    const handleAccountSubmit = async (userInfo: iSingleUser) => {
        const updated = await updateUserfromAPI(id as string, userInfo);

        if (updated) {
            timedAlert(alertState, 'Updated user!', 'success');
        } else {
            setLoading(false);
            timedAlert(alertState, 'Could not update user!', 'error');
        }

        router.push('/users/members');
    };


	return (
		<Fragment>
			{loading ? (
				<Spinner />
			) : (
				<Formik
					initialValues={initialUser}
					validationSchema={usersValidator.SingleUserSchema}
					onSubmit={handleAccountSubmit}
					enableReinitialize
				>
					{(formProps: any) => (
						<Form>
							<Typography variant="h4">Update Account Information</Typography>
							<Card sx={{ padding: '1rem', margin: '1rem 0', width: '600px' }}>
								<TextInput
									field_name="name"
									formProps={formProps}
									label="Name"
									value={formProps.values.name}
									fullWidth
								/>
								<FormControl fullWidth sx={{ margin: '1rem 0' }}>
									<TextInput
										field_name="email"
										formProps={formProps}
										label="Email"
										value={formProps.values.email}
										// fullWidth
									/>
								</FormControl>
								<FormControl fullWidth>
									<TextInput
										field_name="username"
										formProps={formProps}
										label="Username"
										value={formProps.values.username}
									/>
								</FormControl>
								<FormControl fullWidth>
									<FormLabel
										sx={{ margin: '10px 0px 5px 10px' }}
										id="demo-controlled-radio-buttons-group"
									>
										Role
									</FormLabel>
									<RadioGroup
										aria-labelledby="demo-controlled-radio-buttons-group"
										name="controlled-radio-buttons-group"
										value={formProps.values.role}
										onChange={(e) => formProps.setFieldValue('role', e.target.value)}
										sx={{
											'& .MuiSvgIcon-root': {
												fontSize: 16,
												marginLeft: '10px',
											},
										}}
									>
										{allRoles.map((result) => (
											<FormControlLabel
												key={result._id}
												value={result.name.toLowerCase()}
												control={<Radio />}
												label={result.name}
											/>
										))}
									</RadioGroup>
								</FormControl>
								<FormControl fullWidth>
									<FormLabel
										sx={{ margin: '10px 0px 5px 10px' }}
										id="demo-controlled-radio-buttons-group2"
									>
										Status
									</FormLabel>
									<RadioGroup
										aria-labelledby="demo-controlled-radio-buttons-group2"
										name="controlled-radio-buttons-group2"
										value={formProps.values.active}
										onChange={(e) => formProps.setFieldValue('active', e.target.value)}
										sx={{
											'& .MuiSvgIcon-root': {
												fontSize: 16,
												marginLeft: '10px',
											},
										}}
									>
										<FormControlLabel value="Active" control={<Radio />} label="Active" />
										<FormControlLabel
											value="Disabled"
											control={<Radio />}
											label="Disabled"
										/>
									</RadioGroup>
								</FormControl>
								<Button
									sx={{ margin: '1rem 0' }}
									variant="contained"
									type="submit"
									endIcon={<CloudDone />}
								>
									Update User
								</Button>
								<Button
									sx={{ margin: '1rem 1rem' }}
									color="error"
									variant="contained"
									onClick={() => {
										setShowDeletePrompt(true);
									}}
									endIcon={<CloudDone />}
								>
									Delete User
								</Button>
								<AgreementModal
									title="Delete User?"
									description="The user and all his/her details i.e., photos, profiles will be deleted permanently."
									open={showDeletePrompt}
									onClose={() => setShowDeletePrompt(false)}
									onAgree={() => handleAgreeToDelete()}
								/>
							</Card>
						</Form>
					)}
				</Formik>
			)}
		</Fragment>
	);
	
}


export default Account;