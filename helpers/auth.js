import { initCLayer } from '@commercelayer/js-sdk';
import { commerceLayer } from '../config/index.js';

function checkAccessToken(req, res, next) {
    if (req.session.customerToken) {
        initCLayer({
            accessToken: req.session.customerToken.access_token,
            endpoint: commerceLayer.domain
        });
        next();
    }
    else if (req.session.clientToken) {
        initCLayer({
            accessToken: req.session.clientToken.access_token,
            endpoint: commerceLayer.domain
        });
        next();
    } else {
        res.status(401).send({ message: 'Authentication required to access this route.' });
    }
}

function checkCustomerToken(req, res, next) {
    if (req.session.customerToken) {
        next();
    } else {
        res.status(401).send({ message: 'Login required to access this route.' });
    }
}

export { checkAccessToken, checkCustomerToken };