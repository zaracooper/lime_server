import { Address, Order } from '@commercelayer/js-sdk';

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

        case 'shippingAddress':
            address = await Address.find(req.body.shippingAddressId);

            await order.update({ shippingAddress: address });

            order = await Order.includes('shippingAddress').find(req.params.id);

            res.send({
                ...order.attributes(),
                shippingAddress: order.shippingAddress().attributes()
            });
            break;

        default:
            next({ message: 'Can only update customer email, billing address, and shipping address' });
    }
}

export { CreateOrder, GetOrder, UpdateOrder };