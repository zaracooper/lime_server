import { Customer } from '@commercelayer/js-sdk';
import { isTokenCurrent } from '../helpers/token.js';

async function CreateCustomer(req, res, next) {
    await Customer.create({
        email: req.body.email,
        password: req.body.password,
        metadata: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        }
    }, (customer) => {
        const errors = customer.errors();

        if (errors.empty()) {
            res.send(customer.attributes());
        } else {
            next(errors.toArray());
        }
    });
}

async function GetCustomer(req, res, next) {
    const customer = await Customer.find(req.params.id);

    res.send(customer.attributes());
}

async function GetCurrentCustomer(req, res, next) {
    const customerToken = req.session.customerToken;

    if (isTokenCurrent(customerToken)) {
        const customer = await Customer.find(customerToken.owner_id);

        res.send(customer.attributes());
    } else {
        res.status(404).send({ message: 'Customer not found' });
    }
}

export { CreateCustomer, GetCurrentCustomer, GetCustomer };