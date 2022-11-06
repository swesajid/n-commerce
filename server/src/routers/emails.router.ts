import { Router } from 'express';
import {
    getEmailList,
    createEmail,
    getSingleEmail,
    updateEmail,
} from '../controllers/email.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
import validateRequest from '../middlewares/error.validation';
import { createEmailSchema, updateEmailSchema } from '../validators/email.validator'
const router = Router();

router.patch('/update', updateEmailSchema, validateRequest, verifyToken, updateEmail);
router.post('/create', createEmailSchema, validateRequest, verifyToken, createEmail);
router.get('/', getEmailList);
router.get('/:id', getSingleEmail);

export default router;
