import { Router } from 'express';
import { CreateCustomer, GetCurrentCustomer, GetCustomer } from '../controllers/customers.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateCustomer));
router.get('/current', asyncWrapper(GetCurrentCustomer));
router.get('/:id', asyncWrapper(GetCustomer));

export default router;