import { Router } from 'express';
import { GetShipment, UpdateShipment } from '../controllers/shipments.js';
import { asyncWrapper } from '../helpers/request.js';

var router = Router();

router.get('/', asyncWrapper(GetShipment));
router.patch('/', asyncWrapper(UpdateShipment));

export default router;
