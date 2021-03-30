import { Router } from 'express';
import { CreateOrder, GetOrder, GetOrderShipments, UpdateOrder } from '../controllers/orders.js';

import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateOrder));
router.get('/:id', asyncWrapper(GetOrder));
router.get('/:id/shipments', asyncWrapper(GetOrderShipments));
router.patch('/:id', asyncWrapper(UpdateOrder));

export default router;
