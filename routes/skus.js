import { Router } from 'express';
import { GetSku, GetSkus } from '../controllers/skus.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.get('/', asyncWrapper(GetSkus));
router.get('/:id', asyncWrapper(GetSku));

export default router;
