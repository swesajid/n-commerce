import * as Yup from 'yup';
import { USER_ROLE } from '../../server/src/types';

export interface iSingleAccount {
    name: string;
	username: string;
    email: string;
    role: USER_ROLE;
}

export const initialSingleAccount: iSingleAccount = {
    name: '',
    email: '',
    username: '',
    role: 'club',
};

export const SingleAccountSchema = Yup.object().shape({
    name: Yup.string().min(5, 'Name must be at least 5 characters').required('Required'),
    email: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    role: Yup.string().required('Required'),
});

const accountsValidator = { initialSingleAccount, SingleAccountSchema };
export default accountsValidator;
