import { Router } from 'express';
import { CreateOrder, GetOrder, UpdateOrder } from '../controllers/orders.js';

import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateOrder));
router.get('/:id', asyncWrapper(GetOrder));
router.patch('/:id', asyncWrapper(UpdateOrder));

export default router;
