import { Router } from 'express';
import {
    createAnnouncement,
    deleteAnnouncement,
    getAllAnnouncements,
    getpermalinkFromTitle,
    singleAnnouncement,
    updateAnnouncement,
} from '../controllers/announcements.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
import validateRequest from '../middlewares/error.validation';
import { createAnnouncementSchema, updateAnnouncementSchema } from '../validators/announcement.validator';
const router = Router();

router.patch('/update', updateAnnouncementSchema, validateRequest, verifyToken, updateAnnouncement);
router.post('/create', createAnnouncementSchema, validateRequest, verifyToken, createAnnouncement);
router.post('/get-permalink', getpermalinkFromTitle);
router.get('/', getAllAnnouncements);
router.get('/:id', singleAnnouncement);
router.delete('/:id', verifyToken, deleteAnnouncement);

export default router;
