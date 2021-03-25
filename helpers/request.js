import axios from 'axios';
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
                request.session.clientToken = { ...res.data, last_saved: Date.now() };
            case GrantTypes.Password:
                request.session.customerToken = { ...res.data, last_saved: Date.now() };
        }

        response.status(200).send({ message: 'Token successfully acquired' });
    }).catch((err) => {
        processErrorResponse(err, response, 'Failed to get access token');
    });
}

export { makeAuthRequest };