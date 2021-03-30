import { Shipment, ShippingMethod } from '@commercelayer/js-sdk';

async function GetShipment(req, res, next) {
    const shipment = await Shipment.find(req.params.id);

    res.send(shipment.attributes());
}

async function UpdateShipment(req, res, next) {
    const shippingMethod = await ShippingMethod.find(req.body.shippingMethodId);

    const shipment = await Shipment.find(req.params.id);

    shipment = await shipment.update({
        shippingMethod: shippingMethod
    });

    res.send(shipment.attributes());
}

export { GetShipment, UpdateShipment };