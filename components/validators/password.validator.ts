import * as Yup from 'yup';

export interface iPassword {
	prev_password: string,
    password: string;
    reenter_password: string;
}

const initialPasswordState: iPassword = {
    prev_password: '',
    password: '',
    reenter_password: '',
};

const passwordValidatorSchema = Yup.object().shape({
    prev_password: Yup.string().min(6, 'Minimum 6 characters are required').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters are required').required('Required'),
    reenter_password: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const passwordValidator = { initialPasswordState, passwordValidatorSchema };
export default passwordValidator;
