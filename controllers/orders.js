import { Address, Order, PaymentMethod } from '@commercelayer/js-sdk';
import { processError } from '../helpers/error.js';

async function CreateOrder(req, res, next) {
    await Order.create({}, processError(res, next));
}

async function GetOrder(req, res, next) {
    let order;

    if (req.query.forCart == 'true') {
        order = await Order.includes('line_items')
            .select(
                'number', 'skusCount', 'formattedSubtotalAmount', 'formattedDiscountAmount', 'formattedShippingAmount', 'formattedTotalTaxAmount', 'formattedGiftCardAmount', 'formattedTotalAmountWithTaxes', 'lineItems', { lineItems: ['itemType', 'imageUrl', 'name', 'skuCode', 'formattedUnitAmount', 'quantity', 'formattedTotalAmount'] }
            )
            .find(req.params.id);

        res.send({
            ...order.attributes(),
            lineItems: order.lineItems().toArray().map(li => li.attributes())
        });
    } else if (req.query.withAvailablePaymentMethods == 'true') {
        order = await Order.includes('available_payment_methods')
            .find(req.params.id);

        res.send({
            ...order.attributes(),
            availablePaymentMethods: order.availablePaymentMethods().toArray().map(apm => apm.attributes())
        });
    } else if (req.query.withPaymentSource == 'true') {
        order = await Order.includes('payment_source')
            .find(req.params.id);

        res.send({
            ...order.attributes(),
            paymentSource: order.paymentSource().attributes()
        });
    } else if (req.query.withPaymentMethod == 'true') {
        order = await Order.includes('payment_method')
            .find(req.params.id);

        res.send({
            ...order.attributes(),
            paymentMethod: order.paymentMethod().attributes()
        });
    } else {
        order = await Order.find(req.params.id);

        res.send(order.attributes());
    }
}

async function UpdateOrder(req, res, next) {
    let order = await Order.find(req.params.id);
    const fields = req.query.field;
    let updateAttrs = {};

    const populateUpdateAttrs = async(field) => {
        switch (field) {
            case 'billingAddress':
                updateAttrs.billingAddress = await Address.find(req.body.billingAddressId);
                break;

            case 'shippingAddress':
                updateAttrs.shippingAddress = await Address.find(req.body.shippingAddressId);
                break;

            case 'paymentMethod':
                updateAttrs.paymentMethod = await PaymentMethod.find(req.body.paymentMethodId);
                break;

            case 'customerEmail':
                updateAttrs.customerEmail = req.body.customerEmail;
                break;

            case 'billingAddressClone':
                updateAttrs._billingAddressCloneId = req.body.billingAddressCloneId;
                break;

            case 'shippingAddressSameAsBilling':
                updateAttrs._shippingAddressSameAsBilling = true;
                break;

            case 'shippingAddressClone':
                updateAttrs._shippingAddressCloneId = req.body.shippingAddressCloneId;
                break;

            case 'billingAddressSameAsShipping':
                updateAttrs._billingAddressSameAsShipping = true;
                break;

            case 'giftCardOrCouponCode':
                updateAttrs.giftCardOrCouponCode = req.body.giftCardOrCouponCode;
                break;

            case 'giftCardCode':
                updateAttrs.giftCardCode = req.body.giftCardCode;
                break;

            case 'couponCode':
                updateAttrs.couponCode = req.body.couponCode;
                break;

            case 'place':
                updateAttrs._place = true;
                break;
        }
    };

    if (Array.isArray(fields)) {
        for (const field of fields) {
            await populateUpdateAttrs(field);
        }
    } else {
        await populateUpdateAttrs(fields);
    }

    if (Object.keys(updateAttrs).length) {
        await order.update(updateAttrs, processError(res, next));
        return;
    } else {
        return next({ message: 'Cannot update specified field' });
    }
}

async function GetOrderShipments(req, res, next) {
    const order = await Order
        .includes('shipments', { shipments: ['available_shipping_methods', 'stock_location'] })
        .find(req.params.id);

    res.send(order.shipments().toArray().map(shipment => {
        return {
            ...shipment.attributes(),
            availableShippingMethods: shipment.availableShippingMethods().toArray().map(method => method.attributes()),
            stockLocation: shipment.stockLocation().attributes()
        }
    }));
}

export { CreateOrder, GetOrder, GetOrderShipments, UpdateOrder };