import * as Yup from 'yup';

export interface iSingleEmail {
    name: string;
    subject: string;
    description: string;
}

export const initialSingleEmail: iSingleEmail = {
    name: '',
    subject: '',
    description: '',
};

export const createEmailSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    subject: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
});

export const updateEmailSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    subject: Yup.string().required('Required'),
    description: Yup.string().required('Required'),
});

const emailsValidator = { initialSingleEmail, createEmailSchema, updateEmailSchema };
export default emailsValidator;
