import { LineItem, Order, Sku } from '@commercelayer/js-sdk';

async function GetLineItem(req, res, next) {
    const lineItem = await LineItem.find(req.params.id);
    res.send(lineItem.attributes());
}

async function CreateLineItem(req, res, next) {
    const order = await Order.find(req.body.orderId);

    let params = {
        quantity: req.body.quantity,
        name: req.body.name,
        imageUrl: req.body.imageUrl,
        _updateQuantity: true,
        order: order
    };

    if (req.body.skuCode) {
        params.skuCode = req.body.skuCode;
    } else {
        next({ message: 'Specify sku code.' });
    }

    await LineItem.create(params, (lineItem) => {
        const errors = lineItem.errors();

        if (errors.empty()) {
            res.send(lineItem.attributes());
        } else {
            next(errors.toArray());
        }
    });
}

async function UpdateLineItem(req, res, next) {
    const lineItem = await LineItem.find(req.params.id);

    await lineItem.update({ quantity: req.body.quantity }, (lineItem) => {
        const errors = lineItem.errors();

        if (errors.empty()) {
            res.send(lineItem.attributes());
        } else {
            next(errors.toArray());
        }
    });
}

async function DeleteLineItem(req, res, next) {
    const lineItem = await LineItem.find(req.params.id);
    await lineItem.destroy();

    res.send({ message: 'Successfully deleted line item' });
}

export { CreateLineItem, DeleteLineItem, GetLineItem, UpdateLineItem };