import { Order } from '@commercelayer/js-sdk';

async function CreateOrder(req, res, next) {
    const order = await Order.create();
    res.send(order.attributes());
}

async function GetOrder(req, res, next) {
    if (req.query.forCart == 'true') {
        const order = await Order.includes('line_items')
            .select(
                'number', 'skusCount', 'formattedSubtotalAmount', 'formattedDiscountAmount', 'formattedShippingAmount', 'formattedTotalTaxAmount', 'formattedGiftCardAmount', 'formattedTotalAmountWithTaxes', 'lineItems', { lineItems: ['itemType', 'imageUrl', 'name', 'skuCode', 'formattedUnitAmount', 'quantity', 'formattedTotalAmount'] }
            )
            .find(req.params.id);

        res.send({
            ...order.attributes(),
            lineItems: order.lineItems().toArray().map(li => li.attributes())
        });
    } else {
        const order = await Order.find(req.params.id);

        res.send(order.attributes());
    }
}

async function UpdateOrder(req, res, next) {
    const order = await Order.find(req.params.id);
    await order.update({ customerEmail: req.body.customerEmail });

    res.send(order.attributes());
}

export { CreateOrder, GetOrder, UpdateOrder };