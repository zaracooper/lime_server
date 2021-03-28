import { Router } from 'express';
import { CreateCustomerAddress, GetCustomerAddresses } from '../controllers/customer_addresses.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.post('/', asyncWrapper(CreateCustomerAddress));
router.get('/', asyncWrapper(GetCustomerAddresses));

export default router;
