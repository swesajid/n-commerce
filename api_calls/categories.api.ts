import { iCategorie } from '../components/validators/categories.validator';
import logger from '../config/logger';

const NAMESPACE = 'Categories API Calls';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPICategorie {
    name: string;
    description: string;
    _id: string;
    createdAt: Date | string;
}

type GENERAL_RETURN_TYPE = 'success' | 'fail';

export const getAllCategoriesFromAPI = async (): Promise<iAPICategorie[]> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/categories`, { headers: { 'skon-auth-token': token } });
        const data: iAPICategorie[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting tag list', err);
        return [];
    }
};

export const deleteCategorieFromAPI = async (id: string): Promise<'success' | 'fail'> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/categories/${id}`, {
            method: 'DELETE',
            headers: { 'skon-auth-token': token },
        });
        const data = await res.json();

        if (data.msg) {
            return 'success';
        } else {
            return 'fail';
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error Deleting Categorie', err);
        return 'fail';
    }
};

export const createCategorieFromAPI = async (data: iCategorie): Promise<GENERAL_RETURN_TYPE> => {
    try {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('description', data.description);

        const token = localStorage.getItem('skon-auth-token') as string;
        const res = await fetch(`${API_BASE}/categories/create`, {
            method: 'POST',
            headers: { 'skon-auth-token': token },
            body: formData,
        });
        const info = await res.json();

        if (info.success) {
            return 'success';
        } else {
            return 'fail';
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Create Categorie Error', err);
        return 'fail';
    }
};

export const getSingleCategorieFromAPI = async (id: string): Promise<iAPICategorie | null> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/categories/${id}`, { headers: { 'skon-auth-token': token } });
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Get Single Categorie', err);
        return null;
    }
};

export const updateCategoriefromAPI = async (id: string, categorie: iCategorie): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/categories/update`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                categorieId: id,
                name: categorie.name,
                description: categorie.description,
            }),
        });
        const data = await res.json();

        if (data.errors) {
            logger.error(NAMESPACE, 'Checking error: ', data);
            return false;
        }

        return true;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update categorie error');
        return false;
    }
};
