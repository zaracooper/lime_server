import { Order, PaypalPayment } from '@commercelayer/js-sdk';
import { client } from '../config/index.js';

async function CreatePaypalPayment(req, res, next) {
    const orderId = req.body.orderId;

    const order = await Order.find(req.body.orderId);

    await PaypalPayment.create({
        order: order,
        return_url: `${client.domain}/order/${req.body.orderId}/checkout/paypal`,
        cancel_url: `${client.domain}/order/${req.body.orderId}/cancel`
    }, (payment) => {
        const errors = payment.errors();

        if (errors.empty()) {
            res.send(payment.attributes());
        } else {
            next(errors.toArray());
        }
    });
}

async function GetPaypalPayment(req, res, next) {
    const payment = await PaypalPayment.find(req.params.id);

    res.send(payment.attributes());
}

async function UpdatePaypalPayment(req, res, next) {
    let payment = await PaypalPayment.find(req.params.id);

    await payment.update({
        paypalPayerId: req.body.paypalPayerId
    }), (payment) => {
        const errors = payment.errors();

        if (errors.empty()) {
            res.send(payment.attributes());
        } else {
            next(errors.toArray());
        }
    };
}

export { CreatePaypalPayment, GetPaypalPayment, UpdatePaypalPayment };