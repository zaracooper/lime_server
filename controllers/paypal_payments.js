import { Order, PaypalPayment } from '@commercelayer/js-sdk';

async function CreatePaypalPayment(req, res, next) {
    const order = await Order.find(req.body.orderId);

    const payment = await PaypalPayment.create({
        order: order,
        returnUrl: req.body.returnUrl,
        cancelUrl: req.body.cancelUrl
    });

    res.send(payment.attributes());
}

export { CreatePaypalPayment };