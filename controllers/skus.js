import { Sku } from '@commercelayer/js-sdk';

async function GetSkus(req, res, next) {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 20;

    const skus = await Sku.where({ stockItemsQuantityGt: 0 }).perPage(pageSize).page(page).includes('prices').all();

    res.send(skus.toArray().map(sku => {
        return {
            ...sku.attributes(),
            prices: sku.prices().toArray().map(price => price.attributes())
        };
    }));
}

async function GetSku(req, res, next) {
    const sku = await Sku.includes('prices').find(req.params.id);

    res.send({
        ...sku.attributes(),
        prices: sku.prices().toArray().map(price => price.attributes())
    });
}

export { GetSku, GetSkus };