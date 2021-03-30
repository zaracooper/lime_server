import { Router } from 'express';
import { GetDeliveryLeadTimes } from '../controllers/delivery_lead_times.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.get('/', asyncWrapper(GetDeliveryLeadTimes));

export default router;
