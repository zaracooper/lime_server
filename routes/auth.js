import { Router } from 'express';

import { GetToken } from '../controllers/auth.js';

var router = Router();

router.post('/token', GetToken);

export default router;