import { Address } from '@commercelayer/js-sdk';

async function CreateAddress(req, res, next) {
    await Address.create({
        email: req.body.email,
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        line_1: req.body.line1,
        city: req.body.city,
        zip_code: req.body.zipCode,
        country_code: req.body.countryCode,
        phone: req.body.phone,
        state_code: req.body.stateCode || 'N/A'
    }, (address) => {
        const errors = address.errors();

        if (errors.empty()) {
            res.send(address.attributes());
        } else {
            next(errors.toArray());
        }
    });
}

async function GetAddress(req, res, next) {
    const address = await Address.find(req.params.id);

    res.send(address.attributes());
}

export { CreateAddress, GetAddress };