import { Router } from 'express';
import {
    createRate,
    deleteRate,
    getAllRates,
    singleRate,
    updateRate,
} from '../controllers/rates.controller';
//import { verifyToken } from '../middlewares/access-control.middleware';
//import validateRequest from '../middlewares/error.validation';
//import { createRateSchema,updateRateSchema } from '../validators/rate.validator';
const router = Router();

router.post('/create', createRate);
router.patch('/update', updateRate);
router.get('/', getAllRates);
router.get('/:id', singleRate);
router.delete('/:id',deleteRate);

export default router;
