import axios from 'axios';
import { initCLayer } from '@commercelayer/js-sdk';
import { commerceLayer } from '../config/index.js';
import { GrantTypes } from './token.js';

function makeAuthRequest(grantType, request, response) {
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
            response.status(500).send({ message: 'Grant type is not valid.' });
            return;
    }

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
        processErrorResponse(err, response, 'Failed to get access token');
    });
}

function setTokenConfig(token) {
    initCLayer({
        accessToken: token.access_token,
        endpoint: commerceLayer.domain
    });
    return { ...token, last_saved: Date.now() };
}

function processErrorResponse(err, response, failureMessage) {
    if (err.response) {
        response.status(err.response.status).send({ error: err.response.data, message: failureMessage });
    } else {
        response.status(500).send({ error: err.message, message: failureMessage });
    }
}

function asyncWrapper(controller) {
    return (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);
}

export { asyncWrapper, makeAuthRequest };