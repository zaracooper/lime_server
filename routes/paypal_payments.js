import { Router } from 'express';
import { CreatePaypalPayment, UpdatePaypalPayment } from '../controllers/paypal_payments.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreatePaypalPayment));
router.patch('/:id', asyncWrapper(UpdatePaypalPayment));

export default router;
