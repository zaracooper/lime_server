import axios from 'axios';
import { initCLayer } from '@commercelayer/js-sdk';
import { commerceLayer } from '../config/index.js';
import { isTokenCurrent, GrantTypes } from '../helpers/token.js';

function makeAuthRequest(grantType, request, response, next) {
    let data = {
        'grant_type': grantType,
        'client_id': commerceLayer.clientId,
        'scope': commerceLayer.euScope
    };

    switch (grantType) {
        case GrantTypes.ClientCredentials:
            break;
        case GrantTypes.Password:
            data['username'] = request.body.username;
            data['password'] = request.body.password;
            break;
        default:
            return next({ message: 'Grant type is not valid.' });
    }

    const setTokenConfig = (token) => {
        initCLayer({
            accessToken: token.access_token,
            endpoint: commerceLayer.domain
        });
        return {...token, last_saved: Date.now() };
    };

    axios({
        method: 'post',
        baseURL: commerceLayer.domain,
        url: '/oauth/token',
        data: data,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        switch (grantType) {
            case GrantTypes.ClientCredentials:
                request.session.clientToken = setTokenConfig(res.data);
                break;
            case GrantTypes.Password:
                request.session.customerToken = setTokenConfig(res.data);
                break;
        }

        response.send({ message: 'Token successfully acquired' });
    }).catch((err) => {
        const failureMessage = 'Failed to get access token';

        if (err.response) {
            return next({
                status: err.response.status,
                data: err.response.data,
                message: failureMessage
            });
        } else {
            if (err.response) {
                return next({
                    status: err.response.status,
                    data: err.response.data,
                    message: failureMessage
                });
            } else {
                return next({ error: err.message, message: failureMessage });
            }
        }
    });
}

function GetToken(req, res, next) {
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
}

export { GetToken };