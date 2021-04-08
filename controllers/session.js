import { isTokenCurrent } from '../helpers/token.js';

function GetCustomerSession(req, res, next) {
    if (isTokenCurrent(req.session.customerToken)) {
        res.status(200).send({ message: 'Logged in' });
    } else {
        res.status(404).send({ message: 'Customer not found' });
    }
}

function DestroySession(req, res, next) {
    req.session.destroy((err) => {
        if (err) { next(err); }
    });

    res.status(200).send({ message: 'Session destroyed' });
}

export { GetCustomerSession, DestroySession };