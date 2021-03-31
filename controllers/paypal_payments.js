import { Order, PaypalPayment } from '@commercelayer/js-sdk';
import { client } from '../config/index.js';

async function CreatePaypalPayment(req, res, next) {
    const order = await Order.find(req.body.orderId);

    const payment = await PaypalPayment.create({
        order: order,
        returnUrl: `${client.domain}/order/${req.body.orderId}/checkout/paypal`,
        cancelUrl: `${client.domain}/order/${req.body.orderId}/cancel`
    });

    res.send(payment.attributes());
}

async function UpdatePaypalPayment(req, res, next) {
    const payment = await PaypalPayment.find(req.params.id);

    payment = await payment.update({
        paypalPayerId: req.body.paypalPayerId
    });

    res.send(payment.attributes());
}

export { CreatePaypalPayment, UpdatePaypalPayment };