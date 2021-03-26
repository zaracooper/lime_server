import { Router } from 'express';
import { CreateOrder, GetOrder } from '../controllers/orders.js';

import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateOrder));
router.get('/:id', asyncWrapper(GetOrder));

export default router;
