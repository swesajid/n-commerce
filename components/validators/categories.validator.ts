import * as Yup from 'yup';

export interface iCategorie {
    name: string;
    description: string;
    
}

export const initialCategorie: iCategorie = {
    name: '',
    description: '',
    
};

export const createCategorieSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
});

export const updateCategorieSchema = Yup.object().shape({
    name: Yup.string().required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
});

const categoriesValidator = { initialCategorie, createCategorieSchema, updateCategorieSchema };
export default categoriesValidator;