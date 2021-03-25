import { Order } from '@commercelayer/js-sdk';


async function GetOrder(req, res, next) {
    const order = await Order.find(req.params.id);
    res.send(order.__fields);
}

export { GetOrder };