import { CloudDone } from "@mui/icons-material";
import { Button, Card, FormControl, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { Fragment, useContext, useState } from "react";
import { updateUserPasswordfromAPI } from "../../api_calls/users.api";
import { alertContext } from "../../contexts/alert.context";
import { authContext } from "../../contexts/auth.context";
import PrivateRoute from "../auth/PrivateRoute";
import TextInput from "../form/TextInput";
import Spinner from "../helpers/Spinner";
import { DashboardLayout } from "../layouts/Dashboard.layout";
import { timedAlert } from "../utils/alert.util";
import passwordValidator, { iPassword } from "../validators/password.validator";

const UpdatePassword = () => {
    const userInfo = useContext(authContext);
    const router = useRouter();
    const [initialPassword, setInitialPassword] = useState(passwordValidator.initialPasswordState);
    const alertState = useContext(alertContext);

	const id = userInfo?.user?._id;

	const handlePasswordSubmit = async (passInfo: iPassword) => {
		
        const updated = await updateUserPasswordfromAPI(id as string, passInfo);
        if (updated) {
            timedAlert(alertState, 'Password updated!', 'success');
        } else {
            timedAlert(alertState, 'Could not update password!', 'error');
        }

        router.push('/account');
    };

    return (
		<Fragment>
			<Formik
				initialValues={initialPassword}
				validationSchema={passwordValidator.passwordValidatorSchema}
				onSubmit={handlePasswordSubmit}
				enableReinitialize
			>
				{(formProps: any) => (
					<Form>
						<Card sx={{ padding: '0.5rem 1rem', margin: '0.5rem 0', width: '600px' }}>
							<Typography variant="h6" sx={{ marginBottom: '2rem'}}>Update Password</Typography>
							<FormControl fullWidth sx={{ margin: '1rem 0' }}>
								<TextInput
									type="password"
									field_name="prev_password"
									formProps={formProps}
									label="Previous Password"
								/>
							</FormControl>
							<FormControl fullWidth sx={{ margin: '1rem 0' }}>
								<TextInput
									type="password"
									field_name="password"
									formProps={formProps}
									label="New Password"
								/>
							</FormControl>
							<FormControl fullWidth sx={{ margin: '1rem 0' }}>
								<TextInput
									type="password"
									field_name="reenter_password"
									formProps={formProps}
									label="Re Enter Password"
								/>
							</FormControl>
							<Button
								sx={{ margin: '1rem 0' }}
								variant="contained"
								type="submit"
								endIcon={<CloudDone />}
							>
								Update Password
							</Button>

						</Card>
					</Form>
				)}
			</Formik>
		</Fragment>
    )
}

export default UpdatePassword;