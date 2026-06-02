//This is a wrapper function which we gonna use everywhere in code
const asyncHandler = (fn) => async (req, res, next) => { //Higer Order Function
    try {
        await fn(req, res, next)
    } catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}

export { asyncHandler }