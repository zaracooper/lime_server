import { Router } from 'express';
import ordersRouter from './orders.js';
import skusRouter from './skus.js';

var router = Router();

router.use('/orders', ordersRouter);
router.use('/skus', skusRouter);

export default router;