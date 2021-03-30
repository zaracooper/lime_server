import { DeliveryLeadTime } from '@commercelayer/js-sdk';

async function GetDeliveryLeadTimes(req, res, next) {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 20;

    const deliveryTimes = await DeliveryLeadTime.includes('shipping_method', 'stock_location')
        .perPage(pageSize).page(page).all();

    res.send(deliveryTimes.toArray().map(dt => {
        return {
            ...dt.attributes(),
            shippingMethod: dt.shippingMethod().attributes(),
            stockLocation: dt.stockLocation().attributes()
        };
    }));
}

export { GetDeliveryLeadTimes };