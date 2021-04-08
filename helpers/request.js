function asyncWrapper(controller) {
    return (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);
}

export { asyncWrapper };