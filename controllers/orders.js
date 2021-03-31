import { Address, Order, PaymentMethod } from '@commercelayer/js-sdk';

async function CreateOrder(req, res, next) {
    const order = await Order.create({}, (order) => {
        const errors = order.errors();

        if (errors.empty()) {
            res.send(order.attributes());
        } else {
            next(errors.toArray());
        }
    });
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

    const makeUpdate = async (attr) => {
        await order.update(attr, (order) => {
            const errors = order.errors();

            if (errors.empty()) {
                res.send(order.attributes());
            } else {
                next(errors.toArray());
            }
        });
    };

    switch (req.query.field) {
        case 'customerEmail':
            await makeUpdate({ customerEmail: req.body.customerEmail });
            break;

        case 'billingAddress':
            address = await Address.find(req.body.billingAddressId);

            await makeUpdate({ billingAddress: address });
            break;

        case 'billingAddressClone':
            await makeUpdate({ _billingAddressCloneId: req.body.billingAddressCloneId });
            break;

        case 'shippingAddressSameAsBilling':
            await makeUpdate({ _shippingAddressSameAsBilling: true });
            break;

        case 'shippingAddressClone':
            await makeUpdate({ _shippingAddressCloneId: req.body.shippingAddressCloneId });
            break;

        case 'billingAddressSameAsShipping':
            await makeUpdate({ _billingAddressSameAsShipping: true });
            break;

        case 'shippingAddress':
            address = await Address.find(req.body.shippingAddressId);

            await makeUpdate({ shippingAddress: address });
            break;

        case 'paymentMethod':
            const paymentMethod = await PaymentMethod.find(req.body.paymentMethodId);

            await makeUpdate({ paymentMethod: paymentMethod });
            break;

        case 'giftCardOrCouponCode':
            await makeUpdate({ giftCardOrCouponCode: req.body.giftCardOrCouponCode });
            break;

        case 'giftCardCode':
            await makeUpdate({ giftCardCode: req.body.giftCardCode });
            break;

        case 'couponCode':
            await makeUpdate({ couponCode: req.body.couponCode });
            break;

        case 'place':
            await makeUpdate({ _place: true });
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