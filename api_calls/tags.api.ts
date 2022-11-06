import { iTag } from '../components/validators/tags.validator';
import logger from '../config/logger';

const NAMESPACE = 'Tags API Calls';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export interface iAPITag {
    name: string;
    description: string;
    slug: string;
    _id: string;
    createdAt: Date | string;
}

type GENERAL_RETURN_TYPE = 'success' | 'fail';

export const getAllTagsFromAPI = async (): Promise<iAPITag[]> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/tags`, { headers: { 'skon-auth-token': token } });
        const data: iAPITag[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting tag list', err);
        return [];
    }
};

export const deleteTagFromAPI = async (id: string): Promise<'success' | 'fail'> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/tags/${id}`, {
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
        logger.error(NAMESPACE, 'Error Deleting Tag', err);
        return 'fail';
    }
};

export const createTagFromAPI = async (data: iTag): Promise<GENERAL_RETURN_TYPE> => {
    try {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('slug', data.slug);

        const token = localStorage.getItem('skon-auth-token') as string;
        const res = await fetch(`${API_BASE}/tags/create`, {
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
        logger.error(NAMESPACE, 'Create Tag Error', err);
        return 'fail';
    }
};

export const getSingleTagFromAPI = async (id: string): Promise<iAPITag | null> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/tags/${id}`, { headers: { 'skon-auth-token': token } });
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Get Single Tag', err);
        return null;
    }
};

export const updateTagfromAPI = async (id: string, tag: iTag): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/tags/update`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tagId: id,
                name: tag.name,
                description: tag.description,
                slug: tag.slug,
            }),
        });
        const data = await res.json();

        if (data.errors) {
            logger.error(NAMESPACE, 'Checking error: ', data);
            return false;
        }

        return true;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update tag error');
        return false;
    }
};
