import { Router } from 'express';
import { CreateAddress } from '../controllers/addresses.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateAddress));

export default router;
