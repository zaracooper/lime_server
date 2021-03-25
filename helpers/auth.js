function checkAccessToken(req, res, next) {
    if (req.session.clientToken || req.session.customerToken) {
        next();
    } else {
        res.status(401).send({ message: 'Authentication required to access this route.' });
    }
}

function checkCustomerToken(req, res, next) {
    if (req.session.customerToken) {
        next();
    } else {
        res.status(401).send({ message: 'Login required to access this route.' });
    }
}

export { checkAccessToken, checkCustomerToken };