import { LineItem, Order } from '@commercelayer/js-sdk';

async function GetLineItem(req, res, next) {
    const lineItem = await LineItem.find(req.params.id);
    res.send(lineItem.attributes());
}

async function CreateLineItem(req, res, next) {
    const order = await Order.find(req.body.orderId);

    const lineItem = await LineItem.create({
        quantity: req.body.quantity,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        _updateQuantity: true,
        order: order,
        itemId: req.body.skuId,
        skuCode: req.body.skuCode
    });

    res.send(lineItem.attributes());
}

async function UpdateLineItem(req, res, next) {
    const lineItem = await LineItem.find(req.params.id);
    await lineItem.update({ quantity: req.body.quantity });

    res.send(lineItem.attributes());
}

async function DeleteLineItem(req, res, next) {
    const lineItem = await LineItem.find(req.params.id);
    await lineItem.destroy();

    res.send({ message: 'Successfully deleted line item' });
}

export { CreateLineItem, DeleteLineItem, GetLineItem, UpdateLineItem };