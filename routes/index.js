import { Router } from 'express';

import addressRouter from './addresses.js';
import customerAddressRouter from './customer_addresses.js';
import customersRouter from './customers.js';
import deliveryLeadTimesRouter from './delivery_lead_times.js';
import lineItemsRouter from './line_items.js';
import ordersRouter from './orders.js';
import paypalPaymentsRouter from './paypal_payments.js';
import shipmentsRouter from './shipments.js';
import skusRouter from './skus.js';

var router = Router();

router.use('/addresses', addressRouter);
router.use('/customer_addresses', customerAddressRouter);
router.use('/customers', customersRouter);
router.use('/delivery_lead_times', deliveryLeadTimesRouter);
router.use('/line_items', lineItemsRouter);
router.use('/orders', ordersRouter);
router.use('/paypal_payments', paypalPaymentsRouter);
router.use('/shipments', shipmentsRouter);
router.use('/skus', skusRouter);

export default router;