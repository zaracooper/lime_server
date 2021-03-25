import dayjs from 'dayjs';

export default class AccessToken {
    value;
    type;
    expiresIn;
    scope;
    createdAt;
    lastSaved;

    constructor(contents) {
        this.value = contents.access_token;
        this.type = contents.token_type;
        this.expiresIn = contents.expires_in;
        this.scope = contents.scope;
        this.createdAt = contents.created_at;
        this.lastSaved = contents.last_saved;
    }

    isValid() {
        return dayjs(this.lastSaved).add(this.expiresIn, 's').isAfter(dayjs());
    }
}

const GrantTypes = {
    ClientCredentials: 'client_credentials',
    Password: 'password',
    RefreshToken: 'refresh_token',
    AuthorizationCOde: 'authorization_code'
};

function isTokenCurrent(token) {
    if (token) {
        return (new AccessToken(token)).isValid();
    }

    return false;
}

export { isTokenCurrent, GrantTypes };