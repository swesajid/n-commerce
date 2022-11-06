import { iSingleRole } from '../components/validators/roles.validator';
import logger from '../config/logger';
import { USER_ROLE } from '../server/src/types';

const NAMESPACE = 'Roles API Calls';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type GENERAL_RETURN_TYPE = 'success' | 'fail';

export interface iAPIROle {
    _id: string;
    name: string;
    // active: boolean;
    description: string;
}

export const getAllRolesFromAPI = async (): Promise<iAPIROle[]> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/roles`, { headers: { 'skon-auth-token': token } });
        // const res = await fetch(`${API_BASE}/roles`);
        const data: iAPIROle[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting role list', err);
        return [];
    }
};

export const createRoleFromAPI = async (data: iSingleRole): Promise<GENERAL_RETURN_TYPE> => {
    try {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('description', data.description);

        const token = localStorage.getItem('skon-auth-token') as string;
        const res = await fetch(`${API_BASE}/roles/create`, {
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
        logger.error(NAMESPACE, 'Create Role Error', err);
        return 'fail';
    }
};

export const deleteRoleFromAPI = async (id: string): Promise<'success' | 'fail'> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/roles/${id}`, { method: 'DELETE', headers: { 'skon-auth-token': token } });
        // const res = await fetch(`${API_BASE}/roles/`);
        const data = await res.json();

        if (data.msg) {
            return 'success';
        } else {
            return 'fail';
        }
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error Deleting Role', err);
        return 'fail';
    }
};

export const getSingleRoleFromAPI = async (id: string): Promise<iAPIROle | null> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/roles/${id}`, { headers: { 'skon-auth-token': token } });
        // const res = await fetch(`${API_BASE}/roles/${id}`);
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Get Single Role', err);
        return null;
    }
};

export const updateRoleFromAPI = async (id: string, roleInfo: iSingleRole): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/roles/update`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roleId: id,
                name: roleInfo.name,
                description: roleInfo.description,
            }),
        });
        const data = await res.json();

        if (data.msg) {
            return true;
        } else {
            return false;
        }

        // if (data.errors) {
        //     return false;
        // }

        return true;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update role error');
        return false;
    }
};
