import { Router } from 'express';
import { DestroySession, GetCustomerSession } from '../controllers/session.js';

var router = Router();

router.get('/customer/status', GetCustomerSession);
router.get('/destroy', DestroySession);

export default router;