import axios from 'axios';
import { initCLayer } from '@commercelayer/js-sdk';
import { commerceLayer } from '../config/index.js';
import { GrantTypes } from './token.js';

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
            next({ message: 'Grant type is not valid.' });
            return;
    }

    const setTokenConfig = (token) => {
        initCLayer({
            accessToken: token.access_token,
            endpoint: commerceLayer.domain
        });
        return { ...token, last_saved: Date.now() };
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
            case GrantTypes.Password:
                request.session.customerToken = setTokenConfig(res.data);;
        }

        response.status(200).send({ message: 'Token successfully acquired' });
    }).catch((err) => {
        const failureMessage = 'Failed to get access token';

        if (err.response) {
            next({
                status: err.response.status,
                data: err.response.data,
                message: failureMessage
            });
        } else {
            next({ error: err.message, message: failureMessage });
        }
    });
}

function asyncWrapper(controller) {
    return (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);
}

export { asyncWrapper, makeAuthRequest };