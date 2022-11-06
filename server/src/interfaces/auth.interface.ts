import { USER_ROLE } from '../types';

export interface iApiUser {
    _id: string;
    name: string;
    email: string;
    username: string | number;
    role: USER_ROLE;
}
