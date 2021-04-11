import { Router } from 'express';
import { CreateCustomerAddress, GetCustomerAddress, GetCustomerAddresses } from '../controllers/customer_addresses.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateCustomerAddress));
router.get('/', asyncWrapper(GetCustomerAddresses));
router.get('/:id', asyncWrapper(GetCustomerAddress));

export default router;