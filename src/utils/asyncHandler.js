
// accept as a function and return as a function
const asyncHandler =  (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
            catch((err) => next(err));
    }
}

export { asyncHandler }