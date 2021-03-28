import { Router } from 'express';

import { GrantTypes, isTokenCurrent } from '../helpers/token.js';
import { makeAuthRequest } from '../helpers/request.js';

var router = Router();

router.get('/destroy', (req, res, next) => {
    req.session.destroy();

    res.status(200).send({ message: 'Successfully logged out' });
});

router.post('/token', (req, res, next) => {
    const grantType = req.body.grantType;

    const checkToken = (token) => {
        if (isTokenCurrent(token)) {
            res.send({ message: 'Issued access token is still valid' }).status(304);
        } else {
            makeAuthRequest(grantType, req, res, next);
        }
    }

    switch (grantType) {
        case GrantTypes.Password:
            checkToken(req.session.customerToken);
            break;
        case GrantTypes.ClientCredentials:
            checkToken(req.session.clientToken);
            break;
        default:
            makeAuthRequest(grantType, req, res, next);
    }
});

export default router;