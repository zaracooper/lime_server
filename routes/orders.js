import { Router } from 'express';
import { GetOrder } from '../controllers/orders.js';

import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.get('/:id', asyncWrapper(GetOrder));

export default router;
