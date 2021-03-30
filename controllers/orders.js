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
    } else if (req.query.forPaymentMethods == 'true') {
        order = await Order.includes('available_payment_methods')
            .find(req.params.id);

        res.send({
            ...order.attributes(),
            availablePaymentMethods: order.availablePaymentMethods().toArray().map(apm => apm.attributes())
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

            await order.update({ billingAddress: address });

            order = await Order.includes('billingAddress').find(req.params.id);

            res.send({
                ...order.attributes(),
                billingAddress: order.billingAddress().attributes()
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

            await order.update({ shippingAddress: address });

            order = await Order.includes('shippingAddress').find(req.params.id);

            res.send({
                ...order.attributes(),
                shippingAddress: order.shippingAddress().attributes()
            });
            break;

        case 'paymentMethod':
            const paymentMethod = await PaymentMethod.find(req.body.paymentMethodId);

            order = await order.update({ paymentMethod: paymentMethod });

            res.send({
                ...order.attributes(),
                paymentMethod: order.paymentMethod().attributes()
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
            order = await order.update({ _place: req.body.place });

            res.send(order.attributes());
            break;

        default:
            next({ message: 'Cannot update specified field' });
    }
}

async function GetOrderShipments(req, res, next) {
    const order = await Order.includes('shipments')
        .select({
            shipments: ['available_shipping_methods', 'stock_location']
        })
        .find(req.params.id);

    res.send(order.shipments().toArray().map(shipment => {
        return {
            ...shipment.attributes(),
            availablePaymentMethods: shipment.availableShippingMethods().toArray().map(method => method.attributes()),
            stockLocation: shipment.stockLocation().attributes()
        }
    }));
}

export { CreateOrder, GetOrder, GetOrderShipments, UpdateOrder };