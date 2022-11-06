import { iSingleEmail } from '../components/validators/emails.validators';
import logger from '../config/logger';

const NAMESPACE = 'Email Templates API Calls';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

type GENERAL_RETURN_TYPE = 'success' | 'fail';

export interface iAPIEmail {
    _id: string;
    name: string;
    subject: string;
    description: string;
    updatedAt: Date | string;
}

export const getAllEmailsFromAPI = async (): Promise<iAPIEmail[]> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/emails`, { headers: { 'skon-auth-token': token } });
        const data: iAPIEmail[] = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Error getting email list', err);
        return [];
    }
};

export const createEmailFromAPI = async (data: iSingleEmail): Promise<GENERAL_RETURN_TYPE> => {
    try {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('subject', data.subject);
        formData.append('description', data.description);

        const token = localStorage.getItem('skon-auth-token') as string;
        const res = await fetch(`${API_BASE}/emails/create`, {
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
        logger.error(NAMESPACE, 'Create Email Error', err);
        return 'fail';
    }
};

export const getSingleEmailFromAPI = async (id: string): Promise<iAPIEmail | null> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/emails/${id}`, { headers: { 'skon-auth-token': token } });
        const data = await res.json();
        return data;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Get Single Email', err);
        return null;
    }
};

export const updateEmailFromAPI = async (id: string, emailInfo: iSingleEmail): Promise<boolean> => {
    try {
        const token = <string>localStorage.getItem('skon-auth-token');
        const res = await fetch(`${API_BASE}/emails/update`, {
            method: 'PATCH',
            headers: { 'skon-auth-token': token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                emailId: id,
                name: emailInfo.name,
                subject: emailInfo.subject,
                description: emailInfo.description,
            }),
        });
        const data = await res.json();

        if (data.msg) {
            return true;
        } else {
            return false;
        }

        return true;
    } catch (err: any) {
        logger.error(NAMESPACE, 'Update email error');
        return false;
    }
};
