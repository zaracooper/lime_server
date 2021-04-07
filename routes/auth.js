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

    if (grantType == GrantTypes.ClientCredentials) {
        if (isTokenCurrent(req.session.clientToken)) {
            res.send({ message: 'Issued access token is still valid' }).status(304);
        } else {
            makeAuthRequest(grantType, req, res, next);
        }
    } else {
        makeAuthRequest(grantType, req, res, next);
    }
});

export default router;