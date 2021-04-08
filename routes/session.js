import { Router } from 'express';
import { isTokenCurrent } from '../helpers/token.js';

var router = Router();

router.get('/customer', (req, res, next) => {
    if (isTokenCurrent(req.session.customerToken)) {
        res.status(200).send({ message: 'Logged in' });
    } else {
        res.status(404).send({ message: 'Customer not found' });
    }
});

export default router;