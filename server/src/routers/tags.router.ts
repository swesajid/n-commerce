import { Router } from 'express';
import {
    createTag,
    deleteTag,
    getAllTags,
    singleTag,
    updateTag,
} from '../controllers/tags.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
import validateRequest from '../middlewares/error.validation';
import { createTagSchema, updateTagSchema } from '../validators/tag.validator';
const router = Router();

router.patch('/update', updateTagSchema, validateRequest, verifyToken, updateTag);
router.post('/create', createTagSchema, validateRequest, verifyToken, createTag);
router.get('/', getAllTags);
router.get('/:id', singleTag);
router.delete('/:id', verifyToken, deleteTag);

export default router;
