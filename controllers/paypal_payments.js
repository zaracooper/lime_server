import { Order, PaypalPayment } from '@commercelayer/js-sdk';
import { client } from '../config/index.js';

async function CreatePaypalPayment(req, res, next) {
    const orderId = req.body.orderId;

    const order = await Order.find(req.body.orderId);

    const payment = await PaypalPayment.create({
        order: order,
        return_url: `${client.domain}/order/${req.body.orderId}/checkout/paypal`,
        cancel_url: `${client.domain}/order/${req.body.orderId}/cancel`
    });

    res.send(payment.attributes());
}

async function GetPaypalPayment(req, res, next) {
    const payment = await PaypalPayment.find(req.params.id);

    res.send(payment.attributes());
}

async function UpdatePaypalPayment(req, res, next) {
    let payment = await PaypalPayment.find(req.params.id);

    payment = await payment.update({
        paypalPayerId: req.body.paypalPayerId
    });

    res.send(payment.attributes());
}

export { CreatePaypalPayment, GetPaypalPayment, UpdatePaypalPayment };