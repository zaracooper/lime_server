import { Address, Order, PaymentMethod } from '@commercelayer/js-sdk';

async function CreateOrder(req, res, next) {
    const order = await Order.create();

    res.send(order.attributes());
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
    let address;

    switch (req.query.field) {
        case 'customerEmail':
            await order.update({ customerEmail: req.body.customerEmail });

            order = await Order.includes('customer').find(req.params.id);

            res.send({
                ...order.attributes(),
                customer: order.customer().attributes()
            });
            break;

        case 'billingAddress':
            address = await Address.find(req.body.billingAddressId);

            order = await order.update({ billingAddress: address });

            res.send({
                ...order.attributes(),
                billingAddress: address.attributes()
            });
            break;

        case 'billingAddressClone':
            order = await order.update({ _billingAddressCloneId: req.body.billingAddressCloneId });

            res.send(order.attributes());
            break;

        case 'shippingAddressSameAsBilling':
            order = await order.update({ _shippingAddressSameAsBilling: true });

            res.send(order.attributes());
            break;

        case 'shippingAddressClone':
            order = await order.update({ _shippingAddressCloneId: req.body.shippingAddressCloneId });

            res.send(order.attributes());
            break;

        case 'billingAddressSameAsShipping':
            order = await order.update({ _billingAddressSameAsShipping: true });

            res.send(order.attributes());
            break;

        case 'shippingAddress':
            address = await Address.find(req.body.shippingAddressId);

            order = await order.update({ shippingAddress: address });

            res.send({
                ...order.attributes(),
                shippingAddress: address.attributes()
            });
            break;

        case 'paymentMethod':
            const paymentMethod = await PaymentMethod.find(req.body.paymentMethodId);

            order = await order.update({ paymentMethod: paymentMethod });

            res.send({
                ...order.attributes(),
                paymentMethod: paymentMethod.attributes()
            });
            break;

        case 'giftCardOrCouponCode':
            order = await order.update({ giftCardOrCouponCode: req.body.giftCardOrCouponCode });

            res.send(order.attributes());
            break;

        case 'giftCardCode':
            order = await order.update({ giftCardCode: req.body.giftCardCode });

            res.send(order.attributes());
            break;

        case 'couponCode':
            order = await order.update({ couponCode: req.body.couponCode });

            res.send(order.attributes());
            break;

        case 'place':
            order = await order.update({ _place: true }, (order) => {
                const errors = order.errors();
                if (errors.empty()) {
                    res.send(order.attributes());
                } else {
                    next(errors.toArray());
                }
            });

            break;

        default:
            next({ message: 'Cannot update specified field' });
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