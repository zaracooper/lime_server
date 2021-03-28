import { Router } from 'express';
import { CreateAddress, GetAddress } from '../controllers/addresses.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateAddress));
router.get('/:id', asyncWrapper(GetAddress));

export default router;
