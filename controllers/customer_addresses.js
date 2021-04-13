import { Address, Customer, CustomerAddress } from '@commercelayer/js-sdk';
import { processError } from '../helpers/error.js';
import { isTokenCurrent } from '../helpers/token.js';

async function CreateCustomerAddress(req, res, next) {
    const customerToken = req.session.customerToken;
    let customerId;

    if (isTokenCurrent(customerToken)) {
        customerId = customerToken.owner_id;
    } else {
        customerId = req.body.customerId;
    }

    const customer = await Customer.find(customerId);
    const address = await Address.find(req.body.addressId);

    await CustomerAddress.create({ customer: customer, address: address },
        processError(res, next));
}

async function GetCustomerAddresses(req, res, next) {
    const customerAddresses = await CustomerAddress.includes('address').all();

    res.send(customerAddresses.toArray().map(ca => {
        return {
            ...ca.attributes(),
            address: ca.address().attributes()
        }
    }));
}

async function GetCustomerAddress(req, res, next) {
    const customerAddresses = await CustomerAddress.includes('address').find(req.params.id);

    res.send({
        ...customerAddresses.attributes(),
        address: customerAddresses.address().attributes()
    });
}

export { CreateCustomerAddress, GetCustomerAddresses, GetCustomerAddress };