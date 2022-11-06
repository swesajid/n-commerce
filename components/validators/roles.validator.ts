import * as Yup from 'yup';

export interface iSingleRole {
    name: string;
    description: string;
}

export const initialSingleRole: iSingleRole = {
    name: '',
    description: '',
};

export const createRoleSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
});

const rolesValidator = { initialSingleRole, createRoleSchema };
export default rolesValidator;
