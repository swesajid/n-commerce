import * as Yup from 'yup';
import { iAPICoach, iAPIOwner } from '../../api_calls/profile.api';
import { CAN_SKATE_EXCELLENCE, USER_ROLE } from '../../server/src/types';

// const FILE_FORMATS = [".pdf", ".doc", ".docx"];
const IMAGE_FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

export interface iSingleProfile {
    _id?: string;
    user?: string;
    profile_image: File | null;
    club_name: string;
    club_logo?: File | null;
    nccp_number: string;
    club_number: string;
    about_us: string;
    offered_programms: string[];
    contact_name: string;
    address: string;
    tel: string;
    cell?: string;
    email: string;
    website?: string;
    job_title?: string;
    incorporation_number: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    canskateexcellence: CAN_SKATE_EXCELLENCE;
    excellencedetails: string;
    coaches: iAPICoach[];
    owners: iAPIOwner[];
    documents: File[];
}

export const initialSingleProfile: iSingleProfile = {
    profile_image: null,
    club_name: '',
    club_logo: null,
    nccp_number: '',
    club_number: '',
    about_us: '',
    offered_programms: [],
    contact_name: '',
    address: '',
    tel: '',
    cell: '',
    email: '',
    website: '',
    job_title: '',
    incorporation_number: '',
    facebook: '',
    twitter: '',
    instagram: '',
    youtube: '',
    linkedin: '',
    canskateexcellence: 'Engaged',
    excellencedetails: '',
    coaches: [],
    owners: [],
    documents: [],
};

export const SingleProfileSchema = Yup.object().shape({
    profile_image: Yup.mixed()
        .nullable()
        .test('FILE_SIZE', 'File size is too big', (value: any) => !value || (value && value.size <= 1024 * 1024))
        .test(
            'FILE_FORMAT',
            'Unsupported file type',
            (value: any) => !value || (value && IMAGE_FILE_FORMATS.includes(value?.type))
        ),
    club_name: Yup.string().optional(),
    club_logo: Yup.mixed()
        .nullable()
        .test('FILE_SIZE', 'File size is too big', (value: any) => !value || (value && value.size <= 1024 * 1024))
        .test(
            'FILE_FORMAT',
            'Unsupported file type',
            (value: any) => !value || (value && IMAGE_FILE_FORMATS.includes(value?.type))
        ),
    nccp_number: Yup.string().optional(),
    club_number: Yup.string().optional(),
    about_us: Yup.string().optional(),
    contact_name: Yup.string().optional(),
    address: Yup.string().optional(),
    offered_programms: Yup.array(),
    tel: Yup.string().optional(),
    cell: Yup.string().optional(),
    email: Yup.string().optional(),
    website: Yup.string().optional(),
    job_title: Yup.string().optional(),
    incorporation_number: Yup.string().optional(),
    facebook: Yup.string().optional(),
    twitter: Yup.string().optional(),
    instagram: Yup.string().optional(),
    youtube: Yup.string().optional(),
    linkedin: Yup.string().optional(),
    canskateexcellence: Yup.string().optional(),
    excellencedetails: Yup.string().optional(),
    coaches: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().min(4, 'too short').required('Required'),
                email: Yup.string().required('Required'),
                certificates: Yup.array().of(Yup.string()).required('Required')
            })
        )
        .optional(),
    owners: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().min(4, 'too short').required('Required'),
                email: Yup.string().required('Required'),
                title: Yup.string().required('Required'),
            })
        )
        .optional(),
    documents: Yup.array().optional().nullable(),
});

const profilesValidator = { initialSingleProfile, SingleProfileSchema };
export default profilesValidator;
