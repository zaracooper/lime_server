import { Shipment, ShippingMethod } from '@commercelayer/js-sdk';

async function GetShipment(req, res, next) {
    const shipment = await Shipment.includes('shipping_method', 'delivery_lead_time').find(req.params.id);

    res.send({
        ...shipment.attributes(),
        shippingMethod: shipment.shippingMethod().attributes(),
        deliveryLeadTime: shipment.deliveryLeadTime().attributes()
    });
}

async function UpdateShipment(req, res, next) {
    const shippingMethod = await ShippingMethod.find(req.body.shippingMethodId);

    let shipment = await Shipment.find(req.params.id);

    await shipment.update({
        shippingMethod: shippingMethod
    }, (shipment) => {
        const errors = shipment.errors();

        if (errors.empty()) {
            res.send(shipment.attributes());
        } else {
            next(errors.toArray());
        }
    });
}

export { GetShipment, UpdateShipment };