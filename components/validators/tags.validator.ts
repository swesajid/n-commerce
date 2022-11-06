import * as Yup from 'yup';

export interface iTag {
    name: string;
    description: string;
    slug: string,
}

export const initialTag: iTag = {
    name: '',
    description: '',
    slug: '',
};

export const createTagSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    slug: Yup.string().required('Required!'),
});

export const updateTagSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    slug: Yup.string().required('Required!'),
});