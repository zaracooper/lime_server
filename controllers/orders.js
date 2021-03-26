import { Order } from '@commercelayer/js-sdk';

async function GetOrder(req, res, next) {
    const order = await Order.find(req.params.id);
    res.send(order.attributes());
}

async function CreateOrder(req, res, next) {
    const order = await Order.create();
    res.send(order.attributes());
}

export { CreateOrder, GetOrder };