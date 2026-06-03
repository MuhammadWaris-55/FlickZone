//Another way of making wrapper Function
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