import * as Yup from 'yup';

export interface iAnnouncement {
    name: string;
    description: string;
    publication_date: string;
    expiration_date: string;
    permalink: string;
    publish: boolean;
}

export const initialAnnouncement: iAnnouncement = {
    name: '',
    description: '',
    publication_date: '',
    expiration_date: '',
    permalink: '',
    publish: false,
};

export const createAnnouncementSchema = Yup.object().shape({
    name: Yup.string()
        .min(6, 'Minimum 6 characters are required')
        .max(250, 'Maximum 250 characters are allowed')
        .required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    publication_date: Yup.string().required('Required!'),
    expiration_date: Yup.string().required('Required!'),
    permalink: Yup.string().optional(),
    publish: Yup.boolean().required('Required!'),
});

export const updateAnnouncementSchema = Yup.object().shape({
    name: Yup.string()
        .min(6, 'Minimum 6 characters are required')
        .max(250, 'Maximum 250 characters are allowed')
        .required('Required!'),
    description: Yup.string().min(6, 'Minimum 6 characters are required').required('Required!'),
    publication_date: Yup.string().required('Required!'),
    expiration_date: Yup.string().required('Required!'),
    permalink: Yup.string().optional(),
    publish: Yup.boolean().optional(),
});

const announcementsValidator = { initialAnnouncement, createAnnouncementSchema, updateAnnouncementSchema };
export default announcementsValidator;
