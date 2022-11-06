import * as Yup from 'yup';
import { USER_ROLE } from '../../server/src/types';

export interface iRegister {
    name: string;
    username: string;
    email: string;
    password: string;
    role: USER_ROLE;
}

const initialState: iRegister = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'coach',
};

const RegisterUserSchema = Yup.object().shape({
    name: Yup.string().min(6, 'Minimum 6 characters are required').required('Required'),
    username: Yup.string().min(5, 'Minimum 6 characters are required').required('Required'),
    email: Yup.string().email('Must be a valid email').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters are required').required('Required'),
    role: Yup.string().required('Required'),
});

const RegValidator = { initialState, RegisterUserSchema };
export default RegValidator;
