function processError(res, next) {
    return (item) => {
        if (typeof item['errors'] == 'function') {
            const errors = item.errors();

            if (errors.empty()) {
                res.send(item.attributes());
            } else {
                return next(errors.toArray());
            }
        } else {
            return next(item);
        }
    }
}

export { processError };