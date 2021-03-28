import { Address, Customer, CustomerAddress } from '@commercelayer/js-sdk';

async function CreateCustomerAddress(req, res, next) {
    const customer = await Customer.find(req.body.customerId);
    const address = await Address.find(req.body.addressId);

    const customerAddress = await CustomerAddress.create({
        customer: customer, address: address
    });

    res.send(customerAddress.attributes());
}

async function GetCustomerAddresses(req, res, next) {
    const customerAddresses = await CustomerAddress.all();

    res.send(customerAddresses.toArray().map(ca => ca.attributes()));
}

export { CreateCustomerAddress, GetCustomerAddresses };