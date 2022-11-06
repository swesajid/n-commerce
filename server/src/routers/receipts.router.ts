import { Router } from 'express';
import {
    createReceipt,
    deleteReceipt,
    getAllReceipts,
    singleReceipt,
    updateReceipt,
} from '../controllers/receipts.controller';
const router = Router();

router.post('/create', createReceipt);
router.patch('/update', updateReceipt);
router.get('/', getAllReceipts);
router.get('/:id', singleReceipt);
router.delete('/:id',deleteReceipt);

export default router;
