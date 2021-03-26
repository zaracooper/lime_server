import { Router } from 'express';
import { CreateLineItem, GetLineItem, UpdateLineItem } from '../controllers/line_items.js';

import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateLineItem));
router.get('/:id', asyncWrapper(GetLineItem));
router.patch('/:id', asyncWrapper(UpdateLineItem));

export default router;
