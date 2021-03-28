import { Router } from 'express';

import addressRouter from './addresses.js';
import customerAddressRouter from './customer_addresses.js';
import lineItemsRouter from './line_items.js';
import ordersRouter from './orders.js';
import skusRouter from './skus.js';

var router = Router();

router.use('/addresses', addressRouter);
router.use('/customer_addresses', customerAddressRouter);
router.use('/line_items', lineItemsRouter);
router.use('/orders', ordersRouter);
router.use('/skus', skusRouter);

export default router;