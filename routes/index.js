import { Router } from 'express';
import lineItemsRouter from './line_items.js';
import ordersRouter from './orders.js';
import skusRouter from './skus.js';

var router = Router();

router.use('/line_items', lineItemsRouter);
router.use('/orders', ordersRouter);
router.use('/skus', skusRouter);

export default router;