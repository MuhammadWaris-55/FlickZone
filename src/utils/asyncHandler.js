// The main purpose of creating a wrapper function is to avoid repeating the same error-handling code in every route.
//The wrapper function lets you write error-handling logic once and reuse it for all async routes, making your code cleaner, shorter, and easier to maintain.
//This is a wrapper function made with Promisses which we gonna use everywhere in code
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }







//This is a wrapper function made with async await which we gonna use everywhere in code
// const asyncHandler = (fn) => async (req, res, next) => { //Higer Order Function
//     try {
//         await fn(req, res, next)
//     } catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }