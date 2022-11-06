import * as Yup from 'yup';
import { USER_ROLE } from '../../server/src/types';

export interface iSingleUser {
    name: string;
    email: string;
    username: string;
    role: USER_ROLE;
    // active: 'active' | 'inactive';
    active: string;
}

export const initialSingleUser: iSingleUser = {
    name: '',
    email: '',
    username: '',
    role: 'club',
    active: 'disabled',
    // active: 'inactive',
};

export const SingleUserSchema = Yup.object().shape({
    name: Yup.string().min(5, 'Name must be at least 5 characters').required('Required'),
    email: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    role: Yup.string().required('Required'),
    active: Yup.string().required('Required'),
});

const usersValidator = { initialSingleUser, SingleUserSchema };
export default usersValidator;
