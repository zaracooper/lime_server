import { Customer } from '@commercelayer/js-sdk';

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

export { CreateCustomer, GetCustomer };