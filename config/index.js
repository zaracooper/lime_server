import dotenv from 'dotenv';

if (process.env.NODE_ENV == 'development') {
    dotenv.config();
}

const client = {
    domain: process.env.CLIENT_DOMAIN
};

const commerceLayer = {
    domain: process.env.COMMERCE_LAYER_DOMAIN,
    clientId: process.env.COMMERCE_LAYER_CLIENT_ID,
    euScope: process.env.COMMERCE_LAYER_EUROPE_SCOPE,
    usScope: process.env.COMMERCE_LAYER_USA_SCOPE,
    euWHScope: process.env.COMMERCE_LAYER_EU_WAREHOUSE_SCOPE,
    usWHScope: process.env.COMMERCE_LAYER_US_WAREHOUSE_SCOPE
};

const sessionDB = {
    host: process.env.SESSION_DB_HOST,
    user: process.env.SESSION_DB_USER,
    pass: process.env.SESSION_DB_PASS,
    port: process.env.SESSION_DB_PORT,
    name: process.env.SESSION_DB_NAME,
    secret: process.env.SESSION_DB_SECRET
};

export { client, commerceLayer, sessionDB };