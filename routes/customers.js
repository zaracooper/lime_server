import { Router } from 'express';
import { CreateCustomer, GetCustomer } from '../controllers/customers.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateCustomer));
router.get('/:id', asyncWrapper(GetCustomer));

export default router;