import { initCLayer } from '@commercelayer/js-sdk';
import { commerceLayer } from '../config/index.js';

function checkAccessToken(req, res, next) {
    if (req.session.customerToken) {
        initCLayer({
            accessToken: req.session.customerToken.access_token,
            endpoint: commerceLayer.domain
        });
        return next();
    } else if (req.session.clientToken) {
        initCLayer({
            accessToken: req.session.clientToken.access_token,
            endpoint: commerceLayer.domain
        });
        return next();
    } else {
        res.status(401).send({ message: 'Authentication required to access this route.' });
    }
}

export { checkAccessToken };