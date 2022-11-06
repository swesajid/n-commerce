import { Router } from 'express';
import {
    createCategorie,
    deleteCategorie,
    getAllCategories,
    singleCategorie,
    updateCategorie,
} from '../controllers/categories.controller';
import { verifyToken } from '../middlewares/access-control.middleware';
import validateRequest from '../middlewares/error.validation';
import { createCategorieSchema, updateCategorieSchema } from '../validators/categorie.validator';
const router = Router();

router.patch('/update', updateCategorieSchema,validateRequest,verifyToken,updateCategorie);
router.post('/create', createCategorieSchema, validateRequest,verifyToken,createCategorie);
router.get('/', getAllCategories);
router.get('/:id', singleCategorie);
router.delete('/:id',verifyToken,deleteCategorie);

export default router;