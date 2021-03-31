import axios from 'axios';
import qs from 'qs';
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

        response.send({ message: 'Token successfully acquired' });
    }).catch((err) => {
        const failureMessage = 'Failed to get access token';

        if (err.response) {
            next({
                status: err.response.status,
                data: err.response.data,
                message: failureMessage
            });
        } else {
            processErrorResponse(err, failureMessage, next)
        }
    });
}

function makeBodilessAPIRequest(method, path, params, request, response, failureMessage, next) {
    const token = request.session.customerToken || request.session.clientToken;

    axios({
        method: method,
        baseURL: commerceLayer.domain,
        url: path,
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'comma' })
        },
        headers: {
            'Accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${token.access_token}`
        }
    }).then((res) => {
        response.status(200).send(res.data.data);
    }).catch((err) => {
        processErrorResponse(err, failureMessage, next);
    });
}

function makeAPIRequestWithBody(method, path, params, body, additionalHeaders, request, response, failureMessage, next) {
    const token = request.session.customerToken || request.session.clientToken;

    axios({
        method: method,
        baseURL: commerceLayer.domain,
        url: path,
        headers: {
            'Accept': 'application/vnd.api+json',
            'Authorization': `Bearer ${token.access_token}`,
            ...additionalHeaders
        },
        params: params,
        paramsSerializer: function (params) {
            return qs.stringify(params, { arrayFormat: 'comma' })
        },
        data: body
    }).then((res) => {
        response.send(res.data.data);
    }).catch((err) => {
        processErrorResponse(err, failureMessage, next);
    });
}

function processErrorResponse(err, failureMessage, next) {
    if (err.response) {
        next({
            status: err.response.status,
            data: err.response.data,
            message: failureMessage
        });
    } else {
        next({ error: err.message, message: failureMessage });
    }
}

function asyncWrapper(controller) {
    return (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);
}

export { asyncWrapper, makeAPIRequestWithBody, makeAuthRequest, makeBodilessAPIRequest };