import { Router } from 'express';
import ordersRouter from './orders.js';

var router = Router();

router.use('/orders', ordersRouter);

export default router;