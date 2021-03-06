import { Shipment, ShippingMethod } from '@commercelayer/js-sdk';
import { processError } from '../helpers/error.js';

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
    }, processError(res, next));
}

export { GetShipment, UpdateShipment };